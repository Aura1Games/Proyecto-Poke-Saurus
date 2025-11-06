async function cargarRanking() {
  const cuerpo = document.getElementById("ranking-body");

  try {
    const response = await fetch(
      "/Proyecto-Poke-Saurus/api/?tipo=consultaRanking"
    );
    const data = await response.json();
    if(data.data == null || data.data == undefined ){

    }
    cuerpo.innerHTML = data.data
      .map(
        (jugador) => `
      <tr>
        <td>${jugador.Nombre}</td>
        <td>${jugador.Edad}</td>
        <td>${jugador.Puntos}</td>
      </tr>`
      )
      .join("");
  } catch (error) {
    console.error("Error al cargar ranking:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn_salir").addEventListener("click", () => {
    window.location.href = "../";
  });

  cargarRanking();
});
