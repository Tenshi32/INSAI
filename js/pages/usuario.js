// Función para consultar Usuarios y llenar la tabla
function consultarUsuarios() {
    const url = "http://localhost:5000/Usuario/Consultar"; // Ajusta a tu endpoint de Usuario

    fetch(url, { method: "GET" })
    .then(response => {
        if (!response.ok) throw new Error("Error en la red");
        return response.json();
    })
    .then(data => {
        const tabla = document.getElementById("tablaUsuario"); // Asegúrate que este ID exista en tu HTML
        let contenido = "";
        const lista = Object.values(data);

        lista.forEach(item => {
            let estado = (item.statu !== "0") 
                ? '<span class="badge bg-label-primary me-1">Activo</span>' 
                : '<span class="badge bg-label-danger me-1">Inactivo</span>';
            let accion = (item.statu !== "0") ? 'Desactivar' : 'Activar';

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
        });
        tabla.innerHTML = contenido;
    })
    .catch(error => console.error("Error:", error));
}

//Carga de la foto de perfil
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
//Reset de la foto de perfil
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

$(document).ready(function () {

    consultarUsuarios();

    // Función para el POST (Crear)
    $("#Crear").on("click", function () {

      if ($("#formUsuario").valid()) {
        const config = {
            UrlControl: "http://localhost:5000/Usuario/Crear",
            Formulario: document.getElementById("formUsuario"),
            Method: "POST",
        };

        methodSend(config, function() {
            consultarUsuarios();
            $("#UsuarioModal").modal("hide");
            document.getElementById("formUsuario").reset();
        });
      }

    });

    // Validación del formulario
    $("#formUsuario").validate({
    // --- REGLAS DE VALIDACIÓN ---
    rules: {
        cedula: {
            required: true,
            minlength: 7,
            maxlength: 12
        },
        firstName: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        lastName: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        email: {
            required: true,
            email: true
        },
        numerocel: {
            required: true,
            minlength: 11 // Ejemplo: 04128887766
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
        estado: {
            required: true
        }
    },

    // --- MENSAJES PERSONALIZADOS ---
    messages: {
        cedula: {
            required: "La cédula es obligatoria",
            minlength: "La cédula debe tener al menos 7 dígitos",
            maxlength: "La cédula no debe exceder los 12 caracteres"
        },
        firstName: {
            required: "El nombre es obligatorio",
            minlength: "Mínimo 2 caracteres",
            maxlength: "Máximo 50 caracteres"
        },
        lastName: {
            required: "El apellido es obligatorio",
            minlength: "Mínimo 2 caracteres",
            maxlength: "Máximo 50 caracteres"
        },
        email: {
            required: "El correo es indispensable",
            email: "Ingrese un formato de correo válido (ejemplo@correo.com)"
        },
        numerocel: {
            required: "El número de teléfono es obligatorio",
            minlength: "Ingrese el número completo (Ej: 04121234567)"
        },
        fechan: {
            required: "Seleccione su fecha de nacimiento"
        },
        direccion: {
            required: "La dirección es necesaria para el registro",
            minlength: "Sea más específico con la dirección (mín. 10 caracteres)"
        },
        profesion: {
            required: "Indique su ocupación o profesión"
        },
        estado: {
            required: "Seleccione un estado de la lista"
        }
    },

    // --- DISEÑO DE ERRORES (BOOTSTRAP 5) ---
    errorElement: "span",
    errorPlacement: function (error, element) {
        error.addClass("invalid-feedback animated fadeIn"); // Animación suave
        // Coloca el mensaje de error después del input dentro del form-group
        element.closest(".form-group").append(error);
    },

    highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
    },

    unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
    }
    });

});

// Evento Editar (Llena el formulario)
$(document).off("click", ".Edit").on("click", ".Edit", function () {
    const d = $(this).data(); // Captura todos los data-attributes

    $("#created").val(d.id);
    $("#cedula").val(d.cedula);
    $("#firstName").val(d.nombre);
    $("#lastName").val(d.apellido);
    $("#email").val(d.email);
    $("#numerocel").val(d.telefono);
    $("#fechan").val(d.fechan);
    $("#direccion").val(d.direccion);

    $("#Crear")
        .text("Editar")
        .removeClass("btn-primary")
        .addClass("btn-warning")
        .off("click")
        .on("click", function() {
            if ($("#formUsuario").valid()) {
                const config = {
                    UrlControl: "http://localhost:5000/Usuario/Editar",
                    Formulario: document.getElementById("formUsuario"),
                    Method: "PUT",
                };

                methodSend(config, function() {
                    consultarUsuarios();
                    $("#UsuarioModal").modal("hide");
                    document.getElementById("formUsuario").reset();
                });

            }
        });

    $("#UsuarioModal").modal("show");
});

// Evento Toggle Status
$(document).off("click", ".Toggle").on("click", ".Toggle", function () {
    const id = $(this).data("unico");
    const nuevoStatus = ($(this).data("status") == "1") ? "0" : "1";

    const datosManuales = new FormData();
    datosManuales.append("id_usuario", id);
    datosManuales.append("status", nuevoStatus);
    const envio = {
        UrlControl: "http://localhost:5000/Usuario/Toggle", // Endpoint sugerido para status
        Formulario: datosManuales,
        Method: "PUT"
    }

    methodSend(envio, consultarUsuarios);

});