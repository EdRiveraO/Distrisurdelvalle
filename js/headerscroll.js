document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA HEADER DINÁMICO ---
    
    const header = document.querySelector('.site-header');
    const body = document.body;
    const headerHeight = header.offsetHeight;
    let lastScrollY = window.scrollY;

    body.style.setProperty('--header-height', `${headerHeight}px`);

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Si estamos arriba del todo, estado original
        if (currentScrollY <= headerHeight) {
            header.classList.remove('header-fixed', 'header-hidden');
            body.classList.remove('body-padding-header');
            return;
        }

        // --- Lógica Invertida (Aparece al bajar, se oculta al subir) ---
        if (currentScrollY > lastScrollY) {
            // ABAJO: MOSTRAR el header
            header.classList.remove('header-hidden');
        } else {
            // ARRIBA: OCULTAR el header
            header.classList.add('header-hidden');
        }

        // Siempre debe estar fijo si no estamos arriba
        header.classList.add('header-fixed');
        body.classList.add('body-padding-header');

        lastScrollY = currentScrollY;
    });
});