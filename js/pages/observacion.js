// EVENTO GET PARA CONSULTAR Y MOSTRAR LOS OBJETIVOS DE LA UA EN LA TABLA

function consultarObjetivos() {
  let url = LOCALURL + 'Observacion/Consultar?tipo_observacion=planificacion&id_departamento='+sessionStorage.getItem('id_departamento')

  let contenido = ''

  receptor = document.getElementById('tablaPlanificacionObservaciones')

  MethodGet(url, function (lista) {
      lista.forEach(item => {

      if (item.fecha_create) {
        const fechaObj = new Date(item.fecha_create)
        if (!isNaN(fechaObj)) {
          const yyyy = fechaObj.getUTCFullYear()
          const mm = String(fechaObj.getUTCMonth() + 1).padStart(2, '0')
          const dd = String(fechaObj.getUTCDate()).padStart(2, '0')
          fecha_observacion = `${dd}-${mm}-${yyyy}`
        }
      }

      contenido += `
          <tr>
              <td>${item.id_observacion}</td>
              <td><span class="fw-bold">${item.actividad}</span><br>
              <span class="badge bg-label-info">${item.sector}</span></td>
              <td>${item.objetivos}</td>
              <td>${fecha_observacion}</td>
              <td>
                <div class="dropdown">
                  <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                  </button>
                  <div class="dropdown-menu">
                    <a class="dropdown-item VerPlanifacion" 
                       data-unico="${item.id_cabecera}"
                       data-status="${item.statu_cabecera}"
                       data-actividad="${item.actividad}"
                       data-anno_fiscal="${item.anno_fiscal}"
                       data-enfoque_estrategico="${item.enfoque_estrategico}"
                       data-nombre_departamento="${item.nombre_departamento}"
                       data-nombre_tipo_poa="${item.nombre_tipo_poa}"
                       data-normas_legales="${item.normas_legales}"
                       data-objetivos="${item.objetivos}"
                       data-observacion="${item.observacion}"
                       data-sector="${item.sector}">
                       <i class="bx bx-toggle-big-right me-1"></i> Ver
                    </a>
                  </div>
                </div>
              </td>
          </tr>
      `
    })

    receptor.innerHTML = contenido
  })
}

// EVENTO POST PARA CREAR UN NUEVO OBJETIVO DE LA UA

$(document).on('click', '.VerPlanifacion', function (event) {
  //  OBTENER LOS DATOS DEL ELEMENTO SELECCIONADO A TRAVÉS DE LOS ATRIBUTOS DATA

  const d = $(this).data()
  $('#view_anno_fiscal').text(d.anno_fiscal)
  $('#view_sector').text(d.sector)
  $('#view_enfoque_estrategico').text(d.enfoque_estrategico)
  $('#view_objetivos').text(d.objetivos)
  $('#view_actividad').text(d.actividad)
  $('#view_departamento').text(d.nombre_departamento)
  $('#tipo_proyecto_view').text(d.nombre_tipo_poa)
  $('#view_observacion').text(d.observacion)

  // ABRIR EL MODAL MANUEALMENTE
  $('#ObjetivoModal').modal('show')
})


$(document).ready(function () {
  consultarObjetivos()

})
