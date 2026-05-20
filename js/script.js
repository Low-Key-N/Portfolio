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
                    if (nextIndex >= cards.length) moveToSlide(0);
                    else moveToSlide(nextIndex);
                } else {
                    if (nextIndex < cards.length) moveToSlide(nextIndex);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevIndex = currentIndex - 1;
                if (!isMobileMode()) {
                    if (prevIndex < 0) moveToSlide(cards.length - 1);
                    else moveToSlide(prevIndex);
                } else {
                    if (prevIndex >= 0) moveToSlide(prevIndex);
                }
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => moveToSlide(index));
        });
    }

    /* =========================================
       4. DARK MODE TOGGLE
       ========================================= */

    const MOON_SVG = `<svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    const SUN_SVG  = `<svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

    const navEl = document.querySelector('nav');
    if (!navEl) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');

    // Apply dark mode to <body> and update button icon
    const applyDarkMode = (isDark) => {
        if (isDark) {
            document.body.classList.add('site-dark-mode');
            toggleBtn.innerHTML = SUN_SVG;
        } else {
            document.body.classList.remove('site-dark-mode');
            toggleBtn.innerHTML = MOON_SVG;
        }
    };

    // Read from localStorage on every page load and apply immediately
    const saved = localStorage.getItem('siteDarkMode');
    applyDarkMode(saved === 'on');

    toggleBtn.addEventListener('click', () => {
        const nowDark = document.body.classList.contains('site-dark-mode');
        const next = !nowDark;
        applyDarkMode(next);
        localStorage.setItem('siteDarkMode', next ? 'on' : 'off');
    });

    // Insert at the end of nav-right
    const navRight = navEl.querySelector('.nav-right');
    if (navRight) {
        navRight.appendChild(toggleBtn);
    } else {
        navEl.appendChild(toggleBtn);
    }

});