# Proyecto INSAI

## Resumen
INSAI es una aplicación web construida utilizando Python y Flask, diseñada para gestionar diversos aspectos de las operaciones organizacionales, incluyendo la gestión de usuarios, departamentos, objetivos y más. La aplicación se integra con una base de datos MySQL para la persistencia de datos y emplea tecnologías web modernas para una interfaz de usuario responsiva.

## Librerías de Python Utilizadas

Este proyecto aprovecha varias librerías de Python para manejar el desarrollo web, interacciones con bases de datos, seguridad y operaciones del sistema. A continuación, se presenta una descripción detallada de cada librería, su propósito y cómo se utiliza dentro del proyecto INSAI.

### 1. **Flask**
   - **Descripción**: Flask es un marco web ligero y flexible para Python que proporciona herramientas y librerías para construir aplicaciones web de manera rápida y eficiente. Sigue el estándar WSGI (Web Server Gateway Interface) y está diseñado para ser simple pero extensible.
   - **Funcionalidad**: Flask maneja el enrutamiento, el manejo de solicitudes/respuestas, la gestión de sesiones y el renderizado de plantillas. Permite a los desarrolladores crear APIs RESTful y páginas web con un código boilerplate mínimo.
   - **Uso en INSAI**: Flask sirve como el marco central de la aplicación. Se utiliza en `router.py` para definir rutas para diferentes páginas (por ejemplo, login, inicio, gestión de usuarios) y en los controladores para procesar solicitudes y renderizar plantillas HTML. Por instancia, rutas como `/login` y `/home` son manejadas por Flask para entregar las páginas web y puntos finales de API apropiados.

### 2. **Flask-CORS**
   - **Descripción**: Flask-CORS es una extensión para Flask que habilita el soporte de Cross-Origin Resource Sharing (CORS). CORS es una característica de seguridad implementada por los navegadores web para prevenir que las páginas web hagan solicitudes a un dominio diferente al que sirvió la página web.
   - **Funcionalidad**: Permite o restringe que los recursos en una página web sean solicitados desde otro dominio, proporcionando un control detallado sobre las solicitudes de origen cruzado.
   - **Uso en INSAI**: En una aplicación web que puede servir APIs o recursos a diferentes orígenes (por ejemplo, durante el desarrollo o integración con otros servicios), Flask-CORS asegura que la aplicación pueda manejar solicitudes de varias fuentes de manera segura. Se inicializa en la configuración principal de la aplicación para permitir interacciones de origen cruzado necesarias, particularmente para solicitudes AJAX desde el frontend.

### 3. **Werkzeug.utils**
   - **Descripción**: Werkzeug es una librería de utilidades WSGI completa para Python, y `werkzeug.utils` es un submódulo que proporciona varias funciones de utilidad para el desarrollo web, como manipulación de URLs, manejo seguro de nombres de archivos y más.
   - **Funcionalidad**: Incluye herramientas para generar nombres de archivos seguros, redirigir respuestas y manejar utilidades HTTP, haciéndolo esencial para operaciones web seguras.
   - **Uso en INSAI**: Esta librería se utiliza para tareas relacionadas con la seguridad, como sanitizar nombres de archivos al manejar cargas de archivos (por ejemplo, avatares de usuarios o documentos). En los modelos o controladores, `werkzeug.utils.secure_filename` asegura que los archivos cargados tengan nombres seguros para prevenir vulnerabilidades de seguridad como ataques de traversal de rutas.

### 4. **os**
   - **Descripción**: El módulo `os` es parte de la librería estándar de Python y proporciona una forma de interactuar con el sistema operativo, incluyendo operaciones del sistema de archivos, variables de entorno y gestión de procesos.
   - **Funcionalidad**: Permite que los scripts realicen tareas a nivel de SO como leer/escribir archivos, navegar directorios y acceder a variables de entorno.
   - **Uso en INSAI**: El módulo `os` se utiliza para operaciones del sistema de archivos, como acceder a archivos de configuración, gestionar rutas para activos (por ejemplo, imágenes, CSS, archivos JS) y recuperar variables de entorno para credenciales de base de datos o configuraciones de la aplicación. Por ejemplo, ayuda en la construcción de rutas de archivos para recursos estáticos servidos por la aplicación web.

