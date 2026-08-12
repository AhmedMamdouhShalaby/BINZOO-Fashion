(function(){
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = ALL_PRODUCTS.find(p => p.id === id) || ALL_PRODUCTS[0];

  document.title = `BINZOO — ${product.name}`;
  const crumbName = document.getElementById("crumbName");
  if (crumbName) crumbName.textContent = product.name;
  const crumbCollection = document.getElementById("crumbCollection");
  if (crumbCollection) {
    crumbCollection.textContent = COLLECTION_LABELS[product.collection] || "Collection";
    crumbCollection.href = `collection.html?c=${product.collection}`;
  }

  const gallery = [product.img, product.img2, product.img3, product.img4].filter(Boolean);

  const priceHTML = product.compareAt
    ? `<span class="was">${fmt(product.compareAt)}</span><span class="now">${fmt(product.price)}</span>`
    : `<span>${fmt(product.price)}</span>`;

  const badgeHTML = product.soldOut ? `<span class="badge pdp-badge soldout">Sold Out</span>` : (product.compareAt ? `<span class="badge pdp-badge sale">Sale</span>` : "");

  function starsHTML(rating){
    const full = Math.round(rating);
    let stars = "";
    for (let i = 0; i < 5; i++) stars += i < full ? "★" : "☆";
    return stars;
  }

  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  const root = document.getElementById("pdpRoot");
  root.innerHTML = `
    <div class="pdp-thumbs" id="pdpThumbs">
      ${gallery.map((src, i) => `
        <div class="pdp-thumb ${i===0 ? 'active' : ''}" data-index="${i}">
          <img src="${src}" alt="${product.name} view ${i+1}">
        </div>`).join("")}
    </div>

    <div class="pdp-main" id="pdpMain">
      ${badgeHTML}
      ${gallery.map((src, i) => `<img class="${i===0 ? 'active' : ''}" data-index="${i}" src="${src}" alt="${product.name}">`).join("")}
    </div>

    <div class="pdp-info">
      <h1>${product.name}</h1>
      <div class="pdp-rating">${starsHTML(product.rating || 4.8)}<span class="count">${(product.rating || 4.8).toFixed(1)} · ${Math.floor((product.rating||4.8)*11)} reviews</span></div>
      <div class="pdp-price">${priceHTML}</div>

      <div class="pdp-section">
        <span class="pdp-label">Colour — ${product.colors[0]}</span>
        <div class="pill-row" id="colorRow">
          ${product.colors.map((c, i) => `<button class="pill ${i===0 ? 'active' : ''}" data-color="${c}">${c}</button>`).join("")}
        </div>
      </div>

      <div class="pdp-section">
        <span class="pdp-label">Size <span class="size-guide">Size Guide</span></span>
        <div class="pill-row" id="sizeRow">
          ${sizeOptions.map((s, i) => `<button class="pill ${i===2 ? 'active' : ''}" data-size="${s}">${s}</button>`).join("")}
        </div>
      </div>

      <div class="pdp-section">
        <span class="pdp-label">Quantity</span>
        <div class="qty-row">
          <div class="qty-stepper">
            <button id="qtyMinus">−</button>
            <span id="qtyValue">1</span>
            <button id="qtyPlus">+</button>
          </div>
        </div>
      </div>

      <div class="pdp-add">
        <button class="btn btn-dark btn-block" id="addToCartBtn" ${product.soldOut ? "disabled" : ""}>
          ${product.soldOut ? "Sold out" : "Add to Bag"}
        </button>
        <button class="btn btn-gold btn-block" id="buyNowBtn" ${product.soldOut ? "disabled" : ""}>
          Buy It Now
        </button>
        <button class="pdp-wishlist" id="pdpWishlistBtn" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.4 8 2 4.5 5.6 4.1 8 3.8 10 5 12 7.5 14 5 16 3.8 18.4 4.1 22 4.5 23.6 8 22 11.8 19.5 16.4 12 21 12 21z"/></svg>
        </button>
      </div>

      <div class="pdp-accordions">
        <div class="acc-item open">
          <button class="acc-head">Description <span>+</span></button>
          <div class="acc-body"><p>${product.desc}</p></div>
        </div>
        <div class="acc-item">
          <button class="acc-head">Materials &amp; Care <span>+</span></button>
          <div class="acc-body"><ul>${product.features.map(f => `<li>${f}</li>`).join("")}</ul><p style="margin-top:8px;">Fabric: ${product.fabric}</p></div>
        </div>
        <div class="acc-item">
          <button class="acc-head">Shipping Information <span>+</span></button>
          <div class="acc-body"><p>Free shipping on all orders over LE 2,500. Standard delivery within Cairo &amp; Giza in 2–4 business days; nationwide delivery in 3–7 business days.</p></div>
        </div>
        <div class="acc-item">
          <button class="acc-head">Returns <span>+</span></button>
          <div class="acc-body"><p>Sale items are non-refundable. Exchanges are accepted within 2 days of receiving your order, subject to item availability.</p></div>
        </div>
        <div class="acc-item">
          <button class="acc-head">Reviews <span>+</span></button>
          <div class="acc-body"><p>${starsHTML(product.rating || 4.8)} ${(product.rating || 4.8).toFixed(1)} out of 5, based on ${Math.floor((product.rating||4.8)*11)} reviews.</p></div>
        </div>
      </div>
    </div>
  `;

  /* ---------- Gallery crossfade ---------- */
  const thumbs = root.querySelectorAll(".pdp-thumb");
  const mainImgs = root.querySelectorAll(".pdp-main img");
  thumbs.forEach(t => {
    t.addEventListener("click", () => {
      const idx = t.dataset.index;
      thumbs.forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      mainImgs.forEach(img => img.classList.toggle("active", img.dataset.index === idx));
    });
  });

  /* ---------- Color pills ---------- */
  const colorLabel = root.querySelector(".pdp-label");
  root.querySelectorAll("#colorRow .pill").forEach(btn => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("#colorRow .pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      colorLabel.textContent = `Colour — ${btn.dataset.color}`;
    });
  });

  /* ---------- Size pills ---------- */
  root.querySelectorAll("#sizeRow .pill").forEach(btn => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("#sizeRow .pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ---------- Wishlist ---------- */
  const wishlistBtn = document.getElementById("pdpWishlistBtn");
  if (wishlistBtn) wishlistBtn.addEventListener("click", () => wishlistBtn.classList.toggle("active"));

  /* ---------- Quantity stepper ---------- */
  let qty = 1;
  const qtyValue = document.getElementById("qtyValue");
  document.getElementById("qtyPlus").addEventListener("click", () => { qty++; qtyValue.textContent = qty; });
  document.getElementById("qtyMinus").addEventListener("click", () => { if (qty > 1) { qty--; qtyValue.textContent = qty; } });

  /* ---------- Add to cart / Buy now ---------- */
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    if (window.BINZOOAddToCart) window.BINZOOAddToCart(product.id, qty);
  });
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      if (window.BINZOOAddToCart) window.BINZOOAddToCart(product.id, qty);
      document.getElementById("cartToggle")?.click();
    });
  }

  /* ---------- Accordions ---------- */
  root.querySelectorAll(".acc-item").forEach(item => {
    item.querySelector(".acc-head").addEventListener("click", () => item.classList.toggle("open"));
  });

  /* ---------- Related products ---------- */
  const relatedGrid = document.getElementById("relatedGrid");
  if (relatedGrid) {
    const sameCollection = (PRODUCTS[product.collection] || []).filter(p => p.id !== product.id);
    const pool = sameCollection.length >= 4 ? sameCollection : ALL_PRODUCTS.filter(p => p.id !== product.id);
    const related = pool.sort(() => 0.5 - Math.random()).slice(0, 5);
    relatedGrid.innerHTML = related.map(window.BINZOOCardHTML).join("");
  }
})();
