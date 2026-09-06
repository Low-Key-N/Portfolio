document.addEventListener('DOMContentLoaded', () => {

    const revealFeaturedWorks = () => {
        const featuredWorks = document.querySelector('[data-featured-works]');
        if (featuredWorks) featuredWorks.classList.add('is-visible');
    };

    /* =========================================
       0. STARTUP INTRO
       ========================================= */
    const startupIntroSessionKey = 'startupIntroPlayed';
    const startupIntroTimeKey = 'startupIntroPlayedAt';
    const startupIntroWindowFlag = 'startupIntroPlayed=true';
    const startupIntroCooldown = 30 * 60 * 1000;

    const startupIntroPlayedInTab = () => window.name.includes(startupIntroWindowFlag);

    const hasStartupIntroPlayed = () => {
        if (startupIntroPlayedInTab()) return true;

        try {
            const playedThisSession = sessionStorage.getItem(startupIntroSessionKey) === 'true';
            const playedAt = Number(localStorage.getItem(startupIntroTimeKey) || 0);
            const playedRecently = playedAt > 0 && Date.now() - playedAt < startupIntroCooldown;
            return playedThisSession || playedRecently;
        } catch (error) {
            return false;
        }
    };

    const markStartupIntroPlayed = () => {
        try {
            sessionStorage.setItem(startupIntroSessionKey, 'true');
            localStorage.setItem(startupIntroTimeKey, String(Date.now()));
        } catch (error) {
            // Storage can be unavailable in private modes, so window.name is the fallback.
        }

        if (!startupIntroPlayedInTab()) {
            window.name = `${window.name ? `${window.name};` : ''}${startupIntroWindowFlag}`;
        }
    };

    const playStartupIntro = () => {
        const forceIntro = /[?&]intro(?:=|&|$)/.test(window.location.search);

        if (!forceIntro && hasStartupIntroPlayed()) {
            window.setTimeout(revealFeaturedWorks, 80);
            return;
        }

        markStartupIntroPlayed();

        const favicon = document.querySelector('link[rel~="icon"]');
        const faviconSrc = favicon ? favicon.href : 'assets/images/keyon-favicon.png';
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const intro = document.createElement('div');
        intro.className = 'startup-intro';
        intro.setAttribute('aria-hidden', 'true');
        intro.innerHTML = `
            <span class="startup-iris"></span>
            <span class="startup-ripple startup-ripple-one"></span>
            <span class="startup-ripple startup-ripple-two"></span>
            <div class="startup-hello">
                <span class="startup-hello-text"></span><span class="startup-hello-cursor">|</span>
            </div>
            <div class="startup-mark">
                <img src="${faviconSrc}" alt="">
            </div>
        `;

        document.body.appendChild(intro);

        const helloText = intro.querySelector('.startup-hello-text');
        const typeStartupHello = () => {
            if (prefersReducedMotion) {
                helloText.textContent = 'Hello';
                return;
            }

            const message = 'Hello';
            const typingSpeed = 115;
            let index = 0;

            const typeNextLetter = () => {
                if (index >= message.length) return;
                helloText.textContent += message.charAt(index);
                index++;
                window.setTimeout(typeNextLetter, typingSpeed);
            };

            window.setTimeout(typeNextLetter, 260);
        };

        typeStartupHello();

        const finishIntro = () => {
            intro.classList.add('startup-intro-exit');
            window.setTimeout(revealFeaturedWorks, prefersReducedMotion ? 0 : 120);
            window.setTimeout(() => {
                intro.remove();
            }, prefersReducedMotion ? 120 : 800);
        };

        window.setTimeout(finishIntro, prefersReducedMotion ? 160 : 2100);
    };

    playStartupIntro();

    /* =========================================
       1. NAVBAR SCROLL LOGIC
       ========================================= */
    const nav = document.querySelector('nav');
    const heroSection = document.getElementById('hero-section');
    const heroContent = document.querySelector('#hero-section .hero-content');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let heroScrollTicking = false;

    const updateHeroScroll = () => {
        heroScrollTicking = false;
        if (!heroSection || !heroContent || prefersReducedMotion) return;

        const heroHeight = heroSection.offsetHeight || window.innerHeight;
        const progress = Math.min(window.scrollY / heroHeight, 1);
        const bgShift = Math.round(progress * 90);
        const contentShift = Math.round(progress * -70);
        const contentOpacity = Math.max(1 - progress * 0.38, 0.62).toFixed(2);

        heroSection.style.setProperty('--hero-bg-shift', `${bgShift}px`);
        heroContent.style.setProperty('--hero-content-shift', `${contentShift}px`);
        heroContent.style.setProperty('--hero-content-opacity', contentOpacity);
    };

    const requestHeroScrollUpdate = () => {
        if (heroScrollTicking) return;
        heroScrollTicking = true;
        window.requestAnimationFrame(updateHeroScroll);
    };

    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }

            requestHeroScrollUpdate();
        });
    }

    updateHeroScroll();

    /* =========================================
       2. EXPERIENCE TIMELINE REVEAL
       ========================================= */
    const experienceTimeline = document.querySelector('[data-experience-timeline]');
    const experienceCards = document.querySelectorAll('[data-experience-card]');

    if (experienceTimeline && experienceCards.length) {
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            experienceTimeline.classList.add('is-visible');
            experienceCards.forEach(card => card.classList.add('is-visible'));
        } else {
            const experienceObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    if (entry.target === experienceTimeline) {
                        experienceCards.forEach(card => card.classList.add('is-visible'));
                    }
                    experienceObserver.unobserve(entry.target);
                });
            }, { threshold: 0.26 });

            experienceObserver.observe(experienceTimeline);
            experienceCards.forEach(card => experienceObserver.observe(card));
        }
    }

    const experienceNodes = document.querySelectorAll('[data-experience-node]');
    const experienceCard = document.querySelector('[data-active-experience]');

    if (experienceNodes.length && experienceCard) {
        const experienceData = [
            {
                title: 'Software Developer <span>SecurEd Inc · CLARK Cybersecurity Library</span>',
                dates: 'August 2026 - Present',
                stack: ['Software Development', 'Cybersecurity', 'Contract', 'On-site'],
                skills: [
                    ['Software Development', 85],
                    ['Cybersecurity', 80],
                    ['Technical Collaboration', 80],
                    ['On-site Development', 80]
                ],
                description: 'Working as a contract Software Developer with SecurEd Inc on the CLARK Cybersecurity Library in Towson, Maryland.',
                highlight: 'Contributing software development expertise to the CLARK Cybersecurity Library.'
            },
            {
                title: 'Undergraduate Research Assistant',
                dates: 'October 2025 - Present',
                stack: ['Figma', 'UX Research', 'Literature Review', 'Authentication', 'Cybersecurity'],
                skills: [
                    ['UX Research', 85],
                    ['Accessibility Analysis', 80],
                    ['Literature Review', 80],
                    ['Authentication Design', 75]
                ],
                description: 'Researching accessible authentication methods by analyzing usability barriers and designing UX-driven improvements for secure authentication systems.',
                highlight: 'Focused on improving authentication usability for neurodiverse users through human-centered security research.'
            },
            {
                title: 'Software Development Intern',
                dates: 'June 2026 - August 2026',
                stack: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Docker', 'AWS', 'Git', 'Figma'],
                skills: [
                    ['React Development', 85],
                    ['TypeScript', 80],
                    ['Data Visualization', 80],
                    ['Team Development Workflow', 75]
                ],
                description: 'Developed internal analytics and reporting software using the MERN stack, designed dashboard interfaces in Figma, and collaborated within a secure team development workflow using Docker, AWS, and Git.',
                highlight: 'Designed and developed an internal reporting dashboard that helped leadership review organizational analytics, learning activity, and program outcomes.'
            },
            {
                title: 'Tasky <span>Software Developer</span>',
                dates: 'December 2025 - January 2026',
                stack: ['React', 'Vite', 'Material UI', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Git'],
                skills: [
                    ['Frontend Architecture', 80],
                    ['Responsive UI Development', 85],
                    ['API Integration', 75],
                    ['Team Collaboration', 75]
                ],
                description: 'Contributed to the development of a full-stack task management application for GoPanda by building responsive React interfaces, integrating backend APIs, and collaborating with a development team using the MERN stack.',
                highlight: 'Developed and optimized reusable frontend components while connecting the user interface to Express.js and MongoDB APIs.'
            }
        ];

        const titleEl = experienceCard.querySelector('[data-experience-title]');
        const datesEl = experienceCard.querySelector('[data-experience-dates]');
        const stackEl = experienceCard.querySelector('[data-experience-stack]');
        const skillsEl = experienceCard.querySelector('[data-experience-skills]');
        const descriptionEl = experienceCard.querySelector('[data-experience-description]');
        const highlightEl = experienceCard.querySelector('[data-experience-highlight]');
        let activeExperienceIndex = 0;

        const renderExperience = (index) => {
            const item = experienceData[index];
            if (!item || !titleEl || !datesEl || !stackEl || !skillsEl || !descriptionEl || !highlightEl) return;

            activeExperienceIndex = index;
            experienceCard.classList.add('is-swapping');

            window.setTimeout(() => {
                titleEl.innerHTML = item.title;
                datesEl.textContent = item.dates;
                stackEl.innerHTML = item.stack.map(tech => `<span>${tech}</span>`).join('');
                skillsEl.innerHTML = '<p>Skills Gained</p>' + item.skills.map(([skill, level]) => (
                    `<div class="experience-skill"><span>${skill}</span><strong aria-hidden="true"></strong><i style="--skill-level: ${level}%;"></i></div>`
                )).join('');
                descriptionEl.textContent = item.description;
                highlightEl.textContent = item.highlight;
                experienceCard.dataset.activeExperience = index.toString();

                experienceNodes.forEach((node, nodeIndex) => {
                    node.classList.toggle('is-active', nodeIndex === index);
                });

                experienceCard.classList.remove('is-swapping');
            }, prefersReducedMotion ? 0 : 140);
        };

        experienceNodes.forEach((node, index) => {
            node.addEventListener('click', () => {
                renderExperience(index);
            });
        });
    }

    /* =========================================
       3. TYPEWRITER EFFECT
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
       4. CAROUSEL / SLIDER LOGIC
       ========================================= */
    const track = document.querySelector('.carousel-track');

    if (track) {
        const cards = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const dots = document.querySelectorAll('.dot');
        let currentIndex = 0;
        let carouselTransitionTimer;

        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        };

        const stageCarouselTransition = (fromIndex, toIndex, direction = 'right') => {
            if (fromIndex === toIndex || !cards[fromIndex] || !cards[toIndex]) return;

            window.clearTimeout(carouselTransitionTimer);
            track.classList.toggle('is-moving-left', direction === 'left');
            cards.forEach(card => {
                card.classList.remove('carousel-leaving', 'carousel-entering', 'active');
            });

            cards[fromIndex].classList.add('carousel-leaving');
            cards[toIndex].classList.add('carousel-entering', 'active');

            carouselTransitionTimer = window.setTimeout(() => {
                cards.forEach(card => card.classList.remove('carousel-leaving', 'carousel-entering'));
                track.classList.remove('is-moving-left');
            }, 760);
        };

        let scrollSettleTimer;
        let requestedIndex = null;

        // Measure actual positions so card widths, gaps and Safari rounding agree.
        const slidePosition = (index) => {
            const trackRect = track.getBoundingClientRect();
            const cardRect = cards[index].getBoundingClientRect();
            const left = track.scrollLeft + cardRect.left - trackRect.left;
            return Math.max(0, Math.min(left, track.scrollWidth - track.clientWidth));
        };

        const syncFromScroll = () => {
            const index = cards.reduce((closest, card, candidate) =>
                Math.abs(track.scrollLeft - slidePosition(candidate)) <
                Math.abs(track.scrollLeft - slidePosition(closest)) ? candidate : closest, 0);
            currentIndex = index;
            updateDots(index);
            cards.forEach((card, i) => card.classList.toggle('active', i === index));
        };

        const settleScroll = () => {
            window.clearTimeout(scrollSettleTimer);
            scrollSettleTimer = window.setTimeout(() => {
                requestedIndex = null;
                syncFromScroll();
            }, 180);
        };

        const moveToSlide = (index, direction = 'right', animate = true) => {
            index = (index + cards.length) % cards.length;
            if (animate) stageCarouselTransition(currentIndex, index, direction);
            currentIndex = index;
            requestedIndex = index;
            updateDots(index);
            cards.forEach((card, i) => card.classList.toggle('active', i === index));
            track.scrollTo({
                left: slidePosition(index),
                behavior: animate && !prefersReducedMotion ? 'smooth' : 'instant'
            });
            settleScroll();
        };

        track.addEventListener('scroll', () => {
            // Intermediate smooth-scroll frames must not overwrite an arrow's target.
            if (requestedIndex === null) syncFromScroll();
            settleScroll();
        }, { passive: true });

        const startManualScroll = () => {
            requestedIndex = null;
            window.clearTimeout(scrollSettleTimer);
            syncFromScroll();
        };
        track.addEventListener('pointerdown', startManualScroll, { passive: true });
        track.addEventListener('touchstart', startManualScroll, { passive: true });
        track.addEventListener('wheel', startManualScroll, { passive: true });

        nextBtn?.addEventListener('click', () => moveToSlide(currentIndex + 1, 'right'));
        prevBtn?.addEventListener('click', () => moveToSlide(currentIndex - 1, 'left'));
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => moveToSlide(index, index > currentIndex ? 'right' : 'left'));
        });

        // Rotation and window resizing preserve the selected card without stale offsets.
        let trackWidth = track.clientWidth;
        const resizeObserver = new ResizeObserver(() => {
            if (track.clientWidth === trackWidth) return;
            trackWidth = track.clientWidth;
            moveToSlide(currentIndex, 'right', false);
        });
        resizeObserver.observe(track);

    }

    /* =========================================
       5. DARK MODE TOGGLE
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
    let saved = null;
    try {
        saved = localStorage.getItem('siteDarkMode');
    } catch {
        // Navigation must still initialize when browser storage is unavailable.
    }
    applyDarkMode(saved === 'on');

    toggleBtn.addEventListener('click', () => {
        const nowDark = document.body.classList.contains('site-dark-mode');
        const next = !nowDark;
        applyDarkMode(next);
        try {
            localStorage.setItem('siteDarkMode', next ? 'on' : 'off');
        } catch {
            // The theme still works for this page without persistent storage.
        }
    });

    // Insert at the end of nav-right
    const navRight = navEl.querySelector('.nav-right');
    if (navRight) {
        navRight.appendChild(toggleBtn);
    } else {
        navEl.appendChild(toggleBtn);
    }

    /* =========================================
       6. MOBILE NAVIGATION
       ========================================= */
    const mobileMenuId = 'mobile-navigation-menu';
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-toggle';
    mobileMenuButton.type = 'button';
    mobileMenuButton.setAttribute('aria-label', 'Open navigation menu');
    mobileMenuButton.setAttribute('aria-controls', mobileMenuId);
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-nav-menu';
    mobileMenu.id = mobileMenuId;

    const desktopNavLinks = navEl.querySelectorAll('.nav-left > a, .nav-right > a');
    desktopNavLinks.forEach((link) => mobileMenu.appendChild(link.cloneNode(true)));

    const mobileThemeButton = document.createElement('button');
    mobileThemeButton.className = 'mobile-theme-toggle';
    mobileThemeButton.type = 'button';
    mobileThemeButton.textContent = 'Toggle theme';
    mobileThemeButton.addEventListener('click', () => toggleBtn.click());
    mobileMenu.appendChild(mobileThemeButton);

    const closeMobileMenu = () => {
        navEl.classList.remove('mobile-menu-open');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-label', 'Open navigation menu');
    };

    mobileMenuButton.addEventListener('click', () => {
        const willOpen = !navEl.classList.contains('mobile-menu-open');
        navEl.classList.toggle('mobile-menu-open', willOpen);
        mobileMenuButton.setAttribute('aria-expanded', String(willOpen));
        mobileMenuButton.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    mobileMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMobileMenu();
    });

    document.addEventListener('click', (event) => {
        if (!navEl.contains(event.target)) closeMobileMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navEl.classList.contains('mobile-menu-open')) {
            closeMobileMenu();
            mobileMenuButton.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (!window.matchMedia('(max-width: 900px)').matches) {
            closeMobileMenu();
        }
    });

    navEl.append(mobileMenuButton, mobileMenu);

});
