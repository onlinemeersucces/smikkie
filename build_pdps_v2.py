"""
build_pdps_v2.py
Generates full PDP pages for all products based on barebells.html structure.
Each page is an exact copy of barebells.html with product-specific data.
"""
import os

PAGES_DIR = '/home/ubuntu/smikkie-shop/pages'

# ── Product definitions ────────────────────────────────────────────────────────
PRODUCTS = [

    # ── BAREBELLS individual flavors ──────────────────────────────────────────
    {
        'filename': 'barebells-chocolate-dough.html',
        'brand': 'Barebells',
        'brand_upper': 'BAREBELLS',
        'title': 'Barebells Chocolate Dough',
        'slug': 'barebells',
        'category': 'Eiwitrepen',
        'category_url': '../pages/eiwitrepen.html',
        'desc': 'De klassieker van Barebells. Smaakt als echte cookie dough met chocolade 🍪🍫<br>20g eiwit per reep, minder dan 2g suiker.',
        'smikkie_zegt': 'Deze gaat hard... echt eentje die je moet proberen 🤤',
        'highlight_id': 'bb-choc-dough',
        'img': '../images/barebells.jpg',
        'reviews_title': 'Wat anderen zeggen 🍪🍫',
        'reviews': [
            ('Sanne', '2 dagen geleden', 'Echt mijn favoriet! Smaakt naar echte cookie dough 😍'),
            ('Mike', '5 dagen geleden', 'Heerlijke reep en goede voedingswaarden.'),
            ('Lotte', '1 week geleden', 'Altijd in mijn mix, deze mag niet ontbreken!'),
            ('Tom', '1 week geleden', 'Zacht van binnen en echt super lekker.'),
        ],
        'flavors': [
            ('bb-choc-dough',    'Chocolate Dough',        2.49, '../images/barebells.jpg', '20g', '1.2g', '218'),
            ('bb-salty-peanut',  'Salty Peanut',           2.49, '../images/barebells.jpg', '20g', '1.4g', '215'),
            ('bb-cookies-cream', 'Cookies & Cream',        2.49, '../images/barebells.jpg', '20g', '1.0g', '210'),
            ('bb-caramel-cashew','Caramel Cashew',         2.49, '../images/barebells.jpg', '20g', '1.3g', '222'),
            ('bb-white-choc',    'White Chocolate Almond', 2.49, '../images/barebells.jpg', '20g', '1.1g', '216'),
            ('bb-hazelnut',      'Hazelnut Nougat',        2.49, '../images/barebells.jpg', '20g', '1.5g', '220'),
            ('bb-peanut-butter', 'Peanut Butter',          2.49, '../images/barebells.jpg', '20g', '1.3g', '219'),
            ('bb-strawberry',    'Strawberry',             2.49, '../images/barebells.jpg', '20g', '1.6g', '213'),
        ],
        'dozen': [
            ('bb-doos-12',  'Doos 12 stuks – Mix naar keuze', 28.69, '12 stuks'),
            ('bb-doos-24',  'Doos 24 stuks – Mix naar keuze', 53.73, '24 stuks'),
            ('bb-doos-48',  'Doos 48 stuks – Mix naar keuze', 95.52, '48 stuks'),
        ],
        'related': [
            ('Quest Chocolate Chip Cookie', '../pages/quest-chocolate-chip-cookie.html', '../images/quest.jpg', '€2,99'),
            ('N!CK\'s Peanut Caramel',      '../pages/nicks-peanut-caramel.html',        '../images/nicks.jpg',  '€2,49'),
            ('NOCCO BCAA Passion',          '../pages/nocco-bcaa-passion.html',          '../images/nocco.jpg',  '€2,49'),
        ],
        'reviews_count': '128',
        'type': 'reep',
    },

    {
        'filename': 'barebells-caramel-cashew.html',
        'brand': 'Barebells',
        'brand_upper': 'BAREBELLS',
        'title': 'Barebells Caramel Cashew',
        'slug': 'barebells',
        'category': 'Eiwitrepen',
        'category_url': '../pages/eiwitrepen.html',
        'desc': 'Romige caramel met knapperige cashew. Een van de meest populaire smaken van Barebells 🥜🍮<br>20g eiwit per reep, minder dan 2g suiker.',
        'smikkie_zegt': 'Caramel + cashew = perfecte combo. Echt niet te stoppen 🥜',
        'highlight_id': 'bb-caramel-cashew',
        'img': '../images/barebells.jpg',
        'reviews_title': 'Wat anderen zeggen 🥜🍮',
        'reviews': [
            ('Emma', '1 dag geleden', 'Mijn absolute favoriet! Die caramel-cashew combo is onverslaanbaar.'),
            ('Joris', '3 dagen geleden', 'Heerlijk knapperig en toch romig. Top reep!'),
            ('Nadia', '1 week geleden', 'Bestel ze altijd per doos. Nooit meer zonder!'),
            ('Bas', '2 weken geleden', 'Beste eiwitreep die ik ooit heb gehad.'),
        ],
        'flavors': [
            ('bb-caramel-cashew','Caramel Cashew',         2.49, '../images/barebells.jpg', '20g', '1.3g', '222'),
            ('bb-choc-dough',    'Chocolate Dough',        2.49, '../images/barebells.jpg', '20g', '1.2g', '218'),
            ('bb-salty-peanut',  'Salty Peanut',           2.49, '../images/barebells.jpg', '20g', '1.4g', '215'),
            ('bb-cookies-cream', 'Cookies & Cream',        2.49, '../images/barebells.jpg', '20g', '1.0g', '210'),
            ('bb-white-choc',    'White Chocolate Almond', 2.49, '../images/barebells.jpg', '20g', '1.1g', '216'),
            ('bb-hazelnut',      'Hazelnut Nougat',        2.49, '../images/barebells.jpg', '20g', '1.5g', '220'),
            ('bb-peanut-butter', 'Peanut Butter',          2.49, '../images/barebells.jpg', '20g', '1.3g', '219'),
            ('bb-strawberry',    'Strawberry',             2.49, '../images/barebells.jpg', '20g', '1.6g', '213'),
        ],
        'dozen': [
            ('bb-doos-12',  'Doos 12 stuks – Mix naar keuze', 28.69, '12 stuks'),
            ('bb-doos-24',  'Doos 24 stuks – Mix naar keuze', 53.73, '24 stuks'),
            ('bb-doos-48',  'Doos 48 stuks – Mix naar keuze', 95.52, '48 stuks'),
        ],
        'related': [
            ('Barebells Chocolate Dough',  '../pages/barebells-chocolate-dough.html', '../images/barebells.jpg', '€2,49'),
            ('Quest Chocolate Chip Cookie','../pages/quest-chocolate-chip-cookie.html','../images/quest.jpg',    '€2,99'),
            ('N!CK\'s Peanut Caramel',     '../pages/nicks-peanut-caramel.html',       '../images/nicks.jpg',   '€2,49'),
        ],
        'reviews_count': '94',
        'type': 'reep',
    },

    {
        'filename': 'barebells-cookies-cream.html',
        'brand': 'Barebells',
        'brand_upper': 'BAREBELLS',
        'title': 'Barebells Cookies & Cream',
        'slug': 'barebells',
        'category': 'Eiwitrepen',
        'category_url': '../pages/eiwitrepen.html',
        'desc': 'Witte chocolade met krokante koekjes-stukjes. Smaakt als een Oreo-milkshake in reepvorm 🍪🤍<br>20g eiwit per reep, slechts 1g suiker.',
        'smikkie_zegt': 'Smaakt echt als een Oreo-milkshake. Waanzinnig goed 🍪',
        'highlight_id': 'bb-cookies-cream',
        'img': '../images/barebells.jpg',
        'reviews_title': 'Wat anderen zeggen 🍪🤍',
        'reviews': [
            ('Lisa', '2 dagen geleden', 'Smaakt echt als een Oreo! Mijn nieuwe favoriet.'),
            ('Daan', '4 dagen geleden', 'Krokante stukjes in de reep zijn geweldig.'),
            ('Femke', '1 week geleden', 'Bestel ze altijd als ik een doos samenstel.'),
            ('Rens', '2 weken geleden', 'Lekkerste Barebells smaak wat mij betreft.'),
        ],
        'flavors': [
            ('bb-cookies-cream', 'Cookies & Cream',        2.49, '../images/barebells.jpg', '20g', '1.0g', '210'),
            ('bb-choc-dough',    'Chocolate Dough',        2.49, '../images/barebells.jpg', '20g', '1.2g', '218'),
            ('bb-caramel-cashew','Caramel Cashew',         2.49, '../images/barebells.jpg', '20g', '1.3g', '222'),
            ('bb-salty-peanut',  'Salty Peanut',           2.49, '../images/barebells.jpg', '20g', '1.4g', '215'),
            ('bb-white-choc',    'White Chocolate Almond', 2.49, '../images/barebells.jpg', '20g', '1.1g', '216'),
            ('bb-hazelnut',      'Hazelnut Nougat',        2.49, '../images/barebells.jpg', '20g', '1.5g', '220'),
            ('bb-peanut-butter', 'Peanut Butter',          2.49, '../images/barebells.jpg', '20g', '1.3g', '219'),
            ('bb-strawberry',    'Strawberry',             2.49, '../images/barebells.jpg', '20g', '1.6g', '213'),
        ],
        'dozen': [
            ('bb-doos-12',  'Doos 12 stuks – Mix naar keuze', 28.69, '12 stuks'),
            ('bb-doos-24',  'Doos 24 stuks – Mix naar keuze', 53.73, '24 stuks'),
            ('bb-doos-48',  'Doos 48 stuks – Mix naar keuze', 95.52, '48 stuks'),
        ],
        'related': [
            ('Barebells Chocolate Dough', '../pages/barebells-chocolate-dough.html', '../images/barebells.jpg', '€2,49'),
            ('N!CK\'s Wafer Bar',         '../pages/nicks-wafer-bar-chocolate.html', '../images/nicks.jpg',     '€2,49'),
            ('SmartSweets Gummy Bears',   '../pages/smartsweets-gummy-bears.html',   '../images/smartsweets.jpg','€2,99'),
        ],
        'reviews_count': '76',
        'type': 'reep',
    },

    # ── NOCCO ─────────────────────────────────────────────────────────────────
    {
        'filename': 'nocco-bcaa-passion.html',
        'brand': 'NOCCO',
        'brand_upper': 'NOCCO',
        'title': 'NOCCO BCAA Passion',
        'slug': 'nocco',
        'category': 'Drankjes',
        'category_url': '../pages/drankjes.html',
        'desc': 'Frisse passievrucht smaak met 180mg cafeïne en 8 essentiële BCAA\'s 🏋️‍♂️🍹<br>Nul suiker, nul vet, perfect voor voor of na je training.',
        'smikkie_zegt': 'Mijn pre-workout van keuze. Passievrucht is gewoon top 🍹',
        'highlight_id': 'nocco-passion',
        'img': '../images/nocco.jpg',
        'reviews_title': 'Wat anderen zeggen 🍹💪',
        'reviews': [
            ('Thijs', '1 dag geleden', 'Beste energydrank die ik ken. Passievrucht is heerlijk!'),
            ('Anouk', '3 dagen geleden', 'Drink ik elke dag voor mijn training. Echt top.'),
            ('Kevin', '1 week geleden', 'Lekker fris en niet te zoet. Aanrader!'),
            ('Sara', '2 weken geleden', 'Eindelijk een energydrank zonder suiker die lekker smaakt.'),
        ],
        'flavors': [
            ('nocco-passion',   'Passion',         2.49, '../images/nocco.jpg', '8g BCAA', '0g', '15'),
            ('nocco-caribbean', 'Caribbean',       2.49, '../images/nocco.jpg', '8g BCAA', '0g', '15'),
            ('nocco-apple',     'Apple',           2.49, '../images/nocco.jpg', '8g BCAA', '0g', '12'),
            ('nocco-peach',     'Peach',           2.49, '../images/nocco.jpg', '8g BCAA', '0g', '13'),
            ('nocco-limon',     'Limon del Sol',   2.49, '../images/nocco.jpg', '8g BCAA', '0g', '11'),
            ('nocco-elderflower','Elderflower',    2.49, '../images/nocco.jpg', '8g BCAA', '0g', '12'),
        ],
        'dozen': [
            ('nocco-tray-6',  'Tray 6 blikjes – Mix naar keuze', 13.99, '6 blikjes'),
            ('nocco-tray-12', 'Tray 12 blikjes – Mix naar keuze', 26.99, '12 blikjes'),
            ('nocco-tray-24', 'Tray 24 blikjes – Mix naar keuze', 50.99, '24 blikjes'),
        ],
        'related': [
            ('NOCCO BCAA Caribbean',    '../pages/nocco-bcaa-caribbean.html', '../images/nocco.jpg',  '€2,49'),
            ('Fanta Zero Sugar',        '../pages/fanta-zero-sugar.html',     '../images/fanta.jpg',  '€1,49'),
            ('Barebells Chocolate Dough','../pages/barebells-chocolate-dough.html','../images/barebells.jpg','€2,49'),
        ],
        'reviews_count': '203',
        'type': 'drankje',
    },

    {
        'filename': 'nocco-bcaa-caribbean.html',
        'brand': 'NOCCO',
        'brand_upper': 'NOCCO',
        'title': 'NOCCO BCAA Caribbean',
        'slug': 'nocco',
        'category': 'Drankjes',
        'category_url': '../pages/drankjes.html',
        'desc': 'Tropische Caribbean smaak met 180mg cafeïne en 8 essentiële BCAA\'s 🌴🥤<br>Nul suiker, nul vet, perfect voor voor of na je training.',
        'smikkie_zegt': 'Tropisch en fris. Voelt als vakantie in een blikje 🌴',
        'highlight_id': 'nocco-caribbean',
        'img': '../images/nocco.jpg',
        'reviews_title': 'Wat anderen zeggen 🌴🥤',
        'reviews': [
            ('Mila', '2 dagen geleden', 'Tropische smaak is echt geweldig. Mijn favoriet!'),
            ('Ruben', '5 dagen geleden', 'Drink ik na elke workout. Heerlijk fris.'),
            ('Iris', '1 week geleden', 'Lekkerste NOCCO smaak in mijn ogen.'),
            ('Lars', '2 weken geleden', 'Altijd een tray in de koelkast. Nooit meer zonder.'),
        ],
        'flavors': [
            ('nocco-caribbean', 'Caribbean',       2.49, '../images/nocco.jpg', '8g BCAA', '0g', '15'),
            ('nocco-passion',   'Passion',         2.49, '../images/nocco.jpg', '8g BCAA', '0g', '15'),
            ('nocco-apple',     'Apple',           2.49, '../images/nocco.jpg', '8g BCAA', '0g', '12'),
            ('nocco-peach',     'Peach',           2.49, '../images/nocco.jpg', '8g BCAA', '0g', '13'),
            ('nocco-limon',     'Limon del Sol',   2.49, '../images/nocco.jpg', '8g BCAA', '0g', '11'),
            ('nocco-elderflower','Elderflower',    2.49, '../images/nocco.jpg', '8g BCAA', '0g', '12'),
        ],
        'dozen': [
            ('nocco-tray-6',  'Tray 6 blikjes – Mix naar keuze', 13.99, '6 blikjes'),
            ('nocco-tray-12', 'Tray 12 blikjes – Mix naar keuze', 26.99, '12 blikjes'),
            ('nocco-tray-24', 'Tray 24 blikjes – Mix naar keuze', 50.99, '24 blikjes'),
        ],
        'related': [
            ('NOCCO BCAA Passion',       '../pages/nocco-bcaa-passion.html',   '../images/nocco.jpg',  '€2,49'),
            ('Fanta Zero Sugar',         '../pages/fanta-zero-sugar.html',     '../images/fanta.jpg',  '€1,49'),
            ('Barebells Chocolate Dough','../pages/barebells-chocolate-dough.html','../images/barebells.jpg','€2,49'),
        ],
        'reviews_count': '178',
        'type': 'drankje',
    },

    {
        'filename': 'fanta-zero-sugar.html',
        'brand': 'Fanta',
        'brand_upper': 'FANTA',
        'title': 'Fanta Zero Sugar',
        'slug': 'fanta',
        'category': 'Drankjes',
        'category_url': '../pages/drankjes.html',
        'desc': 'De bekende Fanta-smaak, nu zonder suiker en calorieën 🍊🫧<br>Lekker fris, perfect als snackbegeleider.',
        'smikkie_zegt': 'Lekker fris bij je snacks. Klassiek en altijd goed 🍊',
        'highlight_id': 'fanta-orange',
        'img': '../images/fanta.jpg',
        'reviews_title': 'Wat anderen zeggen 🍊🫧',
        'reviews': [
            ('Pien', '1 dag geleden', 'Lekker fris en geen suiker. Win-win!'),
            ('Stef', '4 dagen geleden', 'Smaakt precies als de gewone Fanta, maar dan zonder suiker.'),
            ('Bo', '1 week geleden', 'Altijd in mijn bestelling. Heerlijk bij mijn snacks.'),
            ('Cas', '2 weken geleden', 'Goede prijs en snel geleverd. Aanrader!'),
        ],
        'flavors': [
            ('fanta-orange', 'Orange Zero',  1.49, '../images/fanta.jpg', '0g', '0g', '3'),
            ('fanta-lemon',  'Lemon Zero',   1.49, '../images/fanta.jpg', '0g', '0g', '2'),
            ('fanta-grape',  'Grape Zero',   1.49, '../images/fanta.jpg', '0g', '0g', '2'),
            ('fanta-exotic', 'Exotic Zero',  1.49, '../images/fanta.jpg', '0g', '0g', '3'),
        ],
        'dozen': [
            ('fanta-tray-6',  'Tray 6 blikjes – Mix naar keuze', 8.49,  '6 blikjes'),
            ('fanta-tray-12', 'Tray 12 blikjes – Mix naar keuze', 15.99, '12 blikjes'),
            ('fanta-tray-24', 'Tray 24 blikjes – Mix naar keuze', 29.99, '24 blikjes'),
        ],
        'related': [
            ('NOCCO BCAA Passion',    '../pages/nocco-bcaa-passion.html',   '../images/nocco.jpg',  '€2,49'),
            ('NOCCO BCAA Caribbean',  '../pages/nocco-bcaa-caribbean.html', '../images/nocco.jpg',  '€2,49'),
            ('Barebells Chocolate Dough','../pages/barebells-chocolate-dough.html','../images/barebells.jpg','€2,49'),
        ],
        'reviews_count': '89',
        'type': 'drankje',
    },

    # ── QUEST ─────────────────────────────────────────────────────────────────
    {
        'filename': 'quest-chocolate-chip-cookie.html',
        'brand': 'Quest',
        'brand_upper': 'QUEST',
        'title': 'Quest Chocolate Chip Cookie',
        'slug': 'quest',
        'category': 'Eiwitrepen',
        'category_url': '../pages/eiwitrepen.html',
        'desc': 'Smaakt als een echte chocolate chip cookie, maar dan met 21g eiwit 🍪💪<br>Laag in suiker, hoog in vezels. De ultieme guilt-free treat.',
        'smikkie_zegt': 'Smaakt echt als een koekje. Niet te geloven dat dit gezond is 🍪',
        'highlight_id': 'quest-choc-chip',
        'img': '../images/quest.jpg',
        'reviews_title': 'Wat anderen zeggen 🍪💪',
        'reviews': [
            ('Noor', '1 dag geleden', 'Smaakt echt als een koekje! Waanzinnig.'),
            ('Bram', '3 dagen geleden', '21g eiwit en het smaakt als een dessert. Perfecte reep.'),
            ('Eline', '1 week geleden', 'Mijn favoriete Quest smaak. Altijd in mijn box.'),
            ('Sven', '2 weken geleden', 'Lekkerder dan de meeste andere eiwitrepen. Aanrader!'),
        ],
        'flavors': [
            ('quest-choc-chip',    'Chocolate Chip Cookie',  2.99, '../images/quest.jpg', '21g', '1g', '190'),
            ('quest-double-choc',  'Double Chocolate Chunk', 2.99, '../images/quest.jpg', '21g', '1g', '195'),
            ('quest-peanut',       'Peanut Butter',          2.99, '../images/quest.jpg', '21g', '1g', '200'),
            ('quest-birthday',     'Birthday Cake',          2.99, '../images/quest.jpg', '21g', '1g', '185'),
            ('quest-cookies-cream','Cookies & Cream',        2.99, '../images/quest.jpg', '21g', '1g', '188'),
            ('quest-blueberry',    'Blueberry Muffin',       2.99, '../images/quest.jpg', '21g', '1g', '183'),
        ],
        'dozen': [
            ('quest-doos-12', 'Doos 12 stuks – Mix naar keuze', 33.99, '12 stuks'),
            ('quest-doos-24', 'Doos 24 stuks – Mix naar keuze', 63.99, '24 stuks'),
            ('quest-doos-48', 'Doos 48 stuks – Mix naar keuze', 114.99, '48 stuks'),
        ],
        'related': [
            ('Quest Double Chocolate',    '../pages/quest-double-chocolate-chip.html', '../images/quest.jpg',    '€2,99'),
            ('Barebells Chocolate Dough', '../pages/barebells-chocolate-dough.html',   '../images/barebells.jpg','€2,49'),
            ('N!CK\'s Peanut Caramel',    '../pages/nicks-peanut-caramel.html',        '../images/nicks.jpg',    '€2,49'),
        ],
        'reviews_count': '156',
        'type': 'reep',
    },

    {
        'filename': 'quest-double-chocolate-chip.html',
        'brand': 'Quest',
        'brand_upper': 'QUEST',
        'title': 'Quest Double Chocolate Chunk',
        'slug': 'quest',
        'category': 'Eiwitrepen',
        'category_url': '../pages/eiwitrepen.html',
        'desc': 'Dubbele chocolade voor de echte chocoholic 🍫🍫<br>21g eiwit, 1g suiker. Intense chocoladesmaak zonder de calorieën.',
        'smikkie_zegt': 'Voor de echte chocolade-addict. Dubbel lekker, dubbel goed 🍫',
        'highlight_id': 'quest-double-choc',
        'img': '../images/quest.jpg',
        'reviews_title': 'Wat anderen zeggen 🍫🍫',
        'reviews': [
            ('Jade', '2 dagen geleden', 'Intense chocoladesmaak! Precies wat ik zocht.'),
            ('Finn', '5 dagen geleden', 'Dubbele chocolade = dubbel lekker. Simpel.'),
            ('Vera', '1 week geleden', 'Mijn go-to reep na het sporten.'),
            ('Koen', '2 weken geleden', 'Heerlijk en vullend. Aanrader voor chocoholics!'),
        ],
        'flavors': [
            ('quest-double-choc',  'Double Chocolate Chunk', 2.99, '../images/quest.jpg', '21g', '1g', '195'),
            ('quest-choc-chip',    'Chocolate Chip Cookie',  2.99, '../images/quest.jpg', '21g', '1g', '190'),
            ('quest-peanut',       'Peanut Butter',          2.99, '../images/quest.jpg', '21g', '1g', '200'),
            ('quest-birthday',     'Birthday Cake',          2.99, '../images/quest.jpg', '21g', '1g', '185'),
            ('quest-cookies-cream','Cookies & Cream',        2.99, '../images/quest.jpg', '21g', '1g', '188'),
            ('quest-blueberry',    'Blueberry Muffin',       2.99, '../images/quest.jpg', '21g', '1g', '183'),
        ],
        'dozen': [
            ('quest-doos-12', 'Doos 12 stuks – Mix naar keuze', 33.99, '12 stuks'),
            ('quest-doos-24', 'Doos 24 stuks – Mix naar keuze', 63.99, '24 stuks'),
            ('quest-doos-48', 'Doos 48 stuks – Mix naar keuze', 114.99, '48 stuks'),
        ],
        'related': [
            ('Quest Chocolate Chip Cookie','../pages/quest-chocolate-chip-cookie.html','../images/quest.jpg',   '€2,99'),
            ('Barebells Chocolate Dough',  '../pages/barebells-chocolate-dough.html',  '../images/barebells.jpg','€2,49'),
            ('N!CK\'s Chocolate Peanut',   '../pages/nicks-chocolate-peanut-cups.html','../images/nicks.jpg',   '€2,49'),
        ],
        'reviews_count': '112',
        'type': 'reep',
    },

    # ── N!CK'S ────────────────────────────────────────────────────────────────
    {
        'filename': 'nicks-peanut-caramel.html',
        'brand': "N!CK's",
        'brand_upper': "NICK'S",
        'title': "N!CK's Peanut Caramel",
        'slug': 'nicks',
        'category': 'Snacks & Koekjes',
        'category_url': '../pages/snacks-koekjes.html',
        'desc': 'Romige pindakaas met zachte caramel, omhuld in pure chocolade 🥜🍮<br>Laag in suiker, hoog in smaak. De perfecte guilt-free snack.',
        'smikkie_zegt': 'Pindakaas + caramel = hemels. Echt niet te stoppen 🥜',
        'highlight_id': 'nicks-peanut-caramel',
        'img': '../images/nicks.jpg',
        'reviews_title': "Wat anderen zeggen 🥜🍮",
        'reviews': [
            ('Fleur', '1 dag geleden', 'Smaakt als een Snickers maar dan zonder de schuld!'),
            ('Arno', '3 dagen geleden', 'Heerlijk romig en knapperig tegelijk.'),
            ('Lena', '1 week geleden', 'Mijn favoriete N!CK\'s product. Altijd in mijn box.'),
            ('Tim', '2 weken geleden', 'Perfecte snack voor onderweg. Echt lekker!'),
        ],
        'flavors': [
            ('nicks-peanut-caramel',  'Peanut Caramel',       2.49, '../images/nicks.jpg', '6g', '2g', '165'),
            ('nicks-choc-peanut',     'Chocolate Peanut Cups',2.49, '../images/nicks.jpg', '5g', '2g', '158'),
            ('nicks-wafer-choc',      'Wafer Bar Chocolate',  2.49, '../images/nicks.jpg', '5g', '2g', '170'),
            ('nicks-caramel-crisp',   'Caramel Crisp',        2.49, '../images/nicks.jpg', '5g', '2g', '162'),
            ('nicks-hazelnut-praline','Hazelnut Praline',     2.49, '../images/nicks.jpg', '5g', '2g', '168'),
        ],
        'dozen': [
            ('nicks-doos-12', 'Doos 12 stuks – Mix naar keuze', 27.99, '12 stuks'),
            ('nicks-doos-24', 'Doos 24 stuks – Mix naar keuze', 52.99, '24 stuks'),
            ('nicks-doos-48', 'Doos 48 stuks – Mix naar keuze', 95.99, '48 stuks'),
        ],
        'related': [
            ("N!CK's Chocolate Peanut Cups", '../pages/nicks-chocolate-peanut-cups.html', '../images/nicks.jpg',    '€2,49'),
            ("N!CK's Wafer Bar",             '../pages/nicks-wafer-bar-chocolate.html',   '../images/nicks.jpg',    '€2,49'),
            ('SmartSweets Gummy Bears',      '../pages/smartsweets-gummy-bears.html',     '../images/smartsweets.jpg','€2,99'),
        ],
        'reviews_count': '87',
        'type': 'snack',
    },

    {
        'filename': 'nicks-chocolate-peanut-cups.html',
        'brand': "N!CK's",
        'brand_upper': "NICK'S",
        'title': "N!CK's Chocolate Peanut Cups",
        'slug': 'nicks',
        'category': 'Snacks & Koekjes',
        'category_url': '../pages/snacks-koekjes.html',
        'desc': 'Mini chocolade cups gevuld met romige pindakaas 🍫🥜<br>Denk Reese\'s maar dan zonder suiker. Echt niet te stoppen.',
        'smikkie_zegt': 'Reese\'s-vibes maar zonder de suiker. Echt genieten 🍫',
        'highlight_id': 'nicks-choc-peanut',
        'img': '../images/nicks.jpg',
        'reviews_title': "Wat anderen zeggen 🍫🥜",
        'reviews': [
            ('Roos', '2 dagen geleden', 'Smaakt als Reese\'s! Echt waanzinnig lekker.'),
            ('Niels', '4 dagen geleden', 'Perfecte snack. Romig en chocoladeachtig.'),
            ('Hanna', '1 week geleden', 'Bestel ze altijd per doos. Nooit meer zonder!'),
            ('Wout', '2 weken geleden', 'Beste guilt-free snack die ik ken.'),
        ],
        'flavors': [
            ('nicks-choc-peanut',     'Chocolate Peanut Cups',2.49, '../images/nicks.jpg', '5g', '2g', '158'),
            ('nicks-peanut-caramel',  'Peanut Caramel',       2.49, '../images/nicks.jpg', '6g', '2g', '165'),
            ('nicks-wafer-choc',      'Wafer Bar Chocolate',  2.49, '../images/nicks.jpg', '5g', '2g', '170'),
            ('nicks-caramel-crisp',   'Caramel Crisp',        2.49, '../images/nicks.jpg', '5g', '2g', '162'),
            ('nicks-hazelnut-praline','Hazelnut Praline',     2.49, '../images/nicks.jpg', '5g', '2g', '168'),
        ],
        'dozen': [
            ('nicks-doos-12', 'Doos 12 stuks – Mix naar keuze', 27.99, '12 stuks'),
            ('nicks-doos-24', 'Doos 24 stuks – Mix naar keuze', 52.99, '24 stuks'),
            ('nicks-doos-48', 'Doos 48 stuks – Mix naar keuze', 95.99, '48 stuks'),
        ],
        'related': [
            ("N!CK's Peanut Caramel", '../pages/nicks-peanut-caramel.html',        '../images/nicks.jpg',    '€2,49'),
            ("N!CK's Wafer Bar",      '../pages/nicks-wafer-bar-chocolate.html',   '../images/nicks.jpg',    '€2,49'),
            ('Quest Chocolate Chip',  '../pages/quest-chocolate-chip-cookie.html', '../images/quest.jpg',    '€2,99'),
        ],
        'reviews_count': '64',
        'type': 'snack',
    },

    {
        'filename': 'nicks-wafer-bar-chocolate.html',
        'brand': "N!CK's",
        'brand_upper': "NICK'S",
        'title': "N!CK's Wafer Bar Chocolate",
        'slug': 'nicks',
        'category': 'Snacks & Koekjes',
        'category_url': '../pages/snacks-koekjes.html',
        'desc': 'Knapperige waferlagen met romige chocolade 🍫✨<br>Denk KitKat maar dan zonder suiker en met minder calorieën.',
        'smikkie_zegt': 'KitKat-vibes zonder de suiker. Knapperig en heerlijk 🍫',
        'highlight_id': 'nicks-wafer-choc',
        'img': '../images/nicks.jpg',
        'reviews_title': "Wat anderen zeggen 🍫✨",
        'reviews': [
            ('Isa', '1 dag geleden', 'Smaakt als een KitKat! Echt niet te geloven.'),
            ('Jens', '3 dagen geleden', 'Knapperig en chocoladeachtig. Perfecte snack.'),
            ('Maud', '1 week geleden', 'Mijn favoriete N!CK\'s product. Altijd in mijn box.'),
            ('Pieter', '2 weken geleden', 'Lekker en laag in suiker. Win-win!'),
        ],
        'flavors': [
            ('nicks-wafer-choc',      'Wafer Bar Chocolate',  2.49, '../images/nicks.jpg', '5g', '2g', '170'),
            ('nicks-peanut-caramel',  'Peanut Caramel',       2.49, '../images/nicks.jpg', '6g', '2g', '165'),
            ('nicks-choc-peanut',     'Chocolate Peanut Cups',2.49, '../images/nicks.jpg', '5g', '2g', '158'),
            ('nicks-caramel-crisp',   'Caramel Crisp',        2.49, '../images/nicks.jpg', '5g', '2g', '162'),
            ('nicks-hazelnut-praline','Hazelnut Praline',     2.49, '../images/nicks.jpg', '5g', '2g', '168'),
        ],
        'dozen': [
            ('nicks-doos-12', 'Doos 12 stuks – Mix naar keuze', 27.99, '12 stuks'),
            ('nicks-doos-24', 'Doos 24 stuks – Mix naar keuze', 52.99, '24 stuks'),
            ('nicks-doos-48', 'Doos 48 stuks – Mix naar keuze', 95.99, '48 stuks'),
        ],
        'related': [
            ("N!CK's Peanut Caramel",       '../pages/nicks-peanut-caramel.html',        '../images/nicks.jpg',    '€2,49'),
            ("N!CK's Chocolate Peanut Cups",'../pages/nicks-chocolate-peanut-cups.html', '../images/nicks.jpg',    '€2,49'),
            ('Barebells Cookies & Cream',   '../pages/barebells-cookies-cream.html',     '../images/barebells.jpg','€2,49'),
        ],
        'reviews_count': '71',
        'type': 'snack',
    },

    # ── SMARTSWEETS ───────────────────────────────────────────────────────────
    {
        'filename': 'smartsweets-gummy-bears.html',
        'brand': 'SmartSweets',
        'brand_upper': 'SMARTSWEETS',
        'title': 'SmartSweets Gummy Bears',
        'slug': 'smartsweets',
        'category': 'Treats',
        'category_url': '../pages/treats-mix.html',
        'desc': 'De lekkerste gummy bears ooit, met slechts 3g suiker per zakje 🐻🍬<br>Hoog in vezels, plantaardig, en echt onweerstaanbaar.',
        'smikkie_zegt': 'Gummy bears zonder schuldgevoel? Ja, dat bestaat echt 🐻',
        'highlight_id': 'ss-gummy-bears',
        'img': '../images/smartsweets.jpg',
        'reviews_title': 'Wat anderen zeggen 🐻🍬',
        'reviews': [
            ('Zoë', '1 dag geleden', 'Echt niet te geloven dat dit maar 3g suiker heeft. Heerlijk!'),
            ('Max', '3 dagen geleden', 'Mijn kinderen zijn er dol op. Wij ook trouwens.'),
            ('Lara', '1 week geleden', 'Eindelijk snoep zonder schuldgevoel. Aanrader!'),
            ('Daan', '2 weken geleden', 'Smaakt precies als echte gummy bears. Top product.'),
        ],
        'flavors': [
            ('ss-gummy-bears',    'Gummy Bears',         2.99, '../images/smartsweets.jpg', '3g', '3g', '90'),
            ('ss-peach-rings',    'Peach Rings',         2.99, '../images/smartsweets.jpg', '3g', '3g', '90'),
            ('ss-sour-blast',     'Sour Blast Buddies',  2.99, '../images/smartsweets.jpg', '3g', '3g', '88'),
            ('ss-tropical',       'Tropical Mix',        2.99, '../images/smartsweets.jpg', '3g', '3g', '92'),
            ('ss-cola-gummies',   'Cola Gummies',        2.99, '../images/smartsweets.jpg', '3g', '3g', '89'),
        ],
        'dozen': [
            ('ss-doos-12', 'Doos 12 zakjes – Mix naar keuze', 33.99, '12 zakjes'),
            ('ss-doos-24', 'Doos 24 zakjes – Mix naar keuze', 63.99, '24 zakjes'),
        ],
        'related': [
            ('Barebells Chocolate Dough', '../pages/barebells-chocolate-dough.html',   '../images/barebells.jpg','€2,49'),
            ("N!CK's Peanut Caramel",     '../pages/nicks-peanut-caramel.html',        '../images/nicks.jpg',    '€2,49'),
            ('Quest Chocolate Chip',      '../pages/quest-chocolate-chip-cookie.html', '../images/quest.jpg',    '€2,99'),
        ],
        'reviews_count': '143',
        'type': 'treat',
    },
]

