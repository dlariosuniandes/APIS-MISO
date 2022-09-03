import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(RecipeEntity)
        private readonly cultureRepository: Repository<RecipeEntity>,
    ){}
}
