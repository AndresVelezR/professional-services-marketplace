import type { PerfilPublico } from "../models";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const JSON_HEADERS = { Accept: "application/json" };

async function handleResponse<T>(res: Response): Promise<T> {
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    if (res.ok) return {} as T;
    throw new Error(`Error del servidor (${res.status})`);
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null
        ? Object.values(data).flat().join(" ")
        : "Error desconocido";
    throw new Error(message);
  }
  return data as T;
}

export async function getPerfilPublico(
  fetcher: typeof fetch,
  userId: string,
): Promise<PerfilPublico> {
  const res = await fetcher(
    `${API_URL}/api/usuarios/${userId}/perfil-publico/`,
    { headers: JSON_HEADERS },
  );
  return handleResponse<PerfilPublico>(res);
}
