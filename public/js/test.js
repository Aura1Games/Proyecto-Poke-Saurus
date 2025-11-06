class Partida {
  constructor(url) {
    this.baseURL = url;
    this.jugadores = [];
    this.btn_ver_dinosaurios = document.getElementById("btn-ver-dinosaurios");
    this.btn_colocar_dinosaurios = document.getElementById(
      "btn-colocar-dinosaurios"
    );
    this.btn_terminar_turno = document.getElementById("btn-terminar-turno");
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
    try {
      const objetoLocalStorage = localStorage.getItem(item);
      if (objetoLocalStorage) {
        return JSON.parse(objetoLocalStorage);
      } else {
        console.warn(`Item ${item} no encontrado en localStorage`);
        return null;
      }
    } catch (error) {
      console.error(`Error al parsear ${item}:`, error);
      return null;
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
          console.log(data.mensaje);
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

    if (relaciones.length === 0) {
      console.error("Error: El array de relaciones está vacío");
      alert("⚠️ No hay relaciones para procesar");
      return null;
    }

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
        if (data.id_partida != undefined) {
          return data;
        } else {
          return { id_partida: null };
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  async levantarPartida() {
    const tablero = this.obtenerLocaStorage("tablero");
    const infoPartida = this.obtenerLocaStorage("partida");
    const infoUsuarios = this.obtenerLocaStorage("infoUsuarios");
    const relaciones = [];

    let auxiliar = await this.obtenerUltimaPartida();
    if (Number(auxiliar.id_partida) === Number(infoPartida)) {
      return console.log("Ya se registraron las tablas de la partida actual");
    }
    console.log("Registrando tablas de partida actual... ");

    try {
      await this.generarRecintosBD(tablero["id"]);

      infoUsuarios.forEach((element) => {
        let objeto = { idUsuario: element.id, idPartida: Number(infoPartida) };
        relaciones.push(objeto);
      });
      await this.generarRelacionesMultiples(relaciones);
    } catch (error) {
      return console.error(`Error al iniciar la partida: ${error}`);
    }
  }

  #manipularDomPuntos() {
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

    arregloObjetosDOM.forEach((element, indice) => {
      element.innerText = this.puntajes[indice].puntos || 0;
      auxiliarPuntos += Number(this.puntajes[indice].puntos) || 0;
      arregloTableroDOM[indice].appendChild(element);
    });
    
    etiquetaPuntos.innerText = "";
    if (auxiliarPuntos >= 0 && auxiliarPuntos <= 10) {
      etiquetaPuntos.style.color = "red";
    } else if (auxiliarPuntos >= 11 && auxiliarPuntos <= 20) {
      etiquetaPuntos.style.color = "#FF8C00";
    } else if (auxiliarPuntos >= 21 && auxiliarPuntos <= 30) {
      etiquetaPuntos.style.color = "green";
    } else if (auxiliarPuntos > 30) {
      etiquetaPuntos.style.color = "blue";
    }
    etiquetaPuntos.innerText = auxiliarPuntos;
  }

  async #actualizarEstadoPuntosPartida(idPartida, puntos) {
    if (typeof puntos != "number" || typeof idPartida != "number") {
      console.warn("Se requieren parametros numericos al actualizar la partida");
      return null;
    }
    
    try {
      const response = await fetch(this.baseURL, {
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
        console.log(`✅ ${data.mensaje}`);
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  finzaliarPartida() {
    let a = document.getElementById("btn_terminar_partida");

    let puntos = 0;
    for (let index = 0; index < 7; index++) {
      puntos += this.puntajes[index].puntos || 0;
    }

    a.addEventListener("click", async () => {
      let idPartida = Number(this.obtenerLocaStorage("partida"));
      console.log(`Puntos: ${puntos}, id partida: ${idPartida}`);

      try {
        await this.#actualizarEstadoPuntosPartida(idPartida, puntos);

        const colocaciones = await this.#procesarColocacionesParaBD();
        if (colocaciones && colocaciones.length > 0) {
          await this.#ingresarColocacionesBD(colocaciones);
          alert("✅ Partida finalizada y datos guardados correctamente");
        } else {
          alert("✅ Partida finalizada (sin colocaciones para guardar)");
        }

        setTimeout(() => {
          window.location.href = "/Proyecto-Poke-Saurus/public/";
        }, 1000);
        
      } catch (error) {
        console.error("Error al finalizar partida:", error);
        alert("❌ Error al guardar los datos de la partida");
      }
    });
  }

  ejecutarFinPartida() {
    this.btn_colocar_dinosaurios.style.display = "none";
    this.btn_terminar_turno.style.display = "none";
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
    console.log(`1. Bosque de la semejanza: ${JSON.stringify(this.puntajes[0])}`);
    console.log(`2. Prado de la diferencia: ${JSON.stringify(this.puntajes[1])}`);
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

  static calcularPuntosFueraDePartida() {}

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

          Object.values(conteoDinos).forEach((cantidad) => {
            cantidadTrios += Math.floor(cantidad / 3);
          });
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
        var auxiliarTablero = [...this.tablero[2]];
        let cantidadParejas = 0;
        while (auxiliarTablero.length > 1) {
          var dinoRemovido = auxiliarTablero.shift();
          auxiliarTablero.some((dinos) => {
            if (dinoRemovido.dino === dinos.dino) {
              cantidadParejas++;
              auxiliarTablero.splice(auxiliarTablero.indexOf(dinos), 1);
              return;
            }
          });
        }
        this.puntajes[2] = cantidadParejas > 0 ? { puntos: cantidadParejas * 5 } : { puntos: 0 };
        break;
      case "islaSolitaria":
        let esUnico = true;
        var auxiliarTablero = this.tablero;

        if (!auxiliarTablero[5] || auxiliarTablero[5].length === 0) {
          this.puntajes[5] = { puntos: 0 };
          break;
        }

        const dinoIsla = auxiliarTablero[5][0].dino;
        for (let i = 0; i < auxiliarTablero.length; i++) {
          if (i === 5) continue;
          for (let j = 0; j < auxiliarTablero[i].length; j++) {
            if (auxiliarTablero[i][j].dino === dinoIsla) {
              esUnico = false;
              break;
            }
          }
          if (!esUnico) break;
        }
        this.puntajes[5] = esUnico ? { puntos: 7 } : { puntos: 0 };
        break;
    }
  }

  async #ingresarColocacionesBD(colocaciones) {
    if (!Array.isArray(colocaciones) || colocaciones.length === 0) {
      console.warn("No hay colocaciones para guardar");
      return null;
    }

    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "ingresar_colocaciones",
          colocaciones: colocaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la petición HTTP");
      }

      const data = await response.json();
      if (data.mensaje) {
        console.log(`✅ ${data.mensaje} - ${data.insertadas} colocaciones guardadas`);
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Error al guardar colocaciones: ${error}`);
      return null;
    }
  }

  async #obtenerRecintosDeBD(idTablero) {
    if (!idTablero || typeof idTablero !== 'number') {
      console.error('ID de tablero inválido para obtener recintos');
      return null;
    }

    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "obtener_recintos_por_tablero",
          id_tablero: idTablero
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la petición HTTP");
      }

      const data = await response.json();
      if (data.exito && data.recintos) {
        console.log(`✅ Recintos obtenidos: ${data.recintos.length}`);
        return data.recintos;
      }
      return null;
    } catch (error) {
      console.error(`Error al obtener recintos: ${error}`);
      return null;
    }
  }

  #crearMapaRecintos(recintosBD) {
    const mapaRecintos = {};
    
    const mapeoNombres = {
      "El Bosque de la Semejanza": "bosqueDeLaSemejanza",
      "El Prado de la Diferencia": "pradoDeLaDiferencia", 
      "La Pradera del Amor": "praderaDelAmor",
      "El Trío Frondoso": "trioFrondoso",
      "El Rey de la Selva": "reyDeLaSelva",
      "La Isla Solitaria": "islaSolitaria",
      "El Rio": "rio"
    };

    recintosBD.forEach(recinto => {
      const nombreFrontend = mapeoNombres[recinto.nombre];
      if (nombreFrontend) {
        mapaRecintos[nombreFrontend] = recinto.id_recinto;
      }
    });

    return mapaRecintos;
  }

  async #procesarColocacionesParaBD() {
    const tablero = this.obtenerLocaStorage("Tablero");
    const idTablero = Number(this.obtenerLocaStorage("tablero")?.id);
    
    if (!idTablero || !tablero) {
      console.error("No se pudo obtener la información del tablero");
      return [];
    }

    const recintosBD = await this.#obtenerRecintosDeBD(idTablero);
    if (!recintosBD) {
      console.error("No se pudieron obtener los recintos de la BD");
      return [];
    }

    const mapaRecintos = this.#crearMapaRecintos(recintosBD);
    const colocaciones = [];

    const mapaDinosaurios = {
      "dino-rojo": 1,
      "dino-verde": 2,
      "dino-amarillo": 3,
      "dino-naranja": 4,
      "dino-rosado": 5,
      "dino-celeste": 6
    };

    this.nombreTableros.forEach((recintoInfo, indiceRecinto) => {
      const nombreFrontend = recintoInfo.recinto;
      const idRecintoBD = mapaRecintos[nombreFrontend];
      const movimientosRecinto = tablero[indiceRecinto];

      if (idRecintoBD && movimientosRecinto) {
        movimientosRecinto.forEach(movimiento => {
          const idDinoBD = mapaDinosaurios[movimiento.dino];
          
          if (idDinoBD) {
            colocaciones.push({
              id_recinto: idRecintoBD,
              id_dinosaurio: idDinoBD,
              id_tablero: idTablero
            });
          }
        });
      }
    });

    console.log(`🦖 Colocaciones procesadas: ${colocaciones.length}`);
    return colocaciones;
  }
}