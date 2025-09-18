import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { exec } from 'child_process';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { emitWarning } from 'process';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: '123@example.com',
          password: '123',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '123' } as User]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password });
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users test within a given email', async () => {
    const users = await controller.findAllUsers('123@example.com');
    expect(users).toBeDefined();
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('123@example.com');
  });

  it('find one user with the provided id', async () => {
    const foundUser = controller.findUser('1');
    expect(foundUser).toBeDefined();
  });

  it('findUser throws an error if the id is for this user not found', async () => {
    fakeUserService.findOne = (id: number) => null;
    const foundedUser = controller.findUser('1');
    await expect(foundedUser).rejects.toThrow(NotFoundException);
  });

  it('Sign in user and expect session object to be updated with userid', async () => {
    const session = { userId: -210 };
    const user = await controller.signin(
      { email: '123@example.com', password: '123' },
      session,
    );

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
