import { Injectable, Logger } from '@nestjs/common';
import { OnQueueCompleted, OnQueueFailed, OnQueueStalled } from '@nestjs/bull';
import { Job } from 'bull';

@Injectable()
export class QueueMonitorService {
  private readonly logger = new Logger(QueueMonitorService.name);

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }

  @OnQueueStalled()
  onStalled(job: Job) {
    this.logger.warn(`Job ${job.id} stalled`);
  }
}
