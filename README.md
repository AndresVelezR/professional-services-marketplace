# Professional Services Marketplace

Plataforma web para el intercambio de servicios profesionales y freelance. Proyecto académico con enfoque en arquitectura de software, diseño limpio y buenas prácticas.

- **Backend:** Django 6 + Django REST Framework + PostgreSQL
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
- **Auth:** JWT (SimpleJWT)
- **Infraestructura:** Docker Compose (3 servicios: db, backend, frontend)

## Integrantes

- **Andrés Vélez Rendón**
- **Tomás Ramírez**
- **Felipe Gómez**

---

## Arquitectura

```
┌─────────────┐     HTTP/JSON      ┌─────────────┐      SQL       ┌─────────────┐
│  Frontend   │ ──────────────────▶ │   Backend   │ ─────────────▶ │ PostgreSQL  │
│  (Next.js)  │ ◀────────────────── │   (Django)  │ ◀───────────── │    (db)     │
│  :3000      │                     │   :8000     │                │  :5432      │
└─────────────┘                     └─────────────┘                └─────────────┘
```

## Requisitos

- Docker y Docker Compose

## Ejecución con Docker

```bash
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API (Django) | http://localhost:8000 |
| Admin (Django) | http://localhost:8000/admin/ |
| PostgreSQL | localhost:5432 |

Para detener:

```bash
docker compose down
```

## Poblar la base con datos ficticios

```bash
# Datos demo (8 usuarios, perfiles, experiencias, 15 publicaciones)
docker compose exec backend python manage.py seed_demo_data

# Para limpiar y re-crear los datos demo:
docker compose exec backend python manage.py seed_demo_data --clear
```

Credenciales de usuarios demo: `Demo1234!`
Emails disponibles: `maria.lopez@example.com`, `carlos.garcia@example.com`, etc.

## Crear superusuario (admin)

```bash
docker compose exec backend python manage.py ensure_superuser tu_email@example.com
```

## Archivo SQL de datos ficticios

El archivo `backend_marketplace/demo_data.sql` contiene los datos ficticios exportados desde PostgreSQL (solo filas, sin esquema).

Para regenerarlo:

```bash
docker compose exec db pg_dump -U marketplace --data-only --inserts \
  --exclude-table=django_migrations --exclude-table=django_session \
  marketplace > backend_marketplace/demo_data.sql
```

## Ejecución local (sin Docker)

### Backend

```bash
cd backend_marketplace
uv sync
uv run python manage.py migrate
uv run python manage.py seed_habilidades
uv run python manage.py runserver
```

Requiere PostgreSQL corriendo localmente. Configurar variables de entorno:
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.

### Frontend

```bash
cd frontend_marketplace
bun install
bun dev
```

Variable de entorno necesaria en `frontend_marketplace/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Estructura

```
professional-services-marketplace/
├── backend_marketplace/
│   ├── core/                   # Settings, URLs
│   ├── usuarios/               # Auth, perfiles, habilidades, experiencia
│   ├── publicaciones/          # Servicios publicados
│   ├── entrypoint.sh           # Arranque del backend en Docker
│   └── demo_data.sql           # Datos ficticios exportados
├── frontend_marketplace/
│   └── src/
│       ├── app/                # Routing (Next.js App Router)
│       ├── features/           # Features de negocio
│       │   ├── auth/
│       │   ├── services/
│       │   └── profile/
│       ├── shared/             # Componentes compartidos
│       ├── components/ui/      # shadcn/ui
│       └── infrastructure/     # Auth context, API
├── docker-compose.yml
└── README.md
```
