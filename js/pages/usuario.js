//Evento POST para carga la foto de perfil
$(document).on("change", "#upload", function(event) {
    event.preventDefault();
    event.stopPropagation();
    const archivo = this.files[0];

    const datosManuales = new FormData();
    datosManuales.append("archivo", archivo);

    const config = {
        UrlControl: "http://localhost:5000/Usuario/SubirFoto",
        Formulario: datosManuales,
        Method: "POST",
    };

    if (archivo) {
        // Validar tamaño (5MB)
        if (archivo.size > 5 * 1024 * 1024) {
            Swal.fire("Error", "La imagen excede los 5MB", "error");
            $(this).val(""); // Limpiar
            return;
        }

        methodSendFile(config, function(data) {
            $("#uploadedAvatar").css("opacity", "0.5");
            $("#foto_ruta").val(data.nombre_archivo);
            $("#uploadedAvatar").attr("src", data.url_completa).css("opacity", "1");
        });      
    }
});

//Evento POST para borrar la foto de perfil
$(document).on("click", "#resetear", function(event) {
    event.preventDefault();
    
    const nombreArchivo = $("#foto_ruta").val();

    // Si no hay foto subida (está la de por defecto), solo limpiamos el input file
    if (nombreArchivo === "" || nombreArchivo === "1.png") {
        $("#upload").val("");
        $("#uploadedAvatar").attr("src", "../../assets/img/avatars/1.png");
        return;
    }

    const datos = new FormData();
    datos.append("nombre_archivo", nombreArchivo);

    const config = {
        UrlControl: "http://localhost:5000/Usuario/EliminarFoto",
        Formulario: datos,
        Method: "POST", // Usamos POST porque algunos servidores bloquean el body en DELETE
    };

    methodSendFile(config, function(data) {
        if (data.status) {
            // Restauramos la imagen por defecto y limpiamos campos
            $("#uploadedAvatar").attr("src", "../../assets/img/avatars/1.png");
            $("#foto_ruta").val("");
            $("#upload").val("");
        }
    });
    
});

let usuariosLocales = [];

// Evento GET para Consulta 
function consultarUsuarios() {
  // 1. URL de tu servidor Flask
  const url = "http://localhost:5000/UsuarioData/Consultar"
  let contenido = "";
  
  const receptor = document.getElementById("tablaUsuario")
  
  MethodGet(url, function(lista) {
  usuariosLocales = lista;

    console.log(lista);

    let contenido = "";

    lista.forEach(item => {
      // Manejo de estados (Activo/Inactivo)
      let estado = (item.statu !== "0")
          ? '<span class="badge bg-label-primary me-1">Activo</span>'
          : '<span class="badge bg-label-danger me-1">Inactivo</span>';

      let accion = (item.statu !== "0") ? 'Desactivar' : 'Activar';

      // 1. Convertimos el string raro a un objeto Date de JS
      const fechaI = new Date(item.fecha_inicio);
      const fechaF = new Date(item.fecha_final);

      // 2. Formateamos a estilo latino (día/mes/año)
      item.fecha_inicio = fechaI.toLocaleDateString('es-ES');
      item.fecha_final = fechaF.toLocaleDateString('es-ES');

        contenido += `
            <tr>
                <td>${item.id_usuario}</td>
                <td>${item.nombre} ${item.apellido}</td>
                <td>${item.email}</td>
                <td>${estado}</td>
                <td>
                    <div class="dropdown">
                      <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="bx bx-dots-vertical-rounded"></i>
                      </button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item Edit" 
                           style="cursor:pointer;"
                           data-id="${item.id_usuario}"
                           data-cedula="${item.id_usuario}" 
                           data-nombre="${item.nombre}"
                           data-apellido="${item.apellido}"
                           data-email="${item.email}"
                           data-telefono="${item.telefono}"
                           data-fechan="${item.fecha_nacimiento}"
                           data-direccion="${item.direccion}"
                           data-profesion="${item.profesion}">
                           <i class="bx bx-edit-alt me-1"></i> Editar
                        </a>
                        <a class="dropdown-item Toggle" data-unico="${item.id_usuario}" data-status="${item.statu}">
                            <i class='bx bx-toggle-big-right me-1'></i> ${accion}
                        </a>
                      </div>
                    </div>
                </td>
            </tr>`;

    })

    const form = document.getElementById("formUsuario"); 
    if(form) form.reset();
    
    receptor.innerHTML = contenido;
  })

}

function SelectDepartamento() {
  // 1. URL de tu servidor Flask
  const url = "http://localhost:5000/Select/Consultar?tabla=departamentos&col1=id_departamento&col2=nombre"

  let contenido = "";

  const receptor = document.getElementById("departamento")

  MethodGet(url, function(lista) {

    let contenido = "<option value=''>seleccione una opción</option> ";

    lista.forEach(item => {

        contenido += `
                <option value='${item.id_departamento}'>#${item.id_departamento}: ${item.nombre}</option>
                `;

    })
    
    receptor.innerHTML = contenido;

  })

}

