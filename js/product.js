/* =============================================
   SMIKKIE — PRODUCT PAGE JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ==================== GALLERY (Desktop) ==================== */
  const thumbs = document.querySelectorAll('.gallery__thumb');
  const mainImg = document.getElementById('gallery-main-img');
  let currentGalleryIdx = 0;
  const galleryImages = ['barebells.jpg', 'barebells.jpg', 'barebells.jpg', 'barebells.jpg'];

  function setGalleryImage(idx) {
    currentGalleryIdx = idx;
    if (mainImg) {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = galleryImages[idx];
        mainImg.style.opacity = '1';
      }, 150);
    }
    thumbs.forEach((t, i) => {
      t.classList.toggle('gallery__thumb--active', i === idx);
    });
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => setGalleryImage(i));
  });

  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (prevBtn) prevBtn.addEventListener('click', () => setGalleryImage((currentGalleryIdx - 1 + galleryImages.length) % galleryImages.length));
  if (nextBtn) nextBtn.addEventListener('click', () => setGalleryImage((currentGalleryIdx + 1) % galleryImages.length));

  /* ==================== MOBILE SLIDER ==================== */
  const track = document.getElementById('mobile-slider-track');
  const dotsInner = document.querySelectorAll('#mobile-dots .mobile-dot');
  const dotsOuter = document.querySelectorAll('#mobile-dots-outer .mobile-dot-outer');
  let mobileSlideIdx = 0;
  let startX = 0;
  let isDragging = false;

  function setMobileSlide(idx) {
    const total = dotsInner.length;
    mobileSlideIdx = (idx + total) % total;
    if (track) track.style.transform = `translateX(-${mobileSlideIdx * 100}%)`;
    dotsInner.forEach((d, i) => d.classList.toggle('mobile-dot--active', i === mobileSlideIdx));
    dotsOuter.forEach((d, i) => d.classList.toggle('mobile-dot-outer--active', i === mobileSlideIdx));
  }

  dotsInner.forEach((dot, i) => dot.addEventListener('click', () => setMobileSlide(i)));
  dotsOuter.forEach((dot, i) => dot.addEventListener('click', () => setMobileSlide(i)));

  if (track) {
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) setMobileSlide(mobileSlideIdx + (diff > 0 ? 1 : -1));
      isDragging = false;
    });
    // Mouse drag for desktop testing
    track.addEventListener('mousedown', (e) => { startX = e.clientX; isDragging = true; });
    track.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 50) setMobileSlide(mobileSlideIdx + (diff > 0 ? 1 : -1));
      isDragging = false;
    });
  }

  /* ==================== QUANTITY CONTROLS ==================== */
  let quantity = 1;

  function syncQty() {
    ['qty-val-d', 'qty-val-m', 'qty-val-sticky'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = quantity;
    });
    ['qty-minus-d', 'qty-minus-m', 'qty-minus-sticky'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = quantity <= 1;
    });
  }

  function setupQty(minusId, plusId) {
    const minus = document.getElementById(minusId);
    const plus = document.getElementById(plusId);
    if (minus) minus.addEventListener('click', () => { if (quantity > 1) { quantity--; syncQty(); } });
    if (plus)  plus.addEventListener('click', () => { quantity++; syncQty(); });
  }

  setupQty('qty-minus-d', 'qty-plus-d');
  setupQty('qty-minus-m', 'qty-plus-m');
  setupQty('qty-minus-sticky', 'qty-plus-sticky');
  syncQty();

  /* ==================== ADD TO CART ==================== */
  const productData = {
    id: 1,
    name: 'Barebells Chocolate Dough',
    brand: 'Barebells',
    price: 2.49,
    img: 'barebells.jpg'
  };

  function addToCart(btn) {
    if (!btn) return;
    window.SmikkieShop.addToCart(productData, quantity);

    // Button feedback
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Toegevoegd aan jouw mix!';
    btn.style.background = 'var(--green)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 2500);

    window.SmikkieShop.showToast(`${quantity}× ${productData.name} toegevoegd! 💜`);
  }

  ['add-to-cart-d', 'add-to-cart-m', 'add-to-cart-sticky'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => addToCart(btn));
  });

  /* ==================== RELATED PRODUCTS SLIDER ==================== */
  const relatedSlider = document.getElementById('related-slider');
  const relatedPrev = document.getElementById('related-prev');
  const relatedNext = document.getElementById('related-next');

  if (relatedSlider && window.innerWidth > 768) {
    let relatedOffset = 0;
    const cards = relatedSlider.querySelectorAll('.prod-card');
    const visible = 5;
    const total = cards.length;
    const maxOffset = Math.max(0, total - visible);

    function updateRelated() {
      const cardWidth = relatedSlider.offsetWidth / visible;
      relatedSlider.style.transform = `translateX(-${relatedOffset * cardWidth}px)`;
      relatedSlider.style.transition = 'transform 0.35s ease';
      if (relatedPrev) relatedPrev.disabled = relatedOffset === 0;
      if (relatedNext) relatedNext.disabled = relatedOffset >= maxOffset;
    }

    if (relatedPrev) relatedPrev.addEventListener('click', () => { if (relatedOffset > 0) { relatedOffset--; updateRelated(); } });
    if (relatedNext) relatedNext.addEventListener('click', () => { if (relatedOffset < maxOffset) { relatedOffset++; updateRelated(); } });
    updateRelated();
  }

  /* ==================== REVIEWS SLIDER ==================== */
  const reviewsSlider = document.getElementById('reviews-slider');
  const reviewsPrev = document.getElementById('reviews-prev');
  const reviewsNext = document.getElementById('reviews-next');

  if (reviewsSlider) {
    let reviewOffset = 0;
    const reviewCards = reviewsSlider.querySelectorAll('.review-card');
    const visibleReviews = 4;
    const maxReviewOffset = Math.max(0, reviewCards.length - visibleReviews);

    function updateReviews() {
      const cardWidth = reviewsSlider.offsetWidth / visibleReviews;
      reviewsSlider.style.transform = `translateX(-${reviewOffset * cardWidth}px)`;
      reviewsSlider.style.transition = 'transform 0.35s ease';
      if (reviewsPrev) reviewsPrev.disabled = reviewOffset === 0;
      if (reviewsNext) reviewsNext.disabled = reviewOffset >= maxReviewOffset;
    }

    if (reviewsPrev) reviewsPrev.addEventListener('click', () => { if (reviewOffset > 0) { reviewOffset--; updateReviews(); } });
    if (reviewsNext) reviewsNext.addEventListener('click', () => { if (reviewOffset < maxReviewOffset) { reviewOffset++; updateReviews(); } });
    updateReviews();
  }

  /* ==================== ACCORDIONS (Mobile) ==================== */
  document.querySelectorAll('.accordion__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const accordion = btn.closest('.accordion');
      const isOpen = accordion.classList.contains('accordion--open');
      // Close all
      document.querySelectorAll('.accordion').forEach(a => a.classList.remove('accordion--open'));
      // Open clicked if it was closed
      if (!isOpen) accordion.classList.add('accordion--open');
    });
  });

  /* ==================== STICKY BAR ==================== */
  const stickyBar = document.getElementById('sticky-bar');
  const productSection = document.querySelector('.product-section');

  function checkStickyBar() {
    if (!stickyBar || !productSection) return;
    const rect = productSection.getBoundingClientRect();
    if (rect.bottom < 0) {
      stickyBar.classList.add('sticky-bar--visible');
    } else {
      stickyBar.classList.remove('sticky-bar--visible');
    }
  }

  // On mobile, always show sticky bar
  if (window.innerWidth <= 768) {
    if (stickyBar) stickyBar.classList.add('sticky-bar--visible');
  } else {
    window.addEventListener('scroll', checkStickyBar, { passive: true });
  }

  /* ==================== RELATED + BUTTONS ==================== */
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.dataset.addToCart);
      const products = {
        1: { id: 1, name: 'Barebells Chocolate Dough', brand: 'Barebells', price: 2.49, img: 'barebells.jpg' },
        2: { id: 2, name: 'Peanut Caramel Bar', brand: "N!CK'S", price: 2.29, img: 'nicks.png' },
        3: { id: 3, name: 'Chocolate Chip Cookie', brand: 'Quest', price: 2.99, img: 'quest.jpg' },
        4: { id: 4, name: 'BCAA Passion', brand: 'NOCCO', price: 2.49, img: 'nocco.png' },
        5: { id: 5, name: 'zero sugar', brand: 'Fanta', price: 1.89, img: 'fanta.png' },
        6: { id: 6, name: 'Cookies & Cream', brand: 'Barebells', price: 2.49, img: 'barebells.jpg' }
      };
      if (products[id]) {
        window.SmikkieShop.addToCart(products[id], 1);
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        }, 1500);
        window.SmikkieShop.showToast(`${products[id].brand} ${products[id].name} toegevoegd! 💜`);
      }
    });
  });

});
