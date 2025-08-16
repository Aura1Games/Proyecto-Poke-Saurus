//Agregamos una escucha a window, que espera a que todos los elementos del DOM estén cargados
window.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("cant_jugadores");
  const bloque_1 = document.getElementById("contenedor_01");
  const bloque_2 = document.getElementById("contenedor_02");
  const bloque_3 = document.getElementById("contenedor_03");
  const bloque_4 = document.getElementById("contenedor_04");
  const bloque_5 = document.getElementById("contenedor_05");
  bloque_1.style.display = "flex";
  bloque_2.style.display = "flex";
  selectElement.addEventListener("change", (event) => {
    // 'event' es el objeto evento que contiene información sobre el evento
    // 'event.target' se refiere al elemento select
    const jugadores = event.target.value; // Obtiene el valor seleccionado
    console.log(`${jugadores}`);
    if (jugadores == 2) {
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
  const jugadoresRegistrados = [
    "admin123",
    "player2",
    "player3",
    "player4",
    "player5",
  ];

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

  // Asociamos cada botón a su correspondiente jugador
  botonesVerificar.forEach((boton, indice) => {
    boton.addEventListener("click", () => {
      const input = jugadores[indice].input; //manejo de clases
      const iconoJugador = jugadores[indice].icono;
      const nombreIngresado = input.value.trim();

      // Verificamos si el nombre ingresado existe en la base de datos
      const esValido = jugadoresRegistrados.includes(nombreIngresado);

      // Actualizamos la clase del ícono según el resultado
      iconoJugador.classList.toggle("_verificado", esValido);
      iconoJugador.classList.toggle("_no_verificado", !esValido);

      // Mostramos una alerta informando el resultado
      if (esValido) {
        alert(`✅ Jugador "${nombreIngresado}" verificado con éxito.`);
      } else {
        alert(`❌ El jugador "${nombreIngresado}" no está registrado.`);
      }
    });
  });

  const iniciar_partida = document.getElementById("btn_iniciar_partida");
  iniciar_partida.addEventListener("click", () => {
    window.location.href = "/public/pages/Partida.html";
  });
});
