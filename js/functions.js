function ocultarFormulario(ArrFoms, Value) {
  for (const Form of ArrFoms) {
    if (Value === Form["id"]) {
      Form["form"].style.display = "block";

      for (const Campos of Form["rules"]) {
        $(Campos).rules("add", { required: true });
      }
    } else {
      Form["form"].style.display = "none";
    }
  }
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

function multiSelect(Obj) {
  const SelectOption = Obj["select"].selectedOptions;
  const Optiontext = Array.from(SelectOption)
    .map((option) => option.text)
    .join("<br> ");
  const OptionValue = Array.from(SelectOption)
    .map((option) => option.value)
    .join(", ");

  const OptionCant = SelectOption.length;

  console.log(SelectOption);

  // Asignar los valores a los campos ocultos
  Obj["codigo"].value = OptionValue;
  Obj["cantidad"].value = OptionCant;
  Obj["texto"].value = Optiontext;
}

//metodo para mandar informacion
function methodSend(Obj) {
  event.preventDefault();

  const data = new FormData(Obj["Formulario"]);

  fetch(Obj["UrlControl"], {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.status == true) {

        Swal.fire(data.mensaje, "", "success");
        setTimeout(1000);

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
//metodo para actualizar informacion
function methodSend(Obj) {
  event.preventDefault();

  const data = new FormData(Obj["Formulario"]);

  fetch(Obj["UrlControl"], {
    method: "PUT",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.status == true) {

        Swal.fire(data.mensaje, "", "success");
        setTimeout(1000);

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

function mostrarFormulario(ArrFoms) {
  if (ArrFoms["valor"] === ArrFoms["valorAdd"]) {
    ArrFoms["form"].style.display = "block";

    for (const Campos of ArrFoms["rules"]) {
      $(Campos).rules("add", { required: true });
    }
  } else {
    ArrFoms["form"].style.display = "none";
  }
}

function radioForm(ArrFoms, Value) {
  Value.forEach((Form) => {
    Form.addEventListener("change", function () {
      ocultarFormulario(ArrFoms, Form.value);
    });
  });
}

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

          console.log(html);
          
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


function loadInsertForm(Obj) {
  event.preventDefault();

  const data = new FormData(Obj["Formulario"]);

  fetch(Obj["UrlControl"], {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.status == true) {

        Swal.fire(data.mensaje, "", "success");
        
        loadContent(Obj["return"], "../../src/load_content.php");

      } else if (data.status == false) {
        Swal.fire("ERROR!", data.mensaje, "error");
      } else {
        Swal.fire("ERROR!", data.message, "warning");
      }
    })

    .catch((error) => {
      console.error("Error:", error);
      if (data.status == false) {
        Swal.fire("ERROR!", data.mensaje, "error");
      }
    });

  return true;
}


function loadEditForm(idObject, pageLoad) {
  $.ajax({
    url: "../../src/load_content.php",
    type: "GET",
    data: {
      page: pageLoad,
      id: idObject,
    },

    success: function (response) {
      $("#content-area").html(response);
    },
    error: function (xhr, status, error) {
      $("#content-area").html(
        '<div class="alert alert-danger" role="alert">Error al cargar el formulario de edición: ' +
          error +
          "</div>"
      );
      console.error("AJAX Error:", status, error, xhr);
    },
  });
}


function deleteObject(productId, UrlControl) {
  $.ajax({
    url: UrlControl,
    type: "POST",
    data: {
      delete: "s",
      id: productId,
    },
    dataType: "json",

    success: function (response) {
      if (response.status) {
        Swal.fire("", response.mensaje, "success");
       
        loadContent("private/productos/lista", "../../src/load_content.php");

      } else {

        Swal.fire("Error", response.mensaje, "error");
      
      }
    },

    error: function (xhr, status, error) {
      Swal.fire("Error", "Hubo un problema al eliminar el producto.", "error");
      console.error("AJAX Error:", status, error, xhr);
    },
  });
}   