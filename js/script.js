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
       2. SMART CAROUSEL LOGIC (Fixed Bounds)
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

        // --- UPDATE DOTS VISUALLY ---
        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        };

        // --- MAIN MOVE FUNCTION (Handles both Scroll & Slide) ---
        const moveToSlide = (index) => {
            // BOUNDARY CHECK: Prevent scrolling too far left or right
            if (index < 0 || index >= cards.length) return;

            const cardWidth = cards[0].getBoundingClientRect().width;

            // LOGIC A: iPad/Mobile (Use Native Scroll to SPECIFIC position)
            if (isMobileMode()) {
                const gap = 15; // Matches CSS gap
                // Calculate exact position of the target card
                const scrollPosition = index * (cardWidth + gap);
                
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

        // --- LISTEN FOR PHYSICAL SCROLL/SWIPE (Syncs Dots & Buttons) ---
        track.addEventListener('scroll', () => {
            if (isMobileMode()) {
                const cardWidth = cards[0].getBoundingClientRect().width;
                const gap = 15; 
                
                // Calculate which card is closest to the center
                const scrollLeft = track.scrollLeft;
                const newIndex = Math.round(scrollLeft / (cardWidth + gap));

                // Only update if index changed and is valid
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
                    currentIndex = newIndex;
                    updateDots(currentIndex);
                }
            }
        });

        // --- BUTTON LISTENERS (Now with Bounds Checks) ---
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Calculate next index
                const nextIndex = currentIndex + 1;
                
                // Desktop Looping (Optional) vs Mobile Hard Stop
                if (!isMobileMode()) {
                    // Desktop: Loop back to start if at end
                    if (nextIndex >= cards.length) {
                        moveToSlide(0);
                    } else {
                        moveToSlide(nextIndex);
                    }
                } else {
                    // Mobile: Hard Stop (Prevents breaking layout)
                    if (nextIndex < cards.length) {
                        moveToSlide(nextIndex);
                    }
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevIndex = currentIndex - 1;

                if (!isMobileMode()) {
                    // Desktop: Loop to end
                    if (prevIndex < 0) {
                        moveToSlide(cards.length - 1);
                    } else {
                        moveToSlide(prevIndex);
                    }
                } else {
                    // Mobile: Hard Stop
                    if (prevIndex >= 0) {
                        moveToSlide(prevIndex);
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

        // Handle Resize (Keeps things aligned)
        window.addEventListener('resize', () => {
            // moveToSlide(currentIndex); // Optional: Re-aligns on resize
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