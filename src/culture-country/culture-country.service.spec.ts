import { Test, TestingModule } from '@nestjs/testing';
import { CultureCountryService } from './culture-country.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureService } from 'src/culture/culture.service';
import { CountryService } from 'src/country/country.service';
import { CountryEntity } from 'src/country/country.entity';
import { plainToInstance } from 'class-transformer';
import {
  CacheModule,
  ConflictException,
  PreconditionFailedException,
} from '@nestjs/common';

describe('CultureCountryService', () => {
  let cultureCountryProvider: CultureCountryService;
  let cultureProvider: CultureService;
  let countryProvider: CountryService;
  let countryRepository: Repository<CountryEntity>;
  let cultureRepository: Repository<CultureEntity>;
  let countryList: CountryEntity[];
  let cultureList: CultureEntity[];

  const generateCountry = () => {
    const countryDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
    };
    return countryDict;
  };

  const generateCulture = () => {
    const cultureDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
    };
    return cultureDict;
  };

  const seedDatabase = async () => {
    await cultureRepository.clear();
    await countryRepository.clear();
    countryList = [];
    cultureList = [];
    for (let i = 0; i < 5; i++) {
      const country: CountryEntity = await countryRepository.save(
        plainToInstance(CountryEntity, generateCountry()),
      );
      const culture: CultureEntity = await cultureRepository.save(
        plainToInstance(CultureEntity, generateCulture()),
      );
      countryList.push(country);
      cultureList.push(culture);
    }
    countryList[0].culture = cultureList[0];
    countryList[1].culture = cultureList[0];
    countryList.map(async (pr) => await countryRepository.save(pr));
    for (let i = 0; i < countryList.length; i++) {
      countryList[i] = await countryProvider.findOne(countryList[i].id);
    }
    for (let i = 0; i < cultureList.length; i++) {
      cultureList[i] = await cultureProvider.findOne(cultureList[i].id);
    }
    cultureList[0].countries = [countryList[0], countryList[1]];
    cultureList.map(async (cu) => await cultureRepository.save(cu));
    for (let i = 0; i < cultureList.length; i++) {
      cultureList[i] = await cultureProvider.findOne(cultureList[i].id);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultureCountryService, CultureService, CountryService],
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
    }).compile();
    cultureCountryProvider = module.get<CultureCountryService>(
      CultureCountryService,
    );
    cultureProvider = module.get<CultureService>(CultureService);
    countryProvider = module.get<CountryService>(CountryService);
    countryRepository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );
    cultureRepository = module.get<Repository<CultureEntity>>(
      getRepositoryToken(CultureEntity),
    );
    await seedDatabase();
  });

  it('should be defined', async () => {
    expect(cultureCountryProvider).toBeDefined();
  });

  it('should add country to culture', async () => {
    const countryId = countryList[3].id;
    const cultureId = cultureList[1].id;
    await cultureCountryProvider.addCountryToCulture(countryId, cultureId);
    const modifiedCulture: CultureEntity = await cultureProvider.findOne(
      cultureId,
    );
    expect(
      modifiedCulture.countries.find((pr) => pr.id === countryId).id,
    ).toEqual(countryId);
  });

  it('should not add same country to culture twice', async () => {
    const countryId = countryList[0].id;
    const cultureId = cultureList[0].id;
    try {
      await cultureCountryProvider.addCountryToCulture(countryId, cultureId);
    } catch (e) {
      const modifiedCulture: CultureEntity = await cultureProvider.findOne(
        cultureId,
      );
      expect(modifiedCulture.countries.length).toEqual(2);
      expect(e instanceof ConflictException).toBeTruthy();
    }
  });

  it('should associate countries to culture', async () => {
    const cultureId = cultureList[0].id;
    const newCountries: CountryEntity[] = await countryProvider.findAll();
    await cultureCountryProvider.associateCountriesToCulture(
      cultureId,
      newCountries,
    );
    const culture = await cultureProvider.findOne(cultureId);
    expect(culture.countries.length).toEqual(5);
  });

  it('should delete country from culture', async () => {
    const cultureId = cultureList[0].id;
    const countryId = countryList[0].id;
    await cultureCountryProvider.deleteCountryFromCulture(countryId, cultureId);
    const culture: CultureEntity = await cultureProvider.findOne(cultureId);
    expect(culture.countries.length).toEqual(1);
  });

  it('should obtain all culture countries', async () => {
    const cultureId = cultureList[0].id;
    const storedCultureCountries =
      await cultureCountryProvider.findCultureCountries(cultureId);
    expect(cultureList[0].countries.length).toEqual(
      storedCultureCountries.length,
    );
    expect(storedCultureCountries.map((culture) => culture.id)).toEqual(
      cultureList[0].countries.map((culture) => culture.id),
    );
  });

  it('should obtain one specific country from culture', async () => {
    const cultureId = cultureList[0].id;
    const countryId = cultureList[0].countries[0].id;
    const storedCultureCountry: CountryEntity =
      await cultureCountryProvider.findCountryByCultureIdCountryId(
        countryId,
        cultureId,
      );
    expect(storedCultureCountry.id).toEqual(countryId);
  });

  it('should raise an exception if Country Id cannot be found within culture countries', async () => {
    const cultureId = cultureList[0].id;
    const countryId = faker.datatype.uuid();
    try {
      await cultureCountryProvider.findCountryByCultureIdCountryId(
        countryId,
        cultureId,
      );
    } catch (e) {
      expect(e instanceof PreconditionFailedException).toBeTruthy();
    }
  });
});
