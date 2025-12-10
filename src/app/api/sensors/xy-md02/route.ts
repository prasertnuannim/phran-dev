import { NextRequest, NextResponse } from "next/server";
import { fail, ok } from "@/server/utils/Response";
import { AnyError } from "@/types/errors";
import { SensorReadingService } from "@/server/services/sensorReadingService";
import { RateLimiter } from "@/server/security/rateLimiter";

const limiter = RateLimiter(30, 60); // 30 req/min per device

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.SMART_HOME_API_KEY) {
      return NextResponse.json(
        fail({
          status: 401,
          message: "Unauthorized - Invalid API Key",
          type: "UNAUTHORIZED",
        }),
        { status: 401 }
      );
    }
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    await limiter.check(ip);
    const json = await req.json();
    const result = await SensorReadingService.createReading(json);

    return NextResponse.json(ok(result));

  } catch (error: unknown) {
    const err = error as AnyError;
    return NextResponse.json(fail(err), { status: err.status ?? 500 });
  }
}
