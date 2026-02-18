//Evento POST para carga la foto de perfil
$(document).on('change', '#upload', function (event) {
  event.preventDefault()
  event.stopPropagation()
  const archivo = this.files[0]

  const datosManuales = new FormData()
  datosManuales.append('archivo', archivo)

  const config = {
    UrlControl: LOCALURL + 'Usuario/SubirFoto',
    Formulario: datosManuales,
    Method: 'POST'
  }

  if (archivo) {
    // Validar tamaño (5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'La imagen excede los 5MB', 'error')
      $(this).val('') // Limpiar
      return
    }

    methodSendFile(config, function (data) {
      $('#uploadedAvatar').css('opacity', '0.5')
      $('#foto_ruta').val(data.nombre_archivo)
      $('#uploadedAvatar').attr('src', data.url_completa).css('opacity', '1')
    })
  }
})

//Evento POST para borrar la foto de perfil
$(document).on('click', '#resetear', function (event) {
  event.preventDefault()

  const nombreArchivo = $('#foto_ruta').val()

  // Si no hay foto subida (está la de por defecto), solo limpiamos el input file
  if (nombreArchivo === '' || nombreArchivo === '1.png') {
    $('#upload').val('')
    $('#uploadedAvatar').attr('src', '../../assets/img/avatars/1.png')
    return
  }

  const datos = new FormData()
  datos.append('nombre_archivo', nombreArchivo)

  const config = {
    UrlControl: LOCALURL + 'Usuario/EliminarFoto',
    Formulario: datos,
    Method: 'POST' // Usamos POST porque algunos servidores bloquean el body en DELETE
  }

  methodSendFile(config, function (data) {
    if (data.status) {
      // Restauramos la imagen por defecto y limpiamos campos
      $('#uploadedAvatar').attr('src', '../../assets/img/avatars/1.png')
      $('#foto_ruta').val('')
      $('#upload').val('')
    }
  })
})

