"""
Build drankjes.html from mix-box.html as exact copy,
with adjusted title, breadcrumb, hero text, filter tabs,
product cards (drankjes only), volume steps for doos=6,
and MIX_CONFIG injection (doos = 6).
"""
import re

with open('/home/ubuntu/smikkie-shop/pages/mix-box.html', 'r') as f:
    html = f.read()

# 1. Title
html = html.replace(
    '<title>Stel jouw Smikkie Mix samen – Smikkie</title>',
    '<title>Drankjes Mix | Smikkie</title>'
)

# 2. Inject MIX_CONFIG before </head> — doos = 6
mix_config = '''  <!-- MIX CONFIG: drankjes (doos = 6) -->
  <script>
    window.MIX_CONFIG = {
      boxSizes: [6, 12, 18, 24],
      discountTiers: [
        { minQty: 24, discount: 0.20, label: '20% korting' },
        { minQty: 18, discount: 0.15, label: '15% korting' },
        { minQty: 12, discount: 0.10, label: '10% korting' },
        { minQty: 6,  discount: 0.05, label: '5% korting' },
        { minQty: 0,  discount: 0,    label: null }
      ]
    };
  </script>
</head>'''
html = html.replace('</head>', mix_config)

# 3. Breadcrumb
html = html.replace(
    '<span class="current">Stel jouw mix samen</span>',
    '<span class="current">Drankjes</span>'
)

# 4. Hero badge, title, subtitle
html = html.replace(
    '<div class="mix-hero__badge">🐻 Pick &amp; Mix</div>',
    '<div class="mix-hero__badge">🥤 Drankjes</div>'
)
html = html.replace(
    '<h1 class="mix-hero__title">Stel jouw <span class="text-purple">eigen doos</span> samen</h1>',
    '<h1 class="mix-hero__title">Stel jouw <span class="text-purple">drankjes tray</span> samen</h1>'
)
html = html.replace(
    'Kies precies de smaken die jij lekker vindt. Meng eiwitrepen, snacks en drankjes in één doos. Hoe meer je bestelt, hoe meer je bespaart.',
    'Kies precies de smaken die jij lekker vindt. Meng NOCCO, Fanta Zero en meer in één tray. Hoe meer je bestelt, hoe meer je bespaart.'
)

# 5. Volume steps: doos = 6 (tray)
old_volume_steps = '''        <div class="volume-steps">
          <div class="volume-step volume-step--single" id="vstep-0" data-qty="1">
            <div class="volume-step__badge volume-step__badge--gray">Standaard</div>
            <div class="volume-step__icon-box">1</div>
            <div class="volume-step__info">
              <strong>1 reep</strong>
              <span>Normaal tarief</span>
            </div>
            <div class="volume-step__price">Geen korting</div>
          </div>
          <div class="volume-step__arrow">→</div>
          <div class="volume-step" id="vstep-1" data-qty="12">
            <div class="volume-step__badge">5% korting</div>
            <div class="volume-step__icon-box">1×</div>
            <div class="volume-step__info">
              <strong>1 doos</strong>
              <span>12 stuks</span>
            </div>
            <div class="volume-step__price volume-step__price--green">Bespaar 5%</div>
          </div>
          <div class="volume-step__arrow">→</div>
          <div class="volume-step" id="vstep-2" data-qty="24">
            <div class="volume-step__badge">10% korting</div>
            <div class="volume-step__icon-box">2×</div>
            <div class="volume-step__info">
              <strong>2 dozen</strong>
              <span>24 stuks</span>
            </div>
            <div class="volume-step__price volume-step__price--green">Bespaar 10%</div>
          </div>
          <div class="volume-step__arrow">→</div>
          <div class="volume-step" id="vstep-3" data-qty="36">
            <div class="volume-step__badge">15% korting</div>
            <div class="volume-step__icon-box">3×</div>
            <div class="volume-step__info">
              <strong>3 dozen</strong>
              <span>36 stuks</span>
            </div>
            <div class="volume-step__price volume-step__price--green">Bespaar 15%</div>
          </div>
          <div class="volume-step__arrow">→</div>
          <div class="volume-step" id="vstep-4" data-qty="48">
            <div class="volume-step__badge volume-step__badge--gold">20% korting</div>
            <div class="volume-step__icon-box">4×</div>
            <div class="volume-step__info">
              <strong>4 dozen</strong>
              <span>48 stuks</span>
            </div>
            <div class="volume-step__price volume-step__price--green">Bespaar 20%</div>
          </div>
        </div>'''

new_volume_steps = '''        <div class="volume-steps">
          <div class="volume-step volume-step--single" id="vstep-0" data-qty="1">
            <div class="volume-step__badge volume-step__badge--gray">Standaard</div>
            <div class="volume-step__icon-box">1</div>
            <div class="volume-step__info">
              <strong>1 blikje</strong>
              <span>Normaal tarief</span>
            </div>
            <div class="volume-step__price">Geen korting</div>
          </div>
          <div class="volume-step__arrow">→</div>
          <div class="volume-step" id="vstep-1" data-qty="6">
            <div class="volume-step__badge">5% korting</div>
            <div class="volume-step__icon-box">1×</div>
            <div class="volume-step__info">
              <strong>1 tray</strong>
              <span>6 blikjes</span>
            </div>
            <div class="volume-step__price volume-step__price--green">Bespaar 5%</div>
          </div>
          <div class="volume-step__arrow">→</div>
          <div class="volume-step" id="vstep-2" data-qty="12">
            <div class="volume-step__badge">10% korting</div>
            <div class="volume-step__icon-box">2×</div>
            <div class="volume-step__info">
              <strong>2 trays</strong>
              <span>12 blikjes</span>
            </div>
            <div class="volume-step__price volume-step__price--green">Bespaar 10%</div>
          </div>
          <div class="volume-step__arrow">→</div>
          <div class="volume-step" id="vstep-3" data-qty="18">
            <div class="volume-step__badge">15% korting</div>
            <div class="volume-step__icon-box">3×</div>
            <div class="volume-step__info">
              <strong>3 trays</strong>
              <span>18 blikjes</span>
            </div>
            <div class="volume-step__price volume-step__price--green">Bespaar 15%</div>
          </div>
          <div class="volume-step__arrow">→</div>
          <div class="volume-step" id="vstep-4" data-qty="24">
            <div class="volume-step__badge volume-step__badge--gold">20% korting</div>
            <div class="volume-step__icon-box">4×</div>
            <div class="volume-step__info">
              <strong>4 trays</strong>
              <span>24 blikjes</span>
            </div>
            <div class="volume-step__price volume-step__price--green">Bespaar 20%</div>
          </div>
        </div>'''
html = html.replace(old_volume_steps, new_volume_steps)

# 6. Tab labels: "Losse reepjes" -> "Losse blikjes", "Complete dozen" -> "Complete trays"
html = html.replace('Losse reepjes', 'Losse blikjes')
html = html.replace('Complete dozen', 'Complete trays')

# 7. Filter buttons
old_filters = '''              <div class="flavor-filters">
                <button class="flavor-filter flavor-filter--active" data-filter="all">Alles</button>
                <button class="flavor-filter" data-filter="eiwitreep">Eiwitrepen</button>
                <button class="flavor-filter" data-filter="snack">Snacks</button>
                <button class="flavor-filter" data-filter="drankje">Drankjes</button>
              </div>'''
new_filters = '''              <div class="flavor-filters">
                <button class="flavor-filter flavor-filter--active" data-filter="all">Alles</button>
                <button class="flavor-filter" data-filter="nocco">NOCCO</button>
                <button class="flavor-filter" data-filter="fanta">Fanta Zero</button>
              </div>'''
html = html.replace(old_filters, new_filters)

# 8. Replace product grid with drankjes-only products
new_grid = '''              <!-- Product grid -->
              <div class="flavor-grid" id="flavor-grid">

                <!-- NOCCO Tropical -->
                <div class="flavor-card" data-id="nocco-trop" data-cat="nocco" data-price="2.49" data-name="NOCCO Tropical" data-img="../images/nocco.png" data-brand="NOCCO">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/nocco.png" alt="NOCCO Tropical" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#00b4d8;">NOCCO</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Tropical</div>
                    <div class="flavor-card__macros"><span>8g eiwit</span><span>0g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="nocco-trop" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-nocco-trop">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="nocco-trop" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- NOCCO Caribbean -->
                <div class="flavor-card" data-id="nocco-carib" data-cat="nocco" data-price="2.49" data-name="NOCCO Caribbean" data-img="../images/nocco.png" data-brand="NOCCO">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/nocco.png" alt="NOCCO Caribbean" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#00b4d8;">NOCCO</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Caribbean</div>
                    <div class="flavor-card__macros"><span>8g eiwit</span><span>0g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="nocco-carib" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-nocco-carib">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="nocco-carib" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- NOCCO Mango -->
                <div class="flavor-card" data-id="nocco-mango" data-cat="nocco" data-price="2.49" data-name="NOCCO Mango" data-img="../images/nocco.png" data-brand="NOCCO">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/nocco.png" alt="NOCCO Mango" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#00b4d8;">NOCCO</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Mango</div>
                    <div class="flavor-card__macros"><span>8g eiwit</span><span>0g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="nocco-mango" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-nocco-mango">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="nocco-mango" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- NOCCO Strawberry -->
                <div class="flavor-card" data-id="nocco-straw" data-cat="nocco" data-price="2.49" data-name="NOCCO Strawberry" data-img="../images/nocco.png" data-brand="NOCCO">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/nocco.png" alt="NOCCO Strawberry" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#00b4d8;">NOCCO</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Strawberry</div>
                    <div class="flavor-card__macros"><span>8g eiwit</span><span>0g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="nocco-straw" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-nocco-straw">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="nocco-straw" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- Fanta Zero Orange -->
                <div class="flavor-card" data-id="fanta-orange" data-cat="fanta" data-price="1.89" data-name="Fanta Zero Orange" data-img="../images/fanta.png" data-brand="Fanta">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/fanta.png" alt="Fanta Zero Orange" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#ff6b00;">Fanta</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Zero Orange</div>
                    <div class="flavor-card__macros"><span>0g suiker</span><span>0 kcal</span></div>
                    <div class="flavor-card__price">€1,89</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="fanta-orange" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-fanta-orange">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="fanta-orange" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- Fanta Zero Lemon -->
                <div class="flavor-card" data-id="fanta-lemon" data-cat="fanta" data-price="1.89" data-name="Fanta Zero Lemon" data-img="../images/fanta.png" data-brand="Fanta">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/fanta.png" alt="Fanta Zero Lemon" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#ff6b00;">Fanta</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Zero Lemon</div>
                    <div class="flavor-card__macros"><span>0g suiker</span><span>0 kcal</span></div>
                    <div class="flavor-card__price">€1,89</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="fanta-lemon" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-fanta-lemon">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="fanta-lemon" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

              </div><!-- /flavor-grid -->'''

pattern = r'              <!-- Product grid -->.*?</div><!-- /flavor-grid -->'
html = re.sub(pattern, new_grid, html, flags=re.DOTALL)

# 9. Box size selector: doos=6 labels
old_box_sizes = '''              <div class="box-size-selector">
                <h3 class="box-size-selector__title">Doosgrootte</h3>
                <div class="box-sizes">
                  <button class="box-size box-size--active" data-size="12">
                    <span class="box-size__badge">5% korting</span>
                    <span class="box-size__num">12</span>
                    <span class="box-size__label">stuks</span>
                    <span class="box-size__sub">1 doos</span>
                  </button>
                  <button class="box-size" data-size="24">
                    <span class="box-size__badge">10% korting</span>
                    <span class="box-size__num">24</span>
                    <span class="box-size__label">stuks</span>
                    <span class="box-size__sub">2 dozen</span>
                  </button>
                  <button class="box-size" data-size="36">
                    <span class="box-size__badge">15% korting</span>
                    <span class="box-size__num">36</span>
                    <span class="box-size__label">stuks</span>
                    <span class="box-size__sub">3 dozen</span>
                  </button>
                  <button class="box-size" data-size="48">
                    <span class="box-size__badge box-size__badge--gold">20% korting</span>
                    <span class="box-size__num">48</span>
                    <span class="box-size__label">stuks</span>
                    <span class="box-size__sub">4 dozen</span>
                  </button>
                </div>
              </div>'''
new_box_sizes = '''              <div class="box-size-selector">
                <h3 class="box-size-selector__title">Traygrootte</h3>
                <div class="box-sizes">
                  <button class="box-size box-size--active" data-size="6">
                    <span class="box-size__badge">5% korting</span>
                    <span class="box-size__num">6</span>
                    <span class="box-size__label">blikjes</span>
                    <span class="box-size__sub">1 tray</span>
                  </button>
                  <button class="box-size" data-size="12">
                    <span class="box-size__badge">10% korting</span>
                    <span class="box-size__num">12</span>
                    <span class="box-size__label">blikjes</span>
                    <span class="box-size__sub">2 trays</span>
                  </button>
                  <button class="box-size" data-size="18">
                    <span class="box-size__badge">15% korting</span>
                    <span class="box-size__num">18</span>
                    <span class="box-size__label">blikjes</span>
                    <span class="box-size__sub">3 trays</span>
                  </button>
                  <button class="box-size" data-size="24">
                    <span class="box-size__badge box-size__badge--gold">20% korting</span>
                    <span class="box-size__num">24</span>
                    <span class="box-size__label">blikjes</span>
                    <span class="box-size__sub">4 trays</span>
                  </button>
                </div>
              </div>'''
html = html.replace(old_box_sizes, new_box_sizes)

# 10. "Complete dozen" tab header
html = html.replace(
    '<h2 class="picker-title">Complete dozen per smaak</h2>',
    '<h2 class="picker-title">Complete trays per smaak</h2>'
)
html = html.replace(
    '<p class="picker-sub">Bestel een volledige doos van jouw favoriete smaak. Hoe meer dozen, hoe meer korting.</p>',
    '<p class="picker-sub">Bestel een volledige tray van jouw favoriete smaak. Hoe meer trays, hoe meer korting.</p>'
)

