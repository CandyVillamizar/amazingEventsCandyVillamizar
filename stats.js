async function obtenerDatos() {
    try {
        const response = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
        if (!response.ok) {
            throw new Error('Error en la respuesta de eventos');
        }
        const eventosData = await response.json();
        console.log(eventosData.events);
        
        const eventosUpcoming = eventosData.events.filter(event => event.date >= eventosData.currentDate);
        const eventosPastevent = eventosData.events.filter(event => event.date <= eventosData.currentDate);
        console.log(eventosUpcoming);
        console.log(eventosPastevent);
        
        const estadisticasGenerales = calcularEstadisticas(eventosData.events);
        console.log(estadisticasGenerales);
        
        const tabla = crearTabla(estadisticasGenerales);
        document.getElementById('stats').appendChild(tabla); // Asegúrate de tener un contenedor con el ID 'stats'
        // Calcular estadísticas por categoría
        const estadisticasPorCategoria = calcularEstadisticasPorCategoria(eventosPastevent);
        console.log(estadisticasPorCategoria);
        // Calcular estadísticas por categoría
        const estadisticasPorCategoria2 = calcularEstadisticasPorCategoria(eventosUpcoming);
        console.log(estadisticasPorCategoria2);

        
        // Crear tabla para estadísticas por categoría
        const tablaCategorias = crearTablaPorCategoria(estadisticasPorCategoria);
        document.getElementById('statsCategorias').appendChild(tablaCategorias); // Asegúrate de tener un contenedor con el ID 'statsCategorias'
        const tablaCategorias2 = crearTablaPorCategoria(estadisticasPorCategoria2);
        document.getElementById('statsCategorias2').appendChild(tablaCategorias2); // Asegúrate de tener un contenedor con el ID 'statsCategorias'
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

function calcularEstadisticas(eventos) {
    let mayorAsistencia = null;
    let menorAsistencia = null;
    let mayorCapacidad = null;

    eventos.forEach(event => {
        // Verificar si hay asistencia y capacidad
        if (event.assistance || event.estimate) {
            const porcentajeAsistencia = ((event.assistance || event.estimate) / event.capacity) * 100;

            // Mayor asistencia
            if (!mayorAsistencia || porcentajeAsistencia > ((mayorAsistencia.assistance || mayorAsistencia.estimate) / mayorAsistencia.capacity) * 100) {
                mayorAsistencia = event; // Almacena el evento completo
            }
            // Menor asistencia
            if (!menorAsistencia || porcentajeAsistencia < ((menorAsistencia.assistance || menorAsistencia.estimate) / menorAsistencia.capacity) * 100) {
                menorAsistencia = event; // Almacena el evento completo
            }
        }
        // Mayor capacidad
        if (!mayorCapacidad || event.capacity > mayorCapacidad.capacity) {
            mayorCapacidad = event; // Almacena el evento completo
        }
    });

    return { mayorAsistencia, menorAsistencia, mayorCapacidad };
}

function crearTabla(estadisticas) {
    const { mayorAsistencia, menorAsistencia, mayorCapacidad } = estadisticas;

    const table = document.createElement('table');
    table.className = 'table table-striped-columns';
    table.innerHTML = `
        <tr>
            <th>Description</th>
            <th>Event</th>
            <th>Asisstance</th>
            <th>Capacity</th>
            <th>Percentage of Attendance</th>
        </tr>
    `;

    // Evento con mayor asistencia
    if (mayorAsistencia) {
        const porcentajeMayor = ((mayorAsistencia.assistance || mayorAsistencia.estimate) / mayorAsistencia.capacity) * 100;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td> Highest Asistance</td>
            <td>${mayorAsistencia.name}</td>
            <td>${mayorAsistencia.assistance || mayorAsistencia.estimate}</td>
            <td>${mayorAsistencia.capacity}</td>
            <td>${porcentajeMayor.toFixed(2)}%</td>
        `;
        table.appendChild(row);
    }

    // Evento con menor asistencia
    if (menorAsistencia) {
        const porcentajeMenor = ((menorAsistencia.assistance || menorAsistencia.estimate) / menorAsistencia.capacity) * 100;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Lowest Asistance</td>
            <td>${menorAsistencia.name}</td>
            <td>${menorAsistencia.assistance || menorAsistencia.estimate}</td>
            <td>${menorAsistencia.capacity}</td>
            <td>${porcentajeMenor.toFixed(2)}%</td>
        `;
        table.appendChild(row);
    }

    // Evento con mayor capacidad
    if (mayorCapacidad) {
        const porcentajeMayorCapacidad = ((mayorCapacidad.assistance || mayorCapacidad.estimate) / mayorCapacidad.capacity) * 100;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Highest Capacity</td>
            <td>${mayorCapacidad.name}</td>
            <td>${mayorCapacidad.assistance || mayorCapacidad.estimate}</td>
            <td>${mayorCapacidad.capacity}</td>
            <td>${porcentajeMayorCapacidad.toFixed(2)}%</td>
        `;
        table.appendChild(row);
    }

    return table;
}

function calcularEstadisticasPorCategoria(eventos) {
    const categoriasData = {};

    eventos.forEach(event => {
        const categoria = event.category;
        const ingreso = (event.price * event.assistance) || 0; // Ingreso total para el evento
        const asistencia = event.assistance || 0; // Asistencia total para el evento

        // Inicializa la categoría si no existe
        if (!categoriasData[categoria]) {
            categoriasData[categoria] = {
                totalIngresos: 0,
                totalAsistencia: 0,
                totalEventos: 0,
                totalCapacidad: 0
            };
        }

        // Acumula los ingresos y asistencia
        categoriasData[categoria].totalIngresos += ingreso;
        categoriasData[categoria].totalAsistencia += asistencia;
        categoriasData[categoria].totalCapacidad += event.capacity || 0; // Para el cálculo del porcentaje de asistencia
        categoriasData[categoria].totalEventos += 1; // Cuenta el número de eventos por categoría
    });

    // Prepara los resultados para devolver
    const categorias = [];
    const ingresosPromedio = [];
    const porcentajesAsistencia = [];

    for (const categoria in categoriasData) {
        categorias.push(categoria);
        ingresosPromedio.push(categoriasData[categoria].totalIngresos / categoriasData[categoria].totalEventos); // Promedio de ingresos
        const porcentajeAsistencia = (categoriasData[categoria].totalAsistencia / categoriasData[categoria].totalCapacidad) * 100 || 0; // Porcentaje de asistencia
        porcentajesAsistencia.push(porcentajeAsistencia);
    }

    return {
        categorias,
        ingresosPromedio,
        porcentajesAsistencia
    };
}
function crearTablaPorCategoria(estadisticas) {
    const { categorias, ingresosPromedio, porcentajesAsistencia } = estadisticas;

    const table = document.createElement('table');
    table.className = 'table table-striped-columns';
    table.innerHTML = `
        <tr>
            <th>Category</th>
            <th>Average Income</th>
            <th>Percentage of Attendance</th>
        </tr>
    `;

    for (let i = 0; i < categorias.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${categorias[i]}</td>
            <td>${ingresosPromedio[i].toFixed(2)}</td>
            <td>${porcentajesAsistencia[i].toFixed(2)}%</td>
        `;
        table.appendChild(row);
    }

    return table;
}

obtenerDatos();