// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', function() {

  // 1. Busca el contenedor que creamos en el HTML
  const container = document.getElementById('whatsapp-flotante-container');

  // Si el contenedor existe, inyecta el código del botón
  if (container) {
    // 2. Define aquí todo el HTML y CSS de tu botón una sola vez
    const whatsappBtnHTML = `
      <style>
        
        .whatsapp-button {
            display: flex;
            position: fixed; /* Hace que el botón flote y se mantenga en su posición */
            bottom: 20px;    /* 20px desde la parte inferior de la ventana */
            right: 20px;     /* 20px desde el lado derecho de la ventana */
            z-index: 1000;   /* Asegura que el botón esté por encima de otros elementos */
            background-color:rgb(37, 211, 101); /* Color verde oficial de WhatsApp */
            color: white;
            border-radius: 50px; /* Hace el botón redondo o con esquinas muy suaves */
            padding: 12px 15px;  /* Ajusta el relleno para el tamaño del botón */
            align-items: center; /* Centra verticalmente el contenido */
            justify-content: center; /* Centra horizontalmente el contenido */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para darle profundidad */
            text-decoration: none; /* Quita el subrayado predeterminado de los enlaces */
            font-family: Arial, sans-serif; /* Fuente legible */
            font-size: 16px; /* Tamaño de fuente, si usas texto */
        }

        .whatsapp-button img {
            width: 30px; /* Tamaño del ícono de WhatsApp */
            height: 30px;
        }

        .whatsapp-button:hover {
            background-color: #1DA851; /* Un verde un poco más oscuro al pasar el ratón */
            transform: scale(1.05); /* Ligerísimo zoom para indicar interactividad */
            transition: background-color 0.3s ease, transform 0.3s ease; /* Transición suave */
        }
  
      </style>
      <a href="https://api.whatsapp.com/send?phone=+573232866467&text=Hola!%20quiero%20m%C3%A1s%20informaci%C3%B3n"
       class="whatsapp-button"
       target="_blank"
       rel="noopener noreferrer">
      <img src="img/whatsApp-icon.webp" alt="WhatsApp">
    </a>
    `;

    // 3. Inserta el HTML del botón dentro del contenedor
    container.innerHTML = whatsappBtnHTML;
  }
});