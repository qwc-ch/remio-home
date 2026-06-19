"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SunFill = dynamic(async () => (await import("@kasuie/icon")).SunFill);
const CloudSun = dynamic(async () => (await import("@kasuie/icon")).CloudSun);
const CloudSunRain = dynamic(
  async () => (await import("@kasuie/icon")).CloudSunRain
);
const Snowflake = dynamic(async () => (await import("@kasuie/icon")).Snowflake);
const CloudMoon = dynamic(async () => (await import("@kasuie/icon")).CloudMoon);
const CloudMoonRain = dynamic(
  async () => (await import("@kasuie/icon")).CloudMoonRain
);
const CloudRain = dynamic(async () => (await import("@kasuie/icon")).CloudRain);
const CloudBolt = dynamic(async () => (await import("@kasuie/icon")).CloudBolt);
const Hurricane = dynamic(async () => (await import("@kasuie/icon")).Hurricane);
const Smog = dynamic(async () => (await import("@kasuie/icon")).Smog);
const Wind = dynamic(async () => (await import("@kasuie/icon")).Wind);
const CloudMeatball = dynamic(
  async () => (await import("@kasuie/icon")).CloudMeatball
);
const CloudShowersHeavy = dynamic(
  async () => (await import("@kasuie/icon")).CloudShowersHeavy
);

const CACHE_KEY = "weather_data_cache";
const CACHE_DURATION = 30 * 60 * 1000;

export const Weather = ({ size = 18 }: { size: number }) => {
  const [weatherInfo, setWeatherInfo] = useState<Record<string, string>>();

  const fetchWeather = async () => {
    try {
      const res = await fetch("https://uapis.cn/api/v1/misc/weather");
      const data = await res.json();
      if (data?.city) {
        const info = {
          city: data.city,
          weather: data.weather,
          temperature: data.temperature,
          humidity: data.humidity,
          winddirection: data.wind_direction,
          windpower: data.wind_power,
          reporttime: data.report_time,
        };
        setWeatherInfo(info);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: info, time: Date.now() }));
        } catch {}
      }
    } catch (e) {
      console.log("weather error:", e);
    }
  };

  const renderIcon = (weather: string) => {
    const props = { size, color: "#fff" };
    const hours = new Date().getHours();
    const isDay = hours > 6 && hours < 19;
    if (["多云"].includes(weather)) {
      return isDay ? <CloudSun {...props} /> : <CloudMoon {...props} />;
    } else if (["雨", "小雨", "中雨", "大雨", "暴雨", "阵雨"].includes(weather)) {
      return isDay ? <CloudSunRain {...props} /> : <CloudMoonRain {...props} />;
    } else if (["雪", "小雪", "中雪", "大雪"].includes(weather)) {
      return <Snowflake {...props} />;
    } else if (["雷阵雨"].includes(weather)) {
      return <CloudBolt {...props} />;
    } else if (["雾", "霾"].includes(weather)) {
      return <Smog {...props} />;
    } else if (["大风"].includes(weather)) {
      return <Wind {...props} />;
    } else {
      return isDay ? <SunFill {...props} /> : <CloudMoon {...props} />;
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, time } = JSON.parse(cached);
        if (Date.now() - time < CACHE_DURATION) {
          setWeatherInfo(data);
          return;
        }
      }
    } catch {}
    fetchWeather();
  }, []);

  if (!weatherInfo) return null;

  return (
    <div
      style={{ backgroundColor: "rgba(var(--mio-main), 0.1)" }}
      className="fixed right-4 top-4 z-10 flex select-none items-center gap-2 rounded-md px-2 py-1 backdrop-blur"
    >
      <div className="flex items-center text-white">
        <span className="text-xs">
          {weatherInfo?.city?.replace("市", "")}
        </span>
        <span>·</span>
        <span className="text-xs">
          {weatherInfo?.temperature}
          <sup>℃</sup>
        </span>
      </div>
      {weatherInfo && renderIcon(weatherInfo.weather)}
    </div>
  );
};
