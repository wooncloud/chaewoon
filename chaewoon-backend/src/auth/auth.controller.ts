import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AdminGuard } from "./auth.guard";
import { LoginDto, SetupDto, ChangePasswordDto } from "./auth.dto";

const COOKIE_NAME = "admin_token";
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24시간

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.username, dto.password);

    res.cookie(COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return { success: true, admin: result.admin };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    return { success: true };
  }

  @Get("me")
  @UseGuards(AdminGuard)
  async me(@Req() req: Request) {
    const payload = (req as any).admin;
    return this.authService.getMe(payload.sub);
  }

  @Post("setup")
  async setup(
    @Headers("x-admin-secret") secret: string,
    @Body() dto: SetupDto,
  ) {
    this.validateAdminSecret(secret);
    return this.authService.createAdmin(dto.username, dto.password);
  }

  @Patch("password")
  async changePassword(
    @Headers("x-admin-secret") secret: string,
    @Body() dto: ChangePasswordDto,
  ) {
    this.validateAdminSecret(secret);
    return this.authService.changePassword(
      dto.username,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  private validateAdminSecret(secret: string) {
    const setupKey = process.env.ADMIN_SETUP_KEY;
    if (!setupKey || secret !== setupKey) {
      throw new UnauthorizedException("유효하지 않은 접근입니다.");
    }
  }
}
