/**
 * SMIKKIE WEBSHOP — Shared JavaScript
 * Unified SmikkieShop namespace for all pages
 * Handles: cart, mega menu, mobile menu, search, toast, scroll animations
 */

/* =============================================
   PRODUCT DATABASE
   ============================================= */
const PRODUCTS = [
  { id: 1,  brand: 'Barebells', name: 'Chocolate Dough',       fullName: 'Barebells Chocolate Dough',       price: 2.49, img: 'barebells.jpg', cat: 'eiwitrepen', tags: ['eiwit','chocolade'] },
  { id: 2,  brand: "N!CK'S",   name: 'Peanut Caramel Bar',     fullName: "N!CK'S Peanut Caramel Bar",       price: 2.29, img: 'nicks.png',     cat: 'eiwitrepen', tags: ['eiwit','pindakaas'] },
  { id: 3,  brand: 'Quest',    name: 'Chocolate Chip Cookie',  fullName: 'Quest Chocolate Chip Cookie',     price: 2.99, img: 'quest.jpg',     cat: 'snacks',     tags: ['koekje','chocolade'] },
  { id: 4,  brand: 'NOCCO',    name: 'BCAA Passion',           fullName: 'NOCCO BCAA Passion',              price: 2.49, img: 'nocco.png',     cat: 'drankjes',   tags: ['bcaa','energie'] },
  { id: 5,  brand: 'Fanta',    name: 'Zero Sugar',             fullName: 'Fanta Zero Sugar',                price: 1.89, img: 'fanta.png',     cat: 'drankjes',   tags: ['frisdrank','zero'] },
  { id: 6,  brand: 'Barebells', name: 'Cookies & Cream',       fullName: 'Barebells Cookies & Cream',       price: 2.49, img: 'barebells.jpg', cat: 'eiwitrepen', tags: ['eiwit','cookies'] },
  { id: 7,  brand: 'Barebells', name: 'Caramel Cashew',        fullName: 'Barebells Caramel Cashew',        price: 2.49, img: 'barebells.jpg', cat: 'eiwitrepen', tags: ['eiwit','caramel'] },
  { id: 8,  brand: "N!CK'S",   name: 'Wafer Bar Chocolate',   fullName: "N!CK'S Wafer Bar Chocolate",      price: 1.99, img: 'nicks.png',     cat: 'snacks',     tags: ['wafer','chocolade'] },
  { id: 9,  brand: 'Quest',    name: 'Double Chocolate Chip',  fullName: 'Quest Double Chocolate Chip',     price: 2.99, img: 'quest.jpg',     cat: 'snacks',     tags: ['koekje','chocolade'] },
  { id: 10, brand: 'NOCCO',    name: 'BCAA Caribbean',         fullName: 'NOCCO BCAA Caribbean',            price: 2.49, img: 'nocco.png',     cat: 'drankjes',   tags: ['bcaa','energie'] },
  { id: 11, brand: 'SmartSweets', name: 'Gummy Bears',         fullName: 'SmartSweets Gummy Bears',         price: 2.99, img: 'quest.jpg',     cat: 'treats',     tags: ['snoep','gummies'] },
  { id: 12, brand: "N!CK'S",   name: 'Chocolate Peanut Cups', fullName: "N!CK'S Chocolate Peanut Cups",    price: 2.49, img: 'nicks.png',     cat: 'treats',     tags: ['chocolade','pindakaas'] },
];

/* =============================================
   HELPER: Resolve image path based on page depth
   ============================================= */
function resolveImgPath(imgFilename) {
  const isInPages = window.location.pathname.includes('/pages/');
  const base = isInPages ? '../images/' : 'images/';
  // If already a full path, extract filename
  const filename = imgFilename.split('/').pop();
  return base + filename;
}

/* =============================================
   CART STATE (localStorage)
   ============================================= */
let _cart = [];
try { _cart = JSON.parse(localStorage.getItem('smikkie_cart') || '[]'); } catch(e) { _cart = []; }

function _saveCart() {
  localStorage.setItem('smikkie_cart', JSON.stringify(_cart));
  // Sync global reference
  window.SmikkieShop.cart = _cart;
}

function _getCartCount() {
  return _cart.reduce((sum, item) => sum + item.qty, 0);
}

