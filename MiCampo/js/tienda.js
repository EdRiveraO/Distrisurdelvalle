document.addEventListener('DOMContentLoaded', () => {

    // La función para renderizar productos no necesita cambios.
    function renderizarProductos(arrayDeProductos, contenedor) {
        // ... (código sin cambios)
    }

    /**
     * VERSIÓN MEJORADA: Genera filtros dinámicamente para tags, especies y laboratorios.
     */
    function renderizarFiltros(productos, contenedor, filtrosActivos) {
        contenedor.innerHTML = '';

        const todosLosTags = new Set();
        const todasLasEspecies = new Set();
        const todosLosLabs = new Set();

        // 1. Recolecta todos los valores únicos de los productos
        productos.forEach(p => {
            if (p.tags) p.tags.forEach(tag => todosLosTags.add(tag));
            if (p.especies) p.especies.forEach(especie => todasLasEspecies.add(especie));
            if (p.laboratorio) todosLosLabs.add(p.laboratorio);
        });

        // 2. Función para crear una sección de filtros
        const crearGrupoDeFiltros = (titulo, setDeValores) => {
            if (setDeValores.size === 0) return; // No crea la sección si no hay filtros

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
                boton.dataset.tag = valor; // Usamos 'tag' para todos para simplificar
                if (filtrosActivos.has(valor)) {
                    boton.classList.add('activo');
                }
                botonesDiv.appendChild(boton);
            });
            
            grupoDiv.appendChild(botonesDiv);
            contenedor.appendChild(grupoDiv);
        };

        // 3. Crea cada grupo de filtros
        crearGrupoDeFiltros('Tipo de Producto', todosLosTags);
        crearGrupoDeFiltros('Especie', todasLasEspecies);
        crearGrupoDeFiltros('Laboratorio', todosLosLabs);
    }

    // --- LÓGICA PRINCIPAL ---
    fetch('../productos.json')
        .then(response => response.ok ? response.json() : Promise.reject(response.status))
        .then(productos => {
            const productosActivos = productos.filter(p => p.activo);
            
            const productosContainer = document.querySelector('.productos-informacion .grid-productos');
            const filtrosContainer = document.getElementById('filtros-container');
            const tituloCategoria = document.querySelector('.productos-informacion h1');
            const btnLimpiar = document.getElementById('limpiar-filtros');
            
            let filtrosActivos = new Set();

            function aplicarYRenderizar() {
                let productosFiltrados = productosActivos;
                if (filtrosActivos.size > 0) {
                    productosFiltrados = productosActivos.filter(producto => {
                        // Combina todos los atributos filtrables del producto en una sola lista
                        const atributosDelProducto = [
                            ...(producto.tags || []),
                            ...(producto.especies || []),
                            producto.laboratorio
                        ];
                        // Comprueba si CADA filtro activo está en los atributos del producto
                        return Array.from(filtrosActivos).every(filtro => atributosDelProducto.includes(filtro));
                    });
                }
                // ... (resto de la función sin cambios)
                renderizarProductos(productosFiltrados, productosContainer);
            }

            // Event Listeners y Carga Inicial (sin cambios)
            // ...
             // Event Listeners
             filtrosContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-filtro')) {
                    const tag = e.target.dataset.tag;
                    e.target.classList.toggle('activo');
                    if (filtrosActivos.has(tag)) {
                        filtrosActivos.delete(tag);
                    } else {
                        filtrosActivos.add(tag);
                    }
                    aplicarYRenderizar();
                }
            });

            btnLimpiar.addEventListener('click', () => {
                filtrosActivos.clear();
                renderizarFiltros(productosActivos, filtrosContainer, filtrosActivos);
                aplicarYRenderizar();
            });

            // Carga Inicial
            renderizarFiltros(productosActivos, filtrosContainer, filtrosActivos);
            aplicarYRenderizar();

        })
        .catch(error => console.error('Error al cargar productos:', error));

    // Lógica para el botón desplegable en móvil (sin cambios)
    // ...
});