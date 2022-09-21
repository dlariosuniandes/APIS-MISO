import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MichelineStarEntity } from './micheline-star.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class MichelineStarService {
  constructor(
    @InjectRepository(MichelineStarEntity)
    private readonly michelineStarRepository: Repository<MichelineStarEntity>,
  ) {}

  private messageExcepetionMichelineStarNotFound =
    'The Micheline Star with the given id was not found';

  async create(
    michelineStar: MichelineStarEntity,
  ): Promise<MichelineStarEntity> {
    return await this.michelineStarRepository.save(michelineStar);
  }

  async findOneBy(id: string): Promise<MichelineStarEntity> {
    const michelineStar: MichelineStarEntity =
      await this.michelineStarRepository.findOne({
        where: { id },
      });
    if (!michelineStar) await this.#handleNotFoundMichelineStar();
    return michelineStar;
  }

  async #handleNotFoundMichelineStar() {
    throw new BusinessLogicException(
      this.messageExcepetionMichelineStarNotFound,
      BusinessError.NOT_FOUND,
    );
  }
}
