/* ---------- Photo pool (placeholder fashion photography — swap for real BINZOO campaign/product shots) ---------- */
const PHOTO_IDS = [
  8995906, 38244095, 14371053, 32037515, 34685394, 17299345, 8744534, 8640242,
  31861865, 12055314, 31861864, 3427560, 33519724, 4911458, 31049717, 36168986,
  16339418, 8121684, 36204399, 20433552, 35226950, 14253579, 9881081, 34993764,
  34068990, 35150035, 13791297, 29188566, 13838843, 35150037, 34721670, 13838842,
  13791265, 35150034, 34721677, 37368651, 13838837, 35463007, 13862203, 36815507,
  35357622, 33539326, 35263643, 17867946, 33537065, 34251176, 32279501, 35463011
];

function pexels(id, w = 900) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

function pickImages(seed, count) {
  const out = [];
  let i = seed % PHOTO_IDS.length;
  for (let n = 0; n < count; n++) {
    out.push(pexels(PHOTO_IDS[i]));
    i = (i + 7) % PHOTO_IDS.length;
  }
  return out;
}

const fmt = (n) => "LE " + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------- Product data ---------- */
let _seed = 0;
function makeProduct(id, name, price, collection, opts = {}) {
  const imgs = pickImages(_seed, 4);
  _seed += 5;
  return {
    id, name, price, collection,
    compareAt: opts.compareAt || null,
    soldOut: !!opts.soldOut,
    rating: opts.rating || 4.8,
    fabric: opts.fabric || "Premium Blend",
    colors: opts.colors || [name],
    img: imgs[0], img2: imgs[1], img3: imgs[2], img4: imgs[3],
    desc: opts.desc || "A signature BINZOO piece — cut for a confident silhouette in a fluid, considered fabric that moves with you from day into evening.",
    features: opts.features || [
      "Designed in-house, cut for a flattering fit",
      "Fluid, breathable fabric with structured drape",
      "Colour-fast, fade-resistant dye",
      "Dry clean or hand wash cold"
    ]
  };
}

const PRODUCTS = {
  dresses: [
    makeProduct("noir-slip", "Noir Slip Dress", 1450, "dresses", { fabric: "Satin", rating: 4.9 }),
    makeProduct("ivory-wrap", "Ivory Wrap Dress", 1600, "dresses", { fabric: "Crepe" }),
    makeProduct("gold-thread-midi", "Gold Thread Midi", 1850, "dresses", { compareAt: 2200, fabric: "Lurex Knit" }),
    makeProduct("champagne-cowl", "Champagne Cowl Dress", 1750, "dresses", { fabric: "Silk-Touch" }),
    makeProduct("editorial-maxi", "Editorial Maxi", 1950, "dresses", { fabric: "Chiffon" }),
    makeProduct("structured-blazer-dress", "Structured Blazer Dress", 2100, "dresses", { soldOut: true }),
    makeProduct("statement-shoulder", "Statement Shoulder Dress", 1990, "dresses"),
    makeProduct("draped-column", "Draped Column Dress", 1700, "dresses", { soldOut: true })
  ],
  tops: [
    makeProduct("silk-camisole", "Silk Camisole", 650, "tops", { fabric: "Silk-Touch" }),
    makeProduct("gold-button-shirt", "Gold Button Shirt", 890, "tops", { fabric: "Poplin" }),
    makeProduct("draped-blouse", "Draped Blouse", 950, "tops", { compareAt: 1100, fabric: "Crepe" }),
    makeProduct("ribbed-bodysuit", "Ribbed Bodysuit", 700, "tops", { fabric: "Ribbed Knit" }),
    makeProduct("tailored-vest", "Tailored Vest", 820, "tops", { soldOut: true }),
    makeProduct("off-shoulder-top", "Off-Shoulder Top", 780, "tops")
  ],
  bottoms: [
    makeProduct("tailored-trouser", "Tailored Trouser", 1100, "bottoms", { fabric: "Wool Blend" }),
    makeProduct("wide-leg-satin", "Wide Leg Satin Pant", 1250, "bottoms", { fabric: "Satin" }),
    makeProduct("pleated-midi-skirt", "Pleated Midi Skirt", 990, "bottoms", { compareAt: 1200, fabric: "Crepe" }),
    makeProduct("gold-hem-skirt", "Gold Hem Skirt", 1050, "bottoms", { fabric: "Chiffon" }),
    makeProduct("high-rise-denim", "High-Rise Tailored Denim", 1150, "bottoms", { soldOut: true })
  ],
  sets: [
    makeProduct("ivory-two-piece", "Ivory Two-Piece Set", 2200, "sets", { fabric: "Crepe" }),
    makeProduct("gold-trim-co-ord", "Gold Trim Co-ord", 2350, "sets", { compareAt: 2700, fabric: "Satin" }),
    makeProduct("tailored-suit-set", "Tailored Suit Set", 2600, "sets", { fabric: "Wool Blend" }),
    makeProduct("noir-matching-set", "Noir Matching Set", 2100, "sets", { soldOut: true })
  ],
  outerwear: [
    makeProduct("champagne-trench", "Champagne Trench", 2450, "outerwear", { fabric: "Cotton Twill" }),
    makeProduct("structured-blazer", "Structured Blazer", 1950, "outerwear", { fabric: "Wool Blend" }),
    makeProduct("noir-longline-coat", "Noir Longline Coat", 2800, "outerwear", { compareAt: 3200, fabric: "Wool Blend" }),
    makeProduct("gold-button-cape", "Gold Button Cape", 2250, "outerwear", { soldOut: true })
  ],
  accessories: [
    makeProduct("gold-link-belt", "Gold Link Belt", 480, "accessories", { fabric: "Metal" }),
    makeProduct("ivory-silk-scarf", "Ivory Silk Scarf", 390, "accessories", { fabric: "Silk-Touch" }),
    makeProduct("structured-tote", "Structured Tote", 1350, "accessories", { fabric: "Vegan Leather" }),
    makeProduct("statement-earrings", "Statement Gold Earrings", 320, "accessories", { compareAt: 420 })
  ]
};

const ALL_PRODUCTS = Object.values(PRODUCTS).flat();
const COLLECTION_LABELS = {
  dresses: "Dresses",
  tops: "Tops",
  bottoms: "Bottoms",
  sets: "Sets",
  outerwear: "Outerwear",
  accessories: "Accessories"
};
