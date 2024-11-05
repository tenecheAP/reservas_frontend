const API_URL = 'http://127.0.0.1:8000';

async function verificarUsuario(email, password) {
    try {
        const response = await fetch(`${API_URL}/usuarios/email/${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const usuario = await response.json();
            return usuario;
        } else {
            console.error('Error en la respuesta:', await response.text());
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const usuario = await verificarUsuario(email, password);
    
    if (usuario) {
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        window.location.href = 'index.html';
    } else {
        alert('Email o contraseña incorrectos');
    }
});