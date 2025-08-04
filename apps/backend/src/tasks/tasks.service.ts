import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { TaskJobData } from './task-processor.service';

interface CreateTaskDto {
  title: string;
  description?: string;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
}

interface PaginatedResult<T> {
  tasks: T[];
  total: number;
}

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('task-processing') private taskQueue: Queue<TaskJobData>,
  ) {}

  async getTasks(userId: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTasksPaginated(
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    search?: string,
  ): Promise<PaginatedResult<any>> {
    const skip = (page - 1) * limit;

    const where: {
      userId: string;
      deletedAt: null;
      status?: string;
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      userId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.task.count({ where });

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return {
      tasks,
      total,
    };
  }

  async createTask(userId: string, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        userId,
        status: '',
      },
    });

    return task;
  }

  async createTaskImmediately(userId: string, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        userId,
        status: 'processed',
      },
    });

    await this.prisma.taskLog.create({
      data: {
        taskId: task.id,
        title: task.title,
      },
    });

    return task;
  }

  async startTaskProcessing(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
        deletedAt: null,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.status !== '' && task.status !== null) {
      throw new Error('Task is not in default status');
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: { status: 'processing' },
    });

    try {
      const jobData: TaskJobData = {
        taskId: task.id,
        title: task.title,
        userId: task.userId,
        createdAt: task.createdAt,
      };

      try {
        const job = await this.taskQueue.add('process-task', jobData, {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 50,
        });

        this.logger.log(
          `Background job queued for task ${task.id}: ${task.title}`,
        );

        return {
          message: 'Task processing started',
          taskId: task.id,
          jobId: job.id,
        };
      } catch (queueError: unknown) {
        const errorMessage =
          queueError instanceof Error
            ? queueError.message
            : 'Unknown queue error';

        await this.processTaskImmediately(task);

        return {
          message: 'Task processing started (immediate)',
          taskId: task.id,
          jobId: null,
        };
      }
    } catch (error: unknown) {
      await this.prisma.task.update({
        where: { id: taskId },
        data: { status: '' },
      });

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to queue background job for task ${task.id}: ${errorMessage}`,
      );
      throw new Error('Failed to start task processing');
    }
  }

  public async processTaskImmediately(task: Task) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await this.prisma.task.update({
        where: { id: task.id },
        data: { status: 'processed' },
      });

      await this.prisma.taskLog.create({
        data: {
          taskId: task.id,
          title: task.title,
        },
      });
    } catch (error: unknown) {
      await this.prisma.task.update({
        where: { id: task.id },
        data: { status: 'failed' },
      });

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async updateTask(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.prisma.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: updateTaskDto,
    });
  }

  async deleteTask(userId: string, taskId: string) {
    return this.prisma.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getTask(userId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
        deletedAt: null,
      },
    });
  }
}
