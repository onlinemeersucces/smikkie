/* =============================================
   SMIKKIE — CATEGORY MIX-BOX
   Herbruikbare mix-box logica voor categoriepagina's.
   Configuratie wordt per pagina meegegeven via window.CATEGORY_CONFIG.

   Voorbeeld configuratie:
   window.CATEGORY_CONFIG = {
     doosGrootte: 12,           // stuks per doos
     staffelTiers: [            // kortingsdrempels (oplopend)
       { minQty: 12, discount: 0.05,  label: '5% korting'  },
       { minQty: 24, discount: 0.10,  label: '10% korting' },
       { minQty: 36, discount: 0.15,  label: '15% korting' },
       { minQty: 48, discount: 0.20,  label: '20% korting' },
     ],
     snelkeuze: [3, 6, 9, 12, 24, 36, 48],
     boxSizes:  [12, 24, 36, 48],
   };
   ============================================= */

(function () {
  'use strict';

  /* ---- WACHT OP DOMContentLoaded ---- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    /* ---- CONFIGURATIE ---- */
    const CFG = window.CATEGORY_CONFIG || {};
    const DOOS      = CFG.doosGrootte || 12;
    const BOX_SIZES = CFG.boxSizes    || [DOOS, DOOS * 2, DOOS * 3, DOOS * 4];
    const TIERS     = (CFG.staffelTiers || [
      { minQty: DOOS,     discount: 0.05, label: '5% korting'  },
      { minQty: DOOS * 2, discount: 0.10, label: '10% korting' },
      { minQty: DOOS * 3, discount: 0.15, label: '15% korting' },
      { minQty: DOOS * 4, discount: 0.20, label: '20% korting' },
    ]).slice().sort((a, b) => b.minQty - a.minQty); // hoog naar laag voor getDiscount()
    const SNELKEUZE = CFG.snelkeuze || [3, 6, 9, DOOS, DOOS * 2, DOOS * 3, DOOS * 4];
    const FREE_SHIPPING = 40.00;
    const MAX_TIER_QTY  = TIERS[0].minQty; // hoogste drempel (bijv. 48 of 24)

    /* ---- STATE ---- */
    const state = {
      items:   {},    // { id: { id, name, price, qty, img, brand } }
      boxSize: DOOS,  // huidig doelformaat
    };

    /* ---- HELPERS ---- */
    function fmt(n) {
      return '\u20ac' + n.toFixed(2).replace('.', ',');
    }

    function getTotalQty() {
      return Object.values(state.items).reduce((s, i) => s + i.qty, 0);
    }

    function getSubtotal() {
      return Object.values(state.items).reduce((s, i) => s + i.qty * i.price, 0);
    }

    function getDiscount(qty) {
      for (const tier of TIERS) {
        if (qty >= tier.minQty) return tier;
      }
      return { minQty: 0, discount: 0, label: null };
    }

    /* ---- FLAVOR CARDS INITIALISEREN ---- */
    function initFlavorCards() {
      document.querySelectorAll('.flavor-card').forEach(card => {
        const id    = card.dataset.id;
        const price = parseFloat(card.dataset.price);
        const name  = card.dataset.name;
        const img   = card.dataset.img;
        const brand = card.dataset.brand || '';

        if (!state.items[id]) {
          state.items[id] = { id, name, price, qty: 0, img, brand };
        }

        // Injecteer snelkeuze-knoppen als ze er nog niet zijn
        if (!card.querySelector('.flavor-card__quick-qty')) {
          const wrap = document.createElement('div');
          wrap.className = 'flavor-card__quick-qty';
          SNELKEUZE.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'quick-qty-btn';
            btn.dataset.id  = id;
            btn.dataset.qty = q;
            btn.textContent = q;
            wrap.appendChild(btn);
          });
          card.appendChild(wrap);
        }
      });

      // Plus-knoppen
      document.querySelectorAll('.qty-btn--plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (!state.items[id]) return;
          state.items[id].qty++;
          syncCard(id);
          renderAll();
        });
      });

      // Min-knoppen
      document.querySelectorAll('.qty-btn--minus').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (!state.items[id] || state.items[id].qty === 0) return;
          state.items[id].qty--;
          syncCard(id);
          renderAll();
        });
      });

      // Snelkeuze via event delegation op het grid
      const grid = document.getElementById('flavor-grid');
      if (grid) {
        grid.addEventListener('click', e => {
          const btn = e.target.closest('.quick-qty-btn');
          if (!btn) return;
          const id  = btn.dataset.id;
          const qty = parseInt(btn.dataset.qty);
          if (!state.items[id]) return;
          state.items[id].qty = state.items[id].qty === qty ? 0 : qty;
          syncCard(id);
          renderAll();
        });
      }
    }

    function syncCard(id) {
      // Qty display
      const el = document.getElementById('qty-' + id);
      if (el) el.textContent = state.items[id].qty;
      // Card state
      const card = document.querySelector(`.flavor-card[data-id="${id}"]`);
      if (card) card.classList.toggle('has-qty', state.items[id].qty > 0);
      // Snelkeuze actief
      const wrap = card && card.querySelector('.flavor-card__quick-qty');
      if (wrap) {
        wrap.querySelectorAll('.quick-qty-btn').forEach(b => {
          b.classList.toggle('is-active', parseInt(b.dataset.qty) === state.items[id].qty);
        });
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

    /* ---- TABS ---- */
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

    /* ---- FILTERS ---- */
    function initFilters() {
      document.querySelectorAll('.flavor-filter').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.flavor-filter').forEach(b => b.classList.remove('flavor-filter--active'));
          btn.classList.add('flavor-filter--active');
          const filter = btn.dataset.filter;
          document.querySelectorAll('.flavor-card').forEach(card => {
            card.style.display = (filter === 'all' || card.dataset.brand === filter) ? '' : 'none';
          });
        });
      });
    }

    /* ---- RENDER ALLES ---- */
    function renderAll() {
      const totalQty = getTotalQty();
      const subtotal = getSubtotal();
      const tier     = getDiscount(totalQty);
      const discAmt  = subtotal * tier.discount;
      const total    = subtotal - discAmt;

      renderPickerProgress(totalQty);
      renderTierBar(totalQty);
      renderUpsellNudge(totalQty);
      renderSummary(totalQty, subtotal, tier, discAmt, total);
      renderAddToCartBtn(totalQty);
    }

    function renderPickerProgress(totalQty) {
      const fill     = document.getElementById('picker-fill');
      const countEl  = document.getElementById('picker-count');
      const maxEl    = document.getElementById('picker-max');
      if (fill)    fill.style.width = Math.min(100, (totalQty / state.boxSize) * 100) + '%';
      if (countEl) countEl.textContent = totalQty;
      if (maxEl)   maxEl.textContent   = state.boxSize;
    }

    function renderTierBar(totalQty) {
      const barEl = document.getElementById('tier-bar');
      if (!barEl) return;

      // Bouw tiers van laag naar hoog voor de balk
      const tiersAsc = TIERS.slice().sort((a, b) => a.minQty - b.minQty);
      const nextTier = tiersAsc.find(t => totalQty < t.minQty);
      const pct      = nextTier ? Math.min(100, (totalQty / nextTier.minQty) * 100) : 100;

      const nudge = nextTier
        ? `Nog <strong>${nextTier.minQty - totalQty} stuks</strong> voor ${nextTier.label}!`
        : `<strong>\uD83C\uDF89 Maximale korting (${Math.round(TIERS[0].discount * 100)}%) bereikt!</strong>`;

      barEl.innerHTML = `
        <div class="tier-bar__labels">
          ${tiersAsc.map(t => `<span class="tier-bar__label${totalQty >= t.minQty ? ' is-reached' : ''}">${Math.round(t.discount * 100)}%</span>`).join('')}
        </div>
        <div class="tier-bar__track">
          <div class="tier-bar__fill" style="width:${pct}%"></div>
        </div>
        <div class="tier-bar__nudge">${nudge}</div>
      `;
    }

    function renderUpsellNudge(totalQty) {
      const nudge     = document.getElementById('upsell-nudge');
      const nudgeText = document.getElementById('upsell-nudge-text');
      const nudgeBtn  = document.getElementById('upsell-nudge-btn');
      if (!nudge) return;

      const tiersAsc = TIERS.slice().sort((a, b) => a.minQty - b.minQty);
      const nextTier = tiersAsc.find(t => totalQty < t.minQty);

      if (totalQty > 0 && nextTier) {
        nudge.style.display = 'flex';
        const needed = nextTier.minQty - totalQty;
        if (nudgeText) nudgeText.textContent = `Nog ${needed} stuk${needed !== 1 ? 's' : ''} voor ${nextTier.label}!`;
        if (nudgeBtn)  nudgeBtn.textContent  = `Naar ${nextTier.minQty} stuks`;
      } else if (totalQty > 0) {
        nudge.style.display = 'flex';
        if (nudgeText) nudgeText.textContent = `\uD83C\uDF89 Maximale korting actief!`;
        if (nudgeBtn)  nudgeBtn.style.display = 'none';
      } else {
        nudge.style.display = 'none';
      }
    }

    function renderSummary(totalQty, subtotal, tier, discAmt, total) {
      const countEl   = document.getElementById('summary-count');
      const itemsEl   = document.getElementById('summary-items');
      const emptyEl   = document.getElementById('summary-empty');
      const pricingEl = document.getElementById('summary-pricing');
      const origRow   = document.getElementById('sum-original-row');
      const origEl    = document.getElementById('sum-original');
      const discRow   = document.getElementById('sum-discount-row');
      const discLabel = document.getElementById('sum-discount-label');
      const discAmtEl = document.getElementById('sum-discount-amount');
      const totalEl   = document.getElementById('sum-total');
      const addBtn    = document.getElementById('btn-add-to-cart');

      if (countEl) countEl.textContent = totalQty + ' stuks';

      const items = Object.values(state.items).filter(i => i.qty > 0);

      if (emptyEl)   emptyEl.style.display   = items.length ? 'none'  : 'block';
      if (pricingEl) pricingEl.style.display = items.length ? 'block' : 'none';
      if (addBtn)    addBtn.disabled          = items.length === 0;

      if (itemsEl) {
        itemsEl.innerHTML = items.map(item => `
          <div class="summary-item">
            <div class="summary-item__row">
              <img src="${item.img}" alt="${item.name}" class="summary-item__img" onerror="this.style.display='none'">
              <div class="summary-item__info">
                <span class="summary-item__brand">${item.brand}</span>
                <span class="summary-item__name">${item.name}</span>
                <span class="summary-item__unit">${item.qty}\u00d7 ${fmt(item.price)}</span>
              </div>
              <span class="summary-item__price">${fmt(item.qty * item.price)}</span>
              <div class="summary-item__qty-ctrl">
                <button class="summary-qty-btn" data-id="${item.id}" data-action="dec">\u2212</button>
                <span class="summary-qty-val">${item.qty}</span>
                <button class="summary-qty-btn" data-id="${item.id}" data-action="inc">+</button>
              </div>
            </div>
          </div>
        `).join('');
      }

      // Prijzen
      if (tier.discount > 0) {
        if (origRow)   origRow.style.display   = 'flex';
        if (origEl)    origEl.textContent       = fmt(subtotal);
        if (discRow)   discRow.style.display    = 'flex';
        if (discLabel) discLabel.textContent    = `Volumekorting (${Math.round(tier.discount * 100)}%)`;
        if (discAmtEl) discAmtEl.textContent    = '-' + fmt(discAmt);
      } else {
        if (origRow) origRow.style.display = 'none';
        if (discRow) discRow.style.display = 'none';
      }
      if (totalEl) totalEl.textContent = fmt(total);
    }

    function renderAddToCartBtn(totalQty) {
      const btn = document.getElementById('btn-add-to-cart');
      if (btn) btn.disabled = totalQty === 0;
    }

    /* ---- SUMMARY QTY DELEGATION ---- */
    function initSummaryDelegation() {
      const itemsEl = document.getElementById('summary-items');
      if (!itemsEl) return;
      itemsEl.addEventListener('click', e => {
        const btn = e.target.closest('.summary-qty-btn');
        if (!btn) return;
        e.stopPropagation();
        const id     = btn.dataset.id;
        const action = btn.dataset.action;
        if (!state.items[id]) return;
        if (action === 'inc') {
          state.items[id].qty++;
        } else if (action === 'dec' && state.items[id].qty > 0) {
          state.items[id].qty--;
        }
        syncCard(id);
        renderAll();
      });
    }

    /* ---- TOEVOEGEN AAN WINKELWAGEN ---- */
    function initAddToCart() {
      const btn = document.getElementById('btn-add-to-cart');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const items = Object.values(state.items).filter(i => i.qty > 0);
        if (!items.length) return;

        const tier     = getDiscount(getTotalQty());
        const subtotal = getSubtotal();
        const discAmt  = subtotal * tier.discount;

        items.forEach(item => {
          // Bereken de effectieve prijs na korting per stuk
          const discountedPrice = item.price * (1 - tier.discount);
          window.SmikkieShop.addToCart({
            id:       item.id,
            name:     item.name,
            brand:    item.brand,
            fullName: (item.brand ? item.brand + ' ' : '') + item.name,
            price:    discountedPrice,
            img:      item.img,
            cat:      '',
            tags:     [],
          }, item.qty);
        });

        // Feedback
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Toegevoegd!';
        btn.style.background = 'var(--green, #2d8a55)';
        setTimeout(() => { btn.innerHTML = origHTML; btn.style.background = ''; }, 2500);

        // Open globale winkelwagen sidebar
        if (window.SmikkieShop && window.SmikkieShop.openCart) {
          setTimeout(() => window.SmikkieShop.openCart(), 300);
        }
      });
    }

    /* ---- UPSELL NUDGE KNOP ---- */
    function initUpsellNudge() {
      const nudgeBtn = document.getElementById('upsell-nudge-btn');
      if (!nudgeBtn) return;
      nudgeBtn.addEventListener('click', () => {
        const totalQty = getTotalQty();
        const tiersAsc = TIERS.slice().sort((a, b) => a.minQty - b.minQty);
        const nextTier = tiersAsc.find(t => totalQty < t.minQty);
        if (!nextTier) return;
        const target = nextTier.minQty;
        const toAdd  = target - totalQty;
        if (toAdd <= 0) return;

        // Verdeel extra stuks over de items die al in de mix zitten
        const activeItems = Object.values(state.items).filter(i => i.qty > 0);
        if (!activeItems.length) return;
        let remaining = toAdd;
        activeItems.forEach((item, idx) => {
          const add = idx === activeItems.length - 1 ? remaining : Math.round(toAdd / activeItems.length);
          state.items[item.id].qty += add;
          remaining -= add;
          syncCard(item.id);
        });
        renderAll();
      });
    }

    /* ---- VOLUME STEP KLIKKEN ---- */
    function initVolumeSteps() {
      document.querySelectorAll('.volume-step').forEach(step => {
        step.addEventListener('click', () => {
          const targetQty = parseInt(step.dataset.qty);
          state.boxSize = targetQty;
          document.querySelectorAll('.box-size').forEach(b => b.classList.remove('box-size--active'));
          const matching = document.querySelector(`.box-size[data-size="${targetQty}"]`);
          if (matching) matching.classList.add('box-size--active');
          renderAll();
          const builder = document.querySelector('.mix-builder');
          if (builder) builder.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    /* ---- DOZEN TOEVOEGEN ---- */
    function initDozenCards() {
      document.querySelectorAll('.btn-add-dozen').forEach(btn => {
        btn.addEventListener('click', () => {
          const productId = btn.dataset.product;
          const selector  = document.querySelector(`.bundle-selector[data-product="${productId}"]`);
          if (!selector) return;
          const activeOption = selector.querySelector('.bundle-option--active');
          if (!activeOption) return;

          const qty       = parseInt(activeOption.dataset.qty);
          const unitPrice = parseFloat(selector.dataset.unitPrice);
          const boxSize   = parseInt(selector.dataset.boxSize || DOOS);
          const totalItems = qty * boxSize;
          const priceEl   = activeOption.querySelector('.bundle-option__price');
          const priceText = priceEl ? priceEl.textContent : '';
          const priceMatch = priceText.match(/[\d,]+/);
          const totalPrice = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : unitPrice * totalItems;

          const header = btn.closest('.dozen-product');
          const name   = header ? (header.querySelector('.dozen-product__name') || {}).textContent || productId : productId;
          const imgEl  = header ? header.querySelector('img') : null;

          window.SmikkieShop.addToCart({
            id:       productId + '-dozen-' + qty,
            name:     `${name} (${qty} doos${qty > 1 ? 'en' : ''})`,
            brand:    '',
            fullName: `${name} (${qty} doos${qty > 1 ? 'en' : ''})`,
            price:    totalPrice,
            img:      imgEl ? imgEl.src.split('/').pop() : 'barebells.jpg',
            cat:      '',
            tags:     [],
          }, 1);

          const origText = btn.innerHTML;
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Toegevoegd!';
          btn.style.background = 'var(--green, #2d8a55)';
          setTimeout(() => { btn.innerHTML = origText; btn.style.background = ''; }, 2000);

          if (window.SmikkieShop && window.SmikkieShop.openCart) {
            setTimeout(() => window.SmikkieShop.openCart(), 300);
          }
        });
      });

      document.querySelectorAll('.bundle-selector').forEach(selector => {
        selector.querySelectorAll('.bundle-option').forEach(option => {
          option.addEventListener('click', () => {
            selector.querySelectorAll('.bundle-option').forEach(o => o.classList.remove('bundle-option--active'));
            option.classList.add('bundle-option--active');
          });
        });
      });
    }

    /* ---- STAFFELBALK IN HEADER ---- */
    function initStaffelBar() {
      const bar = document.getElementById('staffel-bar');
      if (!bar) return;
      // Markeer actief tier op basis van qty (via renderAll -> renderTierBar)
      // De balk wordt dynamisch bijgewerkt via renderTierBar
    }

    /* ---- START ---- */
    initFlavorCards();
    initBoxSizes();
    initTabs();
    initFilters();
    initSummaryDelegation();
    initAddToCart();
    initUpsellNudge();
    initVolumeSteps();
    initDozenCards();
    initStaffelBar();
    renderAll();
  }

})();
