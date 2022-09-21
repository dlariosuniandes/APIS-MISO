import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { RoleEnum } from '../shared/enums/role.enum';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService implements OnModuleInit {
  defaultUsers: UserEntity[];

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    this.defaultUsers = [];
  }

  async onModuleInit() {
    const users = this.generateSeedUsers();
    for (let i = 0; i < users.length; i++) {
      const userEntity = await this.userRepository.save(users[i]);
      this.defaultUsers = [...this.defaultUsers, userEntity];
    }
  }

  generateSeedUsers() {
    faker.seed(123);
    const salt = bcrypt.genSaltSync(10);
    const seedObjectUsers: object[] = [
      {
        userName: 'Admin',
        password: 'Admin',
        role: RoleEnum[RoleEnum.ADMIN],
        isActive: true,
      },
      {
        userName: 'Reader',
        password: 'Reader',
        role: RoleEnum[RoleEnum.READ],
        isActive: true,
      },
      {
        userName: 'specificReader',
        password: 'specificReader',
        role: RoleEnum[RoleEnum.READ],
        resources: ['products', 'cultures'],
        isActive: true,
      },
      {
        userName: 'Editor',
        password: 'Editor',
        role: RoleEnum[RoleEnum.POST_EDIT],
        isActive: true,
      },
      {
        userName: 'Remover',
        password: 'Remover',
        role: RoleEnum[RoleEnum.DELETE],
        isActive: true,
      },
    ];
    return seedObjectUsers.map((obj) => {
      const userInstance = plainToInstance(UserEntity, obj);
      userInstance.password = bcrypt.hashSync(userInstance.password, salt);
      return userInstance;
    });
  }

  async findOne(userName: string): Promise<UserEntity> {
    console.log(userName, "here");
    return await this.userRepository.findOne({ where: { userName: userName } });
  }
}
