/**
 * SMIKKIE — Header & Footer Template Injector
 * Injects the shared header and footer into every page
 */

function getBasePath() {
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  // If we're in /pages/, depth is 2 (smikkie-shop/pages/file.html)
  // If we're in root, depth is 1 (smikkie-shop/file.html)
  const isInPages = window.location.pathname.includes('/pages/');
  return isInPages ? '../' : '';
}

function injectHeader() {
  const base = getBasePath();
  const headerEl = document.getElementById('site-header');
  if (!headerEl) return;

  const currentPage = window.location.pathname.split('/').pop();

  headerEl.innerHTML = `
    <div class="top-bar"></div>

    <!-- DESKTOP NAVBAR -->
    <nav class="navbar desktop-only">
      <div class="navbar__inner">
        <a href="${base}index.html" class="navbar__logo">
          <span class="logo-text">Smikkie<span class="logo-dot">.</span></span>
        </a>
        <div class="navbar__links">
          <a href="${base}pages/alle-snacks.html" class="nav-link ${currentPage === 'alle-snacks.html' ? 'nav-link--active' : ''}">Alle snacks</a>
          <a href="${base}pages/eiwitrepen.html" class="nav-link ${currentPage === 'eiwitrepen.html' ? 'nav-link--active' : ''}" data-mega="mega-eiwit">
            Eiwitrepen
            <svg class="nav-link__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <a href="${base}pages/snacks.html" class="nav-link ${currentPage === 'snacks.html' ? 'nav-link--active' : ''}" data-mega="mega-snacks">
            Snacks &amp; koekjes
            <svg class="nav-link__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <a href="${base}pages/drankjes.html" class="nav-link ${currentPage === 'drankjes.html' ? 'nav-link--active' : ''}">Drankjes</a>
          <a href="${base}pages/treats.html" class="nav-link ${currentPage === 'treats.html' ? 'nav-link--active' : ''}">Treats</a>
          <a href="${base}pages/favorieten.html" class="nav-link nav-link--fav ${currentPage === 'favorieten.html' ? 'nav-link--active' : ''}">Smikkie's favorieten</a>
          <a href="${base}pages/mix-box.html" class="nav-link nav-link--mixbox ${currentPage === 'mix-box.html' ? 'nav-link--active' : ''}">🎁 Mix-box</a>
        </div>
        <div class="navbar__actions">
          <button class="icon-btn" data-search-open aria-label="Zoeken">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <a href="${base}pages/account.html" class="icon-btn" aria-label="Account" style="display:flex;align-items:center;justify-content:center;text-decoration:none;color:inherit;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </a>
          <div class="cart-wrap">
            <button class="icon-btn cart-open-btn" aria-label="Winkelwagen" style="position:relative;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;padding:8px;border-radius:8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span class="cart-badge">0</span>
            </button>
          </div>
        </div>
      </div>

      <!-- MEGA MENU: Eiwitrepen -->
      <div class="mega-menu" id="mega-eiwit">
        <div class="mega-menu__inner mega-menu__inner--4col">
          <div class="mega-menu__col">
            <h4>Merken</h4>
            <ul>
              <li><a href="${base}pages/eiwitrepen.html?brand=barebells"><span class="menu-icon">🍫</span>Barebells</a></li>
              <li><a href="${base}pages/eiwitrepen.html?brand=nicks"><span class="menu-icon">🥜</span>N!CK'S</a></li>
              <li><a href="${base}pages/eiwitrepen.html?brand=quest"><span class="menu-icon">⭐</span>Quest</a></li>
              <li><a href="${base}pages/eiwitrepen.html?brand=smikkie"><span class="menu-icon">🐻</span>Smikkie</a></li>
            </ul>
          </div>
          <div class="mega-menu__col">
            <h4>Smaken</h4>
            <ul>
              <li><a href="${base}pages/eiwitrepen.html?smaak=chocolade"><span class="menu-icon">🍫</span>Chocolade</a></li>
              <li><a href="${base}pages/eiwitrepen.html?smaak=pindakaas"><span class="menu-icon">🥜</span>Pindakaas</a></li>
              <li><a href="${base}pages/eiwitrepen.html?smaak=vanille"><span class="menu-icon">🍦</span>Vanille</a></li>
              <li><a href="${base}pages/eiwitrepen.html?smaak=cookies"><span class="menu-icon">🍪</span>Cookies</a></li>
            </ul>
          </div>
          <div class="mega-menu__col">
            <h4>Populair</h4>
            <ul>
              <li><a href="${base}pages/product.html?id=1"><span class="menu-icon">⭐</span>Barebells Chocolate Dough</a></li>
              <li><a href="${base}pages/product.html?id=2"><span class="menu-icon">⭐</span>N!CK'S Peanut Caramel</a></li>
              <li><a href="${base}pages/product.html?id=6"><span class="menu-icon">⭐</span>Barebells Cookies & Cream</a></li>
              <li><a href="${base}pages/eiwitrepen.html"><span class="menu-icon">→</span>Alle eiwitrepen</a></li>
            </ul>
          </div>
          <div class="mega-menu__promo">
            <h3>Smikkie's tip 🐻</h3>
            <p>Probeer de Barebells Chocolate Dough — echt een aanrader!</p>
            <a href="${base}pages/product.html?id=1" class="btn btn--green btn--sm">Bekijk product →</a>
          </div>
        </div>
      </div>

      <!-- MEGA MENU: Snacks & koekjes -->
      <div class="mega-menu" id="mega-snacks">
        <div class="mega-menu__inner mega-menu__inner--4col">
          <div class="mega-menu__col">
            <h4>Categorieën</h4>
            <ul>
              <li><a href="${base}pages/snacks.html?cat=koekjes"><span class="menu-icon">🍪</span>Koekjes</a></li>
              <li><a href="${base}pages/snacks.html?cat=chips"><span class="menu-icon">🥨</span>Chips & crackers</a></li>
              <li><a href="${base}pages/snacks.html?cat=noten"><span class="menu-icon">🥜</span>Noten & zaden</a></li>
              <li><a href="${base}pages/snacks.html?cat=repen"><span class="menu-icon">🍫</span>Repen</a></li>
            </ul>
          </div>
          <div class="mega-menu__col">
            <h4>Merken</h4>
            <ul>
              <li><a href="${base}pages/snacks.html?brand=quest"><span class="menu-icon">⭐</span>Quest</a></li>
              <li><a href="${base}pages/snacks.html?brand=nicks"><span class="menu-icon">🥜</span>N!CK'S</a></li>
              <li><a href="${base}pages/snacks.html?brand=smikkie"><span class="menu-icon">🐻</span>Smikkie</a></li>
            </ul>
          </div>
          <div class="mega-menu__col">
            <h4>Populair</h4>
            <ul>
              <li><a href="${base}pages/product.html?id=3"><span class="menu-icon">⭐</span>Quest Chocolate Chip</a></li>
              <li><a href="${base}pages/snacks.html"><span class="menu-icon">→</span>Alle snacks & koekjes</a></li>
            </ul>
          </div>
          <div class="mega-menu__promo">
            <h3>Nieuw! 🍪</h3>
            <p>Quest Chocolate Chip Cookie — perfect als gezonde snack.</p>
            <a href="${base}pages/product.html?id=3" class="btn btn--green btn--sm">Bekijk product →</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- SEARCH OVERLAY -->
    <div id="search-overlay">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9090B0" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="search-input" placeholder="Zoek naar snacks, merken...">
      <div id="search-results" class="search-results"></div>
      <button id="search-close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- MOBILE HEADER -->
    <div class="mobile-header mobile-only mobile-flex">
      <button class="mobile-menu-btn" aria-label="Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <a href="${base}index.html" class="mobile-logo">
        <span class="logo-text">Smikkie<span class="logo-dot">.</span></span>
      </a>
      <div class="cart-wrap">
        <button class="mobile-cart-btn cart-open-btn" aria-label="Winkelwagen" style="position:relative;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="cart-badge">0</span>
        </button>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <div id="mobile-menu">
      <div class="mobile-menu__backdrop"></div>
      <div class="mobile-menu__panel">
        <div class="mobile-menu__header">
          <span class="logo-text">Smikkie<span class="logo-dot">.</span></span>
          <button class="mobile-menu__close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="mobile-menu__search">
          <div class="mobile-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9090B0" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="mobile-search-input" placeholder="Zoek snacks...">
          </div>
        </div>
        <div class="mobile-menu__body">
          <!-- Level 0: Main -->
          <div class="mobile-nav-level" id="mobile-level-0">
            <a href="${base}pages/alle-snacks.html" class="mobile-nav-item">
              <span>Alle snacks</span>
            </a>
            <div class="mobile-nav-item mobile-nav-item--has-sub" data-level="mobile-level-eiwit">
              <span>Eiwitrepen</span>
              <svg class="mobile-nav-item__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <div class="mobile-nav-item mobile-nav-item--has-sub" data-level="mobile-level-snacks">
              <span>Snacks &amp; koekjes</span>
              <svg class="mobile-nav-item__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <a href="${base}pages/drankjes.html" class="mobile-nav-item">
              <span>Drankjes</span>
            </a>
            <a href="${base}pages/treats.html" class="mobile-nav-item">
              <span>Treats</span>
            </a>
            <a href="${base}pages/favorieten.html" class="mobile-nav-item mobile-nav-item--purple">
              <span>Smikkie's favorieten ⭐</span>
            </a>
            <a href="${base}pages/mix-box.html" class="mobile-nav-item mobile-nav-item--purple">
              <span>Mix-box samenstellen 🎁</span>
            </a>
          </div>
          <!-- Level 1: Eiwitrepen -->
          <div class="mobile-nav-level mobile-nav-level--right" id="mobile-level-eiwit" data-parent="mobile-level-0">
            <button class="mobile-nav-back" data-parent="mobile-level-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Terug
            </button>
            <div class="mobile-nav-sub-title">Eiwitrepen</div>
            <a href="${base}pages/eiwitrepen.html" class="mobile-nav-item">Alle eiwitrepen</a>
            <a href="${base}pages/eiwitrepen.html?brand=barebells" class="mobile-nav-item">Barebells</a>
            <a href="${base}pages/eiwitrepen.html?brand=nicks" class="mobile-nav-item">N!CK'S</a>
            <a href="${base}pages/eiwitrepen.html?brand=quest" class="mobile-nav-item">Quest</a>
          </div>
          <!-- Level 1: Snacks -->
          <div class="mobile-nav-level mobile-nav-level--right" id="mobile-level-snacks" data-parent="mobile-level-0">
            <button class="mobile-nav-back" data-parent="mobile-level-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Terug
            </button>
            <div class="mobile-nav-sub-title">Snacks &amp; koekjes</div>
            <a href="${base}pages/snacks.html" class="mobile-nav-item">Alle snacks</a>
            <a href="${base}pages/snacks.html?cat=koekjes" class="mobile-nav-item">Koekjes</a>
            <a href="${base}pages/snacks.html?cat=chips" class="mobile-nav-item">Chips &amp; crackers</a>
            <a href="${base}pages/snacks.html?cat=noten" class="mobile-nav-item">Noten &amp; zaden</a>
          </div>
        </div>
        <div class="mobile-menu__footer">
          <a href="${base}pages/mix.html" class="mobile-menu__cta">Stel jouw mix samen →</a>
          <div class="mobile-menu__trust">
            <span>📦 Gratis v.a. €40</span>
            <span>🚚 Morgen in huis</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function injectFooter() {
  const footerEl = document.getElementById('site-footer');
  if (!footerEl) return;
  const base = getBasePath();

  footerEl.innerHTML = `
    <footer class="footer">
      <div class="footer__trust">
        <div class="container">
          <div class="footer__trust-grid">
            <div class="footer__trust-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <div>
                <strong>Gratis verzending</strong>
                <span>vanaf €40</span>
              </div>
            </div>
            <div class="footer__trust-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <strong>Voor 23:59 besteld,</strong>
                <span>morgen in huis</span>
              </div>
            </div>
            <div class="footer__trust-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <div>
                <strong>Achteraf betalen</strong>
                <span>met Klarna</span>
              </div>
            </div>
            <div class="footer__trust-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <div>
                <strong>Niet goed, geld terug</strong>
                <span>14 dagen bedenktijd</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__main">
        <div class="container">
          <div class="footer__grid">
            <div class="footer__brand">
              <a href="${base}index.html" class="logo-text" style="font-size:28px;">Smikkie<span class="logo-dot">.</span></a>
              <p>Lekker snacken, zonder schuldgevoel. De lekkerste snacks & drankjes als gezondere alternatieven.</p>
              <div class="footer__social">
                <a href="#" class="footer__social-btn" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" class="footer__social-btn" aria-label="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/></svg>
                </a>
              </div>
            </div>
            <div class="footer__col">
              <h4>Snacks</h4>
              <ul>
                <li><a href="${base}pages/alle-snacks.html">Alle snacks</a></li>
                <li><a href="${base}pages/eiwitrepen.html">Eiwitrepen</a></li>
                <li><a href="${base}pages/snacks.html">Snacks & koekjes</a></li>
                <li><a href="${base}pages/drankjes.html">Drankjes</a></li>
                <li><a href="${base}pages/treats.html">Treats</a></li>
                <li><a href="${base}pages/favorieten.html">Smikkie's favorieten</a></li>
              </ul>
            </div>
            <div class="footer__col">
              <h4>Smikkie</h4>
              <ul>
                <li><a href="${base}pages/mix.html">Stel jouw mix samen</a></li>
                <li><a href="${base}pages/over-ons.html">Over Smikkie</a></li>
                <li><a href="${base}pages/blog.html">Blog</a></li>
                <li><a href="${base}pages/contact.html">Klantenservice</a></li>
                <li><a href="${base}pages/contact.html">Contact</a></li>
                <li><a href="${base}pages/reviews.html">Reviews</a></li>
              </ul>
            </div>
            <div class="footer__col">
              <h4>Info</h4>
              <ul>
                <li><a href="${base}pages/verzending.html">Verzending & retour</a></li>
                <li><a href="${base}pages/retourbeleid.html">Retourbeleid</a></li>
                <li><a href="${base}pages/betaalopties.html">Betaalopties</a></li>
                <li><a href="${base}pages/privacybeleid.html">Privacybeleid</a></li>
                <li><a href="${base}pages/algemene-voorwaarden.html">Algemene voorwaarden</a></li>
                <li><a href="${base}pages/cookiebeleid.html">Cookiebeleid</a></li>
                <li><a href="${base}pages/disclaimer.html">Disclaimer</a></li>
                <li><a href="${base}pages/faq.html">Veelgestelde vragen</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="container">
          <span>© 2026 Smikkie. Alle rechten voorbehouden.</span>
          <div class="footer__payments">
            <span class="payment-icon">iDEAL</span>
            <span class="payment-icon">Klarna</span>
            <span class="payment-icon">Visa</span>
            <span class="payment-icon">MC</span>
            <span class="payment-icon">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();
});
