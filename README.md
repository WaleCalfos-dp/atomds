# atomdoc monorepo

npm workspace containing two apps and one shared package:

```
apps/
  atom-docs/    React documentation site for the Atom design system (the original app).
  portal/       Customer-facing multi-tenant theming portal (Supabase auth + live preview).
packages/
  atom-core/    Shared library: token generator, semantic token catalog, 5 themed components.
```

## Quick start

```bash
npm install                  # installs all workspaces
npm run dev:docs             # atom-docs at http://localhost:5173
npm run dev:portal           # portal at http://localhost:5174
```

The portal requires Supabase credentials in `apps/portal/.env.local`. See `apps/portal/README.md` for the schema and setup steps.
