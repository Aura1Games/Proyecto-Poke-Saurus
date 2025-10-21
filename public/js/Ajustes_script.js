class ApiUsuarios {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getAll() {
    return fetch(this.baseUrl).then((response) => {
      if (!response.ok) {
        throw new Error("Error en la petición HTTP");
      }
      return response.json();
    });
  }

  async getByName(name) {
    return fetch(`${this.baseUrl}?nombre=${name}`).then((response) => {
      if (!response.ok) {
        throw new Error("Error en la petición HTTP");
      }
      return response.json();
    });
  }

  /**
   * NUEVA API: Verifica credenciales en el servidor
   * @param {string} nombre - Nombre del usuario
   * @param {string} contraseña - Contraseña en texto plano
   * @returns {Promise} - Respuesta del servidor
   */
  async verificarLogin(nombre, contraseña) {
    return fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        contraseña: contraseña,
        tipo: "verificar_login",
      }),
    }).then((response) => {
      if (!response.ok && response.status !== 401) {
        throw new Error("Error en la petición HTTP");
      }
      return response.json();
    });
  }

  async obtenerJugadorDeBD(nombre) {
    if (nombre === "" || nombre === undefined) {
      alert("Debes ingresar un nombre para logearte");
      return Promise.resolve(null);
    }
    return await this.getByName(nombre)
      .then((data) => {
        if (data && data.nombre) {
          return {
            nombre: data.nombre,
            correo: data.correo,
            edad: data.edad,
          };
        } else {
          return null;
        }
      })
      .catch((error) => {
        alert("Error al obtener el usuario");
        console.error("Error al obtener el jugador: " + error);
        return null;
      });
  }
}

class ApiPartida {
  jugadoresVerificados = [];

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  postPartida(fecha, cant_jugadores, puntaje_final, ganador) {
    return fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: fecha,
        jugadores: cant_jugadores,
        puntaje: puntaje_final,
        ganador: ganador,
        tipo: "ingresar_partida",
      }),
    });
  }

  async postTablero(idPartida) {
    if (idPartida === null || idPartida === undefined) {
      alert("❌ Error: ID de partida inválido para crear tablero");
      return;
    }
    return await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: "crear_tablero",
        id: idPartida,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la petición http");
        }
        return response.json();
      })
      .then((data) => {
        alert("✅ " + data.mensaje);
      })
      .catch((error) => {
        console.error("error: " + error);
        alert("❌ Error: " + error.message);
      });
  }

  obtenerFechaActual() {
    let fechaActual = new Date();
    let año = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
    let dia = fechaActual.getDate().toString().padStart(2, "0");
    let hora = fechaActual.getHours().toString().padStart(2, "0");
    let minutos = fechaActual.getMinutes().toString().padStart(2, "0");
    let segundos = fechaActual.getSeconds().toString().padStart(2, "0");
    return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
  }

  guardarUsuariosEnLocalStorage() {
    localStorage.setItem("usuarios", JSON.stringify(this.jugadoresVerificados));
  }
}

// Instancias de clases API
const api = new ApiUsuarios("http://localhost/Proyecto-Poke-Saurus/api/");
const apiPartida = new ApiPartida("http://localhost/Proyecto-Poke-Saurus/api/");

