/* ===================================
   NodoTec - JavaScript
   =================================== */


// ----- 1. Botones "Ver más" -----
// Muestran u ocultan el detalle de cada servicio
const botones = document.querySelectorAll(".btn-detalle");

botones.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const detalle = boton.parentElement.querySelector(".detalle");
    detalle.classList.toggle("oculto");

    if (detalle.classList.contains("oculto")) {
      boton.textContent = "Ver más";
    } else {
      boton.textContent = "Ver menos";
    }
  });
});


// ----- 2. Formulario -----
const formulario = document.getElementById("formulario");
const respuesta = document.getElementById("respuesta");

// Escribe el mensaje de respuesta con su color ("error" o "exito")
function mostrarMensaje(texto, tipo) {
  respuesta.textContent = texto;
  respuesta.className = tipo;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // Evita que la página se recargue

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const servicio = document.getElementById("servicio").value;
  const mensaje = document.getElementById("mensaje").value.trim();

  if (nombre === "") {
    mostrarMensaje("Por favor escribe tu nombre.", "error");
  } else if (!/^\S+@\S+\.\S+$/.test(correo)) {
    mostrarMensaje("Escribe un correo válido, por ejemplo: nombre@correo.com", "error");
  } else if (servicio === "") {
    mostrarMensaje("Selecciona un servicio.", "error");
  } else if (mensaje.length < 10) {
    mostrarMensaje("El mensaje debe tener al menos 10 caracteres.", "error");
  } else {
    mostrarMensaje("¡Gracias, " + nombre + "! Recibimos tu solicitud de " + servicio + ".", "exito");
    formulario.reset();
  }
});
