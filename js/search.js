/* =============================================
   SMIKKIE — ZOEKFUNCTIE v32
   ============================================= */

(function () {
  const PRODUCTS = [
    { id: 1,  brand: 'Barebells', name: 'Chocolate Dough',       slug: 'barebells-chocolate-dough',      price: 2.49, img: 'barebells.jpg', cat: 'Eiwitrepen', tags: ['eiwit','chocolade','reep'] },
    { id: 2,  brand: "N!CK'S",   name: 'Peanut Caramel Bar',     slug: 'nicks-peanut-caramel',           price: 2.29, img: 'nicks.png',     cat: 'Eiwitrepen', tags: ['eiwit','pindakaas','caramel'] },
    { id: 3,  brand: 'Quest',    name: 'Chocolate Chip Cookie',  slug: 'quest-chocolate-chip-cookie',    price: 2.99, img: 'quest.jpg',     cat: 'Snacks',     tags: ['koekje','chocolade','chip'] },
    { id: 4,  brand: 'NOCCO',    name: 'BCAA Passion',           slug: 'nocco-bcaa-passion',             price: 2.49, img: 'nocco.png',     cat: 'Drankjes',   tags: ['bcaa','energie','passion'] },
    { id: 5,  brand: 'Fanta',    name: 'Zero Sugar',             slug: 'fanta-zero-sugar',               price: 1.89, img: 'fanta.png',     cat: 'Drankjes',   tags: ['frisdrank','zero','sinaasappel'] },
    { id: 6,  brand: 'Barebells', name: 'Cookies & Cream',       slug: 'barebells-cookies-cream',        price: 2.49, img: 'barebells.jpg', cat: 'Eiwitrepen', tags: ['eiwit','cookies','cream'] },
    { id: 7,  brand: 'Barebells', name: 'Caramel Cashew',        slug: 'barebells-caramel-cashew',       price: 2.49, img: 'barebells.jpg', cat: 'Eiwitrepen', tags: ['eiwit','caramel','cashew'] },
    { id: 8,  brand: "N!CK'S",   name: 'Wafer Bar Chocolate',   slug: 'nicks-wafer-bar-chocolate',      price: 1.99, img: 'nicks.png',     cat: 'Snacks',     tags: ['wafer','chocolade'] },
    { id: 9,  brand: 'Quest',    name: 'Double Chocolate Chip',  slug: 'quest-double-chocolate-chip',    price: 2.99, img: 'quest.jpg',     cat: 'Snacks',     tags: ['koekje','chocolade','dubbel'] },
    { id: 10, brand: 'NOCCO',    name: 'BCAA Caribbean',         slug: 'nocco-bcaa-caribbean',           price: 2.49, img: 'nocco.png',     cat: 'Drankjes',   tags: ['bcaa','energie','caribbean','mango'] },
    { id: 11, brand: 'SmartSweets', name: 'Gummy Bears',         slug: 'smartsweets-gummy-bears',        price: 2.99, img: 'quest.jpg',     cat: 'Treats',     tags: ['snoep','gummies','beer'] },
    { id: 12, brand: "N!CK'S",   name: 'Chocolate Peanut Cups', slug: 'nicks-chocolate-peanut-cups',    price: 2.49, img: 'nicks.png',     cat: 'Treats',     tags: ['chocolade','pindakaas','cups'] },
  ];

  const PAGES = [
    { title: 'Mix-box',            url: 'mix-box.html',        desc: 'Bouw jouw eigen snackbox' },
    { title: 'Eiwitrepen',         url: 'eiwitrepen.html',     desc: 'Alle eiwitrepen in één doos' },
    { title: 'Drankjes',           url: 'drankjes.html',       desc: 'NOCCO, Fanta Zero en meer' },
    { title: 'Snacks & koekjes',   url: 'snacks-koekjes.html', desc: 'Quest, N!CK\'s en meer' },
    { title: 'Treats',             url: 'treats-mix.html',     desc: 'Gummies, chocolade en meer' },
    { title: 'Winkelwagen',        url: 'winkelwagen.html',    desc: 'Jouw mix' },
    { title: 'Verzending & retour',url: 'verzending.html',     desc: 'Alles over bezorging' },
    { title: 'Over Smikkie',       url: 'over-ons.html',       desc: 'Ons verhaal' },
    { title: 'Contact',            url: 'contact.html',        desc: 'Neem contact op' },
  ];

  function search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return { products: [], pages: [] };

    const products = PRODUCTS.filter(p => {
      const haystack = [p.brand, p.name, p.cat, ...p.tags].join(' ').toLowerCase();
      return haystack.includes(q);
    }).slice(0, 6);

    const pages = PAGES.filter(p => {
      return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    }).slice(0, 3);

    return { products, pages };
  }

  function renderResults(results, query) {
    const container = document.getElementById('search-results');
    if (!container) return;

    if (!query.trim()) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    const { products, pages } = results;

    if (products.length === 0 && pages.length === 0) {
      container.innerHTML = `<div class="search-no-results">Geen resultaten voor "<strong>${query}</strong>"</div>`;
      container.style.display = 'block';
      return;
    }

    let html = '';

    if (products.length > 0) {
      html += `<div class="search-section-label">Producten</div>`;
      html += products.map(p => `
        <a href="${p.slug}.html" class="search-result-item">
          <img src="../images/${p.img}" alt="${p.brand} ${p.name}" class="search-result-img">
          <div class="search-result-info">
            <span class="search-result-brand">${p.brand}</span>
            <span class="search-result-name">${p.name}</span>
            <span class="search-result-cat">${p.cat}</span>
          </div>
          <span class="search-result-price">€${p.price.toFixed(2).replace('.', ',')}</span>
        </a>
      `).join('');
    }

    if (pages.length > 0) {
      html += `<div class="search-section-label">Pagina's</div>`;
      html += pages.map(p => `
        <a href="${p.url}" class="search-result-item search-result-item--page">
          <div class="search-result-page-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="search-result-info">
            <span class="search-result-name">${p.title}</span>
            <span class="search-result-cat">${p.desc}</span>
          </div>
        </a>
      `).join('');
    }

    html += `<a href="zoeken.html?q=${encodeURIComponent(query)}" class="search-view-all">Bekijk alle resultaten voor "${query}" →</a>`;

    container.innerHTML = html;
    container.style.display = 'block';
  }

  function initSearchOverlay() {
    // Create overlay HTML
    const overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.className = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-overlay__backdrop"></div>
      <div class="search-overlay__box">
        <div class="search-overlay__header">
          <div class="search-overlay__input-wrap">
            <svg class="search-overlay__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="search-input" class="search-overlay__input" placeholder="Zoek een product, merk of categorie..." autocomplete="off" autofocus>
            <button id="search-clear" class="search-overlay__clear" style="display:none;">✕</button>
          </div>
          <button id="search-close" class="search-overlay__close">Sluiten</button>
        </div>
        <div id="search-results" class="search-results" style="display:none;"></div>
        <div class="search-suggestions">
          <span class="search-suggestions__label">Populair:</span>
          <button class="search-suggestion" data-q="Barebells">Barebells</button>
          <button class="search-suggestion" data-q="NOCCO">NOCCO</button>
          <button class="search-suggestion" data-q="Quest">Quest</button>
          <button class="search-suggestion" data-q="chocolade">Chocolade</button>
          <button class="search-suggestion" data-q="pindakaas">Pindakaas</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');
    const closeBtn = document.getElementById('search-close');
    const backdrop = overlay.querySelector('.search-overlay__backdrop');

    let debounceTimer;

    input.addEventListener('input', () => {
      const q = input.value;
      clearBtn.style.display = q ? 'block' : 'none';
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderResults(search(q), q);
      }, 150);
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      renderResults({ products: [], pages: [] }, '');
      input.focus();
    });

    function closeOverlay() {
      overlay.classList.remove('search-overlay--open');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeOverlay);
    backdrop.addEventListener('click', closeOverlay);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeOverlay();
    });

    // Suggestion chips
    overlay.querySelectorAll('.search-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.dataset.q;
        clearBtn.style.display = 'block';
        renderResults(search(btn.dataset.q), btn.dataset.q);
        input.focus();
      });
    });

    // Hook up search button in header
    document.addEventListener('click', (e) => {
      const searchBtn = e.target.closest('[data-search-trigger], .header-search-btn, [hint="Zoeken"]');
      if (searchBtn) {
        e.preventDefault();
        overlay.classList.add('search-overlay--open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => input.focus(), 100);
      }
    });

    // Also hook up search icon by aria-label
    const searchBtns = document.querySelectorAll('button[aria-label="Zoeken"], .nav-icon--search');
    searchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('search-overlay--open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => input.focus(), 100);
      });
    });
  }

  // Init after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchOverlay);
  } else {
    initSearchOverlay();
  }

  // Also hook search button after header template loads
  document.addEventListener('smikkieHeaderReady', () => {
    const searchBtn = document.querySelector('.header-search-btn, [data-search-trigger]');
    if (searchBtn) {
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('search-overlay').classList.add('search-overlay--open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('search-input').focus(), 100);
      });
    }
  });

})();
