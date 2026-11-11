/* ==========================================================================
   NodoTec - Interactividad del sitio (script.js)
   Proyecto final - Programación Web I
   --------------------------------------------------------------------------
   ÍNDICE
   1.  Referencias a elementos del DOM
   2.  Utilidades (formato de precios, notificación, almacenamiento)
   3.  Menú de navegación (hamburguesa)
   4.  Efectos al hacer scroll (enlace activo, sombra, botón arriba)
   5.  Modo oscuro / claro
   6.  Contadores animados
   7.  Filtro de servicios
   8.  Cotizador
   9.  Carrusel de testimonios
   10. Acordeón de preguntas frecuentes
   11. Validación del formulario
   12. Inicialización
   ========================================================================== */


/* ==========================================================================
   1. REFERENCIAS A ELEMENTOS DEL DOM
   Guardamos los elementos en constantes para no buscarlos varias veces.
   ========================================================================== */
const encabezado = document.getElementById("encabezado");
const menu = document.getElementById("menu");
const btnMenu = document.getElementById("btnMenu");
const enlacesMenu = document.querySelectorAll(".menu-lista a");
const secciones = document.querySelectorAll("main section[id]");

const btnTema = document.getElementById("btnTema");
const iconoTema = document.getElementById("iconoTema");
const btnArriba = document.getElementById("btnArriba");
const toast = document.getElementById("toast");


/* ==========================================================================
   2. UTILIDADES
   ========================================================================== */

// Convierte un número en formato de pesos colombianos: 80000 -> "$80.000"
function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

// Muestra un mensaje corto en la parte inferior durante 2,5 segundos
let temporizadorToast;
function mostrarToast(mensaje) {
  toast.textContent = mensaje;
  toast.classList.add("visible");
  clearTimeout(temporizadorToast); // Reinicia el tiempo si ya había uno visible
  temporizadorToast = setTimeout(function () {
    toast.classList.remove("visible");
  }, 2500);
}

// localStorage puede fallar (por ejemplo, en modo incógnito de algunos
// navegadores), por eso usamos try/catch para que el sitio no se rompa.
function guardarPreferencia(clave, valor) {
  try {
    localStorage.setItem(clave, valor);
  } catch (error) {
    console.warn("No se pudo guardar la preferencia:", error);
  }
}

function leerPreferencia(clave) {
  try {
    return localStorage.getItem(clave);
  } catch (error) {
    return null;
  }
}


/* ==========================================================================
   3. MENÚ DE NAVEGACIÓN (hamburguesa)
   ========================================================================== */
function abrirCerrarMenu() {
  // toggle() agrega la clase si no está y la quita si está. Devuelve true/false.
  const abierto = menu.classList.toggle("abierto");
  btnMenu.classList.toggle("abierto", abierto);
  btnMenu.setAttribute("aria-expanded", abierto);
  btnMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
}

function cerrarMenu() {
  menu.classList.remove("abierto");
  btnMenu.classList.remove("abierto");
  btnMenu.setAttribute("aria-expanded", "false");
  btnMenu.setAttribute("aria-label", "Abrir menú");
}

// Evento click en el botón hamburguesa
btnMenu.addEventListener("click", abrirCerrarMenu);

// Al elegir una sección, el menú móvil se cierra
enlacesMenu.forEach(function (enlace) {
  enlace.addEventListener("click", cerrarMenu);
});

// Evento de teclado: la tecla Escape cierra el menú
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    cerrarMenu();
  }
});

// Responsive con JavaScript: si la ventana se agranda a tamaño de
// computador, se cierra el menú móvil para que no quede abierto.
window.addEventListener("resize", function () {
  if (window.innerWidth > 992) {
    cerrarMenu();
  }
});


/* ==========================================================================
   4. EFECTOS AL HACER SCROLL
   ========================================================================== */
