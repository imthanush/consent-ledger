/**
 * ShopSphere E-Commerce Demo Website
 * JavaScript Implementation: Cookie Consent, Product Catalog, Search & Cart
 */

// =============================================================================
// 1. PRODUCT CATALOG DATA
// =============================================================================
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    category: "Electronics",
    rating: 4.8,
    reviews: 142,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    fallback: "https://placehold.co/400x400/4f46e5/ffffff?text=Wireless+Headphones"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 4999,
    category: "Electronics",
    rating: 4.9,
    reviews: 218,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    fallback: "https://placehold.co/400x400/0ea5e9/ffffff?text=Smart+Watch"
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 2499,
    category: "Sports",
    rating: 4.7,
    reviews: 89,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    fallback: "https://placehold.co/400x400/ef4444/ffffff?text=Running+Shoes"
  },
  {
    id: 4,
    name: "Premium Backpack",
    price: 1299,
    category: "Accessories",
    rating: 4.6,
    reviews: 64,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    fallback: "https://placehold.co/400x400/6366f1/ffffff?text=Premium+Backpack"
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 1999,
    category: "Electronics",
    rating: 4.8,
    reviews: 112,
    badge: "New",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    fallback: "https://placehold.co/400x400/10b981/ffffff?text=Bluetooth+Speaker"
  },
  {
    id: 6,
    name: "Classic Sunglasses",
    price: 999,
    category: "Accessories",
    rating: 4.5,
    reviews: 73,
    badge: "Summer",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
    fallback: "https://placehold.co/400x400/f59e0b/ffffff?text=Classic+Sunglasses"
  },
  {
    id: 7,
    name: "Coffee Maker",
    price: 3499,
    category: "Home & Living",
    rating: 4.9,
    reviews: 156,
    badge: "Essential",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
    fallback: "https://placehold.co/400x400/8b5cf6/ffffff?text=Coffee+Maker"
  },
  {
    id: 8,
    name: "Gaming Mouse",
    price: 1499,
    category: "Electronics",
    rating: 4.8,
    reviews: 95,
    badge: "Pro Gear",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    fallback: "https://placehold.co/400x400/ec4899/ffffff?text=Gaming+Mouse"
  }
];

// =============================================================================
// 2. STATE VARIABLES
// =============================================================================
let cookieConsent = null;
let cartItems = [];
let activeCategoryFilter = "all";
let currentSearchQuery = "";

// =============================================================================
// 3. DOM ELEMENTS
// =============================================================================
// Cookie Consent Elements
const cookieBanner = document.getElementById("cookieBanner");
const acceptAllButton = document.getElementById("acceptAll");
const rejectAllButton = document.getElementById("rejectAll");
const managePreferencesButton = document.getElementById("managePreferences");
const preferencesModal = document.getElementById("preferencesModal");
const closePrefModalBtn = document.getElementById("closePrefModalBtn");
const savePreferencesBtn = document.getElementById("savePreferencesBtn");
const cancelPreferencesBtn = document.getElementById("cancelPreferencesBtn");
const prefAnalyticsInput = document.getElementById("prefAnalytics");
const prefMarketingInput = document.getElementById("prefMarketing");
const footerCookieSettingsBtn = document.getElementById("footerCookieSettingsBtn");
const footerResetConsentBtn = document.getElementById("footerResetConsentBtn");

// Cart Elements
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartCount = document.getElementById("cartCount");
const cartDrawerCount = document.getElementById("cartDrawerCount");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSubtotal = document.getElementById("cartSubtotal");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

// Catalog & Search Elements
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const searchStatusBar = document.getElementById("searchStatusBar");
const searchQueryDisplay = document.getElementById("searchQueryDisplay");
const resetSearchFilterBtn = document.getElementById("resetSearchFilterBtn");
const noProductsFound = document.getElementById("noProductsFound");
const clearSearchStateBtn = document.getElementById("clearSearchStateBtn");
const filterPills = document.querySelectorAll(".filter-pill");
const categoryCards = document.querySelectorAll(".category-card");

// Toast Element
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");

// =============================================================================
// 4. TOAST NOTIFICATION SYSTEM
// =============================================================================
let toastTimeout = null;

