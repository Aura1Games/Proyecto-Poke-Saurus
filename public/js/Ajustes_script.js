//Agregamos una escucha a window, que espera a que todos los elementos del DOM estén cargados

class ApiUsuarios {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getAll() {
    // Realiza una petición fetch a la URL base
    return (
      fetch(this.baseUrl) //tipo GET
        // cuando recibe la respuesta, la convierte a JSON
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la petición HTTP");
          }
          return response.json();
        })
    );
    /**/
    // Promesa de retorno a un objeto de JavaScript json
  }
  getByName(name) {
    // Realiza una petición fetch a la URL base agregando el parámetro nombre
    return (
      fetch(`${this.baseUrl}?nombre=${name}`) // GET
        // Convierte la respuesta a JSON
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la petición HTTP");
          }
          return response.json();
        })
    );
  }

  //   static administrarModalContra() {
  //     document.body = `
  //   <div id="modal-contrasena" class="modal">

  //   <div class="modal-contenido">
  //     <span class="cerrar-modal">&times;</span>
  //     <h2>Ingresa tu contraseña</h2>
  //     <input type="password" id="input-contrasena" placeholder="Contraseña">
  //     <button id="btn-aceptar">Aceptar</button>
  //   </div>

  // </div>`;

  //   }

  async obtenerJugadorDeBD(nombre) {
    if (nombre === "" || nombre === undefined) {
      alert("Debes ingresar un nombre para logearte");
      return Promise.resolve([]);
    }
    return await api
      .getByName(nombre)
      .then((data) => {
        if (data && data.nombre && data.contraseña) {
          // console.log(`nombre: ${data.nombre} contraseña: ${data.contraseña}`);
          return [
            {
              nombre: data.nombre,
              contraseña: data.contraseña,
            },
          ];
        } else {
          return [];
        }
      })
      .catch((error) => {
        alert("Error al obtener el usuario");
        console.error("Error al obtener el jugador: " + error);
        return [];
      });
  }

  async obtenerHashDeBD(nombre) {
    return fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        tipo: "obtener_hash",
      }),
    });
  }
}

