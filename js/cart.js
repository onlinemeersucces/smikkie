/* =============================================
   SMIKKIE — CART PAGE JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  renderCart();

  function renderCart() {
    const cart = window.SmikkieShop.getCart();
    const container = document.getElementById('cart-items-list');
    const emptyEl = document.getElementById('cart-empty');
    const summaryLines = document.getElementById('summary-lines');
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const shippingBar = document.getElementById('shipping-bar');
    const shippingText = document.getElementById('shipping-text');
    const suggestedEl = document.getElementById('cart-suggested');
    const progressEl = document.getElementById('shipping-progress');

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      if (suggestedEl) suggestedEl.style.display = 'none';
      if (progressEl) progressEl.style.display = 'none';
      if (summaryLines) summaryLines.innerHTML = '<p style="font-size:14px;color:var(--gray);text-align:center;padding:12px 0;">Je mix is leeg</p>';
      if (subtotalEl) subtotalEl.textContent = '€0,00';
      if (totalEl) totalEl.textContent = '€0,00';
      if (checkoutBtn) { checkoutBtn.style.opacity = '0.5'; checkoutBtn.style.pointerEvents = 'none'; }
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (checkoutBtn) { checkoutBtn.style.opacity = ''; checkoutBtn.style.pointerEvents = ''; }

    // Render items
    container.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__img">
          <img src="${item.img}" alt="${item.name}" onerror="this.src='../images/barebells.jpg'">
        </div>
        <div class="cart-item__info">
          <span class="cart-item__brand">${item.brand || ''}</span>
          <span class="cart-item__name">${item.name}</span>
          <span class="cart-item__unit-price">€${item.price.toFixed(2).replace('.', ',')} per stuk</span>
          <div class="qty-ctrl">
            <button class="qty-btn cart-qty-minus" data-id="${item.id}">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn cart-qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item__actions">
          <span class="cart-item__total">€${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
          <button class="cart-item__remove" data-id="${item.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Verwijder
          </button>
        </div>
      </div>
    `).join('');

    // Summary lines
    if (summaryLines) {
      summaryLines.innerHTML = cart.map(item => `
        <div class="summary-line">
          <span>${item.qty}× ${item.name}</span>
          <strong>€${(item.price * item.qty).toFixed(2).replace('.', ',')}</strong>
        </div>
      `).join('');
    }

    // Totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const FREE_SHIPPING_THRESHOLD = 40;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 3.95;
    const total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = `€${subtotal.toFixed(2).replace('.', ',')}`;
    if (shippingEl) {
      shippingEl.textContent = shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2).replace('.', ',')}`;
      shippingEl.className = shipping === 0 ? 'text-green' : '';
    }
    if (totalEl) totalEl.textContent = `€${total.toFixed(2).replace('.', ',')}`;

    // Shipping progress
    if (shippingBar && shippingText) {
      const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
      shippingBar.style.width = `${pct}%`;
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingText.innerHTML = '🎉 Gefeliciteerd! Je hebt <strong>gratis verzending</strong>!';
      } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2).replace('.', ',');
        shippingText.innerHTML = `Voeg nog <strong>€${remaining}</strong> toe voor gratis verzending 🚚`;
      }
    }

    // Event listeners
    document.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        window.SmikkieShop.updateCartQty(id, -1);
        renderCart();
      });
    });
    document.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        window.SmikkieShop.updateCartQty(id, 1);
        renderCart();
      });
    });
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        window.SmikkieShop.removeFromCart(id);
        renderCart();
        window.SmikkieShop.showToast('Product verwijderd uit jouw mix');
      });
    });
  }

  /* Coupon */
  const couponApply = document.getElementById('coupon-apply');
  const couponInput = document.getElementById('coupon-input');
  const couponFeedback = document.getElementById('coupon-feedback');
  const VALID_COUPONS = { 'SMIKKIE10': 10, 'WELKOM5': 5 };

  if (couponApply) {
    couponApply.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (VALID_COUPONS[code]) {
        couponFeedback.textContent = `✓ Kortingscode toegepast! ${VALID_COUPONS[code]}% korting`;
        couponFeedback.className = 'coupon-feedback success';
        couponInput.disabled = true;
        couponApply.disabled = true;
      } else {
        couponFeedback.textContent = 'Ongeldige kortingscode. Probeer: SMIKKIE10';
        couponFeedback.className = 'coupon-feedback error';
      }
    });
  }

  /* Suggested add-to-cart */
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.addToCart);
      const products = {
        3: { id: 3, name: 'Chocolate Chip Cookie', brand: 'Quest', price: 2.99, img: 'quest.jpg' },
        4: { id: 4, name: 'BCAA Passion', brand: 'NOCCO', price: 2.49, img: 'nocco.png' },
        7: { id: 7, name: 'Cookies & Cream', brand: 'Barebells', price: 2.49, img: 'barebells.jpg' }
      };
      if (products[id]) {
        window.SmikkieShop.addToCart(products[id], 1);
        renderCart();
        window.SmikkieShop.showToast(`${products[id].brand} ${products[id].name} toegevoegd! 💜`);
      }
    });
  });
});
