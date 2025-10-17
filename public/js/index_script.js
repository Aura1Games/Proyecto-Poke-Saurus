// Cuando todo el DOM (Document Object Model) se cargue :
window.addEventListener("DOMContentLoaded", () => {
  const iniciar_partida = document.getElementById("btn_iniciar_partida");
  const configuracion = document.getElementById("btn_configuracion");
  const creditos = document.getElementById("btn_creditos");
  const reglas = document.getElementById("btn_reglas");

  iniciar_partida.addEventListener("click", () => {
    window.location.href = "./pages/Ajustes_de_partida.html";
    console.log("boton clickeado");
  });
  configuracion.addEventListener("click", () => {
    window.location.href = "./pages/configuracion.html";
  });
  creditos.addEventListener("click", () => {
    alert("Funcion en desarrollo...");
  });
  reglas.addEventListener("click", () => {
    window.location.href = "./pages/Reglas.html";
  });
});
