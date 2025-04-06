document.addEventListener('DOMContentLoaded', () => {
  // --- Criterio 7: Splash Screen ---
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
      setTimeout(() => {
          splashScreen.classList.add('hidden');
      }, 1500); // Simula una carga de 1.5 segundos
  }

  // --- Navegación con Tabs ---
  const tabs = document.querySelectorAll('.tabs a');
  const contentSections = document.querySelectorAll('.content');

  function showContent(id) {
      contentSections.forEach(section => {
          section.classList.remove('active');
      });
      const targetSection = document.getElementById(id);
      if (targetSection) {
          targetSection.classList.add('active');
      }
  }

  tabs.forEach(tab => {
      tab.addEventListener('click', function(event) {
          event.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          showContent(targetId);
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
      });
  });

  // Activar la primera pestaña al cargar la página
  if (tabs.length > 0 && contentSections.length > 0) {
      tabs[0].classList.add('active');
      contentSections[0].classList.add('active');
  }

  // Menú Responsive
  const menuToggle = document.querySelector('.menu-toggle');
  const mainMenu = document.getElementById('main-menu');

  if (menuToggle && mainMenu) {
      menuToggle.addEventListener('click', () => {
          const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
          menuToggle.setAttribute('aria-expanded', !expanded);
          mainMenu.classList.toggle('open');
      });
  }

  // --- Criterio 5: Listar elementos desde la API asignada (Spoonacular) ---
  const API_KEY = '623c2c310c094ec1a33e72c7203d9b26';
  const BASE_URL = 'https://api.spoonacular.com/recipes';
  const recipeListContainer = document.getElementById('lista-recetas');
  const categoryListContainer = document.getElementById('lista-categorias');

  async function fetchRecipes(query = 'popular', filters = {}) {
      let apiUrl = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&number=20`; // Obtener 20 recetas por defecto
      if (query !== 'popular') {
          apiUrl += `&query=${query}`;
      }
      if (filters.cuisine) {
          apiUrl += `&cuisine=${filters.cuisine}`;
      }
      if (filters.diet) {
          apiUrl += `&diet=${filters.diet}`;
      }
      if (filters.type) {
          apiUrl += `&type=${filters.type}`;
      }

      try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          displayRecipes(data.results);
          localStorage.setItem('allRecipes', JSON.stringify(data.results)); // Guardar para filtrado local
          displayRecipeCategories(data.results); // Simulación de categorías
      } catch (error) {
          console.error('Error fetching recipes:', error);
          recipeListContainer.innerHTML = '<p class="error-message">Error al cargar las recetas.</p>';
      }
  }

  function displayRecipes(recipes) {
      recipeListContainer.innerHTML = '';
      if (recipes && recipes.length > 0) {
          recipes.forEach(recipe => {
              const recipeCard = document.createElement('div');
              recipeCard.classList.add('recipe-card');
              const imageUrl = recipe.image ? `https://spoonacular.com/recipeImages/${recipe.image}?apiKey=${API_KEY}&width=312&height=231` : 'placeholder.png'; // Usar placeholder si no hay imagen

              recipeCard.innerHTML = `
                  <h3>${recipe.title}</h3>
                  <img src="${imageUrl}" alt="${recipe.title}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;">
                  <p class="prep-time">Listo en: ${recipe.readyInMinutes || 'N/A'} min</p>
                  <p class="servings">Porciones: ${recipe.servings || 'N/A'}</p>
                  <button class="favorite-button" data-id="${recipe.id}">
                      ${isFavorite(recipe.id) ? '⭐' : '☆'}
                  </button>
              `;
              recipeListContainer.appendChild(recipeCard);
          });
          attachFavoriteListeners();
      } else {
          recipeListContainer.innerHTML = '<p class="mensaje-vacio">No se encontraron recetas.</p>';
      }
  }

  function displayRecipeCategories(recipes) {
      // Simulación básica de categorías basadas en la primera receta (esto necesitaría una lógica más robusta)
      if (recipes && recipes.length > 0) {
          const sampleRecipeId = recipes[0].id;
          fetchRecipeInformation(sampleRecipeId);
      }
  }

  async function fetchRecipeInformation(recipeId) {
      const apiUrl = `${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`;
      try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data && data.dishTypes) {
              const categories = [...new Set(data.dishTypes)];
              categoryListContainer.innerHTML = '';
              categories.forEach(category => {
                  const listItem = document.createElement('li');
                  const button = document.createElement('button');
                  button.textContent = category;
                  button.dataset.category = category.toLowerCase();
                  button.addEventListener('click', () => filterRecipes('type', category.toLowerCase()));
                  listItem.appendChild(button);
                  categoryListContainer.appendChild(listItem);
              });
          }
      } catch (error) {
          console.error('Error fetching recipe information:', error);
      }
  }

  fetchRecipes(); // Cargar recetas populares al inicio

  // --- Criterio 3: Buscador ---
  const buscarRecetaInput = document.getElementById('buscar-receta');
  const botonBuscar = document.getElementById('boton-buscar');

  botonBuscar.addEventListener('click', () => {
      const searchTerm = buscarRecetaInput.value.toLowerCase();
      fetchRecipes(searchTerm);
  });

  buscarRecetaInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          botonBuscar.click();
      }
  });

  // --- Criterio 4: Implementar un filtro ---
  const filtrarPorSelect = document.getElementById('filtrar-por');
  const valorFiltroInput = document.getElementById('valor-filtro');
  const botonFiltrar = document.getElementById('boton-filtrar');

  botonFiltrar.addEventListener('click', () => {
      const filterType = filtrarPorSelect.value;
      const filterValue = valorFiltroInput.value.toLowerCase();
      fetchRecipes('popular', {[filterType]: filterValue});
  });

  function filterRecipes(type, value) {
      fetchRecipes('popular', {[type]: value});
  }

  // --- Criterio 10: Implementar un CRUD de favoritos en almacenamiento local ---
  const FAVORITES_KEY = 'favoriteRecipes';
  const contenedorFavoritos = document.getElementById('contenedor-favoritos');

  function getFavorites() {
      const favorites = localStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
  }

  function saveFavorites(favorites) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      updateFavoritesDisplay();
      updateRecipeFavoriteButtons();
  }

  function isFavorite(recipeId) {
      return getFavorites().includes(recipeId);
  }

  function addToFavorites(recipeId) {
      const favorites = getFavorites();
      if (!favorites.includes(recipeId)) {
          favorites.push(recipeId);
          saveFavorites(favorites);
      }
  }

  function removeFromFavorites(recipeId) {
      const favorites = getFavorites().filter(id => id !== recipeId);
      saveFavorites(favorites);
  }

  function updateRecipeFavoriteButtons() {
      const recipeFavoriteButtons = document.querySelectorAll('#lista-recetas .favorite-button');
      recipeFavoriteButtons.forEach(button => {
          const recipeId = parseInt(button.dataset.id);
          button.textContent = isFavorite(recipeId) ? '⭐' : '☆';
          button.classList.toggle('active', isFavorite(recipeId));
      });
  }

  function attachFavoriteListeners() {
      const favoriteButtons = document.querySelectorAll('#lista-recetas .favorite-button');
      favoriteButtons.forEach(button => {
          button.addEventListener('click', function() {
              const recipeId = parseInt(this.dataset.id);
              if (isFavorite(recipeId)) {
                  removeFromFavorites(recipeId);
              } else {
                  addToFavorites(recipeId);
              }
          });
      });
  }

  function updateFavoritesDisplay() {
      contenedorFavoritos.innerHTML = '';
      const favoriteIds = getFavorites();
      if (favoriteIds.length === 0) {
          contenedorFavoritos.innerHTML = '<p class="mensaje-vacio">Aún no has añadido recetas a tus favoritos.</p>';
          return;
      }

      const allRecipesData = JSON.parse(localStorage.getItem('allRecipes')) || [];
      const favoriteRecipes = allRecipesData.filter(recipe => favoriteIds.includes(recipe.id));

      if (favoriteRecipes.length > 0) {
          favoriteRecipes.forEach(recipe => {
              const recipeCard = document.createElement('div');
              recipeCard.classList.add('recipe-card');
              const imageUrl = recipe.image ? `https://spoonacular.com/recipeImages/${recipe.image}?apiKey=${API_KEY}&width=312&height=231` : 'placeholder.png';

              recipeCard.innerHTML = `
                  <h3>${recipe.title}</h3>
                  <img src="${imageUrl}" alt="${recipe.title}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;">
                  <p class="prep-time">Listo en: ${recipe.readyInMinutes || 'N/A'} min</p>
                  <p class="servings">Porciones: ${recipe.servings || 'N/A'}</p>
                  <button class="remove-favorite-button" data-id="${recipe.id}">Quitar</button>
              `;
              contenedorFavoritos.appendChild(recipeCard);
          });
          attachRemoveFavoriteListeners();
      } else {
          contenedorFavoritos.innerHTML = '<p class="mensaje-vacio">No se encontraron recetas favoritas.</p>';
      }
  }

  function attachRemoveFavoriteListeners() {
      const removeButtons = document.querySelectorAll('#contenedor-favoritos .remove-favorite-button');
      removeButtons.forEach(button => {
          button.addEventListener('click', function() {
              const recipeId = parseInt(this.dataset.id);
              removeFromFavorites(recipeId);
          });
      });
  }

  updateFavoritesDisplay(); // Cargar favoritos al inicio

  // --- Criterio 9: Formulario de registro (funcionalidad básica de alerta) ---
  const formularioRegistro = document.getElementById('formulario-registro');
  if (formularioRegistro) {
      formularioRegistro.addEventListener('submit', function(event) {
          event.preventDefault();
          const nombre = document.getElementById('nombre-registro').value;
          const email = document.getElementById('email-registro').value;
          const contrasena = document.getElementById('contrasena-registro').value;
          const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
          const telefono = document.getElementById('telefono-registro').value;
          const ciudad = document.getElementById('ciudad-registro').value;
          const pais = document.getElementById('pais-registro').value;

          if (contrasena !== confirmarContrasena) {
              alert('Las contraseñas no coinciden.');
              return;
          }

          alert(`Registro exitoso!\nNombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nCiudad: ${ciudad}\nPaís: ${pais}`);
          this.reset();
          showContent('inicio'); // Redirigir a la página de inicio después del registro (simulado)
      });
  }

  // --- Criterio 8: Incluir una funcionalidad original (Receta Sorpresa - Simulado) ---
  const botonSorpresa = document.getElementById('boton-sorpresa');
  if (botonSorpresa) {
      botonSorpresa.addEventListener('click', async () => {
          const apiUrl = `${BASE_URL}/random?apiKey=${API_KEY}`;
          try {
              const response = await fetch(apiUrl);
              const data = await response.json();
              if (data && data.recipe) {
                  const sorpresa = data.recipe;
                  alert(`¡Receta Sorpresa!\nNombre: ${sorpresa.title}\nListo en: ${sorpresa.readyInMinutes || 'N/A'} min\nPorciones: ${sorpresa.servings || 'N/A'}`);
              } else {
                  alert('No se pudo obtener una receta sorpresa.');
              }
          } catch (error) {
              console.error('Error fetching random recipe:', error);
              alert('Error al obtener la receta sorpresa.');
          }
      });
  }

  // --- Criterio 6: Garantizar un diseño homogéneo y una buena experiencia de usuario ---
  // Esto se logra principalmente con el CSS (Style.css) y la estructura del HTML.
  // El JavaScript contribuye a la UX con la interactividad de las pestañas, el buscador, el filtro y los favoritos.

});







  