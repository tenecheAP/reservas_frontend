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
        else:
            st.error("Inicio de sesión fallido. Verifica tus credenciales.")
    
    if login_form.form_submit_button("Registrarse"):
        success, user_data = crear_usuario({"username": username, "password": password})
        
        if success:
            st.success("Usuario registrado exitosamente!")
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