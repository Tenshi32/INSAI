$(document).on('click', 'a[data-page]', function (e) {
  e.preventDefault()
  const pageToLoad = $(this).data('page')
  loadContent(pageToLoad, $(this))
})

$(document).ready(function () {
  const pageToLoad = 'home'
  loadContent(pageToLoad, $("a[data-page='home']"))
  consultarPeriodo()
})

function consultarPeriodo() {
  // 1. URL de tu servidor Flask
  const url = LOCALURL + 'Periodo/ViewPeriodo'

  fetch(url, {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => {
      if (!response.ok) throw new Error('Error en la red')
      return response.json()
    })
    .then(data => {
      const tabla = document.getElementById('ViewPeriodo')

      if (data != null) {
        contenido = `Periodo Actual: <button type='button' class='btn btn-warning rounded-pill btn-lg'> ${data.anno}</button>`
      } else {
        contenido = `No hay un periodo activo actualmente.`
        $('#menu-prepoa').hide()
        $('#menu-poa').hide()
      }
      tabla.innerHTML = contenido
    })
    .catch(error => {
      console.error('Hubo un problema con la consulta:', error)
      $('#menu-prepoa').hide()
      $('#menu-poa').hide()
    })
}

// funcion para borrar el cache
function clearCache() {
  if ('caches' in window) {
    caches.keys().then(function (names) {
      for (let name of names) caches.delete(name)
    })
  }
  console.log('Cache cleared!')
}

// Llamar a la función para borrar el caché al cargar la página
window.addEventListener('load', function () {
  clearCache()
})
