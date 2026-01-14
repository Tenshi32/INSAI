
// Función para consultar departamentos y llenar la tabla
function consultarComunicatorios() {
    // 1. URL de tu servidor Flask
    const url = "http://localhost:5000/Comunicatorio/Consultar";

    fetch(url, {
        method: "GET", 
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la red");
        return response.json(); 
    })
    .then(data => {
        const tabla = document.getElementById("tablaComunicatorios");
        let contenido = "";

        // Convertimos el objeto en array
        const listaComunicatorios = Object.values(data);

        listaComunicatorios.forEach(item => {
            // Manejo de estados (Activo/Inactivo)
            let estadoBadge = (item.status !== "0") 
                ? '<span class="badge bg-label-primary me-1">Activo</span>' 
                : '<span class="badge bg-label-danger me-1">Inactivo</span>';
            
            let textoAccion = (item.status !== "0") ? 'Desactivar' : 'Activar';

            contenido += `
                <tr>
                    <td>${item.id_comunicatorio}</td>
                    <td><span class="fw-bold">${item.tipo}</span></td>
                    <td><span class="badge bg-label-info">${item.prioridad}</span></td>
                    <td>${item.departamento}</td>
                    <td>${estadoBadge}</td>
                    <td>
                        <div class="dropdown">
                          <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="bx bx-dots-vertical-rounded"></i>
                          </button>
                          <div class="dropdown-menu">
                            <a class="dropdown-item Editar" 
                               style="cursor:pointer;"
                               data-id="${item.id_comunicatorio}"
                               data-tipo="${item.tipo}" 
                               data-prioridad="${item.prioridad}"
                               data-departamento="${item.departamento}"
                               data-descripcion="${item.descripcion}">
                               <i class="bx bx-edit-alt me-1"></i> Editar
                            </a>
                            <a class="dropdown-item Toggle" 
                               data-unico="${item.id_comunicatorio}" 
                               data-status="${item.status}">
                               <i class='bx bx-toggle-big-right me-1'></i> ${textoAccion}
                            </a>
                          </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Inyectamos las filas
        tabla.innerHTML = contenido;

        const form = document.getElementById("formComunicatorio");
        if(form) form.reset();

    })
    .catch(error => {
        console.error("Hubo un problema con la consulta:", error);
    });
}

$(document).ready(function () {

  consultarComunicatorios()
  // Validación del formulario de departamento
$("#formComunicatorio").validate({
  // Reglas de validación
  rules: {
    tipo: {
      required: true
    },
    prioridad: {
      required: true
    },
    departamento: {
      required: true
    },
    descripcion: {
      required: true,
      minlength: 10,
      maxlength: 500
    }
  },

  // Mensajes personalizados
  messages: {
    tipo: {
      required: "Por favor, seleccione un tipo"
    },
    prioridad: {
      required: "La prioridad es obligatoria"
    },
    departamento: {
      required: "Debe asignar un departamento"
    },
    descripcion: {
      required: "Debe ingresar una descripción",
      minlength: "La descripción debe tener al menos 10 caracteres",
      maxlength: "No puede exceder los 500 caracteres"
    }
  },

  // Ubicación del mensaje de error para que no mueva el diseño
  errorElement: 'span',
  errorPlacement: function (error, element) {
    error.addClass('invalid-feedback');
    element.closest('.form-group').append(error);
  },
  highlight: function (element, errorClass, validClass) {
    $(element).addClass('is-invalid');
  },
  unhighlight: function (element, errorClass, validClass) {
    $(element).removeClass('is-invalid');
  }
});

  // Evento para crear departamento
  $("#Crear").click(function () {

    if ($("#formComunicatorio").valid()) {

      const FormnDepa = {
        UrlControl: "http://127.0.0.1:5000/Comunicatorio/Crear",
        Formulario: document.getElementById("formComunicatorio"),
        Method: "POST",
      };

      methodSend(FormnDepa, consultarComunicatorios);
      
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
        UrlControl: "http://127.0.0.1:5000/Comunicatorio/Toggle",
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
                UrlControl: "http://127.0.0.1:5000/Comunicatorio/Editar",
                Formulario: document.getElementById("formDepartamento"),
                Method: "PUT",
              };
            
              methodSend(FormnDepa, consultarDepartamentos);
              
            }

          });
          
          // 4. Abrir el modal manualmente (si no se abre solo por el dropdown)
          $("#ComunicatorioModal").modal("show"); 
});