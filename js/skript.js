/*
  ============================================================
  (Ne)Plechy – Žesťový soubor | JavaScript
  ============================================================
*/

/* ============================================================
   NASTAVENÍ KALENDÁŘE – VYPLŇ ZDE
   ============================================================
   SHEET_ID  = ID tvé Google tabulky.
               Najdeš ho v URL: docs.google.com/spreadsheets/d/ → ZDE ← /edit
               
   SHEET_NAME = přesný název listu (záložky) v tabulce.
                Výchozí název je "List 1" (s mezerou!).
                Podívej se na záložku dole v tabulce.

   Tabulka MUSÍ být sdílena:
   Sdílet (vpravo nahoře) → Kdokoliv s odkazem → Prohlížitel → Hotovo
   ============================================================ */
const SHEET_ID   = '1gF1TFLfIjECuZ1rezBDdd8qv2HqqpzMlDtv55xFXB9k';
const SHEET_NAME = 'List 1';

/* Zkratky měsíců – použijí se pokud je v tabulce číslo místo textu */
const MESICE = ['LED','ÚNO','BŘE','DUB','KVĚ','ČVN','ČVC','SRP','ZÁŘ','ŘÍJ','LIS','PRO'];


/* ============================================================
   START – spustí se po načtení celé stránky
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  inicializujMenu();
  vynutMobilniMenu();
  inicializujScrollEfekty();
  inicializujScrollAnimace();
  inicializujGalerii();
  nactiKalendar();
});


/* ============================================================
   VYNUCENÍ MOBILNÍHO MENU – nezávislé na CSS souboru

   PROČ TOHLE EXISTUJE:
   Hamburger menu se má zobrazit pod 900px šířky okna a skrýt
   vodorovné menu. Tohle normálně řeší CSS media query, ale
   pokud se z jakéhokoli důvodu (cache prohlížeče, cache
   live-server nástroje, špatně uložený soubor…) načte STARÁ
   verze CSS, vodorovné menu zůstane vykreslené přes obsah
   stránky i na úzké obrazovce.

   Tahle funkce dělá to samé přímo přes JavaScript inline styly,
   které mají VŽDY přednost před pravidly v .css souboru.
   Funguje tedy i kdyby byl styl.css zastaralý nebo se vůbec
   nenačetl. Spouští se hned po načtení stránky a pak znovu
   při každé změně velikosti okna (resize).
============================================================ */
function vynutMobilniMenu() {
  var hamburger = document.getElementById('hamburger');
  var menu      = document.getElementById('menu');
  if (!hamburger || !menu) return;

  /* Hranice v pixelech – musí odpovídat hodnotě v styl.css (900px) */
  var HRANICE_MOBIL = 900;

  function aplikuj() {
    var jeMobil = window.innerWidth <= HRANICE_MOBIL;

    if (jeMobil) {
      /* ── ÚZKÁ OBRAZOVKA: zobraz hamburger, menu jako skrytý overlay ── */
      hamburger.style.display = 'flex';

      menu.style.position = 'fixed';
      menu.style.inset = '0';
      menu.style.flexDirection = 'column';
      menu.style.alignItems = 'center';
      menu.style.justifyContent = 'center';
      menu.style.gap = '2.5rem';
      menu.style.background = 'rgba(10, 22, 40, 0.98)';
      menu.style.backdropFilter = 'blur(10px)';
      menu.style.zIndex = '1100';

      if (menu.classList.contains('otevreno')) {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.pointerEvents = 'auto';
      } else {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.pointerEvents = 'none';
      }

    } else {
      /* ── ŠIROKÁ OBRAZOVKA (desktop): vrať menu do normálního vodorovného flow ── */
      hamburger.style.display = 'none';

      menu.style.position = 'static';
      menu.style.inset = 'auto';
      menu.style.flexDirection = 'row';
      menu.style.background = 'transparent';
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.pointerEvents = 'auto';
      menu.style.zIndex = 'auto';

      /*
        Na desktopu musí být menu vždy "zavřené" stavově,
        aby se po zúžení okna chovalo znovu jako skryté.

        DŮLEŽITÉ: classList.remove() měníme jen když třída
        OPRAVDU existuje (.contains() check). I volání remove()
        na neexistující třídě totiž změní atribut class a vyvolá
        tak další MutationObserver callback níže – bez tohoto
        guardu by vznikla nekonečná smyčka mikrotasků
        (aplikuj → remove → mutace → aplikuj → remove → …).
      */
      if (hamburger.classList.contains('otevreno')) hamburger.classList.remove('otevreno');
      if (menu.classList.contains('otevreno'))      menu.classList.remove('otevreno');
      document.body.style.overflow = '';
    }
  }

  /* Spustit hned při načtení */
  aplikuj();

  /* A znovu při každé změně velikosti okna (např. otočení telefonu,
     zmenšení okna prohlížeče na desktopu) */
  window.addEventListener('resize', aplikuj);

  /*
    Menu se otevírá/zavírá na třech různých místech v kódu
    (klik na hamburger, klik na odkaz, klik mimo menu – viz
    funkce inicializujMenu výše). Místo aby se to tu duplikovalo,
    sledujeme přímo ZMĚNU TŘÍDY "otevreno" pomocí MutationObserver –
    ten zavolá aplikuj() automaticky, ať se třída změní odkudkoliv.

    Použito společně s guardem výše (.contains() check), aby
    nevznikla nekonečná smyčka: aplikuj() na desktopu už nemění
    třídu, pokud tam "otevreno" není, takže observer se nespustí
    podruhé zbytečně.
  */
  var sledovacTridy = new MutationObserver(aplikuj);
  sledovacTridy.observe(menu, { attributes: true, attributeFilter: ['class'] });
}


