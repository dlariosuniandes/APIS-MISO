import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './country.controller';
import { CountryEntity } from './country.entity';
import { CountryService } from './country.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity]), AuthModule],
  providers: [CountryService],
  exports: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
