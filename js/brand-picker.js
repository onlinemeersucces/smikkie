/* ============================================================
   BRAND PRODUCT DETAIL PAGE — brand-picker.js
   Flavor picker with +/−, quick-add (3/6/9/doos), staffel, cart
   ============================================================ */

'use strict';

/* ---- TIERS (same as mix-box) ---- */
const BP_TIERS = [
  { min: 1,  max: 11,  pct: 0,  label: 'Normaal tarief' },
  { min: 12, max: 23,  pct: 5,  label: '5% korting' },
  { min: 24, max: 35,  pct: 10, label: '10% korting' },
  { min: 36, max: 47,  pct: 15, label: '15% korting' },
  { min: 48, max: Infinity, pct: 20, label: '20% korting' }
];

const BP_QUICK_OPTS = [
  { qty: 3,  label: '3',  discount: '1.25%' },
  { qty: 6,  label: '6',  discount: '2.5%' },
  { qty: 9,  label: '9',  discount: '3.75%' },
  { qty: 12, label: '12', discount: '5%' },
  { qty: 24, label: '24', discount: '10%' },
  { qty: 36, label: '36', discount: '15%' },
  { qty: 48, label: '48', discount: '20%' }
];

/* ---- STATE ---- */
const bpState = {
  qtys: {},        // { flavorId: qty }
  featuredId: null,
  flavors: []
};

/* ---- HELPERS ---- */
function bpFmt(n) { return '€' + n.toFixed(2).replace('.', ','); }

function bpTotalQty() {
  return Object.values(bpState.qtys).reduce((s, q) => s + q, 0);
}

function bpCurrentTier(qty) {
  return BP_TIERS.find(t => qty >= t.min && qty <= t.max) || BP_TIERS[0];
}

function bpCalcTotal() {
  const gross = bpState.flavors.reduce((s, f) => s + (bpState.qtys[f.id] || 0) * f.price, 0);
  const tier = bpCurrentTier(bpTotalQty());
  const discount = gross * (tier.pct / 100);
  return { gross, discount, net: gross - discount, pct: tier.pct };
}

