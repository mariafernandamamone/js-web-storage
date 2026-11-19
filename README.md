# Web Storage & Cookies Practice (JavaScript)

Prácticas del módulo de almacenamiento en el navegador (**Cookies**, **localStorage** y **sessionStorage**) desarrolladas con JavaScript Vanilla (ES6+), HTML5 y CSS3.

## Live Demo

- [Ver proyecto en GitHub Pages](https://mariafernandamamone.github.io/js-web-storage/)

## Proyectos incluidos

1. **Gestión de Consentimiento de Cookies (`/cookies`)**
   - Banner de aceptación y rechazo con tiempos de expiración dinámicos mediante `document.cookie` y `max-age` (30 días al aceptar, 24 horas al cancelar).
   - Inyección dinámica de scripts externos (`analitica.js`) únicamente cuando existe consentimiento activo.

2. **Memory Card Game Persistente (`/local-y-session-storage`)**
   - Evolución del juego de memoria 6×5 con interacción *drag-and-drop*.
   - Serialización y restauración completa del estado de la partida (orden del tablero, parejas descubiertas, contador y temporizador) utilizando `localStorage`, `JSON.stringify()` y `JSON.parse()`.

---
Desarrollado por **María Fernanda Mamone**