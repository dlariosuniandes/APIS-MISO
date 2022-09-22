import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { RoleEnum } from '../shared/enums/role.enum';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/authorization/role.enum';

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
        id: faker.datatype.uuid(),
        userName: 'Admin',
        password: 'Admin',
        role: Role.Admin,
        isActive: true,
      },
      {
        userName: 'Creator',
        password: 'Creator',
        role: Role.Creator,
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'Reader',
        password: 'Reader',
        role: Role.Reader,
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
