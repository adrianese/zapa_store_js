
  window.addEventListener('DOMContentLoaded', () => {
    const mensaje = document.getElementById('mensaje');
    const guardado = sessionStorage.getItem('carrito');
    const carrito = guardado ? JSON.parse(guardado) : [];

    if (!mensaje || carrito.length === 0) return;

    const resumen = carrito.map((item, i) => 
      `${i + 1}. ${item.nombre} (${item.actividad}) - Talle: ${item.talle} - $${item.precio.toLocaleString('es-AR')}`
    ).join('\n');

    const total = carrito.reduce((acc, item) => acc + item.precio, 0);

    mensaje.value = `${resumen}\n\nTotal: $${total.toLocaleString('es-AR')}`;
  });

  const formulario = document.querySelector('.formulario');

  if (formulario) {
    formulario.addEventListener('submit', () => {
      sessionStorage.removeItem('carrito'); // borra el carrito
    });
  }
