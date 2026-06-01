import os

EMAIL_DIR = '/home/ubuntu/smikkie-shop/emails'

HEAD = '''<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>{title}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body,table,td,a{{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}}
    table,td{{mso-table-lspace:0pt;mso-table-rspace:0pt;}}
    img{{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}}
    body{{margin:0!important;padding:0!important;width:100%!important;background-color:#F5F3FF;}}
    @media only screen and (max-width:620px){{
      .email-container{{width:100%!important;max-width:100%!important;}}
      .stack-col{{display:block!important;width:100%!important;box-sizing:border-box;}}
      .hide-mobile{{display:none!important;}}
      .pad-mobile{{padding:24px 20px!important;}}
      .pad-mobile-sm{{padding:14px 20px!important;}}
      .font-lg{{font-size:22px!important;line-height:1.3!important;}}
      .font-md{{font-size:15px!important;}}
      .trust-cell{{display:block!important;width:100%!important;padding:4px 0!important;text-align:center!important;}}
      .btn-full{{display:block!important;text-align:center!important;}}
      .detail-label{{display:block!important;width:100%!important;}}
      .detail-value{{display:block!important;width:100%!important;text-align:left!important;padding-top:0!important;}}
    }}
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F5F3FF;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">{preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<!-- Wrapper -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F5F3FF;">
<tr><td align="center" style="padding:24px 12px;">
<!-- Container -->
<table class="email-container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">
<!-- HEADER -->
<tr>
  <td align="center" style="background-color:#5B2D8E;border-radius:16px 16px 0 0;padding:24px 32px;">
    <a href="https://smikkie.nl" style="text-decoration:none;">
      <span style="font-size:26px;font-weight:900;color:#ffffff;font-family:Arial,sans-serif;letter-spacing:-0.5px;">Smikkie<span style="color:#C4B5FD;">.</span></span>
    </a>
  </td>
</tr>
<!-- BODY -->
<tr>
  <td class="pad-mobile" style="background-color:#ffffff;padding:36px 40px;border-radius:0 0 16px 16px;font-family:Arial,Helvetica,sans-serif;">
'''

FOOTER = '''
  </td>
</tr>
<!-- TRUST BAR -->
<tr>
  <td style="padding:20px 0 8px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="trust-cell" align="center" style="padding:0 6px;font-size:12px;color:#6B7280;font-family:Arial,sans-serif;font-weight:700;">&#128230; Gratis v.a. &#8364;40</td>
        <td class="trust-cell" align="center" style="padding:0 6px;font-size:12px;color:#6B7280;font-family:Arial,sans-serif;font-weight:700;">&#128666; Morgen in huis</td>
        <td class="trust-cell" align="center" style="padding:0 6px;font-size:12px;color:#6B7280;font-family:Arial,sans-serif;font-weight:700;">&#128260; 14 dagen retour</td>
        <td class="trust-cell" align="center" style="padding:0 6px;font-size:12px;color:#6B7280;font-family:Arial,sans-serif;font-weight:700;">&#128274; Veilig betalen</td>
      </tr>
    </table>
  </td>
</tr>
<!-- FOOTER LINKS -->
<tr>
  <td align="center" style="padding:12px 0 28px;">
    <p style="font-size:12px;color:#9CA3AF;margin:0 0 6px;font-family:Arial,sans-serif;">Smikkie &bull; Lekker snacken, zonder schuldgevoel</p>
    <p style="font-size:12px;color:#9CA3AF;margin:0;font-family:Arial,sans-serif;">
      <a href="https://smikkie.nl/pages/privacybeleid.html" style="color:#7C3AED;text-decoration:none;">Privacybeleid</a>
      &nbsp;&bull;&nbsp;
      <a href="https://smikkie.nl/pages/algemene-voorwaarden.html" style="color:#7C3AED;text-decoration:none;">Voorwaarden</a>
      &nbsp;&bull;&nbsp;
      <a href="https://smikkie.nl/pages/contact.html" style="color:#7C3AED;text-decoration:none;">Contact</a>
    </p>
    <p style="font-size:11px;color:#D1D5DB;margin:8px 0 0;font-family:Arial,sans-serif;">Je ontvangt deze e-mail omdat je een bestelling hebt geplaatst bij Smikkie.</p>
  </td>
</tr>
</table>
</td></tr></table>
</body></html>
'''

