const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CalificacionItem {
  id: string;
  calificador_nombre: string;
  calidad: number;
  comunicacion: number;
  puntualidad: number;
  promedio: number;
  comentario: string;
  created_at: string;
}

export interface PromedioCalificaciones {
  total: number;
  promedios: {
    calidad: number;
    comunicacion: number;
    puntualidad: number;
    general: number;
  };
  calificaciones: CalificacionItem[];
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error("Error al cargar calificaciones");
  return data as T;
}

export async function getCalificacionesUsuario(
  usuarioId: string,
): Promise<PromedioCalificaciones> {
  const res = await fetch(
    `${API_URL}/api/calificaciones/usuario/${usuarioId}/`,
    { headers: { Accept: "application/json" } },
  );
  return handleResponse<PromedioCalificaciones>(res);
}
