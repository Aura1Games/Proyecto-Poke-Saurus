// ⚠️ ❌ ✅

// Guardar en localStorage:
// localStorage.setItem("usuarios", JSON.stringify([algo]));

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

class Tablero {
  /**
 * 
 * @param {array} array - (Arreglo que almacena en el siguiente orden los elementos DOM)
 * bosqueDeLaSemejanza,
  reyDeLaSelva,
  trioFrondoso,
  pradoDeLaDiferencia,
  praderaDelAmor,
  islaSolitaria,
  rio1,
  rio2,
  rio3, 
 */

  constructor(paqueteTablero) {
    /*
    orden del paqueteTablero:
    this.paqueteTablero[0] : bosqueDeLaSemejanza
    this.paqueteTablero[1] : reyDeLaSelva
    this.paqueteTablero[2] : trioFrondoso
    this.paqueteTablero[3] : pradoDeLaDiferencia
    this.paqueteTablero[4] : praderaDelAmor
    this.paqueteTablero[5] : islaSolitaria
    this.paqueteTablero[6] : rio1
    this.paqueteTablero[7] : rio2
    this.paqueteTablero[8] : rio3
    */

    this.paqueteTablero = paqueteTablero;
  }

  /**
   *
   * @param {object} movimiento - Objeto que contiene el dinosaurio y el recinto
   * {dino:T-Rex,recinto: bosqueFrondoso}
   */

  #guardar_movimiento_localStorage(movimiento) {
    if (
      typeof movimiento === "object" &&
      movimiento !== null &&
      "dino" in movimiento &&
      "recinto" in movimiento
    ) {
      localStorage.setItem("movimiento", JSON.stringify(movimiento));
      console.log("Movimiento guardado en localStorage:", movimiento);
    } else {
      console.error(
        "El parámetro movimiento debe ser un objeto con las propiedades 'dino' y 'recinto'."
      );
      alert("⚠️ Error al intentar cargar el movimiento en localStorage");
    }
  }

  /**
   *
   * @param {array} paqueteSelects - Arreglo con objetos DOM select de dinosaurios y select recintos
   */

  colocar_dinosaurio(paqueteSelects) {
    /*
    orden de paqueteSelects:
    paqueteSelects[0] : selectDinosaurios 
    paqueteSelects[1] : selectRecintos 
    paqueteSelects[2] : btn 
    

    */

    paqueteSelects[2].addEventListener("click", () => {
      if (
        paqueteSelects[0].value == "none" ||
        paqueteSelects[1].value == "none"
      ) {
        console.warn("selectDinosaurios ó selectRecintos en posición default");
        alert(
          "⚠️ Debes de seleccionar un dinosaurio y un recinto para colocar un dinosario 🦖"
        );
      } else {
        console.log("Dinosaurio colocado correctamente");
        const movimiento = {
          dino: paqueteSelects[0].value,
          recinto: paqueteSelects[1].value,
        };
        this.#guardar_movimiento_localStorage(movimiento);
        alert(
          `✅ Dinosaurio ${paqueteSelects[0].value} colocado en el recinto ${paqueteSelects[1].value} 🦖`
        );
      }
    });
  }
}

class Dinosaurio {
  constructor(color, recinto) {
    this.color = color;
    this.recinto = recinto;
  }
}

//obtenemos todos los recintos del tablero
const bosqueDeLaSemejanza = document.getElementById("bosqueDeLaSemejanza");
const reyDeLaSelva = document.getElementById("reyDeLaSelva");
const trioFrondoso = document.getElementById("trioFrondoso");
const pradoDeLaDiferencia = document.getElementById("pradoDeLaDiferencia");
const praderaDelAmor = document.getElementById("praderaDelAmor");
const islaSolitaria = document.getElementById("islaSolitaria");
const rio1 = document.getElementById("rio1");
const rio2 = document.getElementById("rio2");
const rio3 = document.getElementById("rio3");

const paqueteTablero = [
  bosqueDeLaSemejanza,
  reyDeLaSelva,
  trioFrondoso,
  pradoDeLaDiferencia,
  praderaDelAmor,
  islaSolitaria,
  rio1,
  rio2,
  rio3,
];

//obtenemos los selects de colocación + boton de colocar

const selectDinosaurios = document.getElementById("select-dinosaurios");
const selectRecintos = document.getElementById("select-recintos");
const btn = document.getElementById("btnColocarDinosaurios");

const paqueteSelects = [selectDinosaurios, selectRecintos, btn];

const partida = new Partida();
const manipular = new Tablero(paqueteTablero);
const dinosaurios = new Dinosaurio();

window.addEventListener("DOMContentLoaded", () => {
  const elementoNombreJugador = document.getElementById("campoNombreJugador");
  //   Asignamos el nombre del jugador al elemento del DOM
  partida.obtenerJugadoresLocaStorage();
  elementoNombreJugador.innerText = `Nombre: ${partida.jugadores[0]}`;

  manipular.colocar_dinosaurio(paqueteSelects);
});
