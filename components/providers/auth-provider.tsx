"use client";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    try {
      const isLoggedIn = document.cookie
        .split("; ")
        .find((row) => row.startsWith("loggedIn="))
        ?.split("=")[1];

      if (isLoggedIn && isLoggedIn === "True") {
        router.replace("/");

        setIsLoading(false);
      } else {
        console.error("Your Token is Expired");
        router.replace("/login");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in AuthProvider", error);
      router.replace("/login");
    }
  }, [router]);

  if (isLoading) return null;
  return <>{children}</>;
};
