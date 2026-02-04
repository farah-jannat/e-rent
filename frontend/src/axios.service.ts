import { config } from "@/config";
import axios, { type AxiosInstance } from "axios";

export const apiService = (serviceRelativePath: string): AxiosInstance => {
    console.log("config.api from api service", config.API_GATEWAY_URL)
  const instance = axios.create({
    baseURL: config.API_GATEWAY_URL + serviceRelativePath,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
  });
  return instance;
};

export const auth__axios = apiService("/auth");
export const flat__axios = apiService("/flat")
export const tenant__axios = apiService("/tenant")