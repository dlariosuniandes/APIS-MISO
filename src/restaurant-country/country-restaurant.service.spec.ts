import { Test, TestingModule } from '@nestjs/testing';
import { CountryRestaurantService } from './country-restaurant.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CultureEntity } from '../culture/culture.entity';
import { CountryEntity } from '../country/country.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CountryService } from '../country/country.service';
import { CacheModule } from '@nestjs/common';

describe('CountryRestaurantService', () => {
  let countryRestaurantProvider: CountryRestaurantService;
  let restaurantProvider: RestaurantService;
  let countryProvider: CountryService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let countryRepository: Repository<CountryEntity>;
  let countryList: CountryEntity[];
  let restaurant: RestaurantEntity;

  const generateCountry = () => {
    const country: CountryEntity = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      cultures: [],
      restaurants: [],
    };
    return country;
  };

  const generateRestaurant = () => {
    const restaurant: RestaurantEntity = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      city: faker.lorem.sentence(),
      cultures: [],
      country: {} as CountryEntity,
      michelineStars: [],
    };
    return restaurant;
  };

  const seedDatabase = async () => {
    await restaurantRepository.clear();
    await countryRepository.clear();
    countryList = [];
    countryList[0] = await countryRepository.save(
      Object.assign(new CountryEntity(), generateCountry()),
    );
    countryList[1] = await countryRepository.save(
      Object.assign(new CountryEntity(), generateCountry()),
    );
    restaurant = await restaurantRepository.save(
      Object.assign(new RestaurantEntity(), generateRestaurant()),
    );
    restaurant = await restaurantProvider.findOne(restaurant.id);
    countryList[0] = await countryProvider.findOne(countryList[0].id);
    countryList[1] = await countryProvider.findOne(countryList[1].id);
    restaurant.country = countryList[0];
    countryList[0].restaurants = [restaurant];
    await restaurantRepository.save(restaurant);
    await countryRepository.save(countryList[0]);
    restaurant = await restaurantProvider.findOne(restaurant.id);
    countryList[0] = await countryProvider.findOne(countryList[0].id);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountryRestaurantService, CountryService, RestaurantService],
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
    }).compile();
    countryRestaurantProvider = module.get<CountryRestaurantService>(
      CountryRestaurantService,
    );
    restaurantProvider = module.get<RestaurantService>(RestaurantService);
    countryProvider = module.get<CountryService>(CountryService);
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    countryRepository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );
    await seedDatabase();
  });

  it('should be defined', async () => {
    expect(countryRestaurantProvider).toBeDefined();
  });

  it('should add country to restaurant', async () => {
    await countryRestaurantProvider.addCountryToRestaurant(
      countryList[1].id,
      restaurant.id,
    );
    const modifiedRestaurant: RestaurantEntity =
      await restaurantProvider.findOne(restaurant.id);
    expect(modifiedRestaurant.country.id).toEqual(countryList[1].id);
  });

  it('should delete country from restaurant', async () => {
    await countryRestaurantProvider.deleteCountryFromRestaurant(
      countryList[0].id,
      restaurant.id,
    );
    const restaurantDeleted: RestaurantEntity =
      await restaurantProvider.findOne(restaurant.id);
    expect(restaurantDeleted.country).toBeFalsy();
  });

  it('should get country by restaurant id', async () => {
    const country = await countryRestaurantProvider.findCountryByRestaurantId(
      restaurant.id,
    );
    const findResult: RestaurantEntity = await restaurantProvider.findOne(
      restaurant.id,
    );
    expect(findResult.country).toEqual(country);
  });
});