function SelectNivel() {
  // 1. URL de tu servidor Flask
  const url = "http://localhost:5000/Select/Consultar?tabla=nivel&col1=id_nivel&col2=nombre"
    
  let contenido = "";

  const receptor = document.getElementById("nivel")

  MethodGet(url, function(lista) {

    let contenido = "<option value=''>seleccione una opción</option> ";

    lista.forEach(item => {

        contenido += `
                <option value='${item.id_nivel}'>${item.nombre}</option>
                `;

    })
    
    receptor.innerHTML = contenido;
  })

}

function SelectPreguntas() {
  // 1. URL de tu servidor Flask
  const url = "http://localhost:5000/Select/Consultar?tabla=tipo_pregunta&col1=id_tipo_pregunta&col2=tipo_pregunta"
    
  let contenido = "";

  const Pregunta1 = document.getElementById("pregunta1")
  const Pregunta2 = document.getElementById("pregunta2")
  const Pregunta3 = document.getElementById("pregunta3")

  MethodGet(url, function(lista) {

    let contenido = "<option value=''>seleccione una opción</option> ";

    lista.forEach(item => {

        contenido += `
                <option value='${item.id_tipo_pregunta}'>${item.tipo_pregunta}</option>
                `;

    })

    Pregunta1.innerHTML = contenido;
    Pregunta2.innerHTML = contenido;
    Pregunta3.innerHTML = contenido;
  })

}

// Evento POST para crear
$(document).on("click", "#Crear", function () {

    if ($("#formUsuario").valid()) {

        const config = {
            UrlControl: "http://localhost:5000/UsuarioData/Crear",
            Formulario: document.getElementById("formUsuario"),
            Method: "POST",
        };

        methodSend(config, function(params) {
            consultarUsuarios();
            $("#UsuarioModal").modal("hide");
        });
    }
  
});

// Evento PUT para activar/desactivar 
$(document).on("click", ".Toggle", function (event) {
    const id = $(this).data("unico");
    const statusActual = $(this).data("status");

    const nuevoStatus = (statusActual == "1") ? "0" : "1";

    const datosManuales = new FormData();
    datosManuales.append("id_usuario", id);
    datosManuales.append("status", nuevoStatus);
    const envio = {
        UrlControl: "http://localhost:5000/Usuario/Toggle", // Endpoint sugerido para status
        Formulario: datosManuales,
        Method: "PUT"
    }
 
    methodSend(envio,  function (params) {
      consultarUsuarios
    });

})

// Evento PUT para edición 
$(document).on("click", ".Editar", function (event) {

    const d = $(this).data(); // Captura todos los data-attributes
    
    $("#created").val(d.id);
    $("#cedula").val(d.cedula);
    $("#firstName").val(d.nombre);
    $("#lastName").val(d.apellido);
    $("#email").val(d.email);
    $("#numerocel").val(d.telefono);
    $("#fechan").val(d.fechan);
    $("#direccion").val(d.direccion)

    // 3. Cambiar el botón "Enviar" para que sea de "Editar"
    $("#Crear").text("Editar").removeClass("btn-primary")
    .addClass("btn-warning").off("click").on("click", function() {
        if ($("#formUsuario").valid()) {
                const config = {
                    UrlControl: "http://localhost:5000/Usuario/Editar",
                    Formulario: document.getElementById("formUsuario"),
                    Method: "PUT",
                };

                methodSend(config, function() {
                    consultarUsuarios();

                    $("#UsuarioModal").modal("hide");

                    $("#Crear").text("Enviar").removeClass("btn-warning").addClass("btn-primary").attr('data-action','create');
                });

            }

    });
    
    // 4. Abrir el modal manualmente
    $("#UsuarioModal").modal("show");  
});

