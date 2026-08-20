# AcadeSys — contexto maestro de reingeniería para Codex

## Inicio de la misión

Este archivo es la única entrada de contexto necesaria para comenzar. Debe permanecer en la raíz del repositorio como `AGENTS.md`.

Mensaje recomendado para una nueva tarea de Codex:

> Leé AGENTS.md completo, inspeccioná el repositorio y comenzá la reingeniería por la Fase 0. Avanzá de forma autónoma dentro de cada fase, respetá los controles Git y no copies lógica comercial de Vendra. AcadeSys es un SaaS multiacademia para academias online.

Si el usuario agrega “autorizo el flujo Git completo de esta fase”, esa autorización comprende commit, push, integración en `develop` y limpieza de la rama temporal de esa fase, siempre que todas las validaciones pasen y no exista trabajo exclusivo sin integrar. No comprende force-push, rebase destructivo, eliminación de datos, cambios de secretos ni despliegues productivos.

## Identidad del producto

AcadeSys es un SaaS multi-cliente para academias online, institutos y centros de formación. No es un sistema comercial, un POS ni una adaptación de Vendra.

La meta es llevar AcadeSys al mismo nivel de calidad de ingeniería, seguridad, consistencia, eficiencia y experiencia de usuario alcanzado en Vendra, conservando un dominio académico propio.

Varias academias independientes utilizan una misma instalación con aislamiento estricto. Un usuario puede participar en más de una academia y tener funciones diferentes en cada una.

## Dominio funcional

- academias y configuración institucional;
- usuarios, membresías, roles y permisos;
- profesores y alumnos;
- cursos, cohortes, horarios y clases;
- inscripciones y estados académicos;
- asistencias y seguimiento;
- aranceles, cuotas y pagos académicos;
- comprobantes y documentación;
- dashboards y reportes académicos/financieros;
- planes y suscripciones SaaS de cada academia;
- soporte y administración global;
- landing, registro y onboarding.

No introducir productos, stock, proveedores, ventas, caja ni conceptos comerciales de Vendra.

## Dos circuitos financieros separados

1. **Pagos académicos:** dinero que un alumno paga a una academia por cursos, matrículas, aranceles o cuotas.
2. **Suscripción SaaS:** dinero que una academia paga a AcadeSys para contratar un plan de la plataforma.

Cada circuito debe tener modelos, tablas, servicios, permisos, rutas, estados, reportes y auditoría propios. Un pago académico nunca activa un plan SaaS y una suscripción SaaS nunca aparece como pago de un alumno.

## Estado conocido al 19 de agosto de 2026

Repositorio inspeccionado: `C:\xampp\htdocs\acadesys`.

Stack declarado:

- PHP `^8.2` y Laravel `^12.0`;
- Inertia 2, React 19 y TypeScript 5.7;
- Tailwind 4 y Vite 7;
- Spatie Permission 6;
- Mercado Pago SDK PHP/JS y DomPDF;
- Pest 3.

Estado Git observado:

- `main` coincide con `origin/main` en `a3f6337`;
- no existe `develop`;
- `origin/backend-ivan` y `origin/frontend-damian` estaban completamente contenidas en `main` y 16 commits por detrás;
- antes de eliminar ramas, volver a comprobarlo porque el remoto puede cambiar.

Línea base observada:

- faltaba `vendor/`, por lo que `php artisan test` no podía iniciar;
- faltaba `node_modules/`, por lo que `npm run types` no encontraba `tsc`;
- `composer audit --locked` informó 44 avisos en 14 paquetes, incluidos avisos altos;
- `acadesys.sql` está versionado y debe auditarse por datos, credenciales y necesidad real;
- la suite visible cubre principalmente el starter, no los módulos académicos críticos.

Problemas ya detectados que deben reproducirse y cubrirse con tests:

