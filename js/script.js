document.addEventListener('DOMContentLoaded', () => {

    const revealFeaturedWorks = () => {
        const featuredWorks = document.querySelector('[data-featured-works]');
        if (featuredWorks) featuredWorks.classList.add('is-visible');
    };

    /* =========================================
       0. STARTUP INTRO
       ========================================= */
    const playStartupIntro = () => {
        const forceIntro = /[?&]intro(?:=|&|$)/.test(window.location.search);
        let hasPlayed = false;

        try {
            hasPlayed = sessionStorage.getItem('startupIntroPlayed') === 'true';
            if (!forceIntro && hasPlayed) {
                window.setTimeout(revealFeaturedWorks, 80);
                return;
            }
            sessionStorage.setItem('startupIntroPlayed', 'true');
        } catch (error) {
            hasPlayed = false;
        }

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

        const isMobileMode = () => window.innerWidth <= 900;
        const getCarouselGap = () => parseFloat(window.getComputedStyle(track).columnGap) || 20;

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

        const moveToSlide = (index, direction = index > currentIndex ? 'right' : 'left') => {
            if (index < 0 || index >= cards.length) return;
            if (index === currentIndex) return;
            const cardWidth = cards[0].getBoundingClientRect().width;
            const previousIndex = currentIndex;

            stageCarouselTransition(previousIndex, index, direction);

            if (isMobileMode()) {
                const gap = getCarouselGap();
                const scrollPosition = index * (cardWidth + gap);
                track.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            } else {
                const gap = getCarouselGap();
                const slideAmount = index * -(cardWidth + gap);
                track.style.transform = `translateX(${slideAmount}px)`;
            }

            updateDots(index);
            currentIndex = index;
        };

        track.addEventListener('scroll', () => {
            if (isMobileMode()) {
                const cardWidth = cards[0].getBoundingClientRect().width;
                const gap = getCarouselGap();
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
                    if (nextIndex >= cards.length) moveToSlide(0, 'right');
                    else moveToSlide(nextIndex, 'right');
                } else {
                    if (nextIndex < cards.length) moveToSlide(nextIndex, 'right');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevIndex = currentIndex - 1;
                if (!isMobileMode()) {
                    if (prevIndex < 0) moveToSlide(cards.length - 1, 'left');
                    else moveToSlide(prevIndex, 'left');
                } else {
                    if (prevIndex >= 0) moveToSlide(prevIndex, 'left');
                }
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => moveToSlide(index, index > currentIndex ? 'right' : 'left'));
        });
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
