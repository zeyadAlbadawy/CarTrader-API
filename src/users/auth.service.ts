import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async signup(email: string, password: string) {
    // See if there is a user with this mail
    const foundUser = await this.userService.find(email);
    if (foundUser.length)
      return new BadRequestException(`There is a user with this mail ${email}`);
    // Hash the password
    // 1) Generate the salt
    const salt = randomBytes(8).toString('hex');
    // 2) hash the salt and password
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const finalPasswordHashed = hash + '.' + hash.toString('hex');
    // create the new user and signup
    const newUser = await this.userService.create(email, finalPasswordHashed);
    // return the created user
    return newUser;
  }
  signin() {}
}
