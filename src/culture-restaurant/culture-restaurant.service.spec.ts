import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CultureRestaurantService } from './culture-restaurant.service';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { CultureService } from 'src/culture/culture.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { CultureEntity } from 'src/culture/culture.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { faker } from '@faker-js/faker';

describe('CultureRestaurantService', () => {
  let service: CultureRestaurantService;
  let cultureService: CultureService;
  let cultureRepository: Repository<CultureEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let culture: CultureEntity;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CultureRestaurantService, CultureService, RestaurantService],
    }).compile();

    service = module.get<CultureRestaurantService>(CultureRestaurantService);
    cultureRepository = module.get<Repository<CultureEntity>>(
      getRepositoryToken(CultureEntity),
    );
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    cultureRepository.clear();
    restaurantsList = [];

    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: faker.company.name(),
        city: faker.address.cityName(),
      });
      restaurantsList.push(restaurant);
    }

    culture = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      restaurants: restaurantsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantToCulture should add an restaurant to a culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.lorem.sentence(),
    });

    const newCulture: CultureEntity = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    const result: CultureEntity = await service.addRestaurantToCulture(
      newCulture.id,
      newRestaurant.id,
    );
    expect(result.restaurants.length).toBe(1);
    expect(result.restaurants[0]).not.toBeNull();
    expect(result.restaurants[0].name).toBe(newRestaurant.name);
    expect(result.restaurants[0].city).toBe(newRestaurant.city);
  });

  it('addRestaurantToCulture should throw exception for an invalid restaurant', async () => {
    const newCulture: CultureEntity = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });
    await expect(() =>
      service.addRestaurantToCulture(newCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The Restaurant with the given id was not found',
    );
  });

  it('addRestaurantToCulture should throw exception for an invalid culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.address.cityName(),
    });
    await expect(() =>
      service.addRestaurantToCulture('0', newRestaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The Culture with the given id was not found',
    );
  });

  it('findRestauransByCultureId should return restaurants by culture', async () => {
    const restaurants: RestaurantEntity[] =
      await service.findRestaurantsByCultureId(culture.id);
    expect(restaurants.length).toBe(5);
  });

  it('findRestauransByCultureId should throw an exception for an inavalid culture', async () => {
    await expect(() =>
      service.findRestaurantsByCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The Culture with the given id was not found',
    );
  });

  it('associateRestaurantsToCulture should update restaurants list for a culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.address.city(),
    });

    const updatedCulture: CultureEntity =
      await service.associateRestaurantsToCulture(culture.id, [newRestaurant]);

    expect(updatedCulture.restaurants.length).toBe(1);
    expect(updatedCulture).not.toBeNull();
    expect(updatedCulture.restaurants[0].name).toBe(newRestaurant.name);
    expect(updatedCulture.restaurants[0].city).toBe(newRestaurant.city);
  });

  it('associateRestaurantsToCulture should throw an exception for an invalid culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.address.cityName(),
    });
    await expect(() =>
      service.associateRestaurantsToCulture('0', [newRestaurant]),
    ).rejects.toHaveProperty(
      'message',
      'The Culture with the given id was not found',
    );
  });

  it('associateRestaurantsToCulture should throw an exception for an invalid restaurant', async () => {
    const newRestaurant: RestaurantEntity = restaurantsList[0];
    newRestaurant.id = '0';
    await expect(() =>
      service.associateRestaurantsToCulture(culture.id, [newRestaurant]),
    ).rejects.toHaveProperty(
      'message',
      'The Restaurant with the given id was not found',
    );
  });

  it('deleteRestaurantToCulture should remove an restaurant from a culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await service.deleteRestaurantFromCulture(culture.id, restaurant.id);
    const storedCulture: CultureEntity = await cultureRepository.findOne({
      where: { id: culture.id },
      relations: ['restaurants'],
    });
    const deletedRestaurant: RestaurantEntity = storedCulture.restaurants.find(
      (a) => a.id === restaurant.id,
    );
    expect(deletedRestaurant).toBeUndefined();
  });

  it('deleteRestaurantToCulture should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.addRestaurantToCulture(culture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The Restaurant with the given id was not found',
    );
  });

  it('deleteRestaurantToCulture should throw an exception for an invalid culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(() =>
      service.deleteRestaurantFromCulture('0', restaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The Culture with the given id was not found',
    );
  });

  it('deleteRestaurantToCulture should throw an exception for a non asoccianted restaurant', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.address.cityName(),
    });
    await expect(() =>
      service.deleteRestaurantFromCulture(culture.id, newRestaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The Restaurant with the given id is not associated to the Culture',
    );
  });
});
