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

document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.querySelector('.productos-informacion .grid-productos');
    const filtrosContainer = document.getElementById('filtros-container');
    const tituloCategoria = document.querySelector('.productos-informacion h1');
    const btnLimpiar = document.getElementById('limpiar-filtros');

    // Estado: Almacena los filtros activos. Usamos un Set para evitar duplicados.
    let filtrosActivos = new Set();

    // 1. Define la estructura de tus grupos de filtros
    const gruposDeFiltros = {
        "Animal": ["mascota", "caballos", "bovinos"],
        "Tipo de Producto": ["trampas", "modificadores", "fertilizantes", "sustratos", "protectores", "herramientas","Desinfectante"]
    };
    const cabeceraFiltroMovil = document.getElementById('filtro-movil-cabecera');
    const contenidoColapsable = document.getElementById('filtro-contenido-colapsable');

    // 2. Función para renderizar los filtros
    function renderizarFiltros() {
        filtrosContainer.innerHTML = ''; // Limpiamos antes de renderizar
        for (const grupo in gruposDeFiltros) {
            const grupoDiv = document.createElement('div');
            grupoDiv.classList.add('filtro-grupo');
            
            const tituloGrupo = document.createElement('h3');
            tituloGrupo.textContent = grupo;
            grupoDiv.appendChild(tituloGrupo);

            const botonesDiv = document.createElement('div');
            botonesDiv.classList.add('botones-grupo');

            gruposDeFiltros[grupo].forEach(tag => {
                const boton = document.createElement('button');
                boton.classList.add('btn-filtro');
                boton.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
                boton.dataset.tag = tag;
                // Si el tag está en los filtros activos, lo marcamos
                if (filtrosActivos.has(tag)) {
                    boton.classList.add('activo');
                }
                botonesDiv.appendChild(boton);
            });
            grupoDiv.appendChild(botonesDiv);
            filtrosContainer.appendChild(grupoDiv);
        }
    }

    // 3. Función principal para aplicar filtros y actualizar la vista
    function aplicarYRenderizar() {
        let productosFiltrados = productos;

        // Si hay filtros activos, filtramos los productos
        if (filtrosActivos.size > 0) {
            productosFiltrados = productos.filter(producto => {
                // .every() comprueba si el producto cumple con TODOS los filtros activos
                return Array.from(filtrosActivos).every(filtro => producto.tags.includes(filtro));
            });
        }
        
        // Actualizamos el título
        if (filtrosActivos.size === 0) {
            tituloCategoria.textContent = 'Todos los productos';
        } else {
            tituloCategoria.textContent = `Filtros: ${Array.from(filtrosActivos).join(', ')}`;
        }
        
        renderizarProductos(productosFiltrados, productosContainer);
    }

    // 4. Event Listeners
     if (cabeceraFiltroMovil) {
        cabeceraFiltroMovil.addEventListener('click', () => {
            // Alterna la clase 'activo' en la cabecera (para girar la flecha)
            cabeceraFiltroMovil.classList.toggle('activo');
            // Alterna la clase 'abierto' en el contenido (para mostrarlo/ocultarlo)
            contenidoColapsable.classList.toggle('abierto');
        });
    }

    filtrosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-filtro')) {
            const tag = e.target.dataset.tag;
            // Alternamos el estado del botón y del filtro en el Set
            e.target.classList.toggle('activo');
            if (filtrosActivos.has(tag)) {
                filtrosActivos.delete(tag); // Si ya está, lo quitamos
            } else {
                filtrosActivos.add(tag); // Si no está, lo añadimos
            }
            aplicarYRenderizar(); // Volvemos a aplicar filtros y renderizar
        }
    });

    btnLimpiar.addEventListener('click', () => {
        filtrosActivos.clear(); // Vaciamos el set de filtros
        renderizarFiltros();    // Re-dibujamos los botones sin la clase 'activo'
        aplicarYRenderizar();   // Mostramos todos los productos de nuevo
    });

    // --- Carga Inicial ---
    renderizarFiltros();
    aplicarYRenderizar();
});

