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

    if (productItems.length > 0 && showMoreButton) {
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
    }

    // Cart Functionality
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const closeCartButton = document.getElementById('close-cart');
    const checkoutButton = document.getElementById('checkout-button');

    // Event listener for the cart button in the navigation menu
    const navCartButton = document.getElementById('nav-cart-button');
    navCartButton.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    // Event listener for the cart button in the mobile menu
    const mobileNavCartButton = document.getElementById('mobile-nav-cart-button');
    mobileNavCartButton.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
        mobileMenu.classList.add('hidden'); // Close mobile menu after clicking
    });

    // Add to Cart Button Functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            const productElement = button.closest('.product-item');
            const productName = productElement.querySelector('h3').innerText;
            let quantity = 1; // Default quantity

            // Get quantity from input if available
            const quantityInput = productElement.querySelector(`input[type="number"][data-product-id="${productId}"]`);
            if (quantityInput) {
                quantity = parseInt(quantityInput.value);
            }

            // Get selected options (if any)
            let options = {};
            const selectElements = productElement.querySelectorAll('select');
            selectElements.forEach(select => {
                const optionName = select.getAttribute('data-option-name') || 'Option';
                const optionValue = select.value;
                options[optionName] = optionValue;
            });

            // Get selected accessories (if any)
            const accessoryCheckboxes = productElement.querySelectorAll('input[type="checkbox"]:checked');
            accessoryCheckboxes.forEach(checkbox => {
                const accessoryName = productElement.querySelector(`label[for="${checkbox.id}"]`).innerText;
                options[accessoryName] = 'Inclus';
            });

            // Create a unique key for the cart item
            const cartKey = `${productId}-${JSON.stringify(options)}`;

            if (cart[cartKey]) {
                cart[cartKey].quantity += quantity;
            } else {
                cart[cartKey] = {
                    productId,
                    productName,
                    quantity,
                    options
                };
            }

            // Show a toast notification
            showToast(`${quantity} x ${productName} ajouté(s) au panier.`);
            if (quantityInput) quantityInput.value = 1; // Reset quantity input

            saveCart();
            updateCartCount();
        });
    });

    // Function to show a toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-gold text-navy px-4 py-2 rounded-lg shadow-lg';
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Function to open the cart modal
    function openCart() {
        cartModal.classList.remove('hidden');
        renderCartItems();
    }

    // Function to close the cart modal
    function closeCart() {
        cartModal.classList.add('hidden');
    }

    // Function to render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Votre panier est vide.</p>';
            return;
        }
        for (const [cartKey, cartItem] of Object.entries(cart)) {
            const { productName, quantity, options } = cartItem;
            const optionDetails = Object.entries(options).map(([key, value]) => `${key}: ${value}`).join(', ');
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('flex', 'justify-between', 'items-center', 'border-b', 'pb-2', 'mb-2');
            cartItemElement.innerHTML = `
                <div>
                    <p class="font-semibold">${productName}</p>
                    <p class="text-sm text-gray-600">${optionDetails}</p>
                </div>
                <div class="flex items-center">
                    <input type="number" min="1" value="${quantity}" data-cart-key="${cartKey}" class="quantity-update w-16 p-2 bg-gray-100 text-navy rounded-lg mr-2">
                    <button data-cart-key="${cartKey}" class="remove-item bg-red-500 text-white px-2 py-1 rounded-lg">X</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        }

        // Add event listeners for quantity updates and item removal
        const quantityInputs = cartItemsContainer.querySelectorAll('.quantity-update');
        quantityInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const cartKey = e.target.getAttribute('data-cart-key');
                const newQuantity = parseInt(e.target.value);
                if (newQuantity > 0) {
                    cart[cartKey].quantity = newQuantity;
                } else {
                    delete cart[cartKey];
                }
                saveCart();
                renderCartItems();
                updateCartCount();
            });
        });

        const removeButtons = cartItemsContainer.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const cartKey = e.target.getAttribute('data-cart-key');
                delete cart[cartKey];
                saveCart();
                renderCartItems();
                updateCartCount();
            });
        });
    }

    // Event listeners for cart modal buttons
    closeCartButton.addEventListener('click', closeCart);

    checkoutButton.addEventListener('click', () => {
        // Implement checkout functionality here
        alert('Passer à la caisse (fonctionnalité à implémenter).');
    });

    // Update Cart Count
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;

        if (totalItems === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'flex';
        }
    }

    // Initialize Cart Count on Page Load
    updateCartCount();

    // Save cart to localStorage whenever it's updated
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Render cart items on page load if cart is not empty
    if (Object.keys(cart).length > 0) {
        renderCartItems();
    }
});
<!-- JavaScript for Modal -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('info-modal');
    const openBtn = document.getElementById('learn-more-btn');
    const closeBtn = document.getElementById('close-modal');

    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('animate-fade-in');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
});
</script>












