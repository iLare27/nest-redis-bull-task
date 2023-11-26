import { HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
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
    const existingUser = await this.usersRepository.findOne(
      { where: { email: createUserDto.email } }
    );

    if (existingUser) {
      throw { statusCode: 400, message: 'ERR_USER_EMAIL_EXISTS' };
    }

    const createdUser = await this.usersRepository.save(createUserDto);



    return createdUser;
  }

  async getUserById(userId): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('ERR_USER_NOT_FOUND');
    }
    return user;
  }

  async updateUserStatus(userId, ) {

  }
}
