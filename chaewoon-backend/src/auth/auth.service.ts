import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30분

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { username } });

    if (!admin) {
      throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    // 계정 잠금 확인
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const remainMs = admin.lockedUntil.getTime() - Date.now();
      const remainMin = Math.ceil(remainMs / 60000);
      throw new ForbiddenException(
        `계정이 잠겨있습니다. ${remainMin}분 후에 다시 시도해주세요.`,
      );
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      const attempts = admin.failedAttempts + 1;
      const updateData: { failedAttempts: number; lockedUntil?: Date } = {
        failedAttempts: attempts,
      };

      if (attempts >= MAX_FAILED_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
      }

      await this.prisma.admin.update({
        where: { id: admin.id },
        data: updateData,
      });

      if (attempts >= MAX_FAILED_ATTEMPTS) {
        throw new ForbiddenException(
          "로그인 시도 횟수를 초과했습니다. 30분 후에 다시 시도해주세요.",
        );
      }

      throw new UnauthorizedException(
        `아이디 또는 비밀번호가 올바르지 않습니다. (${attempts}/${MAX_FAILED_ATTEMPTS})`,
      );
    }

    // 성공 → 실패 횟수 초기화
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });

    // JWT 생성
    const token = await this.jwtService.signAsync({
      sub: admin.id,
      username: admin.username,
    });

    return { token, admin: { id: admin.id, username: admin.username } };
  }

  async getMe(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, username: true },
    });

    if (!admin) {
      throw new UnauthorizedException("유효하지 않은 계정입니다.");
    }

    return admin;
  }

  async createAdmin(username: string, password: string) {
    const existing = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (existing) {
      throw new BadRequestException("이미 존재하는 아이디입니다.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await this.prisma.admin.create({
      data: { username, passwordHash },
      select: { id: true, username: true, createdAt: true },
    });

    return admin;
  }

  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const admin = await this.prisma.admin.findUnique({ where: { username } });

    if (!admin) {
      throw new BadRequestException("존재하지 않는 아이디입니다.");
    }

    const isValid = await bcrypt.compare(oldPassword, admin.passwordHash);
    if (!isValid) {
      throw new BadRequestException("기존 비밀번호가 올바르지 않습니다.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash, failedAttempts: 0, lockedUntil: null },
    });

    return { message: "비밀번호가 변경되었습니다." };
  }
}
