# Issues conocidos

Prioridades: P0 compromete aislamiento, dinero, credenciales/datos o integridad; P1 bloquea calidad/operación confiable; P2 es deuda importante sin explotación inmediata demostrada.

## P0

| ID | Problema y evidencia | Criterio de salida |
| --- | --- | --- |
| SEC-001 | No existe tenant: modelos/migraciones carecen de `academia_id` y las consultas administrativas son globales. | Contexto central, claves tenant, backfill y tests de aislamiento. |
| SEC-002 | Resource `inscripciones` concede siete acciones a profesor/alumno (`routes/web.php`); update/destroy no autorizan propiedad. | Separar rutas por intención, Policies y regresiones 403/404. |
| SEC-003 | Profesor puede abrir cualquier `Curso` en `showProfesor`/`historial`; `AsistenciaController::store` acepta cualquier `curso_id`. | Policy de asignación y validación de curso/inscripciones. |
| FIN-001 | Callback público de Mercado Pago crea pagos desde referencias del retorno; no valida external reference del objeto, importe, moneda, usuario/tenant ni usa webhook/transacción/idempotencia robusta. | Retorno informativo, webhook verificado, consulta al proveedor, snapshot e idempotencia. |
| FIN-002 | Comprobante PDF usa binding `Pago $pago` sin Policy; archivos subidos van al disco público. | Autorización de propietario/academia y almacenamiento privado. |
| DATA-001 | `acadesys.sql` versiona usuarios y sesiones con datos identificables y hashes; además está desfasado. | Determinar origen, revocar si aplica, reemplazar por fixture sintético y plan autorizado de historia Git. |
| DEP-001 | Composer: 44 advisories/14 paquetes, incluidos 9 high. npm: 22 vulnerabilidades, incluidas 2 critical y 13 high. | Ramas de actualización priorizadas, pruebas verdes o aceptación de riesgo explícita y temporal. |

## P1

| ID | Problema y evidencia | Criterio de salida |
| --- | --- | --- |
| FIN-003 | `storeAlumno` registra request completo y metadatos de archivos; errores de proveedor se devuelven al navegador. | Logging mínimo/redactado y respuesta pública estable. |
| FIN-004 | Dinero se convierte a `float`; pagos manuales permiten monto cero; falta moneda/snapshot/estado de revisión. | Value object/decimal, reglas de importe y estados explícitos. |
| DATA-002 | Cascadas de usuario→inscripción→pago/asistencia y deletes de curso/inscripción pueden destruir historia. | Estrategia de archivo/anulación y restricciones probadas. |
| DATA-003 | Al anular un pago se borra el comprobante; no se registra `anulado_at` y el actor reemplaza `administrativo_id`. | Evidencia inmutable, actor/fecha/motivo separados. |
| APP-001 | Controladores de dominio concentran validación, autorización, persistencia, proveedor y render; solo hay 2 Form Requests, 0 Policies y 0 servicios. | Extraer por módulo con pruebas antes de refactor. |
| APP-002 | Operaciones compuestas de cursos/asistencias/pagos no usan transacciones; actualización de horarios borra y recrea. | Servicios transaccionales y manejo de concurrencia. |
| AUTH-001 | Dashboard y vistas usan el primer rol global; roles académicos no pueden variar por academia. | Contexto tenant y rol por academia. |
| ROUTE-001 | Existe ruta DELETE `administrativo/pagos/{pago}` hacia un método `destroy` inexistente. | Eliminar o implementar según política no destructiva, con test. |
| TEST-001 | Suite visible cubre principalmente starter; no hay regresiones de dominio, autorización, pagos o tenancy. | Matriz de tests descrita por módulo. |
| DEV-001 | `composer validate --strict` falla por pin exacto de Mercado Pago; resolver en rama de dependencias sin actualización global. | Constraint y lockfile coherentes, integración probada. |

## P2

| ID | Problema y evidencia | Criterio de salida |
| --- | --- | --- |
| UI-001 | Conviven Tailwind/Radix, Headless UI y Chakra, con árboles `resources/js` y `src`. | Confirmar referencias y consolidar sin borrar a ciegas. |
| UI-002 | Props globales/página son mayormente opcionales; se detectaron errores de nulabilidad y numerosos `any`. | DTO por página y tipos estrictos sin bolsas opcionales. |
| ENV-001 | `optimize:clear` falla en una instalación sin SQLite local porque el cache por defecto es database. | Procedimiento reproducible o configuración explícita de entorno sin versionar secretos. |
| DOC-001 | README mezclaba versiones, seeder inexistente y troubleshooting destructivo. | Mantener README y documentos de arquitectura alineados. |
