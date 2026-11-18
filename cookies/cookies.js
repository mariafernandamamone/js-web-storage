document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const btnAceptar = document.getElementById("btn-aceptar");
  const btnCancelar = document.getElementById("btn-cancelar");

  const NOMBRE_COOKIE = "consentimiento_cookies";

  // 1. Función para crear/guardar una cookie con max-age en segundos
  function setCookie(nombre, valor, segundos) {
    document.cookie = `${nombre}=${valor}; max-age=${segundos}; path=/; SameSite=Lax`;
  }

  // 2. Función para leer el valor de una cookie específica
  function getCookie(nombre) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [clave, valor] = cookie.split("=");
      if (clave === nombre) {
        return valor;
      }
    }
    return null;
  }

  // 3. Función para inyectar dinámicamente el archivo analitica.js
  function cargarAnalitica() {
    const script = document.createElement("script");
    script.src = "analitica.js";
    document.body.appendChild(script);
  }

  // 4. Comprobar estado al cargar la página
  const estadoCookie = getCookie(NOMBRE_COOKIE);

  if (estadoCookie === "aceptado") {
    // Ya aceptó previamente: no mostramos banner, pero cargamos la analítica en cada petición
    cargarAnalitica();
  } else if (estadoCookie === "cancelado") {
    // Ya canceló hace menos de 24h: no mostramos banner ni cargamos analítica
    console.log("El usuario rechazó las cookies. No se carga analítica.");
  } else {
    // No existe la cookie (primera visita o ya expiró): mostramos el banner
    banner.classList.remove("oculto");
  }

  // 5. Eventos de los botones
  btnAceptar.addEventListener("click", () => {
    const unMesEnSegundos = 30 * 24 * 60 * 60; // 2.592.000 seg
    setCookie(NOMBRE_COOKIE, "aceptado", unMesEnSegundos);
    banner.classList.add("oculto");
    cargarAnalitica();
  });

  btnCancelar.addEventListener("click", () => {
    const unDiaEnSegundos = 24 * 60 * 60; // 86.400 seg
    setCookie(NOMBRE_COOKIE, "cancelado", unDiaEnSegundos);
    banner.classList.add("oculto");
    console.log("Cookies rechazadas por 24 horas.");
  });
});