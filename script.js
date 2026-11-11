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

function mostrarMensaje(texto, tipo) {
  respuesta.textContent = texto;
  respuesta.className = tipo;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const telefono = document.getElementById("telefono").value.replaceAll(" ", "");
  const servicio = document.getElementById("servicio").value;
  const mensaje = document.getElementById("mensaje").value.trim();
  const acepto = document.getElementById("acepto").checked;

  if (nombre === "" || correo === "" || telefono === "" || mensaje === "") {
    mostrarMensaje("Completa todos los campos.", "error");
  } else if (!/^\S+@\S+\.\S+$/.test(correo)) {
    mostrarMensaje("Escribe un correo válido.", "error");
  } else if (!/^[0-9]{10}$/.test(telefono)) {
    mostrarMensaje("El celular debe tener 10 números.", "error");
  } else if (servicio === "") {
    mostrarMensaje("Selecciona un servicio.", "error");
  } else if (!acepto) {
    mostrarMensaje("Debes aceptar el tratamiento de datos.", "error");
  } else {
    mostrarMensaje("¡Gracias, " + nombre + "! Recibimos tu solicitud de " + servicio + ".", "exito");
    formulario.reset();
  }
});
