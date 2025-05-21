function mostrarUsuario() {
  const contentDiv = document.getElementById('usuario-content');
  contentDiv.innerHTML = `
    <h2>Perfil de Usuario</h2>
    <p>Aquí podrías mostrar información del usuario.</p>
    <ul>
      <li>Nombre: Usuario Ejemplo</li>
      <li>Email: usuario@ejemplo.com</li>
    </ul>
  `;
}
