export interface UsuarioChat {
  nombre_completo: string
  iniciales: string
}

export interface Mensaje {
  id: string
  contenido: string
  emisor: UsuarioChat
  leido: boolean
  created_at: string
}

export interface Conversacion {
  id: string
  contrato_id: string
  publicacion_titulo: string
  cliente: UsuarioChat
  freelancer: UsuarioChat
  ultimo_mensaje: Mensaje | null
  mensajes_no_leidos: number
  created_at: string
}

export interface ConversacionDetalle extends Conversacion {
  mensajes: Mensaje[]
}
