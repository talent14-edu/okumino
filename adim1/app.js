(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const activityIcons = ['light_bulb', 'books', 'open_book', 'magnifier', 'microphone', 'clapper'];
  const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'okumino-pinokyo-first-step-v1';
  const libraryUrl = location.hostname.endsWith('github.io') ? '../a/' : '../site_a/index.html';
  const labels = ['Hayal et', 'Kelime sandığı', 'Hikâye zamanı', 'Dedektif Mino', 'Ses stüdyosu', 'Filmini kur'];
  const notes = ['Sence neler olabilir?', 'Her kelime bir ipucu.', 'Acele etme. Hikâye seni bekler.', 'Cevap, hikâyenin içinde.', 'Bu kez Gepetto’nun sesi sensin.', 'Hikâyeyi bir de sen anlat.'];
  const introChoices = [
    { text: 'Bir oyuncak', image: 'teddy', reply: 'Güzel fikir! Bakalım Gepetto’nun aklında ne var.' },
    { text: 'Küçük bir tekne', image: 'ship', reply: 'Bu tahta bir tekne olsa nerelere giderdi? Haydi hikâyeyi keşfedelim.' },
    { text: 'Bir kuş evi', image: 'house_garden', reply: 'Kuşlar buna sevinirdi! Peki Gepetto ne yapacak dersin?' }
  ];
  const words = [
    { word: 'Yontmak', hint: 'Bir şeyin biçimi değişiyor…', answers: ['Bir şeyi renk renk boyamak', 'Küçük parçalar keserek biçim vermek', 'Bir şeyi başka bir yere taşımak'], correct: 1, explanation: 'Gepetto, tahtadan ince parçalar çıkararak kuklaya biçim veriyor. İşte buna yontmak denir.' },
    { word: 'Talaş', hint: 'Tezgâhın altına bir bak.', answers: ['Tahta işlenirken çıkan küçük parçalar', 'Oyuncağın üzerine sürülen boya', 'Ustanın kullandığı küçük bir çekiç'], correct: 0, explanation: 'Yontulan tahtadan dökülen ince parçalar talaştır. Atölyenin zemininde birikiyorlar.' },
    { word: 'Ürkek', hint: 'Yeni bir şeyle karşılaşınca…', answers: ['Çok yorulmuş', 'Her şeye gülümseyen', 'Kolayca çekinen, biraz korkan'], correct: 2, explanation: 'Ürkek biri yeni bir şeye yaklaşırken çekinebilir. Sen hiç böyle hissettin mi?' }
  ];
  const story = `Gepetto, pencerenin önündeki tahta parçasını tezgâhına koydu. Ondan küçük bir kukla yapmayı düşünüyordu. Önce tahtanın üzerindeki pürüzleri düzeltti. Sonra yavaşça yontmaya başladı. İncecik talaşlar ayaklarının dibine dökülüyordu. Atölyede yalnızca bıçağın tahtaya değdiğinde çıkardığı ses duyuluyordu.

Kuklanın gözlerini bitirince Gepetto biraz geri çekildi. İki göz de ona bakıyordu. Başını sağa eğdi. Kuklanın bakışları da sağa döndü. Gepetto bir an durdu; kuklaya ürkek bir bakış attı. Pencereden giren ışığın kendisini şaşırttığını düşündü ve işine devam etti.

Ağzını yapmaya başladığında ince bir kahkaha duydu. Sesi pencerede değil, tam önündeydi. Bıçağını tezgâha bıraktı. Kukla gülmeye devam ediyordu.

“Daha seni bitirmedim bile!” dedi Gepetto. “Şimdiden bana gülüyorsun!”

Kukla sustu. Gepetto, onun ellerini tamamlamaya koyuldu. Sağ elini bitirir bitirmez kukla uzandı ve ustanın başındaki peruğu çekti. Gepetto şaşkınlıkla elini başına götürdü. Kukla ise peruğu kendi başına geçirmişti.

Gepetto önce kaşlarını çattı. Sonra karşısındaki komik görüntüye bakıp gülümsedi. Yıllardır bu küçük atölyede çalışıyordu; ama yaptığı hiçbir oyuncak daha önce böyle davranmamıştı.

Kuklanın ayakları henüz hazır değildi. Gepetto onu yeniden tezgâha oturttu. Bu kez kuklanın ellerini dikkatle izleyerek çalışıyordu. Kukla ise kapıya bakıyordu. Ayakları tamamlandığında yerinde duracak mıydı?`;
  const storyWords = story.split(/\s+/).filter(Boolean);
  const detective = [
    { question: 'Kahkaha nereden geliyordu?', answers: ['Pencereden', 'Tahta kukladan', 'Sokaktan geçen birinden'], correct: 1, hint: 'Gepetto ağzı yaparken ne olmuştu? Bir sonraki görevde kanıtını da bulacağız.', good: 'Evet, kahkahayı kukla atıyordu. Şimdi metinde bunun izini bulalım.' },
    { question: 'Hangi cümle Mino’nun yanıldığını gösteriyor?', answers: ['“Başını sağa eğdi.”', '“Sesi pencerede değil, tam önündeydi.”', '“Kukla ise kapıya bakıyordu.”'], correct: 1, hint: 'Sesin nereden geldiğini anlatan cümleyi ara.', good: 'İşte kanıtın! Cevabını hikâyedeki bir cümleyle destekledin.' }
  ];
  const scenes = [
    { id: 'eyes', label: 'Gözler hareket etti.', caption: 'Gepetto başını eğdi. Kuklanın gözleri de ona doğru döndü.' },
    { id: 'laugh', label: 'Bir kahkaha duyuldu.', caption: 'Kuklanın ağzı daha yeni bitmişti. Atölyede ince bir kahkaha duyuldu.' },
    { id: 'wig', label: 'Peruk el değiştirdi.', caption: 'Kukla, Gepetto’nun peruğunu çekip kendi başına geçirdi. Ne yaramazlık!' }
  ];
  const freshState = () => ({ stage: 0, furthest: 0, introChoice: null, vocabAnswers: [null, null, null], vocabIndex: 0, readOffset: 0, readDone: false, fontSize: innerWidth < 541 ? 20 : 22, detectAnswers: [null, null], detectPart: 0, mood: 'Şaşkın', readConfirmed: false, order: [], orderChecked: false, filmSeen: false });
  let state = freshState();
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && saved.version === 1) {
      const s = saved.state;
      if (s && Number.isInteger(s.stage) && s.stage >= 0 && s.stage <= 6 && Number.isInteger(s.furthest) && s.furthest >= s.stage && s.furthest <= 6 && Array.isArray(s.vocabAnswers) && s.vocabAnswers.length === 3 && s.vocabAnswers.every(v => v === null || [0, 1, 2].includes(v)) && Array.isArray(s.detectAnswers) && s.detectAnswers.length === 2 && s.detectAnswers.every(v => v === null || [0, 1, 2].includes(v)) && [0, 1, 2].includes(s.vocabIndex) && [0, 1].includes(s.detectPart) && [null, 0, 1, 2].includes(s.introChoice) && Array.isArray(s.order) && s.order.every(id => scenes.some(scene => scene.id === id)) && new Set(s.order).size === s.order.length && s.order.length <= 3) {
        state = { ...state, ...s, readOffset: Math.max(0, Math.min(storyWords.length - 1, Number(s.readOffset) || 0)), fontSize: Math.max(18, Math.min(26, Number(s.fontSize) || 22)), mood: ['Şaşkın', 'Meraklı', 'Biraz kızgın'].includes(s.mood) ? s.mood : 'Şaşkın' };
      }
    }
  } catch (_) { /* This lesson also works without browser storage. */ }
  const panel = $('#panel');
  let readingPages = [], readingPage = 0, paginateFrame = 0;
  let toastTimer, speechActive = false, filmTimer, filmMode = false, filmIndex = 0, filmPlaying = false;
  let recorder = null, micStream = null, recordingTimer = null, recordingSeconds = 0, recordingUrl = null, recordingBusy = false, captureGeneration = 0;
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, state })); } catch (_) {} };
  function toast(message) { const node = $('#toast'); node.textContent = message; node.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { node.hidden = true; }, 4500); }
  function answerButtons(answers, selected, action, correct = null, proof = false) {
    return answers.map((text, index) => `<button class="answer-button ${proof ? 'proof-button' : ''} ${selected === index ? (correct === null ? 'selected' : index === correct ? 'correct' : 'retry') : ''}" type="button" data-action="${action}" data-value="${index}" aria-pressed="${selected === index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${escape(text)}</span>${selected === index && (correct === null || index === correct) ? `<span class="answer-mark">${icon('check')}</span>` : ''}</button>`).join('');
  }
  function feedback(selected, correct, good, hint) { return selected === null ? '<p class="feedback" aria-live="polite"></p>' : `<p class="feedback ${selected === correct ? 'good' : 'hint'}" role="status">${escape(selected === correct ? good : hint)}</p>`; }

  function renderIntro() {
    return `<div class="screen intro-screen entering"><div class="mission-heading"><img src="assets/mino.webp" width="74" height="82" alt=""><div><span class="mission-kicker">HAYAL GÜCÜNÜ AÇ</span><h1 class="screen-title">Bir tahtadan neler olur?</h1><p>Gepetto’ya bir fikir ver. Sence ne yapmalı?</p></div><span class="mission-count">1<span>/6</span></span></div><div class="intro-layout"><div class="intro-art"><img src="assets/workshop.webp" width="1024" height="768" alt="Gepetto, atölyesinde bir tahta parçasına bakıyor. Masada küçük ahşap eşyalar var."><span class="picture-sticker"><img src="assets/icons/hammer.png" alt=""> Gepetto’nun atölyesi</span></div><div class="intro-copy"><div class="choice-heading"><img src="assets/icons/light_bulb.png" alt=""><h2>Sen olsan ne yapardın?</h2></div><div class="choice-list idea-list">${introChoices.map((choice,index)=>`<button class="answer-button idea-choice idea-${index} ${state.introChoice===index?'selected':''}" data-action="intro-choice" data-value="${index}" aria-pressed="${state.introChoice===index}"><img src="assets/icons/${choice.image}.png" width="58" height="58" alt=""><b>${choice.text}</b><span class="idea-check">${state.introChoice===index?icon('check'):''}</span></button>`).join('')}</div><div class="guide-feedback ${state.introChoice!==null?'has-choice':''}"><img src="assets/icons/${state.introChoice!==null?'speech':'thinking'}.png" width="34" height="34" alt=""><p class="feedback" aria-live="polite">${state.introChoice===null?'Burada doğru ya da yanlış yok. Merak ettiğin fikri seç!':escape(introChoices[state.introChoice].reply)}</p></div></div></div></div>`;
  }
  function renderWords() {
    const item = words[state.vocabIndex], selected = state.vocabAnswers[state.vocabIndex];
    return `<div class="screen word-screen entering"><div class="screen-heading"><p class="eyebrow"><img src="assets/icons/books.png" alt=""> KELİME SANDIĞI</p><span class="sub-progress">${state.vocabIndex + 1} / 3 kelime</span></div><div class="word-layout"><div class="word-card"><img class="word-picture" src="assets/icons/${['hammer','tree','thinking'][state.vocabIndex]}.png" alt="" width="90" height="90"><span class="word">${item.word}</span><span>${item.hint}</span></div><div class="task-copy"><h1 class="screen-title">Sence ne demek?</h1><div class="choice-list">${answerButtons(item.answers, selected, 'word-choice', item.correct)}</div>${feedback(selected, item.correct, item.explanation, 'Bir daha düşünelim. ' + item.hint)}</div></div><div class="quiet-rule">Bu kelimelere birazdan hikâyede rastlayacaksın.</div></div>`;
  }
  function renderReading() {
    return `<div class="screen reader-screen entering"><p class="eyebrow">03 · HİKÂYENİN İÇİNE GİR</p><div class="reader-toolbar"><h1 class="screen-title">Atölyedeki ilk sürpriz</h1><button class="text-tool" data-action="font-smaller" aria-label="Yazıyı küçült">A−</button><button class="text-tool" data-action="font-larger" aria-label="Yazıyı büyüt">A+</button><button class="text-tool" data-action="listen-page">${icon('sound')}<span>Dinle</span></button><button class="text-tool" data-action="dictionary">Kelimeler</button></div><div class="reader-layout"><div class="reader-page"><div id="readingCopy" class="reading-copy reading-prose" style="font-size:${state.fontSize}px" aria-live="off"></div><div class="page-controls"><button class="page-control" data-action="read-previous">${icon('back')} Önceki</button><span id="pageLabel" class="page-label"></span><button class="page-control" data-action="read-next">Sonraki ${icon('arrow')}</button></div></div><aside class="reader-aside"><img id="readingArt" src="assets/eyes.webp" alt="Gepetto, tahta kuklanın gözlerini merakla inceliyor."><span>Oku, hayal et.<br>Hikâyenin ritmi sana ait.</span></aside></div><p class="reader-note">Carlo Collodi’nin Pinokyo’sundan bu örnek için hazırlanmış uyarlama.</p></div>`;
  }
  function renderDetective() {
    const part = state.detectPart, item = detective[part], selected = state.detectAnswers[part];
    return `<div class="screen entering"><div class="screen-heading"><p class="eyebrow">04 · KÜÇÜK BİR DEDEKTİFLİK</p><span class="sub-progress">${part + 1} / 2 ipucu</span></div><div class="evidence-layout"><div class="evidence-picture"><img src="assets/laugh.webp" width="1024" height="768" alt="Gepetto, gülen kuklaya şaşkınlıkla bakıyor."><blockquote class="mino-says"><small>MİNO BÖYLE DÜŞÜNÜYOR</small>“Bence kahkaha pencereden gelmiş!”</blockquote></div><div class="task-copy"><h1 class="screen-title">${item.question}</h1><div class="choice-list">${answerButtons(item.answers, selected, 'detect-choice', item.correct, part === 1)}</div>${feedback(selected, item.correct, item.good, item.hint)}</div></div></div>`;
  }
  function renderStudio() {
    return `<div class="screen entering"><p class="eyebrow">05 · BU KEZ SES SENSİN</p><h1 class="screen-title">Gepetto’nun sesi ol.</h1><div class="studio-layout"><div class="mood-picker"><span>Nasıl söylemek istersin?</span>${['Şaşkın', 'Meraklı', 'Biraz kızgın'].map(mood => `<button class="mood-button ${state.mood === mood ? 'selected' : ''}" data-action="mood" data-mood="${mood}" aria-pressed="${state.mood === mood}">${mood}</button>`).join('')}</div><blockquote class="studio-quote">“Daha seni <em>bitirmedim bile!</em><br>Şimdiden bana gülüyorsun!”</blockquote><div class="record-row"><button class="record-button" data-action="record">${icon('mic')}<span>Sesimi kaydet</span></button><button class="text-tool" data-action="listen-sample">${icon('sound')} Örneği dinle</button>${recordingUrl ? '<audio class="record-playback" id="recordedAudio" controls aria-label="Kendi ses kaydını dinle"></audio>' : ''}</div><p class="record-status" id="recordStatus">Kayıt isteğe bağlı. Sesin yalnızca bu sayfada kalır.</p><label class="read-confirm"><input id="readConfirmed" type="checkbox" ${state.readConfirmed ? 'checked' : ''}> Sesli okudum, duraklara dikkat ettim.</label></div></div>`;
  }
  function renderOrder() {
    const message = state.orderChecked ? 'Harika! Olaylar yerli yerine oturdu. Şimdi özetini izleyebilirsin.' : state.order.length === 3 ? 'Sıralaman hazır. Kontrol edelim mi?' : 'Önce olan sahneye dokun, sonra diğerlerini sırala.';
    return `<div class="screen order-screen entering"><p class="eyebrow">06 · ÖZET FİLMİNİ SEN KUR</p><h1 class="screen-title">Önce ne olmuştu?</h1><p class="order-help">Sahnelere olay sırasıyla dokun. Seçimini geri almak için yeniden dokunabilirsin.</p><div class="scene-order">${[scenes[2], scenes[0], scenes[1]].map(scene => { const position = state.order.indexOf(scene.id); return `<button class="scene-card ${position >= 0 ? 'selected' : ''}" data-action="order-scene" data-scene="${scene.id}" aria-label="${scene.label}${position >= 0 ? ' Seçilen sıra: ' + (position + 1) : ''}" aria-pressed="${position >= 0}"><img src="assets/${scene.id}.webp" alt="" width="320" height="240"><b>${scene.label}</b><span class="order-number">${position >= 0 ? position + 1 : '·'}</span></button>`; }).join('')}</div><div class="order-utility"><p class="feedback ${state.orderChecked ? 'good' : ''}" id="orderFeedback" role="status">${message}</p><button class="quiet-button" data-action="order-reset">Yeniden sırala</button></div></div>`;
  }
  function renderFilm() {
    const scene = scenes[filmIndex];
    return `<div class="screen film-screen entering"><div class="film-top"><h1 class="screen-title">Senin küçük filmin.</h1><span>${filmIndex + 1} / 3 sahne</span></div><div class="film-frame ${scene.id === 'laugh' ? 'laughter-moment' : ''} ${filmPlaying && !reduced.matches ? 'playing' : ''}"><img src="assets/${scene.id}.webp" alt="${scene.label}" width="1024" height="768"></div><p class="film-caption" aria-live="polite">${scene.caption}</p><div class="film-controls"><button class="text-tool" data-action="film-play">${icon(filmPlaying ? 'pause' : 'play')} ${filmPlaying ? 'Duraklat' : state.filmSeen && filmIndex === 2 ? 'Yeniden izle' : 'Oynat'}</button><span class="film-dots" aria-hidden="true">${scenes.map((_, index) => `<i class="${index === filmIndex ? 'active' : ''}"></i>`).join('')}</span><button class="text-tool" data-action="film-next">${filmIndex < 2 ? 'Sonraki kare' : 'Bitir'} ${icon('arrow')}</button></div></div>`;
  }
  function renderCompletion() {
    return `<div class="screen completion-screen entering"><img src="assets/mino.webp" width="180" height="210" alt="Mino kitabını tutuyor"><p class="completion-kicker">ATÖLYEDEKİ İLK SÜRPRİZ</p><h1 class="screen-title">İlk adımı tamamladın.</h1><p>Üç kelime keşfettin, hikâyeyi okudun<br>ve olayları kendi filminle anlattın.</p><div class="completion-chips"><span>${icon('check')} Kelimeler</span><span>${icon('check')} Hikâye</span><span>${icon('check')} İpuçları</span></div><p>Acaba Pinokyo’nun ayakları tamamlanınca<br>atölyede neler olacak?</p><button class="quiet-button" data-action="reset-dialog">Bu adımı yeniden keşfet</button></div>`;
  }
  function render(focus = false) {
    clearTimeout(filmTimer);
    const renderers = [renderIntro, renderWords, renderReading, renderDetective, renderStudio, () => filmMode ? renderFilm() : renderOrder(), renderCompletion];
    panel.innerHTML = renderers[state.stage]();
    panel.setAttribute('aria-label', state.stage === 6 ? 'Adım tamamlandı' : labels[state.stage]);
    $('#activityNav').innerHTML = labels.map((label, index) => `<button type="button" class="activity-item ${index === state.stage ? 'current' : index < state.furthest ? 'done' : ''}" data-action="activity" data-stage="${index}" ${index > state.furthest ? 'disabled' : ''} ${index === state.stage ? 'aria-current="step"' : ''} aria-label="${index + 1}. etkinlik: ${label}"><span class="activity-number">${index < state.furthest ? icon('check') : index + 1}</span><img class="nav-symbol" src="assets/icons/${activityIcons[index]}.png" alt="" width="25" height="25"><b>${label}</b></button>`).join('');
    $('#minoNote').textContent = state.stage === 6 ? 'Yeni hikâyelerde görüşürüz.' : notes[state.stage];
    $('#discoveryCount').textContent = Math.min(state.furthest, 6);
    if (state.stage === 2) requestPagination();
    if (state.stage === 4) {
      if (recordingUrl) $('#recordedAudio').src = recordingUrl;
      paintRecording();
    }
    if (state.stage === 5 && filmMode && filmPlaying) filmTimer = setTimeout(advanceFilm, 7000);
    updateFooter();
    save();
    if (focus) panel.focus({ preventScroll: true });
  }
  function canAdvance() {
    switch (state.stage) {
      case 0: return state.introChoice !== null;
      case 1: return state.vocabAnswers[state.vocabIndex] === words[state.vocabIndex].correct;
      case 2: return state.readDone;
      case 3: return state.detectAnswers[state.detectPart] === detective[state.detectPart].correct;
      case 4: return state.readConfirmed && !recordingBusy && (!recorder || recorder.state !== 'recording');
      case 5: return filmMode ? state.filmSeen : state.order.length === 3;
      default: return true;
    }
  }
  function updateFooter() {
    const next = $('#next');
    const text = state.stage === 0 ? 'Kelimeleri keşfet' : state.stage === 1 ? state.vocabIndex < 2 ? 'Sonraki kelime' : 'Hikâyeyi aç' : state.stage === 2 ? 'İpucunu bul' : state.stage === 3 ? state.detectPart === 0 ? 'Kanıtını bul' : 'Sesini kat' : state.stage === 4 ? 'Filmini kur' : state.stage === 5 ? filmMode ? 'Adımı tamamla' : state.orderChecked ? 'Özetini izle' : 'Kontrol et' : 'Kitaplığa dön';
    next.innerHTML = `<span>${text}</span>${icon('arrow')}`;
    next.disabled = !canAdvance();
    $('#previous').disabled = state.stage === 0;
    $('#progressText').textContent = state.stage === 6 ? 'Adım tamamlandı' : `${state.stage + 1} / 6 etkinlik`;
    $('#progressFill').style.width = `${Math.min(6, state.stage + 1) / 6 * 100}%`;
  }
  function go(stage) {
    stopSpeech();
    stopRecording(true);
    clearTimeout(filmTimer);
    filmMode = false; filmPlaying = false;
    state.stage = Math.max(0, Math.min(6, stage));
    state.furthest = Math.max(state.furthest, state.stage);
    render(true);
  }
  function next() {
    if (!canAdvance()) return;
    if (state.stage === 1 && state.vocabIndex < 2) { state.vocabIndex++; render(true); return; }
    if (state.stage === 3 && state.detectPart === 0) { state.detectPart = 1; render(true); return; }
    if (state.stage === 5) {
      if (!state.orderChecked) {
        if (state.order.join(',') !== 'eyes,laugh,wig') { const node = $('#orderFeedback'); node.textContent = 'Önce gözler mi hareket etmişti, yoksa peruk mu çekilmişti? Sıranı yeniden gözden geçir.'; node.className = 'feedback hint'; return; }
        state.orderChecked = true; render(); return;
      }
      if (!filmMode) { filmMode = true; filmIndex = 0; filmPlaying = !reduced.matches; render(true); return; }
    }
    if (state.stage === 6) { location.href = libraryUrl; return; }
    go(state.stage + 1);
  }
  function previous() {
    if (state.stage === 1 && state.vocabIndex > 0) { state.vocabIndex--; render(true); return; }
    if (state.stage === 3 && state.detectPart > 0) { state.detectPart--; render(true); return; }
    if (state.stage === 5 && filmMode) { filmMode = false; filmPlaying = false; clearTimeout(filmTimer); render(true); return; }
    if (state.stage > 0) go(state.stage - 1);
  }

  function requestPagination() {
    cancelAnimationFrame(paginateFrame);
    paginateFrame = requestAnimationFrame(paginateReading);
  }
  function paginateReading() {
    if (state.stage !== 2) return;
    const copy = $('#readingCopy');
    if (!copy || copy.clientWidth < 10 || copy.clientHeight < 10) return;
    copy.style.fontSize = state.fontSize + 'px';
    const probe = document.createElement('div');
    probe.className = 'reading-prose';
    Object.assign(probe.style, { position: 'fixed', left: '-10000px', top: '0', visibility: 'hidden', width: copy.clientWidth + 'px', fontSize: state.fontSize + 'px', margin: '0', padding: '0' });
    document.body.appendChild(probe);
    const available = copy.clientHeight - 3;
    readingPages = [];
    let offset = 0;
    while (offset < storyWords.length) {
      let low = 1, high = storyWords.length - offset, fits = 1;
      while (low <= high) {
        const count = Math.floor((low + high) / 2);
        probe.textContent = storyWords.slice(offset, offset + count).join(' ');
        if (probe.getBoundingClientRect().height <= available) { fits = count; low = count + 1; } else high = count - 1;
      }
      if (fits > 15 && offset + fits < storyWords.length) {
        const last = storyWords.slice(offset, offset + fits).findLastIndex(word => /[.!?…][”»"]?$/.test(word));
        if (last > fits * .55) fits = last + 1;
      }
      readingPages.push({ offset, text: storyWords.slice(offset, offset + fits).join(' ') });
      offset += fits;
    }
    probe.remove();
    readingPage = Math.max(0, readingPages.findLastIndex(page => page.offset <= state.readOffset));
    showReadingPage();
  }
  function showReadingPage() {
    if (state.stage !== 2 || !readingPages.length) return;
    const page = readingPages[readingPage];
    state.readOffset = page.offset;
    $('#readingCopy').textContent = page.text;
    $('#pageLabel').textContent = `${readingPage + 1} / ${readingPages.length}`;
    $('[data-action="read-previous"]').disabled = readingPage === 0;
    $('[data-action="read-next"]').disabled = readingPage === readingPages.length - 1;
    if (readingPage === readingPages.length - 1) state.readDone = true;
    const art = $('#readingArt');
    if (art) { const scene = page.offset < 85 ? scenes[0] : page.offset < 145 ? scenes[1] : scenes[2]; art.src = `assets/${scene.id}.webp`; art.alt = scene.label; }
    updateFooter(); save();
  }
  function stopSpeech() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    speechActive = false; paintSpeech();
  }
  function paintSpeech() {
    const button = $('[data-action="listen-page"]');
    if (button) { button.innerHTML = `${icon(speechActive ? 'pause' : 'sound')}<span>${speechActive ? 'Durdur' : 'Dinle'}</span>`; button.setAttribute('aria-pressed', String(speechActive)); }
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) { toast('Bu tarayıcı seslendirmeyi desteklemiyor. Hikâyeyi kendin okuyabilirsin.'); return; }
    if (speechActive) { stopSpeech(); return; }
    const voice = speechSynthesis.getVoices().find(voice => /^tr(?:-|_)/i.test(voice.lang));
    if (!voice) { toast('Bu cihazda Türkçe ses bulunamadı. Metni kendin seslendirebilirsin.'); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice; utterance.lang = 'tr-TR'; utterance.rate = .88;
    if (state.stage === 4) { utterance.pitch = state.mood === 'Şaşkın' ? 1.2 : state.mood === 'Biraz kızgın' ? .85 : 1.05; }
    speechActive = true; paintSpeech();
    utterance.onend = utterance.onerror = () => { speechActive = false; paintSpeech(); };
    speechSynthesis.speak(utterance);
  }
  function paintRecording() {
    const button = $('[data-action="record"]'), status = $('#recordStatus');
    if (!button || !status) return;
    const active = recorder && recorder.state === 'recording';
    button.classList.toggle('recording', !!active);
    button.disabled = recordingBusy;
    button.innerHTML = `${icon(active ? 'pause' : 'mic')}<span>${recordingBusy ? 'Mikrofon açılıyor…' : active ? 'Kaydı bitir' : recordingUrl ? 'Yeniden kaydet' : 'Sesimi kaydet'}</span>`;
    status.textContent = active ? `Kaydediliyor · ${recordingSeconds} / 20 saniye` : recordingUrl ? 'Kaydını dinleyebilirsin. Sesin sunucuya gönderilmez.' : 'Kayıt isteğe bağlı. Sesin yalnızca bu sayfada kalır.';
    updateFooter();
  }
  function stopRecording(leaving = false) {
    if (leaving) captureGeneration++;
    clearInterval(recordingTimer); recordingTimer = null; recordingBusy = false;
    if (recorder && recorder.state === 'recording') recorder.stop();
    if (micStream) { micStream.getTracks().forEach(track => track.stop()); micStream = null; }
    if (!leaving) paintRecording();
  }
  async function record() {
    if (recorder && recorder.state === 'recording') { stopRecording(); return; }
    if (recordingBusy) return;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { toast('Bu tarayıcıda kayıt açılamıyor. Sesli okuyup kutuyu işaretleyebilirsin.'); return; }
    stopSpeech();
    const generation = ++captureGeneration;
    recordingBusy = true; paintRecording();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (generation !== captureGeneration || state.stage !== 4) { stream.getTracks().forEach(track => track.stop()); return; }
      micStream = stream;
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported(type));
      const current = new MediaRecorder(stream, mimeType ? { mimeType } : {}), chunks = [];
      recorder = current;
      current.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      current.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        if (generation !== captureGeneration) return;
        if (chunks.length) { if (recordingUrl) URL.revokeObjectURL(recordingUrl); recordingUrl = URL.createObjectURL(new Blob(chunks, { type: current.mimeType || 'audio/webm' })); }
        if (state.stage === 4) render();
      };
      current.onerror = () => { stopRecording(true); if (state.stage === 4) { render(); toast('Kayıt durdu. Sesli okuyarak da devam edebilirsin.'); } };
      recordingBusy = false; recordingSeconds = 0; current.start(); paintRecording();
      recordingTimer = setInterval(() => { recordingSeconds++; paintRecording(); if (recordingSeconds >= 20) stopRecording(); }, 1000);
    } catch (_) {
      if (generation !== captureGeneration) return;
      recordingBusy = false;
      if (micStream) { micStream.getTracks().forEach(track => track.stop()); micStream = null; }
      paintRecording(); toast('Mikrofon açılamadı. Kayıt olmadan sesli okuyup devam edebilirsin.');
    }
  }
  function advanceFilm() {
    if (state.stage !== 5 || !filmMode) return;
    if (filmIndex < 2) filmIndex++;
    else { filmPlaying = false; state.filmSeen = true; }
    render();
  }
  function dialog(title, body) { $('#dialogTitle').textContent = title; $('#dialogBody').innerHTML = body; $('#infoDialog').showModal(); }
  function reset() {
    stopSpeech(); stopRecording(true); clearTimeout(filmTimer);
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    recordingUrl = null; recorder = null; state = freshState(); filmMode = false; filmPlaying = false; readingPages = []; readingPage = 0;
    $('#infoDialog').close(); render(true);
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target || target.disabled) return;
    const action = target.dataset.action, value = Number(target.dataset.value);
    switch (action) {
      case 'intro-choice': state.introChoice = value; render(); break;
      case 'word-choice': state.vocabAnswers[state.vocabIndex] = value; render(); break;
      case 'detect-choice': state.detectAnswers[state.detectPart] = value; render(); break;
      case 'activity': { const stage = Number(target.dataset.stage); if (stage <= state.furthest) go(stage); break; }
      case 'read-next': stopSpeech(); if (readingPage < readingPages.length - 1) { readingPage++; showReadingPage(); } break;
      case 'read-previous': stopSpeech(); if (readingPage > 0) { readingPage--; showReadingPage(); } break;
      case 'font-larger': case 'font-smaller': stopSpeech(); state.fontSize = Math.max(18, Math.min(26, state.fontSize + (action === 'font-larger' ? 2 : -2))); requestPagination(); break;
      case 'listen-page': speak(readingPages[readingPage]?.text || ''); break;
      case 'dictionary': dialog('Üç küçük ipucu', '<span class="word-definition"><b>Yontmak</b>Küçük parçalar keserek biçim vermek.</span><span class="word-definition"><b>Talaş</b>Tahta işlenirken dökülen küçük parçalar.</span><span class="word-definition"><b>Ürkek</b>Kolayca çekinen, biraz korkan.</span>'); break;
      case 'mood': state.mood = target.dataset.mood; stopSpeech(); render(); break;
      case 'listen-sample': speak('Daha seni bitirmedim bile! Şimdiden bana gülüyorsun!'); break;
      case 'record': record(); break;
      case 'order-scene': {
        const id = target.dataset.scene, position = state.order.indexOf(id);
        if (position >= 0) state.order.splice(position, 1); else if (state.order.length < 3) state.order.push(id);
        state.orderChecked = false; state.filmSeen = false; render(); break;
      }
      case 'order-reset': state.order = []; state.orderChecked = false; state.filmSeen = false; render(); break;
      case 'film-next': if (filmIndex === 2) { state.filmSeen = true; filmPlaying = false; render(); } else advanceFilm(); break;
      case 'film-play': if (filmIndex === 2 && state.filmSeen) filmIndex = 0; filmPlaying = !filmPlaying; render(); break;
      case 'reset-dialog': dialog('Yeniden keşfedelim mi?', '<p>Bu adımın seçimleri temizlenir. Hikâyeye en başından dönersin.</p><div class="dialog-actions"><button class="text-tool" data-action="close-dialog">Vazgeç</button><button class="primary-button" data-action="reset-confirm">Yeniden başla</button></div>'); break;
      case 'reset-confirm': reset(); break;
      case 'help': dialog('Küçük bir yolculuk', '<p>Her ekranda bir görev var. Seçim yaptıktan sonra sağ alttaki düğmeyle ilerle.</p><p>Okuma bölümünde sayfaları oklarla değiştir. Yazıyı büyütebilir, kelimelere yeniden bakabilirsin.</p><p>Tamamladığın etkinliklere numaralarından dönebilirsin. Seçimlerin bu tarayıcıda hatırlanır.</p>'); break;
      case 'close-dialog': $('#infoDialog').close(); break;
      case 'fullscreen': if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); else document.documentElement.requestFullscreen?.().catch(() => toast('Tam ekran açılamadı. Bu görünümde devam edebilirsin.')); break;
    }
  });
  document.addEventListener('change', event => { if (event.target.id === 'readConfirmed') { state.readConfirmed = event.target.checked; updateFooter(); save(); } });
  $('#next').addEventListener('click', next);
  $('#previous').addEventListener('click', previous);
  $$('[data-library]').forEach(link => { link.href = libraryUrl; });
  if (!document.fullscreenEnabled) $('.fullscreen-tool').hidden = true;
  addEventListener('resize', () => { if (state.stage === 2) requestPagination(); });
  const readingResize = new ResizeObserver(() => { if (state.stage === 2) requestPagination(); });
  readingResize.observe(panel);
  document.fonts?.ready.then(() => { if (state.stage === 2) requestPagination(); });
  reduced.addEventListener('change', () => { if (reduced.matches && filmPlaying) { filmPlaying = false; render(); } });
  addEventListener('pagehide', () => { stopSpeech(); stopRecording(true); clearTimeout(filmTimer); save(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stopSpeech(); if (recorder?.state === 'recording') stopRecording(); if (filmPlaying) { filmPlaying = false; render(); } } });
  render();
})();
