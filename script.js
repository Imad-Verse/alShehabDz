document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Year in Footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Intersection Observer for Section Tracking and Animations
    const observerOptions = {
        threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade in animation
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('visible');
                }

                // Update Active Link in Nav
                const id = entry.target.getAttribute('id');
                if (id) {
                    navLinksItems.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}` || (id === 'home' && link.getAttribute('href') === 'index.html')) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all sections and fade-in elements
    document.querySelectorAll('section, .fade-in').forEach(el => {
        sectionObserver.observe(el);
    });

    // Scroll to Top Button Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Copy to Clipboard Functionality
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.color = '#10b981';
        
        showToast('تم النسخ إلى الحافظة!');
        
        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Toast Notification Logic
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide and remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
