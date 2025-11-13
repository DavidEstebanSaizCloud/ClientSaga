# 🧠 #ClientSaga

Single Page Application (SPA) built with **React** and **TypeScript**, designed following **SOLID principles** and **industry best practices**.  
This document defines the architecture, tooling, folder structure, and coding standards to ensure a clean, scalable, and maintainable codebase. It is written to be **executable** so Codex (o cualquier generador) pueda crear el proyecto desde cero.

---

## ⚡ Quickstart (copy‑paste)

```bash
# Requisitos
node --version           # >= 20
corepack enable          # (opcional) pnpm

# Crear proyecto base
npm init -y
npm i react react-dom
npm i -D typescript vite @vitejs/plugin-react

# Calidad de código
npm i -D eslint prettier eslint-config-prettier eslint-plugin-react \
  eslint-plugin-react-hooks eslint-plugin-jsx-a11y \
  @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Testing
npm i -D vitest @testing-library/react @testing-library/user-event jsdom

# Hooks de git
npm i -D husky lint-staged

# Data fetching, HTTP y estilos
npm i @tanstack/react-query axios styled-components
npm i -D @types/styled-components

# Formularios y utilidades CSS
npm i react-hook-form
npm i -D tailwindcss postcss autoprefixer

# Inicializaciones
npx tsc --init --rootDir src --outDir dist --esModuleInterop --moduleResolution bundler --jsx react-jsx --strict
npm pkg set type="module"
npm pkg set scripts.dev="vite" scripts.build="tsc -b && vite build" scripts.preview="vite preview"
npm pkg set scripts.lint="eslint ." scripts.format="prettier -w ." scripts.test="vitest run" scripts['test:watch']="vitest" scripts.prepare="husky"

# Husky + lint-staged
npx husky init
npm pkg set lint-staged['*.{ts,tsx,js,jsx}']="eslint --fix" lint-staged['*.{ts,tsx,js,jsx,md,json,css}']="prettier -w"

# Tailwind
npx tailwindcss init -p
```

---

## 🧩 Project Overview

**SagaClient** is a single-page application (**SPA**) developed in **React + TypeScript**, following **SOLID** and **Clean Architecture** principles.  
The project enforces clear separation between **UI (view)**, **business logic (hooks)**, **API services**, and **styles**.

---

## 🏗️ Architecture

### SOLID Principles

- **S**ingle Responsibility: every file has a single purpose.
- **O**pen/Closed: open for extension, closed for modification.
- **L**iskov Substitution: components are replaceable without breaking the app.
- **I**nterface Segregation: smaller, purpose-driven interfaces.
- **D**ependency Inversion: rely on abstractions, not implementations.

---

## 📁 Folder Structure (seed)

```
project-root/
├── .env                  # Environment variables (API URLs, keys, etc.)
├── public/               # Public static assets (favicon, manifest, robots.txt)
│   └── favicon.ico       # (placeholder)
├── src/
│   ├── assets/           # Local static assets (images, fonts...)
│   ├── common/
│   │   ├── constants/    # Shared constants (Paths, Regex, etc.)
│   │   ├── types/        # Shared interfaces & TS types
│   │   └── utils/        # Utility functions
│   ├── components/       # One folder per component
│   │   └── ExampleCard/
│   │       ├── useExampleCard.ts
│   │       ├── styled.ts
│   │       └── view.tsx
│   ├── hooks/            # Global or domain-level hooks
│   │   ├── useAuth.ts
│   │   ├── useUsers.ts
│   │   └── useDashboard.ts
│   ├── pages/
│   │   └── Home/
│   │       ├── useHome.ts
│   │       ├── styled.ts
│   │       └── view.tsx
│   ├── services/         # Centralized API logic
│   │   ├── api.ts
│   │   ├── userService.ts
│   │   └── authService.ts
│   ├── styles/
│   │   ├── Colors.ts
│   │   └── tailwind.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.cjs
├── .prettierrc.json
├── .editorconfig
├── .nvmrc
└── README.md
```

---

## 🔧 Seed Files (contenido mínimo recomendado)

### `src/main.tsx` (con React Query Provider)

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const qc = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 2, refetchOnWindowFocus: false },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

### `src/App.tsx`

```tsx
import HomeView from "@/pages/Home/view";
export default function App() {
  return <HomeView />;
}
```

### `src/index.css` (Tailwind)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `tailwind.config.js`

```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

### `vite.config.ts` (aliases)

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

### `tsconfig.json` (fragmento clave)

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
  },
}
```

### `.eslintrc.cjs`

```js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  settings: { react: { version: "detect" } },
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/consistent-type-imports": "error",
  },
};
```

### `.prettierrc.json`

```json
{ "singleQuote": true, "semi": true, "trailingComma": "es5" }
```

### `.editorconfig`

```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
```

### `.nvmrc`

```
20
```

### `.env`

```
VITE_API_BASE_URL=https://api.example.com
VITE_ENV=development
```

---

## 🌐 API Layer and Axios Setup

### `src/services/api.ts` (con interceptores y errores normalizados)

```ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) =>
    Promise.reject(new Error(e?.response?.data?.message || e.message || "Network error")),
);

export default api;
```

### `src/services/userService.ts`

```ts
import api from "./api";

export const getUser = (id: string) => api.get(`/users/${id}`).then((r) => r.data);

export const updateUser = (id: string, payload: { name: string }) =>
  api.put(`/users/${id}`, payload).then((r) => r.data);
```

---

## 🔁 Data Fetching with React Query (patrón oficial)

