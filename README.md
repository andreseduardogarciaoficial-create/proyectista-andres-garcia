# Andrés García · Delineante proyectista

Web profesional de Andrés García, delineante proyectista especializado en
edificación, modelado BIM, representación gráfica, presupuestos, mediciones y
estructuras metálicas.

Sitio estático (HTML, CSS y JavaScript sin dependencias ni compilación),
preparado para publicarse con **GitHub Pages**.

## Estructura

```
├── index.html              Página principal (todas las secciones)
├── 404.html                Página de error
├── assets/
│   ├── css/styles.css      Estilos (diseño adaptable)
│   ├── js/config.js        ← DATOS EDITABLES: contacto, CV, proyectos, renders
│   ├── js/main.js          Interacciones (menú, animaciones, filtros, visor, formulario)
│   ├── img/                Imágenes (perfil, proyectos, renders, planos)
│   └── docs/               Currículum en PDF
├── robots.txt / sitemap.xml / site.webmanifest
└── .nojekyll
```

Secciones: inicio, presentación profesional, servicios, portafolio de proyectos,
modelado 3D, competencias técnicas, software utilizado y contacto.

## Cómo añadir tu contenido

Casi todo se edita en **`assets/js/config.js`**. Los campos vacíos se ocultan o
muestran un espacio reservado, de modo que nunca aparecen datos inventados.

1. **Datos de contacto** — rellena `contact.email`, `contact.phone`,
   `contact.linkedin` y/o `contact.location`. Con el correo relleno, el
   formulario abre el cliente de correo del visitante con el mensaje preparado.
2. **Currículum** — sube el PDF a `assets/docs/` y escribe la ruta en `cvUrl`.
3. **Proyectos** — sube las imágenes a `assets/img/proyectos/` (o `planos/`) y
   añade objetos a `projects` (hay un ejemplo comentado en el archivo).
   Categorías: `edificacion`, `bim`, `estructuras`, `planos`.
4. **Renders** — sube las imágenes a `assets/img/renders/` y añádelas a `renders`.
5. **Visor 3D o vídeo** (opcional) — URL de inserción `https://…` en `viewerEmbedUrl`.
6. **Imagen principal y fotografía** — en `index.html`, sustituye los bloques
   `.media-slot` del inicio y del perfil por una etiqueta `<img>` (las
   instrucciones están en comentarios junto a cada bloque).

## Probar en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar en GitHub Pages

1. Fusiona la pull request en `main`.
2. En GitHub: **Settings → Pages → Build and deployment**.
3. *Source*: **Deploy from a branch** · *Branch*: `main` · carpeta `/ (root)` → **Save**.
4. En uno o dos minutos la web estará en
   `https://andreseduardogarciaoficial-create.github.io/proyectista-andres-garcia/`.

Si más adelante usas un dominio propio, actualiza las URL de `index.html`
(`canonical`, `og:url`, `og:image`, JSON-LD), `robots.txt`, `sitemap.xml` y las
rutas absolutas de `404.html`.
