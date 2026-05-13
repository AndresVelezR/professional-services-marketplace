import type {
  LoginPayload,
  Perfil,
  RegistroPayload,
  TokenResponse,
} from "../models";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const message = Object.values(data).flat().join(" ");
    throw new Error(message || "Error desconocido");
  }
  return data as T;
}

export async function validarPassword(password: string, locale: string): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/usuarios/validar-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
    body: JSON.stringify({ password }),
  });
  if (res.status === 204) return [];
  const data = await res.json();
  return (data.errors as string[]) ?? [];
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<TokenResponse>(res);
}

export async function registro(payload: RegistroPayload): Promise<void> {
  const res = await fetch(`${API_URL}/api/usuarios/registro/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse<unknown>(res);
}

export async function getPerfil(token: string): Promise<Perfil> {
  const res = await fetch(`${API_URL}/api/usuarios/perfil/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<Perfil>(res);
}
