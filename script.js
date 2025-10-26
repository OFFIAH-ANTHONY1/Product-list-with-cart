// Product Data
const products = [
  {
    id: 1,
    category: "Waffle",
    name: "Waffle with Berries",
    price: 6.5,
    image: "images/image-waffle-desktop.jpg",
  },
  {
    id: 2,
    category: "Crème Brûlée",
    name: "Vanilla Bean Crème Brûlée",
    price: 7.0,
    image: "images/image-creme-brulee-desktop.jpg",
  },
  {
    id: 3,
    category: "Macaron",
    name: "Macaron Mix of Five",
    price: 8.0,
    image: "images/image-macaron-desktop.jpg",
  },
  {
    id: 4,
    category: "Tiramisu",
    name: "Classic Tiramisu",
    price: 5.5,
    image: "images/image-tiramisu-desktop.jpg",
  },
  {
    id: 5,
    category: "Baklava",
    name: "Pistachio Baklava",
    price: 4.0,
    image: "images/image-baklava-desktop.jpg",
  },
  {
    id: 6,
    category: "Pie",
    name: "Lemon Meringue Pie",
    price: 5.0,
    image: "images/image-meringue-desktop.jpg",
  },
  {
    id: 7,
    category: "Cake",
    name: "Red Velvet Cake",
    price: 4.5,
    image: "images/image-cake-desktop.jpg",
  },
  {
    id: 8,
    category: "Brownie",
    name: "Salted Caramel Brownie",
    price: 5.5,
    image: "images/image-brownie-desktop.jpg",
  },
  {
    id: 9,
    category: "Panna Cotta",
    name: "Vanilla Panna Cotta",
    price: 6.5,
    image: "images/image-panna-cotta-desktop.jpg",
  },
];

// DOM Elements
const productList = document.getElementById("productList");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cart-count");
const orderTotal = document.getElementById("orderTotal");
const cartSummary = document.getElementById("cartSummary");
const orderModal = document.getElementById("orderModal");
const orderDetails = document.getElementById("orderDetails");
const orderModalTotal = document.getElementById("orderModalTotal");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const newOrderBtn = document.getElementById("newOrderBtn");

// 🧠 Load saved cart from localStorage, or start empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🧩 Helper: Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 🧩 Render product cards
function renderProducts() {
  productList.innerHTML = "";
  products.forEach((prod) => {
    const inCart = cart.find((item) => item.id === prod.id);
    const quantity = inCart ? inCart.qty : 0;

    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}">
      <div class="product-info">
        <p>${prod.category}</p>
        <h3>${prod.name}</h3>
        <p>$${prod.price.toFixed(2)}</p>
        ${
          quantity === 0
            ? `<button class="add-btn" data-id="${prod.id}">
                <img src="images/icon-add-to-cart.svg">
                Add to Cart
              </button>`
            : `
              <div class="qty-control" data-id="${prod.id}">
                <button class="decrease">-</button>
                <span>${quantity}</span>
                <button class="increase">+</button>
              </div>`
        }
      </div>`;
    productList.appendChild(div);
  });
}

// 🛒 Add / Update Cart
productList.addEventListener("click", (e) => {
  const id = Number(e.target.closest("[data-id]")?.dataset.id);
  if (!id) return;
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (e.target.classList.contains("add-btn")) {
    cart.push({ ...product, qty: 1 });
  } else if (e.target.classList.contains("increase")) {
    existing.qty++;
  } else if (e.target.classList.contains("decrease")) {
    existing.qty--;
    if (existing.qty <= 0) cart = cart.filter((i) => i.id !== id);
  }

  renderProducts();
  updateCart();
  saveCart(); // ✅ Save after every change
});

// 🧾 Update Cart Display
function updateCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <img src="images/illustration-empty-cart.svg" id="emptyImg">
      <p class="empty">Your added items will appear here</p>`;
    cartSummary.classList.add("hidden");
  } else {
    cartSummary.classList.remove("hidden");
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <div class="item-details-container">
      <p>${item.name}</p>
      <div class="item-details">
      <p>${item.qty}x</p>
      <p>@${item.price.toFixed(2)}</p>
      <p>$${(item.price * item.qty).toFixed(2)}</p>
      </div>`;
    cartItemsContainer.appendChild(div);
  });

  cartCount.textContent = cart.length;
  orderTotal.textContent = `$${total.toFixed(2)}`;
}

// ♻️ Handle Quantity Changes in Cart
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("qty-btn")) {
    const id = Number(e.target.dataset.id);
    const action = e.target.dataset.action;
    const item = cart.find((i) => i.id === id);

    if (action === "increase") item.qty++;
    else if (action === "decrease") {
      item.qty--;
      if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
    }

    renderProducts();
    updateCart();
    saveCart(); // ✅ Save updates
  }
});

// 🧾 Confirm Order Modal
confirmOrderBtn.addEventListener("click", () => {
  orderModal.classList.remove("hidden");
  orderDetails.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="selected-item-cont">
    <img src="${item.image}" class="cart-img" width="40px" height="40px">
    <div class="selected-item-details">
    <p>${item.name}</p>
    <p>${item.qty}x @$${item.price.toFixed(2)}</p>
    </div>
    <p>$${(item.price * item.qty).toFixed(2)}</p>
    </div>
    </div>
    `;
    orderDetails.appendChild(div);
    total += item.price * item.qty;
  });

  orderModalTotal.textContent = `$${total.toFixed(2)}`;
});

// 🆕 Start New Order
newOrderBtn.addEventListener("click", () => {
  orderModal.classList.add("hidden");
  cart = [];
  renderProducts();
  updateCart();
  saveCart(); // ✅ Clear storage too
});

// 🚀 Initialize page (load products and cart)
window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCart(); // ✅ Shows empty image on load
});
