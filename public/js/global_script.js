window.addEventListener("DOMContentLoaded", () => {
  const salir = document.getElementById("btn_salir");
  if (salir) {
    salir.addEventListener("click", () => {
      window.location.href = "/Proyecto-Poke-Saurus/public/";
    });
  }
});
