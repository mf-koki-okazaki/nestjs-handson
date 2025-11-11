import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user-dto';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from 'argon2';

type User = {
  id: number;
  name: string;
  age: number;
};
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await argon2.hash(createUserDto.password);
    return this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        age: createUserDto.age,
        hashedPassword: hashedPassword,
      },
    });
  }

  findAll(searchUserDto: SearchUserDto) {}

  findOne(id: number) {}

  update(id: number, updateUserDto: UpdateUserDto) {}

  remove(id: number) {}
}
