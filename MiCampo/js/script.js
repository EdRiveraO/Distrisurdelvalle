document.addEventListener('DOMContentLoaded', () => {

    const sliderContainer = document.querySelector('.slider-container');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    let slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // --- Lógica del carrusel infinito ---
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    sliderWrapper.appendChild(firstClone);
    sliderWrapper.insertBefore(lastClone, slides[0]);

    slides = document.querySelectorAll('.slide');
    let currentIndex = 1; 
    const totalSlides = slides.length;
    let slideInterval;
    
    // --- NUEVO: Bandera para controlar el estado de la transición ---
    let isTransitioning = false;

    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    sliderWrapper.style.transition = 'none'; 

    let startPosX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    for (let i = 0; i < slides.length - 2; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dotsContainer.appendChild(dot);
    }
    const dots = document.querySelectorAll('.dot');

    // --- Funciones principales ---
    const updateDots = () => {
        dots.forEach(dot => dot.classList.remove('active'));
        const dotIndex = (currentIndex - 1 + (slides.length - 2)) % (slides.length - 2);
        dots[dotIndex].classList.add('active');
    };
    
    const moveToSlide = () => {
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    };

    const shiftSlides = () => {
        // Esta función se encarga del "salto" invisible
        if (currentIndex <= 0) { 
            sliderWrapper.style.transition = 'none';
            currentIndex = totalSlides - 2; 
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        } else if (currentIndex >= totalSlides - 1) { 
            sliderWrapper.style.transition = 'none';
            currentIndex = 1; 
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        // MODIFICADO: Al terminar el salto, permitimos nuevas transiciones
        isTransitioning = false; 
    };

    const nextSlide = () => {
        // MODIFICADO: Si hay una animación en curso, no hacemos nada
        if (isTransitioning) return; 
        isTransitioning = true; // Activamos la bandera

        sliderWrapper.style.transition = 'transform 0.8s ease-in-out';
        currentIndex++;
        moveToSlide();
    };
    
    const prevSlide = () => {
        // MODIFICADO: Si hay una animación en curso, no hacemos nada
        if (isTransitioning) return; 
        isTransitioning = true; // Activamos la bandera

        sliderWrapper.style.transition = 'transform 0.8s ease-in-out';
        currentIndex--;
        moveToSlide();
    };

    const resetInterval = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    };

    // --- Event Listeners ---
    sliderWrapper.addEventListener('transitionend', () => {
        // MODIFICADO: Cuando la transición termina, llamamos a shiftSlides
        // Y permitimos de nuevo el movimiento.
        shiftSlides();
    });

    // --- SOLO REEMPLAZA ESTA FUNCIÓN ---

dotsContainer.addEventListener('click', (e) => {
    // Nos aseguramos de que el clic fue en un 'dot'
    if (e.target.classList.contains('dot')) {
        const dotIndex = Array.from(dots).indexOf(e.target);
        // Calculamos a qué slide queremos ir (los slides empiezan en 1, no 0)
        const targetIndex = dotIndex + 1;

        // ---- LA CORRECCIÓN ESTÁ AQUÍ ----
      // Si el slide al que queremos ir ya es el actual, no hacemos nada.
      if (targetIndex === currentIndex) {
            return; // Detenemos la función aquí mismo.
        }

        // Comprobamos si ya hay una animación en curso.
        if (isTransitioning) return;
        
        // Si no, iniciamos la transición.
        isTransitioning = true; 
        currentIndex = targetIndex; // Movemos al índice deseado
        sliderWrapper.style.transition = 'transform 0.8s ease-in-out';
        moveToSlide();
        resetInterval(); // Reiniciamos el intervalo automático
    }
});
    // --- Lógica táctil actualizada ---
    sliderContainer.addEventListener('touchstart', (e) => {
        // MODIFICADO: Si hay una animación, no permitimos iniciar un nuevo deslizamiento
        if (isTransitioning) return;
        
        isDragging = true;
        startPosX = e.touches[0].clientX;
        clearInterval(slideInterval);
        sliderWrapper.style.transition = 'none';
        prevTranslate = -currentIndex * sliderContainer.offsetWidth;
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentPosition = e.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPosX;
        sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
    });

    sliderContainer.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    // Decidimos si cambiar de slide solo si no hay una animación ya en curso
    if (!isTransitioning) {
        if (movedBy < -sliderContainer.offsetWidth * 0.2) {
            nextSlide();
        } else if (movedBy > sliderContainer.offsetWidth * 0.2) {
            prevSlide();
        } else {
            // Si no se deslizó lo suficiente, volver al slide actual
            // ---- LA CORRECCIÓN ESTÁ AQUÍ ----
            isTransitioning = true; // NUEVO: Avisamos que empieza una animación
            sliderWrapper.style.transition = 'transform 0.8s ease-in-out';
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }
    
    resetInterval();
});

    // --- INICIO ---
    updateDots();
    resetInterval();
});