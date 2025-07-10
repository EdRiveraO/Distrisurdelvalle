document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('producto-detalle-container');

    // 1. Cargar los datos desde el archivo JSON
    fetch('../productos.json') // Usamos ../ para subir un nivel desde la carpeta js
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(productos => {
            // 2. Obtener el ID del producto de la URL
            const params = new URLSearchParams(window.location.search);
            const productoId = parseInt(params.get('id'));
            const producto = productos.find(p => p.id === productoId);

            // 3. Renderizar el producto si es válido y está activo
            if (producto && producto.activo) {
                document.title = `Distrisur del Valle - ${producto.nombre}`;

                // 4. Generar el HTML
                const opcionesPresentaciones = producto.presentaciones.map((pres, index) => 
                    `<option value="${index}">${pres.nombre}</option>`
                ).join('');

                container.innerHTML = `
                    <a href="productos.html" class="btn-volver">← Volver a Productos</a>
                    <div class="detalle-imagen">
                        <img src="../${producto.imagen}" alt="${producto.nombre}">
                    </div>
                    <div class="detalle-info">
                        <h1 class="detalle-nombre">${producto.nombre}</h1>
                        <p class="detalle-descripcion">${producto.descripcion}</p>
                        <div class="presentaciones-container">
                            <label for="presentaciones-select">Presentación:</label>
                            <select id="presentaciones-select">${opcionesPresentaciones}</select>
                        </div>
                        <div id="precio-dinamico-container" class="precio-container-detalle"></div>
                        <a href="https://api.whatsapp.com/send?phone=+573222379328&text=Hola!%20Estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(producto.nombre)}"
                           target="_blank"
                           class="btn-comprar">
                           Consultar por WhatsApp
                        </a>
                    </div>
                `;

                // 5. Lógica para actualizar el precio dinámicamente
                const selectPresentaciones = document.getElementById('presentaciones-select');
                const precioContainer = document.getElementById('precio-dinamico-container');

                function actualizarPrecio() {
                    const presentacion = producto.presentaciones[selectPresentaciones.value];
                    let precioHTML = '';

                    if (presentacion.descuento && presentacion.descuento > 0) {
                        const precioFinal = presentacion.precio * (1 - presentacion.descuento / 100);
                        precioHTML = `
                            <p class="precio-original">$${presentacion.precio.toLocaleString('es-CO')}</p>
                            <p class="detalle-precio">$${Math.round(precioFinal).toLocaleString('es-CO')}</p>
                        `;
                    } else {
                        precioHTML = `<p class="detalle-precio">$${presentacion.precio.toLocaleString('es-CO')}</p>`;
                    }
                    precioContainer.innerHTML = precioHTML;
                }

                selectPresentaciones.addEventListener('change', actualizarPrecio);
                actualizarPrecio(); // Mostrar precio inicial

            } else {
                container.innerHTML = '<h1>Producto no encontrado o no disponible</h1>';
            }
        })
        .catch(error => {
            console.error('Error al cargar el detalle del producto:', error);
            container.innerHTML = '<h1>Error al cargar la información</h1>';
        });
});