function alHacerScroll() {
  const posicion = window.scrollY;

  // Sombra en el encabezado cuando no estamos arriba del todo
  encabezado.classList.toggle("con-sombra", posicion > 10);

  // Mostrar el botón "volver arriba" después de bajar 500px
  btnArriba.classList.toggle("visible", posicion > 500);

  // Detectar en qué sección está el usuario para resaltar su enlace
  let seccionActual = "inicio";
  secciones.forEach(function (seccion) {
    const inicioSeccion = seccion.offsetTop - encabezado.offsetHeight - 150;
    if (posicion >= inicioSeccion) {
      seccionActual = seccion.id;
    }
  });

  // Si llegamos al final de la página, la sección activa es la última
  const llegoAlFinal = window.innerHeight + posicion >= document.body.offsetHeight - 5;
  if (llegoAlFinal) {
    seccionActual = secciones[secciones.length - 1].id;
  }

  enlacesMenu.forEach(function (enlace) {
    const esActivo = enlace.getAttribute("href") === "#" + seccionActual;
    enlace.classList.toggle("activo", esActivo);
  });
}

window.addEventListener("scroll", alHacerScroll);

// Botón para volver al inicio
btnArriba.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ==========================================================================
   5. MODO OSCURO / CLARO
   ========================================================================== */
function aplicarTema(tema) {
  const esOscuro = tema === "oscuro";
  document.body.classList.toggle("oscuro", esOscuro);

  // Manipulación del DOM: cambiamos la imagen y el texto accesible del botón
  iconoTema.src = esOscuro ? "recursos/iconos/sol.svg" : "recursos/iconos/luna.svg";
  btnTema.setAttribute("aria-label", esOscuro ? "Activar modo claro" : "Activar modo oscuro");
}

btnTema.addEventListener("click", function () {
  const nuevoTema = document.body.classList.contains("oscuro") ? "claro" : "oscuro";
  aplicarTema(nuevoTema);
  guardarPreferencia("tema", nuevoTema); // Se recuerda al volver a entrar
  mostrarToast(nuevoTema === "oscuro" ? "Modo oscuro activado" : "Modo claro activado");
});

function cargarTemaGuardado() {
  const temaGuardado = leerPreferencia("tema");
  if (temaGuardado) {
    aplicarTema(temaGuardado);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // Si el usuario no ha elegido, usamos la preferencia de su sistema
    aplicarTema("oscuro");
  }
}


/* ==========================================================================
   6. CONTADORES ANIMADOS (estadísticas del inicio)
   ========================================================================== */
function animarContador(elemento) {
  const meta = Number(elemento.dataset.meta); // Lee el atributo data-meta
  const duracion = 1500;                      // milisegundos
  const pasos = 60;
  const incremento = meta / pasos;
  let valorActual = 0;

  const intervalo = setInterval(function () {
    valorActual += incremento;
    if (valorActual >= meta) {
      valorActual = meta;
      clearInterval(intervalo); // Detiene la animación al llegar a la meta
    }
    elemento.textContent = Math.floor(valorActual).toLocaleString("es-CO");
  }, duracion / pasos);
}


/* ==========================================================================
   7. FILTRO DE SERVICIOS
   ========================================================================== */
const botonesFiltro = document.querySelectorAll(".filtro");
const tarjetas = document.querySelectorAll(".tarjeta");
const resultadoFiltro = document.getElementById("resultadoFiltro");

function filtrarServicios(categoria) {
  let visibles = 0;

  tarjetas.forEach(function (tarjeta) {
    const coincide = categoria === "todos" || tarjeta.dataset.categoria === categoria;
    tarjeta.classList.toggle("oculta", !coincide);
    if (coincide) {
      visibles++;
    }
  });

  resultadoFiltro.textContent = "Mostrando " + visibles + (visibles === 1 ? " servicio" : " servicios");
}

botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    // Quitamos la clase activo de todos y se la ponemos solo al presionado
    botonesFiltro.forEach(function (otroBoton) {
      otroBoton.classList.remove("activo");
      otroBoton.setAttribute("aria-pressed", "false");
    });
    boton.classList.add("activo");
    boton.setAttribute("aria-pressed", "true");

    filtrarServicios(boton.dataset.filtro);
  });
});


/* ==========================================================================
   8. COTIZADOR
   La cotización se guarda en un arreglo de objetos { nombre, precio }.
   Cada vez que cambia, se vuelve a "dibujar" la lista en el DOM.
   ========================================================================== */
