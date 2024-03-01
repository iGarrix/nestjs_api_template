import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { Role } from 'prisma/generated/client';
import { PrismaService } from 'src/prisma.service';
import { AddRoleDto } from 'src/roles/dto/add-role.dto';
import { RemoveRoleDto } from 'src/roles/dto/remove-role.dto';
import { RolesService } from 'src/roles/roles.service';
import { TokenService } from 'src/services/token-service/token-service.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private roles: RolesService,
    private tokenService: TokenService,
  ) {}

  async getByIdAsync(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        UserRole: {
          select: {
            role: true,
          },
        },
      },
    });
    return user;
  }

  async getByEmailAsync(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        UserRole: {
          select: {
            role: true,
          },
        },
      },
    });
    return user;
  }

  async createUserAsync(dto: RegisterDto, refreshToken?: string, role?: Role) {
    const user = {
      email: dto.email,
      hashPassword: await hash(dto.password),
      refreshToken: refreshToken || null,
    };
    const newUser = await this.prisma.user.create({
      data: user,
      include: {
        UserRole: {
          select: {
            role: true,
          },
        },
      },
    });
    try {
      await this.roles.addRoleAsync(role ? role : Role.CUSTOMER, newUser.id);
    } catch (error) {
    } finally {
      return await this.getByIdAsync(newUser.id);
    }
  }

  async updateUserDataAsync(email: string, body: UpdateUserDto) {
    const user = await this.getByEmailAsync(email);
    if (!user) throw new NotFoundException('User not found');
    if (body.password && body.newPassword) {
      const isValid = await verify(user.hashPassword, body.password);
      if (!isValid) {
        throw new UnauthorizedException('Password is invalid');
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, hashPassword, id, ...updated } =
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: body.email,
          hashPassword: body.newPassword && (await hash(body.newPassword)),
        },
        include: {
          UserRole: {
            select: {
              role: true,
            },
          },
        },
      });
    const accessToken = this.tokenService.issueAccessToken(updated.email);
    return {
      user: updated,
      accessToken,
      refreshToken,
    };
  }

  async updateUserRefreshTokenAsync(token: string, email: string) {
    try {
      const result = await this.prisma.user.update({
        where: { email: email },
        data: { refreshToken: token },
      });
      if (result) return true;
    } catch (error) {
      return false;
    }
  }

  async addRoleToUser(dto: AddRoleDto) {
    const user = await this.getByEmailAsync(dto.userEmail);
    if (!user) throw new NotFoundException('User not found');
    return await this.roles.addRoleAsync(
      dto.role === 'ADMIN' ? Role.ADMIN : Role.CUSTOMER,
      user.id,
    );
  }

  async removeRoleFromUser(dto: RemoveRoleDto) {
    const user = await this.getByEmailAsync(dto.userEmail);
    if (!user) throw new NotFoundException('User not found');
    const role: Role | null =
      dto.role === 'CUSTOMER'
        ? Role.CUSTOMER
        : dto.role === 'ADMIN'
          ? Role.ADMIN
          : null;
    if (!role) throw new NotFoundException(`Role is invalid`);
    return await this.roles.removeRoleAsync(role, user.id);
  }

  async validateUserAsync(email: string, password: string) {
    const user = await this.getByEmailAsync(email);
    if (!user) throw new NotFoundException('User not found');
    const isValid = await verify(user.hashPassword, password);

    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user;
  }
}
