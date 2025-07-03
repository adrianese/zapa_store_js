let productos = [];
let seleccionados = [];
let carrito = [];

// =========================
// INICIALIZACIÓN PRINCIPAL
// =========================
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("./js/datos.json");
    const data = await res.json();
    productos = data.datos;

    cargarCarrito();                  // 1. Restaurar carrito desde sessionStorage
    actualizarCarritoUI(true);       // 2. Refrescar UI sin abrir el panel
    mostrarTodosLosProductos();
    cargarFiltros();                 // 5. Cargar marcas y actividades en selects
  } catch (err) {
    document.getElementById("contenedor").innerHTML = "Error al cargar productos.";
    console.error(err);
  }

    document.getElementById("compararBtn").addEventListener("click", compararSeleccionados);
    document.getElementById('icono-carrito').addEventListener('click', mostrarPanelCarrito);
    

    document.getElementById("cargar").addEventListener("click", () => {
    document.getElementById("filtroMarca").value = '';
    document.getElementById("filtroActividad").value = '';
    mostrarTodosLosProductos();
    });
  
  });


// ==========================
// CARGA DE FILTROS DE INICIO
// ==========================
function cargarFiltros() {
  const selectMarca = document.getElementById("filtroMarca");
  const selectActividad = document.getElementById("filtroActividad");

  selectMarca.innerHTML = '<option value="">Todas las marcas</option>';
  selectActividad.innerHTML = '<option value="">Todas las actividades</option>';

  const marcas = [...new Set(productos.map((p) => p.nombre))];
  const actividades = [...new Set(productos.map((p) => p.actividad))];
  marcas.forEach((marca) => {
      const op = document.createElement("option");
      op.value = marca;
      op.textContent = marca;
      selectMarca.appendChild(op);
    });
    actividades.forEach((act) => {
    const op = document.createElement("option");
    op.value = act;
    op.textContent = act;
    selectActividad.appendChild(op);
  });

  selectMarca.addEventListener("change", aplicarFiltros);
  selectActividad.addEventListener("change", aplicarFiltros);
}


function aplicarFiltros() {
  const marca = document.getElementById("filtroMarca").value;
  const actividad = document.getElementById("filtroActividad").value;

  const filtrados = productos.filter(
    (p) => (marca === "" || p.nombre === marca) && (actividad === "" || p.actividad === actividad)
  );
  renderizarProductos(filtrados);
  sincronizarBotonesCarrito();
}


// ==========================
// MUESTRA TODOS LOS PRODUCTOS
// ==========================
function mostrarTodosLosProductos() {
  renderizarProductos(productos);
  sincronizarBotonesCarrito();
}

// ==========================
// MUESTRA PRODUCTOS FILTRADOS
// ==========================


function renderizarProductos(lista) {
  const contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = '';
  seleccionados = [];

  lista.forEach((producto) => {
    const div = document.createElement("div");
    div.className = "producto";

    const botonCarrito = document.createElement("button");
    botonCarrito.setAttribute("data-id", producto.id);
    botonCarrito.textContent = "Agregar al carrito";
    botonCarrito.classList.add("boton-amarillo-block");
    botonCarrito.style.backgroundColor = "#e08709";
    botonCarrito.onclick = () => toggleCarrito(producto.id, botonCarrito);

    div.innerHTML = `
      <div class="encabezado-card">
        <label class="comparar-check">
          <input type="checkbox" onchange="toggleSeleccion(${producto.id})">
        comparar</label>
      </div>
      <div class="anuncio">
        <picture>
          <source srcset="img/${producto.imagen}" type="image/jpeg">
          <img src="img/${producto.imagen}" alt="${producto.nombre}">
        </picture>
        <div class="contenido-anuncio">
          <h2 class="producto-nombre">${producto.nombre.toUpperCase()}</h2>
          <p class="modelo">modelo: ${producto.imagen.split(".")[0]}</p>
          <p class="precio">$ ${producto.precio.toLocaleString("es-AR")}</p>
          <div class="iconos-caracteristicas icono-alinear">
            <div class="icono-actividad">
              <img src="img/${producto.actividad.replaceAll(" ", "_")}.svg" alt="${producto.actividad}" title="${producto.actividad}">
              <p class="modelo">${producto.actividad}</p>
            </div>
            <div class="estado-disponible">
              <img src="img/${producto.disponible ? "true" : "false"}.svg" alt="${producto.disponible}">
              <p class="modelo">${producto.disponible ? "disponible" : "no disponible"}</p>
            </div>
          </div>
          <div class="selector-talle">
            <label for="talle-${producto.id}"></label>
            <select id="talle-${producto.id}">
              <option value="" disabled selected>Seleccione Talle</option>
              ${Array.from({ length: 11 }, (_, i) => `<option value="${35 + i}">${35 + i}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>
    `;

    div.appendChild(botonCarrito);
    contenedor.appendChild(div);
  });

  actualizarBotonComparar();
}


// ===================
// FUNCIONES CARRITO
// ===================

function toggleCarrito(id, boton) {
  const index = carrito.findIndex((p) => p.id === id);
  const talleSelect = document.getElementById(`talle-${id}`);
  const talleElegido = talleSelect ? talleSelect.value : null;

  if (index >= 0) {
    carrito.splice(index, 1);
    boton.textContent = "Agregar al carrito";
    boton.style.backgroundColor = "#e08709";
  } else {
    const producto = productos.find((p) => p.id === id);
    if (!producto.disponible) {
      alert("Este producto no está disponible actualmente.");
      return;
    }
    if (!talleElegido) {
      alert("Por favor, seleccioná un talle antes de continuar.");
      return;
    }

    carrito.push({ ...producto, talle: talleElegido });
    boton.textContent = "Quitar del carrito";
    boton.style.backgroundColor = "#ffd6cc";
  }

  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarritoUI();
}

function actualizarCarritoUI(silent = false) {
  const lista = document.getElementById("carrito");
  const totalContainer = document.getElementById("total");
  const contador = document.getElementById("carrito-contador");

  lista.innerHTML = '';
  let total = 0;

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} modelo: ${item.imagen.split(".")[0]} -(${item.actividad}) - Talle ${item.talle} - $ ${item.precio.toLocaleString("es-AR")}`;
    lista.appendChild(li);
    total += item.precio;
  });

  totalContainer.textContent = `Total: $${total.toLocaleString("es-AR")}`;
  contador.textContent = carrito.length;
  sessionStorage.setItem("carrito", JSON.stringify(carrito));

  if (!silent) mostrarPanelCarrito();
}

