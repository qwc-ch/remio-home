/*
 * @Author: kasuie
 * @Date: 2025-06-18 16:00:00
 * @Description: Music proxy for Meting API
 */
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({
      data: [],
      success: false,
      message: "missing url",
    });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://music.163.com/",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({
        data: [],
        success: false,
        message: `HTTP ${res.status}`,
      });
    }

    const data = await res.json();
    return NextResponse.json({ data, success: true, message: "success" });
  } catch (e) {
    console.log("music proxy error:", e);
    return NextResponse.json({
      data: [],
      success: false,
      message: "proxy error",
    });
  }
};
