const API_URL = "https://myfakeapi.com/api/cars/";
const PIXABAY_API_KEY = "49710500-3a2411a573b4b0d71cb32f17f";

async function obtenerListaAutosFakeAPI() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.cars || [];
  } catch (error) {
    console.error('Error fetching cars from fake API:', error);
    return [];
  }
}

async function obtenerImagenPixabay(car) {
  const query = `${car.car} ${car.car_model} ${car.car_model_year}`;
  const imageUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`;
  try {
    const res = await fetch(imageUrl);
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      return data.hits[0].webformatURL;
    } else {
      return "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
    }
  } catch (error) {
    console.error('Error fetching image from Pixabay:', error);
    return "https://via.placeholder.com/400x300?text=Error+imagen";
  }
}