- no existe tenant `academia` ni aislamiento multiacademia;
- las rutas resource de inscripciones conceden acceso excesivo y pueden exponer operaciones administrativas a alumnos o profesores;
- acciones de profesor aceptan cursos arbitrarios sin demostrar siempre su asignación;
- el registro/historial de asistencias no valida en todos los casos que el profesor pertenezca al curso;
- los comprobantes de pagos usan route model binding sin una policy de propiedad visible;
- el retorno de Mercado Pago debe vincular estrictamente pago, referencia, academia, inscripción, importe y moneda;
- el retorno del navegador no puede ser fuente de verdad;
- eliminaciones/cascadas pueden destruir historial académico o financiero;
- pagos registra logging de depuración con requests y archivos;
- controladores concentran validación, autorización, persistencia, proveedor y renderizado;
- props Inertia globales/opcionales generan contratos TypeScript débiles;
- conviven shadcn/Radix, Chakra y Headless UI, además de árboles `resources/js` y `src`;
- README y troubleshooting contienen instrucciones potencialmente destructivas o desactualizadas.

Este inventario no es exhaustivo. Inspeccionar siempre el código vigente antes de diagnosticar o editar.

## Arquitectura multiacademia objetivo

### Tenant y contexto

- La academia es el tenant y vive en `academias`.
- La clave de aislamiento es `academia_id`.
- El plan SaaS pertenece a la academia, nunca al usuario.
- La membresía usuario-academia es explícita, activa/inactiva y auditable.
- El contexto activo se guarda en sesión como `academia_activa_id`.
- Crear `App\Services\AcadeSysContextService` como fuente única de academias disponibles, academia activa, membresía, rol académico, permisos, plan y administración global.
- Usuario con una academia: selección automática.
- Usuario con varias: conserva una selección válida o utiliza selector.
- Superusuario: entorno global y selección explícita de academia para operar datos académicos.
- Soporte global, si se incorpora: consulta definida sin operar datos salvo autorización expresa.

### Usuarios y roles

- `users` es identidad global; no duplicar cuentas por academia.
- `superusuario` es administración global de la plataforma.
- `propietario`, `administrativo`, `profesor` y `alumno` son funciones dentro de una academia, no roles globales permanentes.
- Un usuario puede ser profesor en una academia y alumno/administrativo en otra.
- Preferir Spatie teams con alcance `academia_id` o una membresía explícita con asignaciones equivalentes. Elegir una estrategia tras revisar compatibilidad y registrar la decisión antes de migrar.
- No inferir autorización desde el primer rol, una URL o enlaces ocultos.
- La autorización real siempre se ejecuta en Laravel.

### Entidades aisladas

Curso, cohorte, horario, clase, inscripción, asistencia, arancel, cuota, pago académico, comprobante, material y todo agregado operativo deben pertenecer inequívocamente a una academia.

Todas las consultas y asociaciones validan el mismo `academia_id`. Toda relación enviada por el navegador debe pertenecer a la academia activa. No aceptar `academia_id` del frontend como autorización; resolverlo desde el contexto autenticado.

### Migración de datos existentes

- No usar `migrate:fresh`, `db:wipe` ni borrar la base.
- Crear una academia inicial para los datos existentes.
- Añadir claves tenant de forma compatible, hacer backfill verificable y luego endurecer nulabilidad, índices y restricciones.
- Incluir `academia_id` en unicidades propias del tenant.
- Validar conteos y relaciones antes/después de cada migración.
- Añadir verificaciones automatizadas contra pérdida o mezcla de datos.

## Suscripciones SaaS

- Catálogo de planes administrable con precio, moneda, beneficios, límites y capacidades efectivas.
- Free/Premium u otros niveles son planes de la academia, nunca roles.
- El checkout pertenece a la academia activa y solo lo inicia un propietario/administrador autorizado.
- El navegador envía como máximo el plan; academia, precio, moneda y usuario se resuelven en Laravel.
- Guardar snapshot comercial y referencia idempotente.
- Separar contrato de dominio y gateway del proveedor.
- El retorno del navegador es informativo y nunca activa el plan.
- Validar webhook, consultar el proveedor y activar el plan transaccionalmente solo después de confirmar estado, referencia, academia, plan, importe y moneda.
- Reintentos no crean duplicados.
- Definir cancelación, mora, gracia y conservación de datos antes de degradar una academia.
- Credenciales y URLs productivas permanecen fuera del repositorio.

