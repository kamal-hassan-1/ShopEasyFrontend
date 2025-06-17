let isLoggedIn = false;

function toggleDropdown() {
	const dropdown = document.getElementById("profileDropdown");
	dropdown.classList.toggle("show");
}

function handleRegister() {
	// Simulate registration process
	isLoggedIn = true;
	updateProfileDropdown();
	toggleDropdown(); // Close dropdown after action
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


document.querySelectorAll(".payment-method").forEach((method) => {
	method.addEventListener("click", function () {
		document
			.querySelectorAll(".payment-method")
			.forEach((m) => m.classList.remove("selected"));
		this.classList.add("selected");

		const selectedMethod = this.dataset.method;
		const cardDetails = document.getElementById("cardDetails");

		if (selectedMethod === "card") {
			cardDetails.style.display = "block";
		} else {
			cardDetails.style.display = "none";
		}
	});
});

// Card number formatting
document.getElementById("cardNumber").addEventListener("input", function (e) {
	let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
	let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
	if (formattedValue !== e.target.value) {
		e.target.value = formattedValue;
	}
});

// Expiry date formatting
document.getElementById("expiryDate").addEventListener("input", function (e) {
	let value = e.target.value.replace(/\D/g, "");
	if (value.length >= 2) {
		value = value.substring(0, 2) + "/" + value.substring(2, 4);
	}
	e.target.value = value;
});

// CVV formatting
document.getElementById("cvv").addEventListener("input", function (e) {
	e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
});

// Form validation
function validateForm() {
	const requiredFields = [
		"firstName",
		"lastName",
		"email",
		"phone",
		"address",
		"city",
		"state",
		"zipCode",
		"country",
	];

	const selectedPaymentMethod = document.querySelector(
		".payment-method.selected"
	).dataset.method;

	if (selectedPaymentMethod === "card") {
		requiredFields.push("cardNumber", "expiryDate", "cvv", "cardName");
	}

	for (let fieldId of requiredFields) {
		const field = document.getElementById(fieldId);
		if (!field.value.trim()) {
			field.focus();
			field.style.borderColor = "#ff6b6b";
			setTimeout(() => {
				field.style.borderColor = "#555555";
			}, 3000);
			return false;
		}
	}

	// Email validation
	const email = document.getElementById("email").value;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		document.getElementById("email").focus();
		return false;
	}

	return true;
}

// Place order
function placeOrder() {
	if (!validateForm()) {
		alert("Please fill in all required fields correctly.");
		return;
	}

	// Show loading state
	const button = document.querySelector(".btn-primary");
	const originalText = button.innerHTML;
	button.innerHTML = "Processing... ⏳";
	button.disabled = true;

	// Simulate order processing
	setTimeout(() => {
		// Update order steps
		document
			.querySelectorAll(".step")
			.forEach((step) => step.classList.remove("active"));
		document.querySelectorAll(".step")[2].classList.add("active", "completed");

		// Update delivery address in confirmation
		const address = `${document.getElementById("address").value}, ${
			document.getElementById("city").value
		}, ${document.getElementById("state").value} ${
			document.getElementById("zipCode").value
		}`;
		document.getElementById("deliveryAddress").textContent = address;

		// Show confirmation
		document.getElementById("orderContent").style.display = "none";
		document.getElementById("orderConfirmation").style.display = "block";

		// Update cart badge
		document.getElementById("cartBadge").textContent = "0";

		// Scroll to top
		window.scrollTo({ top: 0, behavior: "smooth" });

		// Reset button
		button.innerHTML = originalText;
		button.disabled = false;
	}, 2000);
}

// Auto-fill card name from shipping name
document.getElementById("firstName").addEventListener("input", updateCardName);
document.getElementById("lastName").addEventListener("input", updateCardName);

function updateCardName() {
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const cardName = document.getElementById("cardName");

	if (firstName || lastName) {
		cardName.value = `${firstName} ${lastName}`.trim();
	}
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
	// Focus first input
	document.getElementById("firstName").focus();
});
