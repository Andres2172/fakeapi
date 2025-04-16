function mostrarFavoritos() {
  const contentDiv = document.getElementById('favoritos-content');
  contentDiv.innerHTML = '<h2>Favoritos</h2><p>Aquí se mostrarán tus autos favoritos.</p><ul id="lista-favoritos"></ul>';
  cargarFavoritos();
}

function cargarFavoritos() {
  const listaFavoritosElement = document.getElementById('lista-favoritos');
  listaFavoritosElement.innerHTML = '';

  const favoritos = localStorage.getItem('autosFavoritos');
  if (favoritos) {
    const arrayFavoritos = JSON.parse(favoritos);
    if (arrayFavoritos.length > 0) {
      arrayFavoritos.forEach(id => {
        const item = document.createElement('li');
        item.textContent = `Auto con ID: ${id}`;
        listaFavoritosElement.appendChild(item);
      });
    } else {
      listaFavoritosElement.innerHTML = '<p>No tienes autos favoritos.</p>';
    }
  } else {
    listaFavoritosElement.innerHTML = '<p>No hay favoritos guardados.</p>';
  }
}

function agregarAFavoritos(idAuto) {
  let favoritos = localStorage.getItem('autosFavoritos');
  let arrayFavoritos = favoritos ? JSON.parse(favoritos) : [];

  if (!arrayFavoritos.includes(idAuto)) {
    arrayFavoritos.push(idAuto);
    localStorage.setItem('autosFavoritos', JSON.stringify(arrayFavoritos));
    alert(`Auto con ID ${idAuto} agregado a favoritos.`);
    cargarFavoritos();
  } else {
    alert(`El auto con ID ${idAuto} ya está en favoritos.`);
  }
}
