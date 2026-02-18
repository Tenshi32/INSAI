// EVENTO GET PARA CONSULTAR Y MOSTRAR LOS OBJETIVOS DE LA UA EN LA TABLA

function consultarObjetivos() {
  let url = LOCALURL + 'CabeceraData/Consultar?id_lineamiento=' + sessionStorage.getItem('id_lineamiento')

  let contenido = ''

  receptor = document.getElementById('tablaPlanificacionPrePoa')

  MethodGet(url, function (lista) {
    lista.forEach(item => {

      const estados = {
        '1': '<span class="badge bg-label-warning me-1">En Espera</span>',
        '2': '<span class="badge bg-label-success me-1">Aprobada</span>',
        '3': '<span class="badge bg-label-danger me-1">Negada</span>'
      }

      // Si el estado no existe en el objeto, podrías poner uno por defecto
      let estadoBadge = estados[item.statu_cabecera]

      let textoAccion 
      if (item.statu_cabecera === '2') {

        textoAccion =`
                  <div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item Ver" 
                         data-unico="${item.id_cabecera}"
                         data-status="${item.statu_cabecera}"
                         data-actividad="${item.actividad}"
                         data-anno_fiscal="${item.anno_fiscal}"
                         data-enfoque_estrategico="${item.enfoque_estrategico}"
                         data-nombre_departamento="${item.nombre_departamento}"
                         data-nombre_tipo_poa="${item.nombre_tipo_poa}"
                         data-normas_legales="${item.normas_legales}"
                         data-objetivos="${item.objetivos}"
                         data-sector="${item.sector}">
                         <i class="bx bx-toggle-big-right me-1"></i> Ver
                      </a>
                    </div>
                  </div>`

      }else{

        textoAccion =`
                  <div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item Aprobar" 
                         style="cursor:pointer;"
                         data-id="${item.id_cabecera}"
                         <i class="bx bx-edit-alt me-1"></i> Aprobar
                      </a>
                      <a class="dropdown-item Notificar" 
                         style="cursor:pointer;"
                         data-unico="${item.id_cabecera}"
                         data-nombre_tipo_poa="${item.nombre_tipo_poa}"
                         data-nombre_departamento="${item.nombre_departamento}"
                         <i class="bx bx-edit-alt me-1"></i> Notificar
                      </a>
                      <a class="dropdown-item Ver" 
                         data-unico="${item.id_cabecera}"
                         data-status="${item.statu_cabecera}"
                         data-actividad="${item.actividad}"
                         data-anno_fiscal="${item.anno_fiscal}"
                         data-enfoque_estrategico="${item.enfoque_estrategico}"
                         data-nombre_departamento="${item.nombre_departamento}"
                         data-nombre_tipo_poa="${item.nombre_tipo_poa}"
                         data-normas_legales="${item.normas_legales}"
                         data-objetivos="${item.objetivos}"
                         data-sector="${item.sector}">
                         <i class="bx bx-toggle-big-right me-1"></i> Ver
                      </a>
                    </div>
                  </div>`
      }

      contenido += `
          <tr>
              <td>${item.id_cabecera}</td>
              <td><span class="fw-bold">${item.actividad}</span><br>
              <span class="badge bg-label-info">${item.sector}</span></td>
              <td>${item.objetivos}</td>

              <td>${estadoBadge}</td>
              <td>
                ${textoAccion}
              </td>
          </tr>
      `
    })

    receptor.innerHTML = contenido
  })
}

// EVENTO POST PARA CREAR UN NUEVO OBJETIVO DE LA UA

$(document).on('click', '.Ver', function (event) {
  //  OBTENER LOS DATOS DEL ELEMENTO SELECCIONADO A TRAVÉS DE LOS ATRIBUTOS DATA

  const d = $(this).data()
  $('#view_anno_fiscal').text(d.anno_fiscal)
  $('#view_sector').text(d.sector)
  $('#view_enfoque_estrategico').text(d.enfoque_estrategico)
  $('#view_objetivos').text(d.objetivos)
  $('#view_actividad').text(d.actividad)
  $('#view_departamento').text(d.nombre_departamento)
  $('#tipo_proyecto_view').text(d.nombre_tipo_poa)

  // ABRIR EL MODAL MANUEALMENTE
  $('#ObjetivoModal').modal('show')
})

$(document).on('click', '.Aprobar', function (event) {
  const id = $(this).data('id')

  const datosManuales = new FormData()
  datosManuales.append('id_cabecera', id)

  const FormnDepa = {
    UrlControl: LOCALURL + 'Cabecera/Toggle',
    Formulario: datosManuales,
    Method: 'PUT'
  }

  methodSend(FormnDepa, function (params) {
    consultarObjetivos
  })
})

// EVETO PUT PARA EDICIÓN

$(document).on('click', '.Notificar', function (event) {
  //  OBTENER LOS DATOS DEL ELEMENTO SELECCIONADO A TRAVÉS DE LOS ATRIBUTOS DATA

  const d = $(this).data()

  // LLENAR LOS CAMPOS DEL FORMULARIO CON LOS DATOS OBTENIDOS

  $('#id_observado').attr("value", d.unico)
  $('#view_tipo_poa_notificacion').text(d.nombre_tipo_poa)
  $('#view_departamento_negar').text(d.nombre_departamento)

  // CAMBIAR EL CAMBIO DE BOTÓN "ENVIAR" PARA QUE SEA DE "EDITAR"

  $('#Crear')
    .on('click', function () {
      if ($('#formObservaciones').valid()) {
        const FormnDepa = {
          UrlControl: LOCALURL + 'Observacion/Crear',
          Formulario: document.getElementById('formObservaciones'),
          Method: 'POST'
        }

        methodSend(FormnDepa, function (params) {
          consultarObjetivos
          $('#ObservacionesModal').modal('hide')
        })
      }
    })

  // ABRIR EL MODAL MANUEALMENTE

  $('#ObservacionesModal').modal('show')
})

$(document).ready(function () {
  consultarObjetivos()

  // VALIDACIÓN DEL FORMULARIO CON JQUERY VALIDATE
  /*  $('#id_lineamiento').attr('value', sessionStorage.getItem('id_lineamiento'))
  $('#id_usuario').attr('value', sessionStorage.getItem('id_usuario'))
  $('#id_departamento').attr('value', sessionStorage.getItem('id_departamento'))
  $('#departamento').attr('value', sessionStorage.getItem('departamento_nombre'))
  $('#id_planificacion_activa').attr('value', sessionStorage.getItem('id_planificacion_activa')) */

  let form = $('#formNotificar')
  if (form.length) {
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