def box(content, bg='#F9F7FF', radius='12px', mb='24px'):
    return f'<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:{bg};border-radius:{radius};margin-bottom:{mb};"><tr><td class="pad-mobile-sm" style="padding:18px 22px;font-family:Arial,sans-serif;">{content}</td></tr></table>'

def alert_box(content, bg='#F0FDF4', border='#16A34A'):
    return f'<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:{bg};border-radius:10px;border-left:4px solid {border};margin-bottom:24px;"><tr><td style="padding:16px 20px;font-family:Arial,sans-serif;">{content}</td></tr></table>'

def cta_btn(text, url, bg='#5B2D8E'):
    return f'''<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 28px;">
<tr><td align="center" bgcolor="{bg}" style="border-radius:50px;">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{url}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="50%" stroke="f" fillcolor="{bg}"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">{text}</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="{url}" style="display:inline-block;background-color:{bg};color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:50px;mso-hide:all;">{text}</a><!--<![endif]-->
</td></tr></table>'''

def h1(text):
    return f'<h1 class="font-lg" style="font-size:24px;font-weight:900;color:#1F1235;text-align:center;margin:0 0 8px;font-family:Arial,sans-serif;">{text}</h1>'

def subtitle(text):
    return f'<p class="font-md" style="font-size:15px;color:#6B7280;text-align:center;margin:0 0 28px;font-family:Arial,sans-serif;line-height:1.5;">{text}</p>'

def icon_block(emoji):
    return f'<div style="text-align:center;margin-bottom:20px;"><span style="font-size:44px;">{emoji}</span></div>'

def detail_row(label, value, value_color='#1F1235'):
    return f'''<tr>
  <td class="detail-label" style="font-size:13px;color:#6B7280;font-weight:700;padding:6px 0;font-family:Arial,sans-serif;">{label}</td>
  <td class="detail-value" align="right" style="font-size:14px;color:{value_color};font-weight:800;padding:6px 0;font-family:Arial,sans-serif;">{value}</td>
</tr>'''

def detail_table(rows_html):
    return f'<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">{rows_html}</table>'

# ── EMAILS ────────────────────────────────────────────────────────────────────

emails = {}

# 01 — Bestelbevestiging
emails['01-bestelbevestiging.html'] = {
    'title': 'Jouw bestelling is ontvangen! - Smikkie',
    'preheader': 'Bedankt voor je bestelling! We gaan er direct mee aan de slag.',
    'body': (
        icon_block('&#9989;') +
        h1('Bestelling ontvangen! &#127881;') +
        subtitle('Hoi {{first_name}}, bedankt voor je bestelling bij Smikkie. We gaan er direct mee aan de slag!') +
        box(
            detail_table(
                detail_row('Bestelnummer', '{{order_number}}', '#5B2D8E') +
                detail_row('Besteldatum', '{{order_date}}') +
                detail_row('Verwachte levering', '{{shipping_date}}', '#16A34A')
            )
        ) +
        f'<h3 style="font-size:16px;font-weight:900;color:#1F1235;margin:0 0 12px;font-family:Arial,sans-serif;">Jouw bestelling</h3>'
        f'<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #E5E7EB;border-radius:10px;margin-bottom:24px;">'
        f'<tr><td style="padding:12px 16px;border-bottom:1px solid #E5E7EB;">'
        f'<span style="font-size:14px;font-weight:800;color:#1F1235;font-family:Arial,sans-serif;">{{{order_items}}}</span>'
        f'</td></tr>'
        f'<tr><td style="padding:12px 16px;border-top:1px solid #E5E7EB;">'
        f'<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">'
        f'<tr><td style="font-size:13px;color:#6B7280;font-family:Arial,sans-serif;">Subtotaal</td><td align="right" style="font-size:13px;font-weight:700;color:#1F1235;font-family:Arial,sans-serif;">{{{order_subtotal}}}</td></tr>'
        f'<tr><td style="font-size:13px;color:#6B7280;font-family:Arial,sans-serif;padding-top:4px;">Verzendkosten</td><td align="right" style="font-size:13px;font-weight:700;color:#16A34A;font-family:Arial,sans-serif;padding-top:4px;">{{{shipping_cost}}}</td></tr>'
        f'<tr><td style="font-size:16px;font-weight:900;color:#1F1235;font-family:Arial,sans-serif;padding-top:10px;border-top:1px solid #E5E7EB;">Totaal</td><td align="right" style="font-size:16px;font-weight:900;color:#5B2D8E;font-family:Arial,sans-serif;padding-top:10px;border-top:1px solid #E5E7EB;">{{{order_total}}}</td></tr>'
        f'</table></td></tr></table>' +
        f'<h3 style="font-size:16px;font-weight:900;color:#1F1235;margin:0 0 12px;font-family:Arial,sans-serif;">Bezorgadres</h3>' +
        box('<span style="font-size:14px;color:#374151;line-height:1.7;font-family:Arial,sans-serif;">{{shipping_address}}</span>') +
        cta_btn('Bekijk mijn bestelling &#8594;', 'https://smikkie.nl/pages/bestellingen.html') +
        alert_box(
            '<p style="font-size:14px;color:#92400E;font-weight:800;margin:0 0 4px;font-family:Arial,sans-serif;">&#128155; Smikkie\'s belofte</p>'
            '<p style="font-size:13px;color:#78350F;margin:0;font-family:Arial,sans-serif;">Jouw snacks worden zorgvuldig ingepakt en verstuurd. Niet tevreden? We lossen het altijd op.</p>',
            '#FFFBEB', '#F59E0B'
        )
    )
}