// Evento GET para Consulta
function consultarPerfil() {
  // 1. URL de tu servidor Flask
  let url = LOCALURL + 'UsuarioData/Obtener?id=' + sessionStorage.getItem('id_usuario')

  MethodGet(url, function (data) {
    console.log(data)
    $('#display_full_name').text(`${data[18]} ${data[24]}`) // Nombre + Apellido/User
    $('#display_rol').text(data[16] || 'Usuario')  // "Dev"
    $('#display_depto').text(data[14]) // "Contaduria"

    // 2. Llenar el Formulario
    $('#usuario').attr('value', data[24] )// "test_upd"
    $('#cedula').attr('value', data[9]) // 67867896
    $('#firstName').attr('value', data[18])// "test"
    $('#lastName').attr('value', data[2]) // "dfghdfgh..."
    $('#email').attr('value', data[4])// "testupd@example.com"
    $('#numerocel').attr('value', data[23]) // "sdfs23432"
    $('#direccion').attr('value', data[3])

    if (data[6]) {
      const fechaObj = new Date(data[6])
      if (!isNaN(fechaObj)) {
        const yyyy = fechaObj.getUTCFullYear()
        const mm = String(fechaObj.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(fechaObj.getUTCDate()).padStart(2, '0')
        $('#fechan').attr('value', `${yyyy}-${mm}-${dd}`)
      }
    }

  })
}

// Evento PUT para edición
$(document).on('click', '.Editar', function (event) {
  const d = $(this).data() // Captura todos los data-attributes

  $('#created').val(d.id)
  $('#cedula').val(d.cedula)
  $('#firstName').val(d.nombre)
  $('#lastName').val(d.apellido)
  $('#email').val(d.email)
  $('#numerocel').val(d.telefono)
  $('#fechan').val(d.fechan)
  $('#direccion').val(d.direccion)

  // 3. Cambiar el botón "Enviar" para que sea de "Editar"
  $('#Crear')
    .text('Editar')
    .removeClass('btn-primary')
    .addClass('btn-warning')
    .off('click')
    .on('click', function () {
      if ($('#formUsuario').valid()) {
        const config = {
          UrlControl: LOCALURL + 'Usuario/Editar',
          Formulario: document.getElementById('formUsuario'),
          Method: 'PUT'
        }

        methodSend(config, function () {
          consultarUsuarios()

          $('#UsuarioModal').modal('hide')

          $('#Crear').text('Enviar').removeClass('btn-warning').addClass('btn-primary').attr('data-action', 'create')
        })
      }
    })

  // 4. Abrir el modal manualmente
  $('#UsuarioModal').modal('show')
})

$(document).ready(function () {
  consultarPerfil()

  let form = $('#formUsuario')
  if (form.length) {
    form.validate({
      rules: {
        cedula: {
          required: true,
          minlength: 7,
          usuarioUnico: true // <--- Regla local
        },
        firstName: {
          required: true,
          minlength: 2
        },
        lastName: {
          required: true,
          minlength: 2
        },
        email: {
          required: true,
          email: true,
          usuarioUnico: true // <--- Regla local
        },
        numerocel: {
          required: true,
          minlength: 11
        },
        fechan: {
          required: true
        },
        direccion: {
          required: true,
          minlength: 10
        },
        profesion: {
          required: true
        },
        usuario: {
          required: true,
          minlength: 4
        }
      },

      messages: {
        cedula: {
          required: 'La cédula de identidad es obligatoria.',
          minlength: 'La cédula debe tener al menos 7 dígitos.',
          maxlength: 'La cédula no puede exceder los 12 caracteres.'
        },
        firstName: {
          required: 'Por favor, ingrese sus nombres.',
          minlength: 'El nombre debe tener al menos 2 caracteres.'
        },
        lastName: {
          required: 'Por favor, ingrese sus apellidos.',
          minlength: 'El apellido debe tener al menos 2 caracteres.'
        },
        email: {
          required: 'El correo electrónico es indispensable para el registro.',
          email: 'Ingrese un formato de correo válido (ejemplo@correo.com).'
        },
        numerocel: {
          required: 'El número de teléfono es obligatorio.',
          minlength: 'Ingrese el número completo (Ej: 04121234567).'
        },
        fechan: {
          required: 'La fecha de nacimiento es obligatoria.'
        },
        direccion: {
          required: 'La dirección es necesaria para el registro.',
          minlength: 'Sea más específico con la dirección (mínimo 10 caracteres).'
        },
        profesion: {
          required: 'Indique su ocupación o profesión.'
        },
        usuario: {
          required: 'Debe asignar un nombre de usuario.',
          minlength: 'El usuario debe tener al menos 4 caracteres.'
        },
        contraseña: {
          required: 'La contraseña es obligatoria.',
          minlength: 'La contraseña debe tener al menos 6 caracteres.'
        },
        confirmarcontraseña: {
          required: 'Debe confirmar su contraseña.',
          equalTo: 'Las contraseñas no coinciden, verifique de nuevo.'
        },
        nivel: {
          required: 'Debe seleccionar un nivel de acceso.'
        },
        departamento: {
          required: 'Seleccione el departamento al que pertenece.'
        },
        // Mensajes para las preguntas de seguridad
        pregunta1: {
          required: 'Seleccione la primera pregunta de seguridad.',
          distintasPreguntas: 'No puede repetir la misma pregunta.'
        },
        pregunta2: {
          required: 'Seleccione la segunda pregunta de seguridad.',
          distintasPreguntas: 'Esta pregunta ya ha sido seleccionada arriba.'
        },
        pregunta3: {
          required: 'Seleccione la tercera pregunta de seguridad.',
          distintasPreguntas: 'Debe elegir tres preguntas diferentes.'
        },
        // Mensajes para las respuestas
        repuesta1: {
          required: 'Debe responder a la primera pregunta.'
        },
        repuesta2: {
          required: 'Debe responder a la segunda pregunta.'
        },
        repuesta3: {
          required: 'Debe responder a la tercera pregunta.'
        }
      },
      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback animated fadeIn')
        element.closest('.form-group').append(error)
      },
      highlight: function (element) {
        $(element).addClass('is-invalid').removeClass('is-valid')
      },
      unhighlight: function (element) {
        $(element).removeClass('is-invalid').addClass('is-valid')
      }
    })
  }

  $.validator.addMethod(
    'usuarioUnico',
    function (value, element) {
      // "value" es lo que el usuario escribió en el input (cédula o correo)

      // Buscamos si existe algún usuario en nuestra lista global que coincida
      let existe = usuariosLocales.some(
        user => user.id_usuario == value || user.email.toLowerCase() === value.toLowerCase()
      )

      return !existe
    },
    'Este registro ya existe en el sistema.'
  )

  // Regla para que las respuestas no sean iguales
  $.validator.addMethod(
    'distintasRespuestas',
    function (value, element) {
      let respuestas = []
      let repetida = false

      // Evaluamos los 3 campos de respuesta
      $('#repuesta1, #repuesta2, #repuesta3').each(function () {
        let val = $(this).val().trim().toLowerCase() // Normalizamos a minúsculas
        if (val !== '') {
          if (respuestas.includes(val)) {
            repetida = true
          }
          respuestas.push(val)
        }
      })

      return !repetida
    },
    'Las respuestas de seguridad deben ser diferentes entre sí.'
  )

  $.validator.addMethod(
    'distintasPreguntas',
    function (value, element) {
      let preguntas = []
      let repetida = false

      // Buscamos todos los selects que tengan la clase .pregunta-seguridad
      $('#pregunta1, #pregunta2, #pregunta3').each(function () {
        let val = $(this).val()
        if (val !== '') {
          if (preguntas.includes(val)) {
            repetida = true
          }
          preguntas.push(val)
        }
      })

      return !repetida // Si es true, la validación pasa. Si es false, muestra error.
    },
    'No puedes seleccionar la misma pregunta dos veces.'
  )
})
