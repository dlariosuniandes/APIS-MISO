import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CountryDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
