// ============================================
// EbenGh Technologies — Main Script
// ============================================

// --- DOM Elements ---
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const backToTopBtn = document.getElementById('backToTop');

// --- Mobile Menu Toggle ---
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

if (navOverlay) {
    navOverlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        const icon = menuToggle ? menuToggle.querySelector('i') : null;
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// --- Sticky Header ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- Theme Toggle ---
const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'dark');
        }
    });
}

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// --- Scroll Animations (Intersection Observer) ---
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

animateElements.forEach(element => {
    scrollObserver.observe(element);
});

// --- Animated Counters ---
const counters = document.querySelectorAll('.counter');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });

    countersAnimated = true;
}

// Observe the impact section for counter animation
const impactSection = document.querySelector('.impact');
if (impactSection) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    counterObserver.observe(impactSection);
}

// --- Testimonial Slider ---
const testimonialsSlider = document.getElementById('testimonialsSlider');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let currentTestimonial = 0;

function showTestimonial(index) {
    if (!testimonialsSlider || !testimonialDots.length) return;
    testimonialsSlider.style.transform = `translateX(-${index * 100}%)`;
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    if (testimonialDots[index]) testimonialDots[index].classList.add('active');
    currentTestimonial = index;
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showTestimonial(index);
    });
});

// Auto-rotate testimonials
if (testimonialDots.length > 0) {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialDots.length;
        showTestimonial(currentTestimonial);
    }, 6000);
}

// --- Communication Method Selection ---
let selectedCommMethod = 'email';

function selectCommMethod(element) {
    document.querySelectorAll('.comm-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedCommMethod = element.getAttribute('data-method');
}

// Make selectCommMethod available globally
window.selectCommMethod = selectCommMethod;

// --- Form Submission ---
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        switch (selectedCommMethod) {
            case 'email':
                sendEmail(formData);
                break;
            case 'whatsapp':
                sendWhatsApp(formData);
                break;
            case 'phone':
                requestCall(formData);
                break;
            default:
                sendEmail(formData);
        }

        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// --- Email Sending ---
function sendEmail(formData) {
    setTimeout(() => {
        if (formMessage) {
            formMessage.textContent = 'Your message has been sent via email! We will respond soon.';
            formMessage.classList.add('success');
            formMessage.style.display = 'block';
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.classList.remove('success');
            }, 5000);
        }
        if (contactForm) contactForm.reset();
    }, 1500);
}

// --- WhatsApp ---
function sendWhatsApp(formData) {
    const message = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/233278633288?text=${message}`, '_blank');

    if (formMessage) {
        formMessage.textContent = 'Opening WhatsApp with your message...';
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
        setTimeout(() => {
            formMessage.style.display = 'none';
            formMessage.classList.remove('success');
        }, 5000);
    }
    if (contactForm) contactForm.reset();
}

// --- Phone Call Request ---
function requestCall(formData) {
    const modal = document.getElementById('commModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (modalTitle) modalTitle.textContent = 'Request a Call Back';
    if (modalBody) {
        modalBody.innerHTML = `
            <p style="margin-bottom: 1.5rem; color: var(--text-light);">We will call you shortly at the provided phone number.</p>
            <div class="form-group">
                <label for="phoneNumber">Your Phone Number</label>
                <input type="tel" id="phoneNumber" placeholder="Enter your phone number" required>
            </div>
            <div class="form-group">
                <label for="preferredTime">Preferred Call Time</label>
                <select id="preferredTime">
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                </select>
            </div>
            <button class="btn btn-primary" onclick="confirmCallRequest()" style="width:100%;justify-content:center;">
                <i class="fas fa-phone"></i> Request Call
            </button>
        `;
    }
    if (modal) modal.style.display = 'flex';
}

// --- Confirm Call Request ---
function confirmCallRequest() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (!phoneNumber) {
        alert('Please enter your phone number');
        return;
    }

    setTimeout(() => {
        closeModal();
        if (formMessage) {
            formMessage.textContent = 'Call request received! We will call you soon at ' + phoneNumber;
            formMessage.classList.add('success');
            formMessage.style.display = 'block';
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.classList.remove('success');
            }, 5000);
        }
        if (contactForm) contactForm.reset();
    }, 1000);
}

window.confirmCallRequest = confirmCallRequest;

// --- Direct Communication ---
function initiateCall() {
    window.open('tel:0278633288');
}

function openEmailClient() {
    window.open('mailto:Ebenghtechnologies@gmail.com');
}

function openWhatsApp() {
    window.open('https://wa.me/233278633288', '_blank');
}

// Make functions globally available
window.initiateCall = initiateCall;
window.openEmailClient = openEmailClient;
window.openWhatsApp = openWhatsApp;

// --- Modal ---
function closeModal() {
    const modal = document.getElementById('commModal');
    if (modal) modal.style.display = 'none';
}

window.closeModal = closeModal;

window.addEventListener('click', (e) => {
    const modal = document.getElementById('commModal');
    if (e.target === modal) {
        closeModal();
    }
});

// --- Back to Top ---
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- Newsletter Form ---
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input');
        if (emailInput) {
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        }
    });
}

// --- Active Nav Link Highlighting ---
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();

// ============================================
// GSAP Hero Hologram & Scroll Animations
// ============================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Scroll Animation Dual Layer
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=240%",
            scrub: 0.65,
            pin: true,
            pinSpacing: true,
        }
    });

    // Animate Layer 1 immediately on page load
    gsap.fromTo(".layer-1-img",
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );
    gsap.fromTo(".layer-1-text .hero-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.4 }
    );
    gsap.fromTo(".layer-1-text .hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.6 }
    );
    gsap.fromTo(".layer-1-text .btn",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)", delay: 0.8 }
    );

    // Phase 1 (Scroll): Subtle parallax upward on existing Layer 1 elements to start transition
    heroTl.to(".layer-1-img", { y: -50, duration: 1.5, ease: "none" }, 0)
        .to(".layer-1-text", { y: -80, duration: 1.5, ease: "none" }, 0);

    // Pause briefly
    heroTl.to({}, { duration: 0.5 });

    // Phase 2: Fade out Layer 1 with a subtle upward movement
    heroTl.to(".hero-layer-1",
        { opacity: 0, y: -20, duration: 1.4, ease: "power1.inOut" }
    );

    // Phase 3: Fade in Layer 2 (video auto-plays) + text (Mobile parallax styling built-in)
    heroTl.fromTo(".hero-layer-2",
        { opacity: 0 },
        { opacity: 1, duration: 1.6, ease: "power1.inOut" },
        "-=0.7" // slight overlap with fade out for smoother transition
    )
        .fromTo(".layer-2-title",
            { opacity: 0, y: 120, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
            "-=1.4"
        )
        .fromTo(".layer-2-subtitle",
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
            "-=1.0"
        )
        .fromTo(".layer-2-cta .btn",
            { opacity: 0, y: 70, stagger: 0.2 },
            { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "back.out(1.5)" },
            "-=0.9"
        );

    // Fade scroll hint early
    gsap.to(".scroll-hint", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        scrollTrigger: { trigger: ".hero", start: "top top", end: "+=180", scrub: true }
    });
}

// ============================================
// Swiper Carousel Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Swiper !== 'undefined' && document.querySelector('.programs-carousel')) {
        new Swiper('.programs-carousel', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 }
            }
        });
    }
});