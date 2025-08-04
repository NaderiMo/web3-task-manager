import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

export interface TaskJobData {
  taskId: string;
  title: string;
  userId: string;
  createdAt: Date;
}

@Injectable()
@Processor('task-processing')
export class TaskProcessorService {
  private readonly logger = new Logger(TaskProcessorService.name);

  constructor(private prisma: PrismaService) {}

  @Process('process-task')
  async processTask(job: Job<TaskJobData>) {
    const { taskId, title, userId } = job.data;

    this.logger.log(`Processing task ${taskId}: ${title}`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await this.prisma.task.update({
        where: { id: taskId },
        data: { status: 'processed' },
      });

      await this.prisma.taskLog.create({
        data: {
          taskId,
          title,
        },
      });

      this.logger.log(`Task ${taskId} processed successfully`);

      return { success: true, taskId };
    } catch (error) {
      this.logger.error(`Failed to process task ${taskId}: ${error.message}`);

      await this.prisma.task.update({
        where: { id: taskId },
        data: { status: 'failed' },
      });

      throw error;
    }
  }
}
