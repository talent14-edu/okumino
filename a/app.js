/* Okumino A · "Okuma odası" (v2). Tek seçili kitap; hero rafı, dolap, yolculuk, damga, belge ve panel aynı kitabı gösterir. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const BOOKS = [
    { id:'pinokyo', title:'Pinokyo', author:'Carlo Collodi', desc:'Küçük bir kukla, kocaman bir merak. Pinokyo ile dürüstlüğün ve cesaretin izini sür.', listen:'Pinokyo’nun dünyasını seslerden keşfet.', play:'Pinokyo’nun kelimeleriyle bulmacayı çöz.' },
    { id:'heidi', title:'Heidi', author:'Johanna Spyri', desc:'Dağların, dostluğun ve sıcacık bir yuvanın peşinde Heidi’ye katıl.' },
    { id:'alice', title:'Alice Harikalar Diyarında', author:'Lewis Carroll', desc:'Beyaz tavşanı takip et. Her kapının ardında yeni bir sürpriz seni bekliyor.' },
    { id:'oz', title:'Oz Büyücüsü', author:'L. Frank Baum', desc:'Sarı tuğlalı yolda yürü; cesareti, dostluğu ve eve dönüş yolunu keşfet.' },
    { id:'beyaz-dis', title:'Beyaz Diş', author:'Jack London', desc:'Karlarla kaplı doğada, Beyaz Diş ile güvenin ve dostluğun izini bul.' },
    { id:'define', title:'Define Adası', author:'Robert Louis Stevenson', desc:'Haritayı aç, yelkenleri hazırla. Gizemli bir adaya doğru yola çık.' },
    { id:'pollyanna', title:'Pollyanna', author:'Eleanor H. Porter', desc:'Küçük mutlulukları bulma oyununda Pollyanna’nın dünyasına konuk ol.' },
    { id:'mino', title:'Mino ve Yıldız Tohumu', author:'Okumino', original:true, desc:'Mino’nun bulduğu minicik tohum, gökyüzüne uzanan bir maceranın başlangıcı.' },
    { id:'kelimeler', title:'Kayıp Kelimeler Ormanı', author:'Okumino', original:true, desc:'Kelimeler birer birer kayboluyor! Ormanın sesini geri getirebilir misin?' },
    { id:'bulut', title:'Bulut Postacısı', author:'Okumino', original:true, desc:'Gökyüzünde teslim edilmeyi bekleyen bir mektup ve yepyeni dostluklar.' }
  ];
  // tanıtım seçkisi: seviye eşlemesi ve durak sayıları (bir durak = 5 adım; sesli okuma yok)
  const LEVEL = { heidi:'minik', mino:'minik', bulut:'minik', pinokyo:'kasif', alice:'kasif', oz:'kasif', pollyanna:'kasif', 'beyaz-dis':'usta', define:'usta', kelimeler:'usta' };
  const LV = { minik:{ ad:'Minik', sinif:'1–2. sınıf', durak:6 }, kasif:{ ad:'Kâşif', sinif:'3–5. sınıf', durak:8 }, usta:{ ad:'Usta', sinif:'6–8. sınıf', durak:10 } };
  const OPENING = { pinokyo:'Bir varmış, bir yokmuş…', heidi:'Dağın tepesinde bir kulübe…', alice:'Tavşan deliğinden aşağı…', oz:'Bir kasırga esti…', 'beyaz-dis':'Karlı ormanda bir iz…',
    define:'Eski bir harita bulundu…', pollyanna:'Mutlu olmak bir oyundu…', mino:'Minicik bir tohum parladı…', kelimeler:'Orman sustu…', bulut:'Bir mektup uçup geldi…' };
  // Mino'nun renklerinden canlı sırt paleti; sarı sırtta yazı koyu
  const C = ['#E2552B','#2F5FD0','#F2B233','#1F9C8A','#C23C6B','#5C9A3E','#7B4FB8','#F08A24','#3E9BD6','#B8442E'];
  const H = [330,300,352,318,340,306,326,356,312,338], T = [44,38,50,40,46,36,42,52,38,46];
  const cover = b => `img/covers/${b.id}.webp`;
  /* Bir durağın beş etkinliği, kitaba göre: [tahmin, dinle, kelimeler, izle, anla ve üret]. Tanıtım örneği. */
  const ETK = {
    pinokyo:['Konuşan bir odun parçası… Ustanın elinde neye dönüşecek?','Gepetto Usta’nın kuklayı yonttuğu günü dinle.',['usta','yontmak','kukla'],'Pinokyo’nun ilk adımlarını izle.','Pinokyo’ya evden çıkmadan önce uyacağı bir kural yaz.'],
    heidi:['Dağın tepesindeki kulübede kim yaşıyor olabilir?','Heidi’nin dedesinin yanına geldiği günü dinle.',['otlak','kulübe','keçi'],'Heidi’nin samanlıktaki yatağını izle.','Dede önce neden sessizdi? Tek cümleyle anlat.'],
    alice:['Ceketli, saatli bir tavşan nereye koşuyor olabilir?','Alice’in tavşan deliğinden aşağı düşüşünü dinle.',['delik','anahtar','şişe'],'Alice’in küçülüp büyüdüğü sahneyi izle.','Sen küçülseydin odanda neler görürdün? Üçünü çiz.'],
    oz:['Kasırga Dorothy’nin evini nereye götürecek?','Kasırgayı ve Munchkin ülkesine varışı dinle.',['kasırga','gümüş ayakkabı','sarı tuğla'],'Evin havalandığı sahneyi izle.','Dorothy yanına üç eşya alsa hangilerini seçerdin? Nedenini söyle.'],
    'beyaz-dis':['Karda küçük bir kurt yavrusu… Onu neler bekliyor?','Yavrunun ininden ilk kez çıktığı günü dinle.',['in','iz','sürü'],'Yavrunun dünyayı ilk kez gördüğü sahneyi izle.','Yavru ilk gün neler öğrendi? Olayları sırala.'],
    define:['Yaşlı kaptanın sandığında ne saklı olabilir?','Amiral Benbow Hanı’na gelen yaşlı denizciyi dinle.',['han','sandık','harita'],'Haritanın bulunduğu sahneyi izle.','Kendi define haritanı çiz: üç işaret, bir çarpı.'],
    pollyanna:['“Mutluluk oyunu” nasıl oynanıyor olabilir?','Pollyanna’nın teyzesinin evine geldiği günü dinle.',['tavan arası','teyze','oyun'],'Pollyanna’nın tavan arasındaki odasını izle.','Bugün sevindiğin bir şeyi bul, Pollyanna gibi anlat.'],
    mino:['Gece parlayan tohumdan ne çıkacak?','Mino’nun tohumu bulduğu geceyi dinle.',['tohum','filiz','ışık'],'Tohumun ilk filizini izle.','Tohum büyüsün diye Mino’ya üç öneri ver.'],
    kelimeler:['Orman neden birden sessizleşmiş olabilir?','Kuşların şarkısının kaybolduğu sabahı dinle.',['yankı','fısıltı','şarkı'],'Kelimelerin uçup gittiği sahneyi izle.','Ormana geri getirmek istediğin üç kelimeyi seç.'],
    bulut:['Bulutun taşıdığı mektup kime gidiyor olabilir?','Bulutun mektubu yakaladığı anı dinle.',['mektup','zarf','rüzgâr'],'Bulutun gökyüzündeki yolculuğunu izle.','Bir arkadaşına üç cümlelik bir mektup yaz.']
  };
  const ADIM = [['önce','Tahmin et','?'],['sırası','Dinle','img/mod_dinle.webp'],['sırası','Kelime oyunu','img/mod_oyna.webp'],['sırası','İzle','img/mod_izle.webp'],['sonra','Anla ve üret','img/mino_dedektif.webp']];
  const KILIT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 10V7.5a5 5 0 0 1 10 0V10h.5A1.5 1.5 0 0 1 19 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10Zm2.2 0h5.6V7.5a2.8 2.8 0 0 0-5.6 0Z"/></svg>';
  function patikaCiz(b, lv) {
    const n = lv.durak, pk = $('#patika');
    pk.setAttribute('aria-label', `${b.title} patikası: ${n} durak. 1. durak açık, diğerleri sırayla açılır, sonda final damgası.`);
    pk.innerHTML = Array.from({ length: n }, (_, k) => k === 0
      ? '<span class="dur burada">1<em>Buradasın</em><small>1. durak</small></span>'
      : k === n - 1 ? '<span class="dur final"><img src="img/muhur.webp" alt=""><small>Final</small></span>'
      : `<span class="dur">${KILIT}<small>${k + 1}</small></span>`).join('');
    // etkinlik kutusunun oku 1. durağı göstersin
    requestAnimationFrame(() => {
      const d = $('.dur.burada', pk), kutu = $('.etkinlik-kutu');
      kutu.style.setProperty('--ok', `${d.getBoundingClientRect().left + d.offsetWidth / 2 - kutu.getBoundingClientRect().left - 16}px`);
    });
  }
  function etkinlikCiz(b) {
    const e = ETK[b.id];
    $('#etkinlik').innerHTML = ADIM.map(([faz, ad, ik], k) => `<li style="--d:${k}"><div class="no2"><i>${k + 1}</i><small>${faz}</small></div>
      ${ik === '?' ? '<span class="tahmin-ikon" aria-hidden="true">?</span>' : `<img src="${ik}" alt="">`}<b>${ad}</b>
      ${k === 2 ? `<p>Hikâyeden üç kelime. Her birini resmiyle eşleştir.</p><div class="kelimeler">${e[2].map(w => `<span>${w}</span>`).join('')}</div>` : `<p>${e[k]}</p>`}</li>`).join('');
  }
  let secili = 0, gezYerlesim = null;

  /* 3D kitap; k ölçek (dolap için küçük) */
  function kitapHTML(b, i, k = 1) {
    const h = Math.round(H[i] * k), t = Math.round(T[i] * k), w = Math.round(H[i] * .62 * k);
    const fs = (Math.min(22, (H[i] - 130) / b.title.length * 1.9) * k).toFixed(1);
    return `<button class="kitap" type="button" data-i="${i}" style="--c:${C[i]};--H:${h}px;--T:${t}px;--W:${w}px;--fs:${fs}px;${C[i] === '#F2B233' ? '--y:#46202F' : ''}"
      aria-label="${b.title}, ${b.author}${b.original ? ', Okumino özgün, örnek başlık' : ''}" aria-pressed="false">
      <span class="kutu"><span class="yuz arka"></span><span class="yuz ust"></span>
        <span class="yuz on"><img src="${cover(b)}" alt="" loading="lazy"></span>
        <span class="yuz sirt"><i>✦</i><b>${b.title}</b>${k > .8 ? `<small>${b.author}</small>` : ''}</span></span>
      <span class="etiket">${b.title}</span><span class="ac-ipucu">Aç ve keşfet ✦</span></button>`;
  }

  /* hero rafı */
  const raf = $('#raf');
  raf.innerHTML = BOOKS.map((b, i) => kitapHTML(b, i)).join('');
  /* dolap: her seviye bir raf */
  $('#dolap').innerHTML = Object.entries(LV).map(([k, v]) => `<div class="katman"><div class="raf2" role="group" aria-label="${v.ad} rafı, ${v.sinif}">
      ${BOOKS.map((b, i) => LEVEL[b.id] === k ? kitapHTML(b, i, .72) : '').join('')}</div>
      <span class="levha">${v.ad} <small>· ${v.sinif}</small></span></div>`).join('');

  function sec(i) {
    secili = i;
    const b = BOOKS[i], lv = LV[LEVEL[b.id]];
    $$('.kitap').forEach(k => { const on = +k.dataset.i === i; k.classList.toggle('secili', on); k.setAttribute('aria-pressed', String(on)); });
    // yolculuk
    $('#yolKapak').src = cover(b); $('#yolKapak').alt = `${b.title} kapağı`;
    $('#yolEl').textContent = `${b.title} yola çıktı`;
    $('#durakKapak').src = cover(b); etkinlikCiz(b); patikaCiz(b, lv);
    $('#gezgin img').src = cover(b); setTimeout(() => gezYerlesim && gezYerlesim(), 760);
    $('#dinleNot').textContent = b.listen || `${b.title}: dinle, hayal et, keşfet.`;
    $('#oynaNot').textContent = b.play || 'Bu hikâyenin kelimeleriyle bulmacaları çöz.';
    // dolap altı
    $('#secimMetin').textContent = `Seçilen kitap: ${b.title} · ${lv.ad} · ${lv.durak} durak`;
    // damga + belge + panel
    const d = $('#damgaAd'); d.textContent = b.title.toLocaleUpperCase('tr-TR'); d.setAttribute('textLength', '76'); d.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    $('#belgeGovde').innerHTML = `<b>${b.title}</b> eserini okuyup tüm durakları başarıyla tamamladı.`;
    $('#belgeDurak').innerHTML = `<b>${lv.durak}</b> durak`; $('#belgeAdim').innerHTML = `<b>${lv.durak * 5}</b> adım`;
    $('#kpiDurak').textContent = `/ ${lv.durak}`;
    $$('[data-kitap-ad]').forEach(el => { el.textContent = b.title; });
  }

  /* açık kitap */
  const oda = $('#ust');
  function ac() {
    const b = BOOKS[secili], lv = LV[LEVEL[b.id]];
    $('#spread').style.setProperty('--c', C[secili]);
    $('#kapakResim').src = cover(b); $('#solResim').src = cover(b);
    $('#solMetin').textContent = OPENING[b.id];
    $('#kartBaslik').textContent = b.title; $('#kartYazar').textContent = b.author;
    $('#kartOzgun').hidden = !b.original;
    $('#kartSeviye').textContent = lv.ad; $('#kartDurak').textContent = `${lv.durak} durak`;
    $('#kartOzet').textContent = b.desc;
    $('#basla').setAttribute('aria-label', `${b.title} ile maceraya başla`);
    oda.classList.add('okuyor'); $('#acik').setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#kapat').focus({ preventScroll: true }), 500);
  }
  function kapat(odak = true) {
    oda.classList.remove('okuyor'); $('#acik').setAttribute('aria-hidden', 'true');
    if (odak) $(`.raf .kitap[data-i="${secili}"]`).focus({ preventScroll: true });
  }
  raf.addEventListener('click', e => {
    const k = e.target.closest('.kitap'); if (!k) return;
    const i = +k.dataset.i; i === secili ? ac() : sec(i);
  });
  $('#dolap').addEventListener('click', e => { const k = e.target.closest('.kitap'); if (k) sec(+k.dataset.i); });
  function okTuslari(kap) {
    kap.addEventListener('keydown', e => {
      const ks = $$('.kitap', kap), n = ks.length, at = ks.findIndex(k => +k.dataset.i === secili);
      let j = at < 0 ? 0 : at;
      if (e.key === 'ArrowRight') j = (j + 1) % n; else if (e.key === 'ArrowLeft') j = (j - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1; else return;
      e.preventDefault(); sec(+ks[j].dataset.i); ks[j].focus({ preventScroll: true });
    });
  }
  okTuslari(raf); $$('.raf2').forEach(okTuslari);
  $('#kapat').addEventListener('click', () => kapat());
  $('#basla').addEventListener('click', () => kapat(false));   // bağlantı #yolculuk'a kaydırır
  $('#secimAc').addEventListener('click', () => setTimeout(ac, reduce ? 0 : 650));
  addEventListener('keydown', e => { if (e.key === 'Escape' && oda.classList.contains('okuyor')) kapat(); });

  /* gece / gündüz (yalnız oda) */
  const yildizHTML = n => Array.from({ length: n }, (_, k) => `<i style="left:${(8 + ((k * 37) % 84)).toFixed(1)}%;top:${(4 + ((k * 53) % 38)).toFixed(1)}%;animation-delay:${(k % 7) * .4}s"></i>`).join('');
  $('.oda .yildiz').innerHTML = yildizHTML(22);
  const modBtn = $('#mod');
  function gece(on) {
    document.body.classList.toggle('gece-mod', on);
    modBtn.setAttribute('aria-pressed', String(on));
    modBtn.setAttribute('aria-label', on ? 'Gündüz moduna geç' : 'Gece moduna geç');
    try { localStorage.setItem('okumino-gece', on ? '1' : '0'); } catch (e) {}
  }
  modBtn.addEventListener('click', () => gece(!document.body.classList.contains('gece-mod')));
  try { if (localStorage.getItem('okumino-gece') === '1') gece(true); } catch (e) {}

  /* hero sahnesini ekrana sığdır */
  const sahne = $('#sahne');
  function olcek() {
    const s = Math.min(1, (innerWidth - 24) / sahne.offsetWidth, (innerHeight - 250) / 470);
    sahne.style.setProperty('--olcek', Math.max(.3, s).toFixed(3));
  }
  addEventListener('resize', olcek); olcek();

  /* nav: oda bitince kâğıda döner */
  const nav = $('#nav');
  const navAyar = () => nav.classList.toggle('dolu', scrollY > innerHeight - 90);
  addEventListener('scroll', navAyar, { passive: true }); navAyar();

  /* görünce oynat: yol kartları, panel çubukları, damga */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('gorundu'); io.unobserve(e.target); } }), { threshold: .25 });
  $$('.yolculuk, .durak-bolum, .sinif').forEach(el => io.observe(el));
  const damgaIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('damgalandi'); damgaIO.unobserve(e.target); } }), { threshold: .6 });
  if (reduce) damgaIO.observe($('#pasaportAlan'));   // hareket açıkken damgayı gezgin kitap basar

  /* belge */
  const adGir = $('#adGir'), belgeAd = $('#belgeAd');
  adGir.addEventListener('input', () => { belgeAd.textContent = adGir.value.trim() || 'Öğrencinin adı'; });
  let s2 = 42; const r2 = () => ((s2 = (s2 * 16807) % 2147483647) / 2147483647);
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#3A1F2B"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#FFFBF5"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#3A1F2B"/>`;
  let q = '';
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    if (!inF && r2() > .52) q += `<rect x="${x}" y="${y}" width="1" height="1" fill="#3A1F2B"/>`;
  }
  $('#qr').innerHTML = q + finder(0, 0) + finder(14, 0) + finder(0, 14);

  /* SSS */
  const SSS = [
    ['Okumino hangi yaş grubu için?', '1–8. sınıf öğrencileri için. Minik (1–2), Kâşif (3–5) ve Usta (6–8) seviyelerinin her birinde farklı kitaplar yer alır; çocuk seviyesine uygun eserler arasından seçer.'],
    ['Eserler telifli mi?', 'Patikalar iki tür eserden oluşur: telif süresi dolmuş (kamu malı) sevilen eserler ve Okumino ekibinin yazdığı özgün hikâyeler. Uyarlamalar, seslendirmeler ve görseller de Okumino ekibi tarafından özgün olarak hazırlanır.'],
    ['Müfredatla bağlantısı var mı?', 'Var, ama çocuğun karşısına çıkmaz. Her adım arka planda Türkçe dersi kazanımları ve okuma becerileriyle eşleştirilir; öğretmen raporlarında bu eşleşme görünür.'],
    ['Hangi cihazlarda çalışır?', 'Tablet, telefon ve bilgisayarda tarayıcı üzerinden çalışır. Sınıf tahtasında ortak okuma için de kullanılabilir.'],
    ['Okuma belgesi nasıl kazanılır?', 'Patikadaki tüm duraklar tamamlanıp final aşamasında başarı eşiği geçildiğinde, öğrencinin adının yazdığı ve QR kodla doğrulanabilen belge oluşturulur.']
  ];
  // "acik" sınıfı hero'daki açık kitap katmanına ait; SSS "acildi" kullanır
  $('#sssListe').innerHTML = SSS.map((f, i) => `<div class="sa${i === 0 ? ' acildi' : ''}"><button type="button" aria-expanded="${i === 0}">${f[0]}<i aria-hidden="true">+</i></button><p>${f[1]}</p></div>`).join('');
  $$('.sa button').forEach(b => b.addEventListener('click', () => {
    const sa = b.parentElement, ac2 = !sa.classList.contains('acildi');
    $$('.sa').forEach(x => { x.classList.toggle('acildi', false); $('button', x).setAttribute('aria-expanded', 'false'); });
    if (ac2) { sa.classList.add('acildi'); b.setAttribute('aria-expanded', 'true'); }
  }));

  /* form (henüz arka uç yok) */
  $('#form').addEventListener('submit', e => { e.preventDefault(); $('.tamam', e.target).hidden = false; $('button[type=submit]', e.target).hidden = true; });

  sec(0);

  /* Gezgin kitap: seçilen kitap kaydırdıkça raftan masaya, durağa ve pasaporta gider; sonunda damga olur.
     Konum kaydırmaya bağlı (bir kez tetiklenen animasyon değil); sy, scrollY'nin yumuşatılmış kopyası. */
  if (reduce) return;
  document.documentElement.classList.add('js-gez');
  const gez = $('#gezgin');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const sine = t => .5 - Math.cos(Math.PI * t) / 2;
  let duraklar = [], sy = scrollY, kare = 0;
  gezYerlesim = function () {
    const hedef = [$(`.raf .kitap[data-i="${secili}"] .on`), $('#yolKitap'), $('#durakKitap'), $('#damgaHedef')];
    const vh = innerHeight;
    duraklar = hedef.map((el, k) => {
      let r = el.getBoundingClientRect();
      // damga basılmadan önce scale(2.4) ile büyük durur; ölçüyü dönüşümsüz kutudan al
      if (k === 3) { const p = el.parentElement.getBoundingClientRect(); r = { left: p.left + el.offsetLeft, top: p.top + el.offsetTop, width: el.offsetWidth, height: el.offsetHeight }; }
      const x = r.left + scrollX, y = r.top + scrollY;
      return { x, y, w: r.width, h: k === 3 ? r.width * 1.5 : r.height, at: k === 0 ? 0 : Math.max(0, y + r.height / 2 - vh / 2) };
    });
    duraklar[3].y -= duraklar[3].w * .25;
    ciz();
  };
  function ciz() {
    if (!duraklar.length) return;
    const y = sy, okuyor = oda.classList.contains('okuyor');
    let i = 0;
    while (i < duraklar.length - 2 && y >= duraklar[i + 1].at) i++;
    const A = duraklar[i], B = duraklar[i + 1];
    const e = sine(smooth(.06, .94, clamp((y - A.at) / Math.max(1, B.at - A.at))));
    const yon = i % 2 ? -1 : 1, kavis = Math.sin(Math.PI * e);
    const son = i === duraklar.length - 2;
    const tw = A.w + (B.w - A.w) * e, th = A.h + (B.h - A.h) * e;
    const olc = son ? 1 - .7 * smooth(.55, 1, e) : 1, w = tw * olc, h = th * olc;
    const x = A.x + (B.x - A.x) * e + kavis * 80 * yon + (tw - w) / 2, yy = A.y + (B.y - A.y) * e - kavis * 30 + (th - h) / 2;
    gez.style.width = w + 'px'; gez.style.height = h + 'px';
    gez.style.transform = `translate3d(${x}px,${yy}px,0) rotate(${kavis * 10 * yon + (son ? e * -12 : 0)}deg)`;
    gez.style.opacity = son ? Math.min(1, 1 - smooth(.06, .2, e) + smooth(.62, .76, e)) * (1 - smooth(.86, .98, e)) : 1;
    const rafta = y <= 4 || okuyor;
    gez.style.visibility = rafta ? 'hidden' : 'visible';
    document.body.classList.toggle('gezgin-yolda', !rafta);
    if (son && e > .95) $('#pasaportAlan').classList.add('damgalandi');
  }
  function dongu() {
    const d = scrollY - sy;
    sy = Math.abs(d) < .4 ? scrollY : sy + d * .22;
    ciz();
    kare = Math.abs(scrollY - sy) > .4 ? requestAnimationFrame(dongu) : 0;
  }
  addEventListener('scroll', () => { if (!kare) kare = requestAnimationFrame(dongu); }, { passive: true });
  addEventListener('resize', gezYerlesim);
  addEventListener('load', gezYerlesim);
  document.fonts && document.fonts.ready.then(gezYerlesim);
  setTimeout(gezYerlesim, 800);
})();
