// EVENTO GET PARA CONSULTAR Y MOSTRAR LOS OBJETIVOS DE LA UA EN LA TABLA

function consultarObjetivos() {
  let url = LOCALURL + 'CabeceraData/Consultar?id_lineamiento=' + sessionStorage.getItem('id_lineamiento')

  let contenido = ''

  let receptorPlanificacion = document.getElementById('tablaPlanificacionPrePoa')

  MethodGet(url, function (lista) {
    lista.forEach(item => {
      const estados = {
        1: '<span class="badge bg-label-warning me-1">En Espera</span>',
        2: '<span class="badge bg-label-success me-1">Aprobada</span>',
        3: '<span class="badge bg-label-danger me-1">Negada</span>'
      }

      // Si el estado no existe en el objeto, podrías poner uno por defecto
      let estadoBadge = estados[item.statu_cabecera]

      let textoAccion
      if (item.statu_cabecera === '2') {
        textoAccion = `
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
      } else {
        textoAccion = `
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

    receptorPlanificacion.innerHTML = contenido
  })
}

function consultarFormulaciones() {
  let url = LOCALURL + 'MetasData/Consultar?id_lineamiento=' + sessionStorage.getItem('id_lineamiento')

  let receptorFormulacion = document.getElementById('tablaFormulacionPrePoa')

  MethodGet(url, function (lista) {
    console.log(lista) // Objeto agrupado por ID de departamento

    let contenido = ''

    const estados = {
      1: '<span class="badge bg-label-warning me-1">En Espera</span>',
      2: '<span class="badge bg-label-success me-1">Aprobada</span>',
      3: '<span class="badge bg-label-danger me-1">Negada</span>'
    }

    // Iteramos sobre cada Departamento (una sola fila por grupo)
    Object.keys(lista).forEach(deptoId => {
      const metas = lista[deptoId] // Este es el array de metas de este depto
      const primerItem = metas[0] // Usamos el primero para obtener datos generales (ubicación, etc.)

      // Calculamos totales del departamento si es necesario
      const totalMetasDepto = metas.length
      const sumaTotalActividades = metas.reduce((acc, cur) => acc + (parseInt(cur.total_actividad) || 0), 0)

      let textoAccion = `
            <div class="dropdown">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item Ver" 
                        style="cursor:pointer;"
                        data-deptoid="${deptoId}">
                        <i class="bx bx-list-ul me-1"></i> Ver ${totalMetasDepto} Metas
                    </a>
                </div>
            </div>`

      contenido += `
            <tr>
                <td>${deptoId}</td>
                <td>
                    <span class="fw-bold">Departamento / Unidad</span><br>
                    <small class="text-muted">Sede: ${primerItem.sede_ubicacion}</small>
                </td>
                <td>
                    <span class="badge bg-label-primary">${totalMetasDepto} Metas registradas</span>
                </td>
                <td>${estados[primerItem.statu_metas]}</td>
                <td>${textoAccion}</td>
            </tr>`
    })

    receptorFormulacion.innerHTML = contenido

    // Guardamos la lista globalmente para acceder a ella desde el modal sin volver al servidor
    window.datosMetasGlobal = lista
  })
}

// EVENTO POST PARA CREAR UN NUEVO OBJETIVO DE LA UA

$(document).on('click', '.Ver', function () {
  //  OBTENER LOS DATOS DEL ELEMENTO SELECCIONADO A TRAVÉS DE LOS ATRIBUTOS DATA

  const d = $(this).data()

  let metasDataGlobal = window.datosMetasGlobal
  const idDepto = d.deptoid
  const metas = metasDataGlobal[idDepto]

  let filasMetas = ''

  if (metas && metas.length > 0) {
    metas.forEach((m, index) => {
      filasMetas += `
                <tr>
                    <td><strong>#${index + 1}</strong></td>
                    <td>${m.descripcion.substring(0, 40)}...</td>
                    <td>
                        <button class="btn btn-primary VerDetalleTecnico" 
                            data-deptoid="${idDepto}" 
                            data-index="${index}">
                            <i class="bx bx-show"></i> Ver Detalles
                        </button>
                        <button class="btn btn-success VerDetalleTecnico" 
                            data-deptoid="${idDepto}" 
                            data-index="${index}">
                            <i class="bx bx-show"></i> Aprobar
                        </button>
                        <button class="btn btn-danger VerDetalleTecnico" 
                            data-deptoid="${idDepto}" 
                            data-index="${index}">
                            <i class="bx bx-show"></i> Observar
                        </button>
                    </td>
                </tr>`
    })
  } else {
    filasMetas = '<tr><td colspan="3" class="text-center">No hay metas</td></tr>'
  }

  // 3. Inyectar filas y abrir modal
  $('#lista_metas_tabla').html(filasMetas)
  $('#FormulacionModal').modal('show')
})

// 2. ABRIR EL DETALLE DE UNA META ESPECÍFICA
$(document).on('click', '.VerDetalleTecnico', function () {
    const d = $(this).data();
    const idDepto = d.deptoid;
    const index = d.index;
    
    // Obtenemos la meta específica del array usando el índice
    const metaUnica = window.datosMetasGlobal[idDepto][index];

    // Llenamos el modal de detalles
    $('#det_descripcion').text(metaUnica.descripcion);
    $('#det_t1').text(metaUnica.trim1);
    $('#det_t2').text(metaUnica.trim2);
    $('#det_t3').text(metaUnica.trim3);
    $('#det_t4').text(metaUnica.trim4);
    // ... llenar los demás campos (estado, municipio, etc.)

    $('#DetalleMetaUnicaModal').modal('show');
});

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

  $('#id_observado').attr('value', d.unico)
  $('#view_tipo_poa_notificacion').text(d.nombre_tipo_poa)
  $('#view_departamento_negar').text(d.nombre_departamento)

  // CAMBIAR EL CAMBIO DE BOTÓN "ENVIAR" PARA QUE SEA DE "EDITAR"

  $('#Crear').on('click', function () {
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
async function loadRevisionPrePoa() {
  await Promise.all([consultarObjetivos(), consultarFormulaciones()])
}
$(document).ready(function () {
  loadRevisionPrePoa()
  // VALIDACIÓN DEL FORMULARIO CON JQUERY VALIDATE
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
