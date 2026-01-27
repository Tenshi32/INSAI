// Evento POST para crear
$(document).on('click', '#Generar', function () {
  if ($('#formDepartamento').valid()) {
    const FormnDepa = {
      UrlControl: 'http://localhost:5000/Database/Exportar',
      Formulario: document.getElementById('formBaseData'),
      Method: 'POST'
    }

    methodSend(FormnDepa, function (params) {
      consultarDepartamentos
      $('#DepartamentoModal').modal('hide')
    })
  }
})

$(document).ready(function () {
  $('#BaseDataModal').on('show.bs.modal', function (event) {
    // Botón que disparó el modal
    const boton = $(event.relatedTarget)
    const esImportar = boton.attr('id') === 'btnImportar'

    const modal = $(this)
    const contenedor = modal.find('#camposDinamicos')
    const btnGenerar = modal.find('#Generar')

    if (esImportar) {
      // --- CONFIGURACIÓN PARA IMPORTAR ---
      modal.find('#tituloModalBase').text('Importar Base de Datos')
      btnGenerar.text('Importar').removeClass('btn-primary').addClass('btn-success')
      btnGenerar.attr('data-url', 'http://localhost:5000/Database/Importar')

      // Agregamos el campo de archivo
      contenedor.html(`
                <div class="form-group mb-3">
                    <label class="form-label">Seleccione archivo .sql</label>
                    <input type="file" name="archivo_sql" id="archivo_sql" class="form-control" accept=".sql" required>
                </div>
            `)
    } else {
      // --- CONFIGURACIÓN PARA EXPORTAR ---
      modal.find('#tituloModalBase').text('Exportar Base de Datos')
      btnGenerar.text('Exportar').removeClass('btn-success').addClass('btn-primary')
      btnGenerar.attr('data-url', 'http://localhost:5000/Database/Exportar')

      // Eliminamos el campo (vaciamos el contenedor)
      contenedor.empty()
    }
  })
  $('#formBaseData').validate({
    // --- REGLAS DE VALIDACIÓN ---
    rules: {
      email_username: {
        required: true,
        minlength: 7,
        maxlength: 20
      },
      password: {
        required: true,
        minlength: 2,
        maxlength: 50
      }
    },

    // --- MENSAJES PERSONALIZADOS ---
    messages: {
      email_username: {
        required: 'La cédula es obligatoria',
        minlength: 'La cédula debe tener al menos 7 dígitos',
        maxlength: 'La cédula no debe exceder los 20 caracteres'
      },
      password: {
        required: 'El nombre es obligatorio',
        minlength: 'Mínimo 2 caracteres',
        maxlength: 'Máximo 50 caracteres'
      }
    },

    // --- DISEÑO DE ERRORES (BOOTSTRAP 5) ---
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback animated fadeIn') // Animación suave
      // Coloca el mensaje de error después del input dentro del form-group
      element.closest('.form-group').append(error)
    },

    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid').removeClass('is-valid')
    },

    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid').addClass('is-valid')
    }
  })
})