/* ============================================================
   MENU – hamburger na mobilu
============================================================ */
function inicializujMenu() {
  var hamburger = document.getElementById('hamburger');
  var menu      = document.getElementById('menu');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('otevreno');
    menu.classList.toggle('otevreno');
    document.body.style.overflow = menu.classList.contains('otevreno') ? 'hidden' : '';
  });

  menu.querySelectorAll('.menu-odkaz').forEach(function (o) {
    o.addEventListener('click', function () {
      hamburger.classList.remove('otevreno');
      menu.classList.remove('otevreno');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !hamburger.contains(e.target) && menu.classList.contains('otevreno')) {
      hamburger.classList.remove('otevreno');
      menu.classList.remove('otevreno');
      document.body.style.overflow = '';
    }
  });
}


/* ============================================================
   SCROLL EFEKTY – ztmavení hlavičky, zpět nahoru, aktivní odkaz
============================================================ */
function inicializujScrollEfekty() {
  var hlavicka   = document.getElementById('hlavicka');
  var zpetNahoru = document.getElementById('zpetNahoru');
  var sekce      = document.querySelectorAll('section[id]');
  var odkazMenu  = document.querySelectorAll('.menu-odkaz');

  window.addEventListener('scroll', function () {
    var sy = window.scrollY;
    if (hlavicka)   hlavicka.classList.toggle('scrollovano', sy > 50);
    if (zpetNahoru) zpetNahoru.classList.toggle('viditelne', sy > 300);

    var pos = sy + 100;
    sekce.forEach(function (s) {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        odkazMenu.forEach(function (o) { o.classList.remove('aktivni'); });
        var a = document.querySelector('.menu-odkaz[href="#' + s.id + '"]');
        if (a) a.classList.add('aktivni');
      }
    });
  });

  if (zpetNahoru) {
    zpetNahoru.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var cil = a.getAttribute('href');
      if (cil === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      var el = document.querySelector(cil);
      if (el) { e.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
    });
  });
}


/* ============================================================
   SCROLL ANIMACE – prvky se zobrazí při scrollování
============================================================ */
function inicializujScrollAnimace() {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('viditelne'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.animace-nahoru, .animace-vlevo, .animace-vpravo').forEach(function (el) {
    obs.observe(el);
  });
}