const RECARGO_DOMICILIO = 15000;
const PORCENTAJE_DESCUENTO = 0.1;   // 10 %
const MINIMO_PARA_DESCUENTO = 3;

let cotizacion = [];

const botonesAgregar = document.querySelectorAll(".btn-agregar");
const listaCotizacion = document.getElementById("listaCotizacion");
const chkDomicilio = document.getElementById("chkDomicilio");
const insignia = document.getElementById("insignia");
const btnVaciar = document.getElementById("btnVaciar");
const btnSolicitar = document.getElementById("btnSolicitar");

function agregarServicio(nombre, precio) {
  // some() devuelve true si algún elemento cumple la condición
  const yaExiste = cotizacion.some(function (servicio) {
    return servicio.nombre === nombre;
  });

  if (yaExiste) {
    mostrarToast("Ese servicio ya está en tu cotización");
    return;
  }

  cotizacion.push({ nombre: nombre, precio: precio });
  actualizarCotizacion();
  mostrarToast("✓ " + nombre + " agregado a la cotización");
}

function quitarServicio(nombre) {
  // filter() crea un nuevo arreglo sin el servicio que queremos quitar
  cotizacion = cotizacion.filter(function (servicio) {
    return servicio.nombre !== nombre;
  });
  actualizarCotizacion();
}

// Cambia el texto y estado de los botones "Agregar" de las tarjetas
function actualizarBotonesAgregar() {
  botonesAgregar.forEach(function (boton) {
    const estaAgregado = cotizacion.some(function (servicio) {
      return servicio.nombre === boton.dataset.nombre;
    });
    boton.classList.toggle("agregado", estaAgregado);
    boton.disabled = estaAgregado;
    boton.textContent = estaAgregado ? "✓ Agregado" : "Agregar";
  });
}

// Crea los elementos <li> de la lista con createElement (manipulación del DOM)
function dibujarListaCotizacion() {
  listaCotizacion.innerHTML = ""; // Vaciamos la lista antes de volver a llenarla

  if (cotizacion.length === 0) {
    const itemVacio = document.createElement("li");
    itemVacio.className = "vacio";
    itemVacio.textContent = "Aún no has agregado servicios.";
    listaCotizacion.appendChild(itemVacio);
    return;
  }

  cotizacion.forEach(function (servicio) {
    const item = document.createElement("li");

    const nombre = document.createElement("span");
    nombre.textContent = servicio.nombre;

    const derecha = document.createElement("div");
    derecha.className = "item-derecha";

    const precio = document.createElement("strong");
    precio.textContent = formatearPrecio(servicio.precio);

    const btnQuitar = document.createElement("button");
    btnQuitar.type = "button";
    btnQuitar.className = "btn-quitar";
    btnQuitar.textContent = "×";
    btnQuitar.setAttribute("aria-label", "Quitar " + servicio.nombre);
    btnQuitar.addEventListener("click", function () {
      quitarServicio(servicio.nombre);
    });

    derecha.appendChild(precio);
    derecha.appendChild(btnQuitar);
    item.appendChild(nombre);
    item.appendChild(derecha);
    listaCotizacion.appendChild(item);
  });
}

// Calcula subtotal, descuento, domicilio y total. Devuelve el total.
function calcularTotales() {
  let subtotal = 0;
  cotizacion.forEach(function (servicio) {
    subtotal += servicio.precio;
  });

  let descuento = 0;
  if (cotizacion.length >= MINIMO_PARA_DESCUENTO) {
    descuento = Math.round(subtotal * PORCENTAJE_DESCUENTO);
  }

  let domicilio = 0;
  if (chkDomicilio.checked && cotizacion.length > 0) {
    domicilio = RECARGO_DOMICILIO;
  }

  const total = subtotal - descuento + domicilio;

  document.getElementById("subtotal").textContent = formatearPrecio(subtotal);
  document.getElementById("descuento").textContent = descuento > 0 ? "−" + formatearPrecio(descuento) : "$0";
  document.getElementById("valorDomicilio").textContent = formatearPrecio(domicilio);
  document.getElementById("total").textContent = formatearPrecio(total);

  return total;
}

