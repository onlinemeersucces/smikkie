/* =============================================
   SMIKKIE — ACCOUNT JS v32
   localStorage-based auth + order history
   ============================================= */

(function () {
  const STORAGE_KEY_USER = 'smikkie_user';
  const STORAGE_KEY_ORDERS = 'smikkie_orders';

  // ── Helpers ──────────────────────────────────
  function getUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_USER)) || null; } catch { return null; }
  }
  function saveUser(user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }
  function getOrders() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS)) || []; } catch { return []; }
  }
  function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }

  // Seed demo orders if none exist
  function seedDemoOrders() {
    const orders = getOrders();
    if (orders.length > 0) return;
    const demo = [
      {
        id: 'SMK-2024-0042',
        date: '28 mei 2026',
        status: 'Bezorgd',
        statusClass: 'delivered',
        total: '€29,88',
        items: [
          { name: 'Barebells Chocolate Dough', qty: 6, price: '€14,94' },
          { name: 'NOCCO BCAA Passion', qty: 6, price: '€14,94' },
        ]
      },
      {
        id: 'SMK-2024-0038',
        date: '14 mei 2026',
        status: 'Bezorgd',
        statusClass: 'delivered',
        total: '€47,76',
        items: [
          { name: 'Barebells Cookies & Cream', qty: 12, price: '€29,88' },
          { name: 'Quest Chocolate Chip Cookie', qty: 6, price: '€17,94' },
        ]
      },
      {
        id: 'SMK-2024-0031',
        date: '2 mei 2026',
        status: 'Bezorgd',
        statusClass: 'delivered',
        total: '€22,41',
        items: [
          { name: 'N!CK\'s Peanut Caramel Bar', qty: 6, price: '€13,74' },
          { name: 'Fanta Zero Sugar', qty: 6, price: '€11,34' },
        ]
      }
    ];
    saveOrders(demo);
  }

  // ── Account page (login/register) ────────────
  function initAccountPage() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loggedInSection = document.getElementById('account-logged-in');
    const authSection = document.getElementById('account-auth');

    const user = getUser();

    if (user && loggedInSection && authSection) {
      authSection.style.display = 'none';
      loggedInSection.style.display = 'block';
      const nameEl = document.getElementById('account-name');
      const emailEl = document.getElementById('account-email');
      if (nameEl) nameEl.textContent = user.name;
      if (emailEl) emailEl.textContent = user.email;
      return;
    }

    // Tab switching
    if (loginTab && registerTab) {
      loginTab.addEventListener('click', () => {
        loginTab.classList.add('tab--active');
        registerTab.classList.remove('tab--active');
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
      });
      registerTab.addEventListener('click', () => {
        registerTab.classList.add('tab--active');
        loginTab.classList.remove('tab--active');
        if (registerForm) registerForm.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
      });
    }

    // Login
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('[name="email"]').value.trim();
        const pass = loginForm.querySelector('[name="password"]').value;
        if (!email || !pass) return showError(loginForm, 'Vul alle velden in.');
        // Demo: accept any credentials
        const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        saveUser({ name, email });
        seedDemoOrders();
        window.location.href = 'mijn-account.html';
      });
    }

    // Register
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = registerForm.querySelector('[name="name"]').value.trim();
        const email = registerForm.querySelector('[name="email"]').value.trim();
        const pass = registerForm.querySelector('[name="password"]').value;
        if (!name || !email || !pass) return showError(registerForm, 'Vul alle velden in.');
        if (pass.length < 6) return showError(registerForm, 'Wachtwoord moet minimaal 6 tekens zijn.');
        saveUser({ name, email });
        seedDemoOrders();
        window.location.href = 'mijn-account.html';
      });
    }
  }

  // ── Dashboard page ────────────────────────────
  function initDashboardPage() {
    const user = getUser();
    if (!user) {
      window.location.href = 'account.html';
      return;
    }

    const nameEl = document.getElementById('dashboard-name');
    const emailEl = document.getElementById('dashboard-email');
    const greetEl = document.getElementById('dashboard-greeting');
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (greetEl) greetEl.textContent = 'Hoi ' + user.name.split(' ')[0] + '! 👋';

    // Recent orders preview
    const ordersEl = document.getElementById('dashboard-orders');
    if (ordersEl) {
      const orders = getOrders().slice(0, 2);
      if (orders.length === 0) {
        ordersEl.innerHTML = '<p class="dashboard-empty">Je hebt nog geen bestellingen geplaatst.</p>';
      } else {
        ordersEl.innerHTML = orders.map(o => `
          <div class="dashboard-order-row">
            <div>
              <span class="order-id">${o.id}</span>
              <span class="order-date">${o.date}</span>
            </div>
            <span class="order-status order-status--${o.statusClass}">${o.status}</span>
            <span class="order-total">${o.total}</span>
          </div>
        `).join('');
      }
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY_USER);
        window.location.href = 'account.html';
      });
    }
  }

  // ── Orders page ───────────────────────────────
  function initOrdersPage() {
    const user = getUser();
    if (!user) {
      window.location.href = 'account.html';
      return;
    }

    const listEl = document.getElementById('orders-list');
    if (!listEl) return;

    const orders = getOrders();
    if (orders.length === 0) {
      listEl.innerHTML = '<div class="orders-empty"><p>Je hebt nog geen bestellingen geplaatst.</p><a href="mix-box.html" class="btn btn--primary">Stel je eerste mix samen →</a></div>';
      return;
    }

    listEl.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-card__header">
          <div>
            <span class="order-card__id">${o.id}</span>
            <span class="order-card__date">${o.date}</span>
          </div>
          <span class="order-status order-status--${o.statusClass}">${o.status}</span>
        </div>
        <div class="order-card__items">
          ${o.items.map(i => `
            <div class="order-card__item">
              <span>${i.qty}× ${i.name}</span>
              <span>${i.price}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-card__footer">
          <strong>Totaal: ${o.total}</strong>
          <button class="btn btn--ghost btn--sm" onclick="alert('Track & trace wordt verstuurd naar je e-mailadres.')">Track &amp; trace</button>
        </div>
      </div>
    `).join('');
  }

  function showError(form, msg) {
    let err = form.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      form.prepend(err);
    }
    err.textContent = msg;
  }

  // ── Init based on current page ─────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop();
    if (page === 'account.html') initAccountPage();
    if (page === 'mijn-account.html') initDashboardPage();
    if (page === 'bestellingen.html') initOrdersPage();

    // Update header account icon
    const user = getUser();
    if (user) {
      document.querySelectorAll('.account-icon-label').forEach(el => {
        el.textContent = user.name.split(' ')[0];
      });
    }
  });

})();
