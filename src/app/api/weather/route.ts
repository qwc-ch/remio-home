/*
 * @Author: kasuie
 * @Date: 2024-08-15 23:26:15
 * @LastEditors: kasuie
 * @LastEditTime: 2024-10-21 21:11:18
 * @Description:
 */
import { onAmap } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

const AMAP_KEY = process.env.AMAP_KEY;

export const GET = async (req: NextRequest) => {
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for");
  const clientIp = ip != "::1" && ip != null ? ip : undefined;

  if (!AMAP_KEY) {
    try {
      const res = await fetch("https://uapis.cn/api/v1/misc/weather", {
        headers: { "User-Agent": "curl/7.88" },
      });
      const data = await res.json();
      if (data?.city) {
        return NextResponse.json({
          data: {
            apiKey: "uapis",
            city: data.city,
            weather: data.weather,
            temperature: data.temperature,
            humidity: data.humidity,
            winddirection: data.wind_direction,
            windpower: data.wind_power,
            reporttime: data.report_time,
          },
          success: true,
          message: "success",
        });
      }
    } catch (e) {
      console.log("uapis error:", e);
    }
    return NextResponse.json({
      data: "error: weather",
      success: false,
      message: "fail",
    });
  }

  const resIp: any =
    (await onAmap(
      "ip",
      {
        ip: clientIp,
      },
      req.headers
    )) || {};

  if (resIp?.status != "1")
    return NextResponse.json({
      data: "error: ip",
      success: false,
      message: "fail",
    });

  const resWea: any = await onAmap(
    "weather",
    {
      city: resIp.adcode,
    },
    req.headers
  );

  if (resWea?.status != "1")
    return NextResponse.json({
      data: "error: weather",
      success: false,
      message: "fail",
    });

  return NextResponse.json({
    data: resWea?.lives?.length && { apiKey: "amap", ...resWea?.lives[0] },
    success: true,
    message: "success",
  });
};
