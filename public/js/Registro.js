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

  lanzarError(error) {
    this.zonaErrores.innerText = "";
    const elemento = document.createElement("div");
    elemento.innerHTML = error;
    this.zonaErrores.appendChild(elemento);
    return elemento;
  }
}

class Usuario {
  constructor(url) {
    this.baseUrl = url;
  }

  postRegistrarUsuario(nombre, correo, contra, edad) {
    // Cabecera de la petición POST
    return fetch(this.baseUrl, {
      // petición POST
      method: "POST", // metodo de la petición: POST
      headers: {
        "Content-Type": "application/json", // Tipo de contenido: JSON
      },
      body: JSON.stringify({
        nombre: nombre,
        contraseña: contra,
        edad: edad,
        correo: correo,
        tipo: "registrar_usuario",
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      return response.json(); // Parsear la respuesta JSON
    });
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

    const informacionUsuario = {
      nombre: nombre.value,
      correo: correo.value,
      contra: contra.value,
      repetirContra: repetirContra.value,
      edad: edad.value,
    };
    function usuarioSucces() {
      zonaErrores.innerText = "";
      const elemento = document.createElement("div");
      elemento.innerHTML = `<div class="alert alert-success mt-3" role="alert">
  Usuario ${informacionUsuario.nombre} agregado correctamente
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
    if (informacionUsuario.contra !== informacionUsuario.repetirContra) {
      zonaErrores.appendChild(
        registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
  Error: Contraseña distintas en los campos <b>Contraseña</b> y <b>Repetir contraseña</b>
</div>`)
      );
      console.error("error: contraseña desigual");
      return;
    }
    if (informacionUsuario.contra.length < 8) {
      console.error("error: contraseña menor a 8 caracteres");
      zonaErrores.appendChild(
        registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
      Error: La contraseña debe de tener al menos <b>8</b> caracteres</div>`)
      );
      return;
    }

    // Verificar la sintaxis del correo
    if (
      !correo.checkValidity() ||
      !registro.validarEmail(informacionUsuario.correo)
    ) {
      console.error("error: correo invalido");
      zonaErrores.appendChild(
        registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
        Error: Correo electrónico invalido, asegurate de tener un <b>@</b> en tu correo y un <b>dominio</b></div>`)
      );
      return;
    }

    const apiUsuario = new Usuario(
      "http://localhost/Proyecto-Poke-Saurus/api/"
    );
    apiUsuario
      .postRegistrarUsuario(
        informacionUsuario.nombre,
        informacionUsuario.correo,
        informacionUsuario.contra,
        informacionUsuario.edad
      )
      .then((data) => {
        if (data != null && !data.error) {
          console.log("Usuario registrado:", data);
          document.getElementById("formRegistro").reset();
          zonaErrores.appendChild(usuarioSucces());
        }
      })
      .catch((error) => {
        console.error("Error al registrar el usuario:", error);
        zonaErrores.appendChild(
          registro.lanzarError(`<div class="alert alert-danger mt-3" role="alert">
            Error: No se pudo registrar el usuario. Inténtalo de nuevo más tarde.</div>`)
        );
      });
  });

  btnSalir.addEventListener("click", () => {
    window.location.href =
      "/Proyecto-Poke-Saurus/public/pages/Ajustes_de_partida.html";
  });
});
