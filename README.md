# Banco - Prueba Técnica

Sistema de gestión de clientes y cuentas bancarias (Fullstack: Angular + Node.js + PostgreSQL).

---

## Requisitos

- Node.js >= 24
- Docker y Docker Compose
- Angular CLI (`npm install -g @angular/cli`)

---

## 1. Base de datos (Docker)

```bash
docker compose up -d
```

PostgreSQL queda disponible en `localhost:5434`

---

## 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run dev
```

El servidor corre en `http://localhost:3000`

---

## 3. Frontend

```bash
cd frontend
npm install
npm start
```

La app corre en `http://localhost:4200`

---

## Orden de ejecución

1. Docker (PostgreSQL)
2. Backend
3. Frontend

---

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/customers | Crear cliente |
| GET | /api/customers | Listar clientes |
| POST | /api/accounts | Crear cuenta |
| GET | /api/accounts | Listar cuentas |
| GET | /api/accounts?customerId=xxx | Cuenta por cliente |
