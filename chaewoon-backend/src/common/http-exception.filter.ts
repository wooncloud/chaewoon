import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import type { ApiErrorResponse } from "chaewoon-shared";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    let message = "서버 오류가 발생했습니다.";
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === "string") {
        message = body;
      } else if (typeof body === "object" && body !== null) {
        const obj = body as Record<string, unknown>;
        // ValidationPipe 에러: message가 배열
        if (Array.isArray(obj.message)) {
          errors = obj.message as string[];
          message = "입력값을 확인해주세요.";
        } else if (typeof obj.message === "string") {
          message = obj.message;
        }
      }
    } else {
      console.error("Unhandled exception:", exception);
    }

    const errorResponse: ApiErrorResponse = {
      statusCode,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorResponse);
  }
}
