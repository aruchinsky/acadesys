# Guía para React/Inertia

Leé primero `/AGENTS.md` y los documentos de `docs/` aplicables.

- Sistema principal: React 19 + Inertia 2 + TypeScript estricto + Tailwind 4 + shadcn/Radix bajo `resources/js`.
- No agregues Chakra ni otro árbol paralelo. No borres `src` sin auditar referencias y trabajar en una rama específica.
- Definí props por página; evitá `pageProps` global opcional, casts y `any`. El backend entrega DTOs mínimos y explícitos.
- Navegación y botones reflejan permisos/contexto, pero nunca se consideran autorización.
- El selector de academia debe ser accesible y actualizar contexto sin conservar datos/rol de la academia previa.
- Diseñá para teclado, foco visible, lectores, claro/oscuro, escritorio/tablet/móvil y estados vacío/carga/error/confirmación.
- Los flujos móviles de asistencia, inscripción y pagos priorizan pocos pasos y feedback inequívoco.
- Ejecutá `npm run lint:check`, `npm run types`, `npm run format:check` y `npm run build`.
