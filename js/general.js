function mostrarSeccion(seccion) {
  document.getElementById('lista-de-autos').style.display = 'none';
  document.getElementById('usuario-content').style.display = 'none';
  document.getElementById('aleatorio-content').style.display = 'none';
  document.getElementById('favoritos-content').style.display = 'none';
  document.getElementById('api-content').style.display = 'none';
  document.getElementById('detalle-content').style.display = 'none';

  if (seccion === 'home') {
    document.getElementById('lista-de-autos').style.display = 'block';
    mostrarListaAutos();
  } else if (seccion === 'usuario') {
    document.getElementById('usuario-content').style.display = 'block';
    mostrarUsuario();
  } else if (seccion === 'aleatorio') {
    document.getElementById('aleatorio-content').style.display = 'block';
    mostrarAleatorio();
  } else if (seccion === 'favoritos') {
    document.getElementById('favoritos-content').style.display = 'block';
    mostrarFavoritos();
  } else if (seccion === 'api') {
    document.getElementById('api-content').style.display = 'block';
    mostrarApi();
  }
}

// Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.error('❌ Error al registrar el Service Worker:', err));
  });
}
