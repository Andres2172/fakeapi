
// detalle.js
// (Este archivo puede usarse para mostrar detalles en otra vista si se quiere)
export function mostrarDetalleAuto(auto) {
  const contenedor = document.getElementById("lista-de-autos");
  contenedor.innerHTML = `
    <h2>Detalle del Auto</h2>
    <img src="https://source.unsplash.com/600x400/?${encodeURIComponent(auto.car)}%20car" alt="${auto.car}">
    <p><strong>Marca:</strong> ${auto.car}</p>
    <p><strong>Modelo:</strong> ${auto.car_model}</p>
    <p><strong>Año:</strong> ${auto.car_model_year}</p>
    <p><strong>Color:</strong> ${auto.car_color}</p>
  `;
}