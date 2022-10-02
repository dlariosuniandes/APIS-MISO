import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType()
export class RecipeDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  preparation: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  url_photo: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  url_video: string;
}
