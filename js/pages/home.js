$(document).ready(function () {
 
  consultarLineamientosActivos()
  consultarObjetivos()
})

function consultarLineamientosActivos() {
  // 1. URL de tu servidor Flask
  let url = LOCALURL + 'Lineamiento/Consultar?status=1'

  let contenido = ''

  fetch(url, {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => {
      if (!response.ok) throw new Error('Error en la red')
      return response.json()
    })
    .then(data => {
      if (data != null) {
        $('#view-enfoque').text(data.enfoque_estrategico)
        $('#view-normas').text(data.normas_legales)
        $('#view-lineamientos').text(data.lineamientos)

        // 3. Fecha de carga
        const fechaLimpia = new Date(data.fecha_carga).toLocaleDateString()
        $('#view-fecha').html(`<i class='bx bx-time-five me-1'></i> Cargado el: ${fechaLimpia}`)

        $('#view-status').html('<span class="badge bg-label-success">Activo</span>')
        //console.log('Lineamiento activo:', data)

        id_lineamiento = data.id_lineamiento
        sessionStorage.setItem('id_lineamiento', id_lineamiento)
        consultarNotificaciones(id_lineamiento)
      } else {
        contenido = `No hay un periodo activo actualmente.`
        $('#ViewLineamiento').hide()
      }
    })
    .catch(error => {
      console.error('Hubo un problema con la consulta:', error)
      $('#ViewLineamiento').hide()
    })
}

function consultarNotificaciones(id_lineamiento) {
  // 1. URL de tu servidor Flask
  let url = LOCALURL + 'Comunicatorio/Consultar?statu=1&id_lineamiento=' + id_lineamiento

  let contenido = ''

  fetch(url, {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => {
      if (!response.ok) throw new Error('Error en la red')
      return response.json()
    })
    .then(data => {
      if (data != null) {
        console.log(data)

        $('#ViewNotificaciones').show()

        // 1. Textos básicos
        $('#notif-nombre').text(data.nombre)
        $('#notif-descripcion').text(data.descripcion)
        $('#notif-tipo').text(data.tipo)

        // 2. Lógica de colores para Prioridad (Sneat Labels)
        let prioridadClass = 'text-secondary'
        if (data.prioridad === 'Alta') prioridadClass = 'text-danger'
        if (data.prioridad === 'Media') prioridadClass = 'text-warning'
        if (data.prioridad === 'Baja') prioridadClass = 'text-success'

        $('#notif-prioridad').text(data.prioridad).addClass(prioridadClass)

        if (sessionStorage.getItem('id_nivel') <= 2) {
          sessionStorage.setItem('id_notificacion_actual', data.id_comunicatorio)
        }
      } else {
        contenido = `No hay un periodo activo actualmente.`
        $('#ViewNotificaciones').hide()
      }
    })
    .catch(error => {
      console.error('Hubo un problema con la consulta:', error)
      $('#ViewNotificaciones').hide()
    })
}

function consultarObjetivos() {
  let url = LOCALURL + 'CabeceraData/Obtener?id_departamento=' + sessionStorage.getItem('id_departamento') + '&id_lineamiento='+ sessionStorage.getItem('id_lineamiento')
  let contenido
  receptor = document.getElementById('statusPlanificacion')

  MethodGet(url, function (lista) {
    console.log(lista)
    if (lista !== undefined){

      const estados = {
        '1': '<span class="badge bg-label-warning me-1"><i class="bx bx-alert-circle me-1"></i> En Revision </span>',
        '2': '<span class="badge bg-label-success me-1"><i class="bx bx-seal-check me-1"></i>  Aprobada</span>',
        '3': '<span class="badge bg-label-danger me-1">Negada</span>'
      }
      contenido = estados[lista]
      
    }else{
      
      contenido = '<span class="badge bg-label-warning me-1"><i class="bx bx-alert-circle me-1"></i> Pendiente por Cargar </span>'

    }
    receptor.innerHTML = contenido
  })
}
