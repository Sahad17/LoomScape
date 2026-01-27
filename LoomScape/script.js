/**
 * LoomScape Professional Script
 * Consolidates: Particle Loom, Sliding Pill + Spotlight, Text Scramble, and Mobile Toggle.
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

// Combined Sliding Background (Pill) & Spotlight Shine Logic
const initNavAnimations = () => {
    const navItems = document.querySelectorAll('.nav-item');
    const slidingBg = document.querySelector('.nav-sliding-bg');
    const navLinksContainer = document.querySelector('.nav-links');

    if (!slidingBg || !navLinksContainer) return;

    navItems.forEach(item => {
        // 1. Sliding Pill Logic
        item.addEventListener('mouseenter', (e) => {
            const { offsetLeft, offsetWidth } = e.target;
            slidingBg.style.left = `${offsetLeft}px`;
            slidingBg.style.width = `${offsetWidth}px`;
            slidingBg.style.opacity = '1';
        });

        // 2. Spotlight Shine Logic (Updates CSS variables for the glow)
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            item.style.setProperty('--x', `${x}px`);
            item.style.setProperty('--y', `${y}px`);
        });
    });

    navLinksContainer.addEventListener('mouseleave', () => {
        slidingBg.style.opacity = '0';
    });
};

// Cursor Glow Movement
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

// Mobile Hamburger Toggle
const initMobileMenu = () => {
    const hamburger = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
};

// Smooth Scroll for Nav Links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
};

// --- 3. INITIALIZATION ---
window.addEventListener('resize', () => {
    setCanvasSize();
});

// Run everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLoom();
    animateLoom();
    initNavAnimations();
    initCursorGlow();
    initTextScramble();
    initMobileMenu();
    initSmoothScroll();
});