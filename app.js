// script.js

const API_URL = "https://myfakeapi.com/api/cars/";
const PIXABAY_API_KEY = "49710500-3a2411a573b4b0d71cb32f17f";

// Genera una imagen desde Pixabay en base a marca, modelo y año
const carImage = (car) => {
  const query = `${car.car} ${car.car_model} ${car.car_model_year}`;
  return `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`;
};

let cars = [];

// Tabs
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

// Fetch cars
async function fetchCars() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    cars = data.cars;
    await displayCars(cars);
    fillBrandFilter(cars);
  } catch (err) {
    document.getElementById("error-message").textContent = "Error al cargar autos.";
  }
}

// Fetch imagen de Pixabay
async function obtenerImagenPixabay(car) {
  const res = await fetch(carImage(car));
  const data = await res.json();
  if (data.hits && data.hits.length > 0) {
    return data.hits[0].webformatURL;
  } else {
    return "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
  }
}

// Display cars
async function displayCars(carList, containerId = "product-list") {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  for (const car of carList) {
    const imageUrl = await obtenerImagenPixabay(car);
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${imageUrl}" alt="${car.car}">
      <h3>${car.car}</h3>
      <p>Modelo: ${car.car_model}</p>
      <p>Año: ${car.car_model_year}</p>
      <p>Color: ${car.car_color}</p>
      <button onclick='addToFavorites(${JSON.stringify(car)})'>Agregar a favoritos</button>
    `;
    container.appendChild(div);
  }
}

// Favoritos
function addToFavorites(car) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (!favoritos.some(fav => fav.id === car.id)) {
    favoritos.push(car);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    alert("Agregado a favoritos");
    loadFavorites();
  }
}

function loadFavorites() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  displayCars(favoritos, "favorites-list");
}

// Buscar
const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = cars.filter(car => car.car.toLowerCase().includes(term) || car.car_model.toLowerCase().includes(term));
  displayCars(filtered, "filtered-cars");
});

brandFilter.addEventListener("change", () => {
  const selected = brandFilter.value;
  const filtered = cars.filter(car => car.car === selected);
  displayCars(filtered, "filtered-cars");
});

function fillBrandFilter(carList) {
  const brands = [...new Set(carList.map(car => car.car))];
  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });
}

// Auto aleatorio
function mostrarAutoSugerido() {
  const random = cars[Math.floor(Math.random() * cars.length)];
  displayCars([random], "auto-sugerido");
}

// Registro
const registroForm = document.getElementById("registroForm");
registroForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("¡Registro exitoso!");
  registroForm.reset();
});

// Inicializar
fetchCars();
loadFavorites();









  