import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';

interface CreateTaskDto {
  title: string;
  description?: string;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
}

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    address: string;
  };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Request() req: AuthenticatedRequest,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const userId = req.user.id;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await this.tasksService.getTasksPaginated(
      userId,
      pageNum,
      limitNum,
      status,
      search,
    );

    return {
      tasks: result.tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        totalPages: Math.ceil(result.total / limitNum),
        hasNext: pageNum < Math.ceil(result.total / limitNum),
        hasPrev: pageNum > 1,
      },
    };
  }

  @Get(':id')
  async getTask(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.id;
    const task = await this.tasksService.getTask(userId, id);
    return { task };
  }

  @Post()
  async createTask(
    @Request() req: AuthenticatedRequest,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const userId = req.user.id;
    const task = await this.tasksService.createTask(userId, createTaskDto);

    return {
      message: 'Task created successfully',
      task,
    };
  }

  @Post('create-immediate')
  async createTaskImmediate(
    @Request() req: AuthenticatedRequest,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const userId = req.user.id;
    const task = await this.tasksService.createTaskImmediately(
      userId,
      createTaskDto,
    );

    return {
      message: 'Task created and processed immediately',
      task,
    };
  }

  @Patch(':id')
  async updateTask(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId = req.user.id;
    const task = await this.tasksService.updateTask(userId, id, updateTaskDto);

    return {
      message: 'Task updated successfully',
      task,
    };
  }

  @Delete(':id')
  async deleteTask(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    await this.tasksService.deleteTask(userId, id);

    return {
      message: 'Task deleted successfully',
    };
  }

  @Post(':id/start-processing')
  async startTaskProcessing(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    const result = await this.tasksService.startTaskProcessing(userId, id);

    return {
      message: result.message,
      taskId: result.taskId,
      jobId: result.jobId,
    };
  }

  @Get(':id/debug')
  async debugTask(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    const task = await this.tasksService.getTask(userId, id);

    if (!task) {
      return { error: 'Task not found' };
    }

    return {
      task,
      timestamp: new Date().toISOString(),
      message: `Task ${id} current status: ${task.status}`,
    };
  }

  @Post(':id/test-process')
  async testProcessTask(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;

    const task = await this.tasksService.getTask(userId, id);
    if (!task) {
      return { error: 'Task not found' };
    }

    try {
      await this.tasksService.processTaskImmediately(task);
      return {
        message: 'Task processed successfully',
        taskId: id,
        status: 'processed',
      };
    } catch (error) {
      return {
        error: 'Failed to process task',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Post(':id/test-update-status')
  async testUpdateStatus(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const userId = req.user.id;

    try {
      const updatedTask = await this.tasksService.updateTask(userId, id, {
        status: body.status,
      });
      return {
        message: `Task status updated to ${body.status}`,
        task: updatedTask,
      };
    } catch (error) {
      return {
        error: 'Failed to update task status',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
