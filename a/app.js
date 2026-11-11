(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BOOKS = [
    { id: 'pinokyo', title: 'Pinokyo', author: 'Carlo Collodi', desc: 'Küçük bir kukla, kocaman bir merak. Pinokyo ile dürüstlüğün ve cesaretin izini sür.', listen: 'Pinokyo’nun dünyasını seslerden keşfet.', play: 'Pinokyo’nun kelimeleriyle bulmacayı çöz.' },
    { id: 'heidi', title: 'Heidi', author: 'Johanna Spyri', desc: 'Dağların, dostluğun ve sıcacık bir yuvanın peşinde Heidi’ye katıl.' },
    { id: 'alice', title: 'Alice Harikalar Diyarında', author: 'Lewis Carroll', desc: 'Beyaz tavşanı takip et. Her kapının ardında yeni bir sürpriz seni bekliyor.' },
    { id: 'oz', title: 'Oz Büyücüsü', author: 'L. Frank Baum', desc: 'Sarı tuğlalı yolda yürü; cesareti, dostluğu ve eve dönüş yolunu keşfet.' },
    { id: 'beyaz-dis', title: 'Beyaz Diş', author: 'Jack London', desc: 'Karlarla kaplı doğada, Beyaz Diş ile güvenin ve dostluğun izini bul.' },
    { id: 'define', title: 'Define Adası', author: 'Robert Louis Stevenson', desc: 'Haritayı aç, yelkenleri hazırla. Gizemli bir adaya doğru yola çık.' },
    { id: 'pollyanna', title: 'Pollyanna', author: 'Eleanor H. Porter', desc: 'Küçük mutlulukları bulma oyununda Pollyanna’nın dünyasına konuk ol.' },
    { id: 'mino', title: 'Mino ve Yıldız Tohumu', author: 'Okumino', original: true, desc: 'Mino’nun bulduğu minicik tohum, gökyüzüne uzanan bir maceranın başlangıcı. Örnek özgün hikâye.' },
    { id: 'kelimeler', title: 'Kayıp Kelimeler Ormanı', author: 'Okumino', original: true, desc: 'Kelimeler birer birer kayboluyor! Ormanın sesini geri getirebilir misin? Örnek özgün hikâye.' },
    { id: 'bulut', title: 'Bulut Postacısı', author: 'Okumino', original: true, desc: 'Gökyüzünde teslim edilmeyi bekleyen bir mektup ve yepyeni dostluklar. Örnek özgün hikâye.' }
  ];
  let selectedBook = BOOKS[0], currentLevel = 'kasif';
  const coverPath = book => `img/covers/${book.id}.webp`;
  const bookcase = $('#bookcase');
  const spineColors = ['#216f8c', '#61834b', '#8a5b9e', '#2e8b7f', '#547d99', '#b65c42', '#bd7074', '#565394', '#417b60', '#5799aa'];
  for (let row = 0; row < 2; row++) {
    const shelf = document.createElement('div');
    shelf.className = 'rack-row';
    shelf.innerHTML = BOOKS.slice(row * 5, row * 5 + 5).map((book, index) => {
      const n = row * 5 + index;
      return `<button type="button" class="rack-book" data-book="${book.id}" style="--spine-color:${spineColors[n]};--spine-font:${Math.min(17, 330 / book.title.length).toFixed(1)}px;--height:${[270,252,280,262,274,258,268,282,264,276][n]}px" aria-label="${book.title}, ${book.author}${book.original ? ', Okumino özgün, örnek başlık' : ''}" aria-pressed="false">
        <span class="rack-model">
          <span class="rack-front"><img src="${coverPath(book)}" width="180" height="270" alt=""></span>
          <span class="rack-spine" aria-hidden="true"><span class="spine-star">✦</span><b>${book.title}</b><small>${book.author}</small></span>
        </span>
      </button>`;
    }).join('');
    bookcase.appendChild(shelf);
  }
  function selectBook(id) {
    selectedBook = BOOKS.find(book => book.id === id) || BOOKS[0];
    const src = coverPath(selectedBook);
    $$('.rack-book').forEach(button => {
      const active = button.dataset.book === selectedBook.id;
      button.setAttribute('aria-pressed', String(active));
      const cover = $('.rack-front', button);
      if (active) { cover.dataset.anchor = '0'; cover.dataset.src = src; }
      else { delete cover.dataset.anchor; delete cover.dataset.src; }
    });
    $$('[data-book-title]').forEach(el => { el.textContent = selectedBook.title; });
    $('#chosenTitle').textContent = selectedBook.title;
    $('#chosenAuthor').textContent = selectedBook.author;
    $('#originalNote').hidden = !selectedBook.original;
    $('#startJourney').setAttribute('aria-label', `${selectedBook.title} ile yolculuğa başla`);
    $('#listenNote').textContent = selectedBook.listen || `${selectedBook.title}: dinle, hayal et, keşfet.`;
    $('#playNote').textContent = selectedBook.play || 'Bu hikâyenin kelimeleriyle bulmacaları çöz.';
    const stamp = $('#stampTitle');
    stamp.textContent = selectedBook.title.toLocaleUpperCase('tr-TR');
    stamp.setAttribute('textLength', '76');
    stamp.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    $$('.a-open, .a-stamp').forEach(el => { el.dataset.src = src; });
    $('.a-open img').src = src;
    $('.a-open img').alt = `${selectedBook.title} yolculuğu`;
    $$('.bk-img img').forEach(img => { img.src = src; img.alt = selectedBook.title; });
    setLevel(currentLevel);
  }
  bookcase.addEventListener('click', event => {
    const button = event.target.closest('[data-book]');
    if (button) selectBook(button.dataset.book);
  });
  bookcase.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = $$('.rack-book');
    const index = buttons.indexOf(event.target.closest('.rack-book'));
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus({ preventScroll: true });
    selectBook(buttons[next].dataset.book);
  });

  /* torn-paper edges: a jagged band filled with the next section's colour */
  $$('.tear').forEach((t, k) => {
    let seed = 7 + k * 13;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    let d = 'M0 34 L0 ' + (14 + rnd() * 10).toFixed(1);
    for (let x = 1.5; x <= 100; x += 1.5 + rnd() * 1.5) d += ` L${x.toFixed(1)} ${(6 + rnd() * 18).toFixed(1)}`;
    d += ' L100 18 L100 34 Z';
    t.innerHTML = `<svg viewBox="0 0 100 34" preserveAspectRatio="none"><path d="${d}" fill="${t.dataset.fill}"/></svg>`;
  });

  /* level picker */
  const LV = {
    minik: { note: 'Minik: dinleme ve görsel ağırlıklı, kısa metinler, resimli kelime oyunları.', stops: 6, titles: [['Çirkin Ördek Yavrusu', 'Andersen'], ['Bremen Mızıkacıları', 'Grimm'], ['Kurt ile Yedi Keçi', 'Grimm'], ['Tavşan Peter', 'B. Potter'], ['Nasreddin Hoca', 'Halk edebiyatı']] },
    kasif: { note: 'Kâşif: metin sadeleşir, sesli okuma ve akıcılık öne çıkar.', stops: 8, titles: [['Pinokyo', 'C. Collodi'], ['Oz Büyücüsü', 'L. F. Baum'], ['Heidi', 'J. Spyri'], ['Alice Harikalar Diyarında', 'L. Carroll'], ['Pollyanna', 'E. H. Porter']] },
    usta: { note: 'Usta: asıl metne yakın, göz egzersizleri, çıkarım ve yazma ağırlıklı.', stops: 10, titles: [['Beyaz Diş', 'J. London'], ['Pal Sokağı Çocukları', 'F. Molnár'], ['Define Adası', 'R. L. Stevenson'], ['Seksen Günde Devriâlem', 'J. Verne'], ['Dede Korkut Hikâyeleri', 'Anonim']] }
  };
  const lvName = { minik: 'Minik', kasif: 'Kâşif', usta: 'Usta' };
  function setLevel(k) {
    currentLevel = k;
    $$('.toggle button').forEach(b => { const on = b.dataset.lv === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    $$('.bk').forEach(b => {
      const on = b.dataset.lv === k; b.classList.toggle('on', on);
      const img = $('.bk-img', b);
      if (on) { img.dataset.anchor = '2'; img.dataset.src = $('img', img).getAttribute('src'); }
      else { delete img.dataset.anchor; }
      img.classList.toggle('anchor', on);
    });
    $('#lvNote').textContent = LV[k].note;
    $('#lvTitles').textContent = `${selectedBook.title} · ${selectedBook.author} · ${lvName[k]} yolculuğu`;
    const stops = LV[k].stops;
    $('.cert-body').innerHTML = `<b>${selectedBook.title}</b> (${lvName[k]} sürümü) eserini okuyup tüm durakları başarıyla tamamladı.`;
    $('.cert-foot').children[0].innerHTML = `<b>${stops}</b> durak`;
    $('.cert-foot').children[1].innerHTML = `<b>${stops * 6}</b> adım`;
    $('.kpis div:nth-child(2) span').textContent = `/ ${stops}`;
    if (!reduce) layout();
  }
  $$('.toggle button').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.lv)));
  $$('.bk').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.lv)));

  /* certificate */
  const nameIn = $('#nameIn'), certName = $('#certName');
  nameIn.addEventListener('input', () => { certName.textContent = nameIn.value.trim() || 'Öğrencinin adı'; });
  const qr = $('#qr'); let q = '';
  let s2 = 42; const r2 = () => ((s2 = (s2 * 16807) % 2147483647) / 2147483647);
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#3A1F2B"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#FFFBF5"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#3A1F2B"/>`;
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    if (!inF && r2() > .52) q += `<rect x="${x}" y="${y}" width="1" height="1" fill="#3A1F2B"/>`;
  }
  qr.innerHTML = q + finder(0, 0) + finder(14, 0) + finder(0, 14);

  /* FAQ */
  const FAQ = [
    ['Okumino hangi yaş grubu için?', '1–8. sınıf öğrencileri için. Her eser Minik (1–2), Kâşif (3–5) ve Usta (6–8) olmak üzere üç sürümde hazırlanır; çocuğa uygun sürüm kısa bir seviye testiyle belirlenir.'],
    ['Eserler telifli mi?', 'Patikalar iki tür eserden oluşur: telif süresi dolmuş (kamu malı) sevilen eserler ve Okumino ekibinin yazdığı özgün hikâyeler. Uyarlamalar, seslendirmeler ve görseller de Okumino ekibi tarafından özgün olarak hazırlanır.'],
    ['Öğrencinin ses kaydı ne oluyor?', 'Sesli okuma kayıtları yalnızca akıcılık puanını hesaplamak için kullanılır ve puanlamadan sonra silinir. Kayıt için veli onayı alınır.'],
    ['Müfredatla bağlantısı var mı?', 'Var, ama çocuğun karşısına çıkmaz. Her adım arka planda Türkçe dersi kazanımları ve okuma becerileriyle eşleştirilir; öğretmen raporlarında bu eşleşme görünür.'],
    ['Hangi cihazlarda çalışır?', 'Tablet, telefon ve bilgisayarda tarayıcı üzerinden çalışır. Sınıf tahtasında ortak okuma için de kullanılabilir.'],
    ['Okuma belgesi nasıl kazanılır?', 'Patikadaki tüm duraklar tamamlanıp final aşamasında başarı eşiği geçildiğinde, öğrencinin adının yazdığı ve QR kodla doğrulanabilen belge oluşturulur.']
  ];
  $('#faqList').innerHTML = FAQ.map((f, i) => `<div class="qa${i === 0 ? ' open' : ''}"><button aria-expanded="${i === 0}">${f[0]}<i>+</i></button><p>${f[1]}</p></div>`).join('');
  $$('.qa button').forEach(b => b.addEventListener('click', () => {
    const qa = b.parentElement, open = !qa.classList.contains('open');
    $$('.qa').forEach(x => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', false); });
    if (open) { qa.classList.add('open'); b.setAttribute('aria-expanded', true); }
  }));

  /* form (no backend yet) */
  $('#form').addEventListener('submit', e => { e.preventDefault(); $('.ok', e.target).hidden = false; $('button[type=submit]', e.target).hidden = true; });

  /* reveal-on-view */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .3 });
  $$('.ways, .class').forEach(el => io.observe(el));

  /* ─── the traveler: one book that moves between anchors as you scroll ─── */
  const stampSec = $('.stamp');
  const ink = () => stampSec.classList.add('inked');
  if (reduce) {
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { ink(); o.disconnect(); } }), { threshold: .5 }).observe($('.passport-wrap'));
    selectBook(selectedBook.id);
    return;
  }
  document.documentElement.classList.add('js-travel');
  const T = $('#traveler'), tin = $('.t-in'), ta = $('.ta'), tb = $('.tb');
  let stops = [];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function layout() {
    const vh = innerHeight;
    stops = $$('[data-anchor]').sort((a, b) => a.dataset.anchor - b.dataset.anchor).map(el => {
      const r = el.getBoundingClientRect();
      const x = r.left + scrollX, y = r.top + scrollY;
      return { x, y, w: r.width, h: r.height, src: el.dataset.src, end: !!el.dataset.end, at: Math.max(0, y + r.height / 2 - vh / 2) };
    });
    frame();
  }

  /* Everything below is scrubbed by scroll position, never fired once:
     the book's flight, the four modes leaving the open book, their arrows.
     sy is a damped copy of scrollY, so a wheel notch (100px jump) becomes a glide. */
  const sine = t => .5 - Math.cos(Math.PI * t) / 2;
  const ways = $('.ways'), modes = $$('.mode', ways);
  let sy = scrollY, lastA = '', lastB = '';

  function frame() {
    if (!stops.length) return;
    const y = sy;
    let i = 0;
    while (i < stops.length - 2 && y >= stops[i + 1].at) i++;
    const A = stops[i], B = stops[i + 1];
    const raw = clamp((y - A.at) / Math.max(1, B.at - A.at));
    const e = sine(smooth(.06, .94, raw));          // travels across almost the whole gap
    const dir = i % 2 ? -1 : 1;
    const arc = Math.sin(Math.PI * e);
    const x = A.x + (B.x - A.x) * e + arc * 70 * dir;
    const yy = A.y + (B.y - A.y) * e - arc * 30;
    const w = A.w + (B.w - A.w) * e, h = A.h + (B.h - A.h) * e;
    T.style.width = w + 'px'; T.style.height = h + 'px';
    T.style.transform = `translate3d(${x}px,${yy}px,0) rotate(${arc * 10 * dir}deg)`;
    if (A.src !== lastA) { ta.src = A.src; lastA = A.src; }
    if (B.src !== lastB) { tb.src = B.src; lastB = B.src; }
    // on the way to the passport the book keeps its own picture and shrinks away
    const mix = B.end ? 0 : smooth(.3, .85, e);
    tb.style.opacity = mix; ta.style.opacity = 1 - mix;
    T.style.opacity = B.end ? 1 - smooth(.72, .98, e) : 1;
    // Keep the shelf cover in place until the reader reaches its row.
    const onShelf = y <= stops[0].at;
    T.style.visibility = onShelf ? 'hidden' : 'visible';
    bookcase.classList.toggle('book-departed', !onShelf);
    if (B.end && e > .96) ink();
    modesFrame();
  }

  // the four modes slide out of the open book as the section scrolls up
  function modesFrame() {
    // starts as the book is landing on its stop and finishes a little after it opens
    const land = stops[1] ? stops[1].at : 0, vh = innerHeight;
    const p = clamp((sy - (land - vh * .3)) / (vh * .55));
    modes.forEach((m, k) => {
      const q = sine(clamp((p - k * .1) / .6));
      if (innerWidth <= 900) { m.style.opacity = q; m.style.transform = `translateY(${(1 - q) * 40}px)`; return; }
      m.style.opacity = q;
      m.style.transform = `translate(calc(var(--fx) * ${1 - q}), calc(var(--fy) * ${1 - q})) scale(${.25 + .75 * q}) rotate(${(1 - q) * (k % 2 ? 18 : -18)}deg)`;
      m.style.setProperty('--arrow', clamp((q - .85) / .15) * .75);
    });
  }

  let frameId = 0;
  function loop() {
    const d = scrollY - sy;
    sy = Math.abs(d) < .4 ? scrollY : sy + d * .22;
    frame();
    frameId = Math.abs(scrollY - sy) > .4 ? requestAnimationFrame(loop) : 0;
  }
  function scheduleFrame() { if (!frameId) frameId = requestAnimationFrame(loop); }
  ways.classList.add('scrub');
  addEventListener('resize', layout);
  addEventListener('scroll', scheduleFrame, { passive: true });
  addEventListener('load', layout);
  document.fonts && document.fonts.ready.then(layout);
  selectBook(selectedBook.id);
  const rackResize = new ResizeObserver(() => layout());
  $$('.rack-book').forEach(book => rackResize.observe(book));
  scheduleFrame();

})();
