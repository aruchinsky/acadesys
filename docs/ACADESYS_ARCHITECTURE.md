# Arquitectura de AcadeSys

## Principios

AcadeSys será un SaaS multiacademia. La academia es el tenant; `users` representa identidad global y una membresía explícita conecta al usuario con cada academia. El backend resuelve el tenant activo y nunca acepta `academia_id`, roles, importes o estados del navegador como autoridad.

Los pagos académicos y las suscripciones SaaS son contextos separados. No comparten tabla, estados, servicios, rutas ni reportes. Un pago de alumno no activa un plan y un cobro SaaS no integra el historial financiero del alumno.

## Estado actual

La aplicación es un monolito Laravel/Inertia válido para evolucionar gradualmente, pero sus controladores concentran HTTP, validación, autorización implícita, persistencia, proveedor de pagos y presentación. Las consultas son globales y los modelos operativos no tienen `academia_id`.

```text
Browser / Inertia
       |
routes + middleware de rol global
       |
controladores con reglas y consultas Eloquent globales
       |
modelos/tablas de una sola institución
```

## Arquitectura objetivo incremental

```text
Request autenticado
       |
AcadeSysContextService ---- sesión academia_activa_id
       |                    membresía activa / rol / permisos / plan
middleware + Form Request + Policy
       |
servicio de aplicación transaccional
       |
modelo/consulta siempre acotado por academia_id
       |
eventos, auditoría y gateway externo idempotente
```

### Capas

- HTTP: rutas, middleware, Form Requests y recursos/DTOs de página.
- Autorización: Policies y permisos tenant-aware; los enlaces del frontend son solo representación.
- Aplicación: servicios pequeños que coordinan transacciones y transiciones.
- Dominio: invariantes académicas, dinero decimal, snapshots y estados explícitos.
- Infraestructura: Eloquent, almacenamiento privado, PDF, colas y gateways como Mercado Pago.
- Presentación: Inertia 2, contratos TypeScript por página y Tailwind 4 + shadcn/Radix.

## Agregados y límites

- Identidad global: usuario, autenticación y administración global.
- Tenant: academia, configuración, membresía y contexto activo.
- Oferta académica: curso, cohorte, horario, clase, material y asignación docente.
- Trayectoria: inscripción, transición de estado, asistencia y seguimiento.
- Finanzas académicas: arancel, cuota, obligación, pago académico, anulación y comprobante.
- Billing SaaS: plan, capacidad, suscripción, intento de cobro, webhook y estado contractual.
- Soporte global: lectura/control explícito, separado de la operación académica.

## Evolución de datos

1. Inventariar y respaldar mediante el procedimiento operativo aprobado.
2. Crear academia inicial y membresías sin alterar filas existentes.
3. Agregar `academia_id` nullable e índices auxiliares.
4. Hacer backfill transaccional y verificar conteos/relaciones.
5. Introducir filtros de contexto y pruebas de aislamiento.
6. Endurecer nulabilidad, foreign keys y unicidades tenant.
7. Retirar compatibilidad transitoria solo cuando no haya filas huérfanas.

Nunca usar `migrate:fresh`, `db:wipe` ni cascadas nuevas como mecanismo de migración.
