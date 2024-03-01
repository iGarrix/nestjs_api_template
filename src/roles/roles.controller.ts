import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from 'prisma/generated/client';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { UsersService } from 'src/users/users.service';
import { Roles } from './decorators/roles.decorator';
import { AddRoleDto } from './dto/add-role.dto';
import { RemoveRoleDto } from './dto/remove-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private roleService: RolesService,
    private userService: UsersService,
  ) {}

  @HttpCode(201)
  @JwtAuth()
  @Roles([Role.ADMIN])
  @UsePipes(new ValidationPipe())
  @Post('add-role')
  async addRole(@Body() body: AddRoleDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...role } = await this.userService.addRoleToUser(body);
    return role;
  }

  @HttpCode(201)
  @JwtAuth()
  @Roles([Role.ADMIN])
  @UsePipes(new ValidationPipe())
  @Delete('remove-role')
  async removeRole(@Body() body: RemoveRoleDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isRemoved = await this.userService.removeRoleFromUser(body);
    return isRemoved;
  }
}
