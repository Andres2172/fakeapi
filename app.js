// Simulación de FakeAPI
const recetas = [
  {
    id: 1,
    titulo: "Pasta Carbonara",
    categoria: "Pasta",
    imagen: "https://source.unsplash.com/featured/?pasta"
  },
  {
    id: 2,
    titulo: "Ensalada César",
    categoria: "Ensalada",
    imagen: "https://source.unsplash.com/featured/?salad"
  },
  {
    id: 3,
    titulo: "Pizza Margarita",
    categoria: "Pizza",
    imagen: "https://source.unsplash.com/featured/?pizza"
  }
];

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function showTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === "mas") {
    renderFavoritos();
    renderTips();
  }
}

// Mostrar recetas
function renderRecetas() {
  const contenedor = document.getElementById("lista-recetas");
  const filtro = document.getElementById("categoriaFiltro").value;
  contenedor.innerHTML = "";

  recetas
    .filter(r => !filtro || r.categoria === filtro)
    .forEach(r => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${r.titulo}</h3>
        <img src="${r.imagen}" alt="${r.titulo}">
        <p><strong>Categoría:</strong> ${r.categoria}</p>
        <button onclick="agregarFavorito(${r.id})">❤️ Favorito</button>
      `;
      contenedor.appendChild(card);
    });
}

// Buscador
document.getElementById("buscador").addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  const resultados = recetas.filter(r => r.titulo.toLowerCase().includes(query));
  const contenedor = document.getElementById("resultado-busqueda");
  contenedor.innerHTML = "";
  resultados.forEach(r => {
    contenedor.innerHTML += `<div class="card"><h3>${r.titulo}</h3><img src="${r.imagen}"></div>`;
  });
});

// CRUD Favoritos
function agregarFavorito(id) {
  if (!favoritos.includes(id)) favoritos.push(id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  alert("Agregado a favoritos");
}

function renderFavoritos() {
  const contenedor = document.getElementById("lista-favoritos");
  contenedor.innerHTML = "";
  const favs = recetas.filter(r => favoritos.includes(r.id));
  favs.forEach(r => {
    contenedor.innerHTML += `
      <div class="card">
        <h3>${r.titulo}</h3>
        <img src="${r.imagen}">
        <button onclick="eliminarFavorito(${r.id})">🗑 Eliminar</button>
      </div>`;
  });
}

function eliminarFavorito(id) {
  favoritos = favoritos.filter(f => f !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  renderFavoritos();
}

// Tips de cocina aleatorios
function renderTips() {
  const tips = [
    "Agrega sal al agua cuando cocines pasta 🍝",
    "Usa limón para evitar que se oxide la fruta 🍋",
    "Precalienta el horno antes de meter tu platillo 🔥",
    "Corta la cebolla bajo agua para no llorar 🧅😭",
    "Guarda las hierbas frescas en un vaso con agua 🌿"
  ];

  const random = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById("tips").innerHTML = `<div class="card"><p>${random}</p></div>`;
}

// Splash
setTimeout(() => {
  document.getElementById("splash").style.display = "none";
}, 2000);

// Eventos
document.getElementById("categoriaFiltro").addEventListener("change", renderRecetas);
document.getElementById("formRegistro").addEventListener("submit", e => {
  e.preventDefault();
  alert("Registro exitoso ✔️");
});

// Inicial
renderRecetas();
renderTips();


  