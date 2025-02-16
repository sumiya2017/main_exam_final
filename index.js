 let cart = []; // Declare the cart variable only once
        let promoCodeApplied = false;
        let discount = 0;
        let promoCode = ''; // Store applied promo code

        // Fetch products from API
        async function fetchProducts() {
            try {
                const response = await fetch('https://fakestoreapi.com/products');
                const products = await response.json();
                displayProducts(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        // Display products in the grid
        function displayProducts(products) {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";

            products.slice(0, 12).forEach(product => {
                productList.innerHTML += `
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12">
                        <div class="card product-card">
                            <img src="${product.image}" class="card-img-top p-3" alt="${product.title}" height="250">
                            <div class="card-body text-center">
                                <h6 class="card-title">${product.title.slice(0, 25)}...</h6>
                                <p class="card-text text-muted">$${product.price.toFixed(2)}</p>
                                <button class="btn btn-primary w-100" onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">
                                    <i class="bi bi-cart-plus"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Add product to cart
        function addToCart(id, title, price, image) {
            const existingProduct = cart.find(item => item.id === id);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({ id, title, price, image, quantity: 1 });
            }
            updateCartUI();
        }

        // Update cart UI and apply discount
        function updateCartUI() {
            const cartItems = document.getElementById("cart-items");
            const cartCount = document.getElementById("cart-count");
            const cartTotal = document.getElementById("cart-total");
            const finalTotal = document.getElementById("final-total");

            cartItems.innerHTML = "";
            let total = 0;

            if (cart.length === 0) {
                cartItems.innerHTML = "<li class='list-group-item text-muted text-center'>Your cart is empty</li>";
                cartCount.textContent = "0";
                cartTotal.textContent = "0.00";
                finalTotal.textContent = "0.00";
                discount = 0;
                return;
            }

            cart.forEach(item => {
                total += item.price * item.quantity;
                cartItems.innerHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <img src="${item.image}" width="40" height="40" class="rounded">
                        <span>${item.title.slice(0, 20)}</span>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-primary" onclick="increaseQuantity(${item.id})">+</button>
                        </div>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})"><i class="bi bi-trash"></i></button>
                    </li>
                `;
            });

            cartCount.textContent = cart.length;
            cartTotal.textContent = total.toFixed(2);

            // Apply discount if applicable and update final total
            applyDiscount(total);

            finalTotal.textContent = (total - discount).toFixed(2);
        }

        // Apply promo code and update the discount
        function applyPromoCode() {
            const promoCodeInput = document.getElementById("promo-code").value.trim().toLowerCase();
            const promoMessage = document.getElementById("promo-message");
            const discountDisplay = document.getElementById("discount-display");

            // Check if promo code is valid
            if (promoCodeApplied) {
                promoMessage.textContent = "You have already applied a promo code.";
                return;
            }

            if (promoCodeInput === "ostad10") {
                promoMessage.textContent = "Promo code applied successfully!";
                promoCode = "ostad10";
                promoCodeApplied = true;
                applyDiscount(getCartTotal());
                discountDisplay.innerHTML = `<strong>Discount:</strong> $${discount.toFixed(2)}`;
            } else if (promoCodeInput === "ostad5") {
                promoMessage.textContent = "Promo code applied successfully!";
                promoCode = "ostad5";
                promoCodeApplied = true;
                applyDiscount(getCartTotal());
                discountDisplay.innerHTML = `<strong>Discount:</strong> $${discount.toFixed(2)}`;
            } else {
                promoMessage.textContent = "Invalid promo code. Please try again.";
            }

            updateCartUI();
        }

        // Recalculate discount based on cart total
        function applyDiscount(total) {
            if (promoCode === "ostad10") {
                discount = total * 0.10; // 10% discount
            } else if (promoCode === "ostad5") {
                discount = 5.00; // $5 discount
            } else {
                discount = 0;
            }
        }

        // Get current cart total
        function getCartTotal() {
            return cart.reduce((total, item) => total + item.price * item.quantity, 0);
        }

        // Increase quantity
        function increaseQuantity(id) {
            const item = cart.find(item => item.id === id);
            item.quantity++;
            updateCartUI();
        }

        // Decrease quantity
        function decreaseQuantity(id) {
            const item = cart.find(item => item.id === id);
            if (item.quantity > 1) {
                item.quantity--;
                updateCartUI();
            }
        }

        // Remove product from cart
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        }

        // Open checkout modal
        function openCheckout() {
            const checkoutItems = document.getElementById("checkout-items");
            const checkoutTotal = document.getElementById("checkout-total");
            checkoutItems.innerHTML = "";
            let total = 0;

            cart.forEach(item => {
                total += item.price * item.quantity;
                checkoutItems.innerHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${item.title}</span>
                        <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                `;
            });

            checkoutTotal.textContent = total.toFixed(2);
            new bootstrap.Modal(document.getElementById("checkoutModal")).show();
        }

        // Confirm order
        function confirmOrder() {
            alert("Order confirmed! Thank you for your purchase.");
            cart = [];
            promoCodeApplied = false;
            discount = 0;
            updateCartUI();
            new bootstrap.Modal(document.getElementById("checkoutModal")).hide();
        }

        // Load products when the page is ready
        window.onload = fetchProducts;