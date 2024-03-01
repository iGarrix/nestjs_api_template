import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import isJwtTokenExpired from 'jwt-check-expiry';

@Injectable()
export class TokenService {
  constructor(private jwt: JwtService) {}
  checkExpiration(token: string) {
    const { isForever } = this.jwt.decode(token);
    if (isForever) {
      return false;
    }
    return isJwtTokenExpired(token);
  }
  decodeToken(token: string) {
    return this.jwt.decode(token);
  }
  issueAccessToken(userEmail: string) {
    const data = { email: userEmail };
    const accessToken = this.jwt.sign(data, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
    return accessToken;
  }
  issueRefreshToken() {
    const data = { email: 'generate_refresh' };
    const refreshToken = this.jwt.sign(data, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });
    return refreshToken;
  }
  verifyToken(token: string) {
    return this.jwt.verify(token);
  }
}
