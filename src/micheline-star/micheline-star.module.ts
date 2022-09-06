import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelineStarEntity } from './micheline-star.entity';
import { MichelineStarService } from './micheline-star.service';

@Module({
  imports: [TypeOrmModule.forFeature([MichelineStarEntity])],
  providers: [MichelineStarService],
  exports: [MichelineStarService],
})
export class MichelineStarModule {}
