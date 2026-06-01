/* =============================================
   SMIKKIE — MIX-BOX PAGE LOGIC
   Pick-and-mix, volume upsell, cart drawer
   ============================================= */

(function () {
  'use strict';

  /* ---- CONFIG ---- */
  const FREE_SHIPPING_THRESHOLD = 40.00;
  const BOX_SIZES = [12, 24, 36, 48];
  // Discount tiers: 1-11 = normaal, 12-23 = 5%, 24-35 = 10%, 36-47 = 15%, 48+ = 20%
  const DISCOUNT_TIERS = [
    { minQty: 48, discount: 0.20, label: '20% korting' },
    { minQty: 36, discount: 0.15, label: '15% korting' },
    { minQty: 24, discount: 0.10, label: '10% korting' },
    { minQty: 12, discount: 0.05, label: '5% korting' },
    { minQty: 0,  discount: 0,    label: null }
  ];

  /* ---- STATE ---- */
  let state = {
    items: {},       // { id: { name, price, qty, img, brand } }
    boxSize: 12,     // current target box size
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

    // Render item list with image + qty controls
    if (itemsEl) {
      let html = '';
      items.forEach(item => {
        html += `<div class="summary-item">
          <img src="${item.img}" alt="${item.name}" class="summary-item__img" onerror="this.style.display='none'">
          <div class="summary-item__info">
            <span class="summary-item__name">${item.name}</span>
            <span class="summary-item__price">${fmt(item.qty * item.price)}</span>
          </div>
          <div class="summary-item__qty-ctrl">
            <button class="summary-qty-btn" data-id="${item.id}" data-action="dec">−</button>
            <span class="summary-qty-val">${item.qty}</span>
            <button class="summary-qty-btn" data-id="${item.id}" data-action="inc">+</button>
          </div>
        </div>`;
      });
      itemsEl.innerHTML = html;
      // Attach events to sidebar qty buttons — update state directly to avoid double-firing
      itemsEl.querySelectorAll('.summary-qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const action = btn.dataset.action;
          if (!state.items[id]) return;
          if (action === 'inc') {
            state.items[id].qty++;
          } else if (action === 'dec' && state.items[id].qty > 0) {
            state.items[id].qty--;
          }
          updateQtyDisplay(id);
          updateFlavorCardState(id);
          renderAll();
        });
      });
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

    if (totalQty > 0 && totalQty < 48) {
      nudge.style.display = 'flex';
      if (totalQty < 12) {
        const needed = 12 - totalQty;
        if (nudgeText) nudgeText.textContent = `Nog ${needed} stuk${needed !== 1 ? 's' : ''} voor 5% korting!`;
        if (nudgeBtn) nudgeBtn.textContent = 'Naar 1 doos (12 stuks)';
      } else if (totalQty < 24) {
        const needed = 24 - totalQty;
        if (nudgeText) nudgeText.textContent = `Nog ${needed} stuk${needed !== 1 ? 's' : ''} voor 10% korting!`;
        if (nudgeBtn) nudgeBtn.textContent = 'Verdubbel mijn doos';
      } else if (totalQty < 36) {
        const needed = 36 - totalQty;
        if (nudgeText) nudgeText.textContent = `Nog ${needed} stuk${needed !== 1 ? 's' : ''} voor 15% korting!`;
        if (nudgeBtn) nudgeBtn.textContent = 'Naar 3 dozen';
      } else {
        const needed = 48 - totalQty;
        if (nudgeText) nudgeText.textContent = `Nog ${needed} stuk${needed !== 1 ? 's' : ''} voor 20% korting!`;
        if (nudgeBtn) nudgeBtn.textContent = 'Naar 4 dozen';
      }
    } else {
      nudge.style.display = 'none';
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
    const seg1 = document.getElementById('tier-seg-1');
    const seg2 = document.getElementById('tier-seg-2');
    const seg3 = document.getElementById('tier-seg-3');
    const seg4 = document.getElementById('tier-seg-4');
    const fill = document.getElementById('tier-fill');
    const label = document.getElementById('discount-tier-label');

    // Progress fill: 0-12=0%, 12-24=25%, 24-36=50%, 36-48=75%, 48+=100%
    const fillPct = totalQty === 0 ? 0 : Math.min(100, (totalQty / 48) * 100);
    if (fill) fill.style.width = fillPct + '%';

    if (seg1) seg1.classList.toggle('is-active', totalQty >= 12);
    if (seg2) seg2.classList.toggle('is-active', totalQty >= 24);
    if (seg3) seg3.classList.toggle('is-active', totalQty >= 36);
    if (seg4) seg4.classList.toggle('is-active', totalQty >= 48);

    if (label) {
      if (totalQty === 0) {
        label.textContent = 'Voeg smaken toe voor volumekorting!';
      } else if (totalQty < 12) {
        label.textContent = `Nog ${12 - totalQty} stuks voor 5% korting!`;
      } else if (totalQty < 24) {
        label.textContent = `Nog ${24 - totalQty} stuks voor 10% korting!`;
      } else if (totalQty < 36) {
        label.textContent = `Nog ${36 - totalQty} stuks voor 15% korting!`;
      } else if (totalQty < 48) {
        label.textContent = `Nog ${48 - totalQty} stuks voor 20% korting!`;
      } else {
        label.textContent = '20% korting actief! 🎉';
      }
    }
  }

  function updateAddToCartBtn(totalQty) {
    const btn = document.getElementById('btn-add-to-cart');
    if (!btn) return;
    btn.disabled = totalQty === 0;
  }

  /* ---- FLAVOR CARD QUANTITY CONTROLS ---- */

  function initFlavorCards() {
    // Read all flavor cards
    document.querySelectorAll('.flavor-card').forEach(card => {
      const id = card.dataset.id;
      const price = parseFloat(card.dataset.price);
      const name = card.dataset.name;
      const img = card.dataset.img;
      const brand = card.dataset.brand;

      // Initialize state
      if (!state.items[id]) {
        state.items[id] = { name, price, qty: 0, img, brand };
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

      const subtotal = getSubtotal();
      const tier = getDiscount(totalQty);
      const discountAmt = subtotal * tier.discount;
      const finalTotal = subtotal - discountAmt;

      // Build a single cart item for the mix
      const items = Object.values(state.items).filter(i => i.qty > 0);
      const names = items.map(i => `${i.qty}x ${i.name.split(' ').slice(-1)[0]}`).join(', ');

      addToCartDrawer({
        id: 'smikkie-mix-' + Date.now(),
        name: `Smikkie Mix (${totalQty} stuks)`,
        price: finalTotal,
        qty: 1,
        img: items[0] ? items[0].img : '',
        unitLabel: names,
        discount: tier.discount > 0 ? `${Math.round(tier.discount * 100)}% korting` : null
      });

      // Animate button
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Toegevoegd aan winkelwagen!';
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
    // Check if item already in cart
    const existing = state.cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.qty += item.qty;
      existing.price += item.price;
    } else {
      state.cartItems.push({ ...item });
    }
    renderCartDrawer();
    openCartDrawer();
  }

  function renderCartDrawer() {
    const itemsEl = document.getElementById('drawer-items');
    const emptyEl = document.getElementById('drawer-empty');
    const countEl = document.getElementById('drawer-count');
    const totalEl = document.getElementById('drawer-total');
    const discountEl = document.getElementById('drawer-discount');
    const discountText = document.getElementById('drawer-discount-text');
    const origRow = document.getElementById('drawer-original-row');
    const origPrice = document.getElementById('drawer-original-price');
    const discRow = document.getElementById('drawer-discount-row');
    const discLabel = document.getElementById('drawer-discount-label');
    const discAmt = document.getElementById('drawer-discount-amount');

    if (!itemsEl) return;

    const totalItems = state.cartItems.reduce((s, i) => s + i.qty, 0);
    const subtotal = state.cartItems.reduce((s, i) => s + i.price, 0);

    if (countEl) countEl.textContent = totalItems;
    if (totalEl) totalEl.textContent = fmt(subtotal);

    // Shipping progress
    updateShippingProgress(subtotal);

    // Discount display
    const hasDiscount = state.cartItems.some(i => i.discount);
    if (discountEl) discountEl.style.display = hasDiscount ? 'flex' : 'none';
    if (hasDiscount && discountText) {
      const discItem = state.cartItems.find(i => i.discount);
      discountText.textContent = `Je hebt ${discItem.discount}!`;
    }

    if (!state.cartItems.length) {
      if (emptyEl) emptyEl.style.display = 'block';
      itemsEl.innerHTML = emptyEl ? emptyEl.outerHTML : '';
      return;
    }

    let html = '';
    state.cartItems.forEach(item => {
      html += `
        <div class="drawer-item" data-id="${item.id}">
          <img src="${item.img}" alt="${item.name}" class="drawer-item__img" onerror="this.style.background='var(--purple-light)'">
          <div class="drawer-item__info">
            <div class="drawer-item__name">${item.name}</div>
            <div class="drawer-item__price">${fmt(item.price)}${item.discount ? ` <span style="color:var(--green);font-weight:800;">(${item.discount})</span>` : ''}</div>
          </div>
          <button class="drawer-item__remove" data-remove="${item.id}" aria-label="Verwijderen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;
    });
    itemsEl.innerHTML = html;

    // Remove buttons
    itemsEl.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.remove;
        state.cartItems = state.cartItems.filter(i => i.id !== id);
        renderCartDrawer();
      });
    });
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
    renderAll();
  });

})();
