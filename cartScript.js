let cartItems = [
	{ id: 1, name: "Designer Handbag", price: 299.99, quantity: 1 },
	{ id: 2, name: "Luxury Watch", price: 599.99, quantity: 1 },
	{ id: 3, name: "Premium Sunglasses", price: 199.99, quantity: 1 },
];

let isLoggedIn = false;

let appliedDiscount = 0;

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

function updateProfileDropdown() {
	const dropdown = document.getElementById("profileDropdown");
	if (isLoggedIn) {
		dropdown.innerHTML =
			'<a href="#signout" onclick="handleSignOut()">Sign Out</a>';
	} else {
		dropdown.innerHTML =
			'<a href="#register" onclick="handleRegister()">Register</a>';
	}
}

// Clear entire cart
function clearCart() {
	if (confirm("Are you sure you want to clear your cart?")) {
		cartItems = [];
		showEmptyCart();
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
	updateCartBadge();
	updateCartSummary();
});