# 02 — Betaling ontvangen
emails['02-betaling-ontvangen.html'] = {
    'title': 'Betaling bevestigd - Smikkie',
    'preheader': 'Je betaling is ontvangen. We gaan direct aan de slag!',
    'body': (
        icon_block('&#128179;') +
        h1('Betaling bevestigd!') +
        subtitle('Hoi {{first_name}}, we hebben je betaling van <strong style="color:#5B2D8E;">{{order_total}}</strong> ontvangen voor bestelling {{order_number}}.') +
        alert_box(
            '<p style="font-size:14px;color:#15803D;font-weight:800;margin:0 0 4px;font-family:Arial,sans-serif;">&#9989; Betaling geslaagd</p>'
            '<p style="font-size:13px;color:#166534;margin:0;font-family:Arial,sans-serif;">Betaalmethode: {{payment_method}}<br>Transactie-ID: {{transaction_id}}</p>'
        ) +
        f'<p style="font-size:14px;color:#6B7280;margin:0 0 24px;font-family:Arial,sans-serif;line-height:1.6;">Je bestelling wordt nu verwerkt en zo snel mogelijk verstuurd. Je ontvangt een e-mail zodra je pakket onderweg is.</p>' +
        cta_btn('Bekijk mijn bestelling &#8594;', 'https://smikkie.nl/pages/bestellingen.html')
    )
}

# 03 — Bestelling verwerkt / ingepakt
emails['03-bestelling-verwerkt.html'] = {
    'title': 'Je bestelling wordt ingepakt - Smikkie',
    'preheader': 'Goed nieuws! We pakken jouw snacks in.',
    'body': (
        icon_block('&#128230;') +
        h1('We pakken jouw snacks in!') +
        subtitle('Hoi {{first_name}}, je bestelling {{order_number}} wordt nu zorgvuldig ingepakt in ons magazijn.') +
        f'''<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
<tr>
  <td align="center" style="padding:16px 8px;background-color:#F0FDF4;border-radius:10px;width:30%;">
    <div style="font-size:22px;margin-bottom:6px;">&#9989;</div>
    <div style="font-size:12px;font-weight:800;color:#16A34A;font-family:Arial,sans-serif;">Besteld</div>
  </td>
  <td align="center" style="width:5%;font-size:18px;color:#D1D5DB;font-family:Arial,sans-serif;">&#8594;</td>
  <td align="center" style="padding:16px 8px;background-color:#5B2D8E;border-radius:10px;width:30%;">
    <div style="font-size:22px;margin-bottom:6px;">&#128230;</div>
    <div style="font-size:12px;font-weight:800;color:#ffffff;font-family:Arial,sans-serif;">Ingepakt</div>
  </td>
  <td align="center" style="width:5%;font-size:18px;color:#D1D5DB;font-family:Arial,sans-serif;">&#8594;</td>
  <td align="center" style="padding:16px 8px;background-color:#F9F7FF;border-radius:10px;width:30%;">
    <div style="font-size:22px;margin-bottom:6px;">&#128666;</div>
    <div style="font-size:12px;font-weight:800;color:#9CA3AF;font-family:Arial,sans-serif;">Onderweg</div>
  </td>
</tr>
</table>''' +
        box(
            '<p style="font-size:13px;color:#6B7280;margin:0;font-family:Arial,sans-serif;">Verwachte bezorging: <strong style="color:#16A34A;">{{shipping_date}}</strong></p>'
        ) +
        cta_btn('Volg mijn bestelling &#8594;', 'https://smikkie.nl/pages/bestellingen.html')
    )
}

