# Guía para cambios backend

Leé primero `/AGENTS.md` y los documentos de `docs/` aplicables. AcadeSys es multiacademia; no introduzcas conceptos comerciales ajenos al dominio académico.

- Resolver academia desde `AcadeSysContextService`; nunca confiar en `academia_id`, rol, estado, precio o moneda del request.
- Toda entidad/consulta operativa debe quedar acotada a la academia activa y validar relaciones de la misma academia.
- Usar Form Requests para entrada, Policies para recurso/acción y servicios para transacciones/invariantes. Los controladores coordinan.
- Separar pagos académicos y suscripciones SaaS en modelos, estados, rutas, permisos, reportes y auditoría.
- Dinero decimal, snapshot histórico, idempotencia y webhook verificado. El retorno del navegador es informativo.
- No borrar historia académica/financiera: anular/archivar con actor, motivo y fecha.
- Probar happy path, rol incorrecto, tenant ajeno, relación cruzada, concurrencia e idempotencia según el módulo.
- No editar migraciones ya aplicadas ni usar comandos destructivos. Diseñar expand/backfill/verify/contract.
