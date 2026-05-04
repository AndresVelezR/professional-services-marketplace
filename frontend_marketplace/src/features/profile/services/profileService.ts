import type {
  CreateExperienciaPayload,
  Experiencia,
  Habilidad,
  PerfilCompleto,
  UpdatePerfilPayload,
} from "../models";

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

export async function getPerfilCompleto(
  fetcher: typeof fetch,
): Promise<PerfilCompleto> {
  const res = await fetcher(`${API_URL}/api/usuarios/perfil/`, {
    headers: JSON_HEADERS,
  });
  return handleResponse<PerfilCompleto>(res);
}

export async function updatePerfil(
  fetcher: typeof fetch,
  payload: UpdatePerfilPayload,
): Promise<PerfilCompleto> {
  const formData = new FormData();

  if (payload.first_name !== undefined)
    formData.append("first_name", payload.first_name);
  if (payload.last_name !== undefined)
    formData.append("last_name", payload.last_name);
  if (payload.telefono !== undefined)
    formData.append("telefono", payload.telefono);
  if (payload.bio !== undefined) formData.append("bio", payload.bio);
  if (payload.url_portafolio !== undefined)
    formData.append("url_portafolio", payload.url_portafolio);
  if (payload.tipo_usuario !== undefined)
    formData.append("tipo_usuario", payload.tipo_usuario);
  if (payload.foto_perfil) formData.append("foto_perfil", payload.foto_perfil);
  if (payload.habilidad_ids) {
    for (const id of payload.habilidad_ids) {
      formData.append("habilidad_ids", id);
    }
  }

  const res = await fetcher(`${API_URL}/api/usuarios/perfil/`, {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: formData,
  });
  return handleResponse<PerfilCompleto>(res);
}

export async function getHabilidades(): Promise<Habilidad[]> {
  const res = await fetch(`${API_URL}/api/usuarios/habilidades/`, {
    headers: JSON_HEADERS,
  });
  return handleResponse<Habilidad[]>(res);
}

export async function createExperiencia(
  fetcher: typeof fetch,
  payload: CreateExperienciaPayload,
): Promise<Experiencia> {
  const res = await fetcher(`${API_URL}/api/usuarios/experiencias/`, {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Experiencia>(res);
}

export async function updateExperiencia(
  fetcher: typeof fetch,
  id: string,
  payload: Partial<CreateExperienciaPayload>,
): Promise<Experiencia> {
  const res = await fetcher(`${API_URL}/api/usuarios/experiencias/${id}/`, {
    method: "PATCH",
    headers: {
      ...JSON_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Experiencia>(res);
}

export async function deleteExperiencia(
  fetcher: typeof fetch,
  id: string,
): Promise<void> {
  const res = await fetcher(`${API_URL}/api/usuarios/experiencias/${id}/`, {
    method: "DELETE",
    headers: JSON_HEADERS,
  });
  if (!res.ok) {
    throw new Error(`Error al eliminar experiencia (${res.status})`);
  }
}
