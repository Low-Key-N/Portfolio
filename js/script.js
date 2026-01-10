document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. NAVBAR SCROLL LOGIC
       ========================================= */
    const nav = document.querySelector('nav');

    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        });
    }

    /* =========================================
       2. TYPEWRITER EFFECT
       ========================================= */
    const textElement = document.getElementById("typewriter-text");

    if (textElement) {
        const text1 = "UI/UX Designer";
        const text2 = "UX Engineer";
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseDelay = 1000;
        let charIndex = 0;

        function typeFirstWord() {
            if (charIndex < text1.length) {
                textElement.textContent += text1.charAt(charIndex);
                charIndex++;
                setTimeout(typeFirstWord, typingSpeed);
            } else {
                setTimeout(deleteWord, pauseDelay);
            }
        }

        function deleteWord() {
            if (charIndex > 0) {
                textElement.textContent = text1.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(deleteWord, deletingSpeed);
            } else {
                setTimeout(typeFinalWord, 500);
            }
        }

        function typeFinalWord() {
            let currentLength = textElement.textContent.length;
            if (currentLength < text2.length) {
                textElement.textContent += text2.charAt(currentLength);
                setTimeout(typeFinalWord, typingSpeed);
            }
        }
        
        setTimeout(typeFirstWord, 1000);
    }

    /* =========================================
       3. CAROUSEL / SLIDER LOGIC
       ========================================= */
    const track = document.querySelector('.carousel-track');

    if (track) {
        const cards = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const dots = document.querySelectorAll('.dot');
        let currentIndex = 0;

        // Helper: Check if mobile/tablet
        const isMobileMode = () => window.innerWidth <= 1366;

        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        };

        const moveToSlide = (index) => {
            if (index < 0 || index >= cards.length) return;
            const cardWidth = cards[0].getBoundingClientRect().width;

            if (isMobileMode()) {
                const gap = 15; 
                const scrollPosition = index * (cardWidth + gap);
                track.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            } else {
                const gap = 20; 
                const slideAmount = index * -(cardWidth + gap);
                track.style.transform = `translateX(${slideAmount}px)`;
            }

            updateDots(index);
            currentIndex = index;
        };

        // Sync scroll events (swiping) with dots
        track.addEventListener('scroll', () => {
            if (isMobileMode()) {
                const cardWidth = cards[0].getBoundingClientRect().width;
                const gap = 15; 
                const scrollLeft = track.scrollLeft;
                const newIndex = Math.round(scrollLeft / (cardWidth + gap));

                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
                    currentIndex = newIndex;
                    updateDots(currentIndex);
                }
            }
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextIndex = currentIndex + 1;
                if (!isMobileMode()) {
                    // Desktop Loop
                    if (nextIndex >= cards.length) moveToSlide(0);
                    else moveToSlide(nextIndex);
                } else {
                    // Mobile Stop
                    if (nextIndex < cards.length) moveToSlide(nextIndex);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevIndex = currentIndex - 1;
                if (!isMobileMode()) {
                    // Desktop Loop
                    if (prevIndex < 0) moveToSlide(cards.length - 1);
                    else moveToSlide(prevIndex);
                } else {
                    // Mobile Stop
                    if (prevIndex >= 0) moveToSlide(prevIndex);
                }
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => moveToSlide(index));
        });
    }

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navLeft = document.querySelector('.nav-left');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLeft.classList.toggle('active');
        });
    }
});
});