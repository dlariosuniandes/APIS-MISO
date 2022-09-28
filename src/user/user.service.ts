import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/shared/enums/role.enum';

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
        id: faker.datatype.uuid(),
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
        userName: 'CulturesReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'ProductsReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['products'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CountriesReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['countries'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'RecipesReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['recipes'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'RestaurantsReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['restaurants'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'RestaurantsStarsReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['restaurants', 'micheline-stars'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesRestaurantsReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['restaurants', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesProductsReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['products', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesRecipesReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['recipes', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CulturesCountriesReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['countries', 'cultures'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'CountriesRestaurantReader',
        password: 'Reader',
        role: Role.Reader,
        resources: ['countries', 'restaurants'],
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'Editor',
        password: 'Editor',
        role: Role.Editor,
        isActive: true,
      },
      {
        id: faker.datatype.uuid(),
        userName: 'Remover',
        password: 'Remover',
        role: Role.Remover,
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
