# S.I.G.P.D. (Sistema Gestor de Partidas de Draftosaurus)

<div align="center">
  <img src="public/images/dino_icono.webp" alt="Logo SIGPD" width="200"/>
  <br>
  <p>
    <strong>Un sistema gestor de partidas para el juego Draftosaurus</strong>
  </p>
  <p>
    <a href="#-sobre-el-proyecto">Sobre el Proyecto</a> •
    <a href="#-características">Características</a> •
    <a href="#%EF%B8%8F-instalación">Instalación</a> •
    <a href="#-metodología">Metodología</a> •
    <a href="#%EF%B8%8F-tecnologías">Tecnologías</a>
  </p>
</div>

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-green)
![version_proyecto](https://img.shields.io/badge/versin-v1.0.5-green)

![Licencia](https://img.shields.io/badge/Licencia-MIT-green)
## 🚀 Sobre el Proyecto

El **S.I.G.P.D.** es un proyecto educativo que busca explorar nuevos horizontes de la programación. A través de la implementación de tecnologías y conceptos innovadores, nos permite planificar, diseñar y crear un sistema completo desde cero, enfocándose en la accesibilidad y el desempeño necesarios en el mundo laboral actual.

## ✨ Características

- 🎮 **Gestión de Partidas**: Sistema completo para administrar partidas de Draftosaurus
- 🔐 **Seguridad**: Sistema de autenticación con contraseñas cifradas
- 📱 **Responsive**: Diseño adaptable a diferentes dispositivos
- 🎲 **Complemento de Juego**: Integración con el juego físico Draftosaurus

## ⚙️ Instalación

1. **Prerrequisitos**
   ```bash
   - XAMPP v7.4 o superior
   - PHP 7.4+
   - MySQL 5.7+
   ```

2. **Configuración del Entorno**
   ```bash
   # Clonar el repositorio
   git clone https://github.com/Aura1Games/Proyecto-Poke-Saurus.git

   # Mover al directorio htdocs
   mv Proyecto-Poke-Saurus /xampp/htdocs/

   # Importar la base de datos
   mysql -u root < BD_draftosaurus.sql
   ```

3. **Iniciar Servicios**
   - Iniciar Apache y MySQL desde el panel de control de XAMPP
   - Acceder a `http://localhost/Proyecto-Poke-Saurus`



## 📱 Metodología

### Desarrollo Ágil
- Implementación de metodologías **Agile**
- Sprints de trabajo acumulativos
- Desarrollo incremental y continuo
- Control de versiones con Git y GitHub

### Flujo de Trabajo
1. Planificación de sprints semanales
2. Desarrollo de funcionalidades por iteraciones
3. Revisión y testing continuo
4. Integración y despliegue frecuente

### Gestión del Proyecto
- **Tablero Kanban**: Organización de tareas y seguimiento
- **Code Reviews**: Revisión de código entre pares
- **Integración Continua**: Pruebas automáticas y despliegue
- **Documentación**: Actualización continua de documentación
## 🛠️ Tecnologías

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

- **HTML5**: Estructura y semántica moderna
- **CSS3**: Estilos y diseño responsive
- **JavaScript**: 
  - Vanilla JS para manipulación del DOM
  - Gestión de eventos y validaciones
  - Comunicación asíncrona con el servidor
- **Bootstrap 5**: Framework CSS para diseño responsive y componentes

### Backend
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

- **PHP**:
  - API RESTful
  - Manejo de sesiones
  - Seguridad y autenticación
  - Operaciones CRUD
- **MySQL**:
  - Base de datos relacional
  - Gestión de usuarios y partidas
  - Optimización de consultas

### Herramientas de Desarrollo
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![XAMPP](https://img.shields.io/badge/XAMPP-FB7A24?style=for-the-badge&logo=xampp&logoColor=white)

- Control de versiones con Git
- Repositorio en GitHub
- Entorno de desarrollo XAMPP
 
 ***
 
 ## ⚠️ Guía de Uso y Restricciones

### 👤 Gestión de Usuarios

#### Requisitos de Registro
- Mínimo 2 jugadores para iniciar partida
- Acceso al registro mediante enlace "Registrarme"
- Datos únicos por usuario:
  - Nombre de usuario único
  - Email único
  - Contraseña segura (almacenada con cifrado)

#### Proceso de Registro
1. Acceder a la página de registro
2. Completar formulario con datos únicos
3. Confirmar registro
4. Iniciar sesión con credenciales

### 🎮 Sistema de Juego

#### Características
- Complemento del juego físico Draftosaurus
- No reemplaza componentes físicos:
  - Tablero
  - Dados
  - Fichas de dinosaurios

#### Funcionalidades
- Control de normas por recinto
- Cálculo automático de puntuación
- Seguimiento de turnos
- Registro de movimientos

#### Limitaciones
- No incluye:
  - Distribución de fichas
  - Simulación de dados
  - Mecánica draft del juego

### 📋 Requisitos del Sistema

#### Hardware Recomendado
- Procesador: 1.5 GHz o superior
- RAM: 2GB mínimo
- Espacio en disco: 500MB libre

#### Software Necesario
- Navegador web actualizado
- Conexión a Internet estable
- XAMPP instalado y configurado
    
***
## 👥 Equipo de Desarrollo

### Liderazgo
- 💡 **Coordinador**: [Elian Gutierrez](https://github.com/Elian-zzz/)
  - Gestión del proyecto
  - Toma de decisiones técnicas
  - Supervisión de desarrollo

- 📋 **Sub-Coordinador**: [Mateo Lalin](https://github.com/matln05)
  - Apoyo en coordinación
  - Control de calidad
  - Documentación técnica

### Desarrollo
- 📈 **Desarrollador**: [Benjamin Gigena](https://github.com/Gigena07)
  - _Orden y progreso_
  - Desarrollo backend
  - Optimización de base de datos

- 🤝 **Desarrollador**: [Emiliano Krawczyszyn](https://github.com/emiliano-ctrl)
  - _Relaciones internas_
  - Desarrollo frontend
  - Integración de componentes

### Organización
- ⭐ [**AuraGames**](https://github.com/Aura1Games/Proyecto-Poke-Saurus)
  - Gestión del repositorio
  - Coordinación de equipos
  - Control de versiones

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. 

```
MIT License

Copyright (c) 2025 AuraGamesStudios

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">
  <p>Desarrollado con ❤️ por AuraGames</p>
  <p>
    <sub>Todos los derechos reservados AuraGamesStudios ©2025</sub>
  </p>
</div>