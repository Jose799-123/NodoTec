// ===== 1. Modo oscuro =====
const btnTema = document.getElementById("btnTema");

btnTema.addEventListener("click", function () {
  document.body.classList.toggle("oscuro");
  btnTema.textContent = document.body.classList.contains("oscuro") ? "Modo claro" : "Modo oscuro";
});

// ===== 2. Botones "Ver más" de los servicios =====
document.querySelectorAll(".tarjeta button").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const detalle = boton.previousElementSibling;
    detalle.classList.toggle("oculto");
    boton.textContent = detalle.classList.contains("oculto") ? "Ver más" : "Ver menos";
  });
});

// ===== 3. Botón volver arriba =====
const btnArriba = document.getElementById("btnArriba");

window.addEventListener("scroll", function () {
  btnArriba.classList.toggle("visible", window.scrollY > 400);
});

btnArriba.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== 4. Formulario: validación y mensaje de respuesta =====
const formulario = document.getElementById("formulario");
const respuesta = document.getElementById("respuesta");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const telefono = document.getElementById("telefono");
const servicio = document.getElementById("servicio");
const mensaje = document.getElementById("mensaje");
const acepto = document.getElementById("acepto");

// Muestra el mensaje. Si hay un campo con error, lo marca en rojo y lo selecciona.
function mostrarMensaje(texto, tipo, campo) {
  respuesta.textContent = texto;
  respuesta.className = tipo;
  document.querySelectorAll(".invalido").forEach(function (otro) {
    otro.classList.remove("invalido");
  });
  if (campo) {
    campo.classList.add("invalido");
    campo.focus();
  }
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (nombre.value.trim() === "") {
    mostrarMensaje("Escribe tu nombre.", "error", nombre);
  } else if (!/^\S+@\S+\.\S+$/.test(correo.value.trim())) {
    mostrarMensaje("Escribe un correo válido, por ejemplo: nombre@correo.com", "error", correo);
  } else if (!/^[0-9]{10}$/.test(telefono.value.replaceAll(" ", ""))) {
    mostrarMensaje("El celular debe tener 10 números.", "error", telefono);
  } else if (servicio.value === "") {
    mostrarMensaje("Selecciona un servicio.", "error", servicio);
  } else if (mensaje.value.trim().length < 10) {
    mostrarMensaje("Cuéntanos un poco más del problema (mínimo 10 caracteres).", "error", mensaje);
  } else if (!acepto.checked) {
    mostrarMensaje("Debes aceptar el tratamiento de datos.", "error", acepto);
  } else {
    mostrarMensaje("¡Gracias, " + nombre.value.trim() + "! Recibimos tu solicitud de " + servicio.value + ".", "exito");
    formulario.reset();
  }
});
