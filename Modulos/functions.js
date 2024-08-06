// Referencias a elementos de DOM
const searchInput = document.getElementById('searchInput');
const cardContainer = document.getElementById('contenedor-tarjetas');

// Función para obtener categorías únicas de los eventos
export function obtenerCategorias(events) {
    const categorias = new Set(); // Usamos un Set para evitar duplicados
    events.forEach(event => {
        categorias.add(event.category);
    });
    return Array.from(categorias); // Convertimos el Set a un Array
  }
  
  
  
export  function pintarTarjetas(events) {
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
export  function pintarCategorias(categorias) {
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
export  function mostrarTarjetas(items) {
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
  
export  function filtrarTarjetas(eventos) {
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
  