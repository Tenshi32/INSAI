// Evento GET para Consulta
function consultarObjetivos() {
 
  let url = LOCALURL+"CabeceraData/Consultar"

  let contenido = "";

  receptor = document.getElementById("tablaPOA")

  MethodGet(url, function(lista) {

    lista.forEach(item => {

      let estadoBadge = (item.status !== "0") 
          ? '<span class="badge bg-label-primary me-1">Activo</span>' 
          : '<span class="badge bg-label-danger me-1">Inactivo</span>';

      let textoAccion = (item.status !== "0") ? 'Desactivar' : 'Activar';

      contenido += `
          <tr>
              <td>${item.id_cabecera}</td>
              <td><span class="fw-bold">${item.proyecto}</span></td>
              <td><span class="badge bg-label-info">${item.sector}</span></td>
              <td>${item.objetivos}</td>
              <td>${estadoBadge}</td>
              <td>
                  <div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item Editar" 
                         style="cursor:pointer;"
                         data-id="${item.id_cabecera}"
                         data-proyecto="${item.proyecto}" 
                         data-sector="${item.sector}"
                         data-objetivos="${item.objetivos}"
                         <i class="bx bx-edit-alt me-1"></i> Editar
                      </a>
                      <a class="dropdown-item Toggle" 
                         data-unico="${item.id_cabecera}" 
                         data-status="${item.status}">
                         <i class='bx bx-toggle-big-right me-1'></i> ${textoAccion}
                      </a>
                    </div>
                  </div>
              </td>
          </tr>
      `;

    })

    const form = document.getElementById("formObjetivo");
    if(form) form.reset();
    
    receptor.innerHTML = contenido;
  })

}

function SelectTipoPoa() {
  // 1. URL de tu servidor Flask
  const url = LOCALURL+"Select/Consultar?tabla=tipo_poa&col1=id_tipo_poa&col2=nombre"

  let contenido = "";

  const receptor = document.getElementById("tipo_poa")

  MethodGet(url, function(lista) {

    let contenido = "<option value=''>seleccione una opción</option> ";

    lista.forEach(item => {

        contenido += `
                <option value='${item.id_tipo_poa}'>#${item.id_tipo_poa}: ${item.nombre}</option>
                `;

    })
    
    receptor.innerHTML = contenido;

  })

}

function GetLineamiento() {
  // 1. URL de tu servidor Flask
  const url = LOCALURL+"Lineamiento/Buscar"

  MethodGet(url, function(lista) {

    $("#id_lineamiento").val(lista[2])
    $("#id_departamento").val(sessionStorage.getItem('id_departamento'))
    $("#id_usuario").val(sessionStorage.getItem('id_usuario'))

  })

}
 
// Evento POST para crear
$(document).on("click", "#Crear", function () {

    if ($("#formObjetivo").valid()) {

      const FormnDepa = {
        UrlControl: LOCALURL+"CabeceraData/Crear",
        Formulario: document.getElementById("formObjetivo"),
        Method: "POST",
      };

      methodSend(FormnDepa, function (params) {
        consultarObjetivos
        $("#ObjetivoModal").modal("hide"); 
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
    datosManuales.append("id_departamento", id);
    datosManuales.append("status", nuevoStatus);

      const FormnDepa = {
        UrlControl: LOCALURL+"Comunicatorio/Toggle",
        Formulario: datosManuales,
        Method: "PUT",
      };

      methodSend(FormnDepa, function (params) {
        
        consultarObjetivos

      });

})

// Evento PUT para edición 
$(document).on("click", ".Editar", function (event) {

    // 1. Obtener datos del atributo data-
    const d = $(this).data();

    // 2. Llenar los campos del formulario
    $("#created").val(d.id);
    $("#codigo").val(d.codigo);
    $("#nombre").val(d.nombre);
    $("#ubicacion").val(d.ubicacion);
    $("#descripcion").val(d.descripcion);

    // 3. Cambiar el botón "Enviar" para que sea de "Editar"
    $("#Crear").text("Editar").removeClass("btn-primary")
    .addClass("btn-warning").off("click") .on("click", function() {

      if ($("#formObjetivo").valid()) {

        const FormnDepa = {
          UrlControl: LOCALURL+"Comunicatorio/Editar",
          Formulario: document.getElementById("formObjetivo"),
          Method: "PUT",
        };
      
        methodSend(FormnDepa, function (params) {
          consultarObjetivos
          $("#ObjetivoModal").modal("hide"); 
          $("#Crear").text("Enviar").removeClass("btn-warning").addClass("btn-primary").attr('data-action','create');
        });
              
      }

    });
          
  // 4. Abrir el modal manualmente
  $("#ComunicatorioModal").modal("show");
          
});
 
$(document).ready(function () {

  consultarObjetivos()
  SelectTipoPoa()
  GetLineamiento()
  
  // Validación del formulario
  const $form = $("#formObjetivo");
  if ($form.length) {
    $form.validate({
      // Reglas de validación
      rules: {
    proyecto: {
      required: true,
      minlength: 5
    },
    enfoque_estrategico: {
      required: true
    },
    sector: {
      required: true
    },
    objetivos: {
      required: true,
      minlength: 10,
      maxlength: 500
    },
    actividad: {
      required: true
    },
    tipo_poa: {
      required: true
    }
      },
    
      // Mensajes personalizados
      messages: {
    proyecto: {
      required: "El nombre del proyecto es obligatorio",
      minlength: "El nombre debe tener al menos 5 caracteres"
    },
    enfoque_estrategico: {
      required: "Ingrese el enfoque estratégico"
    },
    sector: {
      required: "El sector es obligatorio"
    },
    objetivos: {
      required: "Debe describir el objetivo específico",
      minlength: "El objetivo debe tener al menos 10 caracteres",
      maxlength: "No puede exceder los 500 caracteres"
    },
    actividad: {
      required: "La actividad principal es obligatoria"
    },
    tipo_poa: {
      required: "Seleccione un tipo de POA"
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
  }
});