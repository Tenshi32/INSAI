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

## Licencia
Este proyecto está licenciado bajo los términos especificados en `LICENSE.md`.