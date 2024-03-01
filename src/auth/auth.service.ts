import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'prisma/generated/client';
import { TokenService } from 'src/services/token-service/token-service.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { RegisterDto } from 'src/users/dto/register.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}

  async getUserSessionAsync(email: string) {
    const user = await this.userService.getByEmailAsync(email);
    if (!user) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, hashPassword, id, ...result } = user;
    if (!refreshToken) throw new UnauthorizedException('User is unauthorized');
    return result;
  }

  async loginAsync(body: LoginDto) {
    const usr = await this.userService.validateUserAsync(
      body.email,
      body.password,
    );
    if (!usr) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashPassword, refreshToken, id, ...user } = usr;
    const accessToken = this.tokenService.issueAccessToken(user.email);
    const refreshNewToken = this.tokenService.issueRefreshToken();
    await this.userService.updateUserRefreshTokenAsync(
      refreshNewToken,
      user.email,
    );
    return {
      user: user,
      accessToken,
      refreshToken: refreshNewToken,
    };
  }

  async registerAsync(body: RegisterDto) {
    const oldUser = await this.userService.getByEmailAsync(body.email);
    if (oldUser) throw new BadRequestException('User already exists');
    const refreshGenerateToken = this.tokenService.issueRefreshToken();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashPassword, refreshToken, id, ...user } =
      await this.userService.createUserAsync(
        body,
        refreshGenerateToken,
        Role.CUSTOMER,
      );
    const accessToken = this.tokenService.issueAccessToken(user.email);
    return {
      user: user,
      accessToken,
      refreshToken,
    };
  }

  async refreshTokenAsync(access_token: string, refresh_token: string) {
    try {
      const decodeAccessToken =
        await this.tokenService.decodeToken(access_token);
      if (!decodeAccessToken)
        throw new BadRequestException('Token is not valid');

      const usr = await this.userService.getByEmailAsync(
        decodeAccessToken.email,
      );
      if (!usr) throw new NotFoundException('User not found');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashPassword, refreshToken, id, ...user } = usr;

      const refreshTokenResult =
        await this.tokenService.verifyToken(refresh_token);
      if (!refreshTokenResult || refreshToken !== refresh_token)
        throw new UnauthorizedException('Token is expired');

      // Revalidated rtoken auto / 3h valid per refresh is permanent account logged
      // const newRefreshToken = this.tokenService.issueRefreshToken();
      // const updateUserResult =
      //   await this.userService.updateUserRefreshTokenAsync(
      //     newRefreshToken,
      //     user.email,
      //   );
      // if (!updateUserResult) throw new BadRequestException('Token not updated');
      const newAccessToken = this.tokenService.issueAccessToken(user.email);
      return {
        user: user,
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid tokens');
    }
  }

  async logoutAsync(email: string) {
    const user = await this.userService.getByEmailAsync(email);
    if (!user) throw new BadRequestException('User not found');

    await this.userService.updateUserRefreshTokenAsync(null, email);
  }
}