function _getCartTotal() {
  return _cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/**
 * addToCart — accepts either:
 *   addToCart(productId: number, qty: number)
 *   addToCart(productObj: {id, name, price, img, ...}, qty: number)
 */
function _addToCart(productOrId, qty = 1) {
  let product;
  if (typeof productOrId === 'number') {
    product = PRODUCTS.find(p => p.id === productOrId);
    if (!product) return;
    product = { ...product };
  } else {
    // Object passed directly — normalize it
    product = {
      id: productOrId.id || Date.now(),
      brand: productOrId.brand || '',
      name: productOrId.name || productOrId.fullName || '',
      fullName: productOrId.fullName || ((productOrId.brand || '') + ' ' + (productOrId.name || '')).trim(),
      price: productOrId.price || 0,
      img: productOrId.img || 'barebells.jpg',
      cat: productOrId.cat || '',
      tags: productOrId.tags || [],
    };
  }

  const existing = _cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    _cart.push({ ...product, qty });
  }
  _saveCart();
  _updateCartUI();
  _showToast(`${product.fullName || product.name} toegevoegd! 💜`);
}

function _removeFromCart(productId) {
  _cart = _cart.filter(i => i.id !== productId);
  _saveCart();
  _updateCartUI();
  _renderCartItems();
}

function _updateCartQty(productId, delta) {
  const item = _cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  _saveCart();
  _updateCartUI();
  _renderCartItems();
}

function _clearCart() {
  _cart = [];
  _saveCart();
  _updateCartUI();
}

function _updateCartUI() {
  const count = _getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.classList.add('cart-badge--bump');
    setTimeout(() => badge.classList.remove('cart-badge--bump'), 300);
  });
  const countEl = document.querySelector('.cart-header__count');
  if (countEl) countEl.textContent = `${count} item${count !== 1 ? 's' : ''}`;
}

