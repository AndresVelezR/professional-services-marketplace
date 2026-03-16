# Professional Services Marketplace

Plataforma web para el intercambio de servicios profesionales y freelance. Proyecto académico con enfoque en arquitectura de software, diseño limpio y buenas prácticas.

This project consists of a web-based platform oriented toward the exchange of professional and freelance services.
It is being developed as an academic exercise with a strong focus on **software architecture**, **clean design**, and the correct application of **MVC/MVT principles** using the **Django framework**.

- **Backend:** Django 6 + Django REST Framework + SQLite
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
- **Auth:** JWT (SimpleJWT)
- **Package Manager:** uv (backend), bun (frontend)

## Requisitos

- Docker y Docker Compose

## Integrantes

- **Andrés Vélez Rendón**
- **Tomás Ramírez**
- **Felipe Gómez**

---

## Ejecución con Docker

```bash
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (Django) | http://localhost:8000 |

```bash
docker compose down
```

## Ejecución local

### Backend

```bash
cd backend_marketplace
uv sync
uv run python manage.py migrate
uv run python manage.py seed_habilidades
uv run python manage.py runserver
```

### Frontend

```bash
cd frontend_marketplace
bun install
bun dev
```

## Variables de entorno

`frontend_marketplace/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Estructura

```
professional-services-marketplace/
├── backend_marketplace/
│   ├── core/                   # Settings, URLs
│   ├── usuarios/               # Auth, perfiles, habilidades, experiencia
│   └── publicaciones/          # Servicios publicados
├── frontend_marketplace/
│   └── src/
│       ├── app/                # Routing
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
