const API_URL = 'http://127.0.0.1:8000';

function checkSession() {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {
        if (window.location.href.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
        return true;
    }
    return false;
}

async function verificarUsuario(email, password) {
    try {
        const encodedEmail = encodeURIComponent(email);
        const encodedPassword = encodeURIComponent(password);
        
        const response = await fetch(`${API_URL}/usuarios/login?email=${encodedEmail}&password=${encodedPassword}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                data: data
            };
        } else {
            return {
                success: false,
                error: data.detail || 'Error al iniciar sesión'
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            success: false,
            error: 'Error de conexión con el servidor'
        };
    }
}

function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            showMessage('Iniciando sesión...', false);

            const result = await verificarUsuario(email, password);
            
            if (result.success) {
                sessionStorage.setItem('usuario', JSON.stringify(result.data));
                showMessage('¡Login exitoso! Redirigiendo...', false);
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showMessage(result.error, true);
            }
        });
    }
});