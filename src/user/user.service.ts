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
  ) {}

  async onModuleInit() {
    const defaultUsers = this.generateSeedUsers();
    for (let i = 0; i < defaultUsers.length; i++) {
      await this.userRepository.save(defaultUsers[i]);
    }
  }

  generateSeedUsers() {
    faker.seed(123);
    const salt = bcrypt.genSaltSync(10);
    const seedObjectUsers: object[] = [
      {
        id: faker.datatype.uuid(),
        userName: 'Admin',
        password: 'Admin',
        role: RoleEnum[RoleEnum.ADMIN],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'Reader',
        password: 'Reader',
        role: RoleEnum[RoleEnum.READ],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'specificReader',
        password: 'specificReader',
        role: RoleEnum[RoleEnum.READ],
        resources: ['products', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'Editor',
        password: 'Editor',
        role: RoleEnum[RoleEnum.POST_EDIT],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
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
    return await this.userRepository.findOne({ where: { userName: userName } });
  }
}
