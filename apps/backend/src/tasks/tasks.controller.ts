import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  userId: string;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  @Get()
  async getTasks(@Request() req) {
    // req.user contains the authenticated user from JWT
    const userId = req.user.id;

    // In a real application, you would fetch tasks from the database
    // For now, return mock data
    return {
      tasks: [
        {
          id: '1',
          title: 'Complete Web3 Authentication',
          description: 'Implement secure wallet-based authentication',
          status: 'completed',
          userId,
        },
        {
          id: '2',
          title: 'Build Task Management UI',
          description: 'Create a beautiful and functional task interface',
          status: 'in-progress',
          userId,
        },
      ],
    };
  }

  @Post()
  async createTask(
    @Request() req,
    @Body() createTaskDto: { title: string; description?: string },
  ) {
    const userId = req.user.id;

    // In a real application, you would save to the database
    const newTask: Task = {
      id: Date.now().toString(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: 'pending',
      userId,
    };

    return {
      message: 'Task created successfully',
      task: newTask,
    };
  }
}
