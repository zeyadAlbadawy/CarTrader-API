import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {} // this makes the service connect within repo
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    // update but hocks will not work
    const foundUser = await this.findOne(id);
    if (!foundUser)
      throw new NotFoundException(`No User Found with id of ${id}`);
    Object.assign(foundUser, attrs);
    return this.repo.save(foundUser);
  }

  async remove(id: number) {
    // delete can be used bit the hocks will not be called
    // hocks called while save and delete ONLY
    const foundedUser = await this.findOne(id);
    if (!foundedUser)
      throw new NotFoundException(`No User Found with id of ${id}`);
    await this.repo.remove(foundedUser);
  }
}
