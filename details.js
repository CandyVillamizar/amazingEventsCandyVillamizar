fetch('https://aulamindhub.github.io/amazing-api/events.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.events); // Muestra todos los eventos

        // Obtener el ID del evento desde la URL
        let idEvento = new URLSearchParams(window.location.search).get("id");

        // Buscar el evento correspondiente en los datos
        let tarjeta = data.events.find(e => e._id == idEvento);

        // Verificar si se encontró el evento
        if (tarjeta) {
            document.getElementById("imagen").src = tarjeta.image;
            document.getElementById("Cardetails").innerHTML = `
                <h5 class="card-title">${tarjeta.name}</h5>
                <p class="card-text"><small class="text-body-secondary">Date: ${tarjeta.date}</small></p>
                <p class="card-text">Description: ${tarjeta.description}</p>
                <p class="card-text"><small class="text-body-secondary">Category: ${tarjeta.category}</small></p>
                <p class="card-text"><small class="text-body-secondary">Place: ${tarjeta.place}</small></p>
                <p class="card-text"><small class="text-body-secondary">Capacity: ${tarjeta.capacity}</small></p>
                <p class="card-text"><small class="text-body-secondary">Assistance: ${tarjeta.assistance ? tarjeta.assistance : tarjeta.estimate}</small></p>
                <p class="card-text"><small class="text-body-secondary">Price: ${tarjeta.price}</small></p>
            `;
        } else {
            // Manejar el caso en que no se encuentra el evento
            document.getElementById("Cardetails").innerHTML = `
                <p>No se encontró el evento con el ID proporcionado.</p>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("Cardetails").innerHTML = `
            <p>Error al cargar los datos del evento.</p>
        `;
    });



