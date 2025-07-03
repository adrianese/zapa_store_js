Proyecto en HTML, CSS y JS. 
Simula una página de una tienda online, de promoción y venta de zapatillas.
Es funcional, que permite a los usuarios explorar productos, aplicar filtros, añadir productos con talles específicos al carrito y comparar diferentes artículos antes de tomar una decisión de compra. 
Posee un Formulario de contacto. 
Preview en: git remote add origin https://adrianese.github.io/zapa_store_js/index.html
 En construcción. AS

---

## Funcionamiento de la Página de Venta de Productos

El sitio web es una **tienda online de productos** ( dirigida a calzado deportivo, dado el concepto de "talle" y "actividad"). La página carga los productos desde un archivo JSON local, los muestra de forma dinámica y permite a los usuarios interactuar con ellos de varias maneras.

---

### Carga y Visualización de Productos

Cuando la página se carga (`DOMContentLoaded`), hace lo siguiente:

1.  **Obtiene los Productos:** Realiza una petición (`fetch`) al archivo `js/datos.json` para obtener la información de todos los productos disponibles. Si hay un error al cargar, se muestra un mensaje.
2.  **Inicializa los Datos:** Una vez que los datos se obtienen, la variable global `productos` se llena con esta información.
3.  **Renderiza los Productos:** La función `renderizarProductos` se encarga de mostrar cada producto en el contenedor principal de la página (`#contenedor`).
    * Cada producto se presenta en una "card" con su imagen, nombre, modelo (derivado de la imagen), precio, actividad (con un ícono representativo) y si está **disponible**.
    * Se incluye un **selector de talle** para cada producto.
    * Para cada producto, se muestra un botón para **"Agregar al carrito"** o **"Quitar del carrito"**, cuyo texto y color cambian dinámicamente según si el producto ya está en el carrito.
    * También se incluye un **checkbox "comparar"** para seleccionar productos con fines de comparación.
4.  **Carga el Carrito:** Se verifica si hay productos guardados en el `sessionStorage` (el carrito se mantiene incluso si el usuario navega a otras páginas dentro del mismo sitio, pero se borra al cerrar la pestaña o el navegador) y los carga en la variable `carrito`.

---

### Funcionalidades Principales

#### 1. Navegación y Filtrado

* **Botón "Cargar":** Hay un botón con ID "cargar" que, al hacer clic, vuelve a renderizar todos los productos y recarga los filtros. Esto funciona como un botón para "reiniciar" los filtros o volver a la vista inicial.
* **Filtros Dinámicos:**
    * La función `cargarFiltros` genera dinámicamente opciones para filtrar productos por **marca** (`filtroMarca`) y **actividad** (`filtroActividad`) basándose en los datos de los productos cargados.
    * La función `aplicarFiltros` toma los valores seleccionados en los filtros y actualiza la vista de productos (`renderizarProductos`) para mostrar solo aquellos que coincidan con los criterios de filtrado.

#### 2. Carrito de Compras

* **Variables:** `carrito` almacena los productos que el usuario ha añadido.
* **Agregar/Quitar del Carrito:** La función `toggleCarrito` maneja la lógica de añadir o quitar productos del `carrito`.
    * Antes de agregar, verifica si el producto está **disponible** y si se ha **seleccionado un talle**. Si no cumple estas condiciones, muestra una alerta al usuario.
    * Si se añade un producto, se incluye el talle seleccionado en el objeto del producto en el carrito.
    * El botón del producto en la interfaz (`renderizarProductos`) cambia su texto y color para reflejar si está en el carrito.
* **Panel del Carrito:**
    * El ícono del carrito (`.carrito`) abre un panel lateral (`#panel-carrito`) que muestra los productos añadidos.
    * La función `actualizarCarritoUI` se encarga de:
        * Listar los productos en el carrito, mostrando su nombre, modelo, actividad, **talle** y precio.
        * Calcular y mostrar el **total** de la compra.
        * Actualizar un contador de productos en el carrito (`#carrito-contador`).
        * Guardar el estado actual del carrito en `sessionStorage` para persistencia.
    * El panel del carrito se oculta automáticamente después de 5 segundos, pero también hay una función `cerrarCarrito` para cerrarlo manualmente.

#### 3. Comparación de Productos

* **Selección para Comparar:** Cada "card" de producto tiene un checkbox "comparar". La función `toggleSeleccion` añade o quita el `id` del producto de la lista `seleccionados` cuando se marca o desmarca el checkbox.
* **Botón "Comparar":** Un botón (`#compararBtn`) y un área (`#compararArea`) se hacen visibles solo cuando hay **dos o más productos seleccionados** para comparar.
* **Vista de Comparación:** Al hacer clic en "Comparar", la función `compararSeleccionados` filtra los productos seleccionados y la función `mostrarComparativa` los presenta en una vista especial, mostrando solo la información relevante para la comparación (imagen, nombre, ID, actividad, disponibilidad).
* **Volver al Catálogo:** Desde la vista de comparación, un botón "Volver al catálogo" (`volver-catalogo`) permite al usuario regresar a la vista principal de todos los productos.

---

### Enlaces o Secciones Adicionales

La página tiene los siguientes enlaces o secciones:

* **Página Principal / Catálogo de Productos:** (Ya implementada, sería la vista principal).
* **Página de Carrito / Checkout:** Aunque ya existe un panel de carrito, es común tener una página dedicada al resumen del carrito y al proceso de pago (checkout).
* **Detalle de Producto:** Podría implementarse una página o modal donde, al hacer clic en un producto, se muestren más detalles, imágenes, descripciones completas, etc.
* **Contacto / Acerca de Nosotros:** Secciones informativas estándar de una tienda online.
* **Términos y Condiciones / Políticas de Privacidad:** Enlaces importantes para cualquier sitio de comercio electrónico.

