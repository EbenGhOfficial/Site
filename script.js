// Menu Toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });

        // Hero Slider
        const heroSlides = document.querySelectorAll('.hero-slide');
        const heroDots = document.querySelectorAll('.hero-dot');
        let currentHeroSlide = 0;
        
        function showHeroSlide(index) {
            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroDots.forEach(dot => dot.classList.remove('active'));
            
            heroSlides[index].classList.add('active');
            heroDots[index].classList.add('active');
            currentHeroSlide = index;
        }
        
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showHeroSlide(index);
            });
        });
        
        // Auto-rotate hero slides
        setInterval(() => {
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            showHeroSlide(currentHeroSlide);
        }, 5000);
        
        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    navLinks.classList.remove('active');
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Animate on Scroll
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
        
        // Testimonial Slider
        const testimonialsSlider = document.getElementById('testimonialsSlider');
        const testimonialDots = document.querySelectorAll('.testimonial-dot');
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonialsSlider.style.transform = `translateX(-${index * 100}%)`;
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            testimonialDots[index].classList.add('active');
            currentTestimonial = index;
        }
        
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialDots.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        
        // Communication Method Selection
        let selectedCommMethod = 'email';
        
        function selectCommMethod(element) {
            document.querySelectorAll('.comm-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            element.classList.add('selected');
            selectedCommMethod = element.getAttribute('data-method');
        }
        
        // Form Submission with Different Methods
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };
                
                // Process based on selected communication method
                switch(selectedCommMethod) {
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
                
                // Reset button state after a delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        }
        
        // Email Sending Function
        function sendEmail(formData) {
            // Using a third-party service like EmailJS (you would need to set up an account)
            // For demonstration, we'll simulate the process
            
            // Simulate API call
            setTimeout(() => {
                formMessage.textContent = 'Your message has been sent via email! We will respond soon.';
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                    formMessage.classList.remove('success');
                }, 5000);
                
                // Reset form
                contactForm.reset();
            }, 1500);
        }
        
        // WhatsApp Message Function
        function sendWhatsApp(formData) {
            // Format the message for WhatsApp
            const message = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0AMessage: ${formData.message}`;
            
            // Open WhatsApp with the pre-filled message
            window.open(`https://wa.me/233278633288?text=${message}`, '_blank');
            
            // Show success message
            formMessage.textContent = 'Opening WhatsApp with your message...';
            formMessage.classList.add('success');
            formMessage.style.display = 'block';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.classList.remove('success');
            }, 5000);
            
            // Reset form
            contactForm.reset();
        }
        
        // Phone Call Request Function
        function requestCall(formData) {
            // Show modal with call request information
            document.getElementById('modalTitle').textContent = 'Request a Call Back';
            document.getElementById('modalBody').innerHTML = `
                <p>We will call you shortly at the provided phone number.</p>
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
                <button class="btn" onclick="confirmCallRequest()">Request Call</button>
            `;
            
            document.getElementById('commModal').style.display = 'flex';
        }
        
        // Confirm Call Request
        function confirmCallRequest() {
            const phoneNumber = document.getElementById('phoneNumber').value;
            const preferredTime = document.getElementById('preferredTime').value;
            
            if (!phoneNumber) {
                alert('Please enter your phone number');
                return;
            }
            
            // Simulate call request processing
            setTimeout(() => {
                closeModal();
                formMessage.textContent = 'Call request received! We will call you soon at ' + phoneNumber;
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                    formMessage.classList.remove('success');
                }, 5000);
                
                // Reset form
                contactForm.reset();
            }, 1000);
        }
        
        // Direct Communication Functions
        function initiateCall() {
            window.open('tel:0278633288');
        }
        
        function openEmailClient() {
            window.open('mailto:EbenGh-Technologies@gmail.com'); // will need an email.
        }
        
        function openWhatsApp() {
            window.open('https://wa.me/233278633288', '_blank');
        }
        
        // Modal Functions
        function closeModal() {
            document.getElementById('commModal').style.display = 'none';
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('commModal')) {
                closeModal();
            }
        });
        
        // Back to Top Button
        const backToTopBtn = document.getElementById('backToTop');
        
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
        
        // Newsletter Subscription
        const newsletterForm = document.querySelector('.footer-newsletter');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = newsletterForm.querySelector('input').value;
                
                // Simulate subscription process
                setTimeout(() => {
                    alert('Thank you for subscribing to our newsletter!');
                    newsletterForm.querySelector('input').value = '';
                }, 500);
            });
        }
        
        // Sticky Header
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                header.style.background = 'var(--lighter)';
            } else {
                header.style.boxShadow = 'none';
                header.style.background = 'var(--lighter)';
            }
        });