import { pintarTarjetas, pintarCategorias, obtenerCategorias, filtrarTarjetas, mostrarTarjetas } from './Modulos/functions.js';

//Referencia DOM

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

    // Filtrar eventos que ya han pasado
    const eventosFiltrados = eventosData.events.filter(event => eventosData.currentDate >= event.date);
    console.log(eventosFiltrados);
    
    // Pintar tarjetas de eventos que no han pasado
    pintarTarjetas(eventosFiltrados);
    
    // Obtener categorías
    let categorias = obtenerCategorias(eventosData.events);
    console.log(categorias); // Aquí tendrás las categorías
    pintarCategorias(categorias);

    // Filtrar mientras se escribe en el campo de búsqueda
    searchInput.addEventListener('input', () => filtrarTarjetas(eventosFiltrados));

    // Agregar event listener a los checkboxes
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => filtrarTarjetas(eventosFiltrados));
    });

    // Filtrar las tarjetas inicialmente
    filtrarTarjetas(eventosFiltrados)
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}
// Llamar a la función para obtener datos
obtenerDatos();