### 5. **mysql.connector**
   - **Descripción**: MySQL Connector/Python es un controlador oficial de MySQL para Python que proporciona una interfaz para conectarse a bases de datos MySQL y ejecutar consultas SQL.
   - **Funcionalidad**: Soporta agrupación de conexiones, declaraciones preparadas y varios métodos de autenticación, habilitando interacciones seguras y eficientes con bases de datos.
   - **Uso en INSAI**: Esta librería es crucial para las operaciones de base de datos en el proyecto. Se utiliza en los modelos (por ejemplo, `usuario_model.py`, `departamento_model.py`) para establecer conexiones a la base de datos MySQL (`insai_poa.sql`), ejecutar consultas para operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y recuperar datos para las características de la aplicación como gestión de usuarios, listados de departamentos y registros de auditoría.

### 6. **subprocess**
   - **Descripción**: El módulo `subprocess` es parte de la librería estándar de Python y permite generar nuevos procesos, conectarse a sus tuberías de entrada/salida/error y obtener sus códigos de retorno.
   - **Funcionalidad**: Proporciona una forma de ejecutar comandos o scripts externos desde dentro de un programa Python, útil para automatización e integración del sistema.
   - **Uso en INSAI**: Este módulo se emplea para ejecutar comandos a nivel de sistema o scripts, como ejecutar migraciones de base de datos, respaldos o integrar con otras herramientas. Por instancia, podría usarse en scripts de mantenimiento o para automatizar tareas relacionadas con el despliegue de la aplicación o el procesamiento de datos.

## Instalación y Configuración
Para configurar el proyecto, asegúrese de tener Python instalado y ejecute los siguientes comandos:

```bash
pip install flask flask-cors mysql-connector-python
```

Nota: `werkzeug`, `os` y `subprocess` son parte de la librería estándar de Python y no requieren instalación separada.

## Contribuyendo
Las contribuciones al proyecto INSAI son bienvenidas. Por favor, asegúrese de que cualquier nueva característica o cambio se alinee con la arquitectura existente e incluya documentación apropiada.

<<<<<<< HEAD
```bash
# For npm
npm install --legacy-peer-deps

# For Yarn
yarn
```

