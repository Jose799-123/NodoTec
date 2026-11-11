// Botones "Ver más": muestran u ocultan el detalle de cada servicio
document.querySelectorAll(".tarjeta button").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const detalle = boton.previousElementSibling;
    detalle.classList.toggle("oculto");
    boton.textContent = detalle.classList.contains("oculto") ? "Ver más" : "Ver menos";
  });
});

// Formulario: validación y mensaje de respuesta
const formulario = document.getElementById("formulario");
const respuesta = document.getElementById("respuesta");

function mostrarMensaje(texto, tipo) {
  respuesta.textContent = texto;
  respuesta.className = tipo;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (nombre === "" || correo === "" || mensaje === "") {
    mostrarMensaje("Completa todos los campos.", "error");
  } else if (!/^\S+@\S+\.\S+$/.test(correo)) {
    mostrarMensaje("Escribe un correo válido.", "error");
  } else {
    mostrarMensaje("¡Gracias, " + nombre + "! Te contactaremos pronto.", "exito");
    formulario.reset();
  }
});