function _renderCartItems() {
  const container = document.getElementById('cart-items-list');
  if (!container) return;

  if (_cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__icon">🛒</div>
        <p>Je mix is nog leeg.<br>Voeg snacks toe!</p>
        <a href="${window.location.pathname.includes('/pages/') ? '../' : ''}index.html" class="btn btn--primary btn--sm">Bekijk alle snacks</a>
      </div>`;
    const tv = document.getElementById('cart-total-val');
    const sv = document.getElementById('cart-subtotal-val');
    if (tv) tv.textContent = '€0,00';
    if (sv) sv.textContent = '€0,00';
    return;
  }

  container.innerHTML = _cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item__img">
        <img src="${resolveImgPath(item.img)}" alt="${item.fullName || item.name}" onerror="this.src='${resolveImgPath('barebells.jpg')}'">
      </div>
      <div class="cart-item__info">
        <div class="cart-item__brand">${item.brand || ''}</div>
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">€${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="cart-item__actions">
        <div class="cart-item__qty-ctrl">
          <button class="cart-item__qty-btn" onclick="window.SmikkieShop.updateCartQty(${item.id}, -1)">−</button>
          <span class="cart-item__qty-val">${item.qty}</span>
          <button class="cart-item__qty-btn" onclick="window.SmikkieShop.updateCartQty(${item.id}, 1)">+</button>
        </div>
        <button class="cart-item__remove" onclick="window.SmikkieShop.removeFromCart(${item.id})" title="Verwijderen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  const total = _getCartTotal();
  const fmt = (p) => '€' + p.toFixed(2).replace('.', ',');
  const sv = document.getElementById('cart-subtotal-val');
  const tv = document.getElementById('cart-total-val');
  if (sv) sv.textContent = fmt(total);
  if (tv) tv.textContent = fmt(total);

  const freeEl = document.getElementById('cart-free-shipping');
  if (freeEl) {
    if (total >= 40) {
      freeEl.textContent = '🎉 Gratis verzending!';
      freeEl.style.color = 'var(--green-dark)';
    } else {
      freeEl.textContent = `Nog €${(40 - total).toFixed(2).replace('.', ',')} voor gratis verzending`;
      freeEl.style.color = 'var(--gray)';
    }
  }
}

/* =============================================
   CART SIDEBAR
   ============================================= */
function _initCartSidebar() {
  const isInPages = window.location.pathname.includes('/pages/');
  const cartPageUrl = isInPages ? 'winkelwagen.html' : 'pages/winkelwagen.html';

  const sidebar = document.createElement('div');
  sidebar.id = 'cart-sidebar';
  sidebar.innerHTML = `
    <div class="cart-header">
      <div>
        <h3>Jouw Smikkie mix 💜</h3>
        <span class="cart-header__count">${_getCartCount()} items</span>
      </div>
      <button class="cart-close-btn" id="cart-close-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="cart-items" id="cart-items-list"></div>
    <div class="cart-footer">
      <div class="cart-subtotal"><span>Subtotaal</span><span id="cart-subtotal-val">€0,00</span></div>
      <div class="cart-total"><span>Totaal</span><span id="cart-total-val">€0,00</span></div>
      <div class="cart-free-shipping" id="cart-free-shipping">Nog €40,00 voor gratis verzending</div>
      <a href="${cartPageUrl}" class="cart-checkout-btn">Naar winkelwagen →</a>
      <button class="cart-continue-btn" id="cart-continue-btn">Verder winkelen</button>
      <div class="cart-trust">
        <span>🔒 Veilig betalen</span>
        <span>📦 Gratis v.a. €40</span>
        <span>↩ Retour 14 dagen</span>
      </div>
    </div>
  `;

  const backdrop = document.createElement('div');
  backdrop.id = 'cart-backdrop';
  document.body.appendChild(backdrop);
  document.body.appendChild(sidebar);

  _renderCartItems();

  function openCart() {
    sidebar.classList.add('cart--open');
    backdrop.classList.add('cart--open');
    document.body.style.overflow = 'hidden';
    _renderCartItems();
  }
  function closeCart() {
    sidebar.classList.remove('cart--open');
    backdrop.classList.remove('cart--open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.cart-open-btn, [data-cart-open]').forEach(btn => btn.addEventListener('click', openCart));
  document.getElementById('cart-close-btn').addEventListener('click', closeCart);
  backdrop.addEventListener('click', closeCart);
  document.getElementById('cart-continue-btn').addEventListener('click', closeCart);

  window.SmikkieShop.openCart = openCart;
  window.SmikkieShop.closeCart = closeCart;
}

/* =============================================
   MEGA MENU
   ============================================= */
function _initMegaMenu() {
  const navLinks = document.querySelectorAll('.nav-link[data-mega]');
  const megaMenus = document.querySelectorAll('.mega-menu');
  let closeTimer = null;
  let activeMenu = null;

  function openMenu(menuId) {
    clearTimeout(closeTimer);
    megaMenus.forEach(m => m.classList.remove('mega-menu--open'));
    navLinks.forEach(l => l.classList.remove('mega--open'));
    const menu = document.getElementById(menuId);
    const link = document.querySelector(`[data-mega="${menuId}"]`);
    if (menu) { menu.classList.add('mega-menu--open'); activeMenu = menuId; }
    if (link) link.classList.add('mega--open');
  }

  function closeMenus() {
    closeTimer = setTimeout(() => {
      megaMenus.forEach(m => m.classList.remove('mega-menu--open'));
      navLinks.forEach(l => l.classList.remove('mega--open'));
      activeMenu = null;
    }, 150);
  }

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => openMenu(link.dataset.mega));
    link.addEventListener('mouseleave', closeMenus);
    link.addEventListener('click', (e) => {
      if (link.dataset.mega) {
        e.preventDefault();
        activeMenu === link.dataset.mega ? closeMenus() : openMenu(link.dataset.mega);
      }
    });
  });

  megaMenus.forEach(menu => {
    menu.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    menu.addEventListener('mouseleave', closeMenus);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-link') && !e.target.closest('.mega-menu')) {
      megaMenus.forEach(m => m.classList.remove('mega-menu--open'));
      navLinks.forEach(l => l.classList.remove('mega--open'));
      activeMenu = null;
    }
  });
}

/* =============================================
   MOBILE MENU
   ============================================= */
function _initMobileMenu() {
  const menuEl = document.getElementById('mobile-menu');
  if (!menuEl) return;

  const backdrop = menuEl.querySelector('.mobile-menu__backdrop');
  const closeBtn = menuEl.querySelector('.mobile-menu__close');
  const openBtn = document.querySelector('.mobile-menu-btn');

  function openMenu() {
    menuEl.classList.add('menu--open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menuEl.classList.remove('menu--open');
    document.body.style.overflow = '';
    setTimeout(() => {
      document.querySelectorAll('.mobile-nav-level').forEach((level, i) => {
        level.classList.remove('mobile-nav-level--hidden', 'mobile-nav-level--right');
        if (i > 0) level.classList.add('mobile-nav-level--right');
      });
    }, 300);
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav-item--has-sub').forEach(item => {
    item.addEventListener('click', () => {
      const targetLevel = item.dataset.level;
      const currentLevel = item.closest('.mobile-nav-level');
      const nextLevel = document.getElementById(targetLevel);
      if (currentLevel && nextLevel) {
        currentLevel.classList.add('mobile-nav-level--hidden');
        nextLevel.classList.remove('mobile-nav-level--right');
      }
    });
  });

  document.querySelectorAll('.mobile-nav-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentLevel = btn.closest('.mobile-nav-level');
      const parentId = currentLevel.dataset.parent;
      const parentLevel = document.getElementById(parentId);
      if (currentLevel && parentLevel) {
        currentLevel.classList.add('mobile-nav-level--right');
        parentLevel.classList.remove('mobile-nav-level--hidden');
      }
    });
  });

  const searchInput = menuEl.querySelector('.mobile-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        const isInPages = window.location.pathname.includes('/pages/');
        window.location.href = `${isInPages ? '' : 'pages/'}alle-snacks.html?q=${encodeURIComponent(e.target.value)}`;
      }
    });
  }
}

/* =============================================
   SEARCH OVERLAY
   ============================================= */
function _initSearch() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;

  const input = document.getElementById('search-input');
  const closeBtn = document.getElementById('search-close');
  const openBtns = document.querySelectorAll('[data-search-open]');
  const resultsEl = document.getElementById('search-results');
  const isInPages = window.location.pathname.includes('/pages/');

  function openSearch() {
    overlay.classList.add('search--open');
    setTimeout(() => input && input.focus(), 100);
  }
  function closeSearch() {
    overlay.classList.remove('search--open');
    if (resultsEl) resultsEl.classList.remove('has-results');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openSearch));
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  if (input && resultsEl) {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      if (q.length < 2) { resultsEl.classList.remove('has-results'); return; }
      const matches = PRODUCTS.filter(p =>
        p.fullName.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      ).slice(0, 5);
      if (!matches.length) { resultsEl.classList.remove('has-results'); return; }
      resultsEl.innerHTML = matches.map(p => `
        <a href="${isInPages ? '' : 'pages/'}product.html?id=${p.id}" class="search-result-item">
          <img src="${resolveImgPath(p.img)}" alt="${p.fullName}" onerror="this.src='${resolveImgPath('barebells.jpg')}'">
          <div class="search-result-item__info">
            <div class="search-result-item__name">${p.fullName}</div>
            <div class="search-result-item__price">€${p.price.toFixed(2).replace('.', ',')}</div>
          </div>
        </a>
      `).join('');
      resultsEl.classList.add('has-results');
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `${isInPages ? '' : 'pages/'}alle-snacks.html?q=${encodeURIComponent(input.value)}`;
      }
    });
  }
}

/* =============================================
   TOAST
   ============================================= */
function _showToast(msg) {
  let toast = document.getElementById('smikkie-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'smikkie-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('toast--visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('toast--visible'), 2800);
}

/* =============================================
   SCROLL ANIMATIONS
   ============================================= */
function _initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' });
  els.forEach(el => observer.observe(el));
  // Also immediately reveal elements already in viewport
  setTimeout(() => {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) el.classList.add('visible');
    });
  }, 50);
}

/* =============================================
   STICKY NAVBAR
   ============================================= */
function _initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* =============================================
   ADD TO CART BUTTONS (generic data-add-to-cart)
   ============================================= */
function _initAddToCartBtns() {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    // Skip if already has a specific listener (product.js handles its own)
    if (btn.dataset.cartInited) return;
    btn.dataset.cartInited = 'true';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = parseInt(btn.dataset.addToCart);
      const qty = parseInt(btn.dataset.qty || '1');
      _addToCart(productId, qty);
      const origHTML = btn.innerHTML;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      btn.style.background = 'var(--green)';
      setTimeout(() => { btn.innerHTML = origHTML; btn.style.background = ''; }, 1500);
    });
  });
}

/* =============================================
   EXPOSE GLOBAL SmikkieShop NAMESPACE
   ============================================= */
window.SmikkieShop = {
  // Cart
  cart: _cart,
  getCart: () => _cart,
  getCartCount: _getCartCount,
  getCartTotal: _getCartTotal,
  addToCart: _addToCart,
  removeFromCart: _removeFromCart,
  updateCartQty: _updateCartQty,
  clearCart: _clearCart,
  renderCartItems: _renderCartItems,
  updateCartUI: _updateCartUI,
  // UI
  showToast: _showToast,
  openCart: null, // set after sidebar init
  closeCart: null,
  // Products
  products: PRODUCTS,
  resolveImgPath,
};

// Legacy aliases for backward compat
window.addToCart = _addToCart;
window.removeFromCart = _removeFromCart;
window.updateCartQty = _updateCartQty;
window.showToast = _showToast;
window.PRODUCTS = PRODUCTS;

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;
  const isCheckout = currentPage.includes('checkout.html');
  const isConfirmation = currentPage.includes('bestelling-bevestigd.html');
  const isAccount = currentPage.includes('account.html');
  const isMinimalPage = isCheckout || isConfirmation || isAccount;

  _updateCartUI();

  if (!isMinimalPage) {
    _initCartSidebar();
    _initMegaMenu();
    _initMobileMenu();
    _initSearch();
  }

  _initScrollAnimations();
  _initStickyNavbar();
  // Delay add-to-cart init slightly so page-specific JS can run first
  setTimeout(_initAddToCartBtns, 100);
});
