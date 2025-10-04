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

  async obtenerJugadorDeBD(nombre) {
    if (nombre === "" || nombre === undefined) {
      alert("Debes ingresar un nombre para logearte");
      return Promise.resolve([]);
    }

    return api
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
          alert("Usuario no encontrado o estructura inválida");
          return [];
        }
      })
      .catch((error) => {
        alert("Error al obtener el usuario");
        console.error("Error al obtener el jugador: " + error);
        return [];
      });
  }
}

class ApiPartida {
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
      }),
    });
  }
}

function obtenerFechaActual() {
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

const api = new ApiUsuarios("http://localhost/Proyecto-Poke-Saurus/api/");

window.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("cant_jugadores");
  const bloque_1 = document.getElementById("contenedor_01");
  const bloque_2 = document.getElementById("contenedor_02");
  const bloque_3 = document.getElementById("contenedor_03");
  const bloque_4 = document.getElementById("contenedor_04");
  const bloque_5 = document.getElementById("contenedor_05");
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
  const jugadoresVerificados = [];

  // Obtenemos todos los botones de verificación de la página
  const botonesVerificar = document.querySelectorAll(".btn_verificar");

  // Asociamos cada botón a su jugador correspondiente
  botonesVerificar.forEach((boton, indice) => {
    boton.addEventListener("click", async () => {
      const input = jugadores[indice].input; //manejo de clases

      const iconoJugador = jugadores[indice].icono;

      const nombreIngresado = input.value.trim(); // Obtiene el valor y elimina los espacios en blanco con trim()

      // Verificamos si el nombre ingresado existe en la base de datos
      // const esValido = jugadoresRegistrados.includes(nombreIngresado);
      // nombre y contraseña
      const usuarioLogeado = await api.obtenerJugadorDeBD(nombreIngresado);
      const esValido = usuarioLogeado.length > 0;
      // Actualizamos la clase del ícono según el resultado

      // Mostramos una alerta informando el resultado
      if (esValido) {
        if (jugadoresVerificados.includes(nombreIngresado.toLowerCase())) {
          return alert(`❌ El jugador "${nombreIngresado}" ya está logeado.`);
        } else {
          iconoJugador.classList.add("_verificado");
          iconoJugador.classList.remove("_no_verificado");
          jugadoresVerificados.push(nombreIngresado.toLowerCase());
          alert(`✅ Jugador "${nombreIngresado}" verificado con éxito.`);
          console.log(
            jugadoresVerificados[jugadoresVerificados.length - 1],
            jugadoresVerificados.length
          );
        }
      } else {
        alert(`❌ El jugador "${nombreIngresado}" no está registrado.`);
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
    if (cant_jugadores == jugadoresVerificados.length) {
      const fecha = obtenerFechaActual();
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
          alert(
            "Mensaje:" +
              data.mensaje +
              "\nID de la partida: " +
              data.id +
              " data retornada"
          );
          window.location.href =
            "/Proyecto-Poke-Saurus/public/pages/Partida.html";
        })
        .catch((error) => {
          // El .catch manejará errores de red o el error que lanzamos arriba.
          console.error("Error en la solicitud:", error);
          alert(`<p style="color: red;">${error.message}</p>`);
        });
    } else {
      alert("❌ Todos los usuarios deben estar logeados");
    }
  });
});
