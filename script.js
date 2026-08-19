// ==================== DOM ELEMENTS ====================
const searchIcon = document.querySelector('#search-icon');
const searchBox = document.querySelector('.search-box');
const searchInput = document.querySelector('#search-input');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

// Cart Elements
const cartIconBtn = document.querySelector('#cart-icon-btn');
const cartDrawer = document.querySelector('#cart-drawer');
const cartClose = document.querySelector('#cart-close');
const cartOverlay = document.querySelector('#cart-overlay');
const cartItemsContainer = document.querySelector('#cart-items');
const cartCountBadge = document.querySelector('#cart-count');
const cartTotalPrice = document.querySelector('#cart-total-price');
const checkoutBtn = document.querySelector('#checkout-btn');
const addCartButtons = document.querySelectorAll('.cart-btn');

// ==================== CART STATE ====================
let cart = [
    {
        name: "Ceylon Cinnamon Latte",
        price: 1150,
        img: "img/ceylon-cinnamon-latte.jpg",
        qty: 1
    }
];

// Open / Close Cart Drawer
function openCart() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        if (searchBox) searchBox.classList.remove('active');
        if (navbar) navbar.classList.remove('active');
    }
}

function closeCart() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
}

if (cartIconBtn) cartIconBtn.onclick = openCart;
if (cartClose) cartClose.onclick = closeCart;
if (cartOverlay) cartOverlay.onclick = closeCart;

// ==================== RENDER CART ====================
function renderCart() {
    if (!cartItemsContainer) return;
    
    // Calculate total quantity & total price
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update Cart Badge & Subtotal
    if (cartCountBadge) cartCountBadge.textContent = totalQty;
    if (cartTotalPrice) cartTotalPrice.textContent = `Rs. ${totalPrice.toLocaleString()}`;

    // If Cart is Empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-state">
                <i class="bx bx-coffee"></i>
                <h4>Your Cart is Empty</h4>
                <p>Add some delicious fresh brews to start your order!</p>
            </div>
        `;
        return;
    }

    // Render Items
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</span>
                <div class="cart-item-actions">
                    <div class="cart-qty-control">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <span class="qty-number">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                    <i class="bx bx-trash cart-item-delete" onclick="removeItem(${index})" title="Remove item"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// Change Quantity
window.changeQty = function(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        renderCart();
    }
};

// Remove Item
window.removeItem = function(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        renderCart();
    }
};

// Add to Cart from Product Cards
addCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productBox = btn.closest('.product-box');
        if (!productBox) return;

        const name = productBox.querySelector('h3').textContent.trim();
        const priceText = productBox.querySelector('.price .amount').textContent.replace(/,/g, '').trim();
        const price = parseInt(priceText, 10) || 1000;
        const img = productBox.querySelector('.product-img img').getAttribute('src');

        // Check if item exists in cart
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name, price, img, qty: 1 });
        }

        renderCart();

        // Button Animation Feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bx bx-check"></i> Added!';
        btn.style.background = 'var(--main-color)';
        btn.style.color = '#120e0b';
        
        // Cart Badge Pulse
        if (cartIconBtn) {
            cartIconBtn.style.transform = 'scale(1.25)';
            setTimeout(() => {
                cartIconBtn.style.transform = 'scale(1)';
            }, 300);
        }

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 1200);
    });
});

// Checkout Action
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Please add a coffee before checkout. ☕');
            return;
        }
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        alert(`☕ Thank you for ordering from The Daily Grind!\nTotal: Rs. ${totalPrice.toLocaleString()}\nYour fresh brews are being prepared.`);
        cart = [];
        renderCart();
        closeCart();
    });
}

// Initial Cart Render
renderCart();

// ==================== SEARCH BOX ====================
if (searchIcon && searchBox) {
    searchIcon.onclick = (e) => {
        e.stopPropagation();
        searchBox.classList.toggle('active');
        if (navbar) navbar.classList.remove('active');
        if (searchBox.classList.contains('active') && searchInput) {
            searchInput.focus();
        }
    };
}

// Search Input Filtering for Products
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const productBoxes = document.querySelectorAll('.product-box');
        
        productBoxes.forEach(box => {
            const title = box.querySelector('h3').textContent.toLowerCase();
            const desc = box.querySelector('p').textContent.toLowerCase();
            const origin = box.querySelector('.product-origin') ? box.querySelector('.product-origin').textContent.toLowerCase() : '';
            
            if (title.includes(query) || desc.includes(query) || origin.includes(query)) {
                box.style.display = 'flex';
            } else {
                box.style.display = 'none';
            }
        });
    });
}

// ==================== MOBILE NAVBAR ====================
if (menuIcon && navbar) {
    menuIcon.onclick = (e) => {
        e.stopPropagation();
        navbar.classList.toggle('active');
        if (searchBox) searchBox.classList.remove('active');
    };
}

// Close search box and mobile menu on scroll, and highlight active nav link
window.onscroll = () => {
    if (navbar) navbar.classList.remove('active');
    if (searchBox) searchBox.classList.remove('active');
    
    // Header shadow
    if (header) {
        header.classList.toggle('shadow', window.scrollY > 50);
    }

    // Active nav link highlight on scroll
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

// Close search box when clicking outside
document.onclick = (e) => {
    if (searchBox && !searchBox.contains(e.target) && e.target !== searchIcon) {
        searchBox.classList.remove('active');
    }
};