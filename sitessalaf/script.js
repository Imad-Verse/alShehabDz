document.addEventListener('DOMContentLoaded', () => {
    // Scroll Progress Bar
    const scrollProgress = document.querySelector(".scroll-progress");
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";
    });

    // Sticky Nav Active Link
    const navSections = document.querySelectorAll('.section-title[id]');
    const navLinks = document.querySelectorAll('.sticky-nav a');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        navSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(currentSection) && currentSection !== '') {
                link.classList.add('active');
            }
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const items = document.querySelectorAll('.image-item');

    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            let hasResults = false;

            items.forEach(item => {
                const text = item.querySelector('h3').textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                    hasResults = true;
                } else {
                    item.style.display = 'none';
                }
            });

            if (noResults) {
                noResults.style.display = hasResults ? 'none' : 'block';
            }
        });
    }

    // Scroll to Top Button
    const scrollButton = document.querySelector('.scroll-top');
    if (scrollButton) {
        window.addEventListener('scroll', () => {
            scrollButton.classList.toggle('visible', window.scrollY > 500);
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Reveal on Scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    items.forEach((item) => {
        observer.observe(item);
    });

    // Handle Image Loading Errors
    const images = document.querySelectorAll('.circular-image');
    images.forEach(img => {
        img.onerror = function() {
            this.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.closest('.image-item').querySelector('h3').textContent) + '&background=1e293b&color=38bdf8&bold=true';
        };
    });
});