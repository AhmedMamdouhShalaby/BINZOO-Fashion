(function(){
  "use strict";

  /* ---------- Ticker ---------- */
  const tickerTrack = document.getElementById("tickerTrack");
  if (tickerTrack) {
    const phrase = "Wear What Leads — BINZOO — Since 2026";
    const group = Array(6).fill(`<span>${phrase}</span>`).join("");
    tickerTrack.innerHTML = group + group;
  }

  /* ---------- Card markup ---------- */
  function starsHTML(rating){
    const full = Math.round(rating);
    let stars = "";
    for (let i = 0; i < 5; i++) stars += i < full ? "★" : "☆";
    return stars;
  }

  function cardHTML(p){
    const priceHTML = p.compareAt
      ? `<span class="was">${fmt(p.compareAt)}</span><span class="now">${fmt(p.price)}</span>`
      : `<span>${fmt(p.price)}</span>`;
    const badge = p.soldOut ? `<span class="badge soldout">Sold Out</span>` : (p.compareAt ? `<span class="badge sale">Sale</span>` : "");
    return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media">
        <a href="product.html?id=${p.id}" style="position:absolute;inset:0;z-index:1;" aria-label="${p.name}"></a>
        ${badge}
        <button class="wishlist-btn" data-id="${p.id}" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.4 8 2 4.5 5.6 4.1 8 3.8 10 5 12 7.5 14 5 16 3.8 18.4 4.1 22 4.5 23.6 8 22 11.8 19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <img class="img1" src="${p.img}" alt="${p.name}" loading="lazy">
        <img class="img2" src="${p.img2}" alt="${p.name}" loading="lazy">
        <div class="quick-add">
          <button class="add-btn" data-id="${p.id}" ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold out" : "Quick Add"}</button>
          <a class="quickview-btn" href="product.html?id=${p.id}" aria-label="Quick view">⤢</a>
        </div>
      </div>
      <div class="product-info">
        <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
        <div class="product-rating">${starsHTML(p.rating || 4.8)}<span class="count">(${Math.floor((p.rating||4.8)*7)})</span></div>
        <div class="product-price">${priceHTML}</div>
      </div>
    </article>`;
  }
  window.BINZOOCardHTML = cardHTML;

  function renderGrid(elId, items){
    const el = document.getElementById(elId);
    if(!el) return;
    el.innerHTML = items.slice(0, 5).map(cardHTML).join("");
  }

  if (typeof PRODUCTS !== "undefined") {
    const dresses = PRODUCTS.dresses || [];
    renderGrid("newArrivalsGrid", dresses.slice(0, 5).concat(PRODUCTS.tops || []).slice(0, 5));
    renderGrid("bestSellersGrid", (PRODUCTS.sets || []).concat(PRODUCTS.outerwear || [], dresses).slice(0, 5));
  }

  /* ---------- Toast ---------- */
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function showToast(msg){
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  /* ---------- Cart ---------- */
  window.BINZOOCart = window.BINZOOCart || { data: {} };
  let cart = window.BINZOOCart.data;

  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartSubtotalEl = document.getElementById("cartSubtotal");

  function openCart(){ cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); }
  function closeCart(){ cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); }

  document.getElementById("cartToggle").addEventListener("click", () => { renderCart(); openCart(); });
  document.getElementById("cartClose").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  function addToCart(id, qty){
    qty = qty || 1;
    const product = ALL_PRODUCTS.find(p => p.id === id);
    if(!product || product.soldOut) return;
    cart[id] = (cart[id] || 0) + qty;
    updateCartCount();
    showToast(`${product.name} added to bag`);
  }
  window.BINZOOAddToCart = addToCart;

  function changeQty(id, delta){
    if(!cart[id]) return;
    cart[id] += delta;
    if(cart[id] <= 0) delete cart[id];
    updateCartCount();
    renderCart();
  }

  function removeFromCart(id){
    delete cart[id];
    updateCartCount();
    renderCart();
  }

  function updateCartCount(){
    const total = Object.values(cart).reduce((a,b) => a + b, 0);
    if (cartCountEl) cartCountEl.textContent = total;
  }

  function renderCart(){
    const ids = Object.keys(cart);
    if(ids.length === 0){
      cartItemsEl.innerHTML = `<p class="cart-empty">Your bag is currently empty.</p>`;
      cartSubtotalEl.textContent = fmt(0);
      return;
    }
    let subtotal = 0;
    cartItemsEl.innerHTML = ids.map(id => {
      const p = ALL_PRODUCTS.find(pp => pp.id === id);
      const qty = cart[id];
      subtotal += p.price * qty;
      return `
      <div class="cart-line" data-id="${id}">
        <img src="${p.img}" alt="${p.name}">
        <div class="cart-line-info">
          <div class="cl-name">${p.name}</div>
          <div class="cl-price">${fmt(p.price)}</div>
          <div class="cart-line-qty">
            <button class="qty-minus" data-id="${id}">−</button>
            <span>${qty}</span>
            <button class="qty-plus" data-id="${id}">+</button>
          </div>
          <div class="cart-line-remove" data-id="${id}">Remove</div>
        </div>
      </div>`;
    }).join("");
    cartSubtotalEl.textContent = fmt(subtotal);
  }

  document.addEventListener("click", (e) => {
    if(e.target.matches(".add-btn")){
      e.preventDefault();
      addToCart(e.target.dataset.id);
    }
    if(e.target.closest(".wishlist-btn")){
      e.preventDefault();
      e.target.closest(".wishlist-btn").classList.toggle("active");
    }
    if(e.target.matches(".qty-plus")) changeQty(e.target.dataset.id, 1);
    if(e.target.matches(".qty-minus")) changeQty(e.target.dataset.id, -1);
    if(e.target.matches(".cart-line-remove")) removeFromCart(e.target.dataset.id);
  });

  /* ---------- Search ---------- */
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  if (searchToggle) {
    const searchInput = document.getElementById("searchInput");
    const searchClose = document.getElementById("searchClose");
    const searchResults = document.getElementById("searchResults");
    searchToggle.addEventListener("click", () => {
      searchPanel.classList.toggle("open");
      if(searchPanel.classList.contains("open")) searchInput.focus();
    });
    searchClose.addEventListener("click", () => searchPanel.classList.remove("open"));
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if(q.length < 1){ searchResults.innerHTML = ""; return; }
      const matches = ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
      searchResults.innerHTML = matches.map(p => `
        <a class="search-result-item" href="product.html?id=${p.id}">
          <img src="${p.img}" alt="${p.name}">
          <span class="sr-name">${p.name}</span>
          <span class="sr-price">${fmt(p.price)}</span>
        </a>`).join("") || `<p style="color:var(--stone);font-size:.85rem;">No products found.</p>`;
    });
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle) {
    navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
    mainNav.addEventListener("click", (e) => { if(e.target.tagName === "A") mainNav.classList.remove("open"); });
  }

  /* ---------- Newsletter ---------- */
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    const newsletterMsg = document.getElementById("newsletterMsg");
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      newsletterMsg.textContent = "Welcome to the BINZOO community — thanks for subscribing.";
      newsletterForm.reset();
    });
  }

  /* ---------- Sticky header scroll state ---------- */
  const header = document.getElementById("siteHeader");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.background = window.scrollY > 40 ? "rgba(253,251,247,.97)" : "rgba(253,251,247,.88)";
    });
  }

  updateCartCount();
})();
