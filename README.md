# Blends de aromatizantes (web app para celular)

App estática: HTML + CSS + JavaScript puro. No necesita servidor, base de datos ni instalar nada.
Se puede instalar en el celu como app (PWA) y funciona sin internet después de la primera carga.

## Archivos
- index.html, styles.css, app.js: la app
- manifest.webmanifest, sw.js, icons/: instalación en el celu y modo offline

## Cómo publicarla (gratis, elegí una)
1. Netlify: entrá a app.netlify.com/drop y arrastrá esta carpeta. Te da un link https.
2. Cloudflare Pages o Vercel: creá un proyecto nuevo, subí la carpeta, sin comando de build.
3. GitHub Pages: subí los archivos a un repositorio y activá Pages en Settings.
Tiene que ser https para que funcione el botón Copiar y la instalación.

## Instalar en el celu
- Android (Chrome): menú ⋮ > Instalar app / Agregar a pantalla de inicio.
- iPhone (Safari): botón Compartir > Agregar a pantalla de inicio.

## Cambiar datos
Todo está al principio de app.js: PRODUCTS (fórmulas), ESENCIAS y BLENDS.
Si cambiás archivos, subí el número de versión V en sw.js (por ejemplo "blends-v2")
para que los celus tomen la actualización.
