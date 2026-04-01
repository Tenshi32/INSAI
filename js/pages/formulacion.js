

function SelectEstados() {
  // 1. URL DE TU SERVIDOR FLASK PARA OBTENER LOS ESTADOS

  const url = LOCALURL + 'Select/Consultar?tabla=estados&col1=id_estado&col2=estado'

  const receptor = document.getElementById('estados')

  MethodGet(url, function (lista) {
    let contenido = "<option value=''>seleccione una opción</option> "

    lista.forEach(item => {
      contenido += `
                <option value='${item.id_estado}'>#${item.id_estado}: ${item.estado}</option>
                `
    })

    receptor.innerHTML = contenido
  })
}

function SelectMunicipio(estadoSeleccionado) {
  // 1. URL DE TU SERVIDOR FLASK PARA OBTENER LOS MUNICIPIOS

  const url =
    LOCALURL +
    'Select/Consultar?tabla=municipios&col1=id_municipio&col2=municipio&col3=id_estado&id=' +
    estadoSeleccionado

  const receptor = document.getElementById('municipio')

  MethodGet(url, function (lista) {
    let contenido = "<option value=''>seleccione una opción</option> "

    lista.forEach(item => {
      contenido += `
                <option value='${item.id_municipio}'>#${item.id_municipio}: ${item.municipio}</option>
                `
    })

    receptor.innerHTML = contenido
  })
}

document.getElementById('estados').addEventListener('change', function () {
  const estadoSeleccionado = this.value

  console.log('Estado seleccionado:', estadoSeleccionado)
  SelectMunicipio(estadoSeleccionado)
})
  /*
  
    acciones: "jhalskdjfhlaksjdfhlk"
    descripcion: "ksjdfhlasdkjfhlaksjdfhlaskdjfhlaskdjfhalsdkjfhasldjkfhalsdkfjh"
    estado: "Amazonas"
    municipio: "Alto Orinoco"
    trim1: 23
    trim2: 23
    trim3: 3
    trim4: 0
    id_meta: 16065758211
    id_meta_data: 16065758211
    sede_ubicacion: "lfhasdlfhalskdjfhlkajsdf"
    statu_metas: "1"
    total_actividad: 49

  */
function consultarFormulacion() {
  let url = LOCALURL + 'MetasData/Consultar?id_planificacion=' + sessionStorage.getItem('id_planificacion_activa')

  let contenido = ''

  receptor = document.getElementById('tablaFormulacion')
  receptorActual = document.getElementById('tablaFormulacionActual')
  MethodGet(url, function (lista) {
    console.log(lista)
    lista.forEach(item => {
      const estados = {
        1: '<span class="badge bg-label-warning me-1">En Espera</span>',
        2: '<span class="badge bg-label-success me-1">Aprobada</span>',
        3: '<span class="badge bg-label-danger me-1">Negada</span>'
      }

      let estadoBadge = estados[item.statu_metas]

      let textoAccion
      if (item.statu_metas === '2') {
        textoAccion = `
                  <div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item Ver" 
                        data-unico="${item.id_meta}"
                        data-acciones="${item.acciones}"
                        data-descripcion="${item.descripcion}"
                        data-estado="${item.estado}"
                        data-municipio="${item.municipio}"
                        data-trim1="${item.trim1}"
                        data-trim2="${item.trim2}"
                        data-trim3="${item.trim3}"
                        data-trim4="${item.trim4}"
                        data-total="${item.total_actividad}"
                        data-sede="${item.sede_ubicacion}">
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
                      <a class="dropdown-item Ver" 
                        data-unico="${item.id_meta}"
                        data-acciones="${item.acciones}"
                        data-descripcion="${item.descripcion}"
                        data-estado="${item.estado}"
                        data-municipio="${item.municipio}"
                        data-trim1="${item.trim1}"
                        data-trim2="${item.trim2}"
                        data-trim3="${item.trim3}"
                        data-trim4="${item.trim4}"
                        data-total="${item.total_actividad}"
                        data-sede="${item.sede_ubicacion}">
                         <i class="bx bx-toggle-big-right me-1"></i> Ver
                      </a>
                      <a class="dropdown-item Editar" 
                        data-unico="${item.id_meta}"
                        data-acciones="${item.acciones}"
                        data-descripcion="${item.descripcion}"
                        data-estado="${item.estado}"
                        data-municipio="${item.municipio}"
                        data-trim1="${item.trim1}"
                        data-trim2="${item.trim2}"
                        data-trim3="${item.trim3}"
                        data-trim4="${item.trim4}"
                        data-total="${item.total_actividad}"
                        data-sede="${item.sede_ubicacion}">
                         <i class="bx bx-edit-alt me-1"></i> Editar
                      </a>
                    </div>
                  </div>`
      }

      contenido += `
        <tr>
            <td>${item.id_meta_data}</td>
            <td><span class="fw-bold">${item.sede_ubicacion}</span><br>
            <span class="badge bg-label-info">${item.estado} - ${item.municipio}</span></td>
            <td>${item.total_actividad}</td>

            <td>${estadoBadge}</td>
            <td>
               ${textoAccion}
            </td>
        </tr>
      `
      
      if(item.id_cabecera_data == sessionStorage.getItem('id_planificacion_activa')){
        receptorActual.innerHTML = contenido
      }

    })

    const form = document.getElementById('formFomulacion')
    if (form) form.reset()

    receptor.innerHTML = contenido
  })
}

