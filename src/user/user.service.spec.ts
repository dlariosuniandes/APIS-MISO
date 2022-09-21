import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;
  let userList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await service.onModuleInit();
    userList = service.generateSeedUsers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('default users should exist', async () => {
    const savedUsers = await userRepository.find();
    expect(savedUsers).not.toBeNull();
  });

  /*
  it('admin user should exist', async () => {
    const adminUser = userList[0];
    const savedUser = await service.findOne(adminUser.id);
    expect(savedUser).not.toBeNull();
  });
  */
});
