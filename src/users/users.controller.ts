import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from './users.service';
@Controller('auth')
export class UsersController {
  // This makes the controller connects the service
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createNewUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password);
  }
}
