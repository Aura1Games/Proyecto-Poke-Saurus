// ⚠️ ❌ ✅

// Guardar en localStorage:
// localStorage.setItem("usuarios", JSON.stringify([algo]));

class Partida {
  constructor(url) {
    this.baseURL = url;
    this.jugadores = [];
  }

  /**
   *
   * @param {string} item - Nombre del item guardado en localStorage
   * @returns {array | object} Contenido guardado en localStorage
   */

  obtenerLocaStorage(item) {
    const jugadoresGuardados = localStorage.getItem(item);
    if (jugadoresGuardados) {
      return JSON.parse(jugadoresGuardados);
    } else {
      console.error(`Error a obtener ${item} del local storage`);
    }
  }

  async generarRecintosBD(idTablero) {
    if (idTablero === null || idTablero === undefined) {
      console.error(`Error: idTabero invalido idTablero: (${idTablero})`);
      return;
    }

    return await fetch(this.baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idTablero,
        tipo: "crear_recintos",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la petición HTTP");
        }
        return response.json();
      })
      .then((data) => {
        if (data.mensaje) {
          alert(`${data.mensaje}`);
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
        alert("❌ Error al ingresar los recintos");
        return null;
      });
  }

  async generarRelacionJuega(idUsuario, idPartida) {
    // Verificaciones exhaustivas
    if (
      idUsuario === undefined ||
      idUsuario === null ||
      idPartida === undefined ||
      idPartida === null
    ) {
      console.error("Error: Valores no permitidos en generarRelacionJuega");
      return null;
    }

    if (typeof idUsuario !== "number" || typeof idPartida !== "number") {
      console.error("Error: Valores no numéricos en generarRelacionJuega");
      return null;
    }

    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idPartida: idPartida,
          idUsuario: idUsuario,
          tipo: "crear_relacion_juega",
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la petición HTTP");
      }

      const data = await response.json();
      if (data.mensaje) {
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  /**
   * Genera múltiples relaciones juega de manera secuencial
   * @param {Array<{idUsuario: number, idPartida: number}>} relaciones - Array de objetos con idUsuario e idPartida
   * @returns {Promise<Array>} Array con los resultados de cada petición en orden
   */
  async generarRelacionesMultiples(relaciones) {
    if (!Array.isArray(relaciones)) {
      console.error("Error: Se esperaba un array de relaciones");
      console.error("Tipo recibido:", typeof relaciones);
      console.error("Valor recibido:", relaciones);
      return null;
    }

    // Validar que el array no esté vacío
    if (relaciones.length === 0) {
      console.error("Error: El array de relaciones está vacío");
      alert("⚠️ No hay relaciones para procesar");
      return null;
    }

    // Validar estructura de cada relación
    for (const relacion of relaciones) {
      if (!relacion.idUsuario || !relacion.idPartida) {
        console.error("Error: Relación con estructura inválida:", relacion);
        alert("❌ Datos de relación incompletos");
        return null;
      }
    }

    try {
      const resultados = [];

      for (const relacion of relaciones) {
        const resultado = await this.generarRelacionJuega(
          relacion.idUsuario,
          relacion.idPartida
        );

        if (resultado === null) {
          console.error(
            `Error al procesar la relación: Usuario ${relacion.idUsuario}`
          );
          alert(
            `❌ Error al crear relación para Usuario ${relacion.idUsuario}`
          );
          return null;
        }

        resultados.push(resultado);
      }

      alert("✅ Todas las relaciones fueron creadas exitosamente en orden");
      return resultados;
    } catch (error) {
      console.error("Error al procesar las relaciones:", error);
      alert("❌ Error al procesar las relaciones");
      return null;
    }
  }

  async obtenerUltimaPartida() {
    return await fetch(`${this.baseURL}?tipo=ultimaPartida`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la petición HTTP");
        }
        return response.json();
      })
      .then((data) => {
        if (data.id_partida) {
          return data;
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  async levantarPartida() {
    const tablero = partida.obtenerLocaStorage("tablero");
    const infoPartida = this.obtenerLocaStorage("partida");
    const infoUsuarios = this.obtenerLocaStorage("infoUsuarios");
    const relaciones = [];

    let auxiliar = await this.obtenerUltimaPartida();
    console.log(
      `último id de Partida obtenido de la BD: ${auxiliar.id_partida} `,
      `id almacenado en localStorage: ${infoPartida}`
    );
    if (Number(auxiliar.id_partida) === Number(infoPartida)) {
      return console.log("Ya se registraron las tablas de la partida actual");
    }
    console.log("Registrando tablas de partida actual... ");

    try {
      // ===== | GENERAR RECINTOS | =====
      await this.generarRecintosBD(tablero["id"]);

      //  ======= GENERAR RELACION JUEGA =======
      infoUsuarios.forEach((element) => {
        let objeto = { idUsuario: element.id, idPartida: Number(infoPartida) };
        relaciones.push(objeto);
      });
      await this.generarRelacionesMultiples(relaciones);
      console.log("Partida iniciada con éxito");
    } catch (error) {
      return console.error(`Error al iniciar la partida: ${error}`);
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

  #guardarMovimientoLocalStorage(movimiento) {
    if (
      typeof movimiento === "object" &&
      movimiento !== null &&
      typeof movimiento.dino === "string" &&
      typeof movimiento.recinto === "string"
    ) {
      localStorage.setItem("movimiento", JSON.stringify(movimiento));
      // mensajeConsola(`Movimiento guardado en localStorage: ${movimiento}`, 1);
    } else {
      console.error(
        "El parámetro movimiento debe ser un objeto con las propiedades 'dino' y 'recinto'."
      );
      alert("⚠️ Error al intentar cargar el movimiento en localStorage");
    }
  }

  limpiarLocalStorage() {
    let auxiliar = localStorage.getItem("movimiento");
    auxiliar
      ? localStorage.setItem("movimiento", JSON.stringify([]))
      : mensajeConsola("Comienzo de partida...", 1);
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
        // mensajeConsola("Dinosaurio colocado correctamente", 1);
        const movimiento = {
          dino: paqueteSelects[0].value,
          recinto: paqueteSelects[1].value,
        };
        this.#guardarMovimientoLocalStorage(movimiento);
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

const partida = new Partida("http://localhost/Proyecto-Poke-Saurus/api/");
const manipular = new Tablero(paqueteTablero);
const dinosaurios = new Dinosaurio();

window.addEventListener("DOMContentLoaded", () => {
  manipular.limpiarLocalStorage();

  const elementoNombreJugador = document.getElementById("campoNombreJugador");
  //   Asignamos el nombre del jugador al elemento del DOM
  const jugadores = partida.obtenerLocaStorage("usuarios"); // desestrucutramos lo obtenido por el metodo partida (en éste caso es un arreglo)
  elementoNombreJugador.innerText = `Nombre: ${jugadores[0]}`;

  partida.levantarPartida();

  manipular.colocar_dinosaurio(paqueteSelects);
});
