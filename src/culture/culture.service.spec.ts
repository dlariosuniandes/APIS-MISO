import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CultureEntity } from './culture.entity';
import { CultureService } from './culture.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('CultureService', () => {
  let service: CultureService;
  let repository: Repository<CultureEntity>;
  let cultureList: CultureEntity[];

  const seedDatabase = async () => {
    repository.clear();
    cultureList = [];
    for (let i = 0; i < 5; i++) {
      const culture: CultureEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        countries: [],
        recipes: [],
        products: [],
        restaurants: [],
      });
      cultureList.push(culture);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultureService],
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
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

  it('findOne should return a culture by id', async () => {
    const storedCulture: CultureEntity = cultureList[0];
    const culture: CultureEntity = await service.findOne(storedCulture.id);
    expect(culture).not.toBeNull();
    expect(culture.name).toEqual(storedCulture.name);
    expect(culture.description).toEqual(storedCulture.description);
    expect(culture.countries).toEqual(storedCulture.countries);
    expect(culture.recipes).toEqual(storedCulture.recipes);
    expect(culture.products).toEqual(storedCulture.products);
    expect(culture.restaurants).toEqual(storedCulture.restaurants);
  });

  it('findOne should throw an exception for an invalid culture', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('create should return a new culture', async () => {
    const culture: CultureEntity = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      countries: [],
      recipes: [],
      products: [],
      restaurants: [],
    };

    const newCulture: CultureEntity = await service.create(culture);
    expect(newCulture).not.toBeNull();

    const storedCulture: CultureEntity = await service.findOne(newCulture.id);
    expect(storedCulture).not.toBeNull();
    expect(storedCulture.name).toEqual(newCulture.name);
    expect(storedCulture.description).toEqual(newCulture.description);
  });

  it('update should modify a culture', async () => {
    const culture: CultureEntity = cultureList[0];
    culture.name = 'New name';
    culture.description = 'New description';
    const updatedCulture: CultureEntity = await service.update(
      culture.id,
      culture,
    );
    expect(updatedCulture).not.toBeNull();
    const storedCulture: CultureEntity = await service.findOne(culture.id);
    expect(storedCulture).not.toBeNull();
    expect(storedCulture.name).toEqual(culture.name);
    expect(storedCulture.description).toEqual(culture.description);
  });

  it('update should throw an exception for an invalid culture', async () => {
    let culture: CultureEntity = cultureList[0];
    culture = {
      ...culture,
      name: 'New name',
      description: 'New description',
    };
    await expect(() => service.update('0', culture)).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('delete should remove a culture', async () => {
    const culture: CultureEntity = cultureList[0];
    await service.delete(culture.id);
    try {
      await service.findOne(culture.id);
    } catch {
      const storedCultures: CultureEntity[] = await service.findAll();
      expect(storedCultures.length).toEqual(4);
    }
  });

  it('delete should throw an exception for an invalid culture', async () => {
    const culture: CultureEntity = cultureList[0];
    await service.delete(culture.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });
});
