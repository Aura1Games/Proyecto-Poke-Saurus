// ⚠️ ❌ ✅ 🦖

class Partida {
  constructor(url) {
    this.baseURL = url;
    this.jugadores = [];
    this.btn_ver_dinosaurios = document.getElementById("btn-ver-dinosaurios");
    this.btn_colocar_dinosaurios = document.getElementById(
      "btn-colocar-dinosaurios"
    );
    this.btn_resultados_partida = document.getElementById(
      "btn-resultados-partida"
    );
    this.puntajes = [[], [], [], [], [], [], []];
    this.tablero = this.obtenerLocaStorage("Tablero");
    this.nombreTableros = [
      { recinto: "bosqueDeLaSemejanza" },
      { recinto: "pradoDeLaDiferencia" },
      { recinto: "praderaDelAmor" },
      { recinto: "trioFrondoso" },
      { recinto: "reyDeLaSelva" },
      { recinto: "islaSolitaria" },
      { recinto: "rio" },
    ];
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
          // alert(`${data.mensaje}`);
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
      console.warn(
        "Intentando parsear a Number los idUsuario" +
          idUsuario +
          " y idPartida" +
          idPartida
      );
      idPartida = Number(idPartida);
      idUsuario = Number(idUsuario);
      // return null;
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

      // alert("✅ Todas las relaciones fueron creadas exitosamente en orden");
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
    // console.log(
    //   `último id de Partida obtenido de la BD: ${auxiliar.id_partida} `,
    //   `id almacenado en localStorage: ${infoPartida}`
    // );
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
      // console.log("Partida iniciada con éxito");
    } catch (error) {
      return console.error(`Error al iniciar la partida: ${error}`);
    }
  }

  #manipularDomPuntos() {
    //   `1. Bosque de la semejanza: ${JSON.stringify(this.puntajes[0])}`
    // );
    // console.log(
    //   `2. Prado de la diferencia: ${JSON.stringify(this.puntajes[1])}`
    // );
    // console.log(`3. Pradera del amor: ${JSON.stringify(this.puntajes[2])}`);
    // console.log(`4. Trio frondoso: ${JSON.stringify(this.puntajes[3])}`);
    // console.log(`5. Rey de la selva: ${JSON.stringify(this.puntajes[4])}`);
    // console.log(`6. Isla solitaria: ${JSON.stringify(this.puntajes[5])}`);
    // console.log(`7. Rio: ${JSON.stringify(this.puntajes[6])}`);

    // Puntos de recintos de la selva
    const arregloTableroDOM = [
      document.getElementById("puntoBosqueDeLaSemejanza"),
      document.getElementById("puntoPradoDeLaDiferencia"),
      document.getElementById("puntoPraderaDelAmor"),
      document.getElementById("puntoTrioFrondoso"),
      document.getElementById("puntoReyDeLaSelva"),
      document.getElementById("puntoIslaSolitaria"),
      document.getElementById("puntoRio"),
    ];

    let etiquetaPuntos = document.getElementById("puntosObtenidos");
    var auxiliarPuntos = 0;
    // creación de puntaje dinamico (en estilos)

    let puntosBosqueDeLaSemejanza = document.createElement("p");
    let puntosReyDeLaSelva = document.createElement("p");
    let puntosTrioFrondoso = document.createElement("p");
    let puntosIslaSolitaria = document.createElement("p");
    let puntosPradoDeLaDiferencia = document.createElement("p");
    let puntosPraderaDelAmor = document.createElement("p");
    let puntosRio = document.createElement("p");

    const arregloObjetosDOM = [
      puntosBosqueDeLaSemejanza,
      puntosPradoDeLaDiferencia,
      puntosPraderaDelAmor,
      puntosTrioFrondoso,
      puntosReyDeLaSelva,
      puntosIslaSolitaria,
      puntosRio,
    ];
    // Asignamos
    arregloObjetosDOM.forEach((element, indice) => {
      element.innerText = this.puntajes[indice].puntos || 0;
      auxiliarPuntos += Number(this.puntajes[indice].puntos) || 0;
      arregloTableroDOM[indice].appendChild(element);
    });
    etiquetaPuntos.innerText = "";
    if (auxiliarPuntos >= 0 && auxiliarPuntos <= 10) {
      etiquetaPuntos.style.color = "red";
    } else if (auxiliarPuntos >= 11 && auxiliarPuntos <= 20) {
      etiquetaPuntos.style.color = "yellow";
    } else if (auxiliarPuntos >= 21 && auxiliarPuntos <= 30) {
      etiquetaPuntos.style.color = "green";
    } else if (auxiliarPuntos > 30) {
      etiquetaPuntos.style.color = "blue";
    }
    etiquetaPuntos.innerText = auxiliarPuntos;
    document.getElementById("etqPuntos").innerText = auxiliarPuntos;
  }
  async #actualizarEstadoPuntosPartida(idPartida, puntos) {
    if (typeof puntos != "number" || typeof idPartida != "number") {
      console.warn(
        "Se requieren parametros numericos al actualizar al partida"
      );
    }
    try {
      const response = await fetch("/Proyecto-Poke-Saurus/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "cambiarEstadoPuntosPartida",
          id_partida: idPartida,
          puntos: puntos,
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

  // calcularPuntosEnColocacion() {
  //   let puntos = 0;
  //   for (let index = 0; index < 7; index++) {
  //     puntos += this.puntajes[index].puntos || 0;
  //   }
  //   return puntos;
  // }

  finzaliarPartida() {
    let a = document.getElementById("btn_terminar_partida");

    let puntos = 0;
    for (let index = 0; index < 7; index++) {
      puntos += this.puntajes[index].puntos || 0;
      console.log("=== puntos: " + puntos);
    }

    a.addEventListener("click", async () => {
      let idPartida = Number(this.obtenerLocaStorage("partida"));
      console.log(`Puntos: ${puntos}, id partida: ${idPartida}`);

      // 1. Actualizar estado y puntos de la partida
      await this.#actualizarEstadoPuntosPartida(idPartida, puntos);
      alert("🦖 Adios");
      window.location.href = "/Proyecto-Poke-Saurus/public/";
    });
  }
  ejecutarFinPartida() {
    this.btn_colocar_dinosaurios.style.display = "none";
    this.btn_ver_dinosaurios.style.display = "none";
    this.btn_resultados_partida.style.display = "block";
    document.getElementById("cartel_partida").innerText = "Partida finalizada";
    document.getElementById("btnColocarDinosaurios").style.display = "none";
    this.nombreTableros.forEach((recintos) => {
      this.cacularPuntos(recintos);
    });
    this.#manipularDomPuntos();
    console.log("puntajes: " + JSON.stringify(this.puntajes));
    console.group("Puntos obtenidos por recinto");
    console.log(
      `1. Bosque de la semejanza: ${JSON.stringify(this.puntajes[0])}`
    );
    console.log(
      `2. Prado de la diferencia: ${JSON.stringify(this.puntajes[1])}`
    );
    console.log(`3. Pradera del amor: ${JSON.stringify(this.puntajes[2])}`);
    console.log(`4. Trio frondoso: ${JSON.stringify(this.puntajes[3])}`);
    console.log(`5. Rey de la selva: ${JSON.stringify(this.puntajes[4])}`);
    console.log(`6. Isla solitaria: ${JSON.stringify(this.puntajes[5])}`);
    console.log(`7. Rio: ${JSON.stringify(this.puntajes[6])}`);

    console.groupEnd();
    this.finzaliarPartida();
  }

  static terminarPartida() {
    let instancia = new Partida("");
    instancia.ejecutarFinPartida();
  }

  // calculo de puntos relativo al tablero, no dependen de el ingreso de dinosaurios

  cacularPuntos(recinto) {
    switch (recinto.recinto) {
      case "bosqueDeLaSemejanza":
        console.log("Aplicando puntos para el bosque de la semejanza");
        var auxiliarTablero = this.tablero[0];
        var puntos = 0;
        var auxiliarTamañoTablero = auxiliarTablero.length;
        if (auxiliarTamañoTablero > 0) {
          const mapaPuntos = {
            1: 2,
            2: 4,
            3: 8,
            4: 12,
            5: 18,
            6: 24,
          };
          puntos = mapaPuntos[auxiliarTamañoTablero] || 0;
        }
        this.puntajes[0] = { puntos: puntos };
        break;
      case "reyDeLaSelva":
        console.log("Calculando los puntos de rey de la selva");
        this.puntajes[4] = { puntos: 7 };
        break;
      case "trioFrondoso":
        console.log("Calculando puntos de trio frondoso");

        var auxiliarTablero = this.tablero[3];
        var cantidadTrios = 0;

        if (auxiliarTablero && auxiliarTablero.length > 0) {
          const conteoDinos = {};

          auxiliarTablero.forEach((dino) => {
            const tipo = dino.dino;
            conteoDinos[tipo] = (conteoDinos[tipo] || 0) + 1;
          });

          console.log("Conteo de dinosaurios:", conteoDinos);

          // Calcular trios
          Object.values(conteoDinos).forEach((cantidad) => {
            cantidadTrios += Math.floor(cantidad / 3);
          });

          console.log("Cantidad de trios: " + cantidadTrios);
        }

        this.puntajes[3] = {
          puntos: cantidadTrios > 0 ? cantidadTrios * 7 : 0,
        };

        break;
      case "rio":
        console.log("Calculando los puntos de rio");
        var auxiliarTamañoTablero = this.tablero[6].length;
        puntos = auxiliarTamañoTablero > 0 ? auxiliarTamañoTablero : 0;
        this.puntajes[6] = { puntos: puntos };
        break;
      case "pradoDeLaDiferencia":
        console.log("Calculando los puntos de prado de la diferencia");
        var auxiliarTablero = this.tablero[1];
        var puntos = 0;
        var auxiliarTamañoTablero = auxiliarTablero.length;
        if (auxiliarTamañoTablero > 0) {
          const mapaPuntos = {
            1: 1,
            2: 3,
            3: 6,
            4: 10,
            5: 15,
            6: 21,
          };
          puntos = mapaPuntos[auxiliarTamañoTablero] || 0;
        }
        this.puntajes[1] = { puntos: puntos };

        break;
      case "praderaDelAmor":
        console.log("Calculando los puntos de pradera del amor");
        var auxiliarTablero = this.tablero[2];
        // let a = JSON.parse(localStorage.getItem("Tablero"))[2];
        let cantidadParejas = 0;
        while (auxiliarTablero.length > 1) {
          var dinoRemovido = auxiliarTablero.shift();
          auxiliarTablero.some((dinos) => {
            if (dinoRemovido.dino === dinos.dino) {
              cantidadParejas++;
              console.log("Pareja de dinosaurios reconocida !!!");
              auxiliarTablero.splice(auxiliarTablero.indexOf(dinos), 1);
              return;
            }
          });
        }
        console.log("Cantidad de parejas: " + cantidadParejas);

        this.puntajes[2] =
          cantidadParejas > 0 ? { puntos: cantidadParejas * 5 } : { puntos: 0 };

        break;
      case "islaSolitaria":
        console.log("Calculando los puntos de isla solitaria");
        let esUnico = true;
        var auxiliarTablero = this.obtenerLocaStorage("Tablero");
        if (
          auxiliarTablero !== undefined &&
          auxiliarTablero !== null &&
          Array.isArray(auxiliarTablero) &&
          auxiliarTablero[5][0]
        ) {
          auxiliarTablero.some((recintos) => {
            recintos.some((dinos) => {
              if (
                auxiliarTablero[5][0].dino === dinos.dino &&
                dinos.recinto !== "islaSolitaria"
              ) {
                esUnico = false;
                console.log(
                  "DINOSAURIO " + auxiliarTablero[5][0].dino + " REPETIDO !!!"
                );
                return;
              }
            });
          });
        }
        this.puntajes[5] = esUnico ? { puntos: 7 } : { puntos: 0 };
        break;
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
    this.dinos = 0;
    this.cant_dinos = document.getElementById("cantidad_dinosaurios");
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
      movimiento.dinoIdBd === undefined
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

    let recinto = movimiento.recinto;
    let recintoTablero = Number(movimiento.recintoTablero);
    let tablero = JSON.parse(localStorage.getItem("Tablero"));
    let objetoAlmacenado = {
      dino: dinosaurio,
      recinto: recinto,
    };
    console.log(`recinto a guardar: ${objetoAlmacenado.recinto}`);
    tablero[recintoTablero].push(objetoAlmacenado);

    localStorage.setItem("Tablero", JSON.stringify(tablero));
  }

  /**
   *
   * @param {array} paqueteSelects - Arreglo con objetos DOM select de dinosaurios y select recintos
   */

  colocar_dinosaurio(paqueteSelects, partida) {
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
        // Cumple con los requisitos para agregar un dinosaurio
        this.#colocarDinosaurioDOM(paqueteSelects);
        // Guardar movimiento en local storage
      }
      if (this.evaluarFinPartida()) {
        console.log(" === TERMINANDO PARTIDA ===");
        alert("🦖 Fin de la partida");
        Partida.terminarPartida();
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
    let idDino = Number(opcionSeleccionadaDinosaurios.dataset.idBd);
    let idRecinto = opcionSeleccionadaRecintos.dataset.idRecinto;
    const dinosaurio = document.createElement("div");

    let info = {};
    dinosaurio.classList.add("objeto");
    dinosaurio.classList.add(claseDino);
    this.paqueteTablero.forEach((element) => {
      if (idRecinto === element.id) {
        info = {
          dino: claseDino,
          recinto: element.id,
          idDino: idDino,
        };
        let retornoRestricciones = this.aplicarRestricciones(info);
        if (retornoRestricciones == true) {
          // aprueba todas las restricciónes para colocar el dinosaurio
          alert(
            `✅ Dinosaurio ${paqueteSelects[0].value} colocado en el recinto ${paqueteSelects[1].value} 🦖`
          );
          element.appendChild(dinosaurio);
          this.dinos += 1;

          this.cant_dinos.innerText = `${this.dinos}`;
          // Obtenemos los atributos data-* de las opciones seleccionadas de los select
          // dinosaurio : clase de css que se almacena del dinosaurio (para identificar el color del dinoasurio)
          let dino =
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
            dino: dino,
            dinoIdBd: idDinoBD,
            recinto: recinto,
            recintoTablero: recintoTablero,
          };
          this.#guardarMovimientoLocalStorage(movimiento);
        } else {
          alert(retornoRestricciones);
        }
      }
    });

    paqueteSelects[0].value = "none";
    paqueteSelects[1].value = "none";
  }

  evaluarFinPartida() {
    return this.dinos == 12 ? true : false;
  }

  #colocarDinosaurioDOMsimple(info) {
    /**  let info = {
     *     dino: Clase del dinosaurio en css
     *       recinto: Id del recinto en html
     *    };
     */

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
      recinto.forEach((movimientos) => {
        console.group("Info objeto movimiento");
        console.log(movimientos.dino);
        console.log(movimientos.recinto);
        console.groupEnd();
        let info = {
          dino: movimientos.dino,
          recinto: movimientos.recinto,
        };
        this.#colocarDinosaurioDOMsimple(info);
        this.dinos += 1;
      });

      // }
    });
    this.cant_dinos.innerText = `${this.dinos}`;
  }

  aplicarRestricciones(info) {
    /**  let info = {
     *     dino: Clase del dinosaurio en css
     *     recinto: Id del recinto en html
     *     idDino: id de dinosaurio en al base de datos
     *    };
     */
    const recinto = document.getElementById(info.recinto);
    let esValido = false,
      mensaje = "";

    if (recinto.childElementCount == 6 || recinto.childElementCount > 6) {
      mensaje = "❌ recinto con el maximo de dinosaurios";
    } else {
      switch (info.recinto) {
        case "bosqueDeLaSemejanza":
          console.log(
            "aplicando restricciónes para el bosque de la semejanza, id dino: " +
              info.idDino
          );
          var primeroDinoRecinto =
            recinto.childElementCount != 0
              ? recinto.childNodes[0].className.split(" ")[1]
              : null;

          if (primeroDinoRecinto != null && primeroDinoRecinto !== info.dino) {
            mensaje =
              "❌ Todos los dinosaurios deben de ser iguales en el recinto bosque de la semejanza";
          } else {
            esValido = true;
          }

          break;
        case "rio":
          console.log(
            "aplicando restricciónes para rio, id dino: " + info.idDino
          );
          esValido = true;
          break;
        case "reyDeLaSelva":
          console.log(
            "aplicando restricciónes para rey de la selva, id dino: " +
              info.idDino
          );
          if (recinto.childElementCount !== 0) {
            mensaje =
              "❌ Debe de haber un solo dinosaurio en el recinto el rey de la selva";
          } else {
            esValido = true;
          }
          break;
        case "trioFrondoso":
          console.log(
            "aplicando restricciónes para trio frondoso, id dino: " +
              info.idDino
          );

          if (recinto.childElementCount == 3) {
            esValido = false;
            mensaje =
              "❌ El recinto trio frondoso debe de tener solo tres dinosaurios";
          } else {
            esValido = true;
          }
          break;

        case "pradoDeLaDiferencia":
          console.log(
            "aplicando restricciónes para prado de la diferencia, id dino: " +
              info.idDino
          );
          var controlDinosaurioEnRecinto = false;

          // Obtenemos la clase css del úlitmo dinosaurio colocado

          if (recinto.childElementCount != 0) {
            // ... Convierte la NodeList a un arreglo
            [...recinto.childNodes].some((element) => {
              // obtenemos las clases de los dinosaurios en el recinto y la comparamos con la clase del dinosaurio colocado
              if (element.className.split(" ")[1] === info.dino) {
                controlDinosaurioEnRecinto = true;
              }
              console.log(
                element.className.split(" ")[1] === info.dino
                  ? " Dino en recinto "
                  : " Sin coincidencias "
              );
            });
          } else {
            esValido = true;
          }
          if (controlDinosaurioEnRecinto) {
            mensaje =
              "❌ Todos los dinosaurios deben de ser distintos en el recinto prado de la diferencia";
          } else {
            esValido = true;
          }
          break;
        case "praderaDelAmor":
          console.log(
            "aplicando restricciónes para pradera del amor, id dino: " +
              info.idDino
          );
          esValido = true;
          break;
        case "islaSolitaria":
          console.log(
            "aplicando restricciónes para isla solitaria, id dino: " +
              info.idDino
          );
          if (recinto.childElementCount !== 0) {
            mensaje =
              "❌ Debe de haber un solo dinosaurio en el recinto isla solitaria";
          } else {
            esValido = true;
          }
          break;
        default:
          console.log("Información de recinto no valida");
          break;
      }
    }

    if (esValido) {
      return true;
    } else {
      return mensaje;
    }
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
const rio = document.getElementById("rio");
const paqueteTablero = [
  bosqueDeLaSemejanza,
  reyDeLaSelva,
  trioFrondoso,
  pradoDeLaDiferencia,
  praderaDelAmor,
  islaSolitaria,
  rio,
];

//obtenemos los selects de colocación + boton de colocar

const selectDinosaurios = document.getElementById("select-dinosaurios");
const selectRecintos = document.getElementById("select-recintos");
const btn = document.getElementById("btnColocarDinosaurios");

const paqueteSelects = [selectDinosaurios, selectRecintos, btn];

const partida = new Partida("/Proyecto-Poke-Saurus/api/");
const tablero = new Tablero(paqueteTablero);
const dinosaurios = new Dinosaurio();

// comienzo de la manipulación de la partida
window.addEventListener("DOMContentLoaded", () => {
  const elementoNombreJugador = document.getElementById("campoNombreJugador");
  //   Asignamos el nombre del jugador al elemento del DOM
  const jugadores = partida.obtenerLocaStorage("usuarios"); // desestrucutramos lo obtenido por el metodo partida (en éste caso es un arreglo)
  const turno = document.getElementById("turno");
  const jugador = jugadores[0] || "invitado1";
  elementoNombreJugador.innerText = `${jugador}`;
  turno.innerText = `${jugador}`;

  tablero.recuperarMovimientosLocalStorage();
  partida.levantarPartida(tablero);
  if (tablero.evaluarFinPartida()) {
    console.log(" === TERMINANDO PARTIDA ===");
    Partida.terminarPartida();
  }
  tablero.colocar_dinosaurio(paqueteSelects, partida);
});
