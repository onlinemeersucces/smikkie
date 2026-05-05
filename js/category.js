/* =============================================
   SMIKKIE — CATEGORY PAGE JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* Price range filter */
  const priceRange = document.getElementById('price-range');
  const priceVal = document.getElementById('price-val');
  if (priceRange && priceVal) {
    priceRange.addEventListener('input', () => {
      const val = parseInt(priceRange.value);
      priceVal.textContent = `€${(val / 100).toFixed(2).replace('.', ',')}`;
    });
  }

  /* Sort select */
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      // In a real app, this would re-fetch or re-sort products
      window.SmikkieShop.showToast(`Gesorteerd op: ${sortSelect.options[sortSelect.selectedIndex].text}`);
    });
  }

  /* Reset filters */
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-check input[type="checkbox"]').forEach(cb => cb.checked = false);
      if (priceRange) { priceRange.value = 399; priceVal.textContent = '€3,99'; }
      window.SmikkieShop.showToast('Filters gewist');
    });
  }

  /* Add to cart buttons */
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.dataset.addToCart);
      const card = btn.closest('.prod-card');
      const name = card ? (card.querySelector('.prod-card__brand')?.textContent + ' ' + card.querySelector('.prod-card__name')?.textContent) : 'Product';
      const priceEl = card ? card.querySelector('.prod-card__price') : null;
      const price = priceEl ? parseFloat(priceEl.textContent.replace('€', '').replace(',', '.')) : 2.49;
      const imgEl = card ? card.querySelector('.prod-card__img img') : null;
      const img = imgEl ? imgEl.src.split('/').pop() : 'barebells.jpg';

      window.SmikkieShop.addToCart({ id, name: name.trim(), price, img }, 1);

      const origHTML = btn.innerHTML;
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
      btn.style.background = 'var(--green)';
      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
      }, 1500);

      window.SmikkieShop.showToast(`${name.trim()} toegevoegd! 💜`);
    });
  });

  /* Mobile filter toggle */
  const filterToggle = document.getElementById('filter-toggle');
  const catFilters = document.querySelector('.cat-filters');
  if (filterToggle && catFilters) {
    filterToggle.addEventListener('click', () => {
      catFilters.classList.toggle('mobile-open');
      filterToggle.textContent = catFilters.classList.contains('mobile-open') ? 'Filters verbergen' : 'Filters tonen';
    });
  }

});
