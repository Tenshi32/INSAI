function RastrearDocumentos(Doc) {
  $.ajax({
    type: "POST",
    url: Doc["url"],
    data: Doc.data,

    success: function (r) {
      $("#MostrarDocumento").html(r);

      $("#CargarDocumento").hide();
    },
  });
}

function togglepassword() {
  var password = document.getElementById("Passwd");
  var confirm_password = document.getElementById("PasswdConfirm");
  if (password.type === "password") {
    password.type = "text";
    confirm_password.type = "text";
  } else {
    confirm_password.type = "password";
    password.type = "password";
  }
}

////////////////////////////////////////////////////

//Metodo para Enviar
function methodSend(Obj, callback = null) {
  event.preventDefault();


  const data = (Obj["Formulario"] instanceof FormData) 
             ? Obj["Formulario"] 
             : new FormData(Obj["Formulario"]);

  fetch(Obj["UrlControl"], {
    method: Obj["Method"],
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.status == true) {

        Swal.fire(data.mensaje, "", "success");
        setTimeout(1000);

        // Si pasamos una función, la ejecutamos ahora
        if (callback && typeof callback === "function") {
          callback(data); 
        }

      } else if (data.status == false) {
        Swal.fire("ERROR!", data.mensaje, "error");
      } else {
        Swal.fire("ERROR!", data.message, "warning");
      }
    })

    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("ERROR!", "No se pudo conectar con el servidor", "error");
    });

  return true;
}

//Metodo para Buscar
function MethodGet(url, callback) {
    fetch(url, {
        method: "GET", 
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la red");
        return response.json(); 
    })
    .then(data => {

      listaComunicatorios = Object.values(data);

      callback(listaComunicatorios);

    })

    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("ERROR!", "No se pudo conectar con el servidor", "error");
    });

  return true;
}

//Metodo para enviar archivos
function methodSendFile(Obj, callback = null) {
  event.preventDefault();


  const data = (Obj["Formulario"] instanceof FormData) 
             ? Obj["Formulario"] 
             : new FormData(Obj["Formulario"]);

  fetch(Obj["UrlControl"], {
    method: Obj["Method"],
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.status == true) {

        // Si pasamos una función, la ejecutamos ahora
        if (callback && typeof callback === "function") {
          callback(data); 
        }

      } else if (data.status == false) {
        Swal.fire("ERROR!", data.mensaje, "error");
      } else {
        Swal.fire("ERROR!", data.message, "warning");
      }
    })

    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("ERROR!", "No se pudo conectar con el servidor", "error");
    });

  return true;
}

// Función para cargar el contenido
async function loadContent(pageName, elementClicked = null) {

    const contentArea = $("#content-area");
    
    if (elementClicked) {

      $(".menu-item").removeClass("active"); 
      elementClicked.closest(".menu-item").addClass("active");
      
    }

    const loader = $("#loader-overlay");
    loader.fadeIn(200);

    // 1. Validación de seguridad
/*     const regex = /^[a-zA-Z0-9\-\/]+$/;
    if (!regex.test(pageName)) {
        pageName = "../public/404";
    } */

    // 2. Construir la ruta (Ajusta la ruta a tu carpeta de páginas)
    const filepath = `${pageName}.html`;

    // 3. Simular el "include" usando fetch
    try {

        await new Promise(resolve => setTimeout(resolve, 500));
        const response = await fetch(filepath);
        
        if (response.ok) {

          const html = await response.text();
          contentArea.hide().html(html).fadeIn(500);
          
        } else {

          throw new Error("Página no encontrada");

        }
        
    } catch (error) {

        // Equivalente al include del 404.php
        $.get("../public/404.php", function(data) {
            contentArea.html(data);
        });

    } finally {
        // 2. Ocultar el loader SIEMPRE (haya error o no)
        loader.fadeOut(300);
    }
}