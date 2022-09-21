import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StarRating } from '../shared/enums/star-rating.enum';

export class MichelineStarDto {
  @IsEnum(StarRating)
  @IsNotEmpty()
  readonly starRating: StarRating;

  @IsString()
  @IsNotEmpty()
  readonly awardedDate: string;
}
