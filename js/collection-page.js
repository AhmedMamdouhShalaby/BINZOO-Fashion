(function(){
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const collectionKey = params.get("c") || "dresses";
  const items = (PRODUCTS[collectionKey] || PRODUCTS["dresses"]).slice();
  const label = COLLECTION_LABELS[collectionKey] || "Collection";

  document.title = `BOSCA — ${label}`;
  document.getElementById("collHeroTitle").textContent = label;
  document.getElementById("collHeroImg").src = items[0] ? items[0].img : "";
  document.getElementById("collHeroImg").alt = label;
  document.getElementById("fabricLabel").textContent = items[0] ? items[0].fabric : "—";

  const inStock = items.filter(p => !p.soldOut).length;
  const outStock = items.length - inStock;
  document.getElementById("countInStock").textContent = inStock;
  document.getElementById("countOutStock").textContent = outStock;
  document.getElementById("countAll").textContent = items.length;
  document.getElementById("productCount").textContent = `${items.length} products`;

  const grid = document.getElementById("collectionGrid");

  function render(list){
    grid.innerHTML = list.map(window.BoscaCardHTML).join("");
  }
  render(items);

  document.getElementById("sortSelect").addEventListener("change", (e) => {
    const v = e.target.value;
    const sorted = items.slice();
    if (v === "price-asc") sorted.sort((a,b) => a.price - b.price);
    else if (v === "price-desc") sorted.sort((a,b) => b.price - a.price);
    else if (v === "az") sorted.sort((a,b) => a.name.localeCompare(b.name));
    else if (v === "za") sorted.sort((a,b) => b.name.localeCompare(a.name));
    render(sorted);
  });

  document.querySelectorAll(".filter-row").forEach(row => {
    row.addEventListener("click", () => {
      if (row.textContent.includes("In stock")) render(items.filter(p => !p.soldOut));
      else if (row.textContent.includes("Out of stock")) render(items.filter(p => p.soldOut));
      else render(items);
    });
  });
})();
