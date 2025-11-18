# README — Generación automática de Layout Web

Este documento define **las instrucciones exactas** que debe seguir el generador de código para construir el layout base de la aplicación.

## 🎯 Objetivo

Generar un **layout web** compuesto por:

1. **Header fijo**
   - Contendrá **una imagen de logo** a la izquierda.
   - A la derecha del logo se mostrará **el nombre de la empresa**.
   - El header se mantiene fijo arriba y ocupa únicamente su altura natural.

2. **Content**
   - Debe ocupar **todo el alto restante del viewport** (`100vh - header`).
   - Es el contenedor donde se cargarán **todas las páginas internas**.
   - Debe permitir scroll interno si el contenido excede el alto disponible.

---

## 📐 Estructura que debe generar

```
+-----------------------------------------------------------+
| HEADER                                                    |
|  +------------------+   Empresa XYZ                      |
|  |      LOGO        |                                    |
|  +------------------+                                    |
+-----------------------------------------------------------+
| CONTENT (ocupa todo el alto restante del viewport)       |
|   Aquí se cargarán las páginas internas                  |
|                                                           |
|                                                           |
+-----------------------------------------------------------+
```

---

## 🧩 Requisitos técnicos del layout

El generador debe construir:

### ✔️ Un componente `Layout`

- Que envuelva toda la aplicación.
- Con dos secciones: `header` y `content`.

### ✔️ Header

Debe incluir:

- Un contenedor para la **imagen del logo** (siempre visible).
- A la derecha del logo, el texto **con el nombre de la empresa**.
- Estilos esperados:
  - Alineado horizontalmente.
  - Espaciado entre logo y texto.
  - Fondo claro.
  - Borde inferior opcional para separación visual.

### ✔️ Content

Debe:

- Ocupar **todo el espacio vertical sobrante**.
- Ser un contenedor dinámico donde se montarán las páginas.
- Permitir scroll vertical.
- Tener padding interno.

---

## 🧱 HTML / JSX esperado

El prompt debe generar algo equivalente a:

```jsx
<div className="layout">
  <header className="header">
    <img src="/ruta-del-logo.png" alt="Logo" className="logo" />
    <span className="company-name">Nombre de la Empresa</span>
  </header>

  <main className="content">{/* Aquí se cargarán las páginas internas */}</main>
</div>
```

---

## 🎨 CSS esperado

El prompt debe generar estilos equivalentes a:

```css
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: #fafafa;
  border-bottom: 1px solid #dcdcdc;
}

.logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.company-name {
  font-size: 1.4rem;
  font-weight: 600;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #ffffff;
}
```

---

## 📌 Prompt sugerido para generar el layout

Incluye este README y luego usa el siguiente prompt:

> **Genera un layout según la especificación del README.md adjunto.  
> El header debe incluir una imagen de logo a la izquierda y el nombre de la empresa a la derecha.  
> El content debe ocupar todo el alto restante del viewport y alojar las páginas internas.**

---

## ✔️ Resultado esperado

Un archivo o conjunto de archivos que implementen:

- `Layout.jsx` / `Layout.tsx`
- `layout.css` o estilos equivalentes
- Estructura funcional lista para montar routing o contenido dinámico.
