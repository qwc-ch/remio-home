import { createContext, useContext } from "react";
import type { AppConfig } from "@/config";

export const ConfigProvider = createContext<{ appConfig: AppConfig }>({
  appConfig: {} as AppConfig,
});

export const useAppConfig = () => useContext(ConfigProvider);