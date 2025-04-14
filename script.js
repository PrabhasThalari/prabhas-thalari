document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animate elements when scrolling
    const animateElements = () => {
        const elements = document.querySelectorAll('.section, .project-card, .skill-category');
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.8;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < triggerPoint) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateElements);
    animateElements(); // Run once on load

    // Animate skill bars with percentage counting
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width') || bar.style.width;
            const percentageElement = bar.parentElement.previousElementSibling.querySelector('span:last-child');
            let currentWidth = 0;
            let currentPercentage = 0;
            const targetPercentage = parseInt(targetWidth);
            const duration = 1500; // Animation duration in ms
            const increment = targetPercentage / (duration / 16); // 60fps
            
            bar.style.width = '0';
            
            const animate = () => {
                if (currentWidth < targetPercentage) {
                    currentWidth += increment;
                    currentPercentage = Math.min(Math.round(currentWidth), targetPercentage);
                    bar.style.width = currentPercentage + '%';
                    if (percentageElement) {
                        percentageElement.textContent = currentPercentage + '%';
                    }
                    requestAnimationFrame(animate);
                } else {
                    bar.style.width = targetPercentage + '%';
                    if (percentageElement) {
                        percentageElement.textContent = targetPercentage + '%';
                    }
                }
            };
            
            animate();
        });
    };

    // Intersection Observer for skills animation
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(skillsSection);
    }

    // Form submission with validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            let isValid = true;
            
            // Reset error states
            this.querySelectorAll('.error').forEach(el => el.remove());
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual fetch)
                setTimeout(() => {
                    // Show success message
                    showAlert('success', 'Thank you for your message! I will get back to you soon.');
                    
                    // Reset form
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }

    // Helper function to show error messages
    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.style.color = 'var(--danger)';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        
        input.parentNode.appendChild(errorElement);
        input.style.borderColor = 'var(--danger)';
        
        input.addEventListener('input', function() {
            errorElement.remove();
            this.style.borderColor = '';
        }, { once: true });
    }

    // Helper function to validate email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Helper function to show alerts
    function showAlert(type, message) {
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.textContent = message;
        
        // Style the alert
        alertElement.style.position = 'fixed';
        alertElement.style.bottom = '20px';
        alertElement.style.right = '20px';
        alertElement.style.padding = '15px 25px';
        alertElement.style.borderRadius = '5px';
        alertElement.style.color = 'white';
        alertElement.style.zIndex = '10000';
        alertElement.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        alertElement.style.animation = 'fadeIn 0.3s ease forwards';
        
        if (type === 'success') {
            alertElement.style.background = 'var(--success)';
        } else {
            alertElement.style.background = 'var(--danger)';
        }
        
        document.body.appendChild(alertElement);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertElement.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                alertElement.remove();
            }, 300);
        }, 5000);
    }

    // Project card hover effect with touch support
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Mouse events
        card.addEventListener('mouseenter', function() {
            this.querySelector('.project-overlay').style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.project-overlay').style.opacity = '0';
        });
        
        // Touch events for mobile
        card.addEventListener('touchstart', function() {
            this.querySelector('.project-overlay').style.opacity = '1';
        });
        
        card.addEventListener('touchend', function() {
            this.querySelector('.project-overlay').style.opacity = '0';
        });
    });

    // Update copyright year
    document.getElementById('year').textContent = new Date().getFullYear();
});

// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    .no-scroll {
        overflow: hidden;
    }
`;
document.head.appendChild(style);