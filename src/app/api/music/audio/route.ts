/*
 * @Author: kasuie
 * @Date: 2025-06-18 16:00:00
 * @Description: Audio proxy for NetEase music streams
 */
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "missing url" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://music.163.com/",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `HTTP ${res.status}` }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "audio/mpeg";
    const contentLength = res.headers.get("content-length");

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        ...(contentLength ? { "Content-Length": contentLength } : {}),
      },
    });
  } catch (e) {
    console.log("audio proxy error:", e);
    return NextResponse.json({ error: "proxy error" }, { status: 502 });
  }
};
