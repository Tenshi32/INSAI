
$(document).ready(function () {

  $("#formDepartamento").validate({
    //Reglas/Validaciones
    rules: {
      //Datos del Departamento
      codigo: {
        required: true,
        number: true,
        minlength: 5,
        maxlength: 15,
      },
      nombre: {
        required: true,
        minlength: 5,
        maxlength: 25,
      },
      jefe: {
        required: true,
      },
      ubicacion: {
        required: true,
        minlength: 5,
        maxlength: 25,
      },
      descripcion: {
        required: true,
        minlength: 5,
        maxlength: 100,
      },

    },

    //Mensages de validaciones
    messages: {

      codigo: {
        required: "Campo Obligatorio",
        number: "Solo se permiten números",
        minlength: "Cantidad mínima es de 5 caracteres",
        maxlength: "Cantidad máxima es de 15 caracteres",
      },

      nombre: {
        required: "Campo Obligatorio",
        minlength: "Cantidad mínima es de 5 caracteres",
        maxlength: "Cantidad máxima es de 25 caracteres",
      },
      jefe: {
        required: "Campo Obligatorio",
      },
      ubicacion: {
        required: "Campo Obligatorio",
        minlength: "Cantidad mínima es de 5 caracteres",
        maxlength: "Cantidad máxima es de 25 caracteres",
      },
      descripcion: {
        required: "Campo Obligatorio",
        minlength: "Cantidad mínima es de 5 caracteres",
        maxlength: "Cantidad máxima es de 100 caracteres",
      },

    },

    errorElement: "span",
    errorPlacement: function (error, element) {
      error.addClass("invalid-feedback");
      element.closest(".form-group").append(error);
    },

    highlight: function (element, errorClass, validClass) {
      $(element).addClass("is-invalid");
    },

    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass("is-invalid");
      $(element).addClass("is-valid");
    },
  });

  $("#Enviar").click(function () {

    if ($("#formDepartamento").valid()) {

      const FormnDepa = {
        UrlControl: "http://127.0.0.1:5000/CreateDepartamento",
        Formulario: document.getElementById("formDepartamento"),
      };

      methodSend(FormnDepa);
    }

  });

});


function consultarDepartamentos() {
    // 1. URL de tu servidor Flask (ajusta el puerto si es 5000 o 5500)
    const url = "http://127.0.0.1:5000/GetDepartamentos";

    fetch(url, {
        method: "GET", // Para consultar siempre usamos GET
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la red");
        return response.json(); // Convertimos la respuesta de Python a JSON
    })
    .then(data => {
        // 2. Referencia al cuerpo de tu tabla
        const tabla = document.getElementById("tablaDepartamentos");
        let contenido = "";

        // 3. Recorremos los datos que vienen de la base de datos
        data.forEach(item => {
            contenido += `
                <tr>
                    <td>${item.id_departamento}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editar(${item.id_departamento})">
                            <i class="bx bx-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        // 4. Inyectamos las filas nuevas en la tabla
        tabla.innerHTML = contenido;
    })
    .catch(error => {
        console.error("Hubo un problema con la consulta:", error);
    });
}