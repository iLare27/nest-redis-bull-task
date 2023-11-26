import {
  Body,
  CacheTTL,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { CreateUserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';
import { User } from "../entities/user.entity";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createdUser: User = await this.usersService.createUser(createUserDto);
    return createdUser;
  }

  @Get('get-user-by-id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1800000)
  async getUserById(@Query('id') id: string) {
    const user: User = await this.usersService.getUserById(id);
    return { statusCode: 200, message: "SUCCESS", user: user };
  }
}
