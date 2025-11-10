# 🎓 AcadeSys – Sistema de Gestión Académica

**Versión:** 2025  
**Stack:** Laravel 12 + Inertia + React 19 + Tailwind + ShadCN/UI  
**Base de datos:** MySQL  
**Arquitectura:** SPA (Single Page Application) con backend Laravel y frontend React integrados por Inertia.js

---

## 🚀 Descripción General

**AcadeSys** es una plataforma moderna para la gestión académica de instituciones educativas privadas, academias e institutos.  
Permite centralizar la información de cursos, alumnos, profesores, pagos y asistencias, ofreciendo una experiencia fluida y adaptable.

---

## 🧩 Módulos Principales

| Módulo | Descripción |
|--------|--------------|
| **Usuarios y Roles** | Control total de acceso mediante Spatie Roles/Permissions. |
| **Cursos** | Creación, asignación de docentes, horarios y gestión de alumnos inscriptos. |
| **Asistencias** | Registro diario, observaciones y visualización de historial por curso. |
| **Pagos** | Administración de cuotas, comprobantes y control financiero. |
| **Dashboard** | Estadísticas resumidas y accesos rápidos según el rol del usuario. |
| **Landing Page Pública** | Página de presentación con acceso al login y registro. |

---

## 👥 Roles del Sistema

| Rol | Permisos principales |
|-----|-----------------------|
| **Superusuario** | Acceso total al sistema, usuarios, roles, cursos, pagos y configuración general. |
| **Administrativo** | Gestión académica y financiera (inscripciones y pagos). |
| **Profesor** | Control de cursos asignados, registro e historial de asistencias. |
| **Alumno** | Consulta de cursos, asistencias y pagos personales. |

---

## 👤 Cuentas de prueba (Seeders)

El sistema incluye usuarios iniciales para pruebas locales:

| Rol | Email | Contraseña |
|-----|--------|-------------|
| 🧑‍💼 Superusuario | `super@acadesys.test` | `password123` |
| 🧾 Administrativo | `admin@acadesys.test` | `password123` |
| 👨‍🏫 Profesor | `profesor@acadesys.test` | `password123` |
| 🎓 Alumno | `alumno@acadesys.test` | `password123` |

> ⚠️ Se recomienda cambiar las credenciales antes de subir el proyecto a un entorno productivo.

---

## 🧰 Requisitos Previos

Asegurate de tener instalado:

- **PHP ≥ 8.2**
- **Composer**
- **Node.js ≥ 18 (recomendado 20)**
- **npm o yarn**
- **MySQL/MariaDB**
- (Opcional) **XAMPP / Laragon / Docker** para entorno local

---

## ⚙️ Configuración del Proyecto

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tuusuario/acadesys.git
cd acadesys
```

### 2️⃣ Instalar dependencias de Laravel
```bash
composer install
```

### 3️⃣ Instalar dependencias de Node
```bash
npm install
```

### 4️⃣ Crear el archivo `.env`
```bash
cp .env.example .env
```
> En Windows: `copy .env.example .env`

### 5️⃣ Configurar conexión a base de datos
Editá el archivo `.env` con tus credenciales locales:
```dotenv
APP_NAME=AcadeSys
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=acadesys
DB_USERNAME=root
DB_PASSWORD=
```

### 6️⃣ Generar clave de aplicación
```bash
php artisan key:generate
```

### 7️⃣ Ejecutar migraciones y seeders
```bash
php artisan migrate --seed
```
> Esto creará las tablas y las cuentas de prueba listadas arriba.

---

## ▶️ Ejecución del Proyecto

### 🖥 Opción A — Backend (Laravel)
```bash
php artisan serve
```
Por defecto: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### ⚡ Opción B — Frontend (Vite)
```bash
npm run dev
```
Por defecto: [http://localhost:5173](http://localhost:5173)

### 🧩 Opción C — Ambos servidores (si está configurado en composer.json)
```bash
composer run dev
```
> Asegurate de tener un script `"dev": "php artisan serve & npm run dev"` en tu `composer.json`.

---

## 📁 Estructura Relevante del Proyecto

```
acadesys/
├── app/
│   ├── Http/Controllers/
│   │   ├── CursoController.php
│   │   ├── AsistenciaController.php
│   │   └── PagoController.php
│   └── Models/
│       ├── Curso.php
│       ├── Asistencia.php
│       ├── Inscripcion.php
│       └── User.php
├── resources/
│   └── js/
│       ├── pages/
│       │   ├── Cursos/
│       │   │   ├── ProfesorIndex.tsx
│       │   │   ├── ProfesorShow.tsx
│       │   │   ├── ProfesorAsistencias.tsx
│       │   │   └── ProfesorAsistenciasHistorial.tsx
│       │   └── welcome.tsx
│       └── types/index.d.ts
├── routes/web.php
└── database/seeders/
```

---

## 🔍 Propiedades Globales (Inertia + Laravel 12)

- Configuradas en: `app/Http/Middleware/HandleInertiaRequests.php`
- Contienen:
  - `auth` → usuario autenticado y roles
  - `flash` → mensajes globales
  - `ziggy` → rutas del frontend
  - `sidebarOpen` → estado del layout interno

---

## 📚 Rutas principales

| Ruta | Descripción |
|------|--------------|
| `/` | Landing pública moderna |
| `/login` | Acceso al sistema |
| `/register` | Registro de usuario |
| `/dashboard` | Panel dinámico según rol |
| `/profesor/cursos` | Cursos asignados al profesor |
| `/profesor/asistencias` | Registro de asistencias |
| `/profesor/cursos/{id}/asistencias` | Historial por curso |

---

## 🧠 Stack Técnico

- **Backend:** Laravel 12 (PHP 8.3)  
- **Frontend:** React 19 + Inertia.js  
- **UI:** TailwindCSS + ShadCN Components  
- **Animaciones:** Framer Motion  
- **Autenticación:** Laravel Breeze Starter Kit  
- **Roles y permisos:** Spatie Laravel Permissions  
- **Base de datos:** MySQL  
- **Servidor local recomendado:** Laragon / XAMPP

---

## 🧾 Troubleshooting Rápido

| Problema | Solución sugerida |
|-----------|------------------|
| Migraciones fallan | Verificar credenciales de DB o ejecutar `php artisan migrate:fresh --seed` |
| Vite no conecta | Asegurarse de que `npm run dev` esté corriendo y puerto 5173 libre |
| Inertia no refresca props | Limpiar caché con `php artisan optimize:clear` |
| Error con roles | Ejecutar `php artisan db:seed --class=RoleSeeder` |

---

## 🧩 Contribución

1. Fork del repositorio  
2. Crear una nueva rama: `git checkout -b feature/nueva-funcionalidad`  
3. Realizar cambios y commit: `git commit -m "Descripción del cambio"`  
4. Subir la rama: `git push origin feature/nueva-funcionalidad`  
5. Crear un Pull Request

---

## 🪄 Créditos

**Desarrollado por:** Equipo AcadeSys  
**Autor principal:** Andrés Iván Ruchinsky  
**Ubicación:** Formosa, Argentina 🇦🇷  
**Licencia:** MIT

---

> _“Simplificá la gestión, potenciá la educación.” – AcadeSys 2025_  
