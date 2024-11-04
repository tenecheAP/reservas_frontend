document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reserva-form');
    const reservasList = document.getElementById('reservas');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fechaInicio = document.getElementById('fecha_inicio').value;
        const fechaFin = document.getElementById('fecha_fin').value;
        const cantidadPersonas = document.getElementById('cantidad_personas').value;
        const tipoReserva = document.getElementById('tipo_reserva').value;
        const capacidadCarpa = document.getElementById('capacidad_carpa').value;
        const cantidadComidas = document.getElementById('cantidad_comidas').value;

        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fechaInicio,
                    fechaFin,
                    cantidadPersonas,
                    tipoReserva,
                    capacidadCarpa,
                    cantidadComidas
                })
            });

            if (response.ok) {
                const nuevaReserva = await response.json();
                // Aquí puedes manejar la respuesta del servidor y actualizar la lista de reservas
            } else {
                throw new Error('Error al realizar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });
});