function showToast(message, type = "success") {
  if (!toast) return;

  clearTimeout(toastTimeout);
  toastMessage.textContent = message;

  if (type === "success") {
    toastIcon.textContent = "✓";
    toastIcon.style.backgroundColor = "var(--success)";
  } else if (type === "info") {
    toastIcon.textContent = "ℹ";
    toastIcon.style.backgroundColor = "var(--primary)";
  } else if (type === "warning") {
    toastIcon.textContent = "!";
    toastIcon.style.backgroundColor = "var(--accent)";
  }

  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// =============================================================================
// 5. COOKIE CONSENT BANNER & PREFERENCES LOGIC
// =============================================================================
function initCookieConsent() {
  // Check if consent has already been recorded in localStorage
  cookieConsent = localStorage.getItem("cookieConsent");

  if (!cookieConsent) {
    // First-time visit: Display the cookie consent banner
    setTimeout(() => {
      if (cookieBanner) {
        cookieBanner.classList.add("show");
      }
    }, 400);
  } else {
    console.log(`[ShopSphere] Stored cookie consent decision: ${cookieConsent}`);
  }
}

// Hide the banner with animation
function hideCookieBanner() {
  if (cookieBanner) {
    cookieBanner.classList.remove("show");
  }
}

// Accept All Handler
if (acceptAllButton) {
  acceptAllButton.addEventListener("click", () => {
    cookieConsent = "ACCEPTED";
    localStorage.setItem("cookieConsent", "ACCEPTED");
    hideCookieBanner();
    showToast("All cookies accepted.", "success");
    console.log("[ShopSphere] Consent updated: ACCEPTED");
  });
}

// Reject All Handler
// CRITICAL: Strict requirement for Consent Ledger Chrome Extension detection
if (rejectAllButton) {
  rejectAllButton.addEventListener("click", (event) => {
    // Prevent default behavior to ensure page does not reload
    event.preventDefault();

    cookieConsent = "REJECTED";
    localStorage.setItem("cookieConsent", "REJECTED");
    hideCookieBanner();
    showToast("Optional cookies have been rejected.", "info");
    console.log("[ShopSphere] Consent updated: REJECTED");
  });
}

// Manage Preferences Modal Open
if (managePreferencesButton) {
  managePreferencesButton.addEventListener("click", () => {
    openPreferencesModal();
  });
}

function openPreferencesModal() {
  if (preferencesModal) {
    // Synchronize toggles based on existing consent if applicable
    const current = localStorage.getItem("cookieConsent");
    if (current === "ACCEPTED") {
      prefAnalyticsInput.checked = true;
      prefMarketingInput.checked = true;
    } else if (current === "REJECTED") {
      prefAnalyticsInput.checked = false;
      prefMarketingInput.checked = false;
    }
    preferencesModal.classList.add("show");
    preferencesModal.setAttribute("aria-hidden", "false");
  }
}

function closePreferencesModal() {
  if (preferencesModal) {
    preferencesModal.classList.remove("show");
    preferencesModal.setAttribute("aria-hidden", "true");
  }
}

if (closePrefModalBtn) {
  closePrefModalBtn.addEventListener("click", closePreferencesModal);
}

if (cancelPreferencesBtn) {
  cancelPreferencesBtn.addEventListener("click", closePreferencesModal);
}

// Save Custom Preferences
if (savePreferencesBtn) {
  savePreferencesBtn.addEventListener("click", () => {
    const analyticsAllowed = prefAnalyticsInput ? prefAnalyticsInput.checked : false;
    const marketingAllowed = prefMarketingInput ? prefMarketingInput.checked : false;

    if (!analyticsAllowed && !marketingAllowed) {
      // Both optional cookies rejected -> Store REJECTED
      cookieConsent = "REJECTED";
      localStorage.setItem("cookieConsent", "REJECTED");
      showToast("Optional cookies have been rejected.", "info");
    } else {
      // Customized preferences enabled -> Store CUSTOM
      cookieConsent = "CUSTOM";
      localStorage.setItem("cookieConsent", "CUSTOM");
      showToast("Preferences saved successfully.", "success");
    }

    closePreferencesModal();
    hideCookieBanner();
    console.log(`[ShopSphere] Consent updated via preferences: ${cookieConsent}`);
  });
}

// Footer: Reopen Cookie Settings
if (footerCookieSettingsBtn) {
  footerCookieSettingsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openPreferencesModal();
  });
}