# 11. Replace dozen-grid with drankjes trays
old_dozen_grid_start = '              <div class="dozen-grid">'
# Find the entire dozen-grid block and replace it
pattern_dozen = r'              <div class="dozen-grid">.*?              </div><!-- /dozen-grid -->'
new_dozen_grid = '''              <div class="dozen-grid">

                <!-- NOCCO Tropical tray -->
                <div class="dozen-product">
                  <div class="dozen-product__header">
                    <img src="../images/nocco.png" alt="NOCCO Tropical" class="dozen-product__img">
                    <div class="dozen-product__info">
                      <div class="dozen-product__brand">NOCCO</div>
                      <div class="dozen-product__name">Tropical</div>
                      <div class="dozen-product__unit">€2,49 per blikje &bull; 6 blikjes per tray</div>
                    </div>
                  </div>
                  <div class="bundle-selector bundle-options" data-product="nocco-trop-tray" data-unit-price="2.49" data-box-size="6">
                    <div class="bundle-option bundle-option--active" data-qty="1">
                      <div class="bundle-option__qty">1 tray</div>
                      <div class="bundle-option__price" data-base="14.94">€14,94</div>
                      <div class="bundle-option__per">€2,49/stuk</div>
                    </div>
                    <div class="bundle-option" data-qty="2">
                      <div class="bundle-option__badge">-10%</div>
                      <div class="bundle-option__qty">2 trays</div>
                      <div class="bundle-option__price" data-base="29.88" data-discount="10">€26,89</div>
                      <div class="bundle-option__per">€2,24/stuk</div>
                    </div>
                    <div class="bundle-option" data-qty="3">
                      <div class="bundle-option__badge">-15%</div>
                      <div class="bundle-option__qty">3 trays</div>
                      <div class="bundle-option__price" data-base="44.82" data-discount="15">€38,10</div>
                      <div class="bundle-option__per">€2,12/stuk</div>
                    </div>
                    <div class="bundle-option" data-qty="4">
                      <div class="bundle-option__badge bundle-option__badge--gold">-20%</div>
                      <div class="bundle-option__qty">4 trays</div>
                      <div class="bundle-option__price" data-base="59.76" data-discount="20">€47,81</div>
                      <div class="bundle-option__per">€1,99/stuk</div>
                    </div>
                  </div>
                  <button class="btn-primary btn-add-dozen" data-product="nocco-trop-tray">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Toevoegen aan mix
                  </button>
                </div>

                <!-- Fanta Zero tray -->
                <div class="dozen-product">
                  <div class="dozen-product__header">
                    <img src="../images/fanta.png" alt="Fanta Zero" class="dozen-product__img">
                    <div class="dozen-product__info">
                      <div class="dozen-product__brand">Fanta</div>
                      <div class="dozen-product__name">Zero Sugar</div>
                      <div class="dozen-product__unit">€1,89 per blikje &bull; 6 blikjes per tray</div>
                    </div>
                  </div>
                  <div class="bundle-selector bundle-options" data-product="fanta-zero-tray" data-unit-price="1.89" data-box-size="6">
                    <div class="bundle-option bundle-option--active" data-qty="1">
                      <div class="bundle-option__qty">1 tray</div>
                      <div class="bundle-option__price" data-base="11.34">€11,34</div>
                      <div class="bundle-option__per">€1,89/stuk</div>
                    </div>
                    <div class="bundle-option" data-qty="2">
                      <div class="bundle-option__badge">-10%</div>
                      <div class="bundle-option__qty">2 trays</div>
                      <div class="bundle-option__price" data-base="22.68" data-discount="10">€20,41</div>
                      <div class="bundle-option__per">€1,70/stuk</div>
                    </div>
                    <div class="bundle-option" data-qty="3">
                      <div class="bundle-option__badge">-15%</div>
                      <div class="bundle-option__qty">3 trays</div>
                      <div class="bundle-option__price" data-base="34.02" data-discount="15">€28,92</div>
                      <div class="bundle-option__per">€1,61/stuk</div>
                    </div>
                    <div class="bundle-option" data-qty="4">
                      <div class="bundle-option__badge bundle-option__badge--gold">-20%</div>
                      <div class="bundle-option__qty">4 trays</div>
                      <div class="bundle-option__price" data-base="45.36" data-discount="20">€36,29</div>
                      <div class="bundle-option__per">€1,51/stuk</div>
                    </div>
                  </div>
                  <button class="btn-primary btn-add-dozen" data-product="fanta-zero-tray">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Toevoegen aan mix
                  </button>
                </div>

              </div><!-- /dozen-grid -->'''
html = re.sub(pattern_dozen, new_dozen_grid, html, flags=re.DOTALL)

# 12. Sidebar tier labels: "1 doos" -> "1 tray" etc.
html = html.replace('<small>1 doos</small>', '<small>1 tray</small>')
html = html.replace('<small>2 dozen</small>', '<small>2 trays</small>')
html = html.replace('<small>3 dozen</small>', '<small>3 trays</small>')
html = html.replace('<small>4 dozen</small>', '<small>4 trays</small>')

# 13. "stuks" -> "blikjes" in picker-progress
html = html.replace(
    '<span id="sidebar-count">0</span> / <span id="sidebar-max">12</span> stuks',
    '<span id="sidebar-count">0</span> / <span id="sidebar-max">6</span> blikjes'
)

# 14. Update CSS/JS version numbers
html = html.replace('mix-box.css?v=23', 'mix-box.css?v=30')
html = html.replace('header-template.js?v=22', 'header-template.js?v=30')
html = html.replace('shop.js?v=22', 'shop.js?v=30')
html = html.replace('mix-box.js?v=23', 'mix-box.js?v=30')

with open('/home/ubuntu/smikkie-shop/pages/drankjes.html', 'w') as f:
    f.write(html)

print("drankjes.html written successfully, length:", len(html))
