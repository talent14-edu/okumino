/* Okumino A · durak oynatıcısı. Seçilen kitabın 1. durağı: Tahmin et, Dinle, Kelime oyunu, İzle, Anla ve üret.
   İçerik tanıtım örneğidir; klasiklerin bölümleri Okumino'nun kendi kısa anlatımıdır (kamu malı eserlerin olay örgüsüne sadık).
   Sesli okuma yok: çocuk dinler, izler, oynar, seçer ve yazar. Dinle adımı tarayıcının Türkçe sesini kullanır, yoksa yazıyı tempoyla vurgular. */
(() => {
  const D = {
    pinokyo: {
      tahmin: ['Gepetto Usta konuşan odundan ne yapacak?', ['Bir kukla', 'Bir sandalye', 'Bir oyuncak tren'], 0],
      metin: 'Kiraz Usta’nın atölyesindeki bir odun parçası birden konuşmaya başladı. Korkan usta, odunu arkadaşı Gepetto’ya verdi. Gepetto odundan bir kukla yonttu ve adını Pinokyo koydu. Kukla daha yürümeyi yeni öğrenmişti ki kapıdan fırlayıp sokağa kaçtı!',
      kelime: [['usta', 'İşini çok iyi bilen kişi'], ['yontmak', 'Tahtayı keserek şekil vermek'], ['kukla', 'Elle ya da iple oynatılan oyuncak']],
      sahne: ['Gepetto tezgâhının başında.', 'Talaşlar uçuşuyor, odun gülümsüyor.', 'Pinokyo ilk adımını atıyor ve kapıya koşuyor!'],
      anla: ['Pinokyo yapılır yapılmaz ne yaptı?', ['Sokağa kaçtı', 'Uyudu', 'Şarkı söyledi'], 0],
      uret: 'Pinokyo’ya evden çıkmadan önce uyacağı bir kural yaz.'
    },
    heidi: {
      tahmin: ['Heidi dağdaki kulübede kiminle yaşayacak?', ['Dedesiyle', 'Bir çobanla', 'Tek başına'], 0],
      metin: 'Teyzesi küçük Heidi’yi dağın tepesine, dedesinin yanına getirdi. Dede yalnız yaşamayı seven, az konuşan bir adamdı. Heidi kulübeye girer girmez her köşeyi merakla gezdi. Samanlıkta kendine yumuşacık bir yatak yaptı. Küçük pencereden vadiyi ve yıldızları görebiliyordu.',
      kelime: [['otlak', 'Hayvanların otladığı yeşil alan'], ['kulübe', 'Küçük, basit ev'], ['keçi', 'Dağlarda gezmeyi seven, sütü için beslenen hayvan']],
      sahne: ['Heidi teyzesiyle dağ yolunu tırmanıyor.', 'Dede kulübenin önünde, kaşları çatık.', 'Heidi samanlıktaki pencereden yıldızlara bakıyor.'],
      anla: ['Heidi yatağını nereye yaptı?', ['Samanlığa', 'Mutfağa', 'Ahıra'], 0],
      uret: 'Dede önce neden az konuşuyordu? Tek cümleyle anlat.'
    },
    alice: {
      tahmin: ['Alice beyaz tavşanın peşinden gidince ne olacak?', ['Bir deliğe düşecek', 'Eve dönecek', 'Uykuya dalacak'], 0],
      metin: 'Alice ablasının yanında sıkılmış oturuyordu. Birden yelekli, cep saatli beyaz bir tavşan koşarak geçti. “Eyvah, geç kalacağım!” diyordu. Alice merakla peşinden koştu ve bir tavşan deliğine atladı. Delik bir kuyu gibi derindi. Alice yavaş yavaş düşerken raflardaki kavanozlara bakıyordu.',
      kelime: [['delik', 'Toprakta açılmış boşluk'], ['anahtar', 'Kapıyı açan küçük alet'], ['şişe', 'İçine sıvı konan kap']],
      sahne: ['Çimenlerde sıkılmış Alice.', 'Saatine bakan beyaz tavşan.', 'Alice raflarla dolu kuyudan aşağı süzülüyor.'],
      anla: ['Tavşan neden koşuyordu?', ['Geç kalıyordu', 'Acıkmıştı', 'Korkmuştu'], 0],
      uret: 'Sen küçülseydin odanda neler görürdün? Üçünü yaz.'
    },
    oz: {
      tahmin: ['Kasırga Dorothy’nin evini nereye götürecek?', ['Uzak, büyülü bir ülkeye', 'Komşunun bahçesine', 'Denizin ortasına'], 0],
      metin: 'Dorothy, Kansas’ta Henry Amca, Em Teyze ve köpeği Toto ile yaşıyordu. Bir gün büyük bir kasırga çıktı. Ev havalandı, döne döne gökyüzüne yükseldi. Ev saatlerce uçtu, sonra yumuşakça yere kondu. Dorothy kapıyı açınca rengârenk çiçekler ve küçük boylu Munchkinler gördü.',
      kelime: [['kasırga', 'Döne döne esen çok güçlü rüzgâr'], ['gümüş ayakkabı', 'Dorothy’ye verilen büyülü ayakkabılar'], ['sarı tuğla', 'Zümrüt Şehir’e giden yolun taşları']],
      sahne: ['Gri Kansas ovası, gökte kara bir bulut.', 'Ev kasırgada dönüyor, Toto havlıyor.', 'Kapı açılıyor: rengârenk bir ülke!'],
      anla: ['Dorothy’nin köpeğinin adı ne?', ['Toto', 'Tarçın', 'Pamuk'], 0],
      uret: 'Dorothy yanına üç eşya alsa hangilerini seçerdin? Nedenini yaz.'
    },
    'beyaz-dis': {
      tahmin: ['İnde doğan kurt yavrusu dışarıda ilk ne öğrenecek?', ['Dünyanın çok büyük olduğunu', 'Uçmayı', 'Yüzmeyi'], 0],
      metin: 'Gri yavru karanlık bir inde doğdu. Bütün dünyası annesi, kardeşleri ve inin ağzından gelen ışıktı. Bir gün ışığa doğru yürüdü ve dışarı çıktı. Gördüğü her şey kocamandı. Yamaçtan yuvarlandı, bir kuş yuvası buldu, bir gelinciğin saldırısına uğradı. O gün yaşamanın kurallarını öğrenmeye başladı.',
      kelime: [['in', 'Hayvanların yaşadığı oyuk ya da mağara'], ['iz', 'Yerde kalan ayak ya da pati şekli'], ['sürü', 'Birlikte yaşayan hayvan topluluğu']],
      sahne: ['Karanlık bir in, ağzında bir ışık.', 'Yavru ilk kez dışarı adım atıyor.', 'Yamaçtan yuvarlanıp kocaman vadiyi görüyor.'],
      anla: ['Yavru inden çıkınca dünyayı nasıl buldu?', ['Kocaman', 'Küçücük', 'Kapkaranlık'], 0],
      uret: 'Yavru ilk gün neler öğrendi? Üç olayı sırayla yaz.'
    },
    define: {
      tahmin: ['Yaşlı kaptanın sandığında ne saklı olabilir?', ['Bir define haritası', 'Bir kedi', 'Bir somun ekmek'], 0],
      metin: 'Jim, ailesiyle deniz kıyısındaki Amiral Benbow Hanı’nı işletiyordu. Bir gün yüzü yara izli, yaşlı bir denizci geldi. Yanında ağır bir deniz sandığı vardı. Her gün tepeden denizi gözlüyor, tek bacaklı bir adamdan korkuyordu. Jim’den o adamı görürse haber vermesini istedi.',
      kelime: [['han', 'Yolcuların konakladığı eski tip otel'], ['sandık', 'Kapaklı, büyük kutu'], ['harita', 'Bir yerin kâğıda çizilmiş resmi']],
      sahne: ['Fırtınalı kıyıda Amiral Benbow Hanı.', 'Yaşlı kaptan sandığını içeri sürüklüyor.', 'Sandığın dibinde katlanmış bir harita.'],
      anla: ['Yaşlı denizci kimden korkuyordu?', ['Tek bacaklı bir adamdan', 'Jim’den', 'Bir köpekten'], 0],
      uret: 'Kendi define haritanı düşün: üç işareti ve çarpının yerini yaz.'
    },
    pollyanna: {
      tahmin: ['“Mutluluk oyunu” nasıl oynanıyor olabilir?', ['Her şeyde sevinecek bir şey bularak', 'Koşu yarışı yaparak', 'Saklambaçla'], 0],
      metin: 'Pollyanna babasını kaybedince Polly Teyzesinin yanına geldi. Teyzesi onu tavan arasındaki küçük, eşyasız bir odaya yerleştirdi. Pollyanna önce üzüldü. Sonra pencereden ağaçları ve gökyüzünü gördü. “Ayna yok, öyleyse çillerimi de görmem!” dedi. Babasından öğrendiği oyunu oynuyordu: her şeyde sevinecek bir şey bulmak.',
      kelime: [['tavan arası', 'Çatının altındaki oda'], ['teyze', 'Annenin kız kardeşi'], ['oyun', 'Kuralları olan eğlenceli etkinlik']],
      sahne: ['Büyük, sessiz bir ev.', 'Tavan arasındaki boş oda.', 'Pollyanna pencereyi açıp gülümsüyor.'],
      anla: ['Pollyanna aynası olmadığına neden sevindi?', ['Çillerini görmeyecekti', 'Odası büyüyecekti', 'Teyzesi kızmayacaktı'], 0],
      uret: 'Bugün sevindiğin bir şeyi bul, Pollyanna gibi anlat.'
    },
    mino: {
      tahmin: ['Gece parlayan tohumdan ne çıkacak?', ['Işıklı bir filiz', 'Bir kurbağa', 'Bir top'], 0],
      metin: 'Mino bir gece bahçede minicik, parlayan bir tohum buldu. Tohum avucunda yıldız gibi ışıldıyordu. Mino onu saksıya ekti ve üstüne biraz su döktü. Sabah uyandığında saksıdan ince, gümüş renkli bir filiz çıkmıştı. Filiz her gece biraz daha uzuyor, gökyüzüne doğru uzanıyordu.',
      kelime: [['tohum', 'Bitkinin içinden çıktığı küçük tane'], ['filiz', 'Topraktan yeni çıkan körpe bitki'], ['ışık', 'Karanlığı aydınlatan şey']],
      sahne: ['Gece, bahçede parlayan bir nokta.', 'Mino tohumu saksıya ekiyor.', 'Gümüş filiz yıldızlara uzanıyor.'],
      anla: ['Mino tohumu nereye ekti?', ['Saksıya', 'Denize', 'Cebine'], 0],
      uret: 'Tohum büyüsün diye Mino’ya üç öneri ver.'
    },
    kelimeler: {
      tahmin: ['Orman neden birden sessizleşmiş olabilir?', ['Kelimeler kaybolmuş', 'Kış gelmiş', 'Herkes uyumuş'], 0],
      metin: 'Bir sabah Fısıltı Ormanı’nda kuşlar şakımak istedi ama sesleri çıkmadı. Sincap “Günaydın” demek istedi, ağzından tek kelime çıkmadı. Kelimeler yapraklar gibi havalanıp uzaklara uçmuştu. Yaşlı baykuş, “Onları ancak özleyen biri geri getirebilir,” dedi. Mino sırt çantasını aldı ve yola çıktı.',
      kelime: [['yankı', 'Sesin bir yere çarpıp geri gelmesi'], ['fısıltı', 'Çok alçak sesle konuşma'], ['şarkı', 'Ezgiyle söylenen söz']],
      sahne: ['Sessiz bir orman, ağzı açık kuşlar.', 'Kelimeler yaprak gibi uçuşuyor.', 'Mino sırt çantasıyla yola çıkıyor.'],
      anla: ['Baykuşa göre kelimeleri kim geri getirebilir?', ['Onları özleyen biri', 'En hızlı koşan', 'En yaşlı ağaç'], 0],
      uret: 'Ormana geri getirmek istediğin üç kelimeyi seç, nedenini yaz.'
    },
    bulut: {
      tahmin: ['Bulutun yakaladığı mektup kime gidiyor olabilir?', ['Uzaktaki bir arkadaşa', 'Ay’a', 'Bir balığa'], 0],
      metin: 'Pofuduk adında küçük bir bulut, rüzgârla oynarken havada süzülen bir zarf yakaladı. Zarfın üstünde “Dağın ardındaki deniz fenerine” yazıyordu. Pofuduk mektubu sahibine götürmeye karar verdi. Yolda kuşlara yol sordu, rüzgârla yarıştı, yağmura dönüşmemek için dikkat etti.',
      kelime: [['mektup', 'Birine yazılıp gönderilen yazı'], ['zarf', 'Mektubun konduğu kâğıt kılıf'], ['rüzgâr', 'Havanın hareket etmesi']],
      sahne: ['Gökyüzünde uçuşan bir zarf.', 'Pofuduk zarfı yakalıyor.', 'Uzakta göz kırpan bir deniz feneri.'],
      anla: ['Mektup nereye gidiyordu?', ['Deniz fenerine', 'Okula', 'Fırına'], 0],
      uret: 'Bir arkadaşına üç cümlelik bir mektup yaz.'
    }
  };
  const ADIMLAR = ['Tahmin et', 'Dinle', 'Kelime oyunu', 'İzle', 'Anla ve üret'];
  const $ = (s, r = document) => r.querySelector(s);
  const karistir = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
  const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const dlg = document.createElement('dialog');
  dlg.className = 'oyun'; dlg.setAttribute('aria-labelledby', 'oyunBaslik');
  dlg.innerHTML = `<div class="oyun-ust"><img class="oyun-kapak" alt=""><div><p class="oyun-k" id="oyunBaslik"></p><ol class="oyun-ilerleme" aria-label="Adımlar"></ol></div>
      <button class="oyun-kapat" type="button" aria-label="Kapat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
    <div class="oyun-govde" aria-live="polite"></div>
    <div class="oyun-alt"><button class="oyun-geri" type="button">← Geri</button><button class="btn oyun-ileri" type="button">İleri →</button></div>`;
  document.body.appendChild(dlg);
  const govde = $('.oyun-govde', dlg), ileri = $('.oyun-ileri', dlg), geri = $('.oyun-geri', dlg);
  let kitap = null, veri = null, adim = 0, durum = {};

  function ac(k, basla = 0) {
    kitap = k; veri = D[k.id]; durum = { tamam: new Set() }; adim = basla;
    $('.oyun-kapak', dlg).src = `img/covers/${k.id}.webp`;
    $('#oyunBaslik', dlg).textContent = `${k.title} · 1. durak`;
    ciz(); dlg.showModal();
  }
  function kapat() { speechSynthesis && speechSynthesis.cancel(); dlg.close(); }
  $('.oyun-kapat', dlg).addEventListener('click', kapat);
  dlg.addEventListener('cancel', () => speechSynthesis && speechSynthesis.cancel());
  dlg.addEventListener('click', e => { if (e.target === dlg) kapat(); });
  geri.addEventListener('click', () => { if (adim > 0) { adim--; ciz(); } });
  ileri.addEventListener('click', () => { if (adim < 5) { adim++; ciz(); } else kapat(); });

  function tamamla(i) { durum.tamam.add(i); ilerlemeCiz(); ileri.disabled = false; }
  function ilerlemeCiz() {
    $('.oyun-ilerleme', dlg).innerHTML = ADIMLAR.map((a, i) => `<li class="${i === adim ? 'simdi' : ''} ${durum.tamam.has(i) ? 'bitti' : ''}"><button type="button" data-a="${i}" aria-label="${i + 1}. adım: ${a}${durum.tamam.has(i) ? ', tamamlandı' : ''}">${durum.tamam.has(i) ? '✓' : i + 1}</button><span>${a}</span></li>`).join('');
    dlg.querySelectorAll('.oyun-ilerleme button').forEach(b => b.addEventListener('click', () => { adim = +b.dataset.a; ciz(); }));
  }
  function ciz() {
    speechSynthesis && speechSynthesis.cancel();
    ilerlemeCiz();
    geri.hidden = adim === 0 || adim === 5;
    ileri.textContent = adim === 4 ? 'Durağı bitir ✓' : adim === 5 ? 'Kitaplığa dön' : 'İleri →';
    ileri.disabled = adim < 5 && !durum.tamam.has(adim);
    [tahmin, dinle, kelime, izle, anla, final][adim]();
    govde.scrollTop = 0;
    const h = govde.querySelector('h3'); h && h.focus({ preventScroll: true });
  }
  const baslik = (no, faz, ad, alt) => `<p class="oyun-faz"><b>${no}</b> ${faz}</p><h3 tabindex="-1">${ad}</h3>${alt ? `<p class="oyun-alt-yazi">${alt}</p>` : ''}`;

  function secenekler(soru, kok, sonra) {
    const [q, s, d] = soru, sira = karistir(s.map((t, i) => [t, i]));
    govde.insertAdjacentHTML('beforeend', `<p class="oyun-soru">${esc(q)}</p><div class="secenek">${sira.map(([t, i]) => `<button type="button" data-i="${i}">${esc(t)}</button>`).join('')}</div><p class="geri-bildirim" role="status"></p>`);
    govde.querySelectorAll('.secenek button').forEach(b => b.addEventListener('click', () => sonra(+b.dataset.i, b, d)));
  }

  function tahmin() {
    govde.innerHTML = baslik(1, 'önce', 'Tahmin et', 'Kapağa bak. Sence ne olacak? Yanlış tahmin yok, dinleyince göreceğiz.');
    govde.insertAdjacentHTML('beforeend', `<img class="oyun-buyuk-kapak" src="img/covers/${kitap.id}.webp" alt="${esc(kitap.title)} kapağı">`);
    secenekler(veri.tahmin, null, (i, b) => {
      durum.tahmin = i;
      govde.querySelectorAll('.secenek button').forEach(x => x.classList.toggle('secili', x === b));
      $('.geri-bildirim', govde).textContent = 'Tahminini not ettim! Şimdi dinleyip kontrol edelim.';
      tamamla(0);
    });
    if (durum.tahmin != null) govde.querySelector(`.secenek button[data-i="${durum.tahmin}"]`).classList.add('secili');
  }

  function dinle() {
    govde.innerHTML = baslik(2, 'sırası', 'Dinle', 'Hikâyeyi dinle. Duyduğun kelime yazıda parlar.');
    const kelimeler = veri.metin.split(' ');
    govde.insertAdjacentHTML('beforeend', `<button class="dinle-btn" type="button"><span aria-hidden="true">▶</span> Dinle</button>
      <p class="dinle-metin">${kelimeler.map((w, i) => `<span data-w="${i}">${esc(w)}</span>`).join(' ')}</p><p class="geri-bildirim" role="status"></p>`);
    const btn = $('.dinle-btn', govde), spans = [...govde.querySelectorAll('.dinle-metin span')];
    const isaretle = i => spans.forEach((s, k) => { s.classList.toggle('su', k === i); s.classList.toggle('gecti', k < i); });
    const bitir = () => {
      isaretle(spans.length); btn.innerHTML = '<span aria-hidden="true">↻</span> Tekrar dinle';
      const t = veri.tahmin, ok = durum.tahmin === t[2];
      $('.geri-bildirim', govde).textContent = durum.tahmin == null ? `Cevap: ${t[1][t[2]]}.` : ok ? `Tahminin doğru çıktı: ${t[1][t[2]]}!` : `Hikâyede şöyle oldu: ${t[1][t[2]]}. Tahmin etmek de okumanın parçası.`;
      tamamla(1);
    };
    btn.addEventListener('click', () => {
      const ses = window.speechSynthesis && speechSynthesis.getVoices().find(v => /^tr/i.test(v.lang));
      if (ses) {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(veri.metin); u.lang = 'tr-TR'; u.voice = ses; u.rate = .92;
        const baslar = []; let p = 0; kelimeler.forEach(w => { baslar.push(p); p += w.length + 1; });
        u.onboundary = e => { if (e.name === 'word' || e.charIndex != null) { let i = baslar.findIndex((b, k) => e.charIndex >= b && (k === baslar.length - 1 || e.charIndex < baslar[k + 1])); isaretle(i); } };
        u.onend = bitir; speechSynthesis.speak(u);
      } else {
        // Türkçe ses yoksa yazıyı dinleme temposunda vurgula
        let i = 0; btn.disabled = true;
        const t = setInterval(() => { isaretle(i++); if (i > spans.length) { clearInterval(t); btn.disabled = false; bitir(); } }, 380);
      }
    });
  }

  function kelime() {
    govde.innerHTML = baslik(3, 'sırası', 'Kelime oyunu', 'Önce bir kelimeye, sonra onun anlamına dokun.');
    const k = veri.kelime, anlam = karistir(k.map((x, i) => [x[1], i]));
    govde.insertAdjacentHTML('beforeend', `<div class="eslestir"><div class="sutun">${k.map((x, i) => `<button type="button" class="kel" data-i="${i}">${esc(x[0])}</button>`).join('')}</div>
      <div class="sutun">${anlam.map(([t, i]) => `<button type="button" class="anl" data-i="${i}">${esc(t)}</button>`).join('')}</div></div><p class="geri-bildirim" role="status"></p>`);
    let sec = null, eslesen = 0; const fb = $('.geri-bildirim', govde);
    govde.querySelectorAll('.kel').forEach(b => b.addEventListener('click', () => {
      if (b.classList.contains('ok')) return;
      govde.querySelectorAll('.kel').forEach(x => x.classList.remove('secili')); b.classList.add('secili'); sec = b;
    }));
    govde.querySelectorAll('.anl').forEach(b => b.addEventListener('click', () => {
      if (!sec || b.classList.contains('ok')) { if (!sec) fb.textContent = 'Önce soldan bir kelime seç.'; return; }
      if (b.dataset.i === sec.dataset.i) {
        b.classList.add('ok'); sec.classList.add('ok'); sec.classList.remove('secili'); sec = null; eslesen++;
        fb.textContent = eslesen === k.length ? 'Harika! Üç kelimeyi de buldun.' : 'Doğru eşleşme!';
        if (eslesen === k.length) tamamla(2);
      } else { b.classList.add('yanlis'); fb.textContent = 'Bir daha dene.'; setTimeout(() => b.classList.remove('yanlis'), 500); }
    }));
    if (durum.tamam.has(2)) { govde.querySelectorAll('.kel,.anl').forEach(b => b.classList.add('ok')); fb.textContent = 'Bu adımı tamamladın.'; }
  }

  function izle() {
    govde.innerHTML = baslik(4, 'sırası', 'İzle', 'Kilit sahne kısa bir animasyonla.');
    govde.insertAdjacentHTML('beforeend', `<div class="sahne-ekran"><img src="img/covers/${kitap.id}.webp" alt=""><p class="altyazi"></p>
      <button class="oynat" type="button" aria-label="Sahneyi oynat"><span aria-hidden="true">▶</span></button></div><p class="geri-bildirim" role="status"></p>`);
    const ekran = $('.sahne-ekran', govde), alt = $('.altyazi', govde), btn = $('.oynat', govde);
    btn.addEventListener('click', () => {
      btn.hidden = true; ekran.classList.remove('oynuyor'); void ekran.offsetWidth; ekran.classList.add('oynuyor');
      veri.sahne.forEach((s, i) => setTimeout(() => { alt.textContent = s; alt.classList.remove('gir'); void alt.offsetWidth; alt.classList.add('gir'); }, i * 3000));
      setTimeout(() => { btn.hidden = false; btn.setAttribute('aria-label', 'Tekrar izle'); btn.innerHTML = '<span aria-hidden="true">↻</span>'; $('.geri-bildirim', govde).textContent = 'Sahneyi izledin!'; tamamla(3); }, 9200);
    });
  }

  function anla() {
    govde.innerHTML = baslik(5, 'sonra', 'Anla ve üret', 'Önce soruyu cevapla, sonra kendi cümleni yaz.');
    secenekler(veri.anla, null, (i, b, d) => {
      const fb = $('.geri-bildirim', govde);
      if (i === d) {
        b.classList.add('ok'); govde.querySelectorAll('.secenek button').forEach(x => x.disabled = true);
        fb.textContent = 'Doğru! Şimdi sıra sende.';
        $('.uret', govde).hidden = false; $('.uret textarea', govde).focus();
      } else { b.classList.add('yanlis'); fb.textContent = 'Hikâyeyi hatırla, bir daha dene.'; setTimeout(() => b.classList.remove('yanlis'), 500); }
    });
    govde.insertAdjacentHTML('beforeend', `<label class="uret" hidden><span>${esc(veri.uret)}</span><textarea rows="3" maxlength="300" placeholder="Buraya yaz…"></textarea><small>Yazdıkların yalnız bu sayfada kalır.</small></label>`);
    const ta = $('.uret textarea', govde);
    ta.addEventListener('input', () => { if (ta.value.trim().length >= 8) tamamla(4); });
  }

  function final() {
    $('.oyun-ilerleme', dlg).innerHTML = ADIMLAR.map((a, i) => `<li class="bitti"><button type="button" disabled>✓</button><span>${a}</span></li>`).join('');
    govde.innerHTML = `<div class="final-ekran"><div class="final-damga" aria-hidden="true"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#FFFDF5" stroke="currentColor" stroke-width="6" stroke-dasharray="7 4"/><text x="50" y="47" text-anchor="middle">1. DURAK</text><text x="50" y="68" text-anchor="middle" class="t2">tamam ✓</text></svg></div>
      <img class="final-mino" src="img/mino_selam.webp" alt="">
      <h3 tabindex="-1">${esc(kitap.title)} · 1. durak tamamlandı!</h3><p>2. durağın kilidi açıldı. Patika boyunca her durak bir damga, son durakta okuma belgesi seni bekliyor.</p></div>`;
    document.dispatchEvent(new CustomEvent('okumino:durak-bitti', { detail: { id: kitap.id } }));
  }

  window.OkuminoDurak = { ac, var: id => !!D[id] };
})();
