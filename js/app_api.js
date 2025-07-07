 function traer_dos(){
    const contenido = document.getElementById("contenido");
    fetch('https://randomuser.me.api/1.4/?nat=br,mx?page=1&results=4')
        .then(res => res.json())
            
        .then(res=> {
            console.log(res);
            const user = res.results[10];


            contenido.innerHTML = `
                <h2>${user.name.first} ${user.name.last}</h2>
                <img src="${user.picture.large}" alt="User Picture">
                <p>Email: ${user.email}</p>
                <p>Phone: ${user.phone}</p>
                <p>Nombre de usuario: ${user.login.username}</p>
                <p>Fecha de nacimiento: ${new Date(user.dob.date).toLocaleDate}
            `;
    
        })
    .catch(error => {
                console.error('Error fetching data:', error);       
                contenido.innerHTML = `<p>Error al cargar los datos.</p>`;
});
}


/////////////////////////////////////////////
function traer() {
  const contenido = document.getElementById("contenido");

  //  Llamada a la API para obtener un usuario aleatorio
  fetch("https://randomuser.me/api/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener el usuario");
      }
      return response.json();
    })
    .then((data) => {
      const usuario = data.results[0];

      const nombre = `${usuario.name.title} ${usuario.name.first} ${usuario.name.last}`;
      const imagen = usuario.picture.large;
      const email = usuario.email;
      const pais = usuario.location.country;

      //  Insertamos datos al div
      contenido.innerHTML = `
        <div class="usuario-card">
          <img src="${imagen}" alt="Foto de ${nombre}">
          <h2>${nombre}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>País:</strong> ${pais}</p>
        </div>
      `;
    })
    .catch((error) => {
      contenido.innerHTML = `<p style="color:red;"> Error: ${error.message}</p>`;
    });
}