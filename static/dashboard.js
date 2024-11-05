const API_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioData);
    
    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
        <p>Bienvenido, ${usuario.nombre}</p>
        <p>Email: ${usuario.email}</p>
    `;

    cargarReservas(usuario.id);

    const fechaInicio = document.getElementById('fecha_inicio');
    const fechaFin = document.getElementById('fecha_fin');
    const hoy = new Date().toISOString().split('T')[0];
    
    fechaInicio.min = hoy;
    fechaFin.min = hoy;

    fechaInicio.addEventListener('change', () => {
        fechaFin.min = fechaInicio.value;
        if (fechaFin.value && fechaFin.value < fechaInicio.value) {
            fechaFin.value = fechaInicio.value;
        }
    });

    const reservaForm = document.getElementById('reservaForm');
    reservaForm.addEventListener('submit', (e) => crearReserva(e, usuario.id));
});

async function crearReserva(e, usuarioId) {
    e.preventDefault();

    const fechaInicio = new Date(document.getElementById('fecha_inicio').value);
    const fechaFin = new Date(document.getElementById('fecha_fin').value);

    if (fechaFin < fechaInicio) {
        alert('La fecha final no puede ser menor que la fecha inicial');
        return;
    }

    const reservaData = {
        usuario_id: usuarioId,
        fecha_inicio: document.getElementById('fecha_inicio').value,
        fecha_fin: document.getElementById('fecha_fin').value,
        cantidad_personas: parseInt(document.getElementById('cantidad_personas').value),
        tipo_reserva: document.getElementById('tipo_reserva').value,
        ubicacion_camping: document.getElementById('ubicacion_camping').value,
        estado: "Confirmada",
        capacidad_carpa: parseInt(document.getElementById('cantidad_personas').value),
        cantidad_comidas: 1,
        costo_total: 100.0,
        id_camping: 1
    };

    try {
        const response = await fetch(`${API_URL}/reservas/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservaData)
        });

        if (response.ok) {
            alert('Reserva creada exitosamente');
            cargarReservas(usuarioId);
            e.target.reset();
        } else {
            const error = await response.json();
            alert('Error al crear la reserva: ' + (error.detail || JSON.stringify(error)));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear la reserva');
    }
}

async function cargarReservas(usuarioId) {
    try {
        const response = await fetch(`${API_URL}/reservas/`);
        if (response.ok) {
            const reservas = await response.json();
            const reservasFiltradas = reservas.filter(reserva => reserva.usuario_id === usuarioId);
            mostrarReservas(reservasFiltradas);
        }
    } catch (error) {
        console.error('Error al cargar reservas:', error);
    }
}

function mostrarReservas(reservas) {
    const reservasList = document.getElementById('reservasList');
    if (reservas.length === 0) {
        reservasList.innerHTML = '<p>No tienes reservas activas</p>';
        return;
    }

    reservasList.innerHTML = reservas.map(reserva => `
        <div class="reserva-item">
            <h3>Reserva #${reserva.id}</h3>
            <p>Fecha: ${reserva.fecha_inicio} - ${reserva.fecha_fin}</p>
            <p>Ubicación: Sector ${reserva.ubicacion_camping}</p>
            <p>Estado: ${reserva.estado}</p>
            <p>Personas: ${reserva.cantidad_personas}</p>
            <button onclick="cancelarReserva(${reserva.id})" class="cancel-btn">
                Cancelar Reserva
            </button>
        </div>
    `).join('');
}

async function cancelarReserva(reservaId) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reservas/${reservaId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Reserva cancelada exitosamente');
            const usuario = JSON.parse(sessionStorage.getItem('usuario'));
            cargarReservas(usuario.id);
        } else {
            alert('Error al cancelar la reserva');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cancelar la reserva');
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

function toggleReservas() {
    const reservasList = document.getElementById('reservasList');
    const toggleBtn = document.getElementById('toggleReservasBtn');
    
    if (reservasList.style.display === 'none') {
        reservasList.style.display = 'block';
        toggleBtn.innerHTML = 'Mis Reservas ▲';
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        cargarReservas(usuario.id);
    } else {
        reservasList.style.display = 'none';
        toggleBtn.innerHTML = 'Mis Reservas ▼';
    }
}