# 04 — Bestelling verzonden
emails['04-bestelling-verzonden.html'] = {
    'title': 'Je bestelling is onderweg! - Smikkie',
    'preheader': 'Je snacks zijn onderweg! Track & trace: {{tracking_number}}',
    'body': (
        icon_block('&#128666;') +
        h1('Je snacks zijn onderweg!') +
        subtitle('Hoi {{first_name}}, je bestelling {{order_number}} is zojuist verstuurd via {{shipping_method}}.') +
        f'''<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F9F7FF;border-radius:12px;margin-bottom:28px;">
<tr><td style="padding:24px;text-align:center;">
  <p style="font-size:12px;color:#6B7280;font-weight:700;margin:0 0 8px;font-family:Arial,sans-serif;letter-spacing:1px;">TRACK &amp; TRACE CODE</p>
  <p style="font-size:20px;font-weight:900;color:#5B2D8E;letter-spacing:3px;margin:0 0 16px;font-family:Arial,sans-serif;">{{tracking_number}}</p>
  ''' + cta_btn('Volg mijn pakket &#8594;', '{{tracking_url}}') + f'''
  <p style="font-size:12px;color:#9CA3AF;margin:8px 0 0;font-family:Arial,sans-serif;">Verwachte bezorging: <strong style="color:#16A34A;">{{shipping_date}}</strong></p>
</td></tr>
</table>''' +
        f'<p style="font-size:13px;color:#9CA3AF;text-align:center;margin:0;font-family:Arial,sans-serif;">Niet thuis? De bezorger laat een bericht achter of levert bij een afhaalpunt bij jou in de buurt.</p>'
    )
}

# 05 — Bestelling bezorgd
emails['05-bestelling-bezorgd.html'] = {
    'title': 'Je bestelling is bezorgd! - Smikkie',
    'preheader': 'Je snacks zijn gearriveerd! Smakelijk genieten.',
    'body': (
        icon_block('&#127881;') +
        h1('Je snacks zijn gearriveerd!') +
        subtitle('Hoi {{first_name}}, bestelling {{order_number}} is bezorgd. Smakelijk genieten!') +
        alert_box(
            '<p style="font-size:14px;color:#92400E;font-weight:800;margin:0 0 8px;font-family:Arial,sans-serif;">&#11088; Hoe was jouw ervaring?</p>'
            '<p style="font-size:13px;color:#78350F;margin:0 0 16px;font-family:Arial,sans-serif;">We horen graag wat je van jouw Smikkie box vond! Jouw review helpt andere snackliefhebbers.</p>' +
            cta_btn('Schrijf een review &#8594;', 'https://smikkie.nl/pages/reviews.html', '#F59E0B'),
            '#FFFBEB', '#F59E0B'
        ) +
        cta_btn('Stel je volgende box samen &#8594;', 'https://smikkie.nl/pages/mix-box.html')
    )
}

