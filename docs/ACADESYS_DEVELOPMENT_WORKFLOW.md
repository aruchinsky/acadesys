# Flujo de desarrollo

## Ramas

- `main`: estable/publicable.
- `develop`: integración permanente.
- Trabajo normal: `feat/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*` o `test/*` desde `develop` actualizada.
- Hotfix: `hotfix/*` desde `main`, reintegrado en `main` y `develop`.

No implementar directamente en ramas permanentes. Una rama temporal debe contener un cambio coherente y revisable.

## Secuencia

1. Leer `AGENTS.md` y los documentos aplicables.
2. Verificar `git status -sb`, hacer `git fetch origin --prune` y actualizar la base sin rebase destructivo.
3. Crear una rama temporal desde la rama correcta.
4. Definir contrato, invariantes, exclusiones y pruebas antes de cambios de dominio.
5. Editar, ejecutar validaciones proporcionales y revisar el diff completo.
6. Commit/push/merge/PR/limpieza requieren autorización, salvo autorización escrita del flujo completo de la fase.
7. Antes de borrar una rama, demostrar integración remota y cero commits exclusivos.

## Dependencias

- Instalación: `composer install` y `npm ci`.
- No usar `composer update` global, `npm audit fix` ni cambiar lockfiles como efecto lateral.
- Cada actualización vive en una rama pequeña, se justifica por advisory/compatibilidad y conserva types, build y tests verdes.

## Bases y archivos

Prohibidos como atajo: `migrate:fresh`, `db:wipe`, borrado de bases, `git reset --hard`, `git clean`, force-push y rebase destructivo. No modificar `.env`, secretos ni datos reales. Las migraciones existentes aplicadas son inmutables; las correcciones usan migraciones nuevas y reversibles.

## Revisión mínima

- autorización backend y filtro tenant en toda consulta operativa;
- validación de relaciones de la misma academia;
- transacción e idempotencia donde haya cambios múltiples/dinero;
- preservación de historial y datos;
- contratos TypeScript por página;
- accesibilidad, responsive, claro/oscuro y estados de carga/error/vacío;
- documentación e issue actualizados.

Los checks frontend no mutantes son `npm run lint:check`, `npm run types`, `npm run format:check` y `npm run build`.
