import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUser } from 'src/dtos/update-user-dto';
@Controller('auth')
export class UsersController {
  // This makes the controller connects the service
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createNewUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException(`No User Found with Id of ${id}`);
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    // Query ?email=zeyad@example.com
    return this.userService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch('/:id')
  updateUser(@Body() body: UpdateUser, @Param('id') id: string) {
    return this.userService.update(+id, body);
  }
}
