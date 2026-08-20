# Testing y validación

## Instalación reproducible

```bash
composer install --no-interaction --prefer-dist
npm ci
```

No generar ni versionar credenciales para lograr que los tests pasen. `phpunit.xml` contiene una clave fija exclusiva del entorno efímero de test y usa SQLite en memoria, cache/session array y queue sync.

## Gates mínimos

```bash
php artisan optimize:clear
composer validate --strict
vendor/bin/pint --test
npm run types
npm run format:check
npm run lint:check
npm run build
php artisan test
git diff --check
git status -sb
```

`npm run lint` es mutante porque incluye `--fix`. El gate usa `npm run lint:check`, que ejecuta `eslint .` sin modificar archivos.

## Auditorías

```bash
composer audit --locked
npm audit
```

Un advisory no se corrige a ciegas: identificar paquete directo/transitivo, exposición real, versión corregida, impacto de actualización y regresiones. Críticos/altos bloquean release salvo aceptación explícita, acotada y documentada.

## Baseline del 19-08-2026

- Build pasa.
- Types fallaba con 5 errores de nulabilidad/props; corregido en la rama baseline.
- Tests fallaban por falta de `APP_KEY`; se agregó configuración test-only y se reejecuta la suite.
- Pint/Prettier detectaron diferencias masivas y se normalizan mecánicamente en la rama baseline.
- ESLint inicial: 60 errores y 2 warnings. La rama baseline corrige los contratos/variables reportados sin relajar reglas y agrega `lint:check`.
- `composer validate --strict` reporta el pin exacto `mercadopago/dx-php: 3.8.0`; no se altera el lockfile en Fase 0.
- `optimize:clear` requiere una configuración local válida: con defaults de `.env.example`, SQLite/cache database no existen tras solo instalar dependencias.

## Matriz tenant mínima

Cada módulo debe probar autorizado propio, ocultamiento de datos ajenos, ID de otra academia, relación cruzada, membresía inactiva, cambio de academia, roles diferentes por academia y superusuario sin contexto. Los tests de dinero agregan importe/moneda/snapshot, webhook auténtico, reintento idempotente y retorno de navegador no autoritativo.

## Evidencia de cierre

Guardar en el commit/PR el resumen de comandos, conteos y fallos aceptados. Nunca afirmar que una fase terminó si types, build, tests aplicables, `git diff --check` o el árbol esperado fallan.
