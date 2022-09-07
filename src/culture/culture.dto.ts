import { IsNotEmpty, IsString } from 'class-validator';

export class CultureDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
