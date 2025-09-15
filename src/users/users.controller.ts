import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUser } from 'src/dtos/update-user-dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(new SerializeInterceptor(UserDto))
export class UsersController {
  // This makes the controller connects the service
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  createNewUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
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
    // The Email is optional and password is optional
    return this.userService.update(+id, body);
  }
}
