import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from '../services/users.service';

@Processor('user-queue')
export class UserProcessor {
  constructor(private usersService: UsersService) {}

  @Process('update-status')
  async handleUpdateStatus(job: Job) {
    const { userId } = job.data;
    // Logic to update user status
    await this.usersService.updateUserStatus(userId, true);
  }
}
