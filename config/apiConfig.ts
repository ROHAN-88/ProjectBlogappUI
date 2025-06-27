"use server";

import axios from "axios";
import { cookies } from "next/headers";

const blogApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

blogApiClient.interceptors.request.use(
  async (config) => {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("accesstoken")?.value;

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

blogApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized Request.Token may be Expired");
    }
    return Promise.reject(error);
  }
);

export default blogApiClient;
