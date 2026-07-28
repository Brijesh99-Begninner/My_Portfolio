document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. PREMIUM DYNAMIC BACKGROUND SYSTEM (GRID, NOISE, BLOBS, SPOTLIGHT)
    initPremiumBackgrounds(prefersReducedMotion);

    // 2. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. MOBILE NAV DRAWER TOGGLE
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            mobileNavToggle.innerHTML = isOpen 
                ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
                : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
        });
    }

    // 4. CASE STUDY TAB SYSTEM
    const tabContainers = document.querySelectorAll('.case-study-tab-container');
    tabContainers.forEach(container => {
        const tabBtns = container.querySelectorAll('.tab-btn');
        const tabPanes = container.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                btn.classList.add('active');
                const activePane = container.querySelector(`.tab-pane[data-tab-content="${targetTab}"]`);
                if (activePane) {
                    activePane.classList.add('active');
                }
            });
        });
    });

    // 5. EMBEDDED MODAL LOGIC (CONTACT FORM SUCCESS)
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    if (contactForm && successModal) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            successModal.classList.add('active');
            contactForm.reset();
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
        
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // 6. SCROLL REVEAL (FADE-IN & SLIDE-UP ANIMATIONS)
    if (!prefersReducedMotion) {
        initScrollReveal();
    }

    // 7. HERO FLOOR PARTICLES (HOMEPAGE HERO SECTION)
    if (!prefersReducedMotion) {
        initHeroParticles();
    }

    // 8. 3D CARD TILT ON ABOUT PROFILE IMAGE
    if (!prefersReducedMotion) {
        initTiltEffect();
    }
});

// Dynamic Premium Background Initializer
function initPremiumBackgrounds(prefersReducedMotion) {
    // 1. Dotted pattern layer
    const grid = document.createElement('div');
    grid.className = 'bg-grid-pattern';
    document.body.appendChild(grid);

    // 2. Grain noise overlay
    const noise = document.createElement('div');
    noise.className = 'bg-noise-overlay';
    document.body.appendChild(noise);

    // 3. Moveable soft blur accent blobs
    if (!prefersReducedMotion) {
        const blobsContainer = document.createElement('div');
        blobsContainer.className = 'bg-blobs-container';
        
        const colors = ['blue', 'purple', 'cyan'];
        colors.forEach(c => {
            const blob = document.createElement('div');
            blob.className = `bg-blob blob-${c}`;
            blobsContainer.appendChild(blob);
        });
        
        document.body.appendChild(blobsContainer);
    }

    // 4. Interactive Cursor Spotlight Follower
    if (!prefersReducedMotion) {
        const spotlight = document.createElement('div');
        spotlight.className = 'cursor-spotlight';
        document.body.appendChild(spotlight);

        window.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }
}

// Scroll Reveal Observer
function initScrollReveal() {
    const sections = document.querySelectorAll('.section, .case-study-hero');
    const cards = document.querySelectorAll('.card, .deck-card, .job-card, .timeline-item');
    const textElements = document.querySelectorAll('.section-header h2, .section-header p, h1, .hero-subtitle, .hero-description, .hero-cta, .about-content > *');

    sections.forEach(s => s.classList.add('reveal'));
    cards.forEach((c, idx) => {
        c.classList.add('reveal');
        // Add progressive delays to grids/timelines
        c.classList.add(`reveal-delay-${(idx % 4) + 1}`);
    });
    textElements.forEach(t => t.classList.add('reveal-text'));

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px'
    });

    const allReveals = document.querySelectorAll('.reveal, .reveal-text');
    allReveals.forEach(el => revealObserver.observe(el));
}

// Hero Floating Particles (Particles rise up and bounce)
function initHeroParticles() {
    const hero = document.querySelector('.hero-wrapper');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-particles-canvas';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationId;

    function resizeCanvas() {
        canvas.width = hero.clientWidth;
        canvas.height = hero.clientHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.8;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = -Math.random() * 0.4 - 0.08; // slow drift rise
            this.opacity = Math.random() * 0.4 + 0.15;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.fadeSpeed;

            if (this.y < 0 || this.x < 0 || this.x > canvas.width || this.opacity <= 0) {
                this.reset();
                this.y = canvas.height; // Recycle from bottom
            }
        }
        draw() {
            ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.shadowColor = '#3B82F6';
            ctx.shadowBlur = this.size * 2;
            ctx.fill();
        }
    }

    const particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    // Intersection observer so particles only run when hero is on screen
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    }, { threshold: 0.05 });

    visibilityObserver.observe(hero);
}

// 3D Tilt Coordinates-based Handler for Profile Image
function initTiltEffect() {
    const targets = document.querySelectorAll('.about-img-wrapper');
    
    targets.forEach(target => {
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees tilt
            const rotateY = ((x - centerX) / centerX) * 10;
            
            target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            
            // Adjust glowing shadow dynamically depending on coordinates
            target.style.boxShadow = `
                ${-rotateY * 2.5}px ${rotateX * 2.5}px 35px -5px rgba(59, 130, 246, 0.3),
                ${-rotateY * 1.5}px ${rotateX * 1.5}px 20px -5px rgba(139, 92, 246, 0.25),
                0 20px 40px -10px rgba(0, 0, 0, 0.4)
            `;
        });
        
        target.addEventListener('mouseleave', () => {
            target.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            target.style.boxShadow = '0 15px 35px -10px rgba(59, 130, 246, 0.25), 0 5px 15px -5px rgba(139, 92, 246, 0.2)';
        });
    });
}
