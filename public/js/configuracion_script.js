// global_script.js - Manejo de temas con persistencia en localStorage
// Sin librerías externas. Aplica cambios globales a través de variables CSS en :root.

document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const selectTema = document.getElementById("selectTema"); // Select de tema (corregido en HTML)
  const selectIdioma = document.getElementById("selectIdioma"); // Select de idioma (corregido en HTML)
  const btnGuardarCambios = document.getElementById("btnGuardarCambios"); // Botón en modal
  const body = document.body; // Para aplicar atributo data-theme

  // Función para aplicar tema
  // Cambia el atributo data-theme en <html> para activar CSS de tema oscuro.
  // También guarda en localStorage para persistencia.
  function aplicarTema(tema) {
    if (tema === "oscuro") {
      document.documentElement.setAttribute("data-theme", "oscuro");
    } else {
      document.documentElement.removeAttribute("data-theme"); // Tema claro por defecto
    }
    localStorage.setItem("tema", tema); // Persistencia
  }

  // Función para cargar tema guardado al iniciar
  function cargarTemaGuardado() {
    const temaGuardado = localStorage.getItem("tema") || "claro"; // Por defecto claro
    selectTema.value = temaGuardado; // Sincroniza el select
    aplicarTema(temaGuardado);
  }

  // Función para guardar idioma (opcional, pero incluido por consistencia)
  function guardarIdioma(idioma) {
    localStorage.setItem("idioma", idioma);
    // Aquí podrías agregar lógica para cambiar textos (e.g., con un objeto de traducciones)
  }

  // Función para cargar idioma guardado
  function cargarIdiomaGuardado() {
    const idiomaGuardado = localStorage.getItem("idioma") || "es";
    selectIdioma.value = idiomaGuardado;
  }

  // Evento: Cambio en select de tema (preview en tiempo real)
  selectTema.addEventListener("change", function () {
    aplicarTema(this.value);
  });

  // Evento: Cambio en select de idioma
  selectIdioma.addEventListener("change", function () {
    guardarIdioma(this.value);
  });

  // Evento: Guardar cambios en modal
  // Al hacer clic en "Guardar cambios", confirma y guarda todo.
  btnGuardarCambios.addEventListener("click", function () {
    const temaSeleccionado = selectTema.value;
    const idiomaSeleccionado = selectIdioma.value;

    // Aplicar y guardar tema
    aplicarTema(temaSeleccionado);

    // Guardar idioma
    guardarIdioma(idiomaSeleccionado);

    // Mostrar confirmación (usa el dialog existente si quieres)
    const modalConfirmacion = document.getElementById("modal");
    if (modalConfirmacion) {
      modalConfirmacion.showModal();
    }

    // Opcional: Mensaje en consola para debug
    console.log(
      "Cambios guardados: Tema -",
      temaSeleccionado,
      ", Idioma -",
      idiomaSeleccionado
    );
  });

  // Inicializar al cargar la página
  cargarTemaGuardado();
  cargarIdiomaGuardado();
});