class ApiPartida {
  // exporta la clase ApiPartida
  jugadoresVerificados = [];

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  postPartida(fecha, cant_jugadores, puntaje_final, ganador) {
    /*  
        Ejemplo de inserción de datos en la base de datos:

        INSERT INTO Partida(fecha, cant_jugadores, puntaje_final, ganador) 
        VALUES ("2025-09-05 15:30:00", 4, 40, 2); 
        
    */
    // Cabecera de la petición POST
    return fetch(this.baseUrl, {
      // petición POST
      method: "POST", // metodo de la petición: POST
      headers: {
        "Content-Type": "application/json", // Tipo de contenido: JSON
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

  obtenerFechaActual() {
    // obtiene la fecha actual en DATETIME
    // padStart() agrega caracteres al inicio de una cadena hasta que alcance una longitud especifica
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

const api = new ApiUsuarios("http://localhost/Proyecto-Poke-Saurus/api/");

// Función de escucha esperando a que cargue todo el contenido del DOM
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

  // Visualización dinamica de los contenedores de login
  selectElement.addEventListener("change", (event) => {
    // 'event' es el objeto evento que contiene información sobre el evento
    // 'event.target' se refiere al elemento select
    const jugadores = event.target.value; // Obtiene el valor seleccionado
    console.log(`${jugadores}`);
    if (jugadores == 2) {
      //manejo de estilos de los bloques de login según la cantidad de jugadores seleccionada
      bloque_1.style.display = "flex";
      bloque_2.style.display = "flex";
      bloque_3.style.display = "none";
      bloque_4.style.display = "none";
      bloque_5.style.display = "none";
    } else if (jugadores == 3) {
      bloque_1.style.display = "flex";
      bloque_2.style.display = "flex";
      bloque_3.style.display = "flex";
      bloque_4.style.display = "none";
      bloque_5.style.display = "none";
    } else if (jugadores == 4) {
      bloque_1.style.display = "flex";
      bloque_2.style.display = "flex";
      bloque_3.style.display = "flex";
      bloque_4.style.display = "flex";
      bloque_5.style.display = "none";
    } else if (jugadores == 5) {
      bloque_1.style.display = "flex";
      bloque_2.style.display = "flex";
      bloque_3.style.display = "flex";
      bloque_4.style.display = "flex";
      bloque_5.style.display = "flex";
    }
  });

  // Relación entre los inputs y los elementos visuales donde se muestra si están verificados o no
  const jugadores = [
    //lista con objetos input e icono asociados entre si
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

  // Obtenemos todos los botones de verificación de la página
  const botonesVerificar = document.querySelectorAll(".btn_verificar");

  // Asociamos cada botón a su jugador correspondiente
  botonesVerificar.forEach((boton, indice) => {
    boton.addEventListener("click", async () => {
      const input = jugadores[indice].input; //obtenemos el valor del input en el contenedor del botón

      const iconoJugador = jugadores[indice].icono; // obtenemos el valor del icono en el contenedor del botón

      const nombreIngresado = input.value.trim(); // Obtiene el valor y elimina los espacios en blanco con trim()

      const usuarioLogeado = await api.obtenerJugadorDeBD(nombreIngresado);
      /* usando un metodo de la clase api para obtener un jugador de la BD 
        la cual retorna un arreglo de objetos con clave nombre y contraseña
      */
      const esValido = usuarioLogeado.length > 0;
      // evalúa si el tamaño del retorno de datos es mayor a cero = true

      if (esValido) {
        if (
          apiPartida.jugadoresVerificados.includes(
            nombreIngresado.toLowerCase()
          )
        ) {
          // si el nombre ingresado está en la lista de jugadores ya verificados ...
          return alert(`⚠️ El jugador "${nombreIngresado}" ya está logeado.`);
        } else {
          // console.log(
          //   `nombre: ${usuarioLogeado[0].nombre}, contraseña: ${usuarioLogeado[0].contraseña}`
          // );

          let tmpContra = prompt("Ingrese su contraseña");
          // pide y evalúa si la contraseña ingresada por el usuario es la misma que la obtenida de la BD
          if (tmpContra !== usuarioLogeado[0].contraseña) {
            return alert("❌ Contraseña incorrecta");
          }
          // procedimiento para la verificación visual
          iconoJugador.classList.add("_verificado");
          iconoJugador.classList.remove("_no_verificado");
          // agrega el nombre del usuario a un arreglo de registro de usuarios logeados
          apiPartida.jugadoresVerificados.push(nombreIngresado.toLowerCase());
          alert(`✅ Jugador "${nombreIngresado}" verificado con éxito.`);
          console.log(
            apiPartida.jugadoresVerificados[
              apiPartida.jugadoresVerificados.length - 1
            ],
            apiPartida.jugadoresVerificados.length
          );
        }
      } else {
        alert(`❌ Usuario invalido.`);
        // Manejo de estilos del icono de verificación
        iconoJugador.classList.remove("_verificado");
        iconoJugador.classList.add("_no_verificado");
      }
    });
  });

  const apiPartida = new ApiPartida(
    "http://localhost/Proyecto-Poke-Saurus/api/"
  );

  const iniciar_partida = document.getElementById("btn_iniciar_partida");
  iniciar_partida.addEventListener("click", () => {
    // Cantidad de jugadores
    const cant_jugadores = selectElement.value;
    // Fecha actual tipo datetime
    if (cant_jugadores == apiPartida.jugadoresVerificados.length) {
      const fecha = apiPartida.obtenerFechaActual();
      apiPartida
        .postPartida(fecha, cant_jugadores, 40, 2)
        .then((response) => {
          // El primer .then recibe la respuesta HTTP.
          // response.json() es un método que lee el cuerpo de la respuesta y lo convierte a un objeto JavaScript.
          // Esto también devuelve una promesa.
          if (!response.ok) {
            // Si la respuesta no es exitosa (ej. error 500), lanzamos un error.
            throw new Error(`Error del servidor: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Este .then recibe el objeto JavaScript 'data' que el servidor envió.
          // Ahora podemos acceder a sus propiedades: data.mensaje y data.id.

          // Mostramos el mensaje y el ID en el contenedor del HTML.
          alert("✅ " + data.mensaje);

          apiPartida.guardarUsuariosEnLocalStorage();

          // Redirigimos a la página de la partida
          window.location.href =
            "/Proyecto-Poke-Saurus/public/pages/Partida.html";
        })
        .catch((error) => {
          // El .catch manejará errores de red o el error que lanzamos arriba.
          console.error("Error en la solicitud:", error);
          alert(`<p style="color: red;">${error.message}</p>`);
        });
    } else if (cant_jugadores < apiPartida.jugadoresVerificados.length) {
      alert("⚠️ Hay mas jugadores logeados que jugadores detallados... ");
      location.reload();
    } else {
      alert("⚠️ Todos los usuarios deben estar logeados");
    }
  });

  registrarse.addEventListener("click", () => {
    window.location.href = "/Proyecto-Poke-Saurus/public/pages/Registro.html";
  });
});
