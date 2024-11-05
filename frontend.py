import streamlit as st
import requests

user_authenticated = False  # Definir la variable user_authenticated como False por defecto

# Título principal
st.title("Sistema de Reservas de Camping")

# Crear pestañas
tab1, tab2, tab3 = st.tabs(["Iniciar Sesión / Registro", "Crear Reserva", "Ver Reservas"])

with tab1:
    st.header("Iniciar Sesión / Registro")
    
    login_form = st.form("login_form")
    username = login_form.text_input("Nombre de Usuario")
    password = login_form.text_input("Contraseña", type="password")
    
    if login_form.form_submit_button("Iniciar Sesión"):
        success, user_data = autenticar_usuario({"username": username, "password": password})
        
        if success:
            st.success("Inicio de sesión exitoso!")
            user_authenticated = True
        else:
            st.error("Inicio de sesión fallido. Verifica tus credenciales.")
    
    if login_form.form_submit_button("Registrarse"):
        success, user_data = crear_usuario({"username": username, "password": password})
        
        if success:
            st.success("Usuario registrado exitosamente!")
            user_authenticated = True
        else:
            st.error("Error al registrar usuario. Inténtalo de nuevo.")

# Resto del código para la creación de reservas y visualización de reservas existentes

# Verificar si el usuario está autenticado antes de permitir hacer una reserva
if user_authenticated:
    # Lógica para permitir al usuario hacer una reserva
    st.success("Reserva realizada exitosamente!")
else:
    # Mostrar mensaje para iniciar sesión o registrarse
    st.warning("Debes iniciar sesión o registrarte para hacer una reserva.")

# Enviar solicitud al backend para crear una reserva
if user_authenticated and st.button("Hacer Reserva"):
    reserva_data = {
        "fechaInicio": "2022-12-01",
        "fechaFin": "2022-12-05",
        "cantidadPersonas": 4,
        "tipoReserva": "Premium",
        "capacidadCarpa": 2,
        "cantidadComidas": 10
    }

    backend_url = "http://localhost:8000/reservas/"
    response = requests.post(backend_url, json=reserva_data)

    if response.status_code == 200:
        st.success("Reserva creada exitosamente!")
    else:
        st.error("Error al crear la reserva. Inténtalo de nuevo.")

def autenticar_usuario(credentials):
    # Lógica para autenticar al usuario
    if credentials["username"] == "usuario_ejemplo" and credentials["password"] == "contraseña_ejemplo":
        return True, {"user_id": 123, "email": "usuario@example.com"}
    else:
        return False, None