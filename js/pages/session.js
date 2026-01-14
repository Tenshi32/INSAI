// Función para el POST (Crear)
$("#IniciarSession").on("click", function () {

  if ($("#formAuthentication").valid()) {
    const config = {
        UrlControl: "http://localhost:5000/UsuarioData/Login",
        Formulario: document.getElementById("formAuthentication"),
        Method: "POST",
    };

    methodSendLogin(config, function(data) {

        sessionStorage.setItem('usuario_nombre', data.datos.usuario_nombre);
        sessionStorage.setItem('usuario_id', data.datos.usuario_id);
        
        window.location.href = "../private/index.html";
    });
  }

});

$("#CerrarSession").on("click", function () {

    const config = {
        UrlControl: "http://localhost:5000/UsuarioData/Logout",
        Formulario: document.getElementById("formAuthentication"),
        Method: "POST",
    };

    methodSend(config, function() {
    });
  
});

$(document).ready(function () {
    if (sessionStorage.getItem('usuario_nombre')) {
        window.location.href = "../private/index.html";
    }

   if ($("#formAuthentication").length) {

        // Validación del formulario
        $("#formAuthentication").validate({
        // --- REGLAS DE VALIDACIÓN ---
        rules: {
            email_username: {
                required: true,
                minlength: 7,
                maxlength: 20
            },
            password: {
                required: true,
                minlength: 2,
                maxlength: 50
            }
        },

        // --- MENSAJES PERSONALIZADOS ---
        messages: {
            email_username: {
                required: "La cédula es obligatoria",
                minlength: "La cédula debe tener al menos 7 dígitos",
                maxlength: "La cédula no debe exceder los 20 caracteres"
            },
            password: {
                required: "El nombre es obligatorio",
                minlength: "Mínimo 2 caracteres",
                maxlength: "Máximo 50 caracteres"
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
    }
});