/* ============================================================
   SMIKKIE — Product Flavor Selector & Box Upsell
   ============================================================ */

(function () {
  'use strict';

  const BASE_PRICE = 2.49;

  // ── State ──────────────────────────────────────────────────
  const state = {
    flavors: {},      // { flavorKey: qty }
    boxQty: 0,        // selected box qty (0 = not using box upsell)
  };

  // ── DOM refs ───────────────────────────────────────────────
  const grid          = document.getElementById('flavor-selector-grid');
  const countBadge    = document.getElementById('flavor-selected-count');
  const fqSection     = document.getElementById('flavor-quantities');
  const fqList        = document.getElementById('flavor-qty-list');
  const boxUpsell     = document.getElementById('box-upsell');
  const priceEl       = document.getElementById('pdp-price');
  const singleQtyCtrl = document.getElementById('single-qty-ctrl');
  const qtyValD       = document.getElementById('qty-val-d');
  const qtyMinusD     = document.getElementById('qty-minus-d');
  const qtyPlusD      = document.getElementById('qty-plus-d');
  const addBtnD       = document.getElementById('add-to-cart-d');

  if (!grid) return; // not on product page

  // ── Helpers ────────────────────────────────────────────────
  function getSelectedFlavors() {
    return Object.keys(state.flavors).filter(k => state.flavors[k] > 0);
  }

  function getTotalQty() {
    if (state.boxQty > 0) return state.boxQty;
    const sel = getSelectedFlavors();
    if (sel.length === 1) return parseInt(qtyValD ? qtyValD.textContent : 1, 10);
    return sel.reduce((sum, k) => sum + (state.flavors[k] || 0), 0);
  }

  function getDiscount(qty) {
    if (qty >= 48) return 0.20;
    if (qty >= 36) return 0.10;
    if (qty >= 24) return 0.05;
    return 0;
  }

  function formatPrice(n) {
    return '€' + n.toFixed(2).replace('.', ',');
  }

  // ── Update price display ───────────────────────────────────
  function updatePrice() {
    if (!priceEl) return;
    const total = getTotalQty();
    const disc  = getDiscount(total);
    const sel   = getSelectedFlavors();

    if (state.boxQty > 0 || (sel.length > 1 && total > 1)) {
      const raw      = total * BASE_PRICE;
      const discAmt  = raw * disc;
      const final    = raw - discAmt;
      if (disc > 0) {
        priceEl.innerHTML = `${formatPrice(final)} <span style="font-size:18px;font-weight:600;color:#999;text-decoration:line-through">${formatPrice(raw)}</span> <span style="font-size:16px;font-weight:800;color:var(--green)">-${Math.round(disc*100)}%</span>`;
      } else {
        priceEl.textContent = formatPrice(final);
      }
    } else {
      priceEl.textContent = formatPrice(BASE_PRICE);
    }
  }

  // ── Render flavor quantity rows ────────────────────────────
  function renderFqRows() {
    const sel = getSelectedFlavors();
    if (sel.length < 2) {
      fqSection.style.display = 'none';
      if (singleQtyCtrl) singleQtyCtrl.style.display = 'flex';
      return;
    }
    fqSection.style.display = 'block';
    if (singleQtyCtrl) singleQtyCtrl.style.display = 'none';

    fqList.innerHTML = '';
    sel.forEach(key => {
      const chip = grid.querySelector(`[data-flavor="${key}"]`);
      const name = chip ? chip.querySelector('.flavor-chip__name').textContent : key;
      const img  = chip ? chip.dataset.img : '';
      const qty  = state.flavors[key] || 1;

      const row = document.createElement('div');
      row.className = 'fq-row';
      row.innerHTML = `
        <img src="${img}" alt="${name}" class="fq-row__img">
        <span class="fq-row__name">${name}</span>
        <div class="fq-row__ctrl">
          <button class="fq-row__btn" data-flavor="${key}" data-action="minus">−</button>
          <span class="fq-row__val" id="fq-val-${key}">${qty}</span>
          <button class="fq-row__btn" data-flavor="${key}" data-action="plus">+</button>
        </div>`;
      fqList.appendChild(row);
    });

    // bind events
    fqList.querySelectorAll('.fq-row__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const k   = btn.dataset.flavor;
        const act = btn.dataset.action;
        if (act === 'plus') {
          state.flavors[k] = (state.flavors[k] || 1) + 1;
        } else {
          state.flavors[k] = Math.max(1, (state.flavors[k] || 1) - 1);
        }
        const valEl = document.getElementById(`fq-val-${k}`);
        if (valEl) valEl.textContent = state.flavors[k];
        updateBoxUpsell();
        updatePrice();
      });
    });
  }

  // ── Box upsell ─────────────────────────────────────────────
  function updateBoxUpsell() {
    const total = getTotalQty();
    if (total >= 6) {
      boxUpsell.style.display = 'block';
    } else {
      boxUpsell.style.display = 'none';
      state.boxQty = 0;
    }
  }

  // ── Flavor chip toggle ─────────────────────────────────────
  function toggleFlavor(chip) {
    const key = chip.dataset.flavor;
    const isActive = chip.classList.contains('flavor-chip--active');

    if (isActive) {
      // deselect (keep at least 1 selected)
      const sel = getSelectedFlavors();
      if (sel.length <= 1) return;
      chip.classList.remove('flavor-chip--active');
      delete state.flavors[key];
    } else {
      chip.classList.add('flavor-chip--active');
      state.flavors[key] = 1;
    }

    updateCountBadge();
    renderFqRows();
    updateBoxUpsell();
    updatePrice();
  }

  function updateCountBadge() {
    const n = getSelectedFlavors().length;
    if (countBadge) {
      countBadge.textContent = n === 1 ? '1 geselecteerd' : `${n} geselecteerd`;
    }
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    // Set initial state: first chip is active
    const chips = grid.querySelectorAll('.flavor-chip');
    chips.forEach(chip => {
      if (chip.classList.contains('flavor-chip--active')) {
        state.flavors[chip.dataset.flavor] = 1;
      }
      chip.addEventListener('click', () => toggleFlavor(chip));
    });

    // Single qty ctrl
    if (qtyMinusD) {
      qtyMinusD.addEventListener('click', () => {
        const v = parseInt(qtyValD.textContent, 10);
        if (v > 1) {
          qtyValD.textContent = v - 1;
          updateBoxUpsell();
          updatePrice();
        }
      });
    }
    if (qtyPlusD) {
      qtyPlusD.addEventListener('click', () => {
        const v = parseInt(qtyValD.textContent, 10);
        qtyValD.textContent = v + 1;
        updateBoxUpsell();
        updatePrice();
      });
    }

    // Box upsell option buttons
    if (boxUpsell) {
      boxUpsell.querySelectorAll('.box-upsell__option').forEach(btn => {
        btn.addEventListener('click', () => {
          boxUpsell.querySelectorAll('.box-upsell__option').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          state.boxQty = parseInt(btn.dataset.qty, 10);
          updatePrice();
        });
      });
    }

    updateCountBadge();
    updatePrice();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
