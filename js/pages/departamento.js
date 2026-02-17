// Evento GET para Consulta
function consultarDepartamentos() {
  // 1. URL de tu servidor Flask
  const url = LOCALURL + 'Departamento/Consultar'

  let contenido = ''

  receptor = document.getElementById('tablaDepartamentos')

  MethodGet(url, function (lista) {
    let contenido = ''

    lista.forEach(item => {
      // Manejo de estados (Activo/Inactivo)
      let estadoBadge =
        item.statu !== '0'
          ? '<span class="badge bg-label-primary me-1">Activo</span>'
          : '<span class="badge bg-label-danger me-1">Inactivo</span>'

      let textoAccion = item.statu !== '0' ? 'Desactivar' : 'Activar'

      // 1. Convertimos el string raro a un objeto Date de JS
      const fechaI = new Date(item.fecha_inicio)
      const fechaF = new Date(item.fecha_final)

      // 2. Formateamos a estilo latino (día/mes/año)
      item.fecha_inicio = fechaI.toLocaleDateString('es-ES')
      item.fecha_final = fechaF.toLocaleDateString('es-ES')

      contenido += `
                <tr>
                    <td>${item.id_departamento}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>${estadoBadge}</td>
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
                            <a class="dropdown-item Toggle" data-unico="${item.id_departamento}" data-status="${item.status}"><i class='bx  bx-toggle-big-right me-1'></i> ${textoAccion}</a>
                          </div>
                        </div>
                    </td>
                </tr>
            `
    })

    const form = document.getElementById('formDepartamento')
    if (form) form.reset()

    receptor.innerHTML = contenido
  })
}

// Evento POST para crear
$(document).on('click', '#Crear', function () {
  if ($('#formDepartamento').valid()) {
    const FormnDepa = {
      UrlControl: LOCALURL + 'Departamento/Crear',
      Formulario: document.getElementById('formDepartamento'),
      Method: 'POST'
    }

    methodSend(FormnDepa, function (params) {
      consultarDepartamentos
      $('#DepartamentoModal').modal('hide')
    })
  }
})

// Evento PUT para activar/desactivar
$(document).on('click', '.Toggle', function (event) {
  const id = $(this).data('unico')
  const statusActual = $(this).data('status')

  // Calculamos el nuevo estado (si es 1 pasa a 0, si es 0 pasa a 1)
  const nuevoStatus = statusActual == '1' ? '0' : '1'

  // Creamos el contenedor de datos manual
  const datosManuales = new FormData()
  datosManuales.append('id_departamento', id)
  datosManuales.append('status', nuevoStatus)

  const FormnDepa = {
    UrlControl: LOCALURL + 'Departamento/Toggle',
    Formulario: datosManuales,
    Method: 'PUT'
  }

  methodSend(FormnDepa, function (params) {
    consultarDepartamentos
  })
})

// Evento PUT para edición
$(document).on('click', '.Editar', function (event) {
  // 1. Obtener datos del atributo data-
  const d = $(this).data()

  // 2. Llenar los campos del formulario
  $('#created').val(d.id) // Usamos el input hidden para el ID
  $('#codigo').val(d.codigo)
  $('#nombre').val(d.nombre)
  $('#ubicacion').val(d.ubicacion)
  $('#descripcion').val(d.descripcion)

  // 3. Cambiar el botón "Enviar" para que sea de "Editar"
  $('#Crear')
    .text('Editar')
    .removeClass('btn-primary')
    .addClass('btn-warning')
    .off('click')
    .on('click', function () {
      if ($('#formDepartamento').valid()) {
        const FormnDepa = {
          UrlControl: LOCALURL + 'Departamento/Editar',
          Formulario: document.getElementById('formDepartamento'),
          Method: 'PUT'
        }

        methodSend(FormnDepa, function (params) {
          consultarDepartamentos
          $('#DepartamentoModal').modal('hide')
          $('#Crear').text('Enviar').removeClass('btn-warning').addClass('btn-primary').attr('data-action', 'create')
        })
      }
    })

  // 4. Abrir el modal manualmente
  $('#DepartamentoModal').modal('show')
})

$(document).ready(function () {
  consultarDepartamentos()

  form = $('#formDepartamento')
  if (form.length) {
    form.validate({
      //Reglas/Validaciones
      rules: {
        //Datos del Departamento
        codigo: {
          required: true,
          number: true,
          minlength: 5,
          maxlength: 15
        },
        nombre: {
          required: true,
          minlength: 5,
          maxlength: 25
        },
        jefe: {
          required: true
        },
        ubicacion: {
          required: true,
          minlength: 5,
          maxlength: 25
        },
        descripcion: {
          required: true,
          minlength: 5,
          maxlength: 100
        }
      },

      //Mensages de validaciones
      messages: {
        codigo: {
          required: 'Campo Obligatorio',
          number: 'Solo se permiten números',
          minlength: 'Cantidad mínima es de 5 caracteres',
          maxlength: 'Cantidad máxima es de 15 caracteres'
        },

        nombre: {
          required: 'Campo Obligatorio',
          minlength: 'Cantidad mínima es de 5 caracteres',
          maxlength: 'Cantidad máxima es de 25 caracteres'
        },
        jefe: {
          required: 'Campo Obligatorio'
        },
        ubicacion: {
          required: 'Campo Obligatorio',
          minlength: 'Cantidad mínima es de 5 caracteres',
          maxlength: 'Cantidad máxima es de 25 caracteres'
        },
        descripcion: {
          required: 'Campo Obligatorio',
          minlength: 'Cantidad mínima es de 5 caracteres',
          maxlength: 'Cantidad máxima es de 100 caracteres'
        }
      },

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
        $(element).addClass('is-valid')
      }
    })
  }
})