# 06 — Retour ontvangen
emails['06-retour-ontvangen.html'] = {
    'title': 'Retour ontvangen - Smikkie',
    'preheader': 'We hebben je retourzending ontvangen en verwerken deze zo snel mogelijk.',
    'body': (
        icon_block('&#128260;') +
        h1('Retour ontvangen') +
        subtitle('Hoi {{first_name}}, we hebben je retourzending voor bestelling {{order_number}} ontvangen.') +
        box(
            '<p style="font-size:14px;font-weight:800;color:#1F1235;margin:0 0 12px;font-family:Arial,sans-serif;">Wat gebeurt er nu?</p>'
            '<p style="font-size:13px;color:#6B7280;margin:0 0 6px;font-family:Arial,sans-serif;">&#9989; We controleren de geretourneerde producten</p>'
            '<p style="font-size:13px;color:#6B7280;margin:0 0 6px;font-family:Arial,sans-serif;">&#9989; Terugbetaling wordt verwerkt binnen 5 werkdagen</p>'
            '<p style="font-size:13px;color:#6B7280;margin:0;font-family:Arial,sans-serif;">&#9989; Je ontvangt een bevestiging zodra de terugbetaling is gedaan</p>'
        ) +
        f'<p style="font-size:14px;color:#6B7280;margin:0;font-family:Arial,sans-serif;line-height:1.6;">Heb je vragen? Neem gerust contact met ons op via <a href="mailto:info@smikkie.nl" style="color:#5B2D8E;font-weight:700;">info@smikkie.nl</a>.</p>'
    )
}

# 07 — Terugbetaling
emails['07-terugbetaling.html'] = {
    'title': 'Terugbetaling verwerkt - Smikkie',
    'preheader': 'Je terugbetaling van {{refund_amount}} is onderweg naar je rekening.',
    'body': (
        icon_block('&#128184;') +
        h1('Terugbetaling verwerkt') +
        subtitle('Hoi {{first_name}}, je terugbetaling voor bestelling {{order_number}} is verwerkt.') +
        alert_box(
            '<p style="font-size:14px;color:#15803D;font-weight:800;margin:0 0 4px;font-family:Arial,sans-serif;">&#9989; Terugbetaling: {{refund_amount}}</p>'
            '<p style="font-size:13px;color:#166534;margin:0;font-family:Arial,sans-serif;">Verwachte verwerkingstijd: 3 tot 5 werkdagen, afhankelijk van je bank.</p>'
        ) +
        f'<p style="font-size:14px;color:#6B7280;margin:0;font-family:Arial,sans-serif;line-height:1.6;">Vragen? Mail ons op <a href="mailto:info@smikkie.nl" style="color:#5B2D8E;font-weight:700;">info@smikkie.nl</a>. We helpen je graag!</p>'
    )
}

# 08 — Welkom
emails['08-welkom.html'] = {
    'title': 'Welkom bij Smikkie! - Jouw snack-community',
    'preheader': 'Welkom bij Smikkie! Jouw eerste stap naar lekker snacken zonder schuldgevoel.',
    'body': (
        icon_block('&#128059;') +
        h1('Welkom bij Smikkie, {{first_name}}!') +
        subtitle('Lekker snacken, zonder schuldgevoel. Jij hoort er nu bij!') +
        f'''<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
<tr>
  <td class="stack-col" align="center" style="padding:16px 6px;background-color:#F9F7FF;border-radius:10px;width:32%;">
    <div style="font-size:24px;margin-bottom:6px;">&#127873;</div>
    <div style="font-size:13px;font-weight:800;color:#5B2D8E;font-family:Arial,sans-serif;margin-bottom:4px;">Mix-box</div>
    <div style="font-size:12px;color:#6B7280;font-family:Arial,sans-serif;">Stel jouw eigen snackbox samen</div>
  </td>
  <td style="width:2%;"></td>
  <td class="stack-col" align="center" style="padding:16px 6px;background-color:#F9F7FF;border-radius:10px;width:32%;">
    <div style="font-size:24px;margin-bottom:6px;">&#128156;</div>
    <div style="font-size:13px;font-weight:800;color:#5B2D8E;font-family:Arial,sans-serif;margin-bottom:4px;">Favorieten</div>
    <div style="font-size:12px;color:#6B7280;font-family:Arial,sans-serif;">Onze meest geliefde snacks</div>
  </td>
  <td style="width:2%;"></td>
  <td class="stack-col" align="center" style="padding:16px 6px;background-color:#F9F7FF;border-radius:10px;width:32%;">
    <div style="font-size:24px;margin-bottom:6px;">&#9889;</div>
    <div style="font-size:13px;font-weight:800;color:#5B2D8E;font-family:Arial,sans-serif;margin-bottom:4px;">Staffelkorting</div>
    <div style="font-size:12px;color:#6B7280;font-family:Arial,sans-serif;">Meer bestellen = meer besparen</div>
  </td>
</tr>
</table>''' +
        box(
            '<p style="font-size:14px;font-weight:800;color:#5B2D8E;margin:0 0 4px;text-align:center;font-family:Arial,sans-serif;">&#127881; Welkomstkorting: 10% op je eerste bestelling</p>'
            '<p style="font-size:22px;font-weight:900;color:#1F1235;letter-spacing:4px;margin:8px 0;text-align:center;font-family:Arial,sans-serif;">WELKOM10</p>'
            '<p style="font-size:12px;color:#6B7280;margin:0;text-align:center;font-family:Arial,sans-serif;">Geldig op je eerste bestelling. Minimaal &#8364;15.</p>'
        ) +
        cta_btn('Stel mijn eerste box samen &#8594;', 'https://smikkie.nl/pages/mix-box.html')
    )
}

