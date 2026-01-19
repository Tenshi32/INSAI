$(document).on("click", "a[data-page]", function (e) {
    e.preventDefault();
    const pageToLoad = $(this).data("page");
    loadContent(pageToLoad, $(this));
});

$(document).ready(function() {
    const pageToLoad = "home"; 
    loadContent(pageToLoad, $("a[data-page='home']") );
    consultarLineamientos()

});

document.addEventListener('keyup', e => {
  // Verificamos si el evento proviene del input con id "buscador"
  if (e.target.matches('#buscador')) {
    const valorBusqueda = e.target.value.toLowerCase();
    
    // Seleccionamos todas las filas del cuerpo de la tabla
    document.querySelectorAll('.table tbody tr').forEach(fila => {
      // Comparamos el texto de la fila con lo que escribió el usuario
      const textoFila = fila.textContent.toLowerCase();
      
      // Si el texto coincide, mostramos la fila, si no, la ocultamos
      if (textoFila.includes(valorBusqueda)) {
        fila.style.display = 'table-row';
      } else {
        fila.style.display = 'none';
      }
    });
  }
});

function consultarLineamientos() {
    // 1. URL de tu servidor Flask
    const url = "http://localhost:5000/Periodo/ViewPeriodo";

    fetch(url, {
        method: "GET", 
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la red");
        return response.json(); 
    })
    .then(data => {
      const tabla = document.getElementById("ViewPeriodo");

      if (data != null){
        contenido = `Periodo Actual: <button type='button' class='btn btn-warning rounded-pill btn-lg'> ${data.rango}</button>`;
      } else {
        contenido = `No hay un periodo activo actualmente.`;
      }
      tabla.innerHTML = contenido;
    })
    .catch(error => {
        console.error("Hubo un problema con la consulta:", error);
    });
}

$("#CerrarSession").on("click", function () {

  sessionStorage.clear();

});

caches.keys().then(function(names) {
    for (let name of names) {
        caches.delete(name);
    }
}).then(() => {
    console.log("Caché de Service Workers eliminado.");
});