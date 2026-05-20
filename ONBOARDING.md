# Onboarding — Professional Services Marketplace

## ¿Qué es esto?

Marketplace de servicios freelance. Los usuarios publican servicios, envían propuestas, firman contratos, se comunican por chat en tiempo real y se califican mutuamente al finalizar.

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Django 6 + DRF + Django Channels (WebSockets) |
| Servidor ASGI | Daphne |
| Base de datos | PostgreSQL 16 |
| Gestor de paquetes (backend) | uv |
| Frontend | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| i18n | next-intl (ES / EN) |
| Linter/Formatter (frontend) | Biome |
| Gestor de paquetes (frontend) | Bun |

---

## Levantar el proyecto localmente

### Opción A — Docker (recomendado)

```bash
docker compose up
```

Levanta PostgreSQL + backend + frontend de una vez. El entrypoint del backend espera a que Postgres esté listo, corre migraciones y siembra las habilidades automáticamente.

### Opción B — Manual

**Backend**

```bash
cd backend_marketplace
cp .env.example .env        # editar con tus valores
uv sync
uv run python manage.py migrate
uv run python manage.py seed_habilidades   # obligatorio
uv run python manage.py seed_demo_data     # opcional, carga datos de prueba
uv run daphne -b 0.0.0.0 -p 8000 core.asgi:application
```

**Frontend**

```bash
cd frontend_marketplace
cp .env.example .env.local
# Editar .env.local → NEXT_PUBLIC_API_URL=http://localhost:8000
bun install
bun dev
```

---

## Variables de entorno

### Backend (`.env`)

```env
DEBUG=True
SECRET_KEY=...

DB_HOST=localhost
DB_PORT=5432
DB_NAME=marketplace
DB_USER=marketplace
DB_PASSWORD=marketplace

FRONTEND_PUBLIC_BASE_URL=http://localhost:3000

# Asistente IA — si USE_GEMINI=false usa el stub local, no necesita key
USE_GEMINI=false
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# Email — si no se configura usa el fake que imprime en consola
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Arquitectura del backend

### Modelo de usuario

`Usuario` extiende `AbstractUser` (UUID como pk, el email es el campo de login). Cada usuario tiene un `Perfil` (OneToOne) con `tipo_usuario`: `cliente` o `freelancer`.

### Apps y su responsabilidad

| App | Qué hace |
|---|---|
| `usuarios` | Registro, login (JWT), perfil, habilidades, experiencia |
| `publicaciones` | Servicios publicados + imágenes adjuntas |
| `contratos` | Propuestas → Contratos → Reseñas |
| `calificaciones` | Calificaciones por estrella asociadas a contratos |
| `chat` | Mensajería en tiempo real por WebSocket |
| `integrations` | Asistente IA (Gemini o stub local) + proveedor de avatares |
| `infrastructure` | Servicio de email (Resend o fake para desarrollo) |

### Ciclo de vida de un contrato

```
Publicacion
    └── Propuesta (pendiente → aceptada / rechazada)
            └── Contrato (activo → completado / cancelado)
                    └── Calificacion (una por cada parte)
```

### Patrón ports & adapters

`integrations/` y `infrastructure/` usan este patrón:
- **Port** = Protocol / interfaz en Python (`ports.py`, `interface.py`)
- **Adapters** = implementaciones concretas (`gemini_marketplace_assistant.py`, `local_marketplace_assistant.py`, `email_service.py`, `fake_email_service.py`)
- El adapter activo se selecciona en `apps.py` según variables de entorno

### WebSockets

Chat usa Django Channels con `InMemoryChannelLayer`. Funciona para despliegues de un solo servidor. Si se escala horizontalmente se necesita cambiar a Redis Channel Layer.

### Archivos de media

Subidos a `MEDIA_ROOT/media/`. Servidos en todos los entornos (incluyendo producción) vía `django.views.static.serve` en `core/urls.py`.

---

## Arquitectura del frontend

### Regla del directorio `app/`

`app/` es **solo routing**. Solo puede contener `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`. Nada de lógica ni componentes propios aquí.

### Estructura por feature

```
src/features/<nombre-feature>/
    <nombre-feature>.tsx     ← container principal (mismo nombre)
    components/              ← componentes del feature
    hooks/                   ← hooks de datos (useXxx)
    services/                ← funciones fetch (xxxService.ts)
    models.ts                ← tipos TypeScript
```

Código usado por **2+ features** → va en `src/shared/`. Componentes genéricos de UI → `src/components/ui/` (shadcn).

### Autenticación

JWT. `AuthContext` provee `token` y el usuario actual. `useAuthFetch` devuelve un `fetch` con el header `Authorization: Bearer` inyectado automáticamente. Las funciones de servicio que requieren auth reciben el `fetcher` como parámetro:

```ts
// público
getPublicaciones()

// autenticado
getPublicacion(id, authFetch)
```

### Data fetching

Todo client-side (`"use client"`). No hay Server Components con fetch al backend. Los hooks (`usePublicaciones`, `usePublicacion`, etc.) llaman a las funciones de servicio y manejan `isLoading` / `error` / `data`.

### i18n

Todas las rutas están bajo `[locale]`. Traducciones en `src/i18n/translations/es.json` y `en.json`. Usar `useTranslations("namespace.key")` para acceder.

---

## Comandos útiles

### Backend

```bash
# Correr todos los tests
uv run python manage.py test

# Correr tests de una app específica
uv run python manage.py test publicaciones.tests

# Correr un test específico
uv run python manage.py test contratos.tests.ContratoTests.test_crear_contrato

# Crear migración
uv run python manage.py makemigrations

# Aplicar migraciones
uv run python manage.py migrate
```

### Frontend

```bash
bun dev          # servidor de desarrollo
bun build        # build de producción
bun lint         # biome check
bun format       # biome format --write
```

---

## Producción

```bash
docker compose -f docker-compose.production.yml up
```

El backend corre en `0.0.0.0:8000` con Daphne. El frontend se buildea y sirve con `next start`. Asegurarse de que `DEBUG=False`, `ALLOWED_HOSTS` incluya el dominio real y `SECRET_KEY` sea seguro.
