import { NextResponse } from "next/server";

export function apiSuccessResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    status: "success",
    ...(message ? { message } : {}),
    data,
  });
}

export function apiErrorResponse(error: string, status = 500) {
  return NextResponse.json(
    {
      status: "error",
      error,
    },
    { status }
  );
}
