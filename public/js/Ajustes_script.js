//Agregamos una escucha a window, que espera a que todos los elementos del DOM estén cargados
window.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("cant_jugadores");
  const bloque_1 = document.getElementById("contenedor_01");
  const bloque_2 = document.getElementById("contenedor_02");
  const bloque_3 = document.getElementById("contenedor_03");
  const bloque_4 = document.getElementById("contenedor_04");
  const admin = document.getElementById("admin");
  const p1 = document.getElementById("p1");
  const p2 = document.getElementById("p2");
  const p3 = document.getElementById("p3");
  bloque_1.style.display = "flex";
  bloque_2.style.display = "flex";
  admin.style.display = "flex";
  p1.style.display = "flex";
  selectElement.addEventListener("change", (event) => {
    // 'event' es el objeto evento que contiene información sobre el evento
    // 'event.target' se refiere al elemento select
    const jugadores = event.target.value; // Obtiene el valor seleccionado
    console.log(`${jugadores}`);
    if (jugadores == 2) {
      bloque_1.style.display = "flex";
      bloque_2.style.display = "flex";
      bloque_3.style.display = "none";
      bloque_4.style.display = "none";
      p2.style.display = "none";
      p3.style.display = "none";
    } else if (jugadores == 3) {
      bloque_1.style.display = "flex";
      bloque_2.style.display = "flex";
      bloque_3.style.display = "flex";
      bloque_4.style.display = "none";
      p2.style.display = "flex";
      p3.style.display = "none";
    } else if (jugadores == 4) {
      bloque_1.style.display = "flex";
      bloque_2.style.display = "flex";
      bloque_3.style.display = "flex";
      bloque_4.style.display = "flex";
      p2.style.display = "flex";
      p3.style.display = "flex";
    }
  });
});
