# NodoTec — Soporte técnico y reparación de computadores

Proyecto final de **Programación Web I**.
Sitio web desarrollado con **HTML5 semántico, CSS3 y JavaScript puro**, sin frameworks ni librerías.

**Estudiante:** [Tu nombre]
**URL del sitio:** ver `dominio.txt`

---

## 1. Temática, propósito y público objetivo

| | |
|---|---|
| **Temática** | Empresa (ficticia) de servicio técnico de computadores y redes. |
| **Propósito** | Presentar los servicios, permitir **cotizar en línea** y **agendar una cita** mediante un formulario validado. |
| **Público objetivo** | Estudiantes, hogares y pequeños negocios que necesitan mantenimiento, reparación, recuperación de datos o instalación de redes. |

## 2. Estructura de archivos

```
ProyectoFinal_NodoTec/
├── index.html        → Estructura del sitio (HTML semántico)
├── estilos.css       → Diseño visual y responsive
├── script.js         → Interactividad (eventos, funciones, DOM)
├── dominio.txt       → URL donde está publicado el sitio
├── README.md         → Este documento
└── recursos/
    ├── img/          → Logo, ilustración principal y avatares (SVG)
    └── iconos/       → Íconos de servicios, contacto, tema y favicon
```

## 3. Secciones del sitio

1. **Inicio**: presentación, botones de acción y contadores animados.
2. **Servicios**: 8 servicios con filtro por categoría (Hardware, Software, Redes).
3. **Cotizador**: suma los servicios elegidos, aplica descuento y recargo a domicilio.
4. **Nosotros**: ventajas de la empresa y proceso de trabajo.
5. **Opiniones**: carrusel de testimonios.
6. **Preguntas frecuentes**: acordeón desplegable.
7. **Contacto**: datos de contacto y formulario de solicitud validado.

## 4. Cumplimiento de requerimientos

| Requerimiento | Implementación |
|---|---|
| **1. Estructura HTML** | `header`, `nav` (2), `main`, `section` (7), `article` (22), `footer`, además de `figure`, `address`, `blockquote`, `fieldset`. |
| **2. Selectores CSS** | Etiqueta (`body`, `h1`), clase (`.tarjeta`), ID (`#inicio`, `#formulario`), combinados: descendiente, hijo `>`, hermano `+`, compuesto, agrupado, atributo `[type="..."]`, pseudoclases y pseudoelementos. Ver índice al inicio de `estilos.css`. |
| **3. Menú de navegación** | Menú fijo con enlaces a cada sección, desplazamiento suave, resaltado de la sección activa y menú hamburguesa en móviles. |
| **4. Botones** | Modo oscuro, hamburguesa, filtros, agregar/quitar servicios, vaciar y solicitar cotización, carrusel, acordeón, limpiar/enviar formulario y volver arriba. |
| **5. Formulario** | 8 campos de distinto tipo (texto, email, tel, select, date, radio, textarea, checkbox), validación con expresiones regulares, mensajes de error por campo y mensaje de respuesta con resumen. |
| **6. JavaScript** | Eventos `click`, `submit`, `reset`, `input`, `change`, `blur`, `scroll`, `resize`, `keydown`; 35 funciones; manipulación del DOM con `createElement`, `appendChild`, `classList`, `textContent`, `setAttribute`, `dataset`. |
| **7. Responsive** | Media queries para computador (> 992 px), tableta (≤ 992 px) y celular (≤ 600 px) con Flexbox y CSS Grid; JavaScript cierra el menú móvil al cambiar el tamaño de la ventana. |

## 5. Funcionalidades adicionales

- Modo oscuro que se recuerda al volver a entrar (`localStorage`).
- Accesibilidad: atributos ARIA, enlace "Saltar al contenido", foco visible con teclado y soporte para `prefers-reduced-motion`.
- Seguridad: los datos del usuario se insertan con `textContent`, nunca con `innerHTML`, para evitar inyección de código (XSS).

## 6. Cómo ejecutarlo

Abrir `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox). No requiere instalación.
Todas las rutas son relativas, por lo que funciona igual en local y en cualquier servidor web.

## 7. Pruebas realizadas

- HTML validado sin errores con *html-validate*.
- Pruebas funcionales automáticas en Chromium: filtros, cotizador, validación del formulario, carrusel, acordeón, menú, modo oscuro.
- Sin desbordamiento horizontal en 375 px (celular), 768 px (tableta) y 1366 px (computador).
- Sin errores en la consola del navegador.

> NodoTec es una empresa ficticia creada con fines académicos. El formulario simula el envío porque el curso no incluye programación de servidor (backend).
