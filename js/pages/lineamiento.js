// EVENTO GET PARA CONSULTAR LOS LINEAMIENTOS

function consultarLineamientos() {

 // URL DE TU SERVIDOR FLASK PARA OBTENER LOS LINEAMIENTOS

  let url = LOCALURL+"Lineamiento/Consultar"
  let contenido = "";
  receptor = document.getElementById("tablaLineamientos")
  MethodGet(url, function(lista) {

    lista.forEach(item => {

// MANEJO DE ESTADOS ACTIVO/INACTIVO

    let estadoBadge = (item.statu !== "0")
     ? '<span class="badge bg-label-primary me-1">Activo</span>'
     : '<span class="badge bg-label-danger me-1">Inactivo</span>';

      let textoAccion = (item.statu !== "0") ? 'Desactivar' : 'Activar';

// COVERTIMOS EL SRING DE FECHA A OBJETO DE FECHA PARA FORMATEARLO
      
      const fechaI = new Date(item.fecha_inicio);
      const fechaF = new Date(item.fecha_final);

// FOTMATEAMOS LA FECHA A UN FORMATO LEGIBLE Y EN ESPAÑOL

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

// EVENTO POST PARA CREAR UN NUEVO LINEAMIENTO

$(document).on("click", "#Crear", function () {

  if ($("#formLineamineto").valid()) {

    const FormnDepa = {
      UrlControl: LOCALURL+"Lineamiento/Crear",
      Formulario: document.getElementById("formLineamineto"),
      Method: "POST",
    };

    methodSend(FormnDepa, function (params) {
      consultarLineamientos
      $("#LineamientoModal").modal("hide"); 
    });
    
  }
  
});

// EVENTO PUT PARA ACTIVAR UN LINEAMIENTO

$(document).on("click", ".Toggle", function (event) {
  
    const id = $(this).data("unico");
    const statusActual = $(this).data("status");
  
// CALCULAMOS EL NUEVO STATUS INVERTIENDO EL ACTUAL (1 -> 0, 0 -> 1)

    const nuevoStatus = (statusActual == "1") ? "0" : "1";

// CREAMOS EL CONTENEDOR DE DATOS PARA ENVIAR EL ID Y EL NUEVO STATUS AL SERVIDOR

    const datosManuales = new FormData();
    datosManuales.append("id_lineamiento", id);
    datosManuales.append("status", nuevoStatus);

    const FormnDepa = {
      UrlControl: LOCALURL+"Lineamiento/Toggle",
      Formulario: datosManuales,
      Method: "PUT",
    };

    methodSend(FormnDepa,function (params) {            
      consultarLineamientos    
    });

})

// EVENTO PUT PARA EDITAR UN LINEAMIENTO

$(document).on("click", ".Editar", function (event) {

// OBTENER LOS DATOS DEL ELEMENTO SELECCIONADO PARA EDITAR

    const d = $(this).data();

// LLENAR LOS CAMPOS DEL FORMULARIO CON LOS DATOS OBTENIDOS

    $("#created").val(d.id); // Usamos el input hidden para el ID
    $("#codigo").val(d.codigo);
    $("#nombre").val(d.nombre);
    $("#ubicacion").val(d.ubicacion);
    $("#descripcion").val(d.descripcion);

 // 3. CAMBIAR EL BOTÓN DE ENVÍO PARA QUE REALICE LA ACCIÓN DE EDICIÓN EN LUGAR DE CREACIÓN
    
 $("#Crear").text("Editar").removeClass("btn-primary")
 .addClass("btn-warning").off("click").on("click", function() {

 if ($("#formLineamineto").valid()) {

        const FormnDepa = {
          UrlControl: LOCALURL+"Lineamiento/Editar",
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
          
   // MOSTRAR EL MODAL CON LOS DATOS CARGADOS PARA EDITAR

    $("#LineamientoModal").modal("show"); 
});

$(document).ready(function () {

  consultarLineamientos()

  const anioActual = new Date().getFullYear();
  $("#anno").val(anioActual);
  $("#anno").attr("placeholder", anioActual);
  
  // VALIDACIÓN DEL FORMULARIO DE LINEAMIENTO CON REGLAS Y MENSAJES PERSONALIZADOS

  $("#formLineamineto").validate({

 // REGLAS DE VALIDACIÓN PARA CADA CAMPO DEL FORMULARIO DE LINEAMIENTO

  rules: {
    fecha_inicio: { 
      required: true 
    },
    anno: { 
      required: true,
    },
    fecha_cierre: { 
      required: true 
    },
    metas_alcanzar: { 
      required: true, 
      minlength: 10, 
      maxlength: 200
    },
    normas_legales: { 
      required: true, 
      minlength: 10, 
      maxlength: 200
    },
    enfoque_estrategico: { 
      required: true, 
      minlength: 10, 
      maxlength: 200
    },
    lineamientos: { 
      required: true, 
      minlength: 10, 
      maxlength: 400
    }
  },

  // MENSAJES DE ERROR PERSONALIZADOS PARA CADA REGLA DE VALIDACIÓN

  messages: {
    fecha_inicio: { 
      required: "Por favor, indique la fecha de inicio" 
    },
    anno: { 
      required: "Indique el año del lineamiento",
    },
    fecha_cierre: { 
      required: "Por favor, indique la fecha de cierre" 
    },
    normas_legales: { 
      required: "Ingrese las normas legales", 
      minlength: "Al menos 10 caracteres",
      maxlength: "No más de 200 caracteres"
    },
    metas_alcanzar: { 
      required: "Ingrese el enfoque estratégico", 
      minlength: "Al menos 10 caracteres",
      maxlength: "No más de 200 caracteres"
    },
    enfoque_estrategico: { 
      required: "Ingrese el enfoque estratégico", 
      minlength: "Al menos 10 caracteres",
      maxlength: "No más de 200 caracteres"
    },
    lineamientos: { 
      required: "Ingrese los lineamientos", 
      minlength: "Al menos 10 caracteres",
      maxlength: "No más de 400 caracteres"
    }
  },

  // UBICACIÓN DE LOS MENSAJES DE ERROR Y CLASES DE ESTILO PARA LOS CAMPOS CON ERRORES
  
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