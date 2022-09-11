import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from 'src/country/country.entity';
import { CountryModule } from 'src/country/country.module';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureModule } from 'src/culture/culture.module';
import { CultureCountryController } from './culture-country.controller';
import { CultureCountryService } from './culture-country.service';

@Module({
  providers: [CultureCountryService],
  imports: [
    TypeOrmModule.forFeature([CultureEntity, CountryEntity]),
    CultureModule,
    CountryModule,
  ],
  controllers: [CultureCountryController],
})
export class CultureCountryModule {}
