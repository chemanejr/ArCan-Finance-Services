document.addEventListener('DOMContentLoaded', () => {
    
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const closeMenuBtn = document.getElementById('close-menu');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    
    const openMenu = () => {
        hamburger.classList.add('active');
        mobileNav.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
        if (backdrop) backdrop.addEventListener('click', closeMenu);
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ==========================================================================
       SIMPLE FADE-IN ANIMATIONS & STATS COUNT-UP
       ========================================================================== */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const elemObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.style.opacity = '1';
                }
                
                // Trigger count up for stats if visible
                if (entry.target.classList.contains('stats-grid')) {
                    const stats = entry.target.querySelectorAll('.stat-number');
                    stats.forEach(stat => {
                        if (!stat.classList.contains('counted')) {
                            triggerCountUp(stat);
                            stat.classList.add('counted');
                        }
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(elem => {
        if (prefersReducedMotion) {
            elem.style.opacity = '1';
            elem.style.transform = 'none';
        } else {
            elemObserver.observe(elem);
        }
    });

    /* ==========================================================================
       STATS COUNT-UP LOGIC
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
       CONTACT FORM SUBMISSION MOCK
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
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
            if (scrollY >= (sectionTop - 150)) {
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
