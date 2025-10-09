// import ApiPartida from "./Ajustes_script.js";

// Declaramos la clase
// const apiPartida = new ApiPartida("http://localhost/Proyecto-Poke-Saurus/api/");
// Obtenemos el objeto DOM para reemplazar el nombre

// Esperamos a que todos los elementos del DOM estén cargados

class Partida {
  constructor() {
    this.jugadores = [];
  }

  obtenerJugadoresLocaStorage() {
    const jugadoresGuardados = localStorage.getItem("usuarios");
    if (jugadoresGuardados) {
      this.jugadores = JSON.parse(jugadoresGuardados);
    } else {
      console.error("Error a obtener los jugadores del local storage");
    }
  }
}

const partida = new Partida();

window.addEventListener("DOMContentLoaded", () => {
  const elementoNombreJugador = document.getElementById("campoNombreJugador");
  //   Asignamos el nombre del jugador al elemento del DOM
  partida.obtenerJugadoresLocaStorage();
  elementoNombreJugador.innerText = `Nombre: ${partida.jugadores[0]}`;
});