/* ============================================================
   LIGHTBOX – fotky i videa, navigace šipkami / klávesy / swipe

   Jak funguje podpora videa i skupin:
   - Galerie je rozdělená na dvě skupiny: "foto" a "video"
     (atribut data-skupina na každé .galerie-polozka).
   - Lightbox je společný pro obě skupiny, ale šipky/klávesy/swipe
     procházejí VŽDY jen v rámci stejné skupiny, kde uživatel
     lightbox otevřel – fotky se tedy neproplétají s videi.
   - Při otevření lightboxu JS zkontroluje typ položky a zobrazí
     buď <img> nebo <video> přehrávač.
   - Při přepnutí / zavření se video automaticky zastaví.
============================================================ */
function inicializujGalerii() {
  var lightbox    = document.getElementById('lightbox');
  var lbObrazek   = document.getElementById('lightboxObrazek');
  var lbVideo     = document.getElementById('lightboxVideo');
  var lbVideoSrc  = document.getElementById('lightboxVideoSrc');
  var lbZavrit    = document.getElementById('lightboxZavrit');
  var lbVlevo     = document.getElementById('lightboxVlevo');
  var lbVpravo    = document.getElementById('lightboxVpravo');
  var lbPocitadlo = document.getElementById('lightboxPocitadlo');

  if (!lightbox || !lbObrazek) return;

  /*
    Načteme VŠECHNY položky galerie (fotky i videa) do jednoho pole,
    v pořadí jak jsou v HTML. Každá položka si nese i svou skupinu
    (data-skupina="foto" / "video"), podle které se později filtruje.
  */
  var vsechnyPolozky = Array.from(document.querySelectorAll('.galerie-polozka')).map(function (el) {
    var skupina = el.getAttribute('data-skupina') || 'foto';

    if (el.classList.contains('galerie-video')) {
      return {
        typ:     'video',
        skupina: skupina,
        src:     el.getAttribute('data-src') || '',
        popis:   el.getAttribute('data-popis') || 'Video',
        el:      el
      };
    } else {
      var img = el.querySelector('img');
      return {
        typ:     'foto',
        skupina: skupina,
        src:     img ? img.src : '',
        popis:   img ? img.alt : '',
        el:      el
      };
    }
  });

  /*
    Aktuálně zobrazená SKUPINA položek (jen fotky, nebo jen videa) –
    nastaví se při kliknutí podle toho, na co uživatel klikl.
    "index" je pozice uvnitř TÉTO skupiny, ne v celém poli.
  */
  var aktualniSkupina = vsechnyPolozky;
  var index = 0;

  /* Plynulý přechod pro obrázky */
  lbObrazek.style.transition = 'opacity 0.18s ease';

  /* Zastaví video a skryje přehrávač */
  function zastavVideo() {
    if (lbVideo) {
      lbVideo.pause();
      lbVideo.classList.remove('aktivni');
      if (lbVideoSrc) lbVideoSrc.src = '';
      lbVideo.load(); /* reset přehrávače */
    }
  }

  /* Zobrazí položku na pozici i UVNITŘ aktuální skupiny */
  function zobraz(i) {
    if (i < 0) i = aktualniSkupina.length - 1;
    if (i >= aktualniSkupina.length) i = 0;
    index = i;

    var p = aktualniSkupina[i];

    /* Zastav případné přehrávané video */
    zastavVideo();

    if (p.typ === 'video') {
      /* ── VIDEO ── */
      lbObrazek.style.display = 'none';

      if (lbVideoSrc) lbVideoSrc.src = p.src;
      if (lbVideo) {
        lbVideo.load();      /* načti nový zdroj */
        lbVideo.classList.add('aktivni');
        /* Automatické přehrání hned po otevření */
        lbVideo.play().catch(function () {
          /* Některé prohlížeče blokují autoplay – nevadí, uživatel klikne sám */
        });
      }

    } else {
      /* ── FOTKA ── */
      if (lbVideo) lbVideo.classList.remove('aktivni');
      lbObrazek.style.display = '';
      lbObrazek.style.opacity = '0';
      setTimeout(function () {
        lbObrazek.src = p.src;
        lbObrazek.alt = p.popis;
        lbObrazek.style.opacity = '1';
      }, 160);
    }

    if (lbPocitadlo) lbPocitadlo.textContent = (i + 1) + ' / ' + aktualniSkupina.length;
  }

  /* Zavře lightbox a zastaví vše */
  function zavri() {
    zastavVideo();
    lightbox.classList.remove('aktivni');
    document.body.style.overflow = '';
  }

  /* Kliknutí na libovolnou položku galerie */
  vsechnyPolozky.forEach(function (p) {
    p.el.addEventListener('click', function () {
      /*
        Při kliknutí vybereme JEN položky stejné skupiny jako ta,
        na kterou se kliklo – tím se šipky/swipe omezí na fotky,
        nebo na videa, podle toho kde uživatel galerii otevřel.
      */
      aktualniSkupina = vsechnyPolozky.filter(function (x) { return x.skupina === p.skupina; });
      var startIndex = aktualniSkupina.indexOf(p);

      zobraz(startIndex);
      lightbox.classList.add('aktivni');
      document.body.style.overflow = 'hidden';
    });
  });

  /* Ovládání lightboxu */
  if (lbZavrit) lbZavrit.addEventListener('click', zavri);
  if (lbVlevo)  lbVlevo.addEventListener('click',  function (e) { e.stopPropagation(); zobraz(index - 1); });
  if (lbVpravo) lbVpravo.addEventListener('click',  function (e) { e.stopPropagation(); zobraz(index + 1); });

  /* Zavření kliknutím na tmavé pozadí */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) zavri();
  });

  /* Klávesnice */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('aktivni')) return;
    if (e.key === 'Escape')     zavri();
    /* Šipky fungují jen pro fotky – u videa nechceme přerušit přehrávání */
    if (e.key === 'ArrowLeft'  && aktualniSkupina[index].typ !== 'video') zobraz(index - 1);
    if (e.key === 'ArrowRight' && aktualniSkupina[index].typ !== 'video') zobraz(index + 1);
  });

  /* Swipe na dotykových zařízeních (jen pro fotky) */
  var swipeX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    swipeX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (aktualniSkupina[index].typ === 'video') return; /* swipe blokujeme u videa */
    var d = swipeX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) zobraz(d > 0 ? index + 1 : index - 1);
  });
}