$(document).on('click', '.Ver', function (event) {
  
  // Obtenemos todos los datos del data-attribute
    const d = $(this).data();

    // Mapeamos los datos a los elementos del modal
    $('#view_descripcion').text(d.descripcion);
    $('#view_acciones').text(d.acciones);
    $('#view_estado').text(d.estado);
    $('#view_municipio').text(d.municipio);
    $('#view_sede').text(d.sede);
    
    // Datos numéricos (Trimestres)
    $('#view_trim1').text(d.trim1);
    $('#view_trim2').text(d.trim2);
    $('#view_trim3').text(d.trim3);
    $('#view_trim4').text(d.trim4);
    $('#view_total').text(d.total);

  // ABRIR EL MODAL MANUEALMENTE
  $('#FormulacionVerModal').modal('show')
})

$(document).on('click', '#Crear', function () {
  if ($('#formFomulacion').valid()) {
    const FormnDepa = {
      UrlControl: LOCALURL + 'MetasData/Crear',
      Formulario: document.getElementById('formFomulacion'),
      Method: 'POST'
    }

    methodSend(FormnDepa, function (params) {
      consultarFormulacion()
      $('#FormulacionModal').modal('hide')
    })
  }
})

$(document).on('click', '.Editar', function (event) {
  // 1. OBTENER LOS DATOS (Asegúrate que el botón tenga data-descripcion, data-trim1, etc.)
  const d = $(this).data();

  // 2. LLENAR LOS CAMPOS DEL FORMULARIO
  // Inputs ocultos (IDs de referencia)
  $('#id_lineamiento').val(d.unico); // Usando data-unico="${item.id_meta}"
  
  // Campos de texto y textareas
  $('#meta_fisica').val(d.descripcion);
  $('#acciones').val(d.acciones);
  $('#sede_ubicacion').val(d.sede);
  
  // Campos numéricos (Trimestres)
  $('#trim1').val(d.trim1);
  $('#trim2').val(d.trim2);
  $('#trim3').val(d.trim3);
  $('#trim4').val(d.trim4);
  $('#trimtotal').val(d.total);

  // 3. SELECCIÓN DE SELECTS (Estado y Municipio)
  // Nota: Si usas Select2, a veces necesitas disparar el evento 'change'
  $('#estados').val(d.estado).trigger('change');
  $('#municipio').val(d.municipio).trigger('change');

  // 4. TRANSFORMAR EL BOTÓN DE "GUARDAR" EN "EDITAR"
  $('#Crear')
    .text('Actualizar Meta')
    .removeClass('btn-primary')
    .addClass('btn-warning')
    .off('click') // Limpiamos clicks previos
    .on('click', function () {
      
      // Validamos el formulario antes de enviar
      if ($('#FormulacionModal').valid()) {
        const dataEnvio = {
          UrlControl: LOCALURL + 'MetasData/Editar', // Tu ruta de edición
          Formulario: document.getElementById('formFomulacion'),
          Method: 'PUT'
        };

        // Enviamos mediante tu función genérica
        methodSend(dataEnvio, function (respuesta) {
          // Aquí pones la función que refresca tu tabla
          if(typeof consultarObjetivos === 'function') consultarObjetivos(); 
          
          $('#FormulacionModal').modal('hide');
          
          // Restauramos el botón a su estado original
          $('#Crear')
            .text('Guardar Metas/Acciones')
            .removeClass('btn-warning')
            .addClass('btn-primary');
        });
      }
    });

  // 5. ABRIR EL MODAL
  $('#FormulacionModal').modal('show');
});

$(document).ready(function () {

  SelectEstados()
  consultarFormulacion()

  let form = $('#formFomulacion')
  if (form.length) {
    $('#id_lineamiento').attr('value', sessionStorage.getItem('id_lineamiento'))
    $('#id_usuario').attr('value', sessionStorage.getItem('id_usuario'))
    $('#id_departamento').attr('value', sessionStorage.getItem('id_departamento'))
    $('#departamento').attr('value', sessionStorage.getItem('departamento_nombre'))
    $('#id_planificacion_activa').attr('value', sessionStorage.getItem('id_planificacion_activa'))

    // 3. Calcular total automático por fila
    $(document).on('input', '.trim-input', function () {
      let total = 0

      $('.trim-input').each(function () {
        total += parseFloat($(this).val()) || 0
      })

      $('#trimtotal').val(total)
    })

    form.validate({
      rules: {
        id_lineamiento: {
          required: true
        },
        meta_fisica: {
          required: true,
          minlength: 10
        },
        trim1: {
          required: true,
          number: true,
          min: 0
        },
        trim2: {
          required: true,
          number: true,
          min: 0
        },
        trim3: {
          required: true,
          number: true,
          min: 0
        },
        trim4: {
          required: true,
          number: true,
          min: 0
        },

        acciones: {
          required: true,
          minlength: 5
        }
      },

      messages: {
        id_lineamiento: { required: 'Error: No se detectó el lineamiento.' },
        meta_fisica: {
          required: 'La descripción de la meta es obligatoria.',
          minlength: 'Sea más específico (mínimo 10 caracteres).'
        },
        trim1: { required: 'Campo requerido', number: 'Solo números', min: 'Mínimo 0' },
        trim2: { required: 'Campo requerido', number: 'Solo números', min: 'Mínimo 0' },
        trim3: { required: 'Campo requerido', number: 'Solo números', min: 'Mínimo 0' },
        trim4: { required: 'Campo requerido', number: 'Solo números', min: 'Mínimo 0' },
        acciones: {
          required: 'Las acciones son obligatorias.',
          minlength: 'Describa brevemente las acciones.'
        }
      },

      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback')
        element.closest('.form-group').append(error)
      },
      highlight: function (element) {
        $(element).addClass('is-invalid')
      },
      unhighlight: function (element) {
        $(element).removeClass('is-invalid')
      }
    })
  }
})
