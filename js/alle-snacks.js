/* =============================================
   SMIKKIE — ALLE SNACKS PAGE JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('alle-grid');
  const countEl = document.getElementById('product-count');
  const filterBtns = document.querySelectorAll('.filter-pill');

  // Category filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-pill--active'));
      btn.classList.add('filter-pill--active');
      const cat = btn.dataset.cat;
      const cards = grid ? grid.querySelectorAll('.prod-card') : [];
      let visible = 0;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (countEl) countEl.textContent = `${visible} producten`;
    });
  });

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      window.SmikkieShop.showToast(`Gesorteerd op: ${sortSelect.options[sortSelect.selectedIndex].text}`);
    });
  }

  // Add to cart
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = parseInt(btn.dataset.addToCart);
      const card = btn.closest('.prod-card');
      const name = card ? (card.querySelector('.prod-card__brand')?.textContent + ' ' + card.querySelector('.prod-card__name')?.textContent).trim() : 'Product';
      const priceEl = card?.querySelector('.prod-card__price');
      const price = priceEl ? parseFloat(priceEl.textContent.replace('€', '').replace(',', '.')) : 2.49;
      const imgEl = card?.querySelector('.prod-card__img img');
      const img = imgEl ? imgEl.src.split('/').pop() : 'barebells.jpg';

      window.SmikkieShop.addToCart({ id, name, price, img }, 1);
      const orig = btn.innerHTML;
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
      btn.style.background = 'var(--green)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 1500);
      window.SmikkieShop.showToast(`${name} toegevoegd! 💜`);
    });
  });
});
