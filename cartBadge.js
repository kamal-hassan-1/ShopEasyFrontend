async function updateCartBadge() {
	const badge = document.getElementById("cartBadge");
	if (!badge) return;
	const token = localStorage.getItem("authToken");
	if (!token) {
		badge.textContent = "0";
		return;
	}
	try {
		const res = await fetch("http://localhost:5000/api/main/fetchCartItems", {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) {
			badge.textContent = "0";
			return;
		}
		const products = await res.json();
		badge.textContent = products.length;
	} catch {
		badge.textContent = "0";
	}
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