# ── HTML template ─────────────────────────────────────────────────────────────
def build_flavor_js(flavors):
    lines = []
    for fid, fname, fprice, fimg, feiwit, fsuiker, fkcal in flavors:
        lines.append(
            f"    {{ id: '{fid}', name: '{fname}', price: {fprice}, img: '{fimg}', "
            f"macros: {{ eiwit: '{feiwit}', suiker: '{fsuiker}', kcal: '{fkcal}' }} }}"
        )
    return ',\n'.join(lines)

def build_dozen_options(dozen):
    opts = []
    for did, dname, dprice, dqty in dozen:
        opts.append(
            f'<div class="pdp-dozen-option" data-id="{did}" data-price="{dprice}" data-qty="{dqty}">'
            f'<div class="pdp-dozen-option__info"><strong>{dname}</strong>'
            f'<span class="pdp-dozen-option__qty">{dqty}</span></div>'
            f'<div class="pdp-dozen-option__price">€{dprice:.2f}</div>'
            f'</div>'
        )
    return '\n'.join(opts)

def build_reviews(reviews):
    cards = []
    for name, when, text in reviews:
        cards.append(
            f'<div class="review-card">'
            f'<div class="stars"><span class="star">★</span><span class="star">★</span>'
            f'<span class="star">★</span><span class="star">★</span><span class="star">★</span></div>'
            f'<p>"{text}"</p>'
            f'<span>{name}, {when}</span>'
            f'</div>'
        )
    return '\n'.join(cards)

