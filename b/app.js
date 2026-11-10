(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const pose = (img, p) => { img.src = `img/pino_${p}.webp`; };
  ['ayakta', 'kosuyor', 'zipliyor', 'uzunburun'].forEach(p => { const i = new Image(); i.src = `img/pino_${p}.webp`; });

  /* hero: he jumps off the page and runs */
  const heroPino = $('.hero-pino');
  setTimeout(() => pose(heroPino, 'zipliyor'), 1950);
  setTimeout(() => { pose(heroPino, 'kosuyor'); heroPino.classList.add('run'); }, 2450);

  /* trail: which stop are we at, which are done */
  const trail = $('.trail');
  const done = new Set();
  const phone = matchMedia('(max-width: 900px)'); let blipT;
  const markDone = id => { done.add(id); const li = $(`.trail li[data-for="${id}"]`); li && li.classList.add('done'); };
  const ids = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'son'];
  const secIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$('.trail li').forEach(li => li.classList.toggle('now', li.dataset.for === e.target.id));
    if (phone.matches) { trail.classList.add('blip', 'show'); clearTimeout(blipT); blipT = setTimeout(() => trail.classList.remove('blip', 'show'), 1800); }
  }), { rootMargin: '-45% 0px -45% 0px' });
  ids.forEach(id => secIO.observe(document.getElementById(id)));
  addEventListener('scroll', () => {
    const show = scrollY > innerHeight * .6 && scrollY < $('#kulis').offsetTop - innerHeight * .3;
    if (!phone.matches || !trail.classList.contains('blip')) trail.classList.toggle('show', show && !phone.matches);
  }, { passive: true });

  /* durak 1: doors */
  const f1 = $('#f1');
  $$('.door').forEach(d => d.addEventListener('click', () => {
    d.classList.add('open');
    if (d.dataset.ok === '1') { f1.textContent = 'Bildin! Tahmin etmek okumayı başlatır.'; markDone('d1'); }
    else { f1.textContent = 'Burada değil. Bir kapı daha dene.'; d.classList.add('shake'); setTimeout(() => d.classList.remove('shake'), 450); }
  }));

  /* durak 2: listen, word by word */
  const say = $('#say');
  const words = say.textContent.trim().split(/\s+/);
  say.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
  const spans = $$('span', say);
  const hopper = $('#hopper'), listen = $('.listen');
  const starts = []; { let i = 0; words.forEach(w => { starts.push(i); i += w.length + 1; }); }
  function light(k) {
    spans.forEach((s, j) => { s.classList.toggle('on', j === k); s.classList.toggle('past', j < k); });
    if (k < 0 || k >= spans.length) return;
    const r = spans[k].getBoundingClientRect(), L = listen.getBoundingClientRect();
    hopper.style.left = (r.left - L.left + r.width / 2 - 26) + 'px';
    hopper.style.top = (r.top - L.top - 84) + 'px';
    hopper.classList.remove('jump'); void hopper.offsetWidth; hopper.classList.add('jump');
  }
  let playing = false;
  $('#play').addEventListener('click', async () => {
    if (playing) return; playing = true;
    const btn = $('#play'); btn.disabled = true;
    const synth = window.speechSynthesis;
    const voice = synth && synth.getVoices().find(v => /^tr/i.test(v.lang));
    let usedBoundary = false;
    if (voice) {
      const u = new SpeechSynthesisUtterance(say.textContent);
      u.voice = voice; u.lang = voice.lang; u.rate = .9;
      u.onboundary = e => { usedBoundary = true; let k = 0; while (k + 1 < starts.length && starts[k + 1] <= e.charIndex) k++; light(k); };
      const end = new Promise(r => { u.onend = r; u.onerror = r; });
      synth.cancel(); synth.speak(u);
      await wait(900);
      if (!usedBoundary) { for (let k = 0; k < spans.length; k++) { light(k); await wait(420); } }
      await end;
    } else {
      for (let k = 0; k < spans.length; k++) { light(k); await wait(400); }
    }
    light(spans.length); spans.forEach(s => s.classList.add('past'));
    btn.disabled = false; btn.textContent = '↻ Bir daha dinle'; playing = false; markDone('d2');
  });
  if (window.speechSynthesis) speechSynthesis.getVoices();

  /* durak 3: the word builds the bridge */
  const river = $('#river'), f3 = $('#f3'), blank = $('#blank');
  $$('.tile').forEach(t => t.addEventListener('click', () => {
    if (river.classList.contains('built')) return;
    if (t.dataset.w === 'KÜTÜK') {
      t.classList.add('yes'); blank.textContent = 'kütük'; river.classList.add('built');
      f3.textContent = 'Köprü kuruldu! Pinokyo karşıya geçiyor.';
      const c = $('.crosser'); setTimeout(() => { pose(c, 'kosuyor'); c.classList.add('run'); river.classList.add('go'); }, 700);
      setTimeout(() => { c.classList.remove('run'); pose(c, 'zipliyor'); markDone('d3'); }, 3000);
    } else {
      t.classList.add('no'); f3.textContent = t.dataset.w === 'KAŞIK' ? 'Kaşıktan kukla mı olur? Bir daha bak.' : 'Kayıkla dans edilmez. Bir daha bak.';
      setTimeout(() => t.classList.remove('no'), 450);
    }
  }));

  /* durak 4: a simulated read-aloud */
  const rt = $('#readText');
  rt.innerHTML = rt.textContent.trim().split(/\s+/).map(w => `<span>${w}</span>`).join(' ');
  const rs = $$('span', rt), arc = $('#arc'), wpm = $('#wpm');
  $('#readBtn').addEventListener('click', async e => {
    const b = e.currentTarget; b.disabled = true; $('#recPop').classList.remove('show');
    for (let k = 0; k < rs.length; k++) {
      rs.forEach((s, j) => { s.classList.toggle('on', j === k); s.classList.toggle('past', j < k); });
      const v = Math.round(58 * (k + 1) / rs.length);
      wpm.textContent = v; arc.setAttribute('stroke-dasharray', `${Math.round(v / 80 * 100)} 100`);
      await wait(330);
    }
    rs.forEach(s => { s.classList.remove('on'); s.classList.add('past'); });
    $('#recPop').classList.add('show'); b.disabled = false; b.textContent = '↻ Bir daha izle'; markDone('d4');
  });

  /* reveal-on-view: theater, final */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.id === 'theater') setTimeout(() => markDone('d5'), 1500);
    if (e.target.id === 'endScene') { $('#son').classList.add('in'); const hp = $('.home-pino'); hp.classList.add('run'); setTimeout(() => { hp.classList.remove('run'); pose(hp, 'ayakta'); }, 1750); markDone('son'); }
  }), { threshold: .45 });
  io.observe($('#theater')); io.observe($('#endScene'));

  /* durak 6: true or lie, watch the nose */
  const liar = $('#liar'), bubble = $('#bubble');
  $$('.claim').forEach(c => c.addEventListener('click', () => {
    const lie = c.dataset.lie === '1';
    $$('.claim').forEach(x => x.classList.remove('t', 'l'));
    c.classList.add(lie ? 'l' : 't');
    bubble.innerHTML = `${c.textContent}<b>${lie ? 'Yalan! Burnuma bak.' : 'Doğru! Burnum yerinde.'}</b><span class="why">${c.dataset.why}</span>`;
    liar.classList.remove('lying', 'boing'); void liar.offsetWidth;
    liar.classList.add('boing'); if (lie) liar.classList.add('lying');
    markDone('d6');
  }));

  /* certificate */
  const nameIn = $('#nameIn'), certName = $('#certName');
  nameIn.addEventListener('input', () => { certName.textContent = nameIn.value.trim() || 'Öğrencinin adı'; });
  let q = '', s2 = 42; const r2 = () => ((s2 = (s2 * 16807) % 2147483647) / 2147483647);
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#2B1B17"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#FFF9EE"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#2B1B17"/>`;
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    if (!inF && r2() > .52) q += `<rect x="${x}" y="${y}" width="1" height="1" fill="#2B1B17"/>`;
  }
  $('#qr').innerHTML = q + finder(0, 0) + finder(14, 0) + finder(0, 14);

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

  $('#form').addEventListener('submit', e => { e.preventDefault(); $('.ok', e.target).hidden = false; $('button[type=submit]', e.target).hidden = true; });
})();
