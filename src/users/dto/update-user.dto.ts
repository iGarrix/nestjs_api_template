import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(16, {
    message: 'Password must be less then or 16 characters long',
  })
  password?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(16, {
    message: 'Password must be less then or 16 characters long',
  })
  newPassword?: string;
}
