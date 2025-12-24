document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. TYPEWRITER EFFECT
       ========================================= */
    const textElement = document.getElementById("typewriter-text");
    
    // Safety check: only run if the element exists
    if (textElement) {
        const text1 = "UI/UX Designer";      
        const text2 = "UX Engineer";       
        const typingSpeed = 100;             
        const deletingSpeed = 50;            
        const pauseDelay = 1000;             

        let charIndex = 0;

        // Function 1: Type the first word
        function typeFirstWord() {
            if (charIndex < text1.length) {
                textElement.textContent += text1.charAt(charIndex);
                charIndex++;
                setTimeout(typeFirstWord, typingSpeed);
            } else {
                setTimeout(deleteWord, pauseDelay);
            }
        }

        // Function 2: Delete the word
        function deleteWord() {
            if (charIndex > 0) {
                textElement.textContent = text1.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(deleteWord, deletingSpeed);
            } else {
                setTimeout(typeFinalWord, 500);
            }
        }

        // Function 3: Type the final word
        function typeFinalWord() {
            // We use a local index here relative to text2
            let currentLength = textElement.textContent.length;
            if (currentLength < text2.length) {
                textElement.textContent += text2.charAt(currentLength);
                setTimeout(typeFinalWord, typingSpeed);
            }
        }

        // START THE TYPEWRITER (This was missing!)
        setTimeout(typeFirstWord, 1000); 
    }


    /* =========================================
       2. CAROUSEL LOGIC
       ========================================= */
    const track = document.querySelector('.carousel-track');
    
    // Safety check: only run if carousel exists
    if (track) {
        const cards = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const dots = document.querySelectorAll('.dot');

        let currentIndex = 0;

        const moveToSlide = (index) => {
            // Get current width dynamically
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = 20; // Must match CSS gap

            const slideAmount = index * -(cardWidth + gap);
            
            track.style.transform = `translateX(${slideAmount}px)`;
            
            // Update Dots
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) {
                dots[index].classList.add('active');
            }
            
            currentIndex = index;
        };

        // Listeners
        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < cards.length - 1) {
                    moveToSlide(currentIndex + 1);
                } else {
                    moveToSlide(0);
                }
            });
        }

        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    moveToSlide(currentIndex - 1);
                } else {
                    moveToSlide(cards.length - 1);
                }
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
        });
        
        // Handle Resize
        window.addEventListener('resize', () => {
            moveToSlide(currentIndex);
        });
    }

// 1. Select the navigation bar
const nav = document.querySelector('nav');

// 2. Listen for the scroll event
window.addEventListener('scroll', () => {
    
    // 3. Check if user has scrolled down more than 50 pixels
    if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

});