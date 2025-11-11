import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user-dto';

type User = {
  id: number;
  name: string;
  age: number;
};
@Injectable()
export class UsersService {
  // ユーザデータの配列
  users: User[] = [
    { id: 1, name: 'Taro', age: 25 },
    { id: 2, name: 'Hanako', age: 30 },
    { id: 3, name: 'Jiro', age: 22 },
  ];
  create(createUserDto: CreateUserDto) {
    const nextId =
      this.users.length > 0
        ? Math.max(...this.users.map((user) => user.id)) + 1
        : 1;

    const newUser: User = {
      id: nextId, // 動的に計算したIDを設定
      name: createUserDto.name,
      age: createUserDto.age,
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(searchUserDto: SearchUserDto) {
    if (!searchUserDto.name) {
      return this.users;
    }
    // keywordがnameに含まれているユーザのみをフィルタリング
    const filteredUsers = this.users.filter((user) =>
      user.name.includes(searchUserDto.name),
    );
    return filteredUsers;
  }

  findOne(id: number) {
    // 条件に一致する最初のユーザを返す
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = this.users.find((user) => user.id === id);
    if (!userToUpdate) {
      // throw new NotFoundException('指定したidのユーザは存在しません');
      return null;
    }
    if (updateUserDto.age) {
      userToUpdate.age = updateUserDto.age;
    }
    if (updateUserDto.name) {
      userToUpdate.name = updateUserDto.name;
    }
    return userToUpdate;
  }

  remove(id: number) {
    const userDelete = this.users.find((user) => user.id === id);
    if (!userDelete) {
      // throw new NotFoundException('指定したidのユーザは存在しません');
      return null;
    }
    this.users = this.users.filter((user) => user.id !== id);
    return userDelete;
  }
}
