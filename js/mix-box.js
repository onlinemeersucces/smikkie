/* =============================================
   SMIKKIE — MIX-BOX PAGE LOGIC
   Pick-and-mix, volume upsell, cart drawer
   ============================================= */

(function () {
  'use strict';

  /* ---- CONFIG ---- */
  // Per-pagina overschrijfbaar via window.MIX_CONFIG (zie bijv. eiwitrepen.html)
  const _cfg = window.MIX_CONFIG || {};
  const FREE_SHIPPING_THRESHOLD = 40.00;
  const BOX_SIZES = _cfg.boxSizes || [12, 24, 36, 48];
  const DISCOUNT_TIERS = _cfg.discountTiers || [
    { minQty: 48, discount: 0.20, label: '20% korting' },
    { minQty: 36, discount: 0.15, label: '15% korting' },
    { minQty: 24, discount: 0.10, label: '10% korting' },
    { minQty: 12, discount: 0.05, label: '5% korting' },
    { minQty: 0,  discount: 0,    label: null }
  ];
  // Initiële doosgrootte (eerste BOX_SIZES waarde)
  const INITIAL_BOX_SIZE = BOX_SIZES[0] || 12;

  /* ---- STATE ---- */
  let state = {
    items: {},       // { id: { name, price, qty, img, brand } }
    boxSize: INITIAL_BOX_SIZE, // current target box size
    cartItems: [],   // items added to cart (for drawer)
    cartTotal: 0
  };

  /* ---- HELPERS ---- */
  function fmt(n) {
    return '€' + n.toFixed(2).replace('.', ',');
  }

  function getTotalQty() {
    return Object.values(state.items).reduce((s, i) => s + i.qty, 0);
  }

  function getSubtotal() {
    return Object.values(state.items).reduce((s, i) => s + i.qty * i.price, 0);
  }

  function getDiscount(qty) {
    for (const tier of DISCOUNT_TIERS) {
      if (qty >= tier.minQty) return tier;
    }
    return DISCOUNT_TIERS[DISCOUNT_TIERS.length - 1];
  }

  /* ---- RENDER FUNCTIONS ---- */

  function renderAll() {
    const totalQty = getTotalQty();
    const subtotal = getSubtotal();
    const tier = getDiscount(totalQty);
    const discountAmt = subtotal * tier.discount;
    const finalTotal = subtotal - discountAmt;

    updateHeroCounter(totalQty);
    updateBoxPreview();
    updatePickerProgress(totalQty);
    updateSummary(totalQty, subtotal, tier, discountAmt, finalTotal);
    updateUpsellNudge(totalQty);
    updateVolumeSteps(totalQty);
    updateDiscountTierUI(totalQty);
    updateAddToCartBtn(totalQty);
    // Refresh quick-qty active states for all cards
    Object.keys(state.items).forEach(id => renderQuickQtyButtons(id));
  }

  function updateHeroCounter(totalQty) {
    const el = document.getElementById('hero-count');
    const maxEl = document.getElementById('hero-max');
    if (el) el.textContent = totalQty;
    if (maxEl) maxEl.textContent = state.boxSize;
  }

  function updateBoxPreview() {
    const container = document.getElementById('preview-items');
    if (!container) return;
    const items = Object.values(state.items).filter(i => i.qty > 0);
    if (!items.length) {
      container.innerHTML = '<span class="box-preview__empty-text">Voeg smaken toe →</span>';
      return;
    }
    let html = '';
    items.forEach(item => {
      for (let i = 0; i < Math.min(item.qty, 3); i++) {
        html += `<img src="${item.img}" alt="${item.name}" class="box-preview__dot" onerror="this.style.display='none'">`;
      }
    });
    container.innerHTML = html;
  }

  function updatePickerProgress(totalQty) {
    const fill = document.getElementById('picker-fill');
    const countEl = document.getElementById('picker-count');
    const maxEl = document.getElementById('picker-max');
    if (fill) fill.style.width = Math.min(100, (totalQty / state.boxSize) * 100) + '%';
    if (countEl) countEl.textContent = totalQty;
    if (maxEl) maxEl.textContent = state.boxSize;
  }

  function updateSummary(totalQty, subtotal, tier, discountAmt, finalTotal) {
    const countEl = document.getElementById('summary-count');
    const itemsEl = document.getElementById('summary-items');
    const emptyEl = document.getElementById('summary-empty');
    const pricingEl = document.getElementById('summary-pricing');
    const origRow = document.getElementById('sum-original-row');
    const origEl = document.getElementById('sum-original');
    const discRow = document.getElementById('sum-discount-row');
    const discLabel = document.getElementById('sum-discount-label');
    const discAmt = document.getElementById('sum-discount-amount');
    const totalEl = document.getElementById('sum-total');

    if (countEl) countEl.textContent = totalQty + ' stuks';

    const items = Object.values(state.items).filter(i => i.qty > 0);

    if (emptyEl) emptyEl.style.display = items.length ? 'none' : 'block';
    if (pricingEl) pricingEl.style.display = items.length ? 'block' : 'none';

    // Render item list with rich card layout
    if (itemsEl) {
      let html = '';
      items.forEach(item => {
        // Per-item nudge: next step in 3/6/9/12
        const nudgeSteps = [3, 6, 9, 12, 24, 36, 48];
        const nextStep = nudgeSteps.find(s => s > item.qty);
        let nudgeHtml = '';
        if (nextStep && nextStep <= 48) {
          const add = nextStep - item.qty;
          const discPct = nextStep >= 48 ? 20 : nextStep >= 36 ? 15 : nextStep >= 24 ? 10 : nextStep >= 12 ? 5 : nextStep >= 9 ? 3.75 : nextStep >= 6 ? 2.5 : 1.25;
          nudgeHtml = `<div class="summary-item__nudge">
            <span>+${add} stuks → ${nextStep}x voor ${discPct}% korting</span>
            <button class="summary-item__nudge-btn" data-id="${item.id}" data-qty="${nextStep}">+${add}</button>
          </div>`;
        }
        html += `<div class="summary-item">
          <div class="summary-item__row">
            <img src="${item.img}" alt="${item.name}" class="summary-item__img" onerror="this.style.display='none'">
            <div class="summary-item__info">
              <span class="summary-item__brand">${item.brand || ''}</span>
              <span class="summary-item__name">${item.name}</span>
              <span class="summary-item__unit">${item.qty}× ${fmt(item.price)}</span>
            </div>
            <span class="summary-item__price">${fmt(item.qty * item.price)}</span>
            <div class="summary-item__qty-ctrl">
              <button class="summary-qty-btn" data-id="${item.id}" data-action="dec">−</button>
              <span class="summary-qty-val">${item.qty}</span>
              <button class="summary-qty-btn" data-id="${item.id}" data-action="inc">+</button>
            </div>
          </div>
          ${nudgeHtml}
        </div>`;
      });
      itemsEl.innerHTML = html;
      // Events handled via delegation on itemsEl (set up once in initSummaryQtyDelegation)
    }

    // Render upsell flavors (products NOT yet in the mix, max 3)
    const upsellFlavorsWrap = document.getElementById('summary-upsell-flavors');
    const upsellList = document.getElementById('sidebar-upsell-list');
    if (upsellFlavorsWrap && upsellList) {
      const allItems = Object.values(state.items);
      const notInMix = allItems.filter(i => i.qty === 0).slice(0, 3);
      if (notInMix.length > 0 && items.length > 0) {
        upsellFlavorsWrap.style.display = 'block';
        const upsellQtyOpts = [3, 6, 9, 12];
        let uHtml = '';
        notInMix.forEach(item => {
          const btns = upsellQtyOpts.map(q =>
            `<button class="sidebar-upsell-btn" data-id="${item.id}" data-qty="${q}">${q}×</button>`
          ).join('');
          uHtml += `<div class="sidebar-upsell-item">
            <img src="${item.img}" alt="${item.name}" class="sidebar-upsell-item__img" onerror="this.style.display='none'">
            <div class="sidebar-upsell-item__info">
              <span class="sidebar-upsell-item__name">${item.name}</span>
              <span class="sidebar-upsell-item__price">${fmt(item.price)} / stuk</span>
            </div>
            <div class="sidebar-upsell-item__btns">${btns}</div>
          </div>`;
        });
        upsellList.innerHTML = uHtml;
      } else {
        upsellFlavorsWrap.style.display = 'none';
      }
    }

    // Update sidebar progress bar
    const sidebarFill = document.getElementById('sidebar-fill');
    const sidebarCount = document.getElementById('sidebar-count');
    const sidebarMax = document.getElementById('sidebar-max');
    if (sidebarFill) sidebarFill.style.width = Math.min(100, (totalQty / state.boxSize) * 100) + '%';
    if (sidebarCount) sidebarCount.textContent = totalQty;
    if (sidebarMax) sidebarMax.textContent = state.boxSize;

    // Pricing
    if (tier.discount > 0) {
      if (origRow) origRow.style.display = 'flex';
      if (origEl) origEl.textContent = fmt(subtotal);
      if (discRow) discRow.style.display = 'flex';
      if (discLabel) discLabel.textContent = `Volumekorting (${Math.round(tier.discount * 100)}%)`;
      if (discAmt) discAmt.textContent = '-' + fmt(discountAmt);
    } else {
      if (origRow) origRow.style.display = 'none';
      if (discRow) discRow.style.display = 'none';
    }
    if (totalEl) totalEl.textContent = fmt(finalTotal);

    // Upsell button
    const upsellWrap = document.getElementById('summary-upsell');
    const upsellBtn = document.getElementById('upsell-btn-text');
    if (upsellWrap && upsellBtn) {
      if (totalQty > 0 && totalQty < 48) {
        upsellWrap.style.display = 'block';
        if (totalQty < 12) {
          upsellBtn.textContent = `Naar 12 stuks & bespaar 5%`;
        } else if (totalQty < 24) {
          upsellBtn.textContent = `Verdubbel naar 24 stuks & bespaar 10%`;
        } else if (totalQty < 36) {
          upsellBtn.textContent = `Naar 36 stuks & bespaar 15%`;
        } else {
          upsellBtn.textContent = `Naar 48 stuks & bespaar 20%`;
        }
      } else {
        upsellWrap.style.display = 'none';
      }
    }
  }

  function updateUpsellNudge(totalQty) {
    const nudge = document.getElementById('upsell-nudge');
    const nudgeText = document.getElementById('upsell-nudge-text');
    const nudgeBtn = document.getElementById('upsell-nudge-btn');
    if (!nudge) return;

    const tiersAsc = DISCOUNT_TIERS.filter(t => t.minQty > 0).slice().sort((a,b) => a.minQty - b.minQty);
    const maxQty = tiersAsc[tiersAsc.length - 1] ? tiersAsc[tiersAsc.length - 1].minQty : 48;
    const nextTier = tiersAsc.find(t => totalQty < t.minQty);

    if (totalQty > 0 && nextTier) {
      nudge.style.display = 'flex';
      const needed = nextTier.minQty - totalQty;
      if (nudgeText) nudgeText.textContent = `Nog ${needed} stuk${needed !== 1 ? 's' : ''} voor ${nextTier.label}!`;
      if (nudgeBtn) nudgeBtn.textContent = `Naar ${nextTier.minQty} stuks`;
    } else if (totalQty > 0 && !nextTier) {
      nudge.style.display = 'flex';
      if (nudgeText) nudgeText.textContent = `${Math.round(tiersAsc[tiersAsc.length-1].discount*100)}% korting actief! 🎉`;
      if (nudgeBtn) nudgeBtn.style.display = 'none';
    } else {
      nudge.style.display = 'none';
      if (nudgeBtn) nudgeBtn.style.display = '';
    }
  }

  function updateVolumeSteps(totalQty) {
    const steps = document.querySelectorAll('.volume-step');
    steps.forEach(step => {
      const qty = parseInt(step.dataset.qty);
      step.classList.toggle('is-active', totalQty >= qty && qty > 0);
    });
  }

  function updateDiscountTierUI(totalQty) {
    const segs = [1,2,3,4].map(i => document.getElementById('tier-seg-' + i));
    const fill = document.getElementById('tier-fill');
    const label = document.getElementById('discount-tier-label');

    // Tiers van laag naar hoog (zonder de 0-tier)
    const tiersAsc = DISCOUNT_TIERS.filter(t => t.minQty > 0).slice().sort((a,b) => a.minQty - b.minQty);
    const maxQty = tiersAsc[tiersAsc.length - 1] ? tiersAsc[tiersAsc.length - 1].minQty : 48;
    const fillPct = totalQty === 0 ? 0 : Math.min(100, (totalQty / maxQty) * 100);
    if (fill) fill.style.width = fillPct + '%';

    tiersAsc.forEach((tier, idx) => {
      if (segs[idx]) segs[idx].classList.toggle('is-active', totalQty >= tier.minQty);
    });

    if (label) {
      const nextTier = tiersAsc.find(t => totalQty < t.minQty);
      if (totalQty === 0) {
        label.textContent = 'Voeg smaken toe voor volumekorting!';
      } else if (nextTier) {
        label.textContent = `Nog ${nextTier.minQty - totalQty} stuks voor ${nextTier.label}!`;
      } else {
        label.textContent = `${Math.round(tiersAsc[tiersAsc.length-1].discount*100)}% korting actief! 🎉`;
      }
    }
  }

  function updateAddToCartBtn(totalQty) {
    const btn = document.getElementById('btn-add-to-cart');
    if (!btn) return;
    btn.disabled = totalQty === 0;
  }

  /* ---- FLAVOR CARD QUANTITY CONTROLS ---- */

  // Quick-qty options: [qty, kortingslabel]
  const QUICK_QTY_OPTIONS = [
    { qty: 3,  label: '1,25%' },
    { qty: 6,  label: '2,5%' },
    { qty: 9,  label: '3,75%' }
  ];

  function renderQuickQtyButtons(id) {
    const card = document.querySelector(`.flavor-card[data-id="${id}"]`);
    if (!card) return;
    let wrap = card.querySelector('.flavor-card__quick-qty');
    if (!wrap) return;
    const currentQty = state.items[id] ? state.items[id].qty : 0;
    wrap.querySelectorAll('.quick-qty-btn').forEach(btn => {
      const q = parseInt(btn.dataset.qty);
      btn.classList.toggle('is-active', currentQty === q);
    });
  }

  // Mapping from brand name to product detail page
  const BRAND_PAGES = {
    'Barebells': 'barebells.html',
    'N!CK\'S':   'nicks.html',
    'Quest':     'quest.html',
    'NOCCO':     'nocco.html',
    'Fanta':     'fanta.html',
    'Smikkie':   'smikkie-bars.html'
  };

  function initFlavorCards() {
    // Read all flavor cards and inject quick-qty buttons
    document.querySelectorAll('.flavor-card').forEach(card => {
      const id = card.dataset.id;
      const price = parseFloat(card.dataset.price);
      const name = card.dataset.name;
      const img = card.dataset.img;
      const brand = card.dataset.brand;

      // Initialize state
      if (!state.items[id]) {
        state.items[id] = { id, name, price, qty: 0, img, brand };
      }

      // Make product name clickable to brand product page
      const nameEl = card.querySelector('.flavor-card__name');
      if (nameEl && BRAND_PAGES[brand] && !nameEl.querySelector('a')) {
        const flavorSlug = id; // use data-id as smaak param
        const link = document.createElement('a');
        link.href = BRAND_PAGES[brand] + '?smaak=' + encodeURIComponent(flavorSlug);
        link.textContent = nameEl.textContent;
        link.style.cssText = 'color:inherit;text-decoration:none;font-weight:inherit;';
        link.addEventListener('mouseenter', () => link.style.textDecoration = 'underline');
        link.addEventListener('mouseleave', () => link.style.textDecoration = 'none');
        link.addEventListener('click', e => e.stopPropagation()); // don't trigger card click
        nameEl.textContent = '';
        nameEl.appendChild(link);
      }

      // Inject quick-qty row if not already present
      if (!card.querySelector('.flavor-card__quick-qty')) {
        const wrap = document.createElement('div');
        wrap.className = 'flavor-card__quick-qty';
        QUICK_QTY_OPTIONS.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'quick-qty-btn';
          btn.dataset.id = id;
          btn.dataset.qty = opt.qty;
          btn.innerHTML = `<span class="quick-qty-btn__badge">${opt.label}</span><span class="quick-qty-btn__num">${opt.qty}</span><span class="quick-qty-btn__label">stuks</span>`;
          wrap.appendChild(btn);
        });
        card.appendChild(wrap);
      }
    });

    // Plus buttons
    document.querySelectorAll('.qty-btn--plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (!state.items[id]) return;
        state.items[id].qty++;
        updateQtyDisplay(id);
        renderAll();
        updateFlavorCardState(id);
      });
    });

    // Minus buttons
    document.querySelectorAll('.qty-btn--minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (!state.items[id]) return;
        if (state.items[id].qty > 0) {
          state.items[id].qty--;
          updateQtyDisplay(id);
          renderAll();
          updateFlavorCardState(id);
        }
      });
    });

    // Quick-qty buttons via delegation on the flavor grid
    const grid = document.getElementById('flavor-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-qty-btn');
        if (!btn) return;
        const id = btn.dataset.id;
        const qty = parseInt(btn.dataset.qty);
        if (!state.items[id]) return;
        // Toggle: click same qty again to deselect (go back to 0)
        if (state.items[id].qty === qty) {
          state.items[id].qty = 0;
        } else {
          state.items[id].qty = qty;
        }
        updateQtyDisplay(id);
        renderAll();
        updateFlavorCardState(id);
        renderQuickQtyButtons(id);
      });
    }
  }

  function updateQtyDisplay(id) {
    const el = document.getElementById('qty-' + id);
    if (el) el.textContent = state.items[id].qty;
  }

  function updateFlavorCardState(id) {
    const card = document.querySelector(`.flavor-card[data-id="${id}"]`);
    if (card) {
      card.classList.toggle('has-qty', state.items[id].qty > 0);
    }
  }

  /* ---- BOX SIZE SELECTOR ---- */

  function initBoxSizes() {
    document.querySelectorAll('.box-size').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.box-size').forEach(b => b.classList.remove('box-size--active'));
        btn.classList.add('box-size--active');
        state.boxSize = parseInt(btn.dataset.size);
        renderAll();
      });
    });
  }

  /* ---- TAB SWITCHING ---- */

  function initTabs() {
    document.querySelectorAll('.mix-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.mix-tab').forEach(t => t.classList.remove('mix-tab--active'));
        tab.classList.add('mix-tab--active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.mix-tab-content').forEach(c => c.style.display = 'none');
        const content = document.getElementById('tab-' + target);
        if (content) content.style.display = 'block';
      });
    });
  }

  /* ---- FLAVOR FILTERS ---- */

  function initFlavorFilters() {
    document.querySelectorAll('.flavor-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.flavor-filter').forEach(b => b.classList.remove('flavor-filter--active'));
        btn.classList.add('flavor-filter--active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.flavor-card').forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- BUNDLE SELECTOR (complete dozen) ---- */

  function initBundleSelectors() {
    document.querySelectorAll('.bundle-selector').forEach(selector => {
      selector.querySelectorAll('.bundle-option').forEach(option => {
        option.addEventListener('click', () => {
          selector.querySelectorAll('.bundle-option').forEach(o => o.classList.remove('bundle-option--active'));
          option.classList.add('bundle-option--active');
        });
      });
    });

    document.querySelectorAll('.btn-add-dozen').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.product;
        const selector = document.querySelector(`.bundle-selector[data-product="${productId}"]`);
        if (!selector) return;
        const activeOption = selector.querySelector('.bundle-option--active');
        if (!activeOption) return;

        const qty = parseInt(activeOption.dataset.qty);
        const unitPrice = parseFloat(selector.dataset.unitPrice);
        const boxSize = parseInt(selector.dataset.boxSize);
        const totalItems = qty * boxSize;
        const priceEl = activeOption.querySelector('.bundle-option__price');
        const priceText = priceEl ? priceEl.textContent : '';
        const priceMatch = priceText.match(/[\d,]+/);
        const totalPrice = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : unitPrice * totalItems;

        // Add to cart drawer
        const header = btn.closest('.dozen-product').querySelector('.dozen-product__header');
        const name = header ? header.querySelector('.dozen-product__name').textContent : productId;
        const img = header ? header.querySelector('img').src : '';

        addToCartDrawer({
          id: productId + '-' + qty,
          name: `${name} (${qty} doos${qty > 1 ? 'en' : ''})`,
          price: totalPrice,
          qty: 1,
          img: img,
          unitLabel: `${totalItems} stuks`
        });

        // Animate button
        const origText = btn.innerHTML;
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Toegevoegd!';
        btn.style.background = 'var(--green)';
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.background = '';
        }, 2000);
      });
    });
  }

  /* ---- ADD TO CART (mix) ---- */

  function initAddToCart() {
    const btn = document.getElementById('btn-add-to-cart');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const totalQty = getTotalQty();
      if (totalQty === 0) return;

      // Add each product individually to the cart drawer
      const items = Object.values(state.items).filter(i => i.qty > 0);
      items.forEach(item => {
        addToCartDrawer({
          id: item.id,
          name: item.name,
          brand: item.brand || '',
          unitPrice: item.price,
          qty: item.qty,
          img: item.img
        });
      });

      // Animate button
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Toegevoegd!';
      btn.style.background = 'var(--green)';
      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
      }, 2500);
    });
  }

  /* ---- UPSELL DOUBLE BUTTON ---- */

  function initUpsellButton() {
    const btn = document.getElementById('btn-double');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const totalQty = getTotalQty();
      const targetQty = totalQty < 24 ? 24 : 48;
      const toAdd = targetQty - totalQty;
      if (toAdd <= 0) return;

      // Double each item's qty (simple and correct)
      const items = Object.values(state.items).filter(i => i.qty > 0);
      if (!items.length) return;

      Object.keys(state.items).forEach(key => {
        if (state.items[key].qty > 0) {
          state.items[key].qty *= 2;
        }
      });

      // Update all qty displays
      Object.keys(state.items).forEach(key => {
        updateQtyDisplay(key);
        updateFlavorCardState(key);
      });

      // Update box size
      const newTotal = getTotalQty();
      if (newTotal >= 48) {
        state.boxSize = 48;
        document.querySelectorAll('.box-size').forEach(b => b.classList.remove('box-size--active'));
        const btn48 = document.querySelector('.box-size[data-size="48"]');
        if (btn48) btn48.classList.add('box-size--active');
      } else if (newTotal >= 24) {
        state.boxSize = 24;
        document.querySelectorAll('.box-size').forEach(b => b.classList.remove('box-size--active'));
        const btn24 = document.querySelector('.box-size[data-size="24"]');
        if (btn24) btn24.classList.add('box-size--active');
      }

      renderAll();
    });

    // Nudge button
    const nudgeBtn = document.getElementById('upsell-nudge-btn');
    if (nudgeBtn) {
      nudgeBtn.addEventListener('click', () => {
        btn.click();
      });
    }
  }

  /* ---- CART DRAWER ---- */

  function addToCartDrawer(item) {
    // item: { id, name, brand, unitPrice, qty, img }
    const existing = state.cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.qty += item.qty;
    } else {
      state.cartItems.push({
        id: item.id,
        name: item.name,
        brand: item.brand || '',
        unitPrice: item.unitPrice || item.price,
        qty: item.qty,
        img: item.img || ''
      });
    }
    renderCartDrawer();
    openCartDrawer();
  }

  function getCartTotalQty() {
    return state.cartItems.reduce((s, i) => s + i.qty, 0);
  }

  function getCartSubtotal() {
    return state.cartItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  }

  function renderCartDrawer() {
    const itemsEl = document.getElementById('drawer-items');
    const emptyEl = document.getElementById('drawer-empty');
    const countEl = document.getElementById('drawer-count');
    const totalEl = document.getElementById('drawer-total');
    const origRow = document.getElementById('drawer-original-row');
    const origPrice = document.getElementById('drawer-original-price');
    const discRow = document.getElementById('drawer-discount-row');
    const discLabel = document.getElementById('drawer-discount-label');
    const discAmt = document.getElementById('drawer-discount-amount');
    const discountEl = document.getElementById('drawer-discount');
    const discountText = document.getElementById('drawer-discount-text');

    if (!itemsEl) return;

    const totalQty = getCartTotalQty();
    const subtotal = getCartSubtotal();
    const tier = getDiscount(totalQty);
    const discountAmt = subtotal * tier.discount;
    const finalTotal = subtotal - discountAmt;

    if (countEl) countEl.textContent = totalQty;
    if (totalEl) totalEl.textContent = fmt(finalTotal);

    // Shipping progress
    updateShippingProgress(finalTotal);

    // Tier progress bar in drawer
    updateDrawerTierBar(totalQty, tier);

    // Discount rows
    if (tier.discount > 0) {
      if (origRow) origRow.style.display = 'flex';
      if (origPrice) origPrice.textContent = fmt(subtotal);
      if (discRow) discRow.style.display = 'flex';
      if (discLabel) discLabel.textContent = `Korting (${Math.round(tier.discount * 100)}%)`;
      if (discAmt) discAmt.textContent = '- ' + fmt(discountAmt);
      if (discountEl) discountEl.style.display = 'flex';
      if (discountText) discountText.textContent = `Je hebt ${tier.label}!`;
    } else {
      if (origRow) origRow.style.display = 'none';
      if (discRow) discRow.style.display = 'none';
      if (discountEl) discountEl.style.display = 'none';
    }

    if (!state.cartItems.length) {
      if (emptyEl) emptyEl.style.display = 'flex';
      itemsEl.innerHTML = emptyEl ? emptyEl.outerHTML : '<div class="cart-drawer__empty"><div class="cart-drawer__empty-icon">🛒</div><p>Je mix is nog leeg.<br>Voeg hieronder smaken toe!</p></div>';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    const QUICK_QTYS = [
      { qty: 3,  label: '3',       sub: '1,25% korting' },
      { qty: 6,  label: '6',       sub: '2,5% korting' },
      { qty: 9,  label: '9',       sub: '3,75% korting' },
      { qty: 12, label: '1 doos',  sub: '5% korting' },
      { qty: 24, label: '2 dozen', sub: '10% korting' },
      { qty: 36, label: '3 dozen', sub: '15% korting' },
      { qty: 48, label: '4 dozen', sub: '20% korting' }
    ];

    let html = '';
    state.cartItems.forEach(item => {
      const lineTotal = item.unitPrice * item.qty;
      const quickBtns = QUICK_QTYS.map(q => {
        const isActive = item.qty === q.qty ? ' is-active' : '';
        return `<button class="drawer-quick-btn${isActive}" data-id="${item.id}" data-qty="${q.qty}">${q.label}<span>${q.sub}</span></button>`;
      }).join('');

      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__top">
            <div class="cart-item__img">
              <img src="${item.img}" alt="${item.name}" onerror="this.parentElement.style.background='#ede9ff'">
            </div>
            <div class="cart-item__info">
              <span class="cart-item__brand">${item.brand}</span>
              <span class="cart-item__name">${item.name}</span>
              <span class="cart-item__unit">${item.qty}× ${fmt(item.unitPrice)}</span>
              <span class="cart-item__price">${fmt(lineTotal)}</span>
            </div>
            <div class="cart-item__actions">
              <button class="cart-item__remove" data-remove="${item.id}" aria-label="Verwijderen">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <div class="cart-item__qty-ctrl">
                <button class="cart-item__qty-btn" data-id="${item.id}" data-action="dec">−</button>
                <span class="cart-item__qty-val">${item.qty}</span>
                <button class="cart-item__qty-btn" data-id="${item.id}" data-action="inc">+</button>
              </div>
            </div>
          </div>
          <div class="cart-item__quick-row">${quickBtns}</div>
        </div>
      `;
    });
    itemsEl.innerHTML = html;

    // Event delegation via one listener on itemsEl
    itemsEl.addEventListener('click', handleDrawerItemClick, { once: true });
  }

  function handleDrawerItemClick(e) {
    // Re-attach for next render
    const itemsEl = document.getElementById('drawer-items');

    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      const id = removeBtn.dataset.remove;
      state.cartItems = state.cartItems.filter(i => i.id !== id);
      renderCartDrawer();
      return;
    }

    const qtyBtn = e.target.closest('.cart-item__qty-btn');
    if (qtyBtn) {
      const id = qtyBtn.dataset.id;
      const action = qtyBtn.dataset.action;
      const item = state.cartItems.find(i => i.id === id);
      if (!item) return;
      if (action === 'inc') item.qty++;
      else if (action === 'dec' && item.qty > 1) item.qty--;
      else if (action === 'dec' && item.qty === 1) {
        state.cartItems = state.cartItems.filter(i => i.id !== id);
      }
      renderCartDrawer();
      return;
    }

    const quickBtn = e.target.closest('.drawer-quick-btn');
    if (quickBtn) {
      const id = quickBtn.dataset.id;
      const qty = parseInt(quickBtn.dataset.qty);
      const item = state.cartItems.find(i => i.id === id);
      if (!item) return;
      item.qty = qty;
      renderCartDrawer();
      return;
    }
  }

  function updateDrawerTierBar(totalQty, tier) {
    const barEl = document.getElementById('drawer-tier-bar');
    if (!barEl) return;

    const tiers = [
      { minQty: 12, label: '5%',  qty: 12 },
      { minQty: 24, label: '10%', qty: 24 },
      { minQty: 36, label: '15%', qty: 36 },
      { minQty: 48, label: '20%', qty: 48 }
    ];

    // Find next tier
    const nextTier = tiers.find(t => totalQty < t.minQty);
    const pct = nextTier ? Math.min(100, (totalQty / nextTier.minQty) * 100) : 100;

    const nudgeText = nextTier
      ? `Nog <strong>${nextTier.minQty - totalQty} stuks</strong> voor ${nextTier.label} korting!`
      : `<strong>🎉 Maximale korting (20%) bereikt!</strong>`;

    barEl.innerHTML = `
      <div class="drawer-tier-bar__labels">
        ${tiers.map(t => `<span class="drawer-tier-bar__label${totalQty >= t.minQty ? ' is-reached' : ''}">${t.label}</span>`).join('')}
      </div>
      <div class="drawer-tier-bar__track">
        <div class="drawer-tier-bar__fill" style="width:${pct}%"></div>
      </div>
      <div class="drawer-tier-bar__nudge">${nudgeText}</div>
    `;
  }

  function updateShippingProgress(subtotal) {
    const fill = document.getElementById('shipping-fill');
    const label = document.getElementById('shipping-label');
    const amountEl = document.getElementById('shipping-amount');

    if (!fill) return;
    const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
    fill.style.width = pct + '%';

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      if (label) label.innerHTML = '<strong>🎉 Gratis verzending!</strong> Je hebt het gehaald.';
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      if (amountEl) amountEl.textContent = fmt(remaining);
      if (label) label.innerHTML = `Nog <strong id="shipping-amount">${fmt(remaining)}</strong> tot gratis verzending 🚚`;
    }
  }

  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  function initCartDrawer() {
    const closeBtn = document.getElementById('cart-close');
    const backdrop = document.getElementById('cart-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (backdrop) backdrop.addEventListener('click', closeCartDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); });
  }

  /* ---- VOLUME STEP CLICK ---- */

  function initVolumeStepClicks() {
    document.querySelectorAll('.volume-step').forEach(step => {
      step.addEventListener('click', () => {
        const targetQty = parseInt(step.dataset.qty);
        state.boxSize = targetQty;
        document.querySelectorAll('.box-size').forEach(b => b.classList.remove('box-size--active'));
        const matchingSize = document.querySelector(`.box-size[data-size="${targetQty}"]`);
        if (matchingSize) matchingSize.classList.add('box-size--active');
        renderAll();
        // Scroll to picker
        const picker = document.querySelector('.mix-builder');
        if (picker) picker.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---- INIT ---- */

  /* ---- SIDEBAR QTY DELEGATION (survives innerHTML re-renders) ---- */
  function initSummaryQtyDelegation() {
    // Delegation on summary-items: +/- buttons and per-item nudge buttons
    const itemsEl = document.getElementById('summary-items');
    if (itemsEl) {
      itemsEl.addEventListener('click', (e) => {
        // +/- qty buttons
        const qtyBtn = e.target.closest('.summary-qty-btn');
        if (qtyBtn) {
          e.stopPropagation();
          const id = qtyBtn.dataset.id;
          const action = qtyBtn.dataset.action;
          if (!state.items[id]) return;
          if (action === 'inc') {
            state.items[id].qty++;
          } else if (action === 'dec' && state.items[id].qty > 0) {
            state.items[id].qty--;
          }
          updateQtyDisplay(id);
          updateFlavorCardState(id);
          renderAll();
          return;
        }
        // Per-item nudge button
        const nudgeBtn = e.target.closest('.summary-item__nudge-btn');
        if (nudgeBtn) {
          e.stopPropagation();
          const id = nudgeBtn.dataset.id;
          const qty = parseInt(nudgeBtn.dataset.qty);
          if (!state.items[id]) return;
          state.items[id].qty = qty;
          updateQtyDisplay(id);
          updateFlavorCardState(id);
          renderAll();
          renderQuickQtyButtons(id);
        }
      });
    }

    // Delegation on sidebar upsell flavors list
    const upsellList = document.getElementById('sidebar-upsell-list');
    if (upsellList) {
      upsellList.addEventListener('click', (e) => {
        const btn = e.target.closest('.sidebar-upsell-btn');
        if (!btn) return;
        e.stopPropagation();
        const id = btn.dataset.id;
        const qty = parseInt(btn.dataset.qty);
        if (!state.items[id]) return;
        state.items[id].qty = qty;
        updateQtyDisplay(id);
        updateFlavorCardState(id);
        renderAll();
        renderQuickQtyButtons(id);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFlavorCards();
    initBoxSizes();
    initTabs();
    initFlavorFilters();
    initBundleSelectors();
    initAddToCart();
    initUpsellButton();
    initCartDrawer();
    initVolumeStepClicks();
    initSummaryQtyDelegation();
    renderAll();
  });

})();
