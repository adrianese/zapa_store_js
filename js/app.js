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
    cargarFiltros();                 // 4. Cargar marcas y actividades en selects
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

// ============================
// MUESTRA PRODUCTOS COMPARADOS 
// ============================
function mostrarComparativa(lista) {
  const modal = document.getElementById("modalComparativa");
  const contenido = document.getElementById("contenidoComparativa");
  contenido.innerHTML = '';

  lista.forEach((p) => {
    const card = document.createElement("div");
    card.className = "producto-comparado";
    card.style.cssText = `
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 12px;
      align-items: center;
    `;

    const imagen = document.createElement("img");
    imagen.src = `img/${p.imagen}`;
    imagen.alt = p.nombre;
    imagen.style.cssText = `
      width: 30%;
      object-fit: cover;
      border-radius: 8px;
    `;

    const info = document.createElement("div");
    info.style.width = "70%";
    info.innerHTML = `
      <h3>${p.nombre}</h3>
      <p><strong>Actividad:</strong> ${p.actividad}</p>
      <p><strong>Precio:</strong> $${p.precio.toLocaleString("es-AR")}</p>
      <p><strong>Diseño:</strong> Zapatillas modernas, confortables y resistentes para múltiples disciplinas.</p>
      <p><strong>Descripción:</strong> Capellada respirable, refuerzos técnicos y estilo versátil para un desempeño impecable.</p>
    `;

    card.append(imagen, info);
    contenido.appendChild(card);
  });

  // Botón "Volver al catálogo"
  const contenedorBoton = document.createElement("div");
  contenedorBoton.style.cssText = 'text-align: center; margin-top: 24px;';

  const volver = document.createElement("button");
  volver.innerHTML = "🔙 Volver al catálogo";
  volver.className = "volver-catalogo";
  volver.style.cssText = `
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    background-color: #e08709;
    color: #fff;
    cursor: pointer;
  `;

  volver.onclick = cerrarModalComparativa;

  contenedorBoton.appendChild(volver);
  contenido.appendChild(contenedorBoton);

  modal.classList.remove("oculto");
}
 document.getElementById("cerrarComparativa").onclick = cerrarModalComparativa;

function cerrarModalComparativa() {
  const modal = document.getElementById("modalComparativa");
  modal.classList.add("oculto");

  seleccionados = [];
  document.getElementById("compararArea").style.display = "none";
  renderizarProductos(productos);
  sincronizarBotonesCarrito();
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


//FALTA
// =======================
// CON CARRITO VACIO NO HABILITA COMPRAR
// =======================
 /* window.addEventListener('DOMContentLoaded', () => {
    const comprarBtn = document.querySelector('.boton-comprar');
    const carritoData = JSON.parse(sessionStorage.getItem('carrito') || '[]');

    if (carritoData.length === 0) {
      comprarBtn.addEventListener('click', (e) => {
        e.preventDefault(); // evita redirección
        alert('El carrito está vacío.');
      });
      comprarBtn.classList.add('desactivado'); // opcional para dar estilo visual
    }
  });
*/