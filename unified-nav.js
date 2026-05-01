/**
 * Unified Navigation Script for Al-Shehab Platform
 * Updated with Global Deployment Fixes
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

    // --- Global Deployment Fixes ---
    
    // 1. Fix broken images across the platform
    const fixImages = () => {
        document.querySelectorAll('img').forEach(img => {
            if (!img.dataset.fixApplied) {
                img.dataset.fixApplied = 'true';
                
                // Add referrerpolicy to help with cross-domain images
                img.setAttribute('referrerpolicy', 'no-referrer');
                
                // Enhanced error handling
                const originalError = img.onerror;
                img.onerror = function() {
                    if (originalError) originalError.call(this);
                    // Use a nice placeholder based on the alt text
                    const fallbackName = this.alt || 'مركز الشهاب';
                    this.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fallbackName) + '&background=020617&color=d4af37&bold=true&size=128';
                    this.style.opacity = '0.8';
                };
            }
        });
    };
    
    fixImages();
    // Re-run periodically to catch images loaded via radio lists or dynamic content
    setInterval(fixImages, 2000);

    // 2. Adjust Hero Cover Height (Disabled: Conflicts with modern full-viewport design)
    /*
    const applyHeroFix = () => {
        const heroCover = document.querySelector('.hero-cover-container');
        if (heroCover) {
            if (window.innerWidth > 768) {
                heroCover.style.setProperty('height', '500px', 'important');
            } else {
                heroCover.style.setProperty('height', '300px', 'important');
            }
        }
    };
    
    applyHeroFix();
    window.addEventListener('resize', applyHeroFix);
    */

    // 3. Haramain Player Fix (makkamadina-tv)
    // If the video sources from holol.com fail, we alert the console or try to refresh
    if (window.location.href.includes('makkamadina-tv')) {
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
            v.addEventListener('error', function() {
                console.warn('Video source failed, possibly CORS or temporary down.');
            }, true);
        });
    }
});
