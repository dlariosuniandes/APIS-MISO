import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/shared/enums/role.enum';
import { RoleEntity } from 'src/role/role.entity';

@Injectable()
export class UserService implements OnModuleInit {
  defaultUsers: UserEntity[];

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {
    this.defaultUsers = [];
  }

  async onModuleInit() {
    const users = this.generateSeedUsers();
    for (let i = 0; i < users.length; i++) {
      const userEntity = await this.userRepository.save(users[i]);
      for (let index = 0; index < userEntity.roles.length; index++) {
        const role: RoleEntity = {
          id: faker.datatype.uuid(),
          name: userEntity.roles[index],
          user: userEntity,
        };
        await this.roleRepository.save(role);
      }
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
        roles: [
          Role.READ_ONLY,
          Role.ALLOW_CREATE,
          Role.ALLOW_MODIFY,
          Role.ALLOW_DELETE,
        ],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'Creator',
        password: 'Creator',
        roles: [Role.ALLOW_CREATE, Role.ALLOW_MODIFY],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'Reader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'Remover',
        password: 'Remover',
        roles: [Role.ALLOW_DELETE],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'ProductsReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['products'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CountriesReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['countries'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'RecipesReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['recipes'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'RestaurantsReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['restaurants'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'RestaurantsStarsReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['restaurants', 'micheline-stars'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesRestaurantsReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['restaurants', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesProductsReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['products', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesRecipesReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['recipes', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesCountriesReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['countries', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CountriesRestaurantReader',
        password: 'Reader',
        roles: [Role.READ_ONLY],
        resources: ['countries', 'restaurants'],
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
    return await this.userRepository.findOne({
      where: { userName: userName },
      relations: ['roles'],
    });
  }
}
