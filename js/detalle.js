document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('producto-detalle-container');

    // --- Función para convertir texto CSV a un array de objetos ---
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

    // --- LÓGICA PRINCIPAL ---

    // ¡IMPORTANTE! Pega aquí la misma URL de Google Sheets que usaste en los otros archivos.
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3b9V0CYiQclbc2X78u8jlCwRToZU9DvDhV-unC6jAcQyhNzZDcbB0ZWVV3t19lyrIZXEgc1ff_EmI/pub?gid=415315048&single=true&output=csv';

    fetch(googleSheetURL)
        .then(response => response.ok ? response.text() : Promise.reject(`Error HTTP: ${response.status}`))
        .then(csvText => {
            const filas = parseCSV(csvText);

            // Agrupa las filas del CSV para reconstruir los productos con sus presentaciones
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
                        id: id,
                        nombre: row.nombre,
                        descripcion: row.descripcion,
                        imagen: row.imagen,
                        tags: row.tags ? row.tags.split(';').filter(t => t) : [],
                        destacado: row.destacado === 'TRUE',
                        activo: row.activo === 'TRUE',
                        laboratorio: row.laboratorio,
                        especies: row.especies ? row.especies.split(';').filter(e => e) : [],
                        presentaciones: []
                    };
                }
                productosAgrupados[id].presentaciones.push(presentacion);
            });

            const productos = Object.values(productosAgrupados);

            // Una vez procesados los datos, la lógica para encontrar y mostrar el producto es la misma
            const params = new URLSearchParams(window.location.search);
            const productoId = parseInt(params.get('id'));
            const producto = productos.find(p => p.id === productoId);

            if (producto && producto.activo) {
                document.title = `${producto.nombre} - Distrisur del Valle`;
                    document.title = `${producto.nombre} - Distrisur del Valle`;
            // 2. Actualiza la meta descripción para el SEO
          let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
    }
    metaDescription.content = producto.descripcion.substring(0, 155); // Corta la descripción a 155 caracteres


                agregarSchemaDeProducto(producto); 

                const opcionesPresentaciones = producto.presentaciones.map((pres, index) => 
                    `<option value="${index}">${pres.nombre}</option>`
                ).join('');

                container.innerHTML = `
                    <a href="productos" class="btn-volver">← Volver a Productos</a>
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
                        <a href="https://api.whatsapp.com/send?phone=+573232866467&text=Hola!%20Estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(producto.nombre)}"
                           target="_blank"
                           class="btn-comprar">
                           Compra por WhatsApp
                        </a>
                    </div>
                `;

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
                actualizarPrecio(); 
            } else {
                container.innerHTML = '<h1>Producto no encontrado o no disponible</h1>';
            }
        })
        .catch(error => {
            console.error('Error al cargar el detalle del producto:', error);
            container.innerHTML = '<h1>Error al cargar la información</h1>';
        });
});


/**
 * Crea y añade los datos estructurados (Schema) de un producto al <head> de la página.
 * @param {Object} producto - El objeto del producto que se está mostrando.
 */
function agregarSchemaDeProducto(producto) {
    // Elimina cualquier schema antiguo para evitar duplicados
    const schemaAntiguo = document.getElementById('schema-producto');
    if (schemaAntiguo) {
        schemaAntiguo.remove();
    }

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": producto.nombre,
        "image": `https://www.distrisurdelvalle.co/${producto.imagen}`, // URL completa de la imagen
        "description": producto.descripcion,
        "sku": producto.id,
        "brand": {
            "@type": "Brand",
            "name": producto.laboratorio || "Marca Propia"
        },
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "COP",
            "lowPrice": Math.min(...producto.presentaciones.map(p => p.precio)),
            "highPrice": Math.max(...producto.presentaciones.map(p => p.precio))
        }
    };

    const script = document.createElement('script');
    script.id = 'schema-producto';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}