async function mostrarListaAutos() {
  const listaContainer = document.getElementById('lista-de-autos');
  listaContainer.innerHTML = 'Cargando lista de autos...';

  const data = await obtenerListaAutosFakeAPI();

  if (data && Array.isArray(data)) {
    listaContainer.innerHTML = '<div class="card-list"></div>';
    const cardListContainer = listaContainer.querySelector('.card-list');

    for (const car of data) {
      const imageUrl = await obtenerImagenPixabay(car);
      const listItem = document.createElement('div');
      listItem.className = 'card';
      listItem.innerHTML = `
        <img src="${imageUrl}" alt="${car.car}">
        <div class="card-body">
          <h3 class="card-title">${car.car}</h3>
          <p class="card-text">Modelo: ${car.car_model}</p>
          <p class="card-text">Año: ${car.car_model_year}</p>
          <button class="card-button">Ver Detalles</button>
        </div>
      `;
      cardListContainer.appendChild(listItem);
    }
  } else {
    listaContainer.innerHTML = 'Error al cargar la lista de autos.';
  }
}
