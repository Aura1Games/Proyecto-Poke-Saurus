window.addEventListener("DOMContentLoaded", () => {
  const salir = document.getElementById("btn_salir");
  salir.addEventListener("click", () => {
    window.location.href = "/public/index.html";
  });
});
