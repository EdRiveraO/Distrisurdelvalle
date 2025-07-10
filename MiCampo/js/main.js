document.addEventListener('DOMContentLoaded', () => {

    /**
     * Dibuja las tarjetas de productos en un contenedor.
     */
    function renderizarProductosDestacados(productos, contenedor) {
        contenedor.innerHTML = ''; // Limpia el contenedor
        if (productos.length === 0) {
            contenedor.innerHTML = '<p>No hay productos destacados en este momento.</p>';
            return;
        }

        productos.forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto-content');

            // Calcula el precio más bajo para mostrar "Desde..."
            const precios = producto.presentaciones.map(p => p.precio);
            const precioMinimo = Math.min(...precios);

            productoCard.innerHTML = `
                <a href="producto.html?id=${producto.id}" class="producto-link">
                    <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}">
                    <p class="titulo-producto">${producto.nombre}</p>
                    <p class="descripcion-producto">${producto.descripcion}</p>
                    <div class="precio-container">
                        <p class="precio-producto">Desde $${precioMinimo.toLocaleString('es-CO')}</p>
                    </div>
                </a>
            `;
            contenedor.appendChild(productoCard);
        });
    }

    // --- LÓGICA PRINCIPAL ---
    const destacadosContainer = document.querySelector('.productos-destacados .grid-productos');

    if (destacadosContainer) {
        fetch('productos.json')
            .then(response => response.json())
            .then(data => {
                // Filtramos por productos que son activos Y destacados
                const productosDestacados = data.filter(p => p.activo && p.destacado);
                
                // Los dibujamos en la página
                renderizarProductosDestacados(productosDestacados, destacadosContainer);
            })
            .catch(error => {
                console.error('Error al cargar productos destacados:', error);
                destacadosContainer.innerHTML = '<p>No se pudieron cargar los productos.</p>';
            });
    }
});