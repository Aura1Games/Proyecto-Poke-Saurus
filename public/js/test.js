var auxiliarTablero = JSON.parse(localStorage.getItem("Tablero"));
console.log(auxiliarTablero.length);
auxiliarTablero.splice(5, 1, {});
console.log(auxiliarTablero.length);
