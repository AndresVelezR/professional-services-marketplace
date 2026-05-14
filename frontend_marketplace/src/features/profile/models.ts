export interface Habilidad {
  id: string;
  nombre: string;
}

export interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  ubicacion: string;
}

export interface PerfilCompleto {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  nombre_completo: string;
  telefono: string;
  bio: string;
  url_portafolio: string;
  tipo_usuario: string;
  foto_perfil_url: string | null;
  habilidades: Habilidad[];
  experiencias: Experiencia[];
}

export interface UpdatePerfilPayload {
  first_name?: string;
  last_name?: string;
  telefono?: string;
  bio?: string;
  url_portafolio?: string;
  tipo_usuario?: string;
  foto_perfil?: File;
  habilidad_ids?: string[];
}

export interface CreateExperienciaPayload {
  empresa: string;
  cargo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  ubicacion?: string;
}

export interface PublicacionResumen {
  id: string;
  titulo: string;
  categoria: string;
  precio: string;
  tiempo_entrega: string;
  imagenes: Array<{ id: string; url: string; orden: number }>;
}

export interface PerfilPublico {
  usuario_id: string;
  nombre_completo: string;
  bio: string;
  url_portafolio: string;
  tipo_usuario: string;
  foto_perfil_url: string | null;
  habilidades: Habilidad[];
  experiencias: Experiencia[];
  publicaciones: PublicacionResumen[];
}