## Pagos académicos

- Conservar historial; no eliminar pagos confirmados.
- Usar estados explícitos y anulación con motivo, usuario y fecha.
- Verificar academia, alumno, inscripción, curso, concepto, importe y moneda.
- Un alumno solo opera sus obligaciones dentro de la academia activa.
- Un administrativo solo opera datos de su academia.
- Comprobantes con autorización backend y almacenamiento privado o URL temporal.
- Cobros externos usan webhook verificado e idempotencia; nunca query params como fuente de verdad.
- No registrar payloads sensibles completos.

## Invariantes académicas

- Un profesor solo consulta/modifica cursos y clases asignados en la academia activa.
- Un alumno solo consulta sus inscripciones, pagos, materiales y asistencias.
- Una inscripción vincula usuario y curso de la misma academia.
- Una asistencia pertenece a una inscripción del curso/clase correcto.
- Estados de inscripción usan transiciones explícitas y autorizadas.
- Historial académico/financiero se anula, archiva o desactiva; no se destruye silenciosamente.
- Operaciones compuestas usan transacciones y bloqueos cuando haya concurrencia.

## Estándar frontend y UX

- React 19, TypeScript estricto e Inertia 2.
- Consolidar un sistema visual principal; preferir Tailwind 4 + shadcn/Radix existentes salvo evidencia para otra decisión.
- No mantener árboles de UI paralelos sin justificación.
- Contratos de props específicos por página; evitar bolsas globales opcionales.
- `npm run types` debe quedar sin errores y ser bloqueante.
- Compatible con claro/oscuro, escritorio, tablet y móvil.
- Sidebar y navegación representan el contexto autorizado, pero no reemplazan seguridad backend.
- Verificar teclado, foco, accesibilidad, estados vacíos, carga, error y confirmaciones.
- Flujos intuitivos para usuarios no técnicos, especialmente asistencia, inscripción y pagos móviles.
- Dashboards accionables según rol y academia activa.

## Estándar backend

- Form Requests para validación/autorización de entrada.
- Policies, middleware y servicios de dominio para reglas reutilizables.
- Controladores coordinan; no concentran toda la lógica.
- Toda consulta operativa filtra por academia activa.
- Relaciones cruzadas se validan en Laravel.
- Transacciones para cambios múltiples y eventos financieros/académicos.
- No usar floats para dinero; usar decimales/cálculos reproducibles.
- Snapshots cuando el historial no deba cambiar por ediciones posteriores.
- No exponer excepciones, payloads ni datos sensibles al navegador.
- Índices, foreign keys, unicidades tenant y estrategias de archivo/anulación.

## Política Git objetivo

- `main`: estable y publicable.
- `develop`: integración permanente.
- Solo `main` y `develop` permanecen como ramas permanentes local/remoto.
- Tareas normales nacen de `develop` actualizada como `feat/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*` o `test/*`.
- `hotfix/*` nace de `main` y se reintegra en `main` y `develop`.
- Nunca implementar directamente en `main` o `develop`.
- Una rama temporal por cambio coherente; nunca una rama gigante “modernización”.
- Crear ramas/editar no requiere otra pregunta si la fase está aprobada.
- Commit, push, integración, eliminación y PR requieren autorización, salvo autorización escrita del flujo Git completo de la fase.
- No rebase, force-push, `reset --hard`, `clean` ni `branch -D` sin autorización explícita.
- Antes de eliminar, demostrar integración remota y ausencia de commits exclusivos.

### Bootstrap inicial

