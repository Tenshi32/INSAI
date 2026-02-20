// EVENTO GET PARA CONSULTAR Y MOSTRAR LOS OBJETIVOS DE LA UA EN LA TABLA

function consultarObjetivos() {
  let url = LOCALURL + 'CabeceraData/Consultar'

  let contenido = ''

  receptor = document.getElementById('tablaPlanificacion')

  MethodGet(url, function (lista) {
    lista.forEach(item => {

      if (item.statu === '1') {
        sessionStorage.setItem('id_planificacion_activa', item.id_comunicatorio);
      }

      let estadoBadge =
        item.statu !== '3'
          ? item.statu !== '2'
            ? '<span class="badge bg-label-warning me-1">En Espera</span>'
            : '<span class="badge bg-label-success me-1">Aprobada</span>'
          : '<span class="badge bg-label-danger me-1">Negada</span>'

      let textoAccion = item.statu !== '3' ? 'Activar' : 'Desactivar'

      contenido += `
          <tr>
              <td>${item.id_cabecera}</td>
              <td><span class="fw-bold">${item.actividad}</span><br>
              <span class="badge bg-label-info">${item.sector}</span></td>
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
                         data-actividad="${item.actividad}" 
                         data-sector="${item.sector}"
                         data-objetivos="${item.objetivos}"
                         <i class="bx bx-edit-alt me-1"></i> Editar
                      </a>
                      <a class="dropdown-item Toggle" 
                         data-unico="${item.id_cabecera}" 
                         data-status="${item.statu}">
                         <i class='bx bx-toggle-big-right me-1'></i> ${textoAccion}
                      </a>
                    </div>
                  </div>
              </td>
          </tr>
      `
    })

    const form = document.getElementById('formObjetivo')
    if (form) form.reset()

    receptor.innerHTML = contenido
  })
}

function SelectTipoPoa() {
  
  // URL DE TU SERVIDOR FLASK PARA OBTENER LOS TIPOS DE POA DISPONIBLES Y LLENAR EL SELECT CORRESPONDIENTE EN EL FORMULARIO DE CREACIÓN/EDICIÓN DE OBJETIVOS

  const url = LOCALURL + 'Select/Consultar?tabla=tipo_poa&col1=id_tipo_poa&col2=nombre'

  let contenido = ''

  const receptor = document.getElementById('tipo_poa')

  MethodGet(url, function (lista) {
    let contenido = "<option value=''>seleccione una opción</option> "

    lista.forEach(item => {
      contenido += `
                <option value='${item.id_tipo_poa}'>#${item.id_tipo_poa}: ${item.nombre}</option>
                `
    })

    receptor.innerHTML = contenido
  })
}

// EVENTO POST PARA CREAR UN NUEVO OBJETIVO DE LA UA

$(document).on('click', '#Crear', function () {
  if ($('#formObjetivo').valid()) {
    const FormnDepa = {
      UrlControl: LOCALURL + 'CabeceraData/Crear',
      Formulario: document.getElementById('formObjetivo'),
      Method: 'POST'
    }

    methodSend(FormnDepa, function (params) {
      consultarObjetivos
      $('#ObjetivoModal').modal('hide')
    })
  }
})

// EVENTO PUT PARA TOGGLE DE ESTADO

$(document).on('click', '.Toggle', function (event) {
  const id = $(this).data('unico')
  const statusActual = $(this).data('status')

  // CALCULAMOS EL NUEVO STATUS INVERTIENDO EL VALOR ACTUAL (SI ES "1" PASA A "0" Y VICEVERSA)
  const nuevoStatus = statusActual == '1' ? '0' : '1'

  // CREAMOS EL FORMDATA PARA ENVIAR LOS DATOS NECESARIOS AL SERVIDOR ID Y EL NUEVO STATUS

  const datosManuales = new FormData()
  datosManuales.append('id_departamento', id)
  datosManuales.append('status', nuevoStatus)

  const FormnDepa = {
    UrlControl: LOCALURL + 'Comunicatorio/Toggle',
    Formulario: datosManuales,
    Method: 'PUT'
  }

  methodSend(FormnDepa, function (params) {
    consultarObjetivos
  })
})

