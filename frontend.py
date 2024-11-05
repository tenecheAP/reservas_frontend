import streamlit as st
import requests
import hashlib

# Definir la variable user_authenticated como False por defecto
user_authenticated = True

# Llamada a la API para obtener los datos de usuarios
response = requests.get("http://localhost:8000/usuarios/")
usuarios_api = response.json()

# Título principal
st.title("Sistema de Reservas de Camping")

# Crear pestañas
tab1, tab2, tab3 = st.tabs(["Iniciar Sesión / Registro", "Crear Reserva", "Ver Reservas"])

# Lógica para verificar si el servidor de la API está en línea
response_server = requests.get("http://localhost:8000/")
if response_server.status_code == 200:
    st.sidebar.success("Servidor en línea: ¡La API está en línea!")
else:
    st.sidebar.warning("Servidor no disponible en este momento. Por favor, inténtalo más tarde.")

def autenticar_usuario(username, password, usuarios_api):
    for usuario in usuarios_api:
        if usuario.get("username") == username and bcrypt.checkpw(password.encode('utf-8'), usuario.get("password").encode('utf-8')):
            return usuario.get("id")
    return None

# Lógica para la pestaña de Iniciar Sesión / Registro
with tab1:
    st.header("Iniciar Sesión / Registro")
    
    login_form = st.form("login_form")
    username = login_form.text_input("Nombre de Usuario")
    password = login_form.text_input("Contraseña", type="password")
    
    if login_form.form_submit_button("Iniciar Sesión"):
        usuario_autenticado_id = autenticar_usuario(username, password, usuarios_api)
        if usuario_autenticado_id:
            st.success("Inicio de sesión exitoso. Usuario autenticado.")
            user_authenticated = True
        else:
            st.error("Inicio de sesión fallido. Verifica tus credenciales.")
            st.write(response.content)  # Imprimir el contenido de la respuesta del servidor
    
    if login_form.form_submit_button("Registrarse"):
        # Lógica para registrar un nuevo usuario
        # Aquí deberías implementar la lógica de registro de usuario
        st.success("Usuario registrado exitosamente!")
        user_authenticated = True

# Lógica para la pestaña de Crear Reserva
with tab2:
    st.header("Crear Reserva")
    if user_authenticated:
        # Aquí puedes implementar la lógica para que el usuario cree una reserva
        if st.button("Hacer Reserva"):
            reserva_data = {
                # Datos de la reserva a enviar al backend
                "usuario_id": usuario_autenticado_id,  # Agregar el ID del usuario autenticado
                "fecha": "2022-12-31",  # Ejemplo de fecha de reserva
                "lugar": "Parcela 1"  # Ejemplo de lugar de reserva
            }

            response = crear_reserva(reserva_data)

            if response.status_code == 200:
                st.success("Reserva creada exitosamente!")
            else:
                st.error("Error al crear la reserva. Inténtalo de nuevo.")
    else:
        st.warning("Debes iniciar sesión o registrarte para hacer una reserva.")

# Lógica para la pestaña de Ver Reservas
with tab3:
    st.header("Ver Reservas")
    # Aquí puedes mostrar las reservas existentes o implementar la lógica para visualizarlas

# Función para crear una reserva
def crear_reserva(reserva_data):
    backend_url = "http://localhost:8000/reservas/"
    response = requests.post(backend_url, json=reserva_data)
    return response