# 09 — Wachtwoord reset
emails['09-wachtwoord-reset.html'] = {
    'title': 'Wachtwoord resetten - Smikkie',
    'preheader': 'Je hebt een wachtwoord-reset aangevraagd. Klik op de link om je wachtwoord te wijzigen.',
    'body': (
        icon_block('&#128274;') +
        h1('Wachtwoord resetten') +
        subtitle('Hoi {{first_name}}, je hebt een wachtwoord-reset aangevraagd voor je Smikkie-account.') +
        cta_btn('Nieuw wachtwoord instellen &#8594;', '{{password_reset_url}}') +
        alert_box(
            '<p style="font-size:13px;color:#991B1B;font-weight:700;margin:0 0 4px;font-family:Arial,sans-serif;">&#9888;&#65039; Let op</p>'
            '<p style="font-size:13px;color:#7F1D1D;margin:0;font-family:Arial,sans-serif;">Deze link is 24 uur geldig. Heb jij dit niet aangevraagd? Dan kun je deze e-mail negeren.</p>',
            '#FEF2F2', '#EF4444'
        )
    )
}

# 10 — Bestelling geannuleerd
emails['10-bestelling-geannuleerd.html'] = {
    'title': 'Bestelling geannuleerd - Smikkie',
    'preheader': 'Je bestelling {{order_number}} is geannuleerd.',
    'body': (
        icon_block('&#10060;') +
        h1('Bestelling geannuleerd') +
        subtitle('Hoi {{first_name}}, je bestelling {{order_number}} is geannuleerd.') +
        box(
            '<p style="font-size:14px;font-weight:800;color:#1F1235;margin:0 0 8px;font-family:Arial,sans-serif;">Reden voor annulering</p>'
            '<p style="font-size:13px;color:#6B7280;margin:0;font-family:Arial,sans-serif;">{{cancellation_reason}}</p>'
        ) +
        f'<p style="font-size:14px;color:#6B7280;margin:0 0 24px;font-family:Arial,sans-serif;line-height:1.6;">Als er een betaling is gedaan, ontvang je binnen 5 werkdagen je geld terug. Vragen? Mail ons op <a href="mailto:info@smikkie.nl" style="color:#5B2D8E;font-weight:700;">info@smikkie.nl</a>.</p>' +
        cta_btn('Nieuwe bestelling plaatsen &#8594;', 'https://smikkie.nl/pages/mix-box.html')
    )
}

# ── Write all files ────────────────────────────────────────────────────────────
for filename, data in emails.items():
    html = HEAD.format(title=data['title'], preheader=data['preheader'])
    html += data['body']
    html += FOOTER
    path = os.path.join(EMAIL_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Written: {filename}")

print("\nAll 10 email templates done!")
