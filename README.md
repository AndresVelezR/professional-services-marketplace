# Professional Services Marketplace

Plataforma web para el intercambio de servicios profesionales y freelance. Proyecto académico con enfoque en arquitectura de software, diseño limpio y buenas prácticas.

## Tech Stack

- **Backend:** Django 6 + Django REST Framework + SQLite
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
- **Auth:** JWT (SimpleJWT)
- **Package Manager:** uv (backend), bun (frontend)

## Requisitos

- Docker y Docker Compose

## Ejecución con Docker

```bash
# Clonar el repositorio
git clone <repo-url>
cd professional-services-marketplace

# Levantar los servicios
docker compose up --build
```

Esto levanta:

| Servicio | URL | Puerto |
|----------|-----|--------|
| Frontend (Next.js) | http://localhost:3000 | 3000 |
| Backend (Django) | http://localhost:8000 | 8000 |

Para detener:

```bash
docker compose down
```

## Ejecución local (sin Docker)

### Backend

```bash
cd backend_marketplace
uv sync                              # instalar dependencias
uv run python manage.py migrate      # aplicar migraciones
uv run python manage.py seed_habilidades  # seed de habilidades
uv run python manage.py runserver    # iniciar servidor en :8000
```

### Frontend

```bash
cd frontend_marketplace
bun install       # instalar dependencias
bun dev           # iniciar dev server en :3000
```

Crear un archivo `.env.local` en `frontend_marketplace/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Estructura del proyecto

```
professional-services-marketplace/
├── backend_marketplace/        # Django REST API
│   ├── core/                   # Settings, URLs
│   ├── usuarios/               # Auth, perfiles, habilidades, experiencia
│   └── publicaciones/          # Servicios publicados
├── frontend_marketplace/       # Next.js App
│   └── src/
│       ├── app/                # Routing (solo pages/layouts)
│       ├── features/           # Screaming Architecture por feature
│       │   ├── auth/
│       │   ├── services/
│       │   └── profile/
│       ├── shared/             # Componentes compartidos
│       ├── components/ui/      # shadcn/ui
│       └── infrastructure/     # Auth context, API
├── docker-compose.yml
└── README.md
```

## Equipo

- Andr&eacute;s V&eacute;lez Rend&oacute;n
- Tom&aacute;s Ram&iacute;rez
- Felipe G&oacute;mez
