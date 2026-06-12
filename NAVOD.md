# NEPLECHY – Web stránky | Návod k použití

## STRUKTURA SLOŽEK
```
neplechy-web/                  ← Hlavní složka projektu
│
├── index.html                 ← HLAVNÍ SOUBOR – otevři v prohlížeči
│
├── css/
│   └── styl.css               ← Veškeré styly (barvy, layout, fonty)
│
├── js/
│   └── skript.js              ← Veškerá interaktivita (menu, animace)
│
└── obrazky/                   ← VLOŽ SEM SVÉ VLASTNÍ FOTKY
    ├── logo.png               ← Logo kapely (volitelné)
    ├── uvod-pozadi.jpg        ← Úvodní foto na pozadí hero sekce
    ├── kapela-foto.jpg        ← Foto celé kapely
    └── galerie/               ← Fotky pro galerii
        ├── foto-01.jpg
        ├── foto-02.jpg
        └── ...
```

## JAK SPUSTIT WEB
1. Otevři složku `neplechy-web/`
2. Dvakrát klikni na soubor `index.html`
3. Otevře se v prohlížeči (Chrome, Firefox, Edge...)

## JAK MĚNIT OBSAH
- **Texty:** Otevři `index.html` v textovém editoru (Poznámkový blok, VS Code, Notepad++)
- **Barvy:** Otevři `css/styl.css`, hledej sekci `:root { }` na začátku
- **Fotky:** Viz sekce níže

## JAK VYMĚNIT OBRÁZKY
V `index.html` najdi tagy `<img src="https://...">` a nahraď URL cestou k tvé fotce:

**Zástupný obrázek (Unsplash):**
```html
<img src="https://images.unsplash.com/photo-xxx" alt="...">
```

**Vlastní fotka ze složky obrazky/:**
```html
<img src="obrazky/moje-foto.jpg" alt="Popis fotky">
```

## SOCIÁLNÍ SÍTĚ
V `index.html` vyhledej (Ctrl+F) text `neplechy` a nahraď URL svými profily:
- `href="https://www.facebook.com/neplechy"` → tvůj Facebook
- `href="https://www.instagram.com/neplechy"` → tvůj Instagram  
- `href="https://www.youtube.com/@neplechy"` → tvůj YouTube

## TECHNOLOGIE
- **HTML5** – struktura a obsah
- **CSS3** – styly (flexbox, grid, animace, media queries)
- **Vanilla JavaScript** – interaktivita bez frameworků
- **Google Fonts** – písma Playfair Display + Raleway
- **Font Awesome 6** – ikony
- **Unsplash** – zástupné fotky (zdarma)
