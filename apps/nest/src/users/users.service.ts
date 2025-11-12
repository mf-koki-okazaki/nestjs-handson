import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await argon2.hash(createUserDto.password);
    try {
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          age: createUserDto.age,
          hashedPassword,
        },
      });
    } catch (error: any) {
      // Prisma のユニーク制約違反エラーコード: P2002
      if (error.code === 'P2002') {
        throw new ConflictException(
          '指定されたメールアドレスは既に使用されています。',
        );
      }
      throw new InternalServerErrorException(
        'ユーザ作成時に予期せぬエラーが発生しました。',
      );
    }
  }

  async findAll(searchUserDto: SearchUserDto) {
    const users = await this.prisma.user.findMany({
      where: {
        email: searchUserDto.email || undefined,
        name: searchUserDto.name ? { contains: searchUserDto.name } : undefined,
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw new InternalServerErrorException(
        'ユーザ更新時に予期せぬエラーが発生しました。',
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw new InternalServerErrorException(
        'ユーザ削除時に予期せぬエラーが発生しました。',
      );
    }
  }
}
