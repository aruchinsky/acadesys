# Registro de decisiones

## ADR-001 — Academia como tenant

Estado: aceptada. La clave de aislamiento será `academia_id`; el contexto activo se conservará como `academia_activa_id` en sesión. Motivo: una identidad puede participar en varias academias y la autorización debe depender del contexto.

## ADR-002 — Membresía explícita + Spatie teams

Estado: aceptada para diseñar en Fase 3. Se mantendrá una membresía auditable y Spatie Permission se configurará con teams usando `academia_id`. La versión instalada (6.21.0) expone soporte de teams, pero hoy está deshabilitado y la migración existente no tiene la clave team; se requerirá una migración compatible, nunca editar una migración ya aplicada.

Alternativas descartadas: roles globales (no representan roles diferentes por academia) y una tabla de membresía sin integración de permisos (duplicaría un motor que ya existe).

## ADR-003 — Dos circuitos financieros

Estado: aceptada. Pagos académicos y billing SaaS tendrán modelos, estados, gateways, permisos y auditoría separados. Se permite compartir abstracciones técnicas de dinero/idempotencia, no tablas ni reglas comerciales.

## ADR-004 — Migración tenant expand/backfill/contract

Estado: aceptada. Se agregan estructuras compatibles, se hace backfill verificable y solo después se endurecen constraints. No se recrea la base ni se destruye historial.

## ADR-005 — Sistema visual principal

Estado: aceptada. `resources/js` con Tailwind 4 y shadcn/Radix es el sistema principal. Chakra bajo `src` se considera árbol paralelo no integrado; se auditarán referencias antes de retirarlo en una rama específica. Headless UI se tolera temporalmente en transiciones existentes.

## ADR-006 — Historial no destructivo

Estado: aceptada. Inscripciones, asistencias y pagos con valor histórico se anulan, archivan o desactivan con actor, motivo y fecha. Los `DELETE` y cascadas actuales se reemplazarán gradualmente luego de agregar pruebas de regresión.

## ADR-007 — Dependencias por saltos revisables

Estado: aceptada. Fase 0 instala lockfiles; Fase 2 actualiza paquetes por ramas pequeñas según advisories y compatibilidad. No se ejecutan actualizaciones globales ni autofix de auditorías.
