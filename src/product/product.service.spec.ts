import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let provider: ProductService;
  let repository: Repository<ProductEntity>;
  let productList: ProductEntity[];
  const seedDatabase = async () => {
    await repository.clear();
    productList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        countries: [],
        recipes: [],
        products: [],
        restaurants: [],
      });
      productList.push(product);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    provider = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  afterAll(() => {
    repository.clear();
  });
});
