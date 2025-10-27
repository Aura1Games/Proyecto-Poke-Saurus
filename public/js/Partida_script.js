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

  async levantarPartida(tab) {
    const tablero = partida.obtenerLocaStorage("tablero");
    const infoPartida = this.obtenerLocaStorage("partida");
    const infoUsuarios = this.obtenerLocaStorage("infoUsuarios");
    const relaciones = [];

    let auxiliar = await this.obtenerUltimaPartida();
    // console.log(
    //   `último id de Partida obtenido de la BD: ${auxiliar.id_partida} `,
    //   `id almacenado en localStorage: ${infoPartida}`
    // );
    if (Number(auxiliar.id_partida) === Number(infoPartida)) {
      return console.log("Ya se registraron las tablas de la partida actual");
    }
    console.log("Registrando tablas de partida actual... ");

    try {
      tab.generarTableroPartidaLocalStorage();
      // ===== | GENERAR RECINTOS | =====
      await this.generarRecintosBD(tablero["id"]);

      //  ======= GENERAR RELACION JUEGA =======
      infoUsuarios.forEach((element) => {
        let objeto = { idUsuario: element.id, idPartida: Number(infoPartida) };
        relaciones.push(objeto);
      });
      await this.generarRelacionesMultiples(relaciones);
      // console.log("Partida iniciada con éxito");
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
    this.rio = ["rio1", "rio2", "rio3"];
  }

  generarTableroPartidaLocalStorage() {
    /**
     * Tablero [] <- arreglo general
     * Tablero[
     * [], <- bosqueDeLaSemejanza
     * [], <- pradoDeLaDiferencia
     * [], <- praderaDelAmor
     * [], <- trioFrondoso
     * [], <- reyDeLaSelva
     * [], <- islaSolitaria
     * [], <- rio
     * ];
     */

    const tablero = [[], [], [], [], [], [], []];

    localStorage.setItem("Tablero", JSON.stringify(tablero));
  }

  /**
   *
   * @param {object} movimiento - Objeto que contiene el dinosaurio y el recinto
   * {dino:T-Rex,recinto: bosqueFrondoso}
   */
  #guardarMovimientoLocalStorage(movimiento) {
    //  const movimiento = {
    //       dino: Clase css del dinosaurio guardado,
    //       dinoIdBd: id del dinosaurio en la BD ,
    //       recinto: Id del recinto en el que el dinosaurio se colocó,
    //       recintoTablero: Representa el indice del tablero en el arreglo tablero de localStorage,
    //     };

    // console.log(
    //   `debugging de movimiento: ${movimiento}, subElementos: ${movimiento.dino} | ${movimiento.recinto} | ${movimiento.recintoTablero} | ${movimiento.dinoIdBd}`
    // );

    if (
      typeof movimiento !== "object" ||
      movimiento === null ||
      movimiento.dino === undefined ||
      movimiento.recinto === undefined ||
      movimiento.recintoTablero === undefined ||
      movimiento.dinoIdBd === undefined ||
      !(movimiento.recintoTablero >= 0 && movimiento.recintoTablero < 7)
    ) {
      // console.log(
      //   ` dino: ${movimiento.dino} | dinoID: ${movimiento.dinoIdBd} | recinto: ${movimiento.recinto} | recinto tablero: ${movimiento.recintoTablero} `
      // );
      console.error(
        "El parámetro movimiento debe ser un objeto con las propiedades 'dino', 'recinto' y 'recintoTablero' ."
      );
      alert("⚠️ Error al intentar cargar el movimiento en localStorage");
    }

    let dinosaurio = movimiento.dino;
    let dinosaurioID = movimiento.dinoIdBd;
    let recinto = movimiento.recinto;
    let recintoTablero = Number(movimiento.recintoTablero);
    let tablero = JSON.parse(localStorage.getItem("Tablero"));
    // Inicia un nuevo grupo con la etiqueta "Información de Usuario"
    // console.group("Información de movimiento");

    // // Estos mensajes aparecerán dentro del grupo
    // console.log(`Dinosaurio: ${dinosaurio}`);
    // console.log(`Recinto: ${recinto}`);
    // console.log(`Recinto Tablero: ${recintoTablero}`);
    // console.log(
    //   `arreglo obtenido del localStorage: ${tablero} | tamaño tablero: ${tablero.length}`
    // );
    // // console.log(`Dinosaurio ID: ${dinosaurioID}`);
    // console.groupEnd();
    let objetoAlmacenado = {
      dino: dinosaurio,
      recinto: recinto,
    };

    tablero[recintoTablero].push(objetoAlmacenado);

    localStorage.setItem("Tablero", JSON.stringify(tablero));
  }

  /**
   *
   * @param {array} paqueteSelects - Arreglo con objetos DOM select de dinosaurios y select recintos
   */

  colocar_dinosaurio(paqueteSelects) {
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
        // Obtenemos los atributos data-* de las opciones seleccionadas de los select

        // dinosaurio : clase de css que se almacena del dinosaurio (para identificar el color del dinoasurio)
        let dinosaurio =
          paqueteSelects[0].options[paqueteSelects[0].selectedIndex].dataset
            .clase;
        // idDinoBD : id del dinosaurio seleccionado en la base de datos, es parseada con Number() para explicitar que se requiere un numero entero
        let idDinoBD = Number(
          paqueteSelects[0].options[paqueteSelects[0].selectedIndex].dataset
            .idBd
        );
        // recinto : id en html del recinto al que el dinosaurio fué colocado
        let recinto =
          paqueteSelects[1].options[paqueteSelects[1].selectedIndex].dataset
            .idRecinto;
        // recintoTablero : ubicación en el Array Tablero guardado en localStorage, requiere que sea un numero entero
        let recintoTablero = Number(
          paqueteSelects[1].options[paqueteSelects[1].selectedIndex].dataset
            .idRecintoTablero
        );

        // Gardamos en movimiento la clase del dinosurio y el indice del tablero (para recuperarlo después)
        const movimiento = {
          dino: dinosaurio,
          dinoIdBd: idDinoBD,
          recinto: recinto,
          recintoTablero: recintoTablero,
        };
        alert(
          `✅ Dinosaurio ${paqueteSelects[0].value} colocado en el recinto ${paqueteSelects[1].value} 🦖`
        );
        // Cumple con los requisitos para agregar un dinosaurio
        this.#colocarDinosaurioDOM(paqueteSelects);
        // Guardar movimiento en local storage
        this.#guardarMovimientoLocalStorage(movimiento);
      }
    });
  }

  #colocarDinosaurioDOM(paqueteSelects) {
    // Obtiene el elemento del select dinosaurios seleccionado
    const opcionSeleccionadaDinosaurios =
      paqueteSelects[0].options[paqueteSelects[0].selectedIndex];
    // Obtiene el elemento del select recintos seleccionado
    const opcionSeleccionadaRecintos =
      paqueteSelects[1].options[paqueteSelects[1].selectedIndex];
    let claseDino = opcionSeleccionadaDinosaurios.dataset.clase;
    let idRecinto = opcionSeleccionadaRecintos.dataset.idRecinto;

    const dinosaurio = document.createElement("div");
    dinosaurio.classList.add("objeto");
    dinosaurio.classList.add(claseDino);
    this.paqueteTablero.forEach((element) => {
      if (idRecinto === element.id) {
        element.appendChild(dinosaurio);
      } else if (
        idRecinto === "rio" &&
        (element.id.includes("rio1") ||
          element.id.includes("rio2") ||
          element.id.includes("rio3"))
      ) {
        if (element.childElementCount < 2) {
          element.appendChild(dinosaurio);
        }
      }
    });
    paqueteSelects[0].value = "none";
    paqueteSelects[1].value = "none";
  }
  #colocarDinosaurioDOMsimple(info) {
    if (info === null || info === undefined) {
      return console.error("información invalida al obtener los movimientos");
    }
    const recinto = document.getElementById(`${info.recinto}`);
    const dinosaurio = document.createElement("div");
    dinosaurio.classList.add("objeto");
    dinosaurio.classList.add(info.dino);
    if (recinto) {
      recinto.appendChild(dinosaurio);
    } else {
      console.error("Error al recuperar los movimientos en el DOM");
    }
  }

  recuperarMovimientosLocalStorage() {
    let movimientos = JSON.parse(localStorage.getItem("Tablero"));

    movimientos.forEach((recinto) => {
      if (
        Array.isArray(recinto) &&
        recinto[0] != null &&
        recinto[0] != undefined
      ) {
        console.group("Info objeto movimiento");
        console.log(recinto[0].dino);
        console.log(recinto[0].recinto);
        console.log(recinto.length);
        console.groupEnd();
        let info = {
          dino: recinto[0].dino,
          recinto: recinto[0].recinto,
        };
        this.#colocarDinosaurioDOMsimple(info);
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
const tablero = new Tablero(paqueteTablero);
const dinosaurios = new Dinosaurio();

// comienzo de la manipulación de la partida
window.addEventListener("DOMContentLoaded", () => {
  const elementoNombreJugador = document.getElementById("campoNombreJugador");
  //   Asignamos el nombre del jugador al elemento del DOM
  const jugadores = partida.obtenerLocaStorage("usuarios"); // desestrucutramos lo obtenido por el metodo partida (en éste caso es un arreglo)
  elementoNombreJugador.innerText = `Nombre: ${jugadores[0]}`;

  tablero.recuperarMovimientosLocalStorage();
  partida.levantarPartida(tablero);

  tablero.colocar_dinosaurio(paqueteSelects);
});
