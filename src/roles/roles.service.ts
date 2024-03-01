import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'prisma/generated/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async addRoleAsync(role: Role, userId: string) {
    const findRole = await this.prisma.userRole.findFirst({
      where: {
        userId: userId,
        role: role,
      },
    });
    if (findRole)
      throw new BadRequestException(`User already has ${findRole.role} role`);
    return await this.prisma.userRole.create({
      data: {
        userId: userId,
        role: role,
      },
    });
  }

  async removeRoleAsync(role: Role, userId: string) {
    const findRole = await this.prisma.userRole.findFirst({
      where: {
        userId: userId,
        role: role,
      },
    });
    if (!findRole)
      throw new BadRequestException(`User hasn't got ${role} role`);

    await this.prisma.userRole.delete({
      where: {
        id: findRole.id,
      },
    });
    return true;
  }
}
