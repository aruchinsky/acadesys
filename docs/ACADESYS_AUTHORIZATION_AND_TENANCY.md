# Autorización y tenancy

## Hallazgo actual

Spatie Permission funciona con `teams=false`; los roles son globales. No hay Policies. Siete rutas resource de inscripciones permiten a `profesor` y `alumno` crear, ver, editar y eliminar recursos. El binding de curso/pago no prueba propiedad o asignación en varias acciones. Toda consulta administrativa es global.

## Modelo decidido

Se adoptará una combinación deliberada:

- `academia_user` (o modelo `MembresiaAcademia`) será la membresía auditable con estado, fechas e identidad del actor que cambia el estado.
- Spatie teams usará `academia_id` para roles y permisos dentro del tenant.
- `superusuario` seguirá siendo una capacidad global fuera de los roles académicos tenant.
- `AcadeSysContextService` será la única fuente de academia activa, membresía, rol/permisos tenant, plan y modo global.

La membresía y Spatie no duplican responsabilidades: la primera responde si el usuario pertenece y puede entrar; Spatie responde qué puede hacer dentro de esa academia.

## Resolución de contexto

1. Autenticar identidad global.
2. Cargar membresías activas disponibles.
3. Validar `academia_activa_id` de sesión contra esas membresías.
4. Autoseleccionar solo cuando haya exactamente una academia válida.
5. Exigir selección con múltiples academias o para operación académica de superusuario.
6. Configurar el team de Spatie antes de resolver permisos.
7. Compartir con Inertia un DTO explícito y mínimo; nunca modelos sin contrato.

Una academia enviada por request puede expresar intención de cambio, pero el backend debe verificar membresía y escribir la sesión. Ningún endpoint operativo acepta `academia_id` como autorización.

## Matriz mínima

| Actor | Alcance permitido |
| --- | --- |
| Superusuario | Administración global; para operar datos académicos necesita academia explícita |
| Propietario | Configuración, membresías, plan y operación de su academia |
| Administrativo | Operación académica/financiera autorizada de su academia |
| Profesor | Solo cursos/clases asignados y alumnos de esos cursos |
| Alumno | Solo su trayectoria, materiales, asistencias, obligaciones y pagos |

## Reglas de implementación

- Todas las entidades operativas llevan `academia_id` y todas las relaciones cruzadas verifican igualdad.
- Preferir 404 para recursos ajenos cuando revelar existencia sea riesgoso; 403 para una acción conocida sin permiso.
- Form Requests validan forma y relaciones; Policies autorizan recurso/acción; servicios preservan invariantes y transacciones.
- No elegir el primer rol de una colección. El rol se resuelve para la academia activa.
- Las consultas de listados parten del contexto tenant, no filtran luego en memoria.
- Los comprobantes usan autorización backend y almacenamiento privado/URL temporal.

## Pruebas obligatorias por módulo

- autorizado en academia activa;
- ausencia de datos de otra academia en listados y búsquedas;
- ID ajeno produce 403/404 sin mutación;
- relación entre academias rechazada;
- membresía inactiva bloqueada;
- cambio de contexto sin caché de rol/permisos obsoleta;
- mismo usuario con roles distintos en dos academias;
- superusuario sin contexto explícito no opera datos académicos.
