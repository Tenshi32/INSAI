
// Función para consultar departamentos y llenar la tabla
function consultarDepartamentos() {
    // 1. URL de tu servidor Flask (ajusta el puerto si es 5000 o 5500)
    const url = "http://127.0.0.1:5000/Departamento";

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
        let estado = '';
        let accion = '';

        // Convertimos el objeto { "0": {...} } en un array [ {...} ]
        const listaDepartamentos = Object.values(data);

        // 3. Recorremos los datos que vienen de la base de datos
        listaDepartamentos.forEach(item => {

          if (item.status !== "0") {
              estado = '<span class="badge bg-label-primary me-1">Active</span>';
              accion = 'Desactivar';
          } else {
              estado = '<span class="badge bg-label-danger me-1">Inactive</span>';
              accion = 'Activar';
          }

            contenido += `
                <tr>
                    <td>${item.id_departamento}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>${estado}</td>
                    <td>
                        <div class="dropdown">
                          <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="bx bx-dots-vertical-rounded"></i>
                          </button>
                          <div class="dropdown-menu">
                            <a class="dropdown-item Editar" 
                               style="cursor:pointer;"
                               data-id="${item.id_departamento}"
                               data-codigo="${item.id_departamento}" 
                               data-nombre="${item.nombre}"
                               data-ubicacion="${item.ubicacion}"
                               data-descripcion="${item.descripcion}">
                               <i class="bx bx-edit-alt me-1"></i> Editar
                            </a>
                            <a class="dropdown-item Toggle" data-unico="${item.id_departamento}" data-status="${item.status}"><i class='bx  bx-toggle-big-right me-1'></i> ${accion}</a>
                          </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        // 4. Inyectamos las filas nuevas en la tabla
        tabla.innerHTML = contenido;
        document.getElementById("formDepartamento").reset();
    })
    .catch(error => {
        console.error("Hubo un problema con la consulta:", error);
    });
}

$(document).ready(function () {

  consultarDepartamentos()
  // Validación del formulario de departamento
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

  // Evento para crear departamento
  $("#Crear").click(function () {

    if ($("#formDepartamento").valid()) {

      const FormnDepa = {
        UrlControl: "http://127.0.0.1:5000/Departamento",
        Formulario: document.getElementById("formDepartamento"),
        Method: "POST",
      };

      methodSend(FormnDepa, consultarDepartamentos);
      
    }
    
  });


});
// Evento para activar/desactivar departamento
$(document).on("click", ".Toggle", function (event) {
  
    const id = $(this).data("unico");
    const statusActual = $(this).data("status");
  
    // Calculamos el nuevo estado (si es 1 pasa a 0, si es 0 pasa a 1)
    const nuevoStatus = (statusActual == "1") ? "0" : "1";

    // Creamos el contenedor de datos manual
    const datosManuales = new FormData();
    datosManuales.append("id_departamento", id);
    datosManuales.append("status", nuevoStatus);

      const FormnDepa = {
        UrlControl: "http://127.0.0.1:5000/Departamento",
        Formulario: datosManuales,
        Method: "DELETE",
      };

      methodSend(FormnDepa, consultarDepartamentos);

})

// Evento para llenar el formulario de edición
$(document).on("click", ".Editar", function (event) {

    // 1. Obtener datos del atributo data-
    const id = $(this).data("id");
    const codigo = $(this).data("codigo");
    const nombre = $(this).data("nombre");
    const ubicacion = $(this).data("ubicacion");
    const descripcion = $(this).data("descripcion");

    // 2. Llenar los campos del formulario
    $("#created").val(id); // Usamos el input hidden para el ID
    $("#codigo").val(codigo);
    $("#nombre").val(nombre);
    $("#ubicacion").val(ubicacion);
    $("#descripcion").val(descripcion);

    // 3. Cambiar el botón "Enviar" para que sea de "Editar"
    $("#Crear")
        .text("Editar")
        .removeClass("btn-primary")
        .addClass("btn-warning")
        .off("click") 
        // Quitamos eventos anteriores
        .on("click", function() {

            if ($("#formDepartamento").valid()) {

              const FormnDepa = {
                UrlControl: "http://127.0.0.1:5000/Departamento",
                Formulario: document.getElementById("formDepartamento"),
                Method: "PUT",
              };
            
              methodSend(FormnDepa, consultarDepartamentos);
              
            }

          });
          
          // 4. Abrir el modal manualmente (si no se abre solo por el dropdown)
          $("#DepartamentoModal").modal("show"); 
});