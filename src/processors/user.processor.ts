import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from '../services/users.service';
import { Cache } from "cache-manager";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Processor('user-queue')
export class UserProcessor {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Process('update-status')
  async handleUpdateStatus(job: Job) {
    const { userId } = job.data;
    await this.usersService.updateUserStatus(userId, true );
  }
}
