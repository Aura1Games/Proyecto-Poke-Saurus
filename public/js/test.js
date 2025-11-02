console.log("Calculando los puntos de trio frondoso");
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
