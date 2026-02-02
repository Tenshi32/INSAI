// Evento GET para Consulta 
function consultarLineamientos() {
  // 1. URL de tu servidor Flask
  let url = "http://localhost:5000/Lineamiento/Consultar"

  let contenido = "";

  receptor = document.getElementById("tablaLineamientos")

  MethodGet(url, function(lista) {

    lista.forEach(item => {
      // Manejo de estados (Activo/Inactivo)
      let estadoBadge = (item.statu !== "0")
          ? '<span class="badge bg-label-primary me-1">Activo</span>'
          : '<span class="badge bg-label-danger me-1">Inactivo</span>';

      let textoAccion = (item.statu !== "0") ? 'Desactivar' : 'Activar';

      // 1. Convertimos el string raro a un objeto Date de JS
      const fechaI = new Date(item.fecha_inicio);
      const fechaF = new Date(item.fecha_final);

      // 2. Formateamos a estilo latino (día/mes/año)
      item.fecha_inicio = fechaI.toLocaleDateString('es-ES');
      item.fecha_final = fechaF.toLocaleDateString('es-ES');

      contenido += `
          <tr>
              <td>${item.id_lineamiento}</td>
              <td>${item.rango}</td>
              <td>${item.fecha_inicio} - ${item.fecha_final}</td>
              <td>${estadoBadge}</td>
              <td>
                  <div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item Editar" 
                         style="cursor:pointer;"
                         data-id="${item.id_lineamiento}"
                         data-fecha_inicio="${item.fecha_inicio}"
                         data-rango="${item.rango}"
                         data-fecha_cierre="${item.fecha_final}"
                         data-normas_legales="${encodeURIComponent(item.normas_legales)}"
                         data-enfoque_estrategico="${encodeURIComponent(item.enfoque_estrategico)}"
                         data-lineamientos="${encodeURIComponent(item.lineamientos)}"
                         data-status="${item.statu}">
                         <i class="bx bx-edit-alt me-1"></i> Editar
                      </a>
                      <a class="dropdown-item Toggle" 
                         data-unico="${item.id_lineamiento}" 
                         data-status="${item.statu}">
                         <i class='bx bx-toggle-big-right me-1'></i> ${textoAccion}
                      </a>
                    </div>
                  </div>
              </td>
          </tr>
      `;

    })

    const form = document.getElementById("formLineamineto"); 
    if(form) form.reset();
    
    receptor.innerHTML = contenido;
  })

}

// Evento POST para crear
$(document).on("click", "#Crear", function () {

  if ($("#formLineamineto").valid()) {

    const FormnDepa = {
      UrlControl: "http://localhost:5000/Lineamiento/Crear",
      Formulario: document.getElementById("formLineamineto"),
      Method: "POST",
    };

    methodSend(FormnDepa, function (params) {
      consultarLineamientos
      $("#LineamientoModal").modal("hide"); 
    });
    
  }
  
});

// Evento PUT para activar/desactivar 
$(document).on("click", ".Toggle", function (event) {
  
    const id = $(this).data("unico");
    const statusActual = $(this).data("status");
  
    // Calculamos el nuevo estado (si es 1 pasa a 0, si es 0 pasa a 1)
    const nuevoStatus = (statusActual == "1") ? "0" : "1";

    // Creamos el contenedor de datos manual
    const datosManuales = new FormData();
    datosManuales.append("id_lineamiento", id);
    datosManuales.append("status", nuevoStatus);

    const FormnDepa = {
      UrlControl: "http://localhost:5000/Lineamiento/Toggle",
      Formulario: datosManuales,
      Method: "PUT",
    };

    methodSend(FormnDepa,function (params) {            
      consultarLineamientos    
    });

})

// Evento PUT para edición 
$(document).on("click", ".Editar", function (event) {

    // 1. Obtener datos del atributo data-
    const d = $(this).data();

    // 2. Llenar los campos del formulario
    $("#created").val(d.id); // Usamos el input hidden para el ID
    $("#codigo").val(d.codigo);
    $("#nombre").val(d.nombre);
    $("#ubicacion").val(d.ubicacion);
    $("#descripcion").val(d.descripcion);

    // 3. Cambiar el botón "Enviar" para que sea de "Editar"
    $("#Crear").text("Editar").removeClass("btn-primary")
    .addClass("btn-warning").off("click").on("click", function() {

      if ($("#formLineamineto").valid()) {

        const FormnDepa = {
          UrlControl: "http://localhost:5000/Lineamiento/Editar",
          Formulario: document.getElementById("formLineamineto"),
          Method: "PUT",
        };
            
        methodSend(FormnDepa, function (params) {
          consultarLineamientos
          $("#LineamientoModal").modal("hide"); 
          $("#Crear").text("Enviar").removeClass("btn-warning").addClass("btn-primary").attr('data-action','create');
        });
          
      }

    });
          
    // 4. Abrir el modal manualmente
    $("#LineamientoModal").modal("show"); 
});

$(document).ready(function () {

  consultarLineamientos()

  // Validación del formulario
  $("#formLineamineto").validate({
  // Reglas de validación
  rules: {
    fecha_inicio: { 
      required: true 
    },
    rango: { 
      required: true, 
      minlength: 2 
    },
    fecha_cierre: { 
      required: true 
    },
    normas_legales: { 
      required: true, 
      minlength: 10, 
      maxlength: 2000 
    },
    enfoque_estrategico: { 
      required: true, 
      minlength: 10, 
      maxlength: 2000 
    },
    lineamientos: { 
      required: true, 
      minlength: 10, 
      maxlength: 4000 
    }
  },

  // Mensajes personalizados
  messages: {
    fecha_inicio: { 
      required: "Por favor, indique la fecha de inicio" 
    },
    rango: { 
      required: "Indique el rango", 
      minlength: "El rango es muy corto" 
    },
    fecha_cierre: { 
      required: "Por favor, indique la fecha de cierre" 
    },
    normas_legales: { 
      required: "Ingrese las normas legales", 
      minlength: "Al menos 10 caracteres" 
    },
    enfoque_estrategico: { 
      required: "Ingrese el enfoque estratégico", 
      minlength: "Al menos 10 caracteres" 
    },
    lineamientos: { 
      required: "Ingrese los lineamientos", 
      minlength: "Al menos 10 caracteres" 
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
    $(element).addClass('is-valid');
  }
  });

});