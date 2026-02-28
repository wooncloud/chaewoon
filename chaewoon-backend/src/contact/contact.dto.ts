import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from "class-validator";

export class CreateContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;
}
