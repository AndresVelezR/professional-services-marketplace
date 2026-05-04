"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

import { getPerfil, login as apiLogin } from "@/features/auth/services/authService"
import type { LoginPayload, Perfil } from "@/features/auth/models"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface AuthState {
  token: string | null
  perfil: Perfil | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
  refreshPerfil: () => Promise<void>
  refreshToken: () => Promise<string>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const access = localStorage.getItem("access_token")
    const refresh = localStorage.getItem("refresh_token")

    if (!access && !refresh) {
      setIsLoading(false)
      return
    }

    const tokenToTry = access ?? ""
    setToken(tokenToTry)

    getPerfil(tokenToTry)
      .then(setPerfil)
      .catch(async () => {
        if (!refresh) {
          localStorage.removeItem("access_token")
          setToken(null)
          setIsLoading(false)
          return
        }
        try {
          const res = await fetch(`${API_URL}/api/auth/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
          })
          if (!res.ok) throw new Error()
          const { access: newAccess } = await res.json()
          localStorage.setItem("access_token", newAccess)
          setToken(newAccess)
          const data = await getPerfil(newAccess)
          setPerfil(data)
        } catch {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          setToken(null)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setToken(null)
    setPerfil(null)
  }, [])

  const refreshToken = useCallback(async (): Promise<string> => {
    const stored = localStorage.getItem("refresh_token")
    if (!stored) throw new Error("No refresh token")
    const res = await fetch(`${API_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: stored }),
    })
    if (!res.ok) {
      logout()
      throw new Error("Session expired")
    }
    const { access } = await res.json()
    localStorage.setItem("access_token", access)
    setToken(access)
    return access
  }, [logout])

  const login = useCallback(async (payload: LoginPayload) => {
    const { access, refresh } = await apiLogin(payload)
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    setToken(access)
    const data = await getPerfil(access)
    setPerfil(data)
  }, [])

  const refreshPerfil = useCallback(async () => {
    if (!token) return
    const data = await getPerfil(token)
    setPerfil(data)
  }, [token])

  return (
    <AuthContext.Provider value={{ token, perfil, isLoading, login, logout, refreshPerfil, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
