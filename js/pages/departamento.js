// EVENTO GET PARA CONSULTAR Y MOSTRAR LOS DEPARTAMENTOS EN LA TABLA
    function consultarDepartamentos() {

// URL DE TU SERVIDOR FLASL
  const url = LOCALURL + 'Departamento/Consultar'

  let contenido = ''

  receptor = document.getElementById('tablaDepartamentos')

  MethodGet(url, function (lista) {
    let contenido = ''

    lista.forEach(item => {

// MANEJO DE ESTADOS ACTIVO/INACTIVO PARA MOSTRARLO EN LA TABLA Y EN EL BOTÓN DE ACCIÓN

let estadoBadge =
     item.statu !== '0'
        ? '<span class="badge bg-label-primary me-1">Activo</span>'
        : '<span class="badge bg-label-danger me-1">Inactivo</span>'

      let textoAccion = item.statu !== '0' ? 'Desactivar' : 'Activar'

//  CONVERTIMOS EL STRING DE FECHAS A OBJETOS DE FECHA PARA FORMATEARLAS

      const fechaI = new Date(item.fecha_inicio)
      const fechaF = new Date(item.fecha_final)

// FORMATEAMOS LAS FECHAS A UN FORMATO LEGIBLE (DÍA/MES/AÑO) Y LAS ASIGNAMOS DE NUEVO AL OBJETO PARA MOSTRARLAS EN LA TABLA

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

// EVENTO POST PARA CREAR UN NUEVO DEPARTAMENTO

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

// EVENTO PUT PARA ACTIVAR/DESACTIVAR UN DEPARTAMENTO (TOGGLE) USANDO LOS ATRIBUTOS DATA- PARA PASAR EL ID Y EL STATUS ACTUAL

$(document).on('click', '.Toggle', function (event) {
  const id = $(this).data('unico')
  const statusActual = $(this).data('status')

 // CALCULAMOS EL NUEVO STATUS (SI ES 1 PASA A 0, SI ES 0 PASA A 1)
   const nuevoStatus = statusActual == '1' ? '0' : '1'

 // CREAMOS EL CONTENIDO DEL FORMULARIO MANUALMENTE USANDO FORMDATA PARA ENVIAR LOS DATOS NECESARIOS AL SERVIDOR (ID Y NUEVO STATUS)
 
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

// EVENTO PUT PARA EDITAR UN DEPARTAMENTO
$(document).on('click', '.Editar', function (event) {

//  OBTENER DATOS DEL ATRIBUTO DATA
  const d = $(this).data()

// LLENAR EL FORMULARIO CON LOS DATOS OBTENIDOS PARA MOSTRARLOS EN EL MODAL Y PERMITIR SU EDICIÓN
  $('#created').val(d.id) // USAMOS EL HIDDEN PARA GUARDAR EL ID DEL DEPARTAMENTO QUE SE VA A EDITAR, ASÍ LO TENEMOS DISPONIBLE CUANDO SE ENVÍE EL FORMULARIO
  $('#codigo').val(d.codigo)
  $('#nombre').val(d.nombre)
  $('#ubicacion').val(d.ubicacion)
  $('#descripcion').val(d.descripcion)

// CAMBIAR EL BOTÓN DE CREAR A EDITAR Y ASIGNARLE EL EVENTO DE ENVÍO
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

// ABRIR EL MODAL MANUALMENTE DESPUÉS DE LLENAR LOS CAMPOS PARA QUE SE MUESTREN LOS DATOS ANTES DE EDITARLOS
  $('#DepartamentoModal').modal('show')
})

$(document).ready(function () {
  consultarDepartamentos()

  form = $('#formDepartamento')
  if (form.length) {
    form.validate({

// REGLAS DE VALIDACIÓN PARA LOS CAMPOS DEL FORMULARIO DE DEPARTAMENTO
      rules: {

 // DATOS DEL DEPARTAMENTO
        codigo: {
          required: true,
          number: true,
          minlength: 5,
          maxlength: 15
        },
        nombre: {
          required: true,
          minlength: 5,
          maxlength: 50
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

  // MENSAJES DE ERROR PERSONALIZADOS PARA CADA CAMPO (VALIDACIONES)
  
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
