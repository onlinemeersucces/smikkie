/**
 * cart-page.js — winkelwagen.html logic
 * Renders cart items, handles qty changes, computes totals with discount tiers.
 */
(function () {
  'use strict';

  const FREE_SHIPPING_THRESHOLD = 40;
  const DISCOUNT_TIERS = [
    { minQty: 48, discount: 0.20, label: '20%' },
    { minQty: 36, discount: 0.15, label: '15%' },
    { minQty: 24, discount: 0.10, label: '10%' },
    { minQty: 12, discount: 0.05, label: '5%' },
    { minQty: 0,  discount: 0,    label: null }
  ];

  function getCart() {
    try { return JSON.parse(localStorage.getItem('smikkie_cart') || '[]'); } catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem('smikkie_cart', JSON.stringify(cart));
  }
  function fmt(n) {
    return '€' + n.toFixed(2).replace('.', ',');
  }
  function getTier(totalQty) {
    for (const t of DISCOUNT_TIERS) {
      if (totalQty >= t.minQty) return t;
    }
    return DISCOUNT_TIERS[DISCOUNT_TIERS.length - 1];
  }
  function nextTier(totalQty) {
    const tiers = [...DISCOUNT_TIERS].reverse();
    for (const t of tiers) {
      if (t.minQty > totalQty && t.discount > 0) return t;
    }
    return null;
  }

  function renderCart() {
    const cart = getCart();
    const list = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    const countEl = document.getElementById('cart-item-count');
    const upsellBlock = document.getElementById('cart-upsell-block');

    if (!list) return;

    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const tier = getTier(totalQty);

    // Count label
    if (countEl) countEl.textContent = totalQty + (totalQty === 1 ? ' product' : ' producten');

    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = '';
      list.innerHTML = '';
      list.appendChild(emptyState || document.createElement('div'));
      updateSummary(cart, 0, 0, 0);
      if (upsellBlock) upsellBlock.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Build items HTML
    let html = '';
    let subtotal = 0;
    cart.forEach(item => {
      const lineTotal = item.price * item.qty;
      subtotal += lineTotal;
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__img-wrap">
            <img src="${item.img || '../images/proteinbar.png'}" alt="${item.name}" class="cart-item__img" loading="lazy">
          </div>
          <div class="cart-item__details">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__brand">${item.brand || ''}</div>
            <div class="cart-item__price-unit">${fmt(item.price)} per stuk</div>
          </div>
          <div class="cart-item__controls">
            <div class="cart-item__qty-row">
              <button class="qty-btn qty-btn--minus" data-cart-minus="${item.id}" aria-label="Minder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn qty-btn--plus" data-cart-plus="${item.id}" aria-label="Meer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div class="cart-item__line-total">${fmt(lineTotal)}</div>
            <button class="cart-item__remove" data-cart-remove="${item.id}" aria-label="Verwijderen">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Verwijderen
            </button>
          </div>
        </div>`;
    });

    list.innerHTML = html;

    // Discount calculation
    const discountAmount = subtotal * tier.discount;
    const total = subtotal - discountAmount;

    updateSummary(cart, subtotal, discountAmount, total, tier, totalQty);
    updateShippingProgress(total);
    updateUpsellBlock(totalQty, upsellBlock);
    updateScarcity();
  }

  function updateSummary(cart, subtotal, discountAmount, total, tier, totalQty) {
    const rowSubtotal = document.getElementById('sum-row-subtotal');
    const elSubtotal = document.getElementById('sum-subtotal');
    const rowDiscount = document.getElementById('sum-row-discount');
    const elDiscountLabel = document.getElementById('sum-discount-label');
    const elDiscount = document.getElementById('sum-discount');
    const elTotal = document.getElementById('sum-total');
    const elShipping = document.getElementById('sum-shipping');
    const badgeEl = document.getElementById('sum-discount-badge');
    const badgeText = document.getElementById('sum-discount-badge-text');

    if (cart.length === 0) {
      if (elTotal) elTotal.textContent = '€0,00';
      if (rowSubtotal) rowSubtotal.style.display = 'none';
      if (rowDiscount) rowDiscount.style.display = 'none';
      if (badgeEl) badgeEl.style.display = 'none';
      return;
    }

    const shippingFree = total >= FREE_SHIPPING_THRESHOLD;
    if (elShipping) {
      elShipping.textContent = shippingFree ? 'Gratis' : '€4,95';
      elShipping.className = shippingFree ? 'price-green' : '';
    }

    const finalTotal = total + (shippingFree ? 0 : 4.95);

    if (tier && tier.discount > 0) {
      if (rowSubtotal) rowSubtotal.style.display = '';
      if (elSubtotal) elSubtotal.textContent = fmt(subtotal);
      if (rowDiscount) rowDiscount.style.display = '';
      if (elDiscountLabel) elDiscountLabel.textContent = `Volumekorting (${tier.label})`;
      if (elDiscount) elDiscount.textContent = '-' + fmt(discountAmount);
      if (badgeEl) badgeEl.style.display = '';
      if (badgeText) badgeText.textContent = `Je bespaart ${fmt(discountAmount)} met volumekorting!`;
    } else {
      if (rowSubtotal) rowSubtotal.style.display = 'none';
      if (rowDiscount) rowDiscount.style.display = 'none';
      if (badgeEl) badgeEl.style.display = 'none';
    }

    if (elTotal) elTotal.textContent = fmt(finalTotal);
  }

  function updateShippingProgress(total) {
    const fill = document.getElementById('shipping-fill');
    const text = document.getElementById('shipping-progress-text');
    const remaining = document.getElementById('shipping-remaining');

    if (!fill) return;

    const pct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
    fill.style.width = pct + '%';

    if (total >= FREE_SHIPPING_THRESHOLD) {
      if (text) text.innerHTML = '🎉 Je hebt <span class="text-green">gratis verzending</span> verdiend!';
    } else {
      const diff = FREE_SHIPPING_THRESHOLD - total;
      if (remaining) remaining.textContent = fmt(diff);
    }
  }

  function updateUpsellBlock(totalQty, block) {
    if (!block) return;
    const next = nextTier(totalQty);
    if (!next) { block.style.display = 'none'; return; }

    const needed = next.minQty - totalQty;
    const titleEl = document.getElementById('cart-upsell-title');
    const subEl = document.getElementById('cart-upsell-sub');
    if (titleEl) titleEl.textContent = `Voeg nog ${needed} stuks toe voor ${next.label} korting!`;
    if (subEl) subEl.textContent = `Je zit nu op ${totalQty} stuks — nog ${needed} tot de volgende staffel`;
    block.style.display = '';
  }

  function updateScarcity() {
    const el = document.getElementById('scarcity-text');
    if (!el) return;
    const viewers = Math.floor(Math.random() * 15) + 12;
    el.innerHTML = `🔥 <strong>${viewers} mensen</strong> bekijken nu hetzelfde product — populair!`;
  }

  // Event delegation for qty and remove buttons
  document.addEventListener('click', function (e) {
    const minusBtn = e.target.closest('[data-cart-minus]');
    const plusBtn = e.target.closest('[data-cart-plus]');
    const removeBtn = e.target.closest('[data-cart-remove]');

    if (minusBtn) {
      const id = minusBtn.dataset.cartMinus;
      const cart = getCart();
      const idx = cart.findIndex(i => String(i.id) === String(id));
      if (idx > -1) {
        if (cart[idx].qty > 1) { cart[idx].qty--; } else { cart.splice(idx, 1); }
        saveCart(cart);
        renderCart();
        if (window.SmikkieShop && window.SmikkieShop.updateCartBadge) window.SmikkieShop.updateCartBadge();
      }
    }

    if (plusBtn) {
      const id = plusBtn.dataset.cartPlus;
      const cart = getCart();
      const idx = cart.findIndex(i => String(i.id) === String(id));
      if (idx > -1) { cart[idx].qty++; saveCart(cart); renderCart(); }
      if (window.SmikkieShop && window.SmikkieShop.updateCartBadge) window.SmikkieShop.updateCartBadge();
    }

    if (removeBtn) {
      const id = removeBtn.dataset.cartRemove;
      const cart = getCart().filter(i => String(i.id) !== String(id));
      saveCart(cart);
      renderCart();
      if (window.SmikkieShop && window.SmikkieShop.updateCartBadge) window.SmikkieShop.updateCartBadge();
    }
  });

  // Init
  document.addEventListener('DOMContentLoaded', renderCart);
})();
