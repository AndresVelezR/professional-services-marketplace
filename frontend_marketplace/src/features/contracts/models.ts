export interface PropuestaCreate {
  mensaje: string
  precio_propuesto: number
  fecha_limite?: string // YYYY-MM-DD
}

export interface UsuarioContrato {
  nombre_completo: string
  email: string
  iniciales: string
}

export interface Propuesta {
  id: string
  publicacion_id: string
  publicacion_titulo: string
  cliente: { nombre_completo: string; iniciales: string }
  mensaje: string
  precio_propuesto: string
  fecha_limite: string | null
  estado: "pendiente" | "aceptada" | "rechazada"
  created_at: string
}

export interface Contrato {
  id: string
  propuesta?: string
  publicacion_titulo: string
  cliente: UsuarioContrato
  freelancer: UsuarioContrato
  precio: string
  fecha_inicio: string
  fecha_fin: string | null
  estado: "activo" | "completado" | "cancelado"
  created_at: string
}

export interface ReviewCreate {
  contrato: string
  calidad: number
  comunicacion: number
  puntualidad: number
  comentario: string
}

export interface Review {
  id: string
  contrato: string
  calificador_nombre: string
  calidad: number
  comunicacion: number
  puntualidad: number
  promedio: number
  comentario: string
  created_at: string
}
