import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dtos/user.dto";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectQueue('user-queue')
    private readonly userQueue: Queue
  ) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isUniqueEmail = await this.checkEmailUniqueness(createUserDto.email)

    if (isUniqueEmail) {
      throw { statusCode: 400, message: 'ERR_USER_EMAIL_EXISTS' };
    }

    const createdUser = await this.usersRepository.save(createUserDto);

    await this.userQueue.add('update-status', { userId: createdUser.id }, { delay: 10000 });

    return createdUser;
  }

  async getUserById(userId: number): Promise<User> {
    const cacheKey = `user:${userId}`;
    let user = await this.cacheManager.get<User>(cacheKey);

    if (!user) {
      user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw { statusCode: 400, message: "ERR_USER_NOT_FOUND" }
      }

      if (user.status === true) {
        await this.cacheManager.set(cacheKey, user, 1800000);
      }
    }

    return user;
  }


  async updateUserStatus(userId: number, status: boolean): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    user.status = status;
    await this.usersRepository.save(user);
  }

  async checkEmailUniqueness(email: string): Promise<boolean> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    return !existingUser;
  }
}
