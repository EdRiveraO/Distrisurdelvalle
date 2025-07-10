document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('producto-detalle-container');

    fetch('productos.json')
        .then(response => response.json())
        .then(productos => {
            const params = new URLSearchParams(window.location.search);
            const productoId = parseInt(params.get('id'));
            const producto = productos.find(p => p.id === productoId);

            if (producto && producto.activo) {
                document.title = `MiCampoApp - ${producto.nombre}`;

                // Generar opciones para el <select>
                const opcionesPresentaciones = producto.presentaciones.map((pres, index) => 
                    `<option value="${index}">${pres.nombre}</option>`
                ).join('');

                container.innerHTML = `
                    <a href="javascript:history.back()" class="btn-volver">← Volver</a>
                    <div class="detalle-imagen">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </div>
                    <div class="detalle-info">
                        <h1 class="detalle-nombre">${producto.nombre}</h1>
                        <p class="detalle-descripcion">${producto.descripcion}</p>
                        <label for="presentaciones-select">Elige una presentación:</label>
                        <select id="presentaciones-select">${opcionesPresentaciones}</select>
                        <div id="precio-dinamico-container"></div>
                    </div>
                `;

                const selectPresentaciones = document.getElementById('presentaciones-select');
                const precioContainer = document.getElementById('precio-dinamico-container');

                // Función para actualizar el precio
                function actualizarPrecio() {
                    const presentacionSeleccionada = producto.presentaciones[selectPresentaciones.value];
                    let precioHTML = '';

                    if (presentacionSeleccionada.descuento > 0) {
                        const precioFinal = presentacionSeleccionada.precio * (1 - presentacionSeleccionada.descuento / 100);
                        precioHTML = `
                            <p class="precio-original">$${presentacionSeleccionada.precio.toLocaleString('es-CO')}</p>
                            <p class="detalle-precio">$${Math.round(precioFinal).toLocaleString('es-CO')}</p>
                        `;
                    } else {
                        precioHTML = `<p class="detalle-precio">$${presentacionSeleccionada.precio.toLocaleString('es-CO')}</p>`;
                    }
                    precioContainer.innerHTML = precioHTML;
                }

                // Listener para cambiar el precio al seleccionar otra opción
                selectPresentaciones.addEventListener('change', actualizarPrecio);

                // Mostrar el precio de la primera presentación al cargar
                actualizarPrecio();
            } else {
                container.innerHTML = '<h1>Producto no encontrado o no disponible</h1>';
            }
        });
});