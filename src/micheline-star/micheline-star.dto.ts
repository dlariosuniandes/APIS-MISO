import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StarRating } from '../shared/enums/star-rating.enum';

@InputType()
export class MichelineStarDto {
  @Field()
  @IsEnum(StarRating)
  @IsNotEmpty()
  readonly starRating: StarRating;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly awardedDate: string;
}