// Función central: se llama cada vez que la cotización cambia
function actualizarCotizacion() {
  dibujarListaCotizacion();
  calcularTotales();
  actualizarBotonesAgregar();

  // Insignia con la cantidad de servicios en el menú
  insignia.textContent = cotizacion.length;
  insignia.hidden = cotizacion.length === 0;
}

// Eventos de los botones "Agregar"
botonesAgregar.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const nombre = boton.dataset.nombre;
    const precio = Number(boton.dataset.precio);
    agregarServicio(nombre, precio);
  });
});

// Evento change: se recalcula al marcar o desmarcar "domicilio"
chkDomicilio.addEventListener("change", calcularTotales);

btnVaciar.addEventListener("click", function () {
  if (cotizacion.length === 0) {
    mostrarToast("La cotización ya está vacía");
    return;
  }
  cotizacion = [];
  actualizarCotizacion();
  mostrarToast("Cotización vaciada");
});

// Pasa la cotización al formulario de contacto
btnSolicitar.addEventListener("click", function () {
  if (cotizacion.length === 0) {
    mostrarToast("Primero agrega al menos un servicio");
    document.getElementById("servicios").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const nombres = cotizacion.map(function (servicio) {
    return servicio.nombre;
  });
  const total = calcularTotales();

  campoDescripcion.value =
    "Servicios solicitados: " + nombres.join(", ") + ". " +
    "Total estimado: " + formatearPrecio(total) + ".\n";
  actualizarContadorCaracteres();

  // Si eligió domicilio en el cotizador, lo marcamos también en el formulario
  if (chkDomicilio.checked) {
    formulario.querySelector('input[value="A domicilio"]').checked = true;
  }

  document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
  campoNombre.focus({ preventScroll: true });
  mostrarToast("Completa tus datos para enviar la solicitud");
});


/* ==========================================================================
   9. CARRUSEL DE TESTIMONIOS
   ========================================================================== */
const testimonios = document.querySelectorAll(".testimonio");
const contenedorPuntos = document.getElementById("puntos");
let indiceActual = 0;

// Crea un punto indicador por cada testimonio
testimonios.forEach(function (testimonio, indice) {
  const punto = document.createElement("button");
  punto.type = "button";
  punto.className = "punto";
  punto.setAttribute("aria-label", "Ver testimonio " + (indice + 1));
  punto.addEventListener("click", function () {
    mostrarTestimonio(indice);
  });
  contenedorPuntos.appendChild(punto);
});

const puntos = contenedorPuntos.querySelectorAll(".punto");

function mostrarTestimonio(indice) {
  // Si nos pasamos de los límites, damos la vuelta (carrusel circular)
  if (indice < 0) {
    indice = testimonios.length - 1;
  }
  if (indice >= testimonios.length) {
    indice = 0;
  }

  testimonios.forEach(function (testimonio, i) {
    testimonio.classList.toggle("activo", i === indice);
  });
  puntos.forEach(function (punto, i) {
    punto.classList.toggle("activo", i === indice);
    punto.setAttribute("aria-current", i === indice ? "true" : "false");
  });

  indiceActual = indice;
}

document.getElementById("btnAnterior").addEventListener("click", function () {
  mostrarTestimonio(indiceActual - 1);
});

document.getElementById("btnSiguiente").addEventListener("click", function () {
  mostrarTestimonio(indiceActual + 1);
});


/* ==========================================================================
   10. ACORDEÓN DE PREGUNTAS FRECUENTES
   Solo una pregunta abierta a la vez.
   ========================================================================== */
const itemsAcordeon = document.querySelectorAll(".acordeon-item");

itemsAcordeon.forEach(function (item) {
  const boton = item.querySelector(".acordeon-boton");

  boton.addEventListener("click", function () {
    const estabaAbierto = item.classList.contains("abierto");

    // Cerramos todos los items
    itemsAcordeon.forEach(function (otroItem) {
      otroItem.classList.remove("abierto");
      otroItem.querySelector(".acordeon-boton").setAttribute("aria-expanded", "false");
    });

    // Si estaba cerrado, lo abrimos
    if (!estabaAbierto) {
      item.classList.add("abierto");
      boton.setAttribute("aria-expanded", "true");
    }
  });
});


/* ==========================================================================
   11. VALIDACIÓN DEL FORMULARIO
   ========================================================================== */
const formulario = document.getElementById("formulario");
const campoNombre = document.getElementById("nombre");
const campoCorreo = document.getElementById("correo");
const campoTelefono = document.getElementById("telefono");
const campoDispositivo = document.getElementById("dispositivo");
const campoFecha = document.getElementById("fecha");
const campoDescripcion = document.getElementById("descripcion");
const campoTerminos = document.getElementById("terminos");
const radiosModalidad = document.querySelectorAll('input[name="modalidad"]');
const contadorCaracteres = document.getElementById("contadorCaracteres");
const mensajeFormulario = document.getElementById("mensajeFormulario");
const btnEnviar = document.getElementById("btnEnviar");

// Expresiones regulares para validar el formato de los datos
const expresiones = {
  nombre: /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s]{3,60}$/,     // Solo letras y espacios
  correo: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,       // texto@texto.dominio
  telefono: /^3\d{9}$/                             // Celular de Colombia: 10 dígitos, empieza en 3
};

