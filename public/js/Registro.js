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

    function lanzarError(error) {
      zonaErrores.innerText = "";
      const elemento = document.createElement("div");
      elemento.innerHTML = error;
      zonaErrores.appendChild(elemento);
      return elemento;
    }

    const informacionUsuario = [
      {
        nombre: nombre.value,
        correo: correo.value,
        contra: contra.value,
        repetirContra: repetirContra.value,
        edad: edad.value,
      },
    ];

    function verificarCampos() {
      console.log("Usando función verificarCampos()");

      // para evaluar arreglo mejor usar el metodo some, en el se ejecuta como un forEach solo que no espera un retorno directo

      const algunCampoVacio = informacionUsuario.some((elemento) => {
        return (
          !elemento.nombre ||
          !elemento.correo ||
          !elemento.contra ||
          !elemento.edad
        );
      });
      console.log("Hay algún campo faltante");
      return algunCampoVacio; // retorna true si hay campos vacios y false si no
    }

    function usuarioSucces() {
      zonaErrores.innerText = "";
      const elemento = document.createElement("div");
      elemento.innerHTML = `<div class="alert alert-success mt-3" role="alert">
  Usuario ${informacionUsuario[0].nombre} agregado correctamente
</div>`;
      return elemento;
    }

    if (verificarCampos()) {
      console.error("error: campos vacíos");
      zonaErrores.appendChild(
        lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: Debes de completar todos los campos</div>`)
      );
      return;
    }
    if (informacionUsuario[0].contra !== informacionUsuario[0].repetirContra) {
      zonaErrores.appendChild(
        lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: Contraseña distintas en los campos <b>Contraseña</b> y <b>Repetir contraseña</b>
</div>`)
      );
      console.error("error: contraseña desigual");
      return;
    }
    if (informacionUsuario[0].contra.length < 8) {
      console.error("error: contraseña menor a 8 caracteres");
      zonaErrores.appendChild(
        lanzarError(`<div class="alert alert-danger mt-3" role="alert">
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
        lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: La contraseña solo puede contener caracteres <b>#</b>, <b>!</b>, <b>-</b>, <b>/</b>, tampoco puede contener <b>ñ</b> </div>`)
      );
      return;
    }
    if (!informacionUsuario[0].correo.includes("@")) {
      console.error("error: correo invalido");
      zonaErrores.appendChild(
        lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: Correo electrónico invalido, asegurate de tener un <b>@</b> en tu correo </div>`)
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