/* ============================================================
   KALENDÁŘ – načítání z Google Sheets pomocí JSONP

   PROČ JSONP A NE FETCH?
   ─────────────────────────────────────────────────────────
   Prohlížeče mají bezpečnostní pravidlo zvané CORS (Cross-Origin
   Resource Sharing). Říká: "stránka na doméně X nesmí číst data
   z domény Y, pokud Y nedá souhlas."

   Google Sheets přes fetch() vrací chybu "CORS blocked" i pro
   veřejně sdílené tabulky – Google souhlas nedává.

   Řešení: JSONP (JSON with Padding).
   Místo fetch() vložíme do stránky <script src="URL"> tag.
   Na <script> tagy se CORS nevztahuje – prohlížeč je vždy stáhne.
   Google Sheets přes ?tqx=out:json vrátí JavaScriptový kód
   ve tvaru: google.visualization.Query.setResponse({...data...});
   My si tuto funkci předefinujeme a tím data zachytíme.
   ─────────────────────────────────────────────────────────
============================================================ */
function nactiKalendar() {
  var kontejner  = document.getElementById('akceSeznam');
  var elNacitani = document.getElementById('akceNacitani');
  var elChyba    = document.getElementById('akceChyba');
  var elPrazdne  = document.getElementById('akcePrazdne');

  if (!kontejner) return;

  /* Timeout: pokud se data nenačtou do 10 sekund, zobraz chybu */
  var timeout = setTimeout(function () {
    skryj(elNacitani);
    ukaz(elChyba);
  }, 10000);

  /*
    Předefinujeme google.visualization.Query.setResponse –
    tato funkce se zavolá automaticky jakmile Google vrátí data.
  */
  window.google = window.google || {};
  window.google.visualization = window.google.visualization || {};
  window.google.visualization.Query = window.google.visualization.Query || {};

  window.google.visualization.Query.setResponse = function (odpoved) {
    clearTimeout(timeout);
    skryj(elNacitani);

    /* Zkontroluj zda odpověď obsahuje data */
    if (!odpoved || !odpoved.table || !odpoved.table.rows) {
      ukaz(elChyba);
      return;
    }

    /* Filtruj prázdné řádky a řádek s hlavičkou */
    var radky = odpoved.table.rows.filter(function (r) {
      return r.c && r.c[2] && r.c[2].v; /* sloupec C (Nazev) musí být vyplněn */
    });

    if (radky.length === 0) {
      ukaz(elPrazdne);
      return;
    }

    /* Pro každý řádek vytvoř kartu a vlož do DOM */
    radky.forEach(function (radek, i) {

      /* Bezpečné čtení buňky – vrátí '' pokud buňka chybí */
      function cti(col) {
        var b = radek.c && radek.c[col];
        if (!b || b.v === null || b.v === undefined) return '';
        /* .f = formátovaná hodnota (čísla, data), .v = raw hodnota */
        return String(b.f !== null && b.f !== undefined ? b.f : b.v).trim();
      }

      var den       = cti(0);
      var mesic     = cti(1);
      var nazev     = cti(2);
      var misto     = cti(3);
      var cas       = cti(4);
      var popis     = cti(5);
      var stitek    = cti(6);
      var typStitku = cti(7);

      /* Pokud je měsíc číslo (1–12), převeď na zkratku */
      var m = parseInt(mesic, 10);
      if (!isNaN(m) && m >= 1 && m <= 12) mesic = MESICE[m - 1];

      var stitek_trida = typStitku.toLowerCase() === 'sedy' ? 'akce-stitek-soukrome' : '';
      var zpozdeni     = (i * 0.07).toFixed(2) + 's';

      var html =
        '<div class="akce-karta animace-vlevo" style="transition-delay:' + zpozdeni + '">'
        + '<div class="akce-datum">'
        +   '<span class="datum-den">'   + (den   || '–') + '</span>'
        +   '<span class="datum-mesic">' + (mesic || '–') + '</span>'
        + '</div>'
        + '<div class="akce-info">'
        +   '<h3 class="akce-nazev">' + esc(nazev) + '</h3>'
        + (misto ? '<p class="akce-misto"><i class="fas fa-map-marker-alt"></i> ' + esc(misto) + '</p>' : '')
        + (cas   ? '<p class="akce-cas"><i class="fas fa-clock"></i> '            + esc(cas)   + '</p>' : '')
        + (popis ? '<p class="akce-popis">' + esc(popis) + '</p>' : '')
        + '</div>'
        + '<div class="akce-akce">'
        + (stitek ? '<span class="akce-stitek ' + stitek_trida + '">' + esc(stitek) + '</span>' : '')
        + '</div>'
        + '</div>';

      kontejner.insertAdjacentHTML('beforeend', html);
    });

    /* Nastartuj animace pro nově vložené karty */
    setTimeout(inicializujScrollAnimace, 60);
  };

  /*
    Vložíme <script> tag s URL Google Sheets.
    Jakmile se stáhne, automaticky zavolá setResponse výše.
    
    Parametry URL:
    - tqx=out:json  → vrať jako JSON (obalený do callback fce)
    - sheet=...     → název listu/záložky v tabulce
    - headers=1     → první řádek jsou hlavičky (přeskočí se automaticky)
  */
  var url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID
          + '/gviz/tq?tqx=out:json&headers=1&sheet=' + encodeURIComponent(SHEET_NAME);

  var script = document.createElement('script');
  script.src = url;
  script.onerror = function () {
    clearTimeout(timeout);
    skryj(elNacitani);
    ukaz(elChyba);
  };
  document.head.appendChild(script);
}


/* ── Pomocné funkce ── */

function ukaz(el)  { if (el) el.style.display = 'block'; }
function skryj(el) { if (el) el.style.display = 'none';  }

/* Escapování HTML – zabrání vložení škodlivého kódu z tabulky */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
