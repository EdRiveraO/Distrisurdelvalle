document.addEventListener('DOMContentLoaded', () => {
    // Renderizar productos destacados en el index
    // Verificamos si estamos en la página de inicio buscando el contenedor específico
    const destacadosContainer = document.querySelector('.productos-destacados .grid-productos');
    if (destacadosContainer) {
        // Filtramos el array para obtener solo los productos destacados
        const productosDestacados = productos.filter(producto => producto.destacado === true);
        renderizarProductos(productosDestacados, destacadosContainer);
    }
});

/**
 * Función para renderizar productos en el DOM.
 * @param {Array} arrayDeProductos - El array de productos a mostrar.
 * @param {HTMLElement} contenedor - El elemento HTML donde se insertarán los productos.
 */
function renderizarProductos(arrayDeProductos, contenedor) {
    contenedor.innerHTML = ''; // Limpia el contenido anterior
    if (arrayDeProductos.length === 0) {
        contenedor.innerHTML = '<p class="no-productos">No se encontraron productos.</p>';
        return;
    }

    arrayDeProductos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.classList.add('producto-content');

        // --- LÓGICA DE DESCUENTO ---
        let etiquetaDescuentoHTML = '';
        let precioHTML = '';

        // Comprueba si el producto tiene un descuento válido
        if (producto.descuento && producto.descuento > 0) {
            // 1. Prepara la etiqueta de descuento
            etiquetaDescuentoHTML = `<span class="etiqueta-descuento">${producto.descuento}% DCTO</span>`;

            // 2. Calcula el nuevo precio
            const precioConDescuento = producto.precio * (1 - producto.descuento / 100);

            // 3. Prepara el HTML de los precios
            precioHTML = `
                <p class="precio-original">$${producto.precio.toLocaleString('es-CO')}</p>
                <p class="precio-descuento">$${Math.round(precioConDescuento).toLocaleString('es-CO')}</p>
            `;
        } else {
            // Si no hay descuento, muestra el precio normal
            precioHTML = `<p class="precio-producto">$${producto.precio.toLocaleString('es-CO')}</p>`;
        }

        // --- CONSTRUCCIÓN FINAL DE LA TARJETA ---
        productoCard.innerHTML = `
            <a href="producto.html?id=${producto.id}" class="producto-link">
                ${etiquetaDescuentoHTML}
                <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}">
                <p class="titulo-producto">${producto.nombre}</p>
                <p class="descripcion-producto">${producto.descripcion}</p>
                <div class="precio-container">${precioHTML}</div>
            </a>
        `;
        
        contenedor.appendChild(productoCard);
    });
}