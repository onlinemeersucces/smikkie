/* =============================================
   SMIKKIE — FAVORIETEN PAGE JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = parseInt(btn.dataset.addToCart);
      const card = btn.closest('.prod-card, .fav-card');
      const nameEl = card?.querySelector('.prod-card__name, .fav-card__name');
      const brandEl = card?.querySelector('.prod-card__brand, .fav-card__brand');
      const name = ((brandEl?.textContent || '') + ' ' + (nameEl?.textContent || '')).trim();
      const priceEl = card?.querySelector('.prod-card__price, .fav-card__price');
      const price = priceEl ? parseFloat(priceEl.textContent.replace('€', '').replace(',', '.')) : 2.49;
      const imgEl = card?.querySelector('img');
      const img = imgEl ? imgEl.src.split('/').pop() : 'barebells.jpg';

      window.SmikkieShop.addToCart({ id, name, price, img }, 1);

      if (btn.classList.contains('prod-card__add')) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.style.background = 'var(--green)';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 1500);
      } else {
        const orig = btn.textContent;
        btn.textContent = '✓ Toegevoegd!';
        btn.style.background = 'var(--green)';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1500);
      }

      window.SmikkieShop.showToast(`${name} toegevoegd! 💜`);
    });
  });
});
