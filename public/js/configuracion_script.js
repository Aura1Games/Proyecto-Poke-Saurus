// global_script.js - Manejo de temas con persistencia en localStorage
// Sin librerías externas. Aplica cambios globales a través de variables CSS en :root.
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn_salir");
  btn.addEventListener("click", () => {
    window.location.href = "../";
  });
});
