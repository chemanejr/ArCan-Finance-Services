document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       CUSTOM CURSOR
       ========================================================================== */
    const cursor = document.getElementById('custom-cursor');
    
    if (cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let isCursorActive = false;
        let animationFrameId = null;
        
        // Animation loop for slight lag
        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.2;
            cursorY += dy * 0.2;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            animationFrameId = requestAnimationFrame(animateCursor);
        };
        
        // Follow mouse
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isCursorActive) {
                isCursorActive = true;
                document.body.classList.add('custom-cursor-active');
                cursor.style.opacity = '1';
                
                // Snap cursor to initial mouse position
                cursorX = mouseX;
                cursorY = mouseY;
                
                animationFrameId = requestAnimationFrame(animateCursor);
            }
        });
        
        // Hide cursor when touching the screen
        window.addEventListener('touchstart', () => {
            if (isCursorActive) {
                isCursorActive = false;
                document.body.classList.remove('custom-cursor-active');
                cursor.style.opacity = '0';
                cancelAnimationFrame(animationFrameId);
            }
        }, { passive: true });
        
        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .accordion-header, .glass-card, .team-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => { if(isCursorActive) cursor.classList.add('hover') });
            el.addEventListener('mouseleave', () => { if(isCursorActive) cursor.classList.remove('hover') });
        });
    }

    /* ==========================================================================
       MOBILE MENU
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       NAVBAR SCROLL EFFECT & BACK TO TOP
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       MULTI-ORIGIN DIRECTIONAL ANIMATIONS
       ========================================================================== */
    const animElements = document.querySelectorAll('.anim-elem');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // The sequence of animation classes as requested
    const animClasses = [
        'anim-left',
        'anim-right',
        'anim-bottom',
        'anim-scale',
        'anim-top',
        'anim-rotate-left',
        'anim-right-scale',
        'anim-bottom-blur'
    ];
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const elemObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // If it's a stats item, trigger count up
                if (entry.target.classList.contains('stat-item')) {
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl && !numberEl.classList.contains('counted')) {
                        triggerCountUp(numberEl);
                        numberEl.classList.add('counted');
                    }
                }
                
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);
    
    // Group elements by their section to handle staggering and class assignment
    const sections = document.querySelectorAll('.scroll-anim-container');
    
    sections.forEach(section => {
        const sectionElems = section.querySelectorAll('.anim-elem');
        
        sectionElems.forEach((elem, index) => {
            if (!prefersReducedMotion) {
                // Assign a directional class based on the pattern
                const classIndex = index % animClasses.length;
                elem.classList.add(animClasses[classIndex]);
                
                // Stagger delay within the section (0.1s per element)
                elem.style.transitionDelay = `${index * 0.1}s`;
            }
            
            elemObserver.observe(elem);
        });
    });

    /* ==========================================================================
       STATS COUNT-UP ANIMATION
       ========================================================================== */
    function triggerCountUp(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        
        let current = 0;
        const timer = setInterval(() => {
            current += 1;
            element.innerText = current;
            if (current >= target) {
                clearInterval(timer);
                element.innerText = target;
            }
        }, stepTime);
    }

    /* ==========================================================================
       FAQ ACCORDION
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
                h.nextElementSibling.style.opacity = 0;
            });
            
            // Open clicked if it wasn't active
            if (!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.opacity = 1;
            }
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Mock submission
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'A Enviar...';
            btn.disabled = true;
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
                formSuccess.style.display = 'block';
                
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }, 1000);
        });
    }
    
    /* ==========================================================================
       ACTIVE NAV LINK HIGHLIGHTING
       ========================================================================== */
    const scrollSections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        scrollSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });
});
