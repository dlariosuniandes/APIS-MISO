import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<RestaurantEntity>;
  let restaurantsList: RestaurantEntity[];

  const propertyExcepetionRestaurantNotFound = 'message';
  const messageExcepetionRestaurantNotFound =
    'The Restaurant with the given id was not found';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantsList = [];
    for (let index = 0; index < 5; index++) {
      const restaurant: RestaurantEntity = await repository.save({
        name: faker.company.name(),
        city: faker.address.cityName(),
      });
      restaurantsList.push(restaurant);
    }
  };

  const getStoredRestaurantRandom = async () => {
    return restaurantsList[
      faker.datatype.number({ min: 0, max: restaurantsList.length - 1 })
    ];
  };

  const getStoredRestaurant = async (restaurant: RestaurantEntity) => {
    return await repository.findOne({
      where: { id: `${restaurant.id}` },
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const restaurants: RestaurantEntity[] = await service.findAll();
    expect(restaurants).not.toBeNull();
    expect(restaurants).toHaveLength(restaurantsList.length);
  });

  it('findOne should return a restaurant by ID', async () => {
    const storedRestaurant: RestaurantEntity =
      await getStoredRestaurantRandom();
    const restaurant: RestaurantEntity = await service.findOne(
      storedRestaurant.id,
    );
    expect(restaurant).not.toBeNull();
    expect(restaurant.name).toEqual(storedRestaurant.name);
    expect(restaurant.city).toEqual(storedRestaurant.city);
  });

  it('findOne should return throw an exception for an invalid restauran', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      propertyExcepetionRestaurantNotFound,
      messageExcepetionRestaurantNotFound,
    );
  });

  it('create should return a new restaurant', async () => {
    const restaurant: RestaurantEntity = {
      id: '',
      name: faker.company.name(),
      city: faker.address.cityName(),
      michelineStars: [],
      cultures: [],
    };

    const createdRestaurant: RestaurantEntity = await service.create(
      restaurant,
    );
    expect(createdRestaurant).not.toBeNull();

    const storedRestaurant: RestaurantEntity = await getStoredRestaurant(
      createdRestaurant,
    );
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(createdRestaurant.name);
    expect(storedRestaurant.city).toEqual(createdRestaurant.city);
  });

  it('update should modify a restaurant', async () => {
    const restaurant: RestaurantEntity = await getStoredRestaurantRandom();
    restaurant.name = 'New name';
    restaurant.city = 'New city';

    const updateRestaurant: RestaurantEntity = await service.update(
      restaurant.id,
      restaurant,
    );
    expect(updateRestaurant).not.toBeNull();

    const storedRestaurant: RestaurantEntity = await getStoredRestaurant(
      updateRestaurant,
    );
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(restaurant.name);
    expect(storedRestaurant.city).toEqual(restaurant.city);
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurant: RestaurantEntity = await getStoredRestaurantRandom();
    restaurant = {
      ...restaurant,
      name: 'New name',
      city: 'New city',
    };
    await expect(() => service.update('0', restaurant)).rejects.toHaveProperty(
      propertyExcepetionRestaurantNotFound,
      messageExcepetionRestaurantNotFound,
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurant: RestaurantEntity = await getStoredRestaurantRandom();
    await service.delete(restaurant.id);
    const deletedRestaurant: RestaurantEntity = await getStoredRestaurant(
      restaurant,
    );
    expect(deletedRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalida restaurant', async () => {
    const restaurant: RestaurantEntity = await getStoredRestaurantRandom();
    await service.delete(restaurant.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      propertyExcepetionRestaurantNotFound,
      messageExcepetionRestaurantNotFound,
    );
  });
});
