import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StarRating } from './micheline-star.entity';

export class MichelineStarDto {
  @IsEnum(StarRating)
  @IsNotEmpty()
  readonly starRating: StarRating;

  @IsString()
  @IsNotEmpty()
  readonly awardedDate: string;
}
