// create-user-dto.ts
import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly age?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
