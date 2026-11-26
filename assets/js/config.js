/**
 * CONFIGURACIÓN DEL SITIO
 * ------------------------------------------------------------------
 * Este es el único archivo que necesitas editar para añadir tus datos
 * de contacto, tu currículum, tus proyectos y tus renders.
 * Todos los campos vacíos se ocultan automáticamente o muestran un
 * espacio reservado, así que nunca aparecerán datos inventados.
 */
window.SITE_CONFIG = {
  /* ---------- Contacto ----------
   * Rellena solo los campos que quieras mostrar. Ejemplo:
   *   email: "tu-correo@dominio.com",
   *   phone: "+34 600 000 000",
   *   linkedin: "https://www.linkedin.com/in/tu-perfil",
   *   location: "Ciudad, País",
   */
  contact: {
    email: "",
    phone: "",
    linkedin: "",
    location: ""
  },

  /* ---------- Currículum ----------
   * Sube tu PDF a assets/docs/ y escribe aquí la ruta, por ejemplo:
   *   cvUrl: "assets/docs/curriculum-andres-garcia.pdf"
   */
  cvUrl: "",

  /* ---------- Proyectos del portafolio ----------
   * Cada proyecto es un objeto. Categorías válidas (puedes usar varias):
   *   "edificacion", "bim", "estructuras", "planos"
   *
   * Ejemplo:
   * {
   *   title: "Nombre del proyecto",
   *   category: ["edificacion", "bim"],
   *   year: "2025",
   *   description: "Breve descripción del trabajo realizado.",
   *   tools: ["Revit", "Twinmotion"],
   *   image: "assets/img/proyectos/nombre-proyecto.jpg",
   *   alt: "Descripción de la imagen para accesibilidad",
   *   gallery: [   // opcional: más imágenes para el visor
   *     { src: "assets/img/planos/planta-baja.jpg", caption: "Planta baja" }
   *   ]
   * }
   */
  projects: [],

  /* Número de espacios reservados que se muestran mientras no haya proyectos. */
  projectPlaceholders: [
    { label: "Proyecto de edificación", category: ["edificacion"] },
    { label: "Modelo BIM", category: ["bim"] },
    { label: "Estructura metálica", category: ["estructuras"] },
    { label: "Plano técnico", category: ["planos"] },
    { label: "Proyecto de edificación", category: ["edificacion", "planos"] },
    { label: "Modelo BIM", category: ["bim", "edificacion"] }
  ],

  /* ---------- Renders / modelado 3D ----------
   * Ejemplo:
   * { src: "assets/img/renders/vista-exterior.jpg", caption: "Vista exterior", alt: "Render de fachada" }
   */
  renders: [],

  /* ---------- Visor 3D o vídeo (opcional) ----------
   * URL de inserción (iframe) de un vídeo o visor 3D, por ejemplo de YouTube,
   * Vimeo o un visor de modelos. Déjalo vacío para mostrar el espacio reservado.
   */
  viewerEmbedUrl: ""
};
