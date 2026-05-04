import type { Conversacion, ConversacionDetalle } from "../models"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handleResponse<T>(res: Response): Promise<T> {
  let data: unknown
  try {
    data = await res.json()
  } catch {
    if (res.ok) return {} as T
    throw new Error(`Error del servidor (${res.status})`)
  }
  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null
        ? Object.values(data).flat().join(" ")
        : "Error desconocido"
    throw new Error(message)
  }
  return data as T
}

export async function getMisConversaciones(fetcher: typeof fetch): Promise<Conversacion[]> {
  const res = await fetcher(`${API_URL}/api/chat/conversaciones/`, {
    headers: { Accept: "application/json" },
  })
  return handleResponse<Conversacion[]>(res)
}

export async function getConversacion(id: string, fetcher: typeof fetch): Promise<ConversacionDetalle> {
  const res = await fetcher(`${API_URL}/api/chat/conversaciones/${id}/`, {
    headers: { Accept: "application/json" },
  })
  return handleResponse<ConversacionDetalle>(res)
}

export async function obtenerOCrearConversacion(
  contratoId: string,
  fetcher: typeof fetch,
): Promise<ConversacionDetalle> {
  const res = await fetcher(`${API_URL}/api/chat/conversaciones/contrato/${contratoId}/`, {
    method: "POST",
    headers: { Accept: "application/json" },
  })
  return handleResponse<ConversacionDetalle>(res)
}
