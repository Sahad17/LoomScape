/**
 * LoomScape Professional Script
 * Consolidates: Particle Loom, Smooth Flow Scroll, Sliding Pill + Spotlight, Text Scramble, Mobile Toggle, 3D Service Cards, and Scroll Indicator.
 */

// --- 1. THE PARTICLE LOOM CANVAS ---
const canvas = document.getElementById('loomCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 80;

const setCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initLoom() {
    setCanvasSize();
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateLoom() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance/150})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateLoom);
}

// --- 2. INTERACTIVE UI LOGIC ---

// ADDED: Hide Scroll Indicator on Scroll
const initScrollIndicator = () => {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            indicator.style.opacity = '0';
            indicator.style.pointerEvents = 'none';
            indicator.style.transition = 'opacity 0.5s ease';
        } else {
            indicator.style.opacity = '1';
        }
    });
};

// Smooth Flow Scroll with Navigation Offset
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = 100; 
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Scroll Reveal Observer for Service Cards
const initScrollReveal = () => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// 3D Tilt & Glow Logic for Service Cards
const initServiceCards = () => {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15; 
            const rotateY = (centerX - x) / 15;

            requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });
};

// Nav Animations (Pill & Spotlight)
const initNavAnimations = () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            item.style.setProperty('--x', `${x}px`);
            item.style.setProperty('--y', `${y}px`);
        });
    });
};

// Global Cursor Glow Movement
const initCursorGlow = () => {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    window.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        });
    });
};

// Text Scramble Effect
const initTextScramble = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    document.querySelectorAll('.reveal-text').forEach(element => {
        let iteration = 0;
        const originalText = element.innerText;
        const interval = setInterval(() => {
            element.innerText = originalText.split("").map((l, i) => {
                if(i < iteration) return originalText[i];
                return letters[Math.floor(Math.random() * 26)];
            }).join("");
            
            if(iteration >= originalText.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    });
};

// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initLoom();
    animateLoom();
    initNavAnimations();
    initCursorGlow();
    initTextScramble();
    initServiceCards();
    initSmoothScroll();
    initScrollReveal();
    initScrollIndicator(); // Logic for the oval mouse indicator activated
    
    window.addEventListener('resize', () => {
        setCanvasSize();
        initLoom();
    });
});