const MIN_CARACTERES_DESCRIPCION = 20;
const MAX_CARACTERES_DESCRIPCION = 500;

// --- Funciones para mostrar u ocultar errores ---
function mostrarError(campo, mensaje) {
  const contenedor = campo.closest(".campo");   // Busca el .campo que lo contiene
  contenedor.classList.add("invalido");
  contenedor.classList.remove("valido");
  contenedor.querySelector(".error").textContent = mensaje;
  campo.setAttribute("aria-invalid", "true");
}

function marcarValido(campo) {
  const contenedor = campo.closest(".campo");
  contenedor.classList.remove("invalido");
  contenedor.classList.add("valido");
  contenedor.querySelector(".error").textContent = "";
  campo.setAttribute("aria-invalid", "false");
}

// Convierte "2026-11-20" en un objeto Date con la hora local.
// (new Date("2026-11-20") usa la hora UTC y puede mostrar el día anterior)
function convertirFecha(texto) {
  const partes = texto.split("-");
  return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
}

// Devuelve la fecha de hoy en formato "AAAA-MM-DD" (el que usa input date)
function obtenerFechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

// --- Una función de validación por cada campo ---
function validarNombre() {
  const valor = campoNombre.value.trim();
  if (valor === "") {
    mostrarError(campoNombre, "El nombre es obligatorio.");
    return false;
  }
  if (!expresiones.nombre.test(valor)) {
    mostrarError(campoNombre, "Usa solo letras y espacios (mínimo 3 caracteres).");
    return false;
  }
  marcarValido(campoNombre);
  return true;
}

function validarCorreo() {
  const valor = campoCorreo.value.trim();
  if (valor === "") {
    mostrarError(campoCorreo, "El correo es obligatorio.");
    return false;
  }
  if (!expresiones.correo.test(valor)) {
    mostrarError(campoCorreo, "Escribe un correo válido, por ejemplo nombre@correo.com.");
    return false;
  }
  marcarValido(campoCorreo);
  return true;
}

function validarTelefono() {
  const valor = campoTelefono.value.replace(/\s/g, ""); // Quita los espacios
  if (valor === "") {
    mostrarError(campoTelefono, "El celular es obligatorio.");
    return false;
  }
  if (!expresiones.telefono.test(valor)) {
    mostrarError(campoTelefono, "Debe tener 10 dígitos y empezar por 3.");
    return false;
  }
  marcarValido(campoTelefono);
  return true;
}

function validarDispositivo() {
  if (campoDispositivo.value === "") {
    mostrarError(campoDispositivo, "Selecciona el tipo de equipo.");
    return false;
  }
  marcarValido(campoDispositivo);
  return true;
}

