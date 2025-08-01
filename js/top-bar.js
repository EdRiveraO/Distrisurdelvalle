document.addEventListener('DOMContentLoaded', () => {
    // --- AQUÍ PUEDES PONER TODOS LOS MENSAJES QUE QUIERAS ---
    const mensajes = [
        "¡Los mejores productos para mascotas!",
        "Asesoría experta para tu ganado.",
        "Envíos a todo el país",
    ];

    const messageElement = document.getElementById('top-bar-message');
    
    // Si el elemento no existe, no hacemos nada.
    if (!messageElement) return;

    let currentIndex = 0;

    // Función para cambiar el mensaje con un efecto de fundido
    function cambiarMensaje() {
        // 1. Desvanece el texto actual
        messageElement.style.opacity = 0;

        // 2. Espera a que termine la animación de desvanecimiento (500ms)
        setTimeout(() => {
            // 3. Actualiza el índice al siguiente mensaje, volviendo al inicio si es necesario
            currentIndex = (currentIndex + 1) % mensajes.length;
            
            // 4. Cambia el texto
            messageElement.textContent = mensajes[currentIndex];
            
            // 5. Vuelve a mostrar el texto con un fundido
            messageElement.style.opacity = 1;
        }, 500); // Este tiempo debe coincidir con la transición del CSS
    }

    // Muestra el primer mensaje inmediatamente
    messageElement.textContent = mensajes[currentIndex];

    // Inicia el ciclo para cambiar el mensaje cada 10 segundos
    setInterval(cambiarMensaje, 10000); // 10000 milisegundos = 10 segundos
});