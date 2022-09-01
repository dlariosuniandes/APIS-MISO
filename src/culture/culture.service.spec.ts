import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CultureEntity } from './culture.entity';
import { CultureService } from './culture.service';
import { faker } from '@faker-js/faker';

describe('CultureService', () => {
  let service: CultureService;
  let repository: Repository<CultureEntity>;
  let cultureList: CultureEntity[];

  const seedDatabase = async () => {
    repository.clear();
    cultureList = [];
    for (let i = 0; i < 5; i++) {
      const museum: CultureEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        countries: [],
        recipes: [],
        products: [],
        restaurants: [],
      });
      cultureList.push(museum);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultureService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<CultureService>(CultureService);
    repository = module.get<Repository<CultureEntity>>(
      getRepositoryToken(CultureEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cultures', async () => {
    const cultures: CultureEntity[] = await service.findAll();
    expect(cultures).not.toBeNull();
    expect(cultures).toHaveLength(cultureList.length);
  });
});
