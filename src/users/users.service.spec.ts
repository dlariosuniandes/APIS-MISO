import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UserEntity>;
  let userList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();
    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await service.onModuleInit();
    userList = service.defaultUsers;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('default users should exist', async () => {
    const savedUsers = await userRepository.find();
    expect(savedUsers).not.toBeNull();
  });

  it('admin user should exist', async () => {
    const adminUser = userList[0];
    const savedUser = await service.findOne(adminUser.userName);
    expect(savedUser).not.toBeNull();
  });
});