4. Now, you are ready to run `npm` tasks, below command will start the server and watch the code using [browsersync](https://browsersync.io/). Open [http://localhost:3000/](http://localhost:3000/) to check your development 🚀.

```bash
# npm
npm run serve

# yarn
yarn serve
```

## Available Tasks 🧑‍💻

Open console/terminal, go to the Sneat root directory and run `npm run {task_name}`.i.e To generate build run `npm run build`.

Run a task with specified environment(development/production) just execute the task with `--env={environment}` option, i.e. `npm run build --env=production`.

> **Tip:** Use `npm run` command to list all predefined npm tasks from `package.json` file.

## What's Included 📦

- Dashboard
- Layouts
  - Without menu
  - Without Navbar
  - Container
  - Fluid
  - Blank
- Pages
  - Account Settings
  - Login
  - Register
  - Forgot Password
  - Error
  - Under Maintenance
- Cards
- User Interface
  - **All Bootstrap Components**
- Extended UI
  - Perfect Scrollbar
  - Text Divider
- Boxicon
- Form Elements
  - Basic Inputs
  - Input Groups
- Form Layout
  - Vertical Form
  - Horizontal Form
- Tables

## What's in Premium Version 💎

| Sneat Free Version                                                                        | Sneat Premium Version                                                                                                            |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [Demo](https://themeselection.com/demo/sneat-bootstrap-html-admin-template-free/html/)    | [Demo](https://themeselection.com/demo/sneat-bootstrap-html-admin-template/html/vertical-menu-template/)                         |
| [Download](https://themeselection.com/products/sneat-free-bootstrap-html-admin-template/) | [Purchase](https://themeselection.com/products/sneat-bootstrap-html-admin-template/)                                             |
| Single vertical Menu                                                                      | Vertical Menu + Horizontal Menu                                                                                                  |
| Simple Light Style                                                                        | Light & Dark Style                                                                                                               |
| Default Theme                                                                             | Default, Semi Dark & Bordered Themes                                                                                             |
| Fixed Layout(Menu)                                                                        | Fixed & Static Layout(Menu)                                                                                                      |
| 1 Simple Dashboard                                                                        | 3 Niche Dashboards                                                                                                               |
| -                                                                                         | Multiple Ready to use Application like Calendar, Invoice, Users List, Users View, Roles and Permission etc.                      |
| Simple From Elements                                                                      | Advance form elements, validation & form wizard                                                                                  |
| Basic Cards                                                                               | Basic, Advance , Statistics, Analytics, Gamifications and Actions Cards                                                          |
| Basic User Interface(Components)                                                          | Advance and Custom User Interfaces(Components)                                                                                   |
| Two Extended Components                                                                   | Twelve Ready to use Extended Components                                                                                          |
| -                                                                                         | Quick Search - Quickly navigate between pages (w/ hotkey support)                                                                |
| Basic Pages                                                                               | Authentication Pages in 2 Variants + Ready to use pages like User Profile, Account Settings,FAQ, Help Center, Pricing, Misc etc. |
| -                                                                                         | 3D Characters + Illustrations                                                                                                    |
| Basic tables                                                                              | Advanced tables                                                                                                                  |
| -                                                                                         | Quick customization using theme config file                                                                                      |
| -                                                                                         | Leaflet Maps                                                                                                                     |
| 1 Chart Library                                                                           | 2 Chart Libraries                                                                                                                |
| -                                                                                         | Multiple Navbar & Menu Options                                                                                                   |
| -                                                                                         | Starter-kit                                                                                                                      |
| -                                                                                         | Internationalization support                                                                                                     |
| -                                                                                         | RTL Support                                                                                                                      |
| Regular Support                                                                           | Priority Support                                                                                                                 |
| Detailed Documentation                                                                    | Detailed Documentation                                                                                                           |

## Documentation 📜

Check out our live [Documentation](https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/)

## Browser Support 🖥️

At present, we officially aim to support the last two versions of the following browsers:

- Chrome (latest)
- FireFox (latest)
- Safari (latest)
- Microsoft Edge (latest)
- Opera (latest)

## Useful Links 🎁

- [Freebies](https://themeselection.com/products/category/download-free-admin-templates/)
- [Download Free Admin Templates](https://themeselection.com/products/category/download-free-admin-templates/)
- [Bootstrap 5 CheatSheet](https://bootstrap-cheatsheet.themeselection.com/)

## Support 👨‍💻

We use GitHub issues as support tickets to manage Item support.

1. In order to raise the GitHub issue, you must have a github account. [Raise a Issue](https://github.com/themeselection/sneat-html-admin-template-free/issues)

## License ©

- Copyright © [ThemeSelection](https://themeselection.com/)
- Licensed under [MIT](https://github.com/themeselection/sneat-html-admin-template-free/blob/master/LICENSE.md)

## Contributing 🦸

Contribution are always welcome and recommended! Here is how:

- Fork the repository ([here is the guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo)).
- Clone to your machine `git clone https://github.com/YOUR_USERNAME/REPO_URL` Make your changes
- Create a pull request

### Contribution Requirements 🧰

- When you contribute, you agree to give a non-exclusive license to ThemeSelection to use that contribution in any context as we (ThemeSelection) see appropriate.
- If you use content provided by another party, it must be appropriately licensed using an open source license.
- Contributions are only accepted through Github pull requests.
- Finally, contributed code must work in all supported browsers.

## Creators 😇

- [ThemeSelection](https://themeselection.com)

## Changelog 📆

Please refer to the [CHANGELOG](https://themeselection.com/demo/sneat-bootstrap-html-admin-template-free/changelog.html) file. We will add a detailed release notes to each new release.

## Social Media 🌍

- Twitter : [https://twitter.com/Theme_Selection](https://twitter.com/Theme_Selection)
- Facebook : [https://www.facebook.com/ThemeSelections/](https://www.facebook.com/ThemeSelections/)
- Pinterest : [https://pinterest.com/themeselect/](https://pinterest.com/themeselect/)
- Instagram : [https://www.instagram.com/themeselection/](https://www.instagram.com/themeselection/)
#   i n d i n s a i  
 #   i n d i n s a i  
 
=======
## Licencia
Este proyecto está licenciado bajo los términos especificados en `LICENSE.md`.
>>>>>>> 9588e44bb427be0cc90e218cf5d9302f3dc75c2f