function validarFecha() {
  if (campoFecha.value === "") {
    mostrarError(campoFecha, "Elige una fecha para el servicio.");
    return false;
  }

  const fechaElegida = convertirFecha(campoFecha.value);
  const hoy = convertirFecha(obtenerFechaHoy());

  if (fechaElegida < hoy) {
    mostrarError(campoFecha, "La fecha no puede ser anterior a hoy.");
    return false;
  }
  if (fechaElegida.getDay() === 0) {   // 0 = domingo
    mostrarError(campoFecha, "Los domingos no atendemos. Elige otro día.");
    return false;
  }
  marcarValido(campoFecha);
  return true;
}

function validarModalidad() {
  const seleccionado = formulario.querySelector('input[name="modalidad"]:checked');
  if (seleccionado === null) {
    mostrarError(radiosModalidad[0], "Elige si prefieres el servicio en tienda o a domicilio.");
    return false;
  }
  marcarValido(radiosModalidad[0]);
  return true;
}

function validarDescripcion() {
  const largo = campoDescripcion.value.trim().length;
  if (largo === 0) {
    mostrarError(campoDescripcion, "Cuéntanos qué problema tiene tu equipo.");
    return false;
  }
  if (largo < MIN_CARACTERES_DESCRIPCION) {
    mostrarError(campoDescripcion, "Escribe al menos " + MIN_CARACTERES_DESCRIPCION + " caracteres (llevas " + largo + ").");
    return false;
  }
  marcarValido(campoDescripcion);
  return true;
}

function validarTerminos() {
  if (!campoTerminos.checked) {
    mostrarError(campoTerminos, "Debes aceptar el tratamiento de datos para continuar.");
    return false;
  }
  marcarValido(campoTerminos);
  return true;
}

// Contador de caracteres del área de texto (evento input)
function actualizarContadorCaracteres() {
  const largo = campoDescripcion.value.length;
  contadorCaracteres.textContent = largo + " / " + MAX_CARACTERES_DESCRIPCION;
  contadorCaracteres.classList.toggle("limite", largo > MAX_CARACTERES_DESCRIPCION - 50);
}

// --- Validación en tiempo real ---
// Relacionamos cada campo con su función de validación
const validacionesEnVivo = [
  { campo: campoNombre, validar: validarNombre },
  { campo: campoCorreo, validar: validarCorreo },
  { campo: campoTelefono, validar: validarTelefono },
  { campo: campoDispositivo, validar: validarDispositivo },
  { campo: campoFecha, validar: validarFecha },
  { campo: campoDescripcion, validar: validarDescripcion }
];

validacionesEnVivo.forEach(function (item) {
  // Al salir del campo (blur) se valida
  item.campo.addEventListener("blur", item.validar);

  // Mientras escribe, solo se revalida si ya tenía error (para no molestar)
  item.campo.addEventListener("input", function () {
    if (item.campo.closest(".campo").classList.contains("invalido")) {
      item.validar();
    }
  });
});

campoDispositivo.addEventListener("change", validarDispositivo);
campoTerminos.addEventListener("change", validarTerminos);
campoDescripcion.addEventListener("input", actualizarContadorCaracteres);
radiosModalidad.forEach(function (radio) {
  radio.addEventListener("change", validarModalidad);
});

// --- Mensajes de respuesta ---
function ocultarMensaje() {
  mensajeFormulario.hidden = true;
  mensajeFormulario.className = "mensaje";
  mensajeFormulario.innerHTML = "";
}

function mostrarMensajeError(cantidadErrores) {
  ocultarMensaje();
  mensajeFormulario.classList.add("fallo");

  const titulo = document.createElement("h4");
  titulo.textContent = "No pudimos enviar tu solicitud";
  const texto = document.createElement("p");
  texto.textContent = "Revisa " + (cantidadErrores === 1 ? "el campo marcado" : "los " + cantidadErrores + " campos marcados") + " en rojo.";

  mensajeFormulario.appendChild(titulo);
  mensajeFormulario.appendChild(texto);
  mensajeFormulario.hidden = false;
}

