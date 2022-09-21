import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RecipeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  preparation: string;

  @IsUrl()
  @IsNotEmpty()
  url_photo: string;

  @IsUrl()
  @IsNotEmpty()
  url_video: string;
}
