import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MichelineStarEntity } from './micheline-star.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MichelineStarService {
  constructor(
    @InjectRepository(MichelineStarEntity)
    private readonly restaurantRepository: Repository<MichelineStarEntity>,
  ) {}
}
