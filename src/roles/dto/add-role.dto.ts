import { IsEmail, IsString } from 'class-validator';
import { Role } from 'prisma/generated/client';

export class AddRoleDto {
  @IsString()
  role: Role;

  @IsString()
  @IsEmail()
  userEmail: string;
}
