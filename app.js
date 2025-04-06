const recetas = [
  { titulo: "Spaghetti Bolognesa", categoria: "Pasta", imagen: "https://source.unsplash.com/400x300/?spaghetti" },
  { titulo: "Pollo al horno", categoria: "Carnes", imagen: "https://source.unsplash.com/400x300/?chicken" },
  { titulo: "Ensalada César", categoria: "Ensaladas", imagen: "https://source.unsplash.com/400x300/?salad" },
  { titulo: "Pizza margarita", categoria: "Pizza", imagen: "https://source.unsplash.com/400x300/?pizza" },
  { titulo: "Tacos de carne", categoria: "Mexicana", imagen: "https://source.unsplash.com/400x300/?tacos" }
];

const tips = [
  "Usa cuchillos afilados para mayor seguridad.",
  "Prueba los condimentos mientras cocinas.",
  "Lava bien frutas y verduras.",
  "Precalienta el horno antes de usarlo.",
  "No sobrecargues la sartén para dorar bien los alimentos."
];

document.addEventListener("DOMContentLoaded", () => {
  activarNavegacion();
  mostrarRecetas();
  mostrarTips();
  generarFiltros();
  mostrarFavoritos();
});

function activarNavegacion() {
  const botones = document.querySelectorAll("nav button");
  const secciones = document.querySelectorAll(".section");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      secciones.forEach(sec => sec.classList.remove("active"));
      const target = document.getElementById(btn.dataset.section);
      if (target) {
        target.classList.add("active");
        if (btn.dataset.section === "favoritos") {
          mostrarFavoritos();
        }
      }
    });
  });
}

function mostrarRecetas(filtro = "") {
  const contenedor = document.getElementById("recetas");
  contenedor.innerHTML = "";

  const lista = filtro ? recetas.filter(r => r.categoria === filtro) : recetas;

  lista.forEach(r => {
    contenedor.innerHTML += `
      <div class="receta">
        <img src="${r.imagen}" alt="${r.titulo}">
        <h3>${r.titulo}</h3>
        <p>Categoría: ${r.categoria}</p>
        <button onclick="toggleFavorito('${r.titulo}')">
          ${esFavorito(r.titulo) ? "Quitar de Favoritos" : "Agregar a Favoritos"}
        </button>
      </div>
    `;
  });
}

function mostrarTips() {
  const contenedor = document.getElementById("tips");
  contenedor.innerHTML = "";
  tips.forEach(tip => {
    contenedor.innerHTML += `<div class="tip">${tip}</div>`;
  });
}

function mostrarFavoritos() {
  const contenedor = document.getElementById("favoritas");
  contenedor.innerHTML = "";
  const favs = obtenerFavoritos();
  const recetasFavoritas = recetas.filter(r => favs.includes(r.titulo));

  if (recetasFavoritas.length === 0) {
    contenedor.innerHTML = "<p>No tienes recetas favoritas aún.</p>";
    return;
  }

  recetasFavoritas.forEach(r => {
    contenedor.innerHTML += `
      <div class="receta">
        <img src="${r.imagen}" alt="${r.titulo}">
        <h3>${r.titulo}</h3>
        <p>Categoría: ${r.categoria}</p>
        <button onclick="toggleFavorito('${r.titulo}')">Quitar de Favoritos</button>
      </div>
    `;
  });
}

function toggleFavorito(titulo) {
  let favoritos = obtenerFavoritos();
  if (favoritos.includes(titulo)) {
    favoritos = favoritos.filter(f => f !== titulo);
  } else {
    favoritos.push(titulo);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarRecetas();
  mostrarFavoritos();
}

function esFavorito(titulo) {
  const favoritos = obtenerFavoritos();
  return favoritos.includes(titulo);
}

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function generarFiltros() {
  const contenedor = document.getElementById("filtros");
  const categorias = [...new Set(recetas.map(r => r.categoria))];

  contenedor.innerHTML = '<strong>Filtrar por categoría:</strong><br>';

  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.style.margin = "5px";
    btn.style.backgroundColor = "#ff944d";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.padding = "0.3rem 0.6rem";
    btn.onclick = () => mostrarRecetas(cat);
    contenedor.appendChild(btn);
  });

  const btnTodos = document.createElement("button");
  btnTodos.textContent = "Todas";
  btnTodos.style.margin = "5px";
  btnTodos.style.backgroundColor = "#aaa";
  btnTodos.style.color = "#fff";
  btnTodos.style.border = "none";
  btnTodos.style.borderRadius = "6px";
  btnTodos.style.padding = "0.3rem 0.6rem";
  btnTodos.onclick = () => mostrarRecetas();
  contenedor.appendChild(btnTodos);
}








  