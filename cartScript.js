let cartItems = [];
let isLoggedIn = false;
let appliedDiscount = 0;

// Fetch cart items from backend
async function fetchCartItems() {
	const token = localStorage.getItem("authToken");
	if (!token) {
		showEmptyCart();
		return;
	}
	try {
		const res = await fetch("http://localhost:5000/api/main/fetchCartItems", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!res.ok) {
			showEmptyCart();
			return;
		}
		const products = await res.json();
		// Assign unique ids and default quantity
		cartItems = products.map((p, idx) => ({
			id: idx + 1,
			name: p.name,
			category: p.category,
			price: p.price,
			imageUrl: p.imageUrl,
			quantity: 1,
		}));
		renderCartItems();
		updateCartBadge();
		updateCartSummary();
	} catch (err) {
		console.error("Failed to fetch cart items:", err);
		showEmptyCart();
	}
}

// Render cart items in the DOM
function renderCartItems() {
	const list = document.getElementById("cartItemsList");
	list.innerHTML = "";
	if (cartItems.length === 0) {
		showEmptyCart();
		return;
	}
	cartItems.forEach((item) => {
		const div = document.createElement("div");
		div.className = "cart-item";
		div.dataset.id = item.id;
		div.dataset.price = item.price;
		div.innerHTML = `
            <div class="item-image"><img src="${item.imageUrl}" alt="${
			item.name
		}" style="width:60px;height:60px;border-radius:8px;"></div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-category">${item.category}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="item-controls">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${
											item.id
										}, -1)">-</button>
                    <input type="number" class="qty-input" value="${
											item.quantity
										}" min="1" readonly />
                    <button class="qty-btn" onclick="updateQuantity(${
											item.id
										}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeItem(${
									item.id
								})">Remove</button>
            </div>
        `;
		list.appendChild(div);
	});
}

// Update quantity
function updateQuantity(itemId, change) {
	const item = cartItems.find((item) => item.id === itemId);
	if (item) {
		const newQuantity = item.quantity + change;
		if (newQuantity > 0) {
			item.quantity = newQuantity;

			// Update UI
			const cartItem = document.querySelector(`[data-id="${itemId}"]`);
			const qtyInput = cartItem.querySelector(".qty-input");
			qtyInput.value = newQuantity;

			updateCartSummary();
		}
	}
}

function handleRegister() {
	// Simulate registration process
	isLoggedIn = true;
	updateProfileDropdown();
	toggleDropdown(); // Close dropdown after action
}
// Remove item from cart
function removeItem(itemId) {
	cartItems = cartItems.filter((item) => item.id !== itemId);

	// Remove from UI
	const cartItem = document.querySelector(`[data-id="${itemId}"]`);
	cartItem.remove();

	updateCartBadge();
	updateCartSummary();

	// Show empty cart if no items
	if (cartItems.length === 0) {
		showEmptyCart();
	}
}

function toggleDropdown() {
	const dropdown = document.getElementById("profileDropdown");
	dropdown.classList.toggle("show");
}

function handleRegisterOrSignOut() {
	// Remove authToken if present (sign out)
	localStorage.removeItem("authToken");
	// Redirect to register.html
	window.location.href = "register.html";
}

function updateProfileDropdown() {
	const dropdown = document.getElementById("profileDropdown");
	const authToken = localStorage.getItem("authToken");
	if (authToken) {
		dropdown.innerHTML =
			'<a href="#" onclick="handleRegisterOrSignOut()">Sign Out</a>';
	} else {
		dropdown.innerHTML =
			'<a href="#" onclick="handleRegisterOrSignOut()">Register</a>';
	}
}

// Clear entire cart
async function clearCart() {
	if (!confirm("Are you sure you want to clear your cart?")) return;

	const token = localStorage.getItem("authToken");
	if (!token) {
		alert("You must be logged in to clear your cart.");
		return;
	}

	try {
		const res = await fetch("http://localhost:5000/api/main/clearCart", {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (res.ok) {
			cartItems = [];
			showEmptyCart();
			alert("Cart cleared successfully!");
		} else {
			const data = await res.json();
			alert(data.error || "Failed to clear cart.");
		}
	} catch (err) {
		console.error("Error clearing cart:", err);
		alert("Server error. Please try again.");
	}
}

// Show empty cart state
function showEmptyCart() {
	document.getElementById("cartContent").style.display = "none";
	document.getElementById("emptyCart").style.display = "block";
	document.getElementById("cartBadge").textContent = "0";
}

// Update cart badge
function updateCartBadge() {
	const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	document.getElementById("cartBadge").textContent = totalItems;
}

// Update cart summary
function updateCartSummary() {
	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const shipping = subtotal > 100 ? 0 : 15.99; // Free shipping over $100
	const tax = subtotal * 0.1; // 10% tax
	const discount = subtotal * (appliedDiscount / 100);
	const total = subtotal + shipping + tax - discount;

	document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
	document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
	document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
	document.getElementById("total").textContent = `$${total.toFixed(2)}`;

	if (appliedDiscount > 0) {
		document.getElementById("discount").textContent = `-$${discount.toFixed(
			2
		)}`;
		document.getElementById("discountRow").style.display = "flex";
	}
}

// Apply coupon code
function applyCoupon() {
	const couponCode = document
		.getElementById("couponCode")
		.value.trim()
		.toUpperCase();
	const button = document.querySelector(".apply-coupon");

	// Sample coupon codes
	const validCoupons = {
		SAVE10: 10,
		WELCOME15: 15,
		LUXE20: 20,
	};

	if (validCoupons[couponCode]) {
		appliedDiscount = validCoupons[couponCode];
		updateCartSummary();

		button.textContent = "Applied!";
		button.style.background = "#639FAB";
		document.getElementById("couponCode").disabled = true;

		setTimeout(() => {
			button.textContent = "Applied";
		}, 1000);
	} else {
		button.textContent = "Invalid";
		button.style.background = "#ff6b6b";

		setTimeout(() => {
			button.textContent = "Apply";
			button.style.background = "#1C5D99";
		}, 2000);
	}
}

// Proceed to checkout
function proceedToCheckout() {
	if (cartItems.length === 0) {
		alert("Your cart is empty!");
		return;
	}

	// Here you would integrate with your payment system
	alert("Proceeding to checkout... (Integration with payment gateway)");
	console.log("Cart items for checkout:", cartItems);
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", function () {
	fetchCartItems();
	updateProfileDropdown();
});
