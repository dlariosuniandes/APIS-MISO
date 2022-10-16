import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CultureRestaurantDto {
  @Field()
  @IsString()
  readonly id: string;
}
