import { IsEnum, IsString } from 'class-validator';
import { CategoryEnum } from '../shared/enums/category.enum';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProductDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  readonly story: string;

  @Field()
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  constructor(private categoryEnum: string) {
    this.category = CategoryEnum[categoryEnum];
  }
}
