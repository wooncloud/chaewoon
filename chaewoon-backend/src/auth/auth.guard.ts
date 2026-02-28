import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.["admin_token"];

    if (!token) {
      throw new UnauthorizedException("인증이 필요합니다.");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      (request as any).admin = payload;
      return true;
    } catch {
      throw new UnauthorizedException("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  }
}
