import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { DeleteResult } from 'typeorm';
import { CountryDto } from './country.dto';
import { CountryEntity } from './country.entity';
import { CountryService } from './country.service';

@Resolver()
export class CountryResolver {
  constructor(private countryService: CountryService) {}

  @Query(() => [CountryEntity])
  countrys(): Promise<CountryEntity[]> {
    return this.countryService.findAll();
  }

  @Query(() => CountryEntity)
  country(@Args('id') id: string): Promise<CountryEntity> {
    return this.countryService.findOne(id);
  }

  @Mutation(() => CountryEntity)
  createCountry(
    @Args('country') countryDto: CountryDto,
  ): Promise<CountryEntity> {
    const country = plainToInstance(CountryEntity, countryDto);
    return this.countryService.create(country);
  }

  @Mutation(() => CountryEntity)
  updateCountry(
    @Args('id') id: string,
    @Args('country')
    countryDto: CountryDto,
  ): Promise<CountryEntity> {
    const country = plainToInstance(CountryEntity, countryDto);
    return this.countryService.update(id, country);
  }

  @Mutation(() => CountryEntity)
  deleteCountry(@Args('id') id: string): Promise<DeleteResult> {
    return this.countryService.delete(id);
  }
}
