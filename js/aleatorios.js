function mostrarAleatorio() {
  const contentDiv = document.getElementById('aleatorio-content');
  const numeroAleatorio = Math.random();
  contentDiv.innerHTML = `
    <h2>Contenido Aleatorio</h2>
    <p>Número aleatorio: ${numeroAleatorio.toFixed(3)}</p>
    <p>Aquí podrías generar contenido aleatorio relacionado con autos.</p>
  `;
}

