const tabs = document.querySelectorAll('.tab');
let cart = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let allProducts = [];

function showTab(id) {
  tabs.forEach(tab => tab.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'products') renderProducts(allProducts);
  if (id === 'favorites') renderFavorites();
  if (id === 'cart') renderCart();
  updateCartCount();
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}

function addToCart(product) {
  cart.push(product);
  updateCartCount();
  alert(`✅ "${product.title}" fue añadido al carrito con éxito 🛒`);
}

function toggleFavorite(product) {
  const exists = favorites.find(p => p.id === product.id);
  if (exists) {
    favorites = favorites.filter(p => p.id !== product.id);
    alert(`❌ "${product.title}" fue eliminado de tus favoritos`);
  } else {
    favorites.push(product);
    alert(`❤️ "${product.title}" fue registrado como favorito`);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderProducts(allProducts);
  renderFavorites();
}

function isFavorite(productId) {
  return favorites.some(p => p.id === productId);
}

function renderProducts(products) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h4>${product.title}</h4>
      <p>$${product.price}</p>
      <button class="addCartBtn">Agregar al carrito</button>
      <button class="favBtn">${isFavorite(product.id) ? 'Quitar de favoritos ❤️' : 'Agregar a favoritos 🤍'}</button>
    `;

    const addCartBtn = card.querySelector('.addCartBtn');
    const favBtn = card.querySelector('.favBtn');

    addCartBtn.addEventListener('click', () => addToCart(product));
    favBtn.addEventListener('click', () => toggleFavorite(product));

    container.appendChild(card);
  });
}

function renderFavorites() {
  const container = document.getElementById('favoriteContainer');
  container.innerHTML = '';

  if (favorites.length === 0) {
    container.innerHTML = '<p style="text-align:center;">No tienes productos favoritos.</p>';
    return;
  }

  favorites.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h4>${product.title}</h4>
      <p>$${product.price}</p>
      <button class="addCartBtn">Agregar al carrito</button>
      <button class="favBtn">Quitar de favoritos ❤️</button>
    `;

    const addCartBtn = card.querySelector('.addCartBtn');
    const favBtn = card.querySelector('.favBtn');

    addCartBtn.addEventListener('click', () => addToCart(product));
    favBtn.addEventListener('click', () => toggleFavorite(product));

    container.appendChild(card);
  });
}

function renderCart() {
  const container = document.getElementById('cartItems');
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>No hay productos en el carrito.</p>';
    return;
  }
  cart.forEach(product => {
    const li = document.createElement('li');
    li.textContent = `${product.title} - $${product.price}`;
    container.appendChild(li);
  });
}

function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');

  searchInput.addEventListener('input', () => {
    let filtered = filterProducts();
    renderProducts(filtered);
  });

  categoryFilter.addEventListener('change', () => {
    let filtered = filterProducts();
    renderProducts(filtered);
  });

  sortFilter.addEventListener('change', () => {
    let filtered = filterProducts();
    renderProducts(filtered);
  });
}

function filterProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;

  let filtered = [...allProducts];

  if (search) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(search));
  }

  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (sort === 'asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
}

async function loadProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();
    allProducts = data;
    renderProducts(allProducts);
    fillCategoryFilter();
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

async function fillCategoryFilter() {
  try {
    const res = await fetch('https://fakestoreapi.com/products/categories');
    const categories = await res.json();
    const select = document.getElementById('categoryFilter');
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
}

// Registro de usuario
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (name && email && password && phone) {
    alert(`✅ ¡Registro exitoso para ${name}!`);
    document.getElementById('registerForm').reset();
  } else {
    alert('⚠️ Por favor completa todos los campos.');
  }
});

// Formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (name && email && message) {
    alert(`📨 Gracias por contactarnos, ${name}. ¡Te responderemos pronto!`);
    document.getElementById('contactForm').reset();
  } else {
    alert('⚠️ Todos los campos son obligatorios.');
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  showTab('home');
  loadProducts();
  setupFilters();
});













  