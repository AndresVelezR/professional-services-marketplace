"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/infrastructure/auth/AuthContext";

export default function Page() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(token ? "/dashboard" : "/login");
  }, [token, isLoading, router]);

  return null;
}
