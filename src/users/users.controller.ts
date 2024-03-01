import {
  Body,
  Controller,
  HttpCode,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { SessionUser } from 'src/auth/decorators/sessionuser.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @JwtAuth()
  @Put('update-data')
  async updateUserData(
    @SessionUser('email') email: string,
    @Body() body: UpdateUserDto,
  ) {
    return await this.usersService.updateUserDataAsync(email, body);
  }
}
