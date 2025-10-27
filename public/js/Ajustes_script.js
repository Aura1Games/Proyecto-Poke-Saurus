class ApiUsuarios {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.jugadores = [];
  }

  async getByName(name) {
    // ?tipo=usuarioPorNombre&nombre=elian
    return fetch(`${this.baseUrl}?tipo=usuarioPorNombre&nombre=${name}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error("Error en la petición HTTP");
        }
        return response.json();
      }
    );
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
            id: data.id_usuario,
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
        this.guardarEnLocalStorage(
          "tablero",
          data.id ? { id: data.id } : { id: null }
        );
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

  /**
   *
   * @param {string} item - Descripción de los elementos a guardar
   * @param {Array} elemento - Arreglo a almacenar en localStorage
   */

  guardarEnLocalStorage(item, elemento) {
    localStorage.setItem(item, JSON.stringify(elemento));
  }

  limpiarLocalStorage(elemento) {
    let auxiliar = localStorage.getItem(elemento);
    auxiliar
      ? localStorage.setItem(elemento, JSON.stringify([]))
      : console.log("localStorage limpio");
  }
}

// Instancias de clases API
const api = new ApiUsuarios("http://localhost/Proyecto-Poke-Saurus/api/");
const apiPartida = new ApiPartida("http://localhost/Proyecto-Poke-Saurus/api/");

// Variables globales para el estado del modal
let usuarioActual = null;
let indiceActual = null;
let iconoActual = null;

apiPartida.limpiarLocalStorage("usuarios");
apiPartida.limpiarLocalStorage("tablero");

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

        // Guardar información temporal para usar en el modal
        usuarioActual = nombreIngresado;
        indiceActual = indice;
        iconoActual = iconoJugador;

        // Mostrar modal para ingresar contraseña
        mostrarModalContraseña(nombreIngresado);
      } catch (error) {
        console.error("Error en verificación:", error);
        alert(`❌ Error al verificar usuario: ${error.message}`);
        iconoJugador.classList.remove("_verificado");
        iconoJugador.classList.add("_no_verificado");
      }
    });
  });

  // Función para mostrar el modal de contraseña
  function mostrarModalContraseña(nombreUsuario) {
    // Obtener y configurar el modal
    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    const modalTitle = document.getElementById("exampleModalLabel");
    const inputContraseña = document.getElementById("input-contraseña");
    const btnVerificarModal = document.getElementById("btn-verificar-modal");
    const formContraseña = document.getElementById("form-contraseña");

    // Configurar el título del modal
    if (modalTitle) {
      modalTitle.textContent = `Ingrese contraseña para ${nombreUsuario}`;
    }

    // Limpiar y enfocar el input de contraseña
    if (inputContraseña) {
      inputContraseña.value = "";
      inputContraseña.focus();
    }

    // Configurar event listeners
    const verificarContraseñaHandler = () => verificarContraseñaModal();

    // Remover event listeners anteriores para evitar duplicados
    btnVerificarModal.replaceWith(btnVerificarModal.cloneNode(true));
    const nuevoBtnVerificar = document.getElementById("btn-verificar-modal");
    nuevoBtnVerificar.addEventListener("click", verificarContraseñaHandler);

    // Agregar event listener para Enter en el formulario
    formContraseña.onsubmit = (e) => {
      e.preventDefault();
      verificarContraseñaHandler();
    };

    // Mostrar el modal
    modal.show();
  }

  // Función para verificar la contraseña ingresada en el modal
  async function verificarContraseñaModal() {
    const inputContraseña = document.getElementById("input-contraseña");
    const contraseñaIngresada = inputContraseña.value.trim();

    if (!contraseñaIngresada) {
      alert("❌ Debes ingresar una contraseña");
      inputContraseña.focus();
      return;
    }

    try {
      // Verificar contraseña en el servidor
      const resultado = await api.verificarLogin(
        usuarioActual,
        contraseñaIngresada
      );

      if (resultado.exito) {
        // Login exitoso
        iconoActual.classList.add("_verificado");
        iconoActual.classList.remove("_no_verificado");
        apiPartida.jugadoresVerificados.push(usuarioActual.toLowerCase());

        let mensaje = `✅ Jugador "${usuarioActual}" verificado con éxito.`;

        // Agregar jugador a la lista de API
        const usuarioExiste = await api.obtenerJugadorDeBD(usuarioActual);
        if (usuarioExiste) {
          api.jugadores.push({
            id: usuarioExiste.id,
            nombre: usuarioExiste.nombre,
          });
        }

        // Notificar si se migró la contraseña
        if (resultado.migracion) {
          mensaje +=
            "\n🔒 Tu contraseña ha sido actualizada para mayor seguridad.";
        }

        alert(mensaje);

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("exampleModal")
        );
        modal.hide();

        // Limpiar variables temporales
        limpiarEstadoTemporal();
      } else {
        // Login fallido
        alert(`❌ ${resultado.mensaje}`);
        iconoActual.classList.remove("_verificado");
        iconoActual.classList.add("_no_verificado");

        // Limpiar el input de contraseña y mantener el modal abierto
        inputContraseña.value = "";
        inputContraseña.focus();
      }
    } catch (error) {
      console.error("Error en verificación:", error);
      alert(`❌ Error al verificar contraseña: ${error.message}`);
      iconoActual.classList.remove("_verificado");
      iconoActual.classList.add("_no_verificado");
    }
  }

  // Función para limpiar el estado temporal
  function limpiarEstadoTemporal() {
    usuarioActual = null;
    indiceActual = null;
    iconoActual = null;
  }

  // Limpiar estado temporal cuando se cierre el modal
  document
    .getElementById("exampleModal")
    .addEventListener("hidden.bs.modal", function () {
      limpiarEstadoTemporal();
    });

  // También limpia el estado si el usuario cierra el modal con la X
  document
    .getElementById("exampleModal")
    .addEventListener("hide.bs.modal", function () {
      const inputContraseña = document.getElementById("input-contraseña");
      if (inputContraseña) {
        inputContraseña.value = "";
      }
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
          await apiPartida.postTablero(data.id);
          apiPartida.guardarEnLocalStorage(
            "usuarios",
            apiPartida.jugadoresVerificados
          );
          apiPartida.guardarEnLocalStorage("partida", data.id);
          apiPartida.guardarEnLocalStorage("infoUsuarios", api.jugadores);
          alert("debugging: " + api.jugadores);
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
