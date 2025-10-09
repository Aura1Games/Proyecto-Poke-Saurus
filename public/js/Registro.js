class Registro {
  constructor(nombre, correo, contra, repetirContra, edad, zonaErrores) {
    this.nombre = nombre;
    this.correo = correo;
    this.contra = contra;
    this.repetirContra = repetirContra;
    this.edad = edad;
    this.zonaErrores = zonaErrores;
  }

  validarEmail() {
    // Expresión regular para validar un formato de email básico pero efectivo.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // El método 'test()' de la expresión regular devuelve true o false.
    return regex.test(this.correo);
  }

  verificarCampos() {
    return !this.nombre || !this.correo || !this.contra || !this.edad;
  }

  contraseñasCoinciden() {
    return this.contra === this.repetirContra;
  }

  esContraseñaValida() {
    return this.contra.length >= 8;
  }

  contieneCaracteresInvalidos() {
    const caracteresInvalidos = ["ñ", "´", ".", "_"];
    return caracteresInvalidos.some((caracter) =>
      this.contra.toLowerCase().includes(caracter)
    );
  }

  lanzarError(error) {
    this.zonaErrores.innerText = "";
    const elemento = document.createElement("div");
    elemento.innerHTML = error;
    this.zonaErrores.appendChild(elemento);
    return elemento;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const btnSalir = document.getElementById("btn_salir");
  const nombre = document.getElementById("inputNombre");
  const correo = document.getElementById("inputEmail");
  const contra = document.getElementById("inputContra");
  const repetirContra = document.getElementById("inputRepetirContra");
  const edad = document.getElementById("inputEdad");
  const btnRegistrar = document.getElementById("btnSubmit");
  const zonaErrores = document.getElementById("errores");

  btnRegistrar.addEventListener("click", (e) => {
    // Evita que el formulario se envíe si hay errores
    e.preventDefault();

    // Declaramos la clase Registro
    const registro = new Registro(
      nombre.value,
      correo.value,
      contra.value,
      repetirContra.value,
      edad.value,
      zonaErrores
    );

    const informacionUsuario = [
      {
        nombre: nombre.value,
        correo: correo.value,
        contra: contra.value,
        repetirContra: repetirContra.value,
        edad: edad.value,
      },
    ];
    function usuarioSucces() {
      zonaErrores.innerText = "";
      const elemento = document.createElement("div");
      elemento.innerHTML = `<div class="alert alert-success mt-3" role="alert">
  Usuario ${informacionUsuario[0].nombre} agregado correctamente
</div>`;
      return elemento;
    }

    if (registro.verificarCampos()) {
      console.error("error: campos vacíos");
      zonaErrores.appendChild(
      registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: Debes de completar todos los campos</div>`)
      );
      return;
    }
    if (informacionUsuario[0].contra !== informacionUsuario[0].repetirContra) {
      zonaErrores.appendChild(
        registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: Contraseña distintas en los campos <b>Contraseña</b> y <b>Repetir contraseña</b>
</div>`)
      );
      console.error("error: contraseña desigual");
      return;
    }
    if (informacionUsuario[0].contra.length < 8) {
      console.error("error: contraseña menor a 8 caracteres");
      zonaErrores.appendChild(
        registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: La contraseña debe de tener al menos <b>8</b> caracteres</div>`)
      );
      return;
    }
    if (
      informacionUsuario[0].contra.toLowerCase().includes("ñ") ||
      informacionUsuario[0].contra.toLowerCase().includes("´") ||
      informacionUsuario[0].contra.toLowerCase().includes(".") ||
      informacionUsuario[0].contra.toLowerCase().includes("_")
    ) {
      console.error("error: caracteres invalidos");
      zonaErrores.appendChild(
        registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: La contraseña solo puede contener caracteres <b>#</b>, <b>!</b>, <b>-</b>, <b>/</b>, tampoco puede contener <b>ñ</b> </div>`)
      );
      return;
    }

    // Verificar la sintaxis del correo
    if (
      !correo.checkValidity() ||
      !registro.validarEmail(informacionUsuario[0].correo)
    ) {
      console.error("error: correo invalido");
      zonaErrores.appendChild(
        registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: Correo electrónico invalido, asegurate de tener un <b>@</b> en tu correo y un <b>dominio</b></div>`)
      );
      return;
    }

    zonaErrores.appendChild(usuarioSucces());
  });

  btnSalir.addEventListener("click", () => {
    window.location.href =
      "/Proyecto-Poke-Saurus/public/pages/Ajustes_de_partida.html";
  });
});
