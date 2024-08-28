document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate elements on scroll
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, {
        root: null,
        threshold: 0.1
    });

    document.querySelectorAll('.animate-fade-in').forEach(el => {
        observer.observe(el);
    });

    // Show More / Show Less Functionality
    const showMoreButton = document.getElementById('show-more');
    const productItems = document.querySelectorAll('#product-grid .product-item');

    // Initially hide all product items except the first 4
    productItems.forEach((item, index) => {
        if (index >= 4) {
            item.classList.add('hidden');
        }
    });

    showMoreButton.addEventListener('click', () => {
        // Toggle visibility of all product items
        productItems.forEach(item => {
            item.classList.toggle('hidden');
        });

        // Change button text based on visibility
        if (showMoreButton.textContent === 'Voir plus') {
            showMoreButton.textContent = 'Voir moins';
        } else {
            showMoreButton.textContent = 'Voir plus';
        }
    });
});