// EVENTO PUT PARA EDICIÓN

$(document).on('click', '.Editar', function (event) {
  //  OBTENER LOS DATOS DEL ELEMENTO SELECCIONADO A TRAVÉS DE LOS ATRIBUTOS DATA

  const d = $(this).data()

  // LLENAR LOS CAMPOS DEL FORMULARIO CON LOS DATOS OBTENIDOS

  $('#created').val(d.id)
  $('#codigo').val(d.codigo)
  $('#nombre').val(d.nombre)
  $('#ubicacion').val(d.ubicacion)
  $('#descripcion').val(d.descripcion)

  // CAMBIAR EL CAMBIO DE BOTÓN "ENVIAR" PARA QUE SEA DE "EDITAR"

  $('#Crear')
    .text('Editar')
    .removeClass('btn-primary')
    .addClass('btn-warning')
    .off('click')
    .on('click', function () {
      if ($('#formObjetivo').valid()) {
        const FormnDepa = {
          UrlControl: LOCALURL + 'Comunicatorio/Editar',
          Formulario: document.getElementById('formObjetivo'),
          Method: 'PUT'
        }

        methodSend(FormnDepa, function (params) {
          consultarObjetivos
          $('#ObjetivoModal').modal('hide')
          $('#Crear').text('Enviar').removeClass('btn-warning').addClass('btn-primary').attr('data-action', 'create')
        })
      }
    })

  // ABRIR EL MODAL MANUEALMENTE

  $('#ObjetivoModal').modal('show')
})

$(document).ready(function () {
  consultarObjetivos()
  SelectTipoPoa()

   // ESTABLECER EL PLACEHOLDER DEL CAMPO DE AÑO CON EL AÑO ACTUAL 

  const anioActual = new Date().getFullYear();
  $("#anno").val(anioActual);
  $("#anno").attr("placeholder", anioActual);
 
  // VALIDACIÓN DEL FORMULARIO CON JQUERY VALIDATE

  let form = $('#formObjetivo')
  if (form.length) {
    $('#id_lineamiento').attr('value', sessionStorage.getItem('id_lineamiento'))
    $('#id_usuario').attr('value', sessionStorage.getItem('id_usuario'))
    $('#id_departamento').attr('value', sessionStorage.getItem('id_departamento'))
    $('#departamento').attr('value', sessionStorage.getItem('departamento_nombre'))
    $('#id_planificacion_activa').attr('value', sessionStorage.getItem('id_planificacion_activa'))

    form.validate({
  
  // REGLAS DE VALIDACIÓN PARA CADA CAMPO

      rules: {
        departamento: {
          required: true
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
          maxlength: 700
        },

        actividad: {
          required: true,
          minlength: 10,
          maxlength: 500
        },
        tipo_poa: {
          required: true
        }
      },

      // MENSAJES DE ERROR PERSONALIZADOS

      messages: {
        sector: {
          required: 'El sector es obligatorio'
        },
        objetivos: {
          required: 'Debe describir el nombre del objetivo la UA es obligatorio',
          minlength: 'El objetivo debe tener al menos 10 caracteres',
          maxlength: 'No puede exceder los 700 caracteres'
        },
        actividad: {
          required: 'Describa el nombre de la actividad/proyecto',
          minlength: 'El nombre de la actividad/proyecto debe tener al menos 10 caracteres',
          maxlength: 'No puede exceder los 500 caracteres'
        },
        tipo_poa: {
          required: 'Seleccione un tipo de POA'
        }
      },

      // UBICACIÓN DE LOS MENSAJES DE ERROR Y CLASES DE ESTILO PARA CAMPOS INVÁLIDOS

      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback')
        element.closest('.form-group').append(error)
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid')
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid')
      }
    })
  }
})
