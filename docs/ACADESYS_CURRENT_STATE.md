# Estado actual de AcadeSys

Fecha de corte: 19 de agosto de 2026. Commit base: `a3f6337`. Esta fotografía describe el código inspeccionado; no sustituye una revisión de la rama vigente antes de cada cambio.

## Producto y alcance observado

AcadeSys es una aplicación Laravel/Inertia para cursos, inscripciones, asistencias, pagos académicos, usuarios y roles. El código actual opera como una sola institución: no existen `academias`, membresías por academia, `academia_id`, selector de contexto ni suscripciones SaaS persistidas.

Los dos circuitos financieros objetivo todavía no están separados. Existe `pagos` para cobros académicos; la landing menciona planes Free/Premium, pero no hay modelos, tablas, servicios ni webhooks de suscripción SaaS.

## Stack bloqueado por lockfiles

- PHP declarado `^8.2`; Laravel bloqueado en `12.25.0`.
- Inertia Laravel `2.0.5`, React `19.1.1`, TypeScript `5.9.2`, Vite `7.1.2` y Tailwind `4.1.12` según los lockfiles instalados.
- Spatie Permission `6.21.0`, Mercado Pago PHP `3.8.0` y DomPDF `3.1.4`.
- Entorno de la inspección: PHP `8.4.23`, Composer `2.10.2`, Node `24.18.0` y npm `11.16.0`.

`composer install` y `npm ci` completaron sin actualizar versiones. La primera instalación paralela de Composer sufrió bloqueos temporales de archivos en Windows; el reintento secuencial con `COMPOSER_MAX_PARALLEL_HTTP=1` finalizó. `npm ci` instaló 663 paquetes.

## Inventario

| Área | Cantidad | Observación |
| --- | ---: | --- |
| Rutas registradas | 83 | 49 GET, 21 POST, 5 DELETE y el resto PUT/PATCH/redirect |
| Controladores PHP | 19 | Incluye el controlador base; `PagoController` tiene 394 líneas |
| Modelos de dominio | 7 | User, Curso, Inscripcion, Asistencia, Pago y dos auxiliares de curso |
| Migraciones | 10 | No crean tenant ni membresías |
| Form Requests | 2 | Solo login y actualización de perfil |
| Policies | 0 | No existe `app/Policies` |
| Servicios de dominio | 0 | No existe `app/Services` |
| Páginas React | 49 | Dos árboles de UI: `resources/js` y `src` |
| Componentes React | 53 + 5 | 53 bajo `resources/js/components`; 5 Chakra bajo `src` |
| Tests visibles | 10 archivos | 9 feature del starter y 1 unitario trivial |

## Baseline de validación

| Comando | Resultado inicial |
| --- | --- |
| `php artisan optimize:clear` | Falla: el cache usa SQLite y falta `database/database.sqlite` |
| `composer validate --strict` | JSON válido; falla estricto por el pin exacto de Mercado Pago |
| `vendor/bin/pint --test` | 35 archivos con diferencias de estilo |
| `npm run types` | 5 errores de nulabilidad/props |
| `npm run format:check` | 55 archivos sin formato Prettier |
| `npx eslint .` | 60 errores y 2 warnings; el script `npm run lint` es mutante |
| `npm run build` | Pasa; 3043 módulos transformados |
| `php artisan test` | 1 pasa y 26 fallan por `APP_KEY` ausente en el entorno de test |

La rama de baseline incorpora una clave exclusiva de pruebas en `phpunit.xml`, corrige los errores TypeScript mínimos y normaliza formato. Los defectos funcionales y de seguridad permanecen trazados en `ACADESYS_KNOWN_ISSUES.md` para fases posteriores.

Al cierre de la rama, Pint, Prettier, ESLint no mutante, TypeScript, build y la suite de 27 tests/64 assertions pasan. `optimize:clear` pasa con cache/session efímeros; la instalación sin configuración local sigue documentada en `ENV-001`. `composer validate --strict` conserva el warning del pin exacto, registrado como `DEV-001`, porque Fase 0 no cambia dependencias ni lockfiles.

## Auditoría de dependencias

`composer audit --locked` detectó 44 advisories en 14 paquetes: 9 high, 28 medium, 6 low y 1 sin severidad. `npm audit` detectó 22 vulnerabilidades: 2 critical, 13 high, 6 moderate y 1 low. No se ejecutó `composer update`, `npm audit fix` ni ninguna actualización global.

## Auditoría segura de `acadesys.sql`

- Está versionado, ocupa 21.695 bytes y su SHA-256 al corte es `C1998DB8EE73A4E1AF87F2B1DBE4ABB9F0F3A302F55455BC6446730B0E069BED`.
- Contiene 19 definiciones de tabla y 7 sentencias `INSERT`, incluidas `users` y `sessions`.
- Se detectaron valores con formato de email y hashes bcrypt, además de columnas de DNI, teléfono, token, password, payload de sesión e IP/user agent por esquema.
- No se detectaron tokens de Mercado Pago, bearer tokens ni claves privadas con los patrones auditados.
- Está desfasado respecto de migraciones: no incluye `curso_profesor`.

Tratar el dump como incidente de higiene de repositorio: no copiar ni publicar sus valores. En una rama específica se debe determinar si los datos son sintéticos, rotar/revocar sesiones si corresponde, reemplazarlo por migraciones/seeders sintéticos y limpiar historial solo con autorización expresa y un plan coordinado.
