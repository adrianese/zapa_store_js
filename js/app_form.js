formulario.addEventListener('submit', () => {
  setTimeout(() => {
    location.reload();
    
  }, 500); // medio segundo debería ser suficiente
});

formulario.addEventListener('submit', () => {
  setTimeout(() => {
     window.location.href = "base.html";
  }, 1000); // Da tiempo al servidor a procesar el envío
});