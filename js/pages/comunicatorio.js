// Evento GET para Consulta
function consultarComunicatorios() {
  // 1. URL de tu servidor Flask
  const url = "http://localhost:5000/Comunicatorio/Consultar"

  let contenido = "";

  receptor = document.getElementById("tablaComunicatorios")

  MethodGet(url, function(lista) {

    let contenido = "";

    lista.forEach(item => {

      let estadoBadge = (item.status !== "0") 
          ? '<span class="badge bg-label-primary me-1">Activo</span>' 
          : '<span class="badge bg-label-danger me-1">Inactivo</span>';

      let textoAccion = (item.status !== "0") ? 'Desactivar' : 'Activar';

      contenido += `
          <tr>
              <td>${item.id_comunicatorio}</td>
              <td><span class="fw-bold">${item.tipo}</span></td>
              <td><span class="badge bg-label-info">${item.prioridad}</span></td>
              <td>${item.nombre}</td>
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

    })

    const form = document.getElementById("formComunicatorio");
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

function GetLineamiento() {
  // 1. URL de tu servidor Flask
  const url = "http://localhost:5000/Lineamiento/Buscar"

  MethodGet(url, function(lista) {

    $("#id_lineamiento").val(lista[2])

  })

}
 
// Evento POST para crear
$(document).on("click", "#Crear", function () {

    if ($("#formComunicatorio").valid()) {

      const FormnDepa = {
        UrlControl: "http://127.0.0.1:5000/Comunicatorio/Crear",
        Formulario: document.getElementById("formComunicatorio"),
        Method: "POST",
      };

      methodSend(FormnDepa, function (params) {
        consultarComunicatorios
        $("#ComunicatorioModal").modal("hide"); 
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
        UrlControl: "http://127.0.0.1:5000/Comunicatorio/Toggle",
        Formulario: datosManuales,
        Method: "PUT",
      };

      methodSend(FormnDepa, function (params) {
        
        consultarComunicatorios

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

      if ($("#formDepartamento").valid()) {

        const FormnDepa = {
          UrlControl: "http://127.0.0.1:5000/Comunicatorio/Editar",
          Formulario: document.getElementById("formDepartamento"),
          Method: "PUT",
        };
      
        methodSend(FormnDepa, function (params) {
          consultarComunicatorios
          $("#ComunicatorioModal").modal("hide"); 
          $("#Crear").text("Enviar").removeClass("btn-warning").addClass("btn-primary").attr('data-action','create');
        });
              
      }

    });
          
  // 4. Abrir el modal manualmente
  $("#ComunicatorioModal").modal("show");
          
});
 
$(document).ready(function () {

  consultarComunicatorios()
  SelectDepartamento()
  GetLineamiento()
  // Validación del formulario
  const $form = $("#formComunicatorio");
  if ($form.length) {
    $form.validate({
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
  }
});