/* =============================================
   SMIKKIE — MIX PAGE JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  let mixItems = []; // { id, name, price, img, qty }

  function getMixTotal() {
    return mixItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function renderMix() {
    const container = document.getElementById('mix-summary-items');
    const emptyEl = document.getElementById('mix-empty');
    const countEl = document.getElementById('mix-count');
    const totalEl = document.getElementById('mix-total');
    const toCartBtn = document.getElementById('mix-to-cart');
    const shippingBar = document.getElementById('mix-shipping-bar');
    const shippingText = document.getElementById('mix-shipping-text');

    if (!container) return;

    const total = getMixTotal();
    const totalItems = mixItems.reduce((sum, item) => sum + item.qty, 0);

    if (countEl) countEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    if (totalEl) totalEl.textContent = `€${total.toFixed(2).replace('.', ',')}`;
    if (toCartBtn) toCartBtn.disabled = mixItems.length === 0;

    // Shipping progress
    if (shippingBar && shippingText) {
      const pct = Math.min(100, (total / 40) * 100);
      shippingBar.style.width = `${pct}%`;
      if (total >= 40) {
        shippingText.innerHTML = '🎉 Gratis verzending!';
      } else {
        shippingText.innerHTML = `Voeg nog <strong>€${(40 - total).toFixed(2).replace('.', ',')}</strong> toe voor gratis verzending`;
      }
    }

    if (mixItems.length === 0) {
      container.innerHTML = '';
      if (emptyEl) { emptyEl.style.display = 'flex'; container.appendChild(emptyEl); }
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    container.innerHTML = mixItems.map(item => `
      <div class="mix-summary-item" data-id="${item.id}">
        <div class="mix-summary-item__img">
          <img src="${item.img}" alt="${item.name}" onerror="this.src='../images/barebells.jpg'">
        </div>
        <div class="mix-summary-item__info">
          <span class="mix-summary-item__name">${item.name}</span>
          <span class="mix-summary-item__price">€${item.price.toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="mix-summary-item__controls">
          <button class="mix-qty-btn mix-minus" data-id="${item.id}">−</button>
          <span class="mix-qty-val">${item.qty}</span>
          <button class="mix-qty-btn mix-plus" data-id="${item.id}">+</button>
        </div>
      </div>
    `).join('');

    // Qty controls
    container.querySelectorAll('.mix-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = mixItems.find(i => i.id === id);
        if (item) {
          item.qty--;
          if (item.qty <= 0) mixItems = mixItems.filter(i => i.id !== id);
          renderMix();
          updateAddBtns();
        }
      });
    });
    container.querySelectorAll('.mix-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = mixItems.find(i => i.id === id);
        if (item) { item.qty++; renderMix(); }
      });
    });
  }

  function updateAddBtns() {
    document.querySelectorAll('.mix-add-btn').forEach(btn => {
      const id = parseInt(btn.dataset.id);
      const inMix = mixItems.some(i => i.id === id);
      btn.classList.toggle('added', inMix);
      btn.innerHTML = inMix
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
    });
  }

  // Add to mix
  document.querySelectorAll('.mix-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const row = btn.closest('.mix-product-item');
      const name = row.dataset.name;
      const price = parseFloat(row.dataset.price);
      const img = row.dataset.img;

      const existing = mixItems.find(i => i.id === id);
      if (existing) {
        existing.qty++;
      } else {
        mixItems.push({ id, name, price, img, qty: 1 });
      }

      renderMix();
      updateAddBtns();
      window.SmikkieShop.showToast(`${name} toegevoegd aan mix! 💜`);
    });
  });

  // Category tabs
  document.querySelectorAll('.mix-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mix-tab').forEach(t => t.classList.remove('mix-tab--active'));
      tab.classList.add('mix-tab--active');
      const cat = tab.dataset.cat;
      document.querySelectorAll('.mix-product-item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // Search
  const searchInput = document.getElementById('mix-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('.mix-product-item').forEach(item => {
        const name = item.dataset.name.toLowerCase();
        item.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  // Add to cart button
  const toCartBtn = document.getElementById('mix-to-cart');
  if (toCartBtn) {
    toCartBtn.addEventListener('click', () => {
      mixItems.forEach(item => {
        window.SmikkieShop.addToCart(item, item.qty);
      });
      toCartBtn.innerHTML = '✓ Mix toegevoegd aan winkelwagen!';
      toCartBtn.style.background = 'var(--green)';
      setTimeout(() => {
        window.location.href = 'winkelwagen.html';
      }, 1000);
    });
  }

  renderMix();
});
