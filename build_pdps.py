import re, shutil

# All products from shop.js
products = [
    { 'id': 1,  'brand': 'Barebells', 'name': 'Chocolate Dough',       'slug': 'barebells-chocolate-dough',      'price': 2.49, 'img': 'barebells.jpg', 'cat': 'eiwitrepen', 'protein': '20g', 'sugar': '1.2g', 'kcal': '212', 'desc': 'De iconische Barebells Chocolate Dough combineert rijke chocoladesmaak met 20g eiwit per reep. Geen suiker toegevoegd, perfect voor na je training of als tussendoortje.' },
    { 'id': 2,  'brand': "N!CK'S",   'name': 'Peanut Caramel Bar',     'slug': 'nicks-peanut-caramel',           'price': 2.29, 'img': 'nicks.png',     'cat': 'eiwitrepen', 'protein': '15g', 'sugar': '0.9g', 'kcal': '195', 'desc': "N!CK'S Peanut Caramel combineert romige pindakaas met zoete karamel. Zonder suiker toegevoegd en met een heerlijke knapperige textuur." },
    { 'id': 3,  'brand': 'Quest',    'name': 'Chocolate Chip Cookie',  'slug': 'quest-chocolate-chip-cookie',    'price': 2.99, 'img': 'quest.jpg',     'cat': 'snacks',     'protein': '21g', 'sugar': '1g',   'kcal': '180', 'desc': 'Quest Chocolate Chip Cookie smaakt als een echte koek maar bevat 21g eiwit en slechts 1g suiker. De perfecte gezonde snack voor koekjesliefhebbers.' },
    { 'id': 4,  'brand': 'NOCCO',    'name': 'BCAA Passion',           'slug': 'nocco-bcaa-passion',             'price': 2.49, 'img': 'nocco.png',     'cat': 'drankjes',   'protein': '8g',  'sugar': '0g',   'kcal': '20',  'desc': 'NOCCO BCAA Passion is een frisse energiedrank met BCAA aminozuren, cafeïne en vitamines. Nul suiker, vol smaak.' },
    { 'id': 5,  'brand': 'Fanta',    'name': 'Zero Sugar',             'slug': 'fanta-zero-sugar',               'price': 1.89, 'img': 'fanta.png',     'cat': 'drankjes',   'protein': '0g',  'sugar': '0g',   'kcal': '3',   'desc': 'Fanta Zero Sugar heeft dezelfde heerlijke sinaasappelsmaak zonder suiker. De perfecte frisdrank als je op je suikerinname let.' },
    { 'id': 6,  'brand': 'Barebells', 'name': 'Cookies & Cream',       'slug': 'barebells-cookies-cream',        'price': 2.49, 'img': 'barebells.jpg', 'cat': 'eiwitrepen', 'protein': '20g', 'sugar': '1.1g', 'kcal': '210', 'desc': 'Barebells Cookies & Cream combineert de klassieke koek-en-room smaak met 20g eiwit. Knapperige stukjes koek in een romige chocoladelaag.' },
    { 'id': 7,  'brand': 'Barebells', 'name': 'Caramel Cashew',        'slug': 'barebells-caramel-cashew',       'price': 2.49, 'img': 'barebells.jpg', 'cat': 'eiwitrepen', 'protein': '20g', 'sugar': '1.3g', 'kcal': '214', 'desc': 'Barebells Caramel Cashew heeft een rijke karamelsmaak met knapperige cashewnoten. 20g eiwit per reep, geen suiker toegevoegd.' },
    { 'id': 8,  'brand': "N!CK'S",   'name': 'Wafer Bar Chocolate',   'slug': 'nicks-wafer-bar-chocolate',      'price': 1.99, 'img': 'nicks.png',     'cat': 'snacks',     'protein': '7g',  'sugar': '0.5g', 'kcal': '155', 'desc': "N!CK'S Wafer Bar Chocolate is een luchtige wafeltjesreep met chocolade. Knapperig, licht en zonder suiker toegevoegd." },
    { 'id': 9,  'brand': 'Quest',    'name': 'Double Chocolate Chip',  'slug': 'quest-double-chocolate-chip',    'price': 2.99, 'img': 'quest.jpg',     'cat': 'snacks',     'protein': '21g', 'sugar': '1g',   'kcal': '185', 'desc': 'Quest Double Chocolate Chip is voor de echte chocoladeliefhebber. Dubbel zoveel chocolade, 21g eiwit en slechts 1g suiker.' },
    { 'id': 10, 'brand': 'NOCCO',    'name': 'BCAA Caribbean',         'slug': 'nocco-bcaa-caribbean',           'price': 2.49, 'img': 'nocco.png',     'cat': 'drankjes',   'protein': '8g',  'sugar': '0g',   'kcal': '20',  'desc': 'NOCCO BCAA Caribbean heeft een tropische smaak van mango en ananas. Vol BCAA aminozuren, nul suiker en cafeïne voor extra energie.' },
    { 'id': 11, 'brand': 'SmartSweets', 'name': 'Gummy Bears',         'slug': 'smartsweets-gummy-bears',        'price': 2.99, 'img': 'quest.jpg',     'cat': 'treats',     'protein': '3g',  'sugar': '3g',   'kcal': '100', 'desc': 'SmartSweets Gummy Bears zijn de gezondere versie van klassieke gummiberen. Gemaakt met plantaardige ingrediënten en veel minder suiker.' },
    { 'id': 12, 'brand': "N!CK'S",   'name': 'Chocolate Peanut Cups', 'slug': 'nicks-chocolate-peanut-cups',    'price': 2.49, 'img': 'nicks.png',     'cat': 'treats',     'protein': '5g',  'sugar': '0.3g', 'kcal': '140', 'desc': "N!CK'S Chocolate Peanut Cups zijn een heerlijke combinatie van pure chocolade en romige pindakaas. Geen suiker toegevoegd." },
]

cat_map = {
    'eiwitrepen': ('eiwitrepen.html', 'Eiwitrepen'),
    'snacks':     ('snacks-koekjes.html', 'Snacks & koekjes'),
    'drankjes':   ('drankjes.html', 'Drankjes'),
    'treats':     ('treats-mix.html', 'Treats'),
}

template = '''<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{brand} {name} – Smikkie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/base.css?v=32">
  <link rel="stylesheet" href="../css/header.css?v=32">
  <link rel="stylesheet" href="../css/footer.css?v=32">
  <link rel="stylesheet" href="../css/product.css?v=32">
</head>
<body>
<div id="site-header"></div>
<div class="breadcrumb desktop-only">
  <div class="container">
    <nav class="breadcrumb__nav">
      <a href="../index.html">Home</a>
      <span class="sep">›</span>
      <a href="{cat_url}">{cat_label}</a>
      <span class="sep">›</span>
      <span class="current">{brand} {name}</span>
    </nav>
  </div>
</div>
<section class="product-section">
  <div class="container">
    <div class="product-desktop desktop-only">
      <div class="gallery-col">
        <div class="gallery">
          <div class="gallery__thumbs">
            <button class="gallery__thumb gallery__thumb--active" data-img="{img}">
              <img src="../images/{img}" alt="{brand} {name}">
            </button>
          </div>
          <div class="gallery__main">
            <div class="gallery__img-wrap">
              <img src="../images/{img}" alt="{brand} {name}" id="gallery-main-img">
            </div>
          </div>
        </div>
        <div class="smikkie-zegt">
          <div class="smikkie-zegt__badge">Smikkie zegt</div>
          <p class="smikkie-zegt__text">"{desc_short}"</p>
        </div>
      </div>
      <div class="product-info-col">
        <div class="product-brand-badge">{brand}</div>
        <h1 class="product-title">{brand} {name}</h1>
        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span class="rating-count">4.8 (124 reviews)</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">€{price}</span>
          <span class="product-price-sub">per stuk</span>
        </div>
        <p class="product-desc">{desc}</p>
        <div class="product-macros">
          <div class="macro-pill"><span class="macro-val">{protein}</span><span class="macro-label">Eiwit</span></div>
          <div class="macro-pill"><span class="macro-val">{sugar}</span><span class="macro-label">Suiker</span></div>
          <div class="macro-pill"><span class="macro-val">{kcal}</span><span class="macro-label">Kcal</span></div>
        </div>
        <div class="product-qty-row">
          <div class="qty-ctrl">
            <button class="qty-btn" id="qty-minus">−</button>
            <span class="qty-val" id="qty-val">1</span>
            <button class="qty-btn" id="qty-plus">+</button>
          </div>
          <button class="btn btn--primary btn--lg product-add-btn" id="add-to-cart-btn" data-id="{id}" data-name="{brand} {name}" data-price="{price}" data-brand="{brand}" data-img="../images/{img}">
            Voeg toe aan mix
          </button>
        </div>
        <div class="product-usps">
          <div class="product-usp"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg><span>Gratis verzending v.a. €40</span></div>
          <div class="product-usp"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><span>Voor 23:59 besteld = morgen in huis</span></div>
          <div class="product-usp"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg><span>14 dagen bedenktijd</span></div>
        </div>
        <div class="product-discount-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Bestel 12+ stuks en bespaar 5%. Bestel 24+ stuks en bespaar 10%.
        </div>
      </div>
    </div>
  </div>
</section>
<div id="site-footer"></div>
<script src="../js/shop.js?v=32"></script>
<script src="../js/header-template.js?v=32"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {{
  let qty = 1;
  const qtyVal = document.getElementById('qty-val');
  document.getElementById('qty-minus').addEventListener('click', () => {{ if(qty > 1) {{ qty--; qtyVal.textContent = qty; }} }});
  document.getElementById('qty-plus').addEventListener('click', () => {{ qty++; qtyVal.textContent = qty; }});
  document.getElementById('add-to-cart-btn').addEventListener('click', function() {{
    const product = {{
      id: parseInt(this.dataset.id),
      name: this.dataset.name,
      brand: this.dataset.brand,
      price: parseFloat(this.dataset.price),
      img: this.dataset.img
    }};
    window.SmikkieShop.addToCart(product, qty);
    window.SmikkieShop.showToast(product.name + ' toegevoegd! 💜');
  }});
}});
</script>
</body>
</html>'''

for p in products:
    cat_url, cat_label = cat_map.get(p['cat'], ('alle-snacks.html', 'Alle snacks'))
    price_str = f"{p['price']:.2f}".replace('.', ',')
    desc_short = p['desc'][:80] + '...' if len(p['desc']) > 80 else p['desc']
    
    content = template.format(
        id=p['id'],
        brand=p['brand'],
        name=p['name'],
        slug=p['slug'],
        price=price_str,
        img=p['img'],
        cat_url=cat_url,
        cat_label=cat_label,
        protein=p['protein'],
        sugar=p['sugar'],
        kcal=p['kcal'],
        desc=p['desc'],
        desc_short=desc_short,
    )
    
    fname = f"/home/ubuntu/smikkie-shop/pages/{p['slug']}.html"
    with open(fname, 'w') as f:
        f.write(content)
    print(f"Written: {p['slug']}.html")

print("All PDPs done!")
