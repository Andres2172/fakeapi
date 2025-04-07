const API_URL = "https://fakestoreapi.com/products";
let allProducts = [];
let cart = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function showTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Cargar productos y categorías
async function loadProducts() {
  const res = await fetch(API_URL);
  allProducts = await res.json();
  renderProducts(allProducts);
}

async function loadCategories() {
  const res = await fetch(`${API_URL}/categories`);
  const categories = await res.json();
  const categoryFilter = document.getElementById("categoryFilter");
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// Mostrar productos
function renderProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    const isFavorite = favorites.some(f => f.id === p.id);
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Agregar 🛒</button>
      <button onclick="toggleFavoriteById(${p.id})">
        ${isFavorite ? "Quitar ❤️" : "Favorito 🤍"}
      </button>
    `;
    container.appendChild(card);
  });
}

// Buscar productos
document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p => p.title.toLowerCase().includes(value));
  renderProducts(filtered);
});

// Filtrar por categoría
document.getElementById("categoryFilter").addEventListener("change", e => {
  const val = e.target.value;
  const filtered = val ? allProducts.filter(p => p.category === val) : allProducts;
  renderProducts(filtered);
});

// Ordenar por precio
document.getElementById("sortPrice").addEventListener("change", e => {
  const val = e.target.value;
  let sorted = [...allProducts];
  if (val === "asc") sorted.sort((a, b) => a.price - b.price);
  if (val === "desc") sorted.sort((a, b) => b.price - a.price);
  renderProducts(sorted);
});

// Agregar al carrito
function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

// Actualizar carrito
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.title} - $${p.price}`;
    cartItems.appendChild(li);
    total += p.price;
  });
  document.getElementById("cartCount").textContent = cart.length;
  cartTotal.textContent = total.toFixed(2);
}

// Agregar o quitar favoritos
function toggleFavoriteById(id) {
  const product = allProducts.find(p => p.id === id);
  const exists = favorites.find(f => f.id === id);
  if (exists) {
    favorites = favorites.filter(f => f.id !== id);
  } else {
    favorites.push(product);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
  renderProducts(allProducts);
}

// Mostrar favoritos
function renderFavorites() {
  const favContainer = document.getElementById("favoriteContainer");
  favContainer.innerHTML = "";
  favorites.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p>$${p.price}</p>
      <button onclick="toggleFavoriteById(${p.id})">Quitar ❤️</button>
    `;
    favContainer.appendChild(card);
  });
}

// Registro de usuario
document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("¡Usuario registrado con éxito!");
  e.target.reset();
});

// Inicializar
loadProducts();
loadCategories();
renderFavorites();










  