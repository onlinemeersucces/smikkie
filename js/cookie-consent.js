/* =============================================
   SMIKKIE — COOKIE CONSENT v32
   GDPR-compliant cookie banner
   ============================================= */

(function () {
  const STORAGE_KEY = 'smikkie_cookie_consent';
  const COOKIE_VERSION = '1';

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }
  function saveConsent(prefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, version: COOKIE_VERSION, date: new Date().toISOString() }));
  }

  function injectBanner() {
    const consent = getConsent();
    if (consent && consent.version === COOKIE_VERSION) return; // Already decided

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-instellingen');
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <div class="cookie-banner__content">
          <div class="cookie-banner__icon">🍪</div>
          <div class="cookie-banner__text">
            <strong>Wij gebruiken cookies</strong>
            <p>Smikkie gebruikt cookies om jouw winkelervaring te verbeteren, statistieken bij te houden en gepersonaliseerde advertenties te tonen. Lees meer in ons <a href="cookiebeleid.html" class="cookie-link">cookiebeleid</a>.</p>
          </div>
        </div>
        <div class="cookie-banner__actions">
          <button id="cookie-accept-all" class="btn btn--primary btn--sm">Alles accepteren</button>
          <button id="cookie-accept-necessary" class="btn btn--ghost btn--sm">Alleen noodzakelijk</button>
          <button id="cookie-preferences" class="cookie-prefs-link">Voorkeuren instellen</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Preferences modal
    const modal = document.createElement('div');
    modal.id = 'cookie-modal';
    modal.className = 'cookie-modal';
    modal.innerHTML = `
      <div class="cookie-modal__backdrop"></div>
      <div class="cookie-modal__box" role="dialog" aria-modal="true" aria-label="Cookie-voorkeuren">
        <div class="cookie-modal__header">
          <h2>Cookie-voorkeuren</h2>
          <button class="cookie-modal__close" aria-label="Sluiten">✕</button>
        </div>
        <div class="cookie-modal__body">
          <div class="cookie-category">
            <div class="cookie-category__header">
              <div>
                <strong>Noodzakelijke cookies</strong>
                <p>Vereist voor het functioneren van de website. Kunnen niet worden uitgeschakeld.</p>
              </div>
              <div class="cookie-toggle cookie-toggle--disabled">
                <div class="cookie-toggle__track cookie-toggle__track--on"></div>
              </div>
            </div>
          </div>
          <div class="cookie-category">
            <div class="cookie-category__header">
              <div>
                <strong>Analytische cookies</strong>
                <p>Helpen ons begrijpen hoe bezoekers de website gebruiken (Google Analytics).</p>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-analytics" checked>
                <div class="cookie-toggle__track"></div>
              </label>
            </div>
          </div>
          <div class="cookie-category">
            <div class="cookie-category__header">
              <div>
                <strong>Marketing cookies</strong>
                <p>Worden gebruikt voor gepersonaliseerde advertenties (Meta Pixel, Google Ads).</p>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-marketing" checked>
                <div class="cookie-toggle__track"></div>
              </label>
            </div>
          </div>
          <div class="cookie-category">
            <div class="cookie-category__header">
              <div>
                <strong>Functionele cookies</strong>
                <p>Onthouden jouw voorkeuren zoals taal en winkelwagen-inhoud.</p>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-functional" checked>
                <div class="cookie-toggle__track"></div>
              </label>
            </div>
          </div>
        </div>
        <div class="cookie-modal__footer">
          <button id="cookie-save-prefs" class="btn btn--primary">Voorkeuren opslaan</button>
          <button id="cookie-accept-all-modal" class="btn btn--ghost btn--sm">Alles accepteren</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    function hideBanner() {
      banner.classList.add('cookie-banner--hidden');
      setTimeout(() => banner.remove(), 400);
    }

    document.getElementById('cookie-accept-all').addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true, marketing: true, functional: true });
      hideBanner();
    });

    document.getElementById('cookie-accept-necessary').addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: false, marketing: false, functional: false });
      hideBanner();
    });

    document.getElementById('cookie-preferences').addEventListener('click', () => {
      modal.classList.add('cookie-modal--open');
    });

    modal.querySelector('.cookie-modal__backdrop').addEventListener('click', () => {
      modal.classList.remove('cookie-modal--open');
    });
    modal.querySelector('.cookie-modal__close').addEventListener('click', () => {
      modal.classList.remove('cookie-modal--open');
    });

    document.getElementById('cookie-save-prefs').addEventListener('click', () => {
      saveConsent({
        necessary: true,
        analytics: document.getElementById('cookie-analytics').checked,
        marketing: document.getElementById('cookie-marketing').checked,
        functional: document.getElementById('cookie-functional').checked,
      });
      modal.classList.remove('cookie-modal--open');
      hideBanner();
    });

    document.getElementById('cookie-accept-all-modal').addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true, marketing: true, functional: true });
      modal.classList.remove('cookie-modal--open');
      hideBanner();
    });

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.classList.add('cookie-banner--visible'));
    });
  }

  // Expose reset function for cookie settings page
  window.SmikkieCookies = {
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    },
    getConsent
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBanner);
  } else {
    injectBanner();
  }
})();
