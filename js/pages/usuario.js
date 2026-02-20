// EVENTTO FOST PARA SUBIR LA FOTO DE PERFIL Y MOSTRARLA EN EL AVATAR

$(document).on("change", "#upload", function(event) {
    event.preventDefault();
    event.stopPropagation();
    const archivo = this.files[0];

    const datosManuales = new FormData();
    datosManuales.append("archivo", archivo);

    const config = {
        UrlControl: LOCALURL+"Usuario/SubirFoto",
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

//EVENTO POST PARA BORRAR LA FOTO DE PERFIL Y RESTAURAR LA IMAGEN POR DEFECTO

$(document).on("click", "#resetear", function(event) {
    event.preventDefault();
    
    const nombreArchivo = $("#foto_ruta").val();

// SI NO HAY SUBIDA O YA ES LA IMAGEN POR DEFECTO, NO HACER NADA Y RESTAURAR LA IMAGEN POR DEFECTO

if (nombreArchivo === "" || nombreArchivo === "1.png") {
        $("#upload").val("");
        $("#uploadedAvatar").attr("src", "../../assets/img/avatars/1.png");
        return;
    }

    const datos = new FormData();
    datos.append("nombre_archivo", nombreArchivo);

    const config = {
        UrlControl: LOCALURL+"Usuario/EliminarFoto",
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

// EVENTO GET PARA CONSULTAR LOS USUARIOS Y MOSTRARLOS EN LA TABLA

function consultarUsuarios() {

// URL DE TU SERVIDOR FLASK PARA OBTENER LOS USUARIOS

    let url = LOCALURL+"UsuarioData/Consultar"

    let usuariosLocales = [];
  
    let receptor = document.getElementById("tablaUsuario")
    
    let contenido = "";
    
    MethodGet(url, function(lista) {
    usuariosLocales = lista;

      console.log(lista);


      lista.forEach(item => {

// MANEJO DE ESTADOS ACTIVO E INACTIVO PARA MOSTRARLO EN LA TABLA 

        let estado = (item.statu !== "0")
            ? '<span class="badge bg-label-primary me-1">Activo</span>'
            : '<span class="badge bg-label-danger me-1">Inactivo</span>';

        let accion = (item.statu !== "0") ? 'Desactivar' : 'Activar';

// COVERTIMOS EL STRING DE FECHA EN UN OBJETO DATE PARA FORMATEARLO MEJOR

        const fechaI = new Date(item.fecha_inicio);
        const fechaF = new Date(item.fecha_final);

// FORMATEAMOS LAS FECHAS A UN FORMATO MÁS LEGIBLE (DÍA/MES/AÑO)

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

 // 1. URL DE TU SERVIDOR FLASK PARA OBTENER LOS DEPARTAMENTOS 

 const url = LOCALURL+"Select/Consultar?tabla=departamentos&col1=id_departamento&col2=nombre"

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

// URL DE TU SERVIDOR FLASK PARA OBTENER LOS NIVELES DE ACCESO DISPONIBLES Y LLENAR EL SELECT CORRESPONDIENTE EN EL FORMULARIO DE CREACIÓN/EDICIÓN DE USUARIOS

  const url = LOCALURL+"Select/Consultar?tabla=nivel&col1=id_nivel&col2=nombre"
    
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
 
  // URL DE TU SERVIDOR FLASK PARA OBTENER LAS PREGUNTAS DE SEGURIDAD

  const url = LOCALURL+"Select/Consultar?tabla=tipo_pregunta&col1=id_tipo_pregunta&col2=tipo_pregunta"
    
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

// EVENTO POST PARA CREAR UN NUEVO USUARIO

$(document).on("click", "#Crear", function () {

    if ($("#formUsuario").valid()) {

        const config = {
            UrlControl: LOCALURL+"UsuarioData/Crear",
            Formulario: document.getElementById("formUsuario"),
            Method: "POST",
        };

        methodSend(config, function(params) {
            consultarUsuarios();
            $("#UsuarioModal").modal("hide");
        });
    }
  
});

// EVENTO PUT PARA ACTIVAR/DESACTIVAR USUARIOS

$(document).on("click", ".Toggle", function (event) {
    const id = $(this).data("unico");
    const statusActual = $(this).data("status");

    const nuevoStatus = (statusActual == "1") ? "0" : "1";

    const datosManuales = new FormData();
    datosManuales.append("id_usuario", id);
    datosManuales.append("status", nuevoStatus);
    const envio = {
        UrlControl: LOCALURL+"Usuario/Toggle", // Endpoint sugerido para status
        Formulario: datosManuales,
        Method: "PUT"
    }
 
    methodSend(envio,  function (params) {
      consultarUsuarios
    });

})

// EVENTO PUT PARA EDITAR UN USUARIO (LLENA EL FORMULARIO CON LOS DATOS SELECCIONADOS)

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

// CAMBIAR EL BOTÓN DE CREAR A EDITAR Y SU FUNCIONALIDAD

    $("#Crear").text("Editar").removeClass("btn-primary")
    .addClass("btn-warning").off("click").on("click", function() {
        if ($("#formUsuario").valid()) {
                const config = {
                    UrlControl: LOCALURL+"Usuario/Editar",
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
    
// ABRI EL MODAL LOCALMENTE PARA QUE SE VEA EL CAMBIO DE DATOS ANTES DE ENVIAR AL SERVIDOR

    $("#UsuarioModal").modal("show");  
});

$(document).ready(function () {

    consultarUsuarios()
    setTimeout(SelectDepartamento, 100);
    setTimeout(SelectPreguntas, 200);
    setTimeout(SelectNivel, 300);
 
    const $form = $("#formUsuario");
    if ($form.length) {
        $form.validate({
        rules: {
            cedula: {
                number:true,
                required: true,
                minlength: 7,
                maxlength: 12,
            },
            firstName: { 
                number:false,
                required: true, 
                minlength: 3 
            },
            lastName: { 
                number:false,
                required: true, 
                minlength: 3 
            },
            email: {
                required: true,
                email: true,
                usuarioUnico: true 
            },
            numerocel: { 
                required: true,
                minlength: 11 
            },
            fechan: { 
                required: true,
                fecha: true
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
            
// VALIDACION DE CONTRASEÑA Y CONFIRMAR CONTRASEÑA

            contraseña: { 
                required: true, 
                minlength: 6 
            },
            confirmarcontraseña: { 
                required: true, 
                equalTo: "#contraseña" 
            },
            
// SELECT DINAMICO DE NIVELES Y DEPARTAMENTOS
            nivel: { 
                required: true 
            },
            departamento: { 
                required: true 
            },
            
// PREGUNTAS DE SEGURIDAD
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
            
// RESPUESTAS DE SEGURIDAD
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

    // MENSAJES DE ERROR PERSONALIZADOS PARA CADA CAMPO DEL FORMULARIO
    
        messages: {
            cedula: {
                required: "La cédula de identidad es obligatoria.",
                minlength: "La cédula debe tener al menos 7 dígitos.",
                maxlength: "La cédula no puede exceder los 12 caracteres.",
                number: "La cédula debe contener solo números.",
                usuarioUnico: "Esta cédula ya está registrada en el sistema."
            },
            firstName: {
                number: "El nombre no puede contener números.",
                required: "Por favor, ingrese sus nombres.",
                minlength: "El nombre debe tener al menos 3 caracteres."
            },
            lastName: {
                number: "El apellido no puede contener números.",
                required: "Por favor, ingrese sus apellidos.",
                minlength: "El apellido debe tener al menos 3 caracteres."
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

// MENSAJES PARA LAS PREGUNTAS DE SEGURIDAD

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

// MENSAJE PARA LAS RESPUESTAS DE SEGURIDAD
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

 // REGLA PERSONALIZADA PARA VALIDAR QUE LAS RESPUESTAS DE SEGURIDAD SEAN DIFERENTES ENTRE SÍ

    $.validator.addMethod("distintasRespuestas", function(value, element) {
        let respuestas = [];
        let repetida = false;

// EVALUAMOS LOS 3 INPUTS DE RESPUESTAS (USANDO SUS IDS)

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

 // BUSCAMOS LOS 3 SELECTS DE PREGUNTAS (USANDO SUS IDS) Y VERIFICAMOS QUE NO SE REPITA EL VALOR SELECCIONADO

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