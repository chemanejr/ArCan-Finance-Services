/* 
   AFS — ArCan Finance Services
   Script logic for Multi-page Navigation, Slider and Scroll Reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. HERO SLIDER LOGIC (Index only)
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 5000;

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        let sliderTimer = setInterval(nextSlide, slideInterval);

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(sliderTimer);
                showSlide(parseInt(dot.dataset.index));
                sliderTimer = setInterval(nextSlide, slideInterval);
            });
        });
    }


    // 2. STICKY NAVBAR & WHATSAPP
    const navbar = document.getElementById('navbar');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        if (whatsappBtn) {
            if (window.scrollY > 300) {
                whatsappBtn.classList.add('visible');
            } else {
                whatsappBtn.classList.remove('visible');
            }
        }
    });


    // 3. MULTI-PAGE ACTIVE LINK DETECTION
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });


    // 4. SCROLL REVEAL (FADE IN)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });


    // 5. MOBILE MENU TOGGLE ("Go to..." style)
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && e.target !== hamburger) {
                mobileMenu.classList.remove('active');
            }
        });
    }

});
