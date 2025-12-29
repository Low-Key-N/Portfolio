document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. TYPEWRITER EFFECT (Unchanged)
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
       2. SMART CAROUSEL LOGIC (Upgraded!)
       ========================================= */
    const track = document.querySelector('.carousel-track');

    if (track) {
        const cards = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const dots = document.querySelectorAll('.dot');

        let currentIndex = 0;

        // --- HELPER: Detect if we are on iPad/Mobile ---
        // Matches your CSS @media (max-width: 1366px)
        const isMobileMode = () => window.innerWidth <= 1366;

        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        };

        const moveToSlide = (index) => {
            const cardWidth = cards[0].getBoundingClientRect().width;
            
            // LOGIC A: iPad/Mobile (Use Native Scroll)
            if (isMobileMode()) {
                const gap = 15; // Matches CSS gap
                const scrollPosition = index * (cardWidth + gap);
                
                // Smoothly scroll to the correct position
                track.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            } 
            // LOGIC B: Desktop (Use Transform Slide)
            else {
                const gap = 20; // Matches CSS gap
                const slideAmount = index * -(cardWidth + gap);
                track.style.transform = `translateX(${slideAmount}px)`;
            }

            updateDots(index);
            currentIndex = index;
        };

        // --- BUTTON LISTENERS ---
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Check Mode
                if (isMobileMode()) {
                    // Just scroll forward by one card width
                    const cardWidth = cards[0].offsetWidth;
                    track.scrollBy({ left: cardWidth + 15, behavior: 'smooth' });
                } else {
                    // Desktop Logic
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
                // Check Mode
                if (isMobileMode()) {
                    // Just scroll backward
                    const cardWidth = cards[0].offsetWidth;
                    track.scrollBy({ left: -(cardWidth + 15), behavior: 'smooth' });
                } else {
                    // Desktop Logic
                    if (currentIndex > 0) {
                        moveToSlide(currentIndex - 1);
                    } else {
                        moveToSlide(cards.length - 1);
                    }
                }
            });
        }

        // --- DOT LISTENERS (Works for both modes) ---
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
        });

        // Handle Resize (Resets position to prevent glitches)
        window.addEventListener('resize', () => {
            // Optional: reset to 0 or try to maintain current index
            // moveToSlide(currentIndex);
        });
    }

    /* =========================================
       3. NAVBAR SCROLL (Unchanged)
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