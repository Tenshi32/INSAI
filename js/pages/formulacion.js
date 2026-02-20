// SELECCIONAMOS LOS CAMPOS DE LOS TRIMESTRES Y EL CAMPO TOTAL

const inputsTrimestre = document.querySelectorAll('.input-trimestre');
const inputTotal = document.getElementById('total-metas');

inputsTrimestre.forEach(input => {
    input.addEventListener('input', () => {

 // VALIDACIÓN: Solo números (eliminar cualquier carácter no numérico)
        input.value = input.value.replace(/[^0-9]/g, '');

// CALCULO DE LA SUMA DE LOS TRIMESTRES CADA VEZ QUE SE INGRESA UN VALOR
        calcularTotal();
    });
});

function calcularTotal() {
    let suma = 0;

    inputsTrimestre.forEach(input => {

// COVERTIMOS EL VALOR A ENTERO, SI NO ES UN NÚMERO SE CONSIDERA 0
        const valor = parseInt(input.value) || 0;
        suma += valor;
    });

// MOSTRAMOS LA SUMA EN EL CAMPO TOTAL
    inputTotal.value = suma;
}

const input = document.getElementById('miCampoNumerico');
const errorSpan = document.getElementById('error');

input.addEventListener('input', function () {

// ELIMINAMOS CUALQUIER CARÁCTER QUE NO SEA NÚMERO

    this.value = this.value.replace(/[^0-9]/g, '');

// VALIDACION VISUAL DE LA LONGITUD DEL CAMPO

    if (this.value.length === 7) {
        input.style.borderColor = "green";
        errorSpan.style.display = "none";
    } else {
        input.style.borderColor = "red";
    }
});

// VALIDACIÓN DEL FORMULARIO CON JQUERY VALIDATE

  let form = $('#formObjetivo')
  if (form.length) {
    $('#id_metas').attr('value', sessionStorage.getItem('id_metas'))
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
