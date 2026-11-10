(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* torn-paper edges: a jagged band filled with the next section's colour */
  $$('.tear').forEach((t, k) => {
    let seed = 7 + k * 13;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    let d = 'M0 34 L0 ' + (14 + rnd() * 10).toFixed(1);
    for (let x = 1.5; x <= 100; x += 1.5 + rnd() * 1.5) d += ` L${x.toFixed(1)} ${(6 + rnd() * 18).toFixed(1)}`;
    d += ' L100 18 L100 34 Z';
    t.innerHTML = `<svg viewBox="0 0 100 34" preserveAspectRatio="none"><path d="${d}" fill="${t.dataset.fill}"/></svg>`;
  });

  /* mascot: walk in, then idle bob */
  const mascot = $('.mascot');
  mascot.addEventListener('animationend', () => { mascot.classList.remove('walk'); mascot.classList.add('idle'); }, { once: true });

  /* level picker */
  const LV = {
    minik: { note: 'Minik: dinleme ve görsel ağırlıklı, kısa metinler, resimli kelime oyunları.', stops: 6, titles: [['Çirkin Ördek Yavrusu', 'Andersen'], ['Bremen Mızıkacıları', 'Grimm'], ['Kurt ile Yedi Keçi', 'Grimm'], ['Tavşan Peter', 'B. Potter'], ['Nasreddin Hoca', 'Halk edebiyatı']] },
    kasif: { note: 'Kâşif: metin sadeleşir, sesli okuma ve akıcılık öne çıkar.', stops: 8, titles: [['Pinokyo', 'C. Collodi'], ['Oz Büyücüsü', 'L. F. Baum'], ['Heidi', 'J. Spyri'], ['Alice Harikalar Diyarında', 'L. Carroll'], ['Pollyanna', 'E. H. Porter']] },
    usta: { note: 'Usta: asıl metne yakın, göz egzersizleri, çıkarım ve yazma ağırlıklı.', stops: 10, titles: [['Beyaz Diş', 'J. London'], ['Pal Sokağı Çocukları', 'F. Molnár'], ['Define Adası', 'R. L. Stevenson'], ['Seksen Günde Devriâlem', 'J. Verne'], ['Dede Korkut Hikâyeleri', 'Anonim']] }
  };
  const lvName = { minik: 'Minik', kasif: 'Kâşif', usta: 'Usta' };
  function setLevel(k) {
    $$('.toggle button').forEach(b => { const on = b.dataset.lv === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    $$('.bk').forEach(b => {
      const on = b.dataset.lv === k; b.classList.toggle('on', on);
      const img = $('.bk-img', b);
      if (on) { img.dataset.anchor = '2'; img.dataset.src = $('img', img).getAttribute('src'); }
      else { delete img.dataset.anchor; }
      img.classList.toggle('anchor', on);
    });
    $('#lvNote').textContent = LV[k].note;
    $('#lvTitles').innerHTML = LV[k].titles.map(t => `<span>${t[0]} <i>· ${t[1]}</i></span>`).join('') + '<span class="own">+ Okumino\'ya özel özgün hikâyeler</span>';
    const stops = LV[k].stops;
    $('.cert-body').innerHTML = `<b>Pinokyo</b> (${lvName[k]} sürümü) eserini okuyup tüm durakları başarıyla tamamladı.`;
    $('.cert-foot').children[0].innerHTML = `<b>${stops}</b> durak`;
    $('.cert-foot').children[1].innerHTML = `<b>${stops * 6}</b> adım`;
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
    setLevel('kasif');
    return;
  }
  document.documentElement.classList.add('js-travel');
  const T = $('#traveler'), tin = $('.t-in'), ta = $('.ta'), tb = $('.tb');
  tin.classList.add('drop');
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

  function loop() {
    const d = scrollY - sy;
    sy = Math.abs(d) < .4 ? scrollY : sy + d * .22;
    frame();
    requestAnimationFrame(loop);
  }
  ways.classList.add('scrub');
  addEventListener('resize', layout);
  addEventListener('load', layout);
  document.fonts && document.fonts.ready.then(layout);
  setLevel('kasif');
  requestAnimationFrame(loop);

  /* inertial wheel scrolling (Lenis); the page works natively if it fails to load */
  const ls = document.createElement('script');
  ls.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
  ls.onload = () => {
    if (!window.Lenis) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', ev => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      ev.preventDefault(); lenis.scrollTo(el, { offset: -70 });
    }));
  };
  document.head.appendChild(ls);
})();
