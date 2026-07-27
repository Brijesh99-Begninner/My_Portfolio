document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC DEVELOPER BACKGROUND CANVAS
    initBackgroundCanvas();

    // 2. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
});

// Dynamic Developer Background Canvas Initializer
function initBackgroundCanvas() {
    // Prevent double creation if loaded twice
    if (document.getElementById('code-bg-canvas')) return;

    const canvas = document.createElement('div');
    canvas.id = 'code-bg-canvas';
    document.body.appendChild(canvas);

    const codeTokens = [
        'const', 'let', 'function', '=>', '<div>', '</div>', 'class', 
        'return', 'import', 'export', '{}', '[]', '&&', '||', 'npm', 
        'git', 'await', 'async', 'document', 'window', 'body', 'style',
        'margin', 'padding', 'border', 'flex', 'grid'
    ];

    function createToken(initialY = null) {
        // Prevent stacking overflow if page runs in background
        if (canvas.childElementCount > 40) {
            canvas.firstElementChild.remove();
        }

        const token = document.createElement('span');
        token.className = 'floating-code-char';
        token.innerText = codeTokens[Math.floor(Math.random() * codeTokens.length)];
        
        // Random horizontal layout
        token.style.left = Math.random() * 95 + '%';
        
        // Random float duration (longer is slower and more premium)
        const duration = 12 + Math.random() * 8;
        token.style.animationDuration = duration + 's';
        
        // Random sizes
        token.style.fontSize = (0.8 + Math.random() * 0.5) + 'rem';
        
        if (initialY !== null) {
            token.style.top = initialY + '%';
            token.style.animationDelay = '-' + (Math.random() * duration) + 's';
        }

        canvas.appendChild(token);
        
        // Remove token once animation finishes
        setTimeout(() => {
            token.remove();
        }, duration * 1000);
    }

    // Pre-populate 15 nodes immediately across the screen height
    for (let i = 0; i < 15; i++) {
        createToken(Math.random() * 90);
    }

    // Spawn a new drifting node periodically
    setInterval(() => {
        if (document.hidden) return;
        createToken();
    }, 1800);
}
