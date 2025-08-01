document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN ---
    const PRODUCTOS_POR_PAGINA = 8; // Define cuántos productos mostrar por página

    // --- FUNCIONES AUXILIARES ---

    /**
     * Dibuja las tarjetas de productos en un contenedor.
     */
    function renderizarProductos(arrayDeProductos, contenedor) {
        contenedor.innerHTML = '';
        if (arrayDeProductos.length === 0) {
            contenedor.innerHTML = '<p class="no-productos">No se encontraron productos que coincidan con la búsqueda.</p>';
            return;
        }

        arrayDeProductos.forEach(producto => {
            

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
                <a href="producto.html?id=${producto.id}" class="producto-link">
                    ${etiquetaDescuentoHTML}
                    <img src="../${producto.imagen}" alt="Imagen de ${producto.nombre}">
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
     * Genera los filtros dinámicamente a partir de los productos.
     */
    function renderizarFiltros(productos, contenedor, filtrosActivos) {
        contenedor.innerHTML = '';
        const todosLosTags = new Set(), todasLasEspecies = new Set(), todosLosLabs = new Set();

        productos.forEach(p => {
            if (p.tags && p.tags.length > 0) p.tags.forEach(tag => todosLosTags.add(tag));
            if (p.especies && p.especies.length > 0) p.especies.forEach(especie => todasLasEspecies.add(especie));
            if (p.laboratorio) todosLosLabs.add(p.laboratorio);
        });

        const crearGrupoDeFiltros = (titulo, setDeValores) => {
            if (setDeValores.size === 0) return;
            const grupoDiv = document.createElement('div');
            grupoDiv.classList.add('filtro-grupo');
            const tituloH3 = document.createElement('h3');
            tituloH3.textContent = titulo;
            grupoDiv.appendChild(tituloH3);
            const botonesDiv = document.createElement('div');
            botonesDiv.classList.add('botones-grupo');
            setDeValores.forEach(valor => {
                const boton = document.createElement('button');
                boton.classList.add('btn-filtro');
                boton.textContent = valor.charAt(0).toUpperCase() + valor.slice(1);
                boton.dataset.tag = valor;
                boton.dataset.grupo = titulo;
                if (filtrosActivos[titulo] === valor) {
                    boton.classList.add('activo');
                }
                botonesDiv.appendChild(boton);
            });
            grupoDiv.appendChild(botonesDiv);
            contenedor.appendChild(grupoDiv);
        };

        crearGrupoDeFiltros('Tipo de Producto', todosLosTags);
        crearGrupoDeFiltros('Especie', todasLasEspecies);
        crearGrupoDeFiltros('Laboratorio', todosLosLabs);
    }
    
    /**
 * Dibuja los controles de paginación.
 */
function renderizarPaginacion(totalProductos, contenedor, paginaActual) {
    contenedor.innerHTML = '';
    const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA);

    if (totalPaginas <= 1) return; // No muestra nada si solo hay una página

    const crearBoton = (texto, pagina, deshabilitado = false, activo = false) => {
        const btn = document.createElement('button');
        btn.textContent = texto;
        btn.className = 'btn-pagina';
        btn.dataset.pagina = pagina;
        if (deshabilitado) btn.disabled = true;
        if (activo) btn.classList.add('activo');
        return btn;
    };

    const crearEllipsis = () => {
        const span = document.createElement('span');
        span.className = 'paginacion-ellipsis';
        span.textContent = '..';
        return span;
    };

    // Botón "Anterior"
    const btnAtras = crearBoton('Atrás', paginaActual - 1, paginaActual === 1);
    btnAtras.classList.add('btn-pag-nav'); // <-- AÑADIDO: Clase para el botón "Atrás"
    contenedor.appendChild(btnAtras);

    // Lógica para mostrar los números de página
    const paginasAMostrar = new Set();
    paginasAMostrar.add(1); // Siempre muestra la primera página
    if (totalPaginas > 1) {
        paginasAMostrar.add(totalPaginas); // Siempre muestra la última página
    }

    // Añade páginas alrededor de la actual
    for (let i = -1; i <= 1; i++) {
        const pagina = paginaActual + i;
        if (pagina > 0 && pagina <= totalPaginas) {
            paginasAMostrar.add(pagina);
        }
    }

    const paginasOrdenadas = Array.from(paginasAMostrar).sort((a, b) => a - b);
    
    let ultimoNumeroRenderizado = 0;
    paginasOrdenadas.forEach(num => {
        if (num > ultimoNumeroRenderizado + 1) {
            contenedor.appendChild(crearEllipsis());
        }
        contenedor.appendChild(crearBoton(num, num, false, num === paginaActual));
        ultimoNumeroRenderizado = num;
    });

    // Botón "Siguiente"
    const btnSiguiente = crearBoton('Siguiente', paginaActual + 1, paginaActual === totalPaginas);
    btnSiguiente.classList.add('btn-pag-nav'); // <-- AÑADIDO: Clase para el botón "Siguiente"
    contenedor.appendChild(btnSiguiente);
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

    // --- LÓGICA PRINCIPAL ---
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
                        laboratorio: row.laboratorio,
                        especies: row.especies ? row.especies.split(';').filter(e => e) : [],
                        presentaciones: []
                    };
                }
                productosAgrupados[id].presentaciones.push(presentacion);
            });
            const productos = Object.values(productosAgrupados);
            const productosActivos = productos.filter(p => p.activo);

            const productosContainer = document.querySelector('.productos-informacion .grid-productos');
            const filtrosContainer = document.getElementById('filtros-container');
            const paginacionContainer = document.getElementById('paginacion-container');
            const tituloCategoria = document.querySelector('.productos-informacion h1');
            const btnLimpiar = document.getElementById('limpiar-filtros');
            
            let filtrosActivos = { 'Tipo de Producto': null, 'Especie': null, 'Laboratorio': null };
            let paginaActual = 1;
            let productosFiltradosActuales = productosActivos;

            const urlParams = new URLSearchParams(window.location.search);
            const filtroInicial = urlParams.get('filtro');
            if (filtroInicial) {
                const filtroNormalizado = filtroInicial.toLowerCase();
                for (const producto of productosActivos) {
                    if ((producto.especies || []).includes(filtroNormalizado)) {
                        filtrosActivos['Especie'] = filtroNormalizado;
                        break;
                    }
                    if ((producto.tags || []).includes(filtroNormalizado)) {
                        filtrosActivos['Tipo de Producto'] = filtroNormalizado;
                        break;
                    }
                }
            }
            
            function actualizarVista() {
                const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
                const fin = inicio + PRODUCTOS_POR_PAGINA;
                const productosDeLaPagina = productosFiltradosActuales.slice(inicio, fin);
                
                renderizarProductos(productosDeLaPagina, productosContainer);
                renderizarPaginacion(productosFiltradosActuales.length, paginacionContainer, paginaActual);
            }

            function aplicarFiltros() {
                paginaActual = 1;
                productosFiltradosActuales = productosActivos.filter(producto => {
                    const filtroTipo = filtrosActivos['Tipo de Producto'];
                    const filtroEspecie = filtrosActivos['Especie'];
                    const filtroLab = filtrosActivos['Laboratorio'];
                    if (filtroTipo && !(producto.tags || []).includes(filtroTipo)) return false;
                    if (filtroEspecie && !(producto.especies || []).includes(filtroEspecie)) return false;
                    if (filtroLab && producto.laboratorio !== filtroLab) return false;
                    return true;
                });
                
                const filtrosSeleccionados = Object.values(filtrosActivos).filter(Boolean);
                tituloCategoria.textContent = filtrosSeleccionados.length === 0 
                    ? 'Nuestros Productos' 
                    : filtrosSeleccionados.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');

                actualizarVista();
            }

            filtrosContainer.addEventListener('click', e => {
                if (e.target.classList.contains('btn-filtro')) {
                    const tag = e.target.dataset.tag;
                    const grupo = e.target.dataset.grupo;
                    filtrosActivos[grupo] = filtrosActivos[grupo] === tag ? null : tag;
                    renderizarFiltros(productosActivos, filtrosContainer, filtrosActivos);
                    aplicarFiltros();
                }
            });

            btnLimpiar.addEventListener('click', () => {
                filtrosActivos = { 'Tipo de Producto': null, 'Especie': null, 'Laboratorio': null };
                renderizarFiltros(productosActivos, filtrosContainer, filtrosActivos);
                aplicarFiltros();
            });

            paginacionContainer.addEventListener('click', e => {
                if (e.target.classList.contains('btn-pagina') && !e.target.disabled) {
                    paginaActual = parseInt(e.target.dataset.pagina);
                    actualizarVista();
                    
                    document.querySelector('.productos-informacion').scrollIntoView({ behavior: 'smooth' });

                }
            });

            renderizarFiltros(productosActivos, filtrosContainer, filtrosActivos);
            aplicarFiltros();
        })
        .catch(error => {
            console.error('Error fatal al cargar o procesar datos:', error);
            document.querySelector('.productos-informacion').innerHTML = '<p class="error-carga">Hubo un problema al cargar los productos.</p>';
        });

    const cabeceraFiltroMovil = document.getElementById('filtro-movil-cabecera');
    const contenidoColapsable = document.getElementById('filtro-contenido-colapsable');
    if (cabeceraFiltroMovil && contenidoColapsable) {
        cabeceraFiltroMovil.addEventListener('click', () => {
            cabeceraFiltroMovil.classList.toggle('activo');
            contenidoColapsable.classList.toggle('abierto');
        });
    }
});