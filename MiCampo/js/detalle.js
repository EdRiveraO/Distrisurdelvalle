document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el ID del producto de la URL
    const params = new URLSearchParams(window.location.search);
    const productoId = parseInt(params.get('id'));

    // 2. Encontrar el producto en nuestra base de datos
    const producto = productos.find(p => p.id === productoId);
    const container = document.getElementById('producto-detalle-container');

    if (producto) {
        // 3. Si encontramos el producto, actualizamos la página
        document.title = `MiCampoApp - ${producto.nombre}`;

        // Prepara el HTML para las etiquetas (tags)
        const tagsHTML = producto.tags.map(tag => 
            `<span class="tag-detalle">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`
        ).join('');

        // --- ¡NUEVA LÓGICA DE DESCUENTO! ---
        let precioHTML = '';

        if (producto.descuento && producto.descuento > 0) {
            // Si hay descuento, calcula el nuevo precio
            const precioConDescuento = producto.precio * (1 - producto.descuento / 100);
            
            // Y prepara el HTML con ambos precios
            precioHTML = `
                <p class="precio-original">$${producto.precio.toLocaleString('es-CO')}</p>
                <p class="detalle-precio">$${Math.round(precioConDescuento).toLocaleString('es-CO')}</p>
            `;
        } else {
            // Si no hay descuento, prepara el HTML del precio normal
            precioHTML = `<p class="detalle-precio">$${producto.precio.toLocaleString('es-CO')}</p>`;
        }

        // 4. Llenamos el contenedor con toda la información
        container.innerHTML = 
        `
    <a href="javascript:history.back()" class="btn-volver">← Volver a la lista</a>
    
    <div class="detalle-imagen">
        <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}">
    </div>

    <div class="detalle-info">
        <div class="detalle-tags-container">
            ${tagsHTML}
        </div>

        <h1 class="detalle-nombre">${producto.nombre}</h1>
        <p class="detalle-descripcion">${producto.descripcion}</p>
        
        <div class="precio-container-detalle">
            ${precioHTML}
        </div>

        <a href="https://api.whatsapp.com/send?phone=+573222379328&text=Hola!%20Estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(producto.nombre)}"
           target="_blank"
           class="btn-comprar">
           Consultar por WhatsApp
        </a>
    </div>
`;

    } else {
        // 5. Si el producto no existe, mostramos un error
        container.innerHTML = '<h1>Error 404: Producto no encontrado</h1><p>El producto que buscas no existe. <a href="index.html">Volver al inicio</a>.</p>';
    }
});