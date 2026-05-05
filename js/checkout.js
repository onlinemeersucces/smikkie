/* =============================================
   SMIKKIE — CHECKOUT JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  let currentStep = 1;

  // Render summary
  function renderSummary() {
    const cart = window.SmikkieShop.getCart();
    const summaryItems = document.getElementById('checkout-summary-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total-summary');
    const shippingEl = document.getElementById('checkout-shipping');
    const reviewItems = document.getElementById('checkout-order-items');
    const reviewTotal = document.getElementById('checkout-total');

    if (!summaryItems) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= 40 ? 0 : 3.95;
    const total = subtotal + shipping;

    summaryItems.innerHTML = cart.map(item => `
      <div class="checkout-summary-item">
        <div class="checkout-summary-item__name">
          <span class="checkout-summary-item__qty">${item.qty}</span>
          ${item.name}
        </div>
        <span class="checkout-summary-item__price">€${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
      </div>
    `).join('') || '<p style="font-size:14px;color:#888;padding:12px 0;">Je mix is leeg</p>';

    if (subtotalEl) subtotalEl.textContent = `€${subtotal.toFixed(2).replace('.', ',')}`;
    if (shippingEl) { shippingEl.textContent = shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2).replace('.', ',')}`; }
    if (totalEl) totalEl.textContent = `€${total.toFixed(2).replace('.', ',')}`;

    if (reviewItems) {
      reviewItems.innerHTML = cart.map(item => `
        <div class="order-review-item">
          <span>${item.qty}× ${item.name}</span>
          <strong>€${(item.price * item.qty).toFixed(2).replace('.', ',')}</strong>
        </div>
      `).join('');
    }
    if (reviewTotal) reviewTotal.textContent = `€${total.toFixed(2).replace('.', ',')}`;
  }

  renderSummary();

  // Step navigation
  function goToStep(step) {
    document.querySelectorAll('.checkout-step-panel').forEach(p => p.style.display = 'none');
    const panel = document.getElementById(`step-${step}`);
    if (panel) { panel.style.display = 'block'; panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    currentStep = step;

    // Update header indicators
    for (let i = 1; i <= 3; i++) {
      const ind = document.getElementById(`step-${i}-indicator`) || document.querySelector(`.checkout-step:nth-child(${i * 2 - 1})`);
    }
    document.querySelectorAll('.checkout-step').forEach((el, idx) => {
      el.classList.remove('checkout-step--active', 'checkout-step--done');
      if (idx + 1 < step) el.classList.add('checkout-step--done');
      else if (idx + 1 === step) el.classList.add('checkout-step--active');
    });
  }

  // Validate step 1
  function validateStep1() {
    const required = ['first-name', 'last-name', 'email', 'street', 'housenr', 'postcode', 'city'];
    let valid = true;
    required.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) {
        el.classList.add('error');
        el.addEventListener('input', () => el.classList.remove('error'), { once: true });
        valid = false;
      }
    });
    return valid;
  }

  // Step 1 → 2
  const toStep2 = document.getElementById('to-step-2');
  if (toStep2) toStep2.addEventListener('click', () => {
    if (validateStep1()) goToStep(2);
    else {
      const firstError = document.querySelector('.form-input.error');
      if (firstError) firstError.focus();
    }
  });

  // Step 2 → 3
  const toStep3 = document.getElementById('to-step-3');
  if (toStep3) toStep3.addEventListener('click', () => goToStep(3));

  // Back buttons
  const backTo1 = document.getElementById('back-to-1');
  if (backTo1) backTo1.addEventListener('click', () => goToStep(1));
  const backTo2 = document.getElementById('back-to-2');
  if (backTo2) backTo2.addEventListener('click', () => goToStep(2));

  // Shipping option selection
  document.querySelectorAll('.shipping-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('shipping-option--selected'));
      opt.classList.add('shipping-option--selected');
    });
  });

  // Payment method selection
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('payment-method--selected'));
      method.classList.add('payment-method--selected');
      const val = method.querySelector('input[type="radio"]')?.value;
      const idealBanks = document.getElementById('ideal-banks');
      if (idealBanks) idealBanks.style.display = val === 'ideal' ? 'flex' : 'none';
    });
  });

  // Place order
  const placeOrder = document.getElementById('place-order');
  if (placeOrder) {
    placeOrder.addEventListener('click', () => {
      const termsAgree = document.getElementById('terms-agree');
      if (!termsAgree?.checked) {
        alert('Ga akkoord met de algemene voorwaarden om door te gaan.');
        return;
      }
      // Save checkout data for confirmation page
      const emailEl = document.getElementById('email');
      if (emailEl) {
        localStorage.setItem('smikkie_checkout', JSON.stringify({ email: emailEl.value }));
      }

      // Animate button
      placeOrder.textContent = '✓ Bestelling geplaatst!';
      placeOrder.style.background = 'var(--green)';
      placeOrder.disabled = true;

      // Clear cart
      window.SmikkieShop.clearCart();

      // Redirect to confirmation page
      setTimeout(() => {
        window.location.href = 'bestelling-bevestigd.html';
      }, 800);
    });
  }

  // Postcode auto-format
  const postcodeInput = document.getElementById('postcode');
  if (postcodeInput) {
    postcodeInput.addEventListener('blur', () => {
      const val = postcodeInput.value.replace(/\s/g, '').toUpperCase();
      if (/^\d{4}[A-Z]{2}$/.test(val)) {
        postcodeInput.value = val.slice(0, 4) + ' ' + val.slice(4);
      }
    });
  }
});
