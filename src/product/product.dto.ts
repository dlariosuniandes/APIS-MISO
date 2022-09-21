import { IsEnum, IsString } from 'class-validator';
import { CategoryEnum } from '../shared/enums/category.enum';

export class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  readonly story: string;

  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  constructor(private categoryEnum: string) {
    this.category = CategoryEnum[categoryEnum];
  }
}
