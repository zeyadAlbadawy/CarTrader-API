import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Session,
  Post,
  Query,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUser } from 'src/dtos/update-user-dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interseptors/current-user.interceptor';
import { User } from './user.entity';
import { UserAuthGuard } from 'src/guards/user-auth.guard';

@Controller('auth')
@UseInterceptors(new SerializeInterceptor(UserDto))
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  // This makes the controller connects the service
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // async whoami(@Session() session: any) {
  //   const foundedUser = await this.userService.findOne(session.userId);
  //   if (!foundedUser) throw new BadRequestException('No user found');
  //   return foundedUser;
  // }

  @Get('/whoami')
  @UseGuards(UserAuthGuard)
  async whami(@CurrentUser() user: User) {
    return user;
  }
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createNewUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
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