/* ---- RENDER FLAVOR LIST ---- */
function bpRenderFlavorList() {
  const list = document.getElementById('bp-flavor-list');
  if (!list) return;

  const sorted = [...bpState.flavors].sort((a, b) => {
    if (a.id === bpState.featuredId) return -1;
    if (b.id === bpState.featuredId) return 1;
    return 0;
  });

  list.innerHTML = sorted.map(f => {
    const qty = bpState.qtys[f.id] || 0;
    const isFeatured = f.id === bpState.featuredId;

    const quickBtns = BP_QUICK_OPTS.map(opt => `
      <button class="pdp-quick-btn ${qty === opt.qty ? 'is-active' : ''}"
              data-flavor="${f.id}" data-qty="${opt.qty}">
        <span>${opt.label}</span>
        <span class="pdp-quick-btn__discount">${opt.discount}</span>
      </button>
    `).join('');

    return `
      <div class="pdp-flavor-row ${isFeatured ? 'is-featured' : ''}" data-flavor="${f.id}">
        <img src="${f.img}" alt="${f.name}" class="pdp-flavor-row__img" loading="lazy"
             onerror="this.src='../images/barebells.jpg'">
        <div class="pdp-flavor-row__info">
          ${isFeatured ? '<span class="pdp-flavor-row__featured-badge">Jouw keuze</span>' : ''}
          <div class="pdp-flavor-row__name">${f.name}</div>
          <div class="pdp-flavor-row__macros">
            <span>${f.macros.eiwit} eiwit</span>
            <span>${f.macros.suiker} suiker</span>
            <span>${f.macros.kcal} kcal</span>
          </div>
          <div class="pdp-flavor-row__price">${bpFmt(f.price)} per reep</div>
        </div>
        <div class="pdp-flavor-row__controls">
          <div class="pdp-qty-ctrl">
            <button class="pdp-qty-btn pdp-qty-btn--minus" data-flavor="${f.id}" aria-label="Minder">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span class="pdp-qty-val">${qty}</span>
            <button class="pdp-qty-btn pdp-qty-btn--plus" data-flavor="${f.id}" aria-label="Meer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <div class="pdp-quick-btns">${quickBtns}</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ---- RENDER DOZEN LIST ---- */
function bpRenderDozenList() {
  const list = document.getElementById('bp-dozen-list');
  if (!list) return;

  list.innerHTML = bpState.flavors.map(f => {
    const dozenOpts = [
      { qty: 12, label: '1 doos (12 stuks)',  pct: 5 },
      { qty: 24, label: '2 dozen (24 stuks)', pct: 10 },
      { qty: 36, label: '3 dozen (36 stuks)', pct: 15 },
      { qty: 48, label: '4 dozen (48 stuks)', pct: 20 }
    ];

    const optHtml = dozenOpts.map(o => {
      const price = f.price * o.qty * (1 - o.pct / 100);
      return `
        <div class="pdp-dozen-option" data-flavor="${f.id}" data-qty="${o.qty}">
          <span class="pdp-dozen-option__label">${o.label}</span>
          <span class="pdp-dozen-option__discount">-${o.pct}%</span>
          <span class="pdp-dozen-option__price">${bpFmt(price)}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="pdp-dozen-card">
        <img src="${f.img}" alt="${f.name}" class="pdp-dozen-card__img" loading="lazy"
             onerror="this.src='../images/barebells.jpg'">
        <div class="pdp-dozen-card__name">${f.name}</div>
        <div class="pdp-dozen-card__info">${f.macros.eiwit} eiwit · ${f.macros.suiker} suiker · ${f.macros.kcal} kcal</div>
        <div class="pdp-dozen-options">${optHtml}</div>
        <button class="pdp-dozen-card__add-btn" data-flavor="${f.id}">
          🛒 Toevoegen aan winkelwagen
        </button>
      </div>
    `;
  }).join('');
}

/* ---- UPDATE CART BAR ---- */
function bpUpdateCartBar() {
  const bar = document.getElementById('bp-cart-bar');
  if (!bar) return;

  const totalQty = bpTotalQty();
  const { net, pct } = bpCalcTotal();

  if (totalQty === 0) {
    bar.style.display = 'none';
    return;
  }

  bar.style.display = 'flex';
  const countEl = document.getElementById('bp-cart-count');
  const totalEl = document.getElementById('bp-cart-total');
  const discountEl = document.getElementById('bp-cart-discount');
  if (countEl) countEl.textContent = totalQty + ' stuks';
  if (totalEl) totalEl.textContent = bpFmt(net);
  if (discountEl) discountEl.textContent = pct > 0 ? pct + '% korting!' : '';
}

/* ---- UPDATE STAFFEL BAR ---- */
function bpUpdateStaffelBar() {
  const bar = document.getElementById('bp-staffel-bar');
  if (!bar) return;
  const totalQty = bpTotalQty();
  const items = bar.querySelectorAll('.pdp-staffel-bar__item');
  items.forEach(item => {
    const min = parseInt(item.dataset.min, 10);
    const max = parseInt(item.dataset.max, 10) || Infinity;
    item.classList.toggle('is-active', totalQty >= min && totalQty <= max);
  });
}

/* ---- RENDER ALL ---- */
function bpRenderAll() {
  bpRenderFlavorList();
  bpUpdateCartBar();
  bpUpdateStaffelBar();
}

/* ---- ADD TO CART ---- */
function bpAddToCart() {
  const { pct } = bpCalcTotal();
  let added = 0;
  bpState.flavors.forEach(f => {
    const qty = bpState.qtys[f.id] || 0;
    if (qty > 0 && window.SmikkieShop) {
      window.SmikkieShop.addToCart({
        id: f.id,
        name: f.brandName + ' ' + f.name,
        brand: f.brand,
        price: f.price,
        img: f.img
      }, qty);
      added++;
    }
  });

  if (added > 0) {
    // Open cart sidebar
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
      cartSidebar.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }
}

/* ---- EVENTS ---- */
function bpInitEvents() {
  // Tabs
  document.querySelectorAll('.pdp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pdp-tab').forEach(t => t.classList.remove('is-active'));
      document.querySelectorAll('.pdp-tab-panel').forEach(p => p.style.display = 'none');
      tab.classList.add('is-active');
      const panel = document.getElementById('bp-tab-' + tab.dataset.tab);
      if (panel) panel.style.display = 'block';
    });
  });

  // Flavor list event delegation
  const flavorList = document.getElementById('bp-flavor-list');
  if (flavorList) {
    flavorList.addEventListener('click', e => {
      const minus = e.target.closest('.pdp-qty-btn--minus');
      const plus  = e.target.closest('.pdp-qty-btn--plus');
      const quick = e.target.closest('.pdp-quick-btn');

      if (minus) {
        const id = minus.dataset.flavor;
        bpState.qtys[id] = Math.max(0, (bpState.qtys[id] || 0) - 1);
        bpRenderAll();
      } else if (plus) {
        const id = plus.dataset.flavor;
        bpState.qtys[id] = (bpState.qtys[id] || 0) + 1;
        bpRenderAll();
      } else if (quick) {
        const id  = quick.dataset.flavor;
        const qty = parseInt(quick.dataset.qty, 10);
        bpState.qtys[id] = (bpState.qtys[id] === qty) ? 0 : qty;
        bpRenderAll();
      }
    });
  }

  // Dozen list event delegation
  const dozenList = document.getElementById('bp-dozen-list');
  if (dozenList) {
    dozenList.addEventListener('click', e => {
      const option = e.target.closest('.pdp-dozen-option');
      const addBtn = e.target.closest('.pdp-dozen-card__add-btn');

      if (option) {
        const card = option.closest('.pdp-dozen-card');
        card.querySelectorAll('.pdp-dozen-option').forEach(o => o.classList.remove('is-selected'));
        option.classList.add('is-selected');
      }

      if (addBtn) {
        const card = addBtn.closest('.pdp-dozen-card');
        let sel = card.querySelector('.pdp-dozen-option.is-selected');
        if (!sel) {
          sel = card.querySelector('.pdp-dozen-option');
          if (sel) sel.classList.add('is-selected');
        }
        if (sel) {
          const flavorId = sel.dataset.flavor;
          const qty = parseInt(sel.dataset.qty, 10);
          bpState.qtys[flavorId] = (bpState.qtys[flavorId] || 0) + qty;
          bpRenderAll();
          bpAddToCart();
        }
      }
    });
  }

  // Cart bar add button
  const cartBarBtn = document.getElementById('bp-cart-bar-btn');
  if (cartBarBtn) {
    cartBarBtn.addEventListener('click', bpAddToCart);
  }

  // Hero thumbs
  const heroThumbs = document.getElementById('bp-hero-thumbs');
  if (heroThumbs) {
    heroThumbs.addEventListener('click', e => {
      const thumb = e.target.closest('.pdp-hero__thumb');
      if (!thumb) return;
      const flavorId = thumb.dataset.flavor;
      const flavor = bpState.flavors.find(f => f.id === flavorId);
      if (flavor) {
        const heroImg = document.getElementById('bp-hero-img');
        if (heroImg) heroImg.src = flavor.img;
        const heroTitle = document.getElementById('bp-hero-flavor');
        if (heroTitle) heroTitle.textContent = flavor.name;
        heroThumbs.querySelectorAll('.pdp-hero__thumb').forEach(t =>
          t.classList.toggle('is-active', t.dataset.flavor === flavorId)
        );
      }
    });
  }
}

/* ---- INIT ---- */
window.BrandPicker = {
  init(flavors, options = {}) {
    bpState.flavors = flavors.map(f => ({
      ...f,
      brandName: options.brandName || '',
      brand: options.brand || ''
    }));

    // Read URL param ?smaak=flavor-id
    const params = new URLSearchParams(window.location.search);
    const smakParam = params.get('smaak');
    if (smakParam) {
      const found = bpState.flavors.find(f => f.id === smakParam);
      if (found) bpState.featuredId = found.id;
    }
    if (!bpState.featuredId && bpState.flavors.length > 0) {
      bpState.featuredId = bpState.flavors[0].id;
    }

    // Render hero thumbs
    const heroThumbs = document.getElementById('bp-hero-thumbs');
    if (heroThumbs) {
      heroThumbs.innerHTML = bpState.flavors.map(f => `
        <button class="pdp-hero__thumb ${f.id === bpState.featuredId ? 'is-active' : ''}"
                data-flavor="${f.id}" title="${f.name}">
          <img src="${f.img}" alt="${f.name}" onerror="this.src='../images/barebells.jpg'">
        </button>
      `).join('');
    }

    // Set featured hero image
    const featured = bpState.flavors.find(f => f.id === bpState.featuredId);
    if (featured) {
      const heroImg = document.getElementById('bp-hero-img');
      if (heroImg) heroImg.src = featured.img;
      const heroFlavor = document.getElementById('bp-hero-flavor');
      if (heroFlavor) heroFlavor.textContent = featured.name;
    }

    bpRenderFlavorList();
    bpRenderDozenList();
    bpUpdateCartBar();
    bpInitEvents();
  }
};
