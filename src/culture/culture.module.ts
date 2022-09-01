import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from './culture.entity';
import { CultureService } from './culture.service';

@Module({
  providers: [CultureService],
  imports: [TypeOrmModule.forFeature([CultureEntity])],
})
export class CultureModule {}
