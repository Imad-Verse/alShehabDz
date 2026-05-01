/**
 * Unified Navigation Script for Al-Shehab Platform
 */
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // Header transparency on scroll
    const header = document.querySelector('.global-nav');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(2, 6, 23, 0.95)';
                header.style.padding = '5px 0';
            } else {
                header.style.background = 'rgba(2, 6, 23, 0.9)';
                header.style.padding = '0';
            }
        }
    });

    // Update current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Ensure all social and external links open in new tab
    const externalLinks = document.querySelectorAll('a[href^="http"], .social-icon, .developer-info a');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});