// Construye el resumen con createElement y textContent.
// NO usamos innerHTML con los datos del usuario para evitar inyección de código (XSS).
function mostrarMensajeExito(datos) {
  ocultarMensaje();
  mensajeFormulario.classList.add("exito");

  const titulo = document.createElement("h4");
  titulo.textContent = "¡Gracias, " + datos.nombre.split(" ")[0] + "! Tu solicitud fue registrada.";

  const texto = document.createElement("p");
  texto.textContent = "Te contactaremos en menos de 24 horas para confirmar la cita. Este es tu resumen:";

  const lista = document.createElement("ul");
  const filas = [
    ["N.º de solicitud", datos.radicado],
    ["Equipo", datos.dispositivo],
    ["Fecha", datos.fecha],
    ["Modalidad", datos.modalidad],
    ["Contacto", datos.correo + " · " + datos.telefono]
  ];

  filas.forEach(function (fila) {
    const item = document.createElement("li");
    const etiqueta = document.createElement("strong");
    etiqueta.textContent = fila[0] + ": ";
    item.appendChild(etiqueta);
    item.appendChild(document.createTextNode(fila[1]));
    lista.appendChild(item);
  });

  mensajeFormulario.appendChild(titulo);
  mensajeFormulario.appendChild(texto);
  mensajeFormulario.appendChild(lista);
  mensajeFormulario.hidden = false;

  // Desplazamos la vista hasta el mensaje para que el usuario lo vea
  mensajeFormulario.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Quita los colores verde/rojo y los mensajes de todos los campos
function limpiarEstadosFormulario() {
  formulario.querySelectorAll(".campo").forEach(function (campo) {
    campo.classList.remove("valido", "invalido");
  });
  formulario.querySelectorAll(".error").forEach(function (error) {
    error.textContent = "";
  });
  formulario.querySelectorAll("[aria-invalid]").forEach(function (campo) {
    campo.removeAttribute("aria-invalid");
  });
}

// --- Evento submit: se ejecuta al presionar "Enviar solicitud" ---
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // Evita que la página se recargue

  // Ejecutamos TODAS las validaciones para mostrar todos los errores a la vez
  const resultados = [
    validarNombre(),
    validarCorreo(),
    validarTelefono(),
    validarDispositivo(),
    validarFecha(),
    validarModalidad(),
    validarDescripcion(),
    validarTerminos()
  ];

  const cantidadErrores = resultados.filter(function (esValido) {
    return esValido === false;
  }).length;

  if (cantidadErrores > 0) {
    mostrarMensajeError(cantidadErrores);
    // Llevamos el foco al primer campo con error
    const primerError = formulario.querySelector('[aria-invalid="true"]');
    if (primerError) {
      primerError.focus();
    }
    return;
  }

  // Todo es válido: simulamos el envío al servidor (este curso no usa backend)
  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviando...";

  const datos = {
    nombre: campoNombre.value.trim(),
    correo: campoCorreo.value.trim(),
    telefono: campoTelefono.value.replace(/\s/g, ""),
    dispositivo: campoDispositivo.value,
    modalidad: formulario.querySelector('input[name="modalidad"]:checked').value,
    fecha: convertirFecha(campoFecha.value).toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }),
    radicado: "NT-" + Math.floor(1000 + Math.random() * 9000) // Número aleatorio de 4 cifras
  };

  setTimeout(function () {
    // Importante: primero reiniciamos el formulario y DESPUÉS mostramos el
    // mensaje, porque reset() dispara el evento "reset", que oculta el mensaje.
    formulario.reset();
    limpiarEstadosFormulario();
    actualizarContadorCaracteres();
    mostrarMensajeExito(datos);
    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar solicitud";
  }, 1200);
});

// --- Evento reset: botón "Limpiar" ---
formulario.addEventListener("reset", function () {
  limpiarEstadosFormulario();
  ocultarMensaje();
  // El reset vacía los campos justo después de este evento,
  // por eso actualizamos el contador con un pequeño retraso.
  setTimeout(actualizarContadorCaracteres, 0);
});


/* ==========================================================================
   12. INICIALIZACIÓN
   Código que se ejecuta una sola vez cuando carga la página.
   ========================================================================== */
cargarTemaGuardado();
alHacerScroll();
document.querySelectorAll(".contador").forEach(animarContador);
mostrarTestimonio(0);
campoFecha.min = obtenerFechaHoy();                          // No permite fechas pasadas en el calendario
document.getElementById("anio").textContent = new Date().getFullYear();
