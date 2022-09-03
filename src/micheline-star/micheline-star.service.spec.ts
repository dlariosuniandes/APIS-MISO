import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MichelineStarEntity } from './micheline-star.entity';
import { MichelineStarService } from './micheline-star.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MichelineStarService', () => {
  let service: MichelineStarService;
  let repository: Repository<MichelineStarEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MichelineStarService],
    }).compile();

    service = module.get<MichelineStarService>(MichelineStarService);
    repository = module.get<Repository<MichelineStarEntity>>(
      getRepositoryToken(MichelineStarEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
