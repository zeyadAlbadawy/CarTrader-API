import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  // Before each test make sure that you get a fresh copy of service
  beforeEach(async () => {
    // Create fake copy of user service
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const user = users.filter((userElmnt) => userElmnt.email === email);
        return Promise.resolve(user);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Define DI Container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService); // get an instance of auth service to be able to access its functions
  });

  it('Can Create instance auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create new user with hashed password', async () => {
    const user = await service.signup('zeyad@examplle.com', 'pass123');
    expect(user.password).not.toEqual('pass123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // fakeUserService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throw an error with unused email while sign in ', async () => {
    await expect(service.signin('zeuad@124.com', '123')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throw error if the password is invalid', async () => {
    // fakeUserService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'zead@gmail.com', password: '123' } as User,
    //   ]);
    //
    await service.signup('zead@gmail.com', '123453');
    await expect(service.signin('zead@gmail.com', '12345333')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('123@example.com', '12333');
    const user = await service.signin('123@example.com', '12333');
    expect(user).toBeDefined();
  });
});
