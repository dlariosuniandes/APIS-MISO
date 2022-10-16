import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { MichelineStarEntity } from '../micheline-star/micheline-star.entity';
import { StarRating } from '../shared/enums/star-rating.enum';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { MichelineStarService } from '../micheline-star/micheline-star.service';
import { faker } from '@faker-js/faker';

describe('RestaurantMichelineStarService', () => {
  let service: RestaurantMichelineStarService;
  let michelineStarService: MichelineStarService;
  let restaurantService: RestaurantService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let michelineStarRepository: Repository<MichelineStarEntity>;
  let restaurant: RestaurantEntity;
  let michelineStarsList: MichelineStarEntity[];

  const propertyExcepetionResourceNotFound = 'message';
  const messageExcepetionRestaurantNotFound =
    'The Restaurant with the given id was not found';
  const messageExcepetionMichelineStarNotFound =
    'The Micheline Star with the given id was not found';
  const messageExcepetionNotAsocciation =
    'The Micheline Star with the given id is not associated to the Restaurant';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        RestaurantMichelineStarService,
        RestaurantService,
        MichelineStarService,
      ],
    }).compile();

    service = module.get<RestaurantMichelineStarService>(
      RestaurantMichelineStarService,
    );
    michelineStarService =
      module.get<MichelineStarService>(MichelineStarService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    michelineStarRepository = module.get<Repository<MichelineStarEntity>>(
      getRepositoryToken(MichelineStarEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    michelineStarRepository.clear();
    michelineStarsList = [];

    for (let index = 0; index < 5; index++) {
      const michelineStar: MichelineStarEntity = await createMichelineStar();
      michelineStarsList.push(michelineStar);
    }

    restaurant = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.address.cityName(),
      michelineStars: michelineStarsList,
    });
  };

  const getStoredMichelineStarRandom = async () => {
    return michelineStarsList[
      faker.datatype.number({ min: 0, max: michelineStarsList.length - 1 })
    ];
  };

  const createMichelineStar = async () => {
    return await michelineStarRepository.save({
      starRating: StarRating.ONE,
      awardedDate: faker.date.past().toString(),
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMichelineStarToRestaurante should add a micheline star to a restaurant', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.address.cityName(),
    });
    const newMichelineStar: MichelineStarEntity = {
      id: '',
      starRating: StarRating.ONE,
      awardedDate: faker.date.past().toString(),
      restaurant: newRestaurant,
    };
    const restaurant: RestaurantEntity =
      await service.addMichelineStarToRestaurant(
        newRestaurant.id,
        newMichelineStar,
      );
    expect(restaurant.michelineStars.length).toBe(1);
    expect(restaurant.michelineStars[0]).not.toBeNull();
    expect(restaurant.michelineStars[0].starRating).toBe(
      newMichelineStar.starRating,
    );
    expect(restaurant.michelineStars[0].awardedDate).toBe(
      newMichelineStar.awardedDate,
    );
  });

  it('addMichelineStarToRestaurante should throw exception for an invalid restaurant', async () => {
    const newMichelineStar: MichelineStarEntity = await createMichelineStar();
    await expect(() =>
      service.addMichelineStarToRestaurant('0', newMichelineStar),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionRestaurantNotFound,
    );
  });

  it('findMichelineStarByRestaurantIdAndMichelineStarId should return micheline star by restaurant', async () => {
    const michelineStar: MichelineStarEntity =
      await getStoredMichelineStarRandom();

    const storedMichelineStar: MichelineStarEntity =
      await service.findMichelineStarByRestaurantIdAndMichelineStarId(
        restaurant.id,
        michelineStar.id,
      );

    expect(storedMichelineStar).not.toBeNull();
    expect(storedMichelineStar.starRating).toBe(michelineStar.starRating);
    expect(storedMichelineStar.awardedDate).toBe(michelineStar.awardedDate);
  });

  it('findMichelineStarByRestaurantIdAndMichelineStarId should throw an exception for an invalid micheline star', async () => {
    await expect(() =>
      service.findMichelineStarByRestaurantIdAndMichelineStarId(
        restaurant.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionMichelineStarNotFound,
    );
  });

  it('findMichelineStarByRestaurantIdAndMichelineStarId should throw an exception for an invalid restaurant', async () => {
    const michelineStar: MichelineStarEntity =
      await getStoredMichelineStarRandom();
    await expect(() =>
      service.findMichelineStarByRestaurantIdAndMichelineStarId(
        '0',
        michelineStar.id,
      ),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionRestaurantNotFound,
    );
  });

  it('findMichelineStarByRestaurantIdAndMichelineStarId should throw an excepetion for an micheline star non associated to the restaurant', async () => {
    const newMichelineStar: MichelineStarEntity = await createMichelineStar();
    await expect(() =>
      service.findMichelineStarByRestaurantIdAndMichelineStarId(
        restaurant.id,
        newMichelineStar.id,
      ),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionNotAsocciation,
    );
  });

  it('findMichelineStarsByRestaurantId should return micheline stars by restaurant', async () => {
    const michelineStar: MichelineStarEntity[] =
      await service.findMichelineStarsByRestaurantId(restaurant.id);
    expect(michelineStar.length).toBe(5);
  });

  it('findMichelineStarsByRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findMichelineStarsByRestaurantId('0'),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionRestaurantNotFound,
    );
  });

  it('updateMichelineStarOfARestaurant should update a micheline star for a restaurant', async () => {
    const storedMichelineStar: MichelineStarEntity =
      await getStoredMichelineStarRandom();
    const newMichelineStar: MichelineStarEntity = {
      id: storedMichelineStar.id,
      starRating: StarRating.TWO,
      awardedDate: faker.date.past().toString(),
      restaurant: restaurant,
    };
    const restaurantMichelineStar: RestaurantEntity =
      await service.updateMichelineStarOfARestaurant(
        restaurant.id,
        storedMichelineStar.id,
        newMichelineStar,
      );
    const michelineStar: MichelineStarEntity =
      await michelineStarService.findOneBy(storedMichelineStar.id);

    expect(restaurantMichelineStar.michelineStars.length).toBe(5);
    expect(restaurantMichelineStar).not.toBeNull();
    expect(michelineStar.starRating).toBe(newMichelineStar.starRating);
    expect(michelineStar.awardedDate).toBe(newMichelineStar.awardedDate);
  });

  it('updateMichelineStarOfARestaurant should should throw an exception for an invalid restaurant', async () => {
    const storedMichelineStar: MichelineStarEntity =
      await getStoredMichelineStarRandom();
    const newMichelineStar: MichelineStarEntity = {
      id: storedMichelineStar.id,
      starRating: StarRating.TWO,
      awardedDate: faker.date.past().toString(),
      restaurant: restaurant,
    };
    await expect(() =>
      service.updateMichelineStarOfARestaurant(
        '0',
        newMichelineStar.id,
        newMichelineStar,
      ),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionRestaurantNotFound,
    );
  });

  it('updateMichelineStarOfARestaurant should should throw an exception for an invalid micheline star', async () => {
    const storedMichelineStar: MichelineStarEntity =
      await getStoredMichelineStarRandom();
    const newMichelineStar: MichelineStarEntity = {
      id: storedMichelineStar.id,
      starRating: StarRating.TWO,
      awardedDate: faker.date.past().toString(),
      restaurant: restaurant,
    };
    await expect(() =>
      service.updateMichelineStarOfARestaurant(
        restaurant.id,
        '0',
        newMichelineStar,
      ),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionMichelineStarNotFound,
    );
  });

  it('updateMichelineStarOfARestaurant should should throw an excepetion for an micheline star non associated to the restaurant', async () => {
    const newMichelineStar: MichelineStarEntity = await createMichelineStar();
    await expect(() =>
      service.updateMichelineStarOfARestaurant(
        restaurant.id,
        newMichelineStar.id,
        newMichelineStar,
      ),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionNotAsocciation,
    );
  });

  it('deleteMichelineStarOfARestaurant ahould delete a micheline star from a restaurant', async () => {
    const michelineStar: MichelineStarEntity =
      await getStoredMichelineStarRandom();
    await service.deleteMichelineStarOfARestaurant(
      restaurant.id,
      michelineStar.id,
    );
    const storedRestaurant: RestaurantEntity =
      await restaurantService.findOneBy(restaurant.id, ['michelineStars']);
    const deleteNichelineStar: MichelineStarEntity =
      storedRestaurant.michelineStars.find((a) => a.id === michelineStar.id);
    expect(deleteNichelineStar).toBeUndefined();
  });

  it('deleteMichelineStarOfARestaurant ahould throw an exception for a invalid micheline star', async () => {
    await expect(() =>
      service.deleteMichelineStarOfARestaurant(restaurant.id, '0'),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionMichelineStarNotFound,
    );
  });

  it('deleteMichelineStarOfARestaurant ahould throw an exception for a invalid restaurant', async () => {
    const michelineStar: MichelineStarEntity =
      await getStoredMichelineStarRandom();
    await expect(() =>
      service.deleteMichelineStarOfARestaurant('0', michelineStar.id),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionRestaurantNotFound,
    );
  });

  it('deleteMichelineStarOfARestaurant should throw an excepetion for an micheline star non associated to the restaurant', async () => {
    const michelineStar: MichelineStarEntity = await createMichelineStar();
    await expect(() =>
      service.deleteMichelineStarOfARestaurant(restaurant.id, michelineStar.id),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionNotAsocciation,
    );
  });
});
