import { sensorDb } from "@/server/db/sensor/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // ⭐ Get token from URL
  const token = req.nextUrl.searchParams.get("token");

  // ⭐ Compare with env
  if (token !== process.env.CRON_SECRET_KEY) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ⭐ Delete older than 30 days
    const result = await sensorDb.sensorReading.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return NextResponse.json({
      ok: true,
      deleted: result.count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
