$(document).on("click", "a[data-page]", function (e) {
    e.preventDefault();
    const pageToLoad = $(this).data("page");
    loadContent(pageToLoad, $(this));
});

$(document).ready(function() {
    const pageToLoad = "home"; 
    loadContent(pageToLoad, $("a[data-page='home']") );
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

/* Codigo de AJAX para buscar en la base de datos
document.getElementById('buscador').addEventListener('keyup', function() {
    let consulta = this.value;

    // Solo busca si hay al menos 2 caracteres
    if (consulta.length >= 1) {
        fetch('buscar.php', {
            method: 'POST',
            body: new URLSearchParams({ 'consulta': consulta })
        })
        .then(response => response.text())
        .then(data => {
            // Reemplazamos el contenido del tbody con los resultados
            document.querySelector('.table tbody').innerHTML = data;
        })
        .catch(error => console.error('Error:', error));
    }
}); */
