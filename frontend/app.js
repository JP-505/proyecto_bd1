const API_URL = "http://localhost:3000";

// Elementos del DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const formContacto = document.getElementById("formularioContacto");

// 1. Función para consultar los productos y mostrarlos en el DOM (READ)
async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    if (!respuesta.ok) {
      throw new Error(`No se pudieron cargar los productos (${respuesta.status})`);
    }
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      const detalles = document.createElement("div");
      const nombre = document.createElement("h3");
      nombre.textContent = producto.nombre;
      const precio = document.createElement("p");
      precio.classList.add("producto-precio");
      precio.textContent = `Precio: $${producto.precio}`;
      const stock = document.createElement("p");
      stock.textContent = `Stock: ${producto.stock} unidades`;
      detalles.append(nombre, precio, stock);

      const acciones = document.createElement("div");
      acciones.classList.add("acciones");
      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.classList.add("btn-editar");
      btnEditar.textContent = "Editar";
      btnEditar.addEventListener("click", () => {
        cargarEnFormulario(producto.id, producto.nombre, producto.precio, producto.stock);
      });

      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.classList.add("btn-eliminar");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () => eliminarProducto(producto.id));

      acciones.append(btnEditar, btnEliminar);
      elemento.append(detalles, acciones);

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    listaProductos.textContent = "No fue posible cargar los productos. Verifica que el servidor esté activo.";
  }
}

// 2. Cargar datos del producto en el formulario para editar (UPDATE - Paso 1)
function cargarEnFormulario(id, nombre, precio, stock) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

// Cancelar edición y restaurar formulario
function cancelarEdicion() {
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

// 3. Guardar o Actualizar según si hay un ID seleccionado (CREATE o UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que la página se recargue

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        // MODO ACTUALIZAR (PUT)
        const respuesta = await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
        if (!respuesta.ok) {
          throw new Error(`No se pudo actualizar el producto (${respuesta.status})`);
        }
      } else {
        // MODO CREAR (POST)
        const respuesta = await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
        if (!respuesta.ok) {
          throw new Error(`No se pudo crear el producto (${respuesta.status})`);
        }
      }

      cancelarEdicion(); // Limpiar formulario y restaurar botones
      await cargarProductos(); // Refrescar la lista en pantalla
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert(`No se pudo guardar el producto: ${error.message}`);
    }
  });
}

// 4. Eliminar un producto (DELETE)
async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });
    if (!respuesta.ok) {
      throw new Error(`No se pudo eliminar el producto (${respuesta.status})`);
    }

    // Si estábamos editando ese mismo producto, cancelamos la edición
    if (productoId.value == id) {
      cancelarEdicion();
    }

    await cargarProductos(); // Refrescar la lista en pantalla
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    alert(`No se pudo eliminar el producto: ${error.message}`);
  }
}

// 5. Formulario de contacto (demostrativo en contacto.html)
if (formContacto) {
  formContacto.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("¡Mensaje de contacto enviado con éxito!");
    formContacto.reset();
  });
}

// Llamado inicial al cargar la página
cargarProductos();