document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. TYPEWRITER EFFECT
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
       2. SMART CAROUSEL LOGIC
       ========================================= */
    const track = document.querySelector('.carousel-track');

    if (track) {
        const cards = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const dots = document.querySelectorAll('.dot');

        let currentIndex = 0;

        // --- HELPER: Detect if we are on iPad/Mobile ---
        const isMobileMode = () => window.innerWidth <= 1366;

        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        };

        // --- NEW: LISTEN FOR PHYSICAL SCROLL/SWIPE ---
        // This makes the dots update when you drag with your finger
        track.addEventListener('scroll', () => {
            if (isMobileMode()) {
                const cardWidth = cards[0].getBoundingClientRect().width;
                const gap = 15; // Matches CSS gap
                
                // Calculate which card is currently centered based on scroll position
                const scrollLeft = track.scrollLeft;
                const newIndex = Math.round(scrollLeft / (cardWidth + gap));

                // Only update if the index actually changed
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
                    currentIndex = newIndex;
                    updateDots(currentIndex);
                }
            }
        });

        const moveToSlide = (index) => {
            const cardWidth = cards[0].getBoundingClientRect().width;
            
            // LOGIC A: iPad/Mobile (Use Native Scroll)
            if (isMobileMode()) {
                const gap = 15; 
                const scrollPosition = index * (cardWidth + gap);
                
                track.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            } 
            // LOGIC B: Desktop (Use Transform Slide)
            else {
                const gap = 20; 
                const slideAmount = index * -(cardWidth + gap);
                track.style.transform = `translateX(${slideAmount}px)`;
            }

            updateDots(index);
            currentIndex = index;
        };

        // --- BUTTON LISTENERS ---
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (isMobileMode()) {
                    // Just scroll forward by one card width
                    const cardWidth = cards[0].offsetWidth;
                    track.scrollBy({ left: cardWidth + 15, behavior: 'smooth' });
                } else {
                    if (currentIndex < cards.length - 1) {
                        moveToSlide(currentIndex + 1);
                    } else {
                        moveToSlide(0);
                    }
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (isMobileMode()) {
                    // Just scroll backward
                    const cardWidth = cards[0].offsetWidth;
                    track.scrollBy({ left: -(cardWidth + 15), behavior: 'smooth' });
                } else {
                    if (currentIndex > 0) {
                        moveToSlide(currentIndex - 1);
                    } else {
                        moveToSlide(cards.length - 1);
                    }
                }
            });
        }

        // --- DOT LISTENERS ---
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
        });

        // Handle Resize
        window.addEventListener('resize', () => {
            // Optional: Recalculate if needed
        });
    }

    /* =========================================
       3. NAVBAR SCROLL
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

});