1. Confirmar que `main` coincide con `origin/main` y que solo este `AGENTS.md` aparece como cambio esperado.
2. Ejecutar `git fetch origin --prune` y auditar ramas/contención.
3. Crear `develop` exactamente desde `main` y publicarla cuando esté autorizado.
4. Crear desde `develop` `docs/acadesys-modernization-baseline`.
5. Incorporar este archivo y documentación inicial en esa rama.
6. Validar, integrar en `develop` y subir.
7. No promover a `main` hasta completar una primera fase estable.
8. Eliminar `backend-ivan`, `frontend-damian` u otras ramas solo tras demostrar nuevamente que no tienen trabajo exclusivo y recibir autorización.

## Documentación a construir en Fase 0

- `docs/ACADESYS_CURRENT_STATE.md`;
- `docs/ACADESYS_ARCHITECTURE.md`;
- `docs/ACADESYS_AUTHORIZATION_AND_TENANCY.md`;
- `docs/ACADESYS_DECISIONS.md`;
- `docs/ACADESYS_KNOWN_ISSUES.md`;
- `docs/ACADESYS_DEVELOPMENT_WORKFLOW.md`;
- `docs/ACADESYS_TESTING_AND_VALIDATION.md`;
- `app/AGENTS.md` para backend;
- `resources/js/AGENTS.md` para React/Inertia.

Luego, toda tarea lee los documentos pertinentes antes de editar.

## Hoja de ruta

Avanzar por fases. No detenerse tras una auditoría, pero tampoco hacer una reescritura masiva sin controles.

### Fase 0 — Baseline y gobierno

- Crear `develop` y política Git.
- Instalar reproduciblemente con `composer install` y `npm ci`; no actualizar aún.
- Ejecutar baseline de tipos, build, pruebas, formato, lint y auditorías.
- Inventariar rutas, roles, permisos, tablas, modelos, controladores, páginas y flujos.
- Crear documentación fuente de verdad e issues P0/P1/P2 con evidencia.
- Auditar `acadesys.sql` sin exponer datos sensibles.

### Fase 1 — Seguridad y preservación

- Cerrar IDOR y autorizaciones horizontales/verticales.
- Proteger inscripciones, asistencias, cursos, usuarios, pagos y comprobantes.
- Corregir retornos de Mercado Pago y preparar webhooks verificados.
- Eliminar logging sensible.
- Sustituir borrados de historial por anulación/archivo.
- Añadir pruebas de regresión antes de refactors visuales.

### Fase 2 — Stack y dependencias

- Actualizar dependencias en ramas separadas/revisables.
- Evaluar Laravel 12 → 13 y PHP `^8.3` con documentación oficial.
- No degradar paquetes ya más recientes; no bajar Vite 7 solo porque Vendra use otra versión.
- Resolver advisories priorizando críticos/altos.
- Mantener types, build y pruebas verdes en cada salto.

### Fase 3 — Fundación multiacademia

- `academias`, membresías, contexto activo y administración global.
- Estrategia documentada de roles tenant.
- Migración a academia inicial sin pérdida.
- `academia_id`, índices y reglas de misma academia.
- Selector de academia accesible.
- Tests de cero/una/varias academias, academia ajena, membresía inactiva, rol por academia y superusuario.

### Fase 4 — Onboarding, planes y suscripciones

- Crear academia y propietario inicial.
- Configuración editable.
- Planes/capacidades/límites desde backend.
- Checkout idempotente y webhook verificado.
- Consola global y soporte consultivo.

### Fase 5 — Reingeniería por módulo

Orden sugerido, una rama/contrato por módulo:

1. usuarios, membresías y perfiles;
2. cursos, cohortes, horarios y docentes;
3. inscripciones y estados;
4. clases, asistencias e historial;
5. aranceles, cuotas y pagos académicos;
6. comprobantes/documentación;
7. dashboards/reportes;
8. landing, catálogo público y onboarding.

Para cada módulo: diagnosticar, definir contrato/exclusiones, aislar por academia, reestructurar backend/frontend, probar permisos/tenant/relaciones, verificar responsive/accesibilidad, documentar, validar e integrar antes del siguiente.

### Fase 6 — Experiencia de producto

- Consolidar diseño, sidebar, navegación, dashboards y selector.
- Experiencias específicas de propietario, administrativo, profesor y alumno.
- Optimizar flujos móviles.
- Estados vacíos, onboarding y feedback consistente.

### Fase 7 — Hardening

- E2E críticos, seguridad y dependencias.
- Archivos, PDFs, colas, correo, rate limiting y logs.
- Español, moneda y timezone configurables.
- Backups, observabilidad y recuperación.
- Mercado Pago real con HTTPS/credenciales comerciales.
- Checklist de despliegue sin secretos.

## Validación mínima

Con dependencias instaladas, ejecutar según alcance:

```bash
php artisan optimize:clear
composer validate --strict
vendor/bin/pint --test
npm run types
npm run format:check
npm run build
php artisan test
git diff --check
git status -sb
```

Auditorías controladas:

```bash
composer audit --locked
npm audit
```

No ejecutar `composer update` ni `npm audit fix` indiscriminadamente. Seleccionar, documentar y probar actualizaciones. Si `npm run lint` usa `--fix`, revisar el diff y crear un `lint:check` no mutante antes de usarlo como gate.

No declarar una fase terminada si types, build, pruebas aplicables, `git diff --check` o el working tree esperado fallan.

## Tests tenant mínimos por módulo

- El autorizado opera datos de su academia activa.
- Datos ajenos no aparecen en listados/búsquedas.
- IDs de otra academia retornan 403/404 sin cambios.
- Relaciones cruzadas son rechazadas.
- Cambiar academia actualiza contexto/navegación sin caché obsoleta.
- Superusuario requiere contexto explícito para operar datos académicos.
- Profesor, administrativo y alumno conservan permisos distintos.
- Un usuario con roles diferentes en dos academias obtiene el rol correcto al cambiar contexto.

## Qué significa “al nivel de Vendra”

- fuente central de contexto tenant;
- aislamiento backend demostrado por tests;
- roles, membresía, permisos y planes separados;
- módulos con contratos claros y servicios transaccionales;
- historial académico/financiero auditable;
- pagos verificados e idempotentes;
- TypeScript, build y pruebas bloqueantes;
- UI moderna, responsive, accesible y consistente;
- documentación viva y decisiones registradas;
- Git con `main`, `develop` y ramas temporales.

No significa copiar tablas, pantallas, nombres ni reglas comerciales de Vendra.

## Criterios finales

- Solo `main` y `develop` permanentes.
- `main` estable y validada.
- Sin errores TypeScript ni fallos de build/tests.
- Sin advisories críticos/altos sin resolver o aceptar/documentar el riesgo.
- Todos los módulos aislados por academia y cubiertos por tests tenant.
- Roles realmente scoped por academia.
- Pagos académicos y suscripciones SaaS separados/auditados.
- Mercado Pago con backend, webhook e idempotencia.
- Flujos principales desktop/móvil, claro/oscuro.
- Documentación y código coinciden.
- Sin secretos ni datos reales versionados.
- Deuda restante explícita, priorizada y fuera del alcance aprobado.

## Prohibiciones

- No copiar módulos comerciales de Vendra.
- No asumir que ocultar UI autoriza.
- No confiar en IDs, precios, academia, roles o estados del navegador.
- No modificar `.env`, credenciales ni datos reales.
- No ejecutar `migrate:fresh`, `db:wipe`, `git reset --hard`, `git clean`, force-push, rebase destructivo, `composer update` global ni `npm audit fix` sin autorización explícita.
- No eliminar legado, archivos, ramas o tablas sin demostrar referencias, contención e impacto.
- No mezclar actualización total de dependencias, tenancy y rediseño completo en una sola rama/commit.
- No declarar éxito solamente porque la aplicación compila.
