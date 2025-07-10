document.addEventListener('DOMContentLoaded', () => {
    // La función de renderizado ahora necesita calcular el precio mínimo
    function renderizarProductos(arrayDeProductos, contenedor) {
        contenedor.innerHTML = '';
        if (arrayDeProductos.length === 0) {
            contenedor.innerHTML = '<p class="no-productos">No se encontraron productos.</p>';
            return;
        }

        arrayDeProductos.forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto-content');

            // Calculamos el precio más bajo para mostrar "Desde..."
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
    // Ahora, todo nuestro código vivirá dentro de la carga de datos
    fetch('productos.json')
        .then(response => response.json())
        .then(productos => {
            // ¡PRIMER PASO IMPORTANTE! Filtramos solo los productos activos
            const productosActivos = productos.filter(p => p.activo);
            
            // El resto de la lógica ahora usa 'productosActivos'
            const productosContainer = document.querySelector('.productos-informacion .grid-productos');
            const filtrosContainer = document.getElementById('filtros-container');
            const tituloCategoria = document.querySelector('.productos-informacion h1');
            const btnLimpiar = document.getElementById('limpiar-filtros');
            
            let filtrosActivos = new Set();
            const gruposDeFiltros = { /* ... tu definición de grupos ... */ };

            function renderizarFiltros() { /* ... tu función sin cambios ... */ }

            function aplicarYRenderizar() {
                let productosFiltrados = productosActivos; // Usa la lista de activos
                if (filtrosActivos.size > 0) {
                    productosFiltrados = productosActivos.filter(producto => {
                        return Array.from(filtrosActivos).every(filtro => producto.tags.includes(filtro));
                    });
                }
                tituloCategoria.textContent = filtrosActivos.size === 0 ? 'Todos los productos' : `Filtros: ${Array.from(filtrosActivos).join(', ')}`;
                renderizarProductos(productosFiltrados, productosContainer);
            }

            // Event Listeners (sin cambios en su lógica interna)
            filtrosContainer.addEventListener('click', (e) => { /* ... */ });
            btnLimpiar.addEventListener('click', () => { /* ... */ });

            // Carga inicial
            renderizarFiltros();
            aplicarYRenderizar();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});