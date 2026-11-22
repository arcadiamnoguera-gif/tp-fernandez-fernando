# Explorador de Personajes · Rick y Morty

Aplicación web de una sola pantalla que consulta la API pública de Rick and Morty para buscar y filtrar personajes por nombre y estado vital, mostrándolos en tarjetas responsivas. Resuelve la necesidad de consultar información de personajes de forma rápida, visual y persistente sin recargar la página.

**Autor:** Fernando Fernández · Fundamentos de Desarrollo Web · UCSA
**Variante del TP:** A (Personajes — último dígito de cédula: 0)

## Sitios publicados
- GitHub Pages: https://usuario.github.io/tp-fernandez-fernando/
- Vercel : https://tp-fernandez-fernando-tp-fernandez.vercel.app

## Funcionalidades
- Búsqueda de personajes por nombre y combinación con el filtro de estado (`Todos`, `Vivo`, `Muerto`, `Desconocido`).
- Validación para evitar consultas vacías y manejo de estados de carga, sin resultados (`404`) y errores de conexión.
- Renderizado dinámico de tarjetas con imagen, nombre, estado, especie y lugar de origen (mostrando «Desconocido» cuando aplica).
- Persistencia automática de la última búsqueda en `localStorage` al recargar la página.

## Tecnologías
- HTML5, CSS3, JavaScript (ES6+), Fetch API, localStorage, API de Rick and Morty.

## Estructura del proyecto
```text
tp-fernandez-fernando/
├── index.html          # Estructura semántica principal y formulario de búsqueda
├── README.md           # Documentación del proyecto y enlaces de despliegue
├── css/
│   └── estilos.css     # Estilos con variables CSS, Flexbox, CSS Grid y diseño responsive
├── js/
│   └── app.js          # Lógica de consulta a la API, renderizado DOM y localStorage
└── img/
    └── captura.png     # Captura de pantalla de la aplicación en funcionamiento
Cómo ejecutarlo localmente
git clone https://github.com/usuario/tp-fernandez-fernando.git

Abrir index.html en el navegador (o con Live Server).

Despliegue
El proyecto está publicado tanto en GitHub Pages como en Vercel a partir de la rama main desde la raíz del repositorio (/). Cada vez que se realiza un push o se suben cambios a la rama main, ambas plataformas actualizan automáticamente el sitio publicado