> **Norma:** Los hooks `use{Componente}.ts` deben usar **React Query** para consultar/mutar datos.  
> Los hooks **no** llaman a axios directamente; siempre usan `/services/*`.

### Hook de lectura (useQuery)

```ts
// src/components/Profile/useProfile.ts
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/userService";

export function useProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "me"],
    queryFn: () => getUser("me"),
  });

  return {
    user: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
```

### Hook de escritura (useMutation) + invalidación

```ts
// src/components/Profile/useProfile.ts (mutación)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/userService";

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; name: string }) =>
      updateUser(payload.id, { name: payload.name }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["user", variables.id] });
      qc.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}
```

### Uso en la vista

```tsx
// src/components/Profile/view.tsx
import * as S from "./styled";
import { useProfile } from "./useProfile";
import { useUpdateProfile } from "./useProfile";

export default function ProfileView() {
  const { user, isLoading, error } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  if (isLoading) return <S.Wrapper>Loading…</S.Wrapper>;
  if (error) return <S.Wrapper role="alert">Error: {error}</S.Wrapper>;

  return (
    <S.Wrapper>
      <h1 className="text-xl">{user?.name}</h1>
      <button
        className="mt-3 px-4 py-2 rounded bg-black text-white"
        onClick={() => mutate({ id: user.id, name: "New Name" })}
        disabled={isPending}
      >
        Update name
      </button>
    </S.Wrapper>
  );
}
```

### Claves recomendadas

- Detalle: `['entity', id]` → `['user', 'me']`, `['post', postId]`
- Listas con filtros: `['entityList', filters]`
- Las mutaciones invalidan claves del **mismo dominio**

---

## 💅 Styling Rules

- **Tailwind** para layout/spacing/responsive.
- **styled-components** para estilos semánticos reutilizables (`styled.ts`).
- Tokens de color en `styles/Colors.ts` (evitar hex inline).

---

## 🧾 Form Management

- **react-hook-form** para formularios.
- Validación con **Zod** o **Yup** (opcional).
- Errores con `formState.errors`.

---

## 🧠 Code Quality and Developer Experience

- ESLint + Prettier + `jsx-a11y`.
- Husky + lint-staged (pre-commit).
- Paths absolutos `@/` (Vite + TS).

---

## 🧪 Testing

- Vitest + React Testing Library (unit/integration)
- Playwright/Cypress (E2E)
- MSW para mocks de API

---

## ♿ Accessibility and i18n

- `eslint-plugin-jsx-a11y`, roles y labels obligatorios.
- i18n con `react-intl` o `i18next` (`/src/locales`).

---

## 🚀 CI/CD (ejemplo GitHub Actions)

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## 📦 Code Snippets (Copy‑Paste Ready)

### Component Template (folder)

```
/components/
└── ExampleCard/
    ├── useExampleCard.ts
    ├── styled.ts
    └── view.tsx
```

**`useExampleCard.ts`**

```ts
import { useMemo } from "react";
import type { ReactNode } from "react";

export interface IExampleCardProps {
  title: string;
  description?: string;
  footer?: ReactNode;
}

export function useExampleCard(props: IExampleCardProps) {
  const { title, description = "", footer } = props;
  const isLong = useMemo(() => description.length > 80, [description]);
  return { title, description, footer, isLong };
}
```

**`styled.ts`**

```ts
import styled from "styled-components";

export const Card = styled.article`
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
`;
export const Title = styled.h3`
  font-size: 1.125rem;
  margin: 0;
`;
export const Desc = styled.p`
  margin: 0;
  color: #555;
`;
export const Footer = styled.footer`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;
```

**`view.tsx`**

```tsx
import * as S from "./styled";
import { useExampleCard, type IExampleCardProps } from "./useExampleCard";

export default function ExampleCard(props: IExampleCardProps) {
  const { title, description, footer, isLong } = useExampleCard(props);
  return (
    <S.Card className="shadow-sm">
      <S.Title>{title}</S.Title>
      <S.Desc>
        {description}
        {isLong ? "…" : ""}
      </S.Desc>
      {footer && <S.Footer>{footer}</S.Footer>}
    </S.Card>
  );
}
```

### Organización Interna del Archivo

El código dentro de un archivo .tsx debe seguir este orden estricto mediante comentarios de región:

- Imports

- Types/Interfaces (si son locales)

- Constants (Valores estáticos fuera del componente para evitar reinicialización)

- Components (Lógica del componente principal)

- Functions (Helpers complejos extraídos fuera del componente)

- Export Default

### Colores y Configuración

- Configuración Centralizada: No definas colores hexadecimales directamente en los componentes.

- Si necesitas colores personalizados fuera de la paleta por defecto de Tailwind, agrégalos en el archivo tailwind.config.js extendiendo el tema (theme.extend.colors).

- Uso Semántico: Utiliza nombres de clase semánticos configurados en Tailwind siempre que sea posible (ej. text-primary, bg-surface-hover, border-error) en lugar de colores genéricos (text-blue-500) para facilitar cambios de tema globales en el futuro.

---

## ✅ Best Practices Summary

- 🧩 Each component: `view.tsx` (UI) + `use{Component}.ts` (logic with **React Query**) + `styled.ts` (styles).
- 🧱 API calls in `/services/` (Axios), nunca en hooks directamente.
- ⚙️ `.env` en raíz; `public/` para estáticos públicos.
- 🧠 SOLID + Clean Architecture.
- 🧾 Tests (unit/integration/E2E).
- 💅 ESLint + Prettier + Husky.
- 🧭 CI/CD con checks obligatorios.
- 🌍 i18n y a11y de serie.
