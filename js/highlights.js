(() => {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const headingWords = document.querySelectorAll('.journey-heading h1 > span');

    if (!reducedMotion.matches && Element.prototype.animate) {
        let delay = 220;
        const letterIntervals = [160, 140, 175, 150, 135, 170];
        let letterIndex = 0;
        const finalWord = headingWords[headingWords.length - 1];
        for (const word of headingWords) {
            const text = word.textContent;
            const letters = Array.from(text, character => {
                const letter = document.createElement('span');
                letter.className = 'highlights-letter';
                letter.textContent = character;
                return letter;
            });

            word.replaceChildren(...letters);
            for (const [index, letter] of letters.entries()) {
                const caret = document.createElement('span');
                caret.className = 'highlights-caret';
                caret.setAttribute('aria-hidden', 'true');
                letter.append(caret);

                letter.animate([{ opacity: 0 }, { opacity: 1 }], {
                    duration: 1,
                    delay,
                    fill: 'backwards'
                });

                const endsWord = index === letters.length - 1;
                const isLastLetter = word === finalWord && endsWord;
                const interval = endsWord ? 330 : letterIntervals[letterIndex % letterIntervals.length];
                const caretFrames = isLastLetter
                    ? [{ opacity: 1, easing: 'steps(1, end)' }, { opacity: 0, offset: 0.55 }, { opacity: 0 }]
                    : [{ opacity: 1 }, { opacity: 1 }];
                caret.animate(caretFrames, {
                    delay,
                    duration: isLastLetter ? 620 : interval,
                    iterations: isLastLetter ? 2 : 1
                });
                delay += interval;
                letterIndex++;
            }
        }
    }

    const canvas = document.querySelector('.highlights-drift');
    const context = canvas.getContext('2d');
    if (!context) return;

    const colors = ['#4385e6', '#689ef1', '#6488da', '#8e83d5'];
    const particles = Array.from({ length: 106 }, (_, index) => ({
        x: Math.random(),
        y: Math.random(),
        radius: 0.8 + Math.random() * 2.3,
        opacity: 0.18 + Math.random() * 0.38,
        phase: Math.random() * Math.PI * 2,
        color: colors[index % colors.length]
    }));

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let elapsed = 0;
    let previousTime = null;

    function draw(time) {
        if (!width || !height) return;
        context.clearRect(0, 0, width, height);
        const count = Math.round(Math.min(1, width / 1000) * particles.length);

        for (let index = 0; index < count; index++) {
            const particle = particles[index];
            const drift = Math.sin(time * 0.32 + particle.phase);
            const x = particle.x * width + drift * 24;
            const y = particle.y * height + Math.cos(time * 0.25 + particle.phase) * 18;
            const centerDistance = Math.abs(x - width / 2) / (width / 2);
            const edgeWeight = 0.22 + 0.78 * Math.min(1, centerDistance * 1.6);

            context.globalAlpha = particle.opacity * edgeWeight;
            context.fillStyle = particle.color;
            context.beginPath();
            context.arc(x, y, particle.radius, 0, Math.PI * 2);
            context.fill();
        }
    }

    function animate(now) {
        if (previousTime !== null) elapsed += (now - previousTime) / 1000;
        previousTime = now;
        draw(elapsed);
        frame = requestAnimationFrame(animate);
    }

    function syncAnimation() {
        cancelAnimationFrame(frame);
        previousTime = null;
        draw(elapsed);
        if (visible && !reducedMotion.matches) frame = requestAnimationFrame(animate);
    }

    new ResizeObserver(() => {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        const scale = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        context.setTransform(scale, 0, 0, scale, 0, 0);
        draw(elapsed);
    }).observe(canvas);

    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        syncAnimation();
    }).observe(canvas);

    reducedMotion.addEventListener('change', syncAnimation);
})();
