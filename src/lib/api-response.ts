import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiResponsePayload<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
  [key: string]: any;
}

export class ApiResponse {
  static success<T = any>(
    data?: T,
    message?: string,
    status = 200,
    extraFields?: Record<string, any>
  ): NextResponse<ApiResponsePayload<T>> {
    const body: ApiResponsePayload<T> = {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message }),
      ...(extraFields || {}),
    };
    return NextResponse.json(body, { status });
  }

  static error(
    error: string,
    status = 400,
    details?: any
  ): NextResponse<ApiResponsePayload<null>> {
    const body: ApiResponsePayload<null> = {
      success: false,
      error,
      ...(details !== undefined && { details }),
    };
    return NextResponse.json(body, { status });
  }

  static unauthorized(
    error = "Avtorizatsiyadan o'tilmagan"
  ): NextResponse<ApiResponsePayload<null>> {
    return this.error(error, 401);
  }

  static forbidden(
    error = "Ushbu amalni bajarish uchun yetarli ruxsat mavjud emas"
  ): NextResponse<ApiResponsePayload<null>> {
    return this.error(error, 403);
  }

  static notFound(
    error = "So'ralgan ma'lumot topilmadi"
  ): NextResponse<ApiResponsePayload<null>> {
    return this.error(error, 404);
  }

  static zodError(err: ZodError): NextResponse<ApiResponsePayload<null>> {
    return NextResponse.json(
      {
        success: false,
        error: "Kiritilgan ma'lumotlar noto'g'ri",
        details: err.errors,
      },
      { status: 400 }
    );
  }

  static serverError(err: any): NextResponse<ApiResponsePayload<null>> {
    console.error("Server API xatoligi:", err);
    return this.error(
      err?.message || "Ichki server xatoligi yuz berdi",
      500
    );
  }
}