window.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("cant_jugadores");
  const bloque_1 = document.getElementById("contenedor_01");
  const bloque_2 = document.getElementById("contenedor_02");
  const bloque_3 = document.getElementById("contenedor_03");
  const bloque_4 = document.getElementById("contenedor_04");
  const bloque_5 = document.getElementById("contenedor_05");
  const registrarse = document.getElementById("aRegistro");

  bloque_1.style.display = "flex";
  bloque_2.style.display = "flex";

  // Visualización dinámica de contenedores
  selectElement.addEventListener("change", (event) => {
    const jugadores = event.target.value;
    console.log(`Jugadores seleccionados: ${jugadores}`);

    const bloques = [bloque_1, bloque_2, bloque_3, bloque_4, bloque_5];
    bloques.forEach((bloque, index) => {
      bloque.style.display = index < jugadores ? "flex" : "none";
    });
  });

  // Relación inputs-iconos
  const jugadores = [
    {
      input: document.getElementById("input-admin"),
      icono: document.getElementById("_p1"),
    },
    {
      input: document.getElementById("input-p2"),
      icono: document.getElementById("_p2"),
    },
    {
      input: document.getElementById("input-p3"),
      icono: document.getElementById("_p3"),
    },
    {
      input: document.getElementById("input-p4"),
      icono: document.getElementById("_p4"),
    },
    {
      input: document.getElementById("input-p5"),
      icono: document.getElementById("_p5"),
    },
  ];

  // Lógica de verificación de usuarios
  const botonesVerificar = document.querySelectorAll(".btn_verificar");

  // Login de los jugadores
  botonesVerificar.forEach((boton, indice) => {
    boton.addEventListener("click", async () => {
      const input = jugadores[indice].input;
      const iconoJugador = jugadores[indice].icono;
      const nombreIngresado = input.value.trim();

      // Validar nombre
      if (!nombreIngresado) {
        alert("⚠️ Debes ingresar un nombre");
        return;
      }

      // Verificar si ya está logeado
      if (
        apiPartida.jugadoresVerificados.includes(nombreIngresado.toLowerCase())
      ) {
        alert(`⚠️ El jugador "${nombreIngresado}" ya está logeado.`);
        return;
      }

      try {
        // Verificar que el usuario existe
        const usuarioExiste = await api.obtenerJugadorDeBD(nombreIngresado);

        if (!usuarioExiste) {
          alert(`❌ Usuario "${nombreIngresado}" no encontrado.`);
          iconoJugador.classList.remove("_verificado");
          iconoJugador.classList.add("_no_verificado");
          return;
        }

        // Pedir contraseña
        const contraseñaIngresada = prompt(
          `Ingrese la contraseña para ${nombreIngresado}:`
        );

        if (!contraseñaIngresada) {
          alert("❌ Debes ingresar una contraseña");
          return;
        }

        // Verificar contraseña en el servidor
        const resultado = await api.verificarLogin(
          nombreIngresado,
          contraseñaIngresada
        );

        if (resultado.exito) {
          // Login exitoso
          iconoJugador.classList.add("_verificado");
          iconoJugador.classList.remove("_no_verificado");
          apiPartida.jugadoresVerificados.push(nombreIngresado.toLowerCase());

          let mensaje = `✅ Jugador "${nombreIngresado}" verificado con éxito.`;

          // Notificar si se migró la contraseña
          if (resultado.migracion) {
            mensaje +=
              "\n🔒 Tu contraseña ha sido actualizada para mayor seguridad.";
          }

          alert(mensaje);
          console.log(`Usuario verificado: ${nombreIngresado}`);
          console.log(
            `Total logeados: ${apiPartida.jugadoresVerificados.length}`
          );
        } else {
          // Login fallido
          alert(`❌ ${resultado.mensaje}`);
          iconoJugador.classList.remove("_verificado");
          iconoJugador.classList.add("_no_verificado");
        }
      } catch (error) {
        console.error("Error en verificación:", error);
        alert(`❌ Error al verificar usuario: ${error.message}`);
        iconoJugador.classList.remove("_verificado");
        iconoJugador.classList.add("_no_verificado");
      }
    });
  });

  // == Iniciar partida ==
  const iniciar_partida = document.getElementById("btn_iniciar_partida");
  iniciar_partida.addEventListener("click", () => {
    const cant_jugadores = selectElement.value;

    // Verificaciónes de cantidad de jugadores
    if (cant_jugadores == apiPartida.jugadoresVerificados.length) {
      const fecha = apiPartida.obtenerFechaActual();

      apiPartida
        .postPartida(fecha, cant_jugadores, 40, 2)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
          }
          return response.json();
        })
        .then(async (data) => {
          alert("✅ " + data.mensaje);
          // api ingresar tablero aquí <= data.id
          console.log("debbugging del id de partida: " + data.id);
          await apiPartida.postTablero(data.id);
          apiPartida.guardarUsuariosEnLocalStorage();
          window.location.href = "./Partida.html";
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
          alert(`❌ ${error.message}`);
        });
    } else if (cant_jugadores < apiPartida.jugadoresVerificados.length) {
      alert("⚠️ Hay más jugadores logeados que jugadores detallados...");
      location.reload();
    } else {
      alert("⚠️ Todos los usuarios deben estar logeados");
    }
  });

  registrarse.addEventListener("click", () => {
    window.location.href = "./Registro.html";
  });
});
