# Puesta en marcha del proyecto

**Stack:** Laravel 12 + Inertia + React 19 (Starter Kit)

> **Nota de arquitectura:** Este proyecto sigue la nueva metodología de Laravel 12 **sin `Kernel.php`**. Las rutas viven en `routes/web.php` y los props/compartidos de Inertia se gestionan en `app/Http/Middleware/HandleInertiaRequests.php`.

---

## Requisitos previos

* PHP ≥ 8.2
* Composer
* Node.js ≥ 18/20 y npm
* MySQL/MariaDB (XAMPP, WAMP, Laragon, Docker, etc.)

> Asegurate de tener un usuario/DB creados y accesibles para completar el `.env`.

---

## 🚀 Pasos para montar el repositorio clonado en una PC nueva

> Asumimos que **ya clonaste** el repositorio en tu equipo.

### 1) Instalar dependencias de Laravel

```bash
composer install
```

### 2) Instalar dependencias de Node (React/Vite/ShadCN)

```bash
npm install
```

### 3) Crear el archivo `.env` desde la plantilla

```bash
cp .env.example .env
```

En Windows (PowerShell/CMD):

```powershell
copy .env.example .env
```

### 4) Configurar variables en `.env`

Editá el archivo `.env` y colocá tus credenciales de base de datos (y la URL de la app si aplica):

```dotenv
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tu_base
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

### 5) Generar la clave de la aplicación

```bash
php artisan key:generate
```

### 6) Ejecutar las migraciones

```bash
php artisan migrate
```

---

## ▶️ Ejecutar el proyecto

### Opción A — **Levantar solo el backend (Laravel)**

```bash
php artisan serve
```

> Servirá en `http://127.0.0.1:8000` (por defecto). **Esto no levanta el frontend de Vite.**

### Opción B — **Levantar solo el frontend (React + Vite)**

```bash
npm run dev
```

> Abrirá el servidor de Vite (p. ej. `http://localhost:5173`). Inertia usará esta build en desarrollo.

### Opción C — **Levantar todo junto**

```bash
composer run dev
```

> Este comando asume que existe un script `dev` en `composer.json` que orquesta `php artisan serve` **y** `npm run dev`. Si no está definido, usá A y B en **dos terminales**.

**Ejemplo opcional de script en `composer.json`:**

```json
{
  "scripts": {
    "dev": "php artisan serve & npm run dev"
  }
}
```

> Ajustá el script según tu SO. En Windows podrías usar herramientas como `concurrently` (Node) o ejecutar los comandos en terminales separadas.

---

## 📁 Rutas y Middleware de Inertia (referencia rápida)

* Definí componentes/páginas desde `routes/web.php` usando `Inertia::render(...)`.
* Props globales y compartidos: `app/Http/Middleware/HandleInertiaRequests.php`.

---

## ✅ Checklist rápido

* [ ] `composer install`
* [ ] `npm install`
* [ ] `.env` creado y configurado
* [ ] `php artisan key:generate`
* [ ] `php artisan migrate`
* [ ] Backend: `php artisan serve`
* [ ] Frontend: `npm run dev` (o `composer run dev` si está configurado)

---

### Troubleshooting (rápido)

* **Migraciones fallan**: verificá credenciales/puerto de DB en `.env`. Probá `php artisan migrate:fresh` en entornos de desarrollo.
* **Vite no conecta**: chequeá que `npm run dev` esté corriendo y que no haya puertos ocupados.
* **Variables Inertia globales**: revisá `HandleInertiaRequests` para compartir datos a todas las vistas.

---

¡Listo! Con esto cualquier colaborador debería poder levantar el proyecto localmente en minutos.
