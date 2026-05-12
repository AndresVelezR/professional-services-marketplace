export interface ImagenPublicacion {
  id: string;
  url: string;
  orden: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PublicacionListItem {
  id: string;
  titulo: string;
  categoria: string;
  precio: string;
  tiempo_entrega: string;
  creador: {
    nombre_completo: string;
    iniciales: string;
  };
  imagenes: ImagenPublicacion[];
  created_at: string;
}

export interface PublicacionDetail extends PublicacionListItem {
  descripcion: string;
  incluye: string[];
  estado: string;
  creador: {
    nombre_completo: string;
    iniciales: string;
    email: string;
    first_name: string;
    last_name: string;
    bio: string;
    tipo_usuario: string;
  };
  updated_at: string;
}

export interface CreatePublicacionPayload {
  titulo: string;
  descripcion: string;
  categoria: string;
  precio: number;
  tiempo_entrega: string;
  incluye: string[];
  estado?: string;
  imagenes?: File[];
}

export interface PublicacionFilters {
  q?: string;
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  ordering?: string;
  page?: number;
}
