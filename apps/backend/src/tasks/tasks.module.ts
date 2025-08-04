import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskProcessorService } from './task-processor.service';
import { QueueMonitorService } from './queue-monitor.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'task-processing',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskProcessorService, QueueMonitorService],
})
export class TasksModule {}
