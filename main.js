
// Referencias a elementos de DOM
const searchInput = document.getElementById('searchInput');
const cardContainer = document.getElementById('contenedor-tarjetas');

// Función para obtener eventos y categorías desde la API 

async function obtenerDatos() {
  try {
    const eventosResponse = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
    if (!eventosResponse.ok) {
      throw new Error('Error en la respuesta de eventos');
    }
    const eventosData = await eventosResponse.json();
    pintarTarjetas(eventosData.events);

    // Obtener categorías
    let categorias = obtenerCategorias(eventosData.events);
    console.log(categorias); // Aquí tendrás las categorías
    pintarCategorias(categorias);

    // Filtrar mientras se escribe en el campo de búsqueda
    searchInput.addEventListener('input', () => filtrarTarjetas(eventosData.events));

    // Agregar event listener a los checkboxes
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => filtrarTarjetas(eventosData.events));
    });

    // Filtrar las tarjetas inicialmente
    filtrarTarjetas(eventosData.events);

  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}

// Función para obtener categorías únicas de los eventos
function obtenerCategorias(events) {
  const categorias = new Set(); // Usamos un Set para evitar duplicados
  events.forEach(event => {
      categorias.add(event.category);
  });
  return Array.from(categorias); // Convertimos el Set a un Array
}

// Llamar a la función para obtener datos
obtenerDatos();

function pintarTarjetas(events) {
  let contenedor = document.getElementById("contenedor-tarjetas");
  
  for (let i = 0; i < events.length; i++) {
      let tarjeta = document.createElement('div');
      tarjeta.className = "card";
      tarjeta.innerHTML = `
          <img id="image" src="${events[i].image}" class="card-img-top h-50" alt="festival">
          <div class="card-body" data-category="${events[i].category}">
              <h5 class="card-title">${events[i].name}</h5>
              <p class="card-text">${events[i].description}.</p>
              <div class="d-flex flex-row justify-content-between">
                  <p>Price: ${events[i].price}</p>
                  <a href="./Details.html?id=${events[i]._id}" class="btn btn-primary">Details</a>
              </div>
          </div>`;
      contenedor.appendChild(tarjeta);
  }
}


//Función para pintar las categorías en el HTML
function pintarCategorias(categorias) {
  const contenedorCategoria = document.getElementById("category");
  categorias.forEach((categoria, index) => {
    const categoriaDiv = document.createElement('div');
    categoriaDiv.className = "form-check";
    categoriaDiv.innerHTML = `
      <input class="category-checkbox" type="checkbox" value="${categoria}" id="categoria-${index}">
      <label for="categoria-${index}">${categoria}</label>
    `;
    contenedorCategoria.appendChild(categoriaDiv);
  });
}
// Función para mostrar las tarjetas en el contenedor
function mostrarTarjetas(items) {
    cardContainer.innerHTML = ''; // Limpiar contenedor
    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card', 'col-md-4', 'mb-4'); // Añadir clases de Bootstrap
        card.innerHTML = `
            <img src="${item.image}" class="card-img-top h-50" alt="festival">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.description}.</p>
                <div class="d-flex flex-row justify-content-between">
                    <p>Price: ${item.price}</p>
                    <a href="./Details.html?id=${item._id}" class="btn btn-primary">Details</a>
                </div>
            </div>`;
        cardContainer.appendChild(card);
    });
}

function filtrarTarjetas(eventos) {
  const filtro = searchInput.value.toLowerCase();
  const checkboxes = document.querySelectorAll('.category-checkbox');
  const categoriasSeleccionadas = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value.toLowerCase());

  const itemsFiltrados = eventos.filter(item => {
    const coincideFiltro = item.name.toLowerCase().includes(filtro) ||
      item.description.toLowerCase().includes(filtro) ||
      item.category.toLowerCase().includes(filtro);

    const coincideCategoria = categoriasSeleccionadas.length === 0 ||
      categoriasSeleccionadas.includes(item.category.toLowerCase());

    return coincideFiltro && coincideCategoria;
  });
  mostrarTarjetas(itemsFiltrados);
}



  