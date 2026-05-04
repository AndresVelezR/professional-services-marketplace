import type { Contrato, Propuesta, PropuestaCreate, Review, ReviewCreate } from "../models"

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

export async function getMisContratos(fetcher: typeof fetch): Promise<Contrato[]> {
  const res = await fetcher(`${API_URL}/api/contratos/contratos/`, {
    headers: { Accept: "application/json" },
  })
  return handleResponse<Contrato[]>(res)
}

export async function getContrato(id: string, fetcher: typeof fetch): Promise<Contrato> {
  const res = await fetcher(`${API_URL}/api/contratos/contratos/${id}/`, {
    headers: { Accept: "application/json" },
  })
  return handleResponse<Contrato>(res)
}

export async function createPropuesta(
  publicacionId: string,
  payload: PropuestaCreate,
  fetcher: typeof fetch,
): Promise<Propuesta> {
  const res = await fetcher(
    `${API_URL}/api/contratos/propuestas/publicacion/${publicacionId}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
  )
  return handleResponse<Propuesta>(res)
}

export async function getMisPropuestasEnviadas(fetcher: typeof fetch): Promise<Propuesta[]> {
  const res = await fetcher(`${API_URL}/api/contratos/propuestas/enviadas/`, {
    headers: { Accept: "application/json" },
  })
  return handleResponse<Propuesta[]>(res)
}

export async function getMisPropuestasRecibidas(fetcher: typeof fetch): Promise<Propuesta[]> {
  const res = await fetcher(`${API_URL}/api/contratos/propuestas/recibidas/`, {
    headers: { Accept: "application/json" },
  })
  return handleResponse<Propuesta[]>(res)
}

export async function responderPropuesta(
  id: string,
  estado: "aceptada" | "rechazada",
  fetcher: typeof fetch,
): Promise<Propuesta> {
  const res = await fetcher(`${API_URL}/api/contratos/propuestas/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ estado }),
  })
  return handleResponse<Propuesta>(res)
}

export async function updateContratoEstado(
  id: string,
  estado: "completado" | "cancelado",
  fetcher: typeof fetch,
): Promise<Contrato> {
  const res = await fetcher(`${API_URL}/api/contratos/contratos/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ estado }),
  })
  return handleResponse<Contrato>(res)
}

export async function createReview(
  payload: ReviewCreate,
  token: string,
): Promise<Review> {
  const res = await fetch(`${API_URL}/api/calificaciones/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<Review>(res)
}