// Footer: Demo Reset Button (Handy for Hackathon Judges & Testing)
if (footerResetConsentBtn) {
  footerResetConsentBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("cookieConsent");
    cookieConsent = null;
    cookieBanner.classList.add("show");
    showToast("Consent reset for demo testing. Banner visible.", "info");
    console.log("[ShopSphere] Consent cleared from localStorage.");
  });
}

// Close preferences modal on outside backdrop click
if (preferencesModal) {
  preferencesModal.addEventListener("click", (e) => {
    if (e.target === preferencesModal) {
      closePreferencesModal();
    }
  });
}

// =============================================================================
// 6. PRODUCT CATALOG RENDERING & FILTERING
// =============================================================================
function renderProducts(itemsToRender) {
  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  if (itemsToRender.length === 0) {
    noProductsFound.style.display = "block";
    productsGrid.style.display = "none";
    return;
  }

  noProductsFound.style.display = "none";
  productsGrid.style.display = "grid";

  itemsToRender.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-product-id", product.id);

    // Build star display
    const fullStars = Math.floor(product.rating);
    const starStr = "★".repeat(fullStars) + (product.rating % 1 !== 0 ? "☆" : "");

    card.innerHTML = `
      <div class="product-image-box">
        <span class="product-badge">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='${product.fallback}'">
      </div>
      <span class="product-category-tag">${product.category}</span>
      <h3 class="product-title">${product.name}</h3>
      <div class="product-rating">
        <span class="stars">${starStr}</span>
        <span class="rating-score">${product.rating}</span>
        <span class="rating-count">(${product.reviews})</span>
      </div>
      <div class="product-card-footer">
        <div class="product-price">₹${product.price.toLocaleString("en-IN")}</div>
        <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add</span>
        </button>
      </div>
    `;

    // Add to cart button handler
    const addBtn = card.querySelector(".add-to-cart-btn");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product.id);
    });

    productsGrid.appendChild(card);
  });
}

function filterAndDisplayProducts() {
  let filtered = products;

  // 1. Filter by category
  if (activeCategoryFilter !== "all") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === activeCategoryFilter.toLowerCase()
    );
  }

  // 2. Filter by search query
  if (currentSearchQuery.trim() !== "") {
    const query = currentSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    // Update search status bar
    if (searchStatusBar) {
      searchStatusBar.style.display = "flex";
      searchQueryDisplay.textContent = currentSearchQuery;
    }
  } else {
    if (searchStatusBar) {
      searchStatusBar.style.display = "none";
    }
  }

  renderProducts(filtered);
}

// Category filter pills click
filterPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    filterPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategoryFilter = pill.getAttribute("data-filter");
    filterAndDisplayProducts();
  });
});

// Category cards click (in "Shop by Category" section)
categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    const category = card.getAttribute("data-category");
    activeCategoryFilter = category;

    // Sync active filter pill
    filterPills.forEach((pill) => {
      if (pill.getAttribute("data-filter").toLowerCase() === category.toLowerCase()) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    filterAndDisplayProducts();

    // Smooth scroll down to products section
    const shopSection = document.getElementById("shop");
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Search input handling
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value;

    if (currentSearchQuery.length > 0) {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
    }

    filterAndDisplayProducts();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const shopSection = document.getElementById("shop");
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

// Clear search button
if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    currentSearchQuery = "";
    clearSearchBtn.style.display = "none";
    filterAndDisplayProducts();
    searchInput.focus();
  });
}

// Reset search from status bar
if (resetSearchFilterBtn) {
  resetSearchFilterBtn.addEventListener("click", () => {
    resetAllFilters();
  });
}

// Reset search from empty state view
if (clearSearchStateBtn) {
  clearSearchStateBtn.addEventListener("click", () => {
    resetAllFilters();
  });
}

function resetAllFilters() {
  currentSearchQuery = "";
  if (searchInput) searchInput.value = "";
  if (clearSearchBtn) clearSearchBtn.style.display = "none";
  activeCategoryFilter = "all";

  filterPills.forEach((pill) => {
    if (pill.getAttribute("data-filter") === "all") {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });

  filterAndDisplayProducts();
}

// =============================================================================
// 7. SHOPPING CART LOGIC
// =============================================================================
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cartItems.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      fallback: product.fallback,
      quantity: 1
    });
  }

  updateCartUI();
  showToast(`Added ${product.name} to cart!`, "success");

  // Subtle bounce effect on cart button
  if (cartBtn) {
    cartBtn.style.transform = "scale(1.15)";
    setTimeout(() => {
      cartBtn.style.transform = "scale(1)";
    }, 200);
  }
}

function updateCartQuantity(productId, delta) {
  const itemIndex = cartItems.findIndex((item) => item.id === productId);
  if (itemIndex === -1) return;

  cartItems[itemIndex].quantity += delta;

  if (cartItems[itemIndex].quantity <= 0) {
    cartItems.splice(itemIndex, 1);
  }

  updateCartUI();
}

function removeFromCart(productId) {
  const item = cartItems.find((i) => i.id === productId);
  cartItems = cartItems.filter((i) => i.id !== productId);
  updateCartUI();
  if (item) {
    showToast(`Removed ${item.name} from cart`, "info");
  }
}

function clearCart() {
  if (cartItems.length === 0) return;
  cartItems = [];
  updateCartUI();
  showToast("Cart has been cleared", "info");
}

function calculateTotal() {
  return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function updateCartUI() {
  // Calculate total count of items
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = calculateTotal();

  // Update badge counter in header & drawer
  if (cartCount) cartCount.textContent = totalCount;
  if (cartDrawerCount) cartDrawerCount.textContent = `${totalCount} items`;

  // Update prices
  const formattedTotal = `₹${totalAmount.toLocaleString("en-IN")}`;
  if (cartSubtotal) cartSubtotal.textContent = formattedTotal;
  if (totalPrice) totalPrice.textContent = formattedTotal;

  // Render items list inside drawer
  if (!cartItemsContainer) return;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-view">
        <div class="cart-empty-icon">🛍️</div>
        <h4>Your Cart is Empty</h4>
        <p>Explore our featured collection and discover amazing essentials today!</p>
      </div>
    `;
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='${item.fallback}'">
        <div>
          <h4 class="cart-item-name">${item.name}</h4>
          <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString("en-IN")}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)" title="Decrease quantity" aria-label="Decrease quantity">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)" title="Increase quantity" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Remove item" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `
    )
    .join("");
}

// Drawer Visibility
function openCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);
if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);
if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cartItems.length === 0) return;
    showToast("Checkout demo: Order placed successfully!", "success");
    cartItems = [];
    updateCartUI();
    closeCartDrawer();
  });
}

// Expose updateCartQuantity and removeFromCart globally for inline onclick handlers
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;

// =============================================================================
// 8. USER PROFILE / MOCK ACTIONS
// =============================================================================
const userProfileBtn = document.getElementById("userProfileBtn");
if (userProfileBtn) {
  userProfileBtn.addEventListener("click", () => {
    showToast("Signed in as Demo Judge (ShopSphere Guest)", "info");
  });
}

// Support links demo messages
const helpCenterLink = document.getElementById("helpCenterLink");
const contactLink = document.getElementById("contactLink");
const returnsLink = document.getElementById("returnsLink");
const privacyPolicyLink = document.getElementById("privacyPolicyLink");

[helpCenterLink, contactLink, returnsLink].forEach((link) => {
  if (link) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("ShopSphere 24/7 Support: support@shopsphere-demo.test", "info");
    });
  }
});

if (privacyPolicyLink) {
  privacyPolicyLink.addEventListener("click", (e) => {
    e.preventDefault();
    openPreferencesModal();
  });
}

// =============================================================================
// 9. SMOOTH SCROLLING & ACTIVE LINK HIGHLIGHTING
// =============================================================================
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let currentSectionId = "";
  const sections = document.querySelectorAll("section[id]");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
});

// ESC key closes modals & drawers
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCartDrawer();
    closePreferencesModal();
  }
});

// =============================================================================
// 10. INITIALIZATION ON DOM READY
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial product catalog rendering
  renderProducts(products);

  // 2. Initialize cart UI
  updateCartUI();

  // 3. Initialize cookie consent detection & banner
  initCookieConsent();

  console.log("[ShopSphere] Modern Demo Website initialized successfully.");
});