function cargarCarrito() {
  const guardado = sessionStorage.getItem("carrito");
  carrito = guardado ? JSON.parse(guardado) : [];
}

function mostrarPanelCarrito() {
  const panel = document.getElementById("panel-carrito");
  panel.classList.remove("oculto");
  panel.classList.add("visible");

  clearTimeout(mostrarPanelCarrito.timeout);
  mostrarPanelCarrito.timeout = setTimeout(() => {
    cerrarCarrito();
  }, 4000);
}

function cerrarCarrito() {
  const panel = document.getElementById("panel-carrito");
  panel.classList.remove("visible");
  setTimeout(() => panel.classList.add("oculto"), 300);
}

function vaciarCarrito() {
  carrito = [];
  sessionStorage.removeItem("carrito");
  actualizarCarritoUI();
  renderizarProductos(productos);
  sincronizarBotonesCarrito();
  cerrarCarrito();
}

function actualizarBotonComparar() {
  const area = document.getElementById("compararArea");
  area.style.display = seleccionados.length >= 2 ? "block" : "none";
}

function toggleSeleccion(id) {
  if (seleccionados.includes(id)) {
    seleccionados = seleccionados.filter((x) => x !== id);
  } else {
    seleccionados.push(id);
  }
  actualizarBotonComparar();
}

function compararSeleccionados() {
  const comparados = productos.filter((p) => seleccionados.includes(p.id));
  mostrarComparativa(comparados);
}


function sincronizarBotonesCarrito() {
  carrito.forEach(item => {
    const boton = document.querySelector(`button[data-id='${item.id}']`);
    if (boton) {
      boton.textContent = 'Quitar del carrito';
      boton.style.backgroundColor = '#ffd6cc';
    }
  });
}


// ========================================
// MUESTRA PRODUCTOS COMPARADOS no funciona
// =======================================
function mostrarComparativa(lista) {
  const contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = '';

  const wrapper = document.createElement("div");
  wrapper.className = "comparativa-wrapper";
  wrapper.style.display = "flex";
  wrapper.style.gap = "16px";
  wrapper.style.overflowX = "auto";

  lista.forEach((p) => {
    const div = document.createElement("div");
    div.className = "producto comparado";
    div.innerHTML = `
      <img src="img/${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p><strong>ID:</strong> ${p.id}</p>
      <p><strong>Actividad:</strong> ${p.actividad}</p>
      <p><strong>Disponible:</strong> ${p.disponible ? 'Sí' : 'No'}</p>
      <p><strong>Precio:</strong> $${p.precio.toLocaleString("es-AR")}</p>
      <p><strong>Talle:</strong> ${p.talle || '—'}</p>
    `;
    wrapper.appendChild(div);
  });

  const volver = document.createElement("button");
  volver.textContent = "🔙 Volver al catálogo";
  volver.className = "volver-catalogo";
  volver.onclick = () => {
    renderizarProductos(productos);
    sincronizarBotonesCarrito(); // importante para mantener botón toggle al volver
  };

  contenedor.appendChild(wrapper);
  contenedor.appendChild(volver);
}




// =======================
// FLECHA DE VOLVER ARRIBA
// =======================

window.addEventListener("scroll", () => {
  const flecha = document.querySelector('.flotante');
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  if (scrollY > 600) {
    flecha.classList.add("visible");
  } else {
    flecha.classList.remove("visible");
  }
});