def build_related(related):
    cards = []
    for rname, rurl, rimg, rprice in related:
        cards.append(
            f'<a href="{rurl}" class="related-card">'
            f'<div class="related-card__img-wrap"><img src="{rimg}" alt="{rname}" class="related-card__img"></div>'
            f'<div class="related-card__info"><strong>{rname}</strong><span>{rprice}</span></div>'
            f'</a>'
        )
    return '\n'.join(cards)

def generate_pdp(p):
    first_flavor = p['flavors'][0]
    first_price = first_flavor[2]
    first_id = first_flavor[0]

    html = f'''<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{p["title"]} | Smikkie</title>
  <meta name="description" content="Bestel {p["title"]} bij Smikkie. Lekker snacken zonder schuldgevoel.">
  <link rel="stylesheet" href="../css/base.css?v=32">
  <link rel="stylesheet" href="../css/header.css?v=32">
  <link rel="stylesheet" href="../css/footer.css?v=32">
  <link rel="stylesheet" href="../css/product.css?v=32">
  <link rel="icon" href="../images/favicon.ico" type="image/x-icon">
</head>
<body>
<div id="site-header"></div>
<!-- BREADCRUMB -->
<nav class="breadcrumb container" aria-label="Breadcrumb">
  <a href="../index.html">Home</a>
  <span class="breadcrumb__sep">›</span>
  <a href="{p["category_url"]}">{p["category"]}</a>
  <span class="breadcrumb__sep">›</span>
  <span>{p["title"]}</span>
</nav>
<!-- PRODUCT HERO -->
<section class="product-hero section">
  <div class="container product-hero__inner">
    <!-- LEFT: Gallery + Trust -->
    <div class="gallery-col">
      <div class="gallery-main">
        <img src="{p["img"]}" alt="{p["title"]}" class="gallery-main__img" id="bp-main-img">
        <!-- Smikkie zegt badge -->
        <div class="smikkie-zegt">
          <div class="smikkie-zegt__avatar">
            <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="#F3E8FF"/>
              <circle cx="50" cy="38" r="18" fill="#7C3AED"/>
              <ellipse cx="50" cy="78" rx="26" ry="18" fill="#7C3AED"/>
              <circle cx="43" cy="35" r="3" fill="white"/>
              <circle cx="57" cy="35" r="3" fill="white"/>
              <path d="M43 44 Q50 50 57 44" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <circle cx="24" cy="62" r="5" fill="#E8A87C" opacity="0.5"/>
              <circle cx="76" cy="62" r="5" fill="#E8A87C" opacity="0.5"/>
            </svg>
          </div>
          <div class="smikkie-zegt__content">
            <h4>Smikkie zegt:</h4>
            <p>"{p["smikkie_zegt"]}"</p>
          </div>
          <div class="smikkie-zegt__dashes">
            <div class="sz-dash sz-dash--1"></div>
            <div class="sz-dash sz-dash--2"></div>
          </div>
        </div>
        <!-- Trust badges -->
        <div class="product-info__trust" style="margin-top:16px;">
          <div class="trust-badge">
            <div class="trust-badge__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="5"/><path d="M8 14s-4 1-4 5h16c0-4-4-5-4-5"/></svg>
            </div>
            <div><strong>Smikkie Approved</strong><span>alleen snacks die écht lekker zijn</span></div>
          </div>
          <div class="trust-badge">
            <div class="trust-badge__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div><strong>Morgen in huis</strong><span>Voor 23:59 besteld</span></div>
          </div>
          <div class="trust-badge">
            <div class="trust-badge__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <div><strong>Alles los te bestellen</strong><span>Mix &amp; match wat jij lekker vindt</span></div>
          </div>
        </div>
      </div>
    </div><!-- /gallery-col -->

    <!-- RIGHT: Product Info + Flavor Picker -->
    <div class="product-info">
      <h1 class="product-info__title">{p["brand"]}<br><span id="bp-hero-flavor" style="color:var(--purple);">{first_flavor[1]}</span></h1>
      <div class="product-info__stars">
        <div class="stars">
          <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
        </div>
        <span class="product-info__reviews">{p["reviews_count"]} reviews</span>
      </div>
      <p class="product-info__desc">{p["desc"]}</p>

      <!-- TABS -->
      <div class="pdp-tabs" style="margin-top:20px;">
        <button class="pdp-tab is-active" data-tab="losse">🛒 Losse stuks</button>
        <button class="pdp-tab" data-tab="dozen">📦 Dozen</button>
      </div>

      <!-- TAB: Losse stuks -->
      <div class="pdp-tab-panel" id="bp-tab-losse">
        <!-- Staffel bar -->
        <div class="pdp-staffel-bar" id="bp-staffel-bar">
          <div class="pdp-staffel-bar__item" data-min="1" data-max="11">
            <span class="pdp-staffel-bar__qty">1–11</span>
            <span class="pdp-staffel-bar__label">Normaal tarief</span>
          </div>
          <div class="pdp-staffel-bar__item" data-min="12" data-max="23">
            <span class="pdp-staffel-bar__qty pdp-staffel-bar__qty--green">12+</span>
            <span class="pdp-staffel-bar__label">5% korting</span>
          </div>
          <div class="pdp-staffel-bar__item" data-min="24" data-max="35">
            <span class="pdp-staffel-bar__qty pdp-staffel-bar__qty--green">24+</span>
            <span class="pdp-staffel-bar__label">10% korting</span>
          </div>
          <div class="pdp-staffel-bar__item" data-min="36" data-max="47">
            <span class="pdp-staffel-bar__qty pdp-staffel-bar__qty--green">36+</span>
            <span class="pdp-staffel-bar__label">15% korting</span>
          </div>
          <div class="pdp-staffel-bar__item" data-min="48" data-max="9999">
            <span class="pdp-staffel-bar__qty pdp-staffel-bar__qty--gold">48+</span>
            <span class="pdp-staffel-bar__label">20% korting</span>
          </div>
        </div>
        <!-- Flavor rows -->
        <div class="pdp-flavor-list" id="bp-flavor-list">
          <!-- Rendered by brand-picker.js -->
        </div>
        <!-- Selection summary -->
        <div id="bp-selection-summary" style="display:none"></div>
        <div class="pdp-cart-bar" id="bp-cart-bar" style="display:none">
          <div class="pdp-cart-bar__left">
            <span class="pdp-cart-bar__count" id="bp-cart-count">0 stuks</span>
            <span class="pdp-cart-bar__total" id="bp-cart-total">€0,00</span>
          </div>
          <button class="btn btn--green pdp-cart-bar__btn" id="bp-add-btn">
            Voeg toe aan winkelwagen 💜
          </button>
        </div>
      </div>

      <!-- TAB: Dozen -->
      <div class="pdp-tab-panel" id="bp-tab-dozen" style="display:none">
        <div class="pdp-dozen-list">
          {build_dozen_options(p["dozen"])}
        </div>
        <div class="pdp-cart-bar" id="bp-dozen-cart-bar" style="display:none">
          <div class="pdp-cart-bar__left">
            <span class="pdp-cart-bar__count" id="bp-dozen-count">0 dozen</span>
            <span class="pdp-cart-bar__total" id="bp-dozen-total">€0,00</span>
          </div>
          <button class="btn btn--green pdp-cart-bar__btn" id="bp-dozen-add-btn">
            Voeg dozen toe aan winkelwagen 💜
          </button>
        </div>
      </div>
    </div><!-- /product-info -->
  </div>
</section>

<!-- RELATED PRODUCTS -->
<section class="section related">
  <div class="container">
    <h2 class="section-title">Anderen kochten ook</h2>
    <div class="related__grid">
      {build_related(p["related"])}
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section class="section reviews desktop-only">
  <div class="container">
    <h2 class="section-title">{p["reviews_title"]}</h2>
    <div class="reviews__slider-wrap">
      <button class="related__nav related__nav--prev" id="reviews-prev">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="reviews__slider" id="reviews-slider">
        {build_reviews(p["reviews"])}
      </div>
      <button class="related__nav related__nav--next" id="reviews-next">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  </div>
</section>

<!-- STICKY BAR -->
<div class="sticky-bar" id="sticky-bar">
  <div class="sticky-bar__inner">
    <img src="{p["img"]}" alt="{p["brand"]}" class="sticky-bar__img desktop-only" id="sticky-img">
    <div class="sticky-bar__info">
      <span class="sticky-bar__name">{p["brand"]} – <span id="sticky-flavor-name">{first_flavor[1]}</span></span>
      <span class="sticky-bar__price" id="sticky-price">€{first_price:.2f}</span>
    </div>
    <div class="sticky-bar__actions">
      <button class="btn btn--green sticky-bar__btn" id="bp-sticky-add-btn">
        <span class="desktop-only">Voeg toe aan winkelwagen 💜</span>
        <span class="mobile-only">+ Voeg toe 💜</span>
      </button>
    </div>
  </div>
</div>

<!-- FOOTER -->
<div id="site-footer"></div>
<script src="../js/shop.js?v=32"></script>
<script src="../js/header-template.js?v=32"></script>
<script src="../js/product.js?v=32"></script>
<script src="../js/brand-picker.js?v=32"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {{
  const urlParams = new URLSearchParams(window.location.search);
  const highlightId = urlParams.get('smaak') || '{p["highlight_id"]}';
  window.BrandPicker.init([
{build_flavor_js(p["flavors"])}
  ], {{ brandName: '{p["brand"]}', brand: '{p["brand_upper"]}', highlightId: highlightId }});
}});
</script>
</body>
</html>'''
    return html

# ── Generate all pages ────────────────────────────────────────────────────────
for p in PRODUCTS:
    path = os.path.join(PAGES_DIR, p['filename'])
    html = generate_pdp(p)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Written: {p['filename']} ({len(html.splitlines())} lines)")

print(f"\nAll {len(PRODUCTS)} PDP pages generated!")
