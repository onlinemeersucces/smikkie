"""
Build eiwitrepen.html from mix-box.html as exact copy,
with adjusted title, breadcrumb, hero text, filter tabs,
product cards (eiwitrepen only), and MIX_CONFIG injection.
"""
with open('/home/ubuntu/smikkie-shop/pages/mix-box.html', 'r') as f:
    html = f.read()

# 1. Title & meta
html = html.replace(
    '<title>Stel jouw Smikkie Mix samen – Smikkie</title>',
    '<title>Eiwitrepen Mix | Smikkie</title>'
)
html = html.replace(
    'Stel jouw Smikkie Mix samen – Smikkie',
    'Eiwitrepen Mix | Smikkie'
)

# 2. Inject MIX_CONFIG before </head>
mix_config = '''  <!-- MIX CONFIG: eiwitrepen (doos = 12) -->
  <script>
    window.MIX_CONFIG = {
      boxSizes: [12, 24, 36, 48],
      discountTiers: [
        { minQty: 48, discount: 0.20, label: '20% korting' },
        { minQty: 36, discount: 0.15, label: '15% korting' },
        { minQty: 24, discount: 0.10, label: '10% korting' },
        { minQty: 12, discount: 0.05, label: '5% korting' },
        { minQty: 0,  discount: 0,    label: null }
      ]
    };
  </script>
</head>'''
html = html.replace('</head>', mix_config)

# 3. Breadcrumb current page
html = html.replace(
    '<span class="current">Stel jouw mix samen</span>',
    '<span class="current">Eiwitrepen</span>'
)

# 4. Hero badge, title, subtitle
html = html.replace(
    '<div class="mix-hero__badge">🐻 Pick &amp; Mix</div>',
    '<div class="mix-hero__badge">💪 Eiwitrepen</div>'
)
html = html.replace(
    '<h1 class="mix-hero__title">Stel jouw <span class="text-purple">eigen doos</span> samen</h1>',
    '<h1 class="mix-hero__title">Stel jouw <span class="text-purple">eiwitreep doos</span> samen</h1>'
)
html = html.replace(
    'Kies precies de smaken die jij lekker vindt. Meng eiwitrepen, snacks en drankjes in één doos. Hoe meer je bestelt, hoe meer je bespaart.',
    'Kies precies de smaken die jij lekker vindt. Meng Barebells, N!CK\'S, Quest en meer in één doos. Hoe meer je bestelt, hoe meer je bespaart.'
)

# 5. Replace flavor filter buttons (only eiwitreep brands)
old_filters = '''              <div class="flavor-filters">
                <button class="flavor-filter flavor-filter--active" data-filter="all">Alles</button>
                <button class="flavor-filter" data-filter="eiwitreep">Eiwitrepen</button>
                <button class="flavor-filter" data-filter="snack">Snacks</button>
                <button class="flavor-filter" data-filter="drankje">Drankjes</button>
              </div>'''
new_filters = '''              <div class="flavor-filters">
                <button class="flavor-filter flavor-filter--active" data-filter="all">Alles</button>
                <button class="flavor-filter" data-filter="barebells">Barebells</button>
                <button class="flavor-filter" data-filter="nicks">N!CK\'S</button>
                <button class="flavor-filter" data-filter="quest">Quest</button>
              </div>'''
html = html.replace(old_filters, new_filters)

# 6. Replace product grid with eiwitreep-only products
old_grid_start = '              <!-- Product grid -->\n              <div class="flavor-grid" id="flavor-grid">'
new_grid = '''              <!-- Product grid -->
              <div class="flavor-grid" id="flavor-grid">

                <!-- Barebells Chocolate Dough -->
                <div class="flavor-card" data-id="bb-choc" data-cat="barebells" data-price="2.49" data-name="Barebells Chocolate Dough" data-img="../images/barebells.jpg" data-brand="Barebells">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/barebells.jpg" alt="Barebells Chocolate Dough" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag">Barebells</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Chocolate Dough</div>
                    <div class="flavor-card__macros"><span>20g eiwit</span><span>1.2g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="bb-choc" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-bb-choc">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="bb-choc" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- Barebells Salty Peanut -->
                <div class="flavor-card" data-id="bb-salt" data-cat="barebells" data-price="2.49" data-name="Barebells Salty Peanut" data-img="../images/barebells.jpg" data-brand="Barebells">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/barebells.jpg" alt="Barebells Salty Peanut" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag">Barebells</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Salty Peanut</div>
                    <div class="flavor-card__macros"><span>20g eiwit</span><span>1.4g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="bb-salt" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-bb-salt">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="bb-salt" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- Barebells Cookies & Cream -->
                <div class="flavor-card" data-id="bb-cookies" data-cat="barebells" data-price="2.49" data-name="Barebells Cookies &amp; Cream" data-img="../images/barebells.jpg" data-brand="Barebells">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/barebells.jpg" alt="Barebells Cookies &amp; Cream" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag">Barebells</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Cookies &amp; Cream</div>
                    <div class="flavor-card__macros"><span>20g eiwit</span><span>1.1g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="bb-cookies" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-bb-cookies">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="bb-cookies" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- Barebells White Chocolate Almond -->
                <div class="flavor-card" data-id="bb-white" data-cat="barebells" data-price="2.49" data-name="Barebells White Chocolate Almond" data-img="../images/barebells.jpg" data-brand="Barebells">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/barebells.jpg" alt="Barebells White Chocolate Almond" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag">Barebells</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">White Choc Almond</div>
                    <div class="flavor-card__macros"><span>20g eiwit</span><span>1.3g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="bb-white" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-bb-white">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="bb-white" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- N!CK\'S Peanut Caramel -->
                <div class="flavor-card" data-id="nicks-peanut" data-cat="nicks" data-price="2.29" data-name="N!CK\'S Peanut Caramel" data-img="../images/nicks.png" data-brand="N!CK\'S">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/nicks.png" alt="N!CK\'S Peanut Caramel" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#e91e8c;">N!CK\'S</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Peanut Caramel</div>
                    <div class="flavor-card__macros"><span>15g eiwit</span><span>0.9g suiker</span></div>
                    <div class="flavor-card__price">€2,29</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="nicks-peanut" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-nicks-peanut">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="nicks-peanut" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- N!CK\'S Chocolate Fudge -->
                <div class="flavor-card" data-id="nicks-choc" data-cat="nicks" data-price="2.29" data-name="N!CK\'S Chocolate Fudge" data-img="../images/nicks.png" data-brand="N!CK\'S">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/nicks.png" alt="N!CK\'S Chocolate Fudge" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#e91e8c;">N!CK\'S</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Chocolate Fudge</div>
                    <div class="flavor-card__macros"><span>15g eiwit</span><span>1.0g suiker</span></div>
                    <div class="flavor-card__price">€2,29</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="nicks-choc" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-nicks-choc">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="nicks-choc" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- Quest Chocolate Chip Cookie -->
                <div class="flavor-card" data-id="quest-choc" data-cat="quest" data-price="2.99" data-name="Quest Chocolate Chip Cookie" data-img="../images/quest.jpg" data-brand="Quest">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/quest.jpg" alt="Quest Chocolate Chip Cookie" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#ff6b00;">Quest</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Chocolate Chip Cookie</div>
                    <div class="flavor-card__macros"><span>21g eiwit</span><span>1g suiker</span></div>
                    <div class="flavor-card__price">€2,99</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="quest-choc" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-quest-choc">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="quest-choc" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- Quest Peanut Butter Supreme -->
                <div class="flavor-card" data-id="quest-pb" data-cat="quest" data-price="2.99" data-name="Quest Peanut Butter Supreme" data-img="../images/quest.jpg" data-brand="Quest">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/quest.jpg" alt="Quest Peanut Butter Supreme" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:#ff6b00;">Quest</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Peanut Butter Supreme</div>
                    <div class="flavor-card__macros"><span>21g eiwit</span><span>1g suiker</span></div>
                    <div class="flavor-card__price">€2,99</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="quest-pb" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-quest-pb">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="quest-pb" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

                <!-- Smikkie Vanilla Dream -->
                <div class="flavor-card" data-id="smik-van" data-cat="all" data-price="2.49" data-name="Smikkie Vanilla Dream" data-img="../images/proteinbar.png" data-brand="Smikkie">
                  <div class="flavor-card__img-wrap">
                    <img src="../images/proteinbar.png" alt="Smikkie Vanilla Dream" class="flavor-card__img" loading="lazy">
                    <span class="flavor-card__brand-tag" style="background:var(--purple);">Smikkie</span>
                  </div>
                  <div class="flavor-card__info">
                    <div class="flavor-card__name">Vanilla Dream</div>
                    <div class="flavor-card__macros"><span>18g eiwit</span><span>1.1g suiker</span></div>
                    <div class="flavor-card__price">€2,49</div>
                  </div>
                  <div class="flavor-card__qty">
                    <button class="qty-btn qty-btn--minus" data-id="smik-van" aria-label="Minder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <span class="qty-val" id="qty-smik-van">0</span>
                    <button class="qty-btn qty-btn--plus" data-id="smik-van" aria-label="Meer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                </div>

              </div><!-- /flavor-grid -->'''

# Find the old product grid section and replace it
import re
# Find from "<!-- Product grid -->" to "</div><!-- /flavor-grid -->"
pattern = r'              <!-- Product grid -->.*?</div><!-- /flavor-grid -->'
html = re.sub(pattern, new_grid, html, flags=re.DOTALL)

# 7. Update CSS/JS version numbers
html = html.replace('mix-box.css?v=23', 'mix-box.css?v=30')
html = html.replace('header-template.js?v=22', 'header-template.js?v=30')
html = html.replace('shop.js?v=22', 'shop.js?v=30')
html = html.replace('mix-box.js?v=23', 'mix-box.js?v=30')

with open('/home/ubuntu/smikkie-shop/pages/eiwitrepen.html', 'w') as f:
    f.write(html)

print("eiwitrepen.html written successfully, length:", len(html))
