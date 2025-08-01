document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES GLOBALES ---
    let todosLosProductos = []; // Guardaremos todos los productos activos aquí

    // --- ELEMENTOS DEL DOM ---
    const destacadosContainer = document.querySelector('.productos-destacados .grid-productos');
    // Seleccionamos AMBOS buscadores y AMBAS cajas de resultados
    const searchInputs = document.querySelectorAll('.search-input');
    const searchResultsContainers = document.querySelectorAll('.search-results');
    
    // --- FUNCIONES ---

    /**
     * Dibuja las tarjetas de productos destacados en el contenedor.
     */
    function renderizarProductosDestacados(productos, contenedor) {
        contenedor.innerHTML = '';
        if (productos.length === 0) {
            contenedor.innerHTML = '<p>No hay productos destacados en este momento.</p>';
            return;
        }

        productos.forEach(producto => {
            if (!producto.presentaciones || producto.presentaciones.length === 0) {
                console.warn(`Producto destacado omitido: "${producto.nombre}" no tiene presentaciones.`);
                return;
            }
            
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto-content');

            const tieneDescuento = producto.presentaciones.some(p => p.descuento && p.descuento > 0);
            let etiquetaDescuentoHTML = '';
            let precioHTML = '';

            const precioMinimoOriginal = Math.min(...producto.presentaciones.map(p => p.precio));
            const preciosConDescuento = producto.presentaciones.map(p => {
                return (p.descuento && p.descuento > 0) ? p.precio * (1 - p.descuento / 100) : p.precio;
            });
            const precioMinimoFinal = Math.min(...preciosConDescuento);

            if (tieneDescuento) {
                etiquetaDescuentoHTML = `<span class="etiqueta-descuento">EN OFERTA</span>`;
                precioHTML = `
                    <p class="precio-original-desde">Desde $${Math.round(precioMinimoOriginal).toLocaleString('es-CO')}</p>
                    <p class="precio-producto">Desde $${Math.round(precioMinimoFinal).toLocaleString('es-CO')}</p>
                `;
            } else {
                precioHTML = `<p class="precio-producto">Desde $${Math.round(precioMinimoOriginal).toLocaleString('es-CO')}</p>`;
            }

            productoCard.innerHTML = `
                <a href="producto?id=${producto.id}" class="producto-link">
                    ${etiquetaDescuentoHTML}
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p class="titulo-producto">${producto.nombre}</p>
                    <p class="descripcion-producto">${producto.descripcion.substring(0, 100)}...</p>
                    <div class="precio-container">
                        ${precioHTML}
                    </div>
                </a>
            `;
            contenedor.appendChild(productoCard);
        });
    }

    /**
     * Convierte el texto CSV de Google Sheets a un array de objetos JSON.
     */
    function parseCSV(csvText) {
        const lines = csvText.trim().split(/\r\n|\n/);
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
            const values = line.split(',');
            let entry = {};
            headers.forEach((header, i) => {
                entry[header] = values[i] ? values[i].trim() : "";
            });
            return entry;
        });
        return rows;
    }

    // --- LÓGICA PRINCIPAL DE CARGA DE DATOS ---
    
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3b9V0CYiQclbc2X78u8jlCwRToZU9DvDhV-unC6jAcQyhNzZDcbB0ZWVV3t19lyrIZXEgc1ff_EmI/pub?gid=415315048&single=true&output=csv';

    fetch(googleSheetURL)
        .then(response => response.ok ? response.text() : Promise.reject(`Error HTTP: ${response.status}`))
        .then(csvText => {
            const filas = parseCSV(csvText);
            const productosAgrupados = {};
            filas.forEach(row => {
                const id = parseInt(row.id);
                if (!id) return;

                const presentacion = {
                    nombre: row.nombre_presentacion || "Unidad",
                    precio: parseFloat(row.precio) || 0,
                    descuento: parseInt(row.descuento) || 0
                };

                if (!productosAgrupados[id]) {
                    productosAgrupados[id] = {
                        id: id, nombre: row.nombre, descripcion: row.descripcion, imagen: row.imagen,
                        tags: row.tags ? row.tags.split(';').filter(t => t) : [],
                        destacado: row.destacado === 'TRUE', activo: row.activo === 'TRUE',
                        laboratorio: row.laboratorio, especies: row.especies ? row.especies.split(';').filter(e => e) : [],
                        presentaciones: []
                    };
                }
                productosAgrupados[id].presentaciones.push(presentacion);
            });
            const productos = Object.values(productosAgrupados);

            // Guarda todos los productos activos para que el buscador los pueda usar
            todosLosProductos = productos.filter(p => p.activo);

            // Filtra y muestra los productos destacados
            const productosDestacados = todosLosProductos.filter(p => p.destacado);
            if (destacadosContainer) {
                renderizarProductosDestacados(productosDestacados, destacadosContainer);
            }
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            if (destacadosContainer) {
                destacadosContainer.innerHTML = '<p>No se pudieron cargar los productos destacados.</p>';
            }
        });

    // --- LÓGICA DEL BUSCADOR UNIFICADA ---

    // Función que maneja la búsqueda, sin importar qué barra se use
    function manejarBusqueda(event) {
        const termino = event.target.value.trim().toLowerCase();

        // Sincroniza el texto entre ambas barras de búsqueda
        searchInputs.forEach(input => {
            if (input !== event.target) {
                input.value = event.target.value;
            }
        });

        if (termino.length === 0) {
            searchResultsContainers.forEach(c => c.style.display = 'none');
            return;
        }

        const resultados = todosLosProductos.filter(p => p.nombre.toLowerCase().includes(termino));
        
        // Actualiza AMBAS cajas de resultados (aunque solo una sea visible)
        searchResultsContainers.forEach(container => {
            container.innerHTML = '';
            if (resultados.length > 0) {
                resultados.forEach(producto => {
                    const item = document.createElement('a');
                    item.href = `producto?id=${producto.id}`;
                    item.className = 'search-result-item';
                    item.textContent = producto.nombre;
                    container.appendChild(item);
                });
            } else {
                const noResult = document.createElement('div');
                noResult.className = 'no-results';
                noResult.textContent = 'No se encontraron coincidencias';
                container.appendChild(noResult);
            }
            container.style.display = 'block';
        });
    }

    // Añadimos el mismo listener a CADA barra de búsqueda
    searchInputs.forEach(input => input.addEventListener('input', manejarBusqueda));

    // Cierra los resultados si se hace clic fuera del área de búsqueda
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            searchResultsContainers.forEach(c => c.style.display = 'none');
        }
    });
});