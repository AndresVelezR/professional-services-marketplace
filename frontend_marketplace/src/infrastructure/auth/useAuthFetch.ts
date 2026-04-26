"use client"

import { useCallback } from "react"

import { authFetch, type AuthFetchOptions } from "./authFetch"
import { useAuth } from "./AuthContext"

type BoundFetchOptions = Omit<AuthFetchOptions, "token" | "onRefresh" | "onLogout">

export function useAuthFetch() {
  const { token, refreshToken, logout } = useAuth()

  return useCallback(
    (url: string, options: BoundFetchOptions = {}): Promise<Response> => {
      if (!token) return Promise.reject(new Error("Not authenticated"))
      return authFetch(url, {
        ...options,
        token,
        onRefresh: refreshToken,
        onLogout: logout,
      })
    },
    [token, refreshToken, logout],
  ) as typeof fetch
}
