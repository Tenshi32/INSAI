// Evento GET para Consulta
function consultarAuditorias() {
     
    let url = LOCALURL+'Auditoria/Consultar'

    let contenido = ''
    
    receptor = document.getElementById('tablaAuditoria')
    MethodGet(url, function (lista) {
      lista.forEach(item => {
        contenido += `
          <tr>
              <td>AU-${item.id_auditoria}</td>
              <td>${item.usuario_nombre || 'Sistema'}</td>
              <td>${item.fecha} </td> 
              <td><small class="text-muted">${item.hora}</small></td> 
              <td>${item.descripcion.substring(0, 30)}...</td>
              <td>
                  <a class="dropdown-item VerDetalle" 
                     javascript:void(0);" 
                     data-id="${item.id_auditoria}"
                     data-usuario="${item.usuario_nombre}"
                     data-fecha="${item.fecha}"
                     data-hora="${item.hora}"
                     data-accion="${item.accion}"
                     data-descripcion="${item.descripcion}">
                     <i class="bx bx-eyes me-1"></i> Ver 
                  </a>
              </td>
          </tr>`
      })

      receptor.innerHTML = contenido

    })
}

$(document).ready(function () {
  consultarAuditorias()

  $(document).on('click', '.VerDetalle', function (event) {
    // 1. Obtener datos del atributo data- del botón clickeado
    const d = $(this).data()

    // 2. Modificar el título y el cuerpo del modal
    $('#exampleModalLabel1').html(`<span class="text-muted fw-light">Detalle /</span> Registro AU-${d.id}`)

    const htmlDetalle = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Usuario:</label>
                <p class="form-control-plaintext border-bottom">${d.usuario}</p>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Fecha y Hora:</label>
                <p class="form-control-plaintext border-bottom">${d.fecha} | ${d.hora}</p>
            </div>
            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">Acción Realizada:</label>
                <p class="form-control-plaintext border-bottom">${d.accion}</p>
            </div>
            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">Descripción Completa:</label>
                <div class="p-3 bg-light rounded" style="min-height: 100px;">
                    ${d.descripcion}
                </div>
            </div>
        </div>
    `

    // 3. Insertar el contenido en el modal-body
    $('#LineamientoModal .modal-body').html(htmlDetalle)

    // 4. Abrir el modal
    $('#LineamientoModal').modal('show')
  })
})