$(document).ready(function () {

    consultarUsuarios()
    SelectDepartamento()
    SelectPreguntas()
    SelectNivel()
 
    const $form = $("#formUsuario");
    if ($form.length) {
        $form.validate({
        rules: {
            cedula: {
                required: true,
                minlength: 7,
                usuarioUnico: true // <--- Regla local
            },
            firstName: { 
                required: true, 
                minlength: 2 
            },
            lastName: { 
                required: true, 
                minlength: 2 
            },
            email: {
                required: true,
                email: true,
                usuarioUnico: true // <--- Regla local
            },
            numerocel: { 
                required: true,
                minlength: 11 
            },
            fechan: { 
                required: true 
            },
            direccion: { 
                required: true, 
                minlength: 10 
            },
            profesion: { 
                required: true 
            },
            usuario: { 
                required: true, 
                minlength: 4 
            },
            
            // Validación de Contraseñas
            contraseña: { 
                required: true, 
                minlength: 6 
            },
            confirmarcontraseña: { 
                required: true, 
                equalTo: "#contraseña" 
            },
            
            // Selects dinámicos
            nivel: { 
                required: true 
            },
            departamento: { 
                required: true 
            },
            
            // Preguntas (usando la clase .pregunta-seguridad)
            pregunta1: { 
                required: true, 
                distintasPreguntas: true 
            },
            pregunta2: { 
                required: true, 
                distintasPreguntas: true 
            },
            pregunta3: { 
                required: true, 
                distintasPreguntas: true 
            },
            
            // Respuestas
            repuesta1: { 
                required: true,
                distintasRespuestas: true
            },
            repuesta2: { 
                required: true,
                distintasRespuestas: true
            },
            repuesta3: { 
                required: true,
                distintasRespuestas: true
            }
        },

        messages: {
            cedula: {
                required: "La cédula de identidad es obligatoria.",
                minlength: "La cédula debe tener al menos 7 dígitos.",
                maxlength: "La cédula no puede exceder los 12 caracteres."
            },
            firstName: {
                required: "Por favor, ingrese sus nombres.",
                minlength: "El nombre debe tener al menos 2 caracteres."
            },
            lastName: {
                required: "Por favor, ingrese sus apellidos.",
                minlength: "El apellido debe tener al menos 2 caracteres."
            },
            email: {
                required: "El correo electrónico es indispensable para el registro.",
                email: "Ingrese un formato de correo válido (ejemplo@correo.com)."
            },
            numerocel: {
                required: "El número de teléfono es obligatorio.",
                minlength: "Ingrese el número completo (Ej: 04121234567)."
            },
            fechan: {
                required: "La fecha de nacimiento es obligatoria."
            },
            direccion: {
                required: "La dirección es necesaria para el registro.",
                minlength: "Sea más específico con la dirección (mínimo 10 caracteres)."
            },
            profesion: {
                required: "Indique su ocupación o profesión."
            },
            usuario: {
                required: "Debe asignar un nombre de usuario.",
                minlength: "El usuario debe tener al menos 4 caracteres."
            },
            contraseña: {
                required: "La contraseña es obligatoria.",
                minlength: "La contraseña debe tener al menos 6 caracteres."
            },
            confirmarcontraseña: {
                required: "Debe confirmar su contraseña.",
                equalTo: "Las contraseñas no coinciden, verifique de nuevo."
            },
            nivel: {
                required: "Debe seleccionar un nivel de acceso."
            },
            departamento: {
                required: "Seleccione el departamento al que pertenece."
            },
            // Mensajes para las preguntas de seguridad
            pregunta1: {
                required: "Seleccione la primera pregunta de seguridad.",
                distintasPreguntas: "No puede repetir la misma pregunta."
            },
            pregunta2: {
                required: "Seleccione la segunda pregunta de seguridad.",
                distintasPreguntas: "Esta pregunta ya ha sido seleccionada arriba."
            },
            pregunta3: {
                required: "Seleccione la tercera pregunta de seguridad.",
                distintasPreguntas: "Debe elegir tres preguntas diferentes."
            },
            // Mensajes para las respuestas
            repuesta1: {
                required: "Debe responder a la primera pregunta."

            },
            repuesta2: {
                required: "Debe responder a la segunda pregunta."
            },
            repuesta3: {
                required: "Debe responder a la tercera pregunta."
            }
        },
        errorElement: "span",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback animated fadeIn");
            element.closest(".form-group").append(error);
        },
        highlight: function (element) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid").addClass("is-valid");
        }
        });
    }

    $.validator.addMethod("usuarioUnico", function(value, element) {
        // "value" es lo que el usuario escribió en el input (cédula o correo)
        
        // Buscamos si existe algún usuario en nuestra lista global que coincida
        let existe = usuariosLocales.some(user => 
            user.id_usuario == value || user.email.toLowerCase() === value.toLowerCase()
        );

        return !existe;
    }, "Este registro ya existe en el sistema.");

    // Regla para que las respuestas no sean iguales
    $.validator.addMethod("distintasRespuestas", function(value, element) {
        let respuestas = [];
        let repetida = false;

        // Evaluamos los 3 campos de respuesta
        $("#repuesta1, #repuesta2, #repuesta3").each(function() {
            let val = $(this).val().trim().toLowerCase(); // Normalizamos a minúsculas
            if (val !== "") {
                if (respuestas.includes(val)) {
                    repetida = true;
                }
                respuestas.push(val);
            }
        });

        return !repetida; 
    }, "Las respuestas de seguridad deben ser diferentes entre sí.");

    $.validator.addMethod("distintasPreguntas", function(value, element) {
    let preguntas = [];
    let repetida = false;

    // Buscamos todos los selects que tengan la clase .pregunta-seguridad
   $("#pregunta1, #pregunta2, #pregunta3").each(function() {
        let val = $(this).val();
        if (val !== "") {
            if (preguntas.includes(val)) {
                repetida = true;
            }
            preguntas.push(val);
        }
    });

    return !repetida; // Si es true, la validación pasa. Si es false, muestra error.
}, "No puedes seleccionar la misma pregunta dos veces.");

});