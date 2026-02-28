import { IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class SetupDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  username: string;

  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
