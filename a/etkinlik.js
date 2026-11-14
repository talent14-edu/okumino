/* Okumino A · durak oynatıcısı. Seçilen kitabın 1. durağı: Tahmin et, Dinle, Oku, Kelime oyunu, İzle, Anla ve üret.
   İçerik tanıtım örneğidir; klasiklerin bölümleri Okumino'nun kendi kısa anlatımıdır (kamu malı eserlerin olay örgüsüne sadık).
   Sesli okuma yok: çocuk dinler, içinden okur, izler, oynar, seçer ve yazar. Dinle adımı tarayıcının Türkçe sesini kullanır, yoksa yazıyı tempoyla vurgular. */
(() => {
/*<dil>* dil bloğu: L arayüz metinleri, D kitap içerikleri, EK resimli sayfalar/video. Altındaki kod iki sitede aynı. */
  const L = {
    global: 'OkuminoDurak', olay: 'okumino:durak-bitti',
    lang: 'tr', ses: /^tr/i, sesKod: 'tr-TR',
    adim: ['Tahmin et', 'Dinle ve oku', 'Kelime oyunu', 'İzle', 'Anla ve üret'],
    faz: ['önce', 'sırası', 'sırası', 'sırası', 'sonra'],
    durak: t => `${t} · 1. durak`, adimEtiket: (i, a, ok) => `${i}. adım: ${a}${ok ? ', tamamlandı' : ''}`,
    ileri: 'İleri →', bitir: 'Durağı bitir ✓', don: 'Kitaplığa dön', geri: '← Geri', kapat: 'Kapat', adimlar: 'Adımlar',
    kapak: t => `${t} kapağı`,
    tahminAlt: 'Kapağa bak. Sence ne olacak? Yanlış tahmin yok, dinleyince göreceğiz.',
    tahminOk: 'Tahminini not ettim! Şimdi dinleyip kontrol edelim.',
    dinleAlt: 'Hikâyeyi dinle. Duyduğun kelime yazıda parlar.', dinleBtn: 'Dinle', durdur: 'Durdur', tekrarDinle: 'Tekrar dinle',
    cevap: c => `Cevap: ${c}.`, dogruTahmin: c => `Tahminin doğru çıktı: ${c}!`, farkliTahmin: c => `Hikâyede şöyle oldu: ${c}. Tahmin etmek de okumanın parçası.`,
    okuAlt: 'Şimdi sıra sende: sayfaları kendi hızında, içinden oku. Bir cümleye dokunursan parmağınla takip eder gibi parlar.',
    sayfa: (i, n) => `Sayfa ${i} / ${n}`, cevir: 'Sayfayı çevir', onceki: 'Önceki sayfa', okuBitti: 'Bütün sayfaları okudun. Harika!',
    okuSon: 'Son sayfa! Okuyunca İleri’ye geç.',
    kelimeAlt: 'Önce bir kelimeye, sonra onun anlamına dokun.', kelimeSec: 'Önce soldan bir kelime seç.',
    kelimeTam: 'Harika! Üç kelimeyi de buldun.', kelimeOk: 'Doğru eşleşme!', tekrar: 'Bir daha dene.', adimBitti: 'Bu adımı tamamladın.',
    izleAlt: 'Kilit sahne kısa bir animasyonla.', izleVideoAlt: 'Hikâyenin bu bölümü bir çizgi filmde. Sesi açıp izle.',
    oynat: 'Sahneyi oynat', sesliIzle: 'Sesli izle', tekrarIzle: 'Tekrar izle', izledin: 'Sahneyi izledin!',
    anlaAlt: 'Önce soruyu cevapla, sonra kendi cümleni yaz.', anlaOk: 'Doğru! Şimdi sıra sende.', anlaYanlis: 'Hikâyeyi hatırla, bir daha dene.',
    yazPh: 'Buraya yaz…', yazNot: 'Yazdıkların yalnız bu sayfada kalır.',
    damga: ['1. DURAK', 'tamam ✓'], finalBaslik: t => `${t} · 1. durak tamamlandı!`,
    finalMetin: '2. durağın kilidi açıldı. Patika boyunca her durak bir damga, son durakta okuma belgesi seni bekliyor.'
  };
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
    'kucuk-prens': {
      tahmin: ['Çölün ortasında beliren çocuk pilottan ne isteyecek?', ['Bir koyun resmi', 'Bir şişe su', 'Uçakla bir gezi'], 0],
      metin: 'Pilotun uçağı Büyük Sahra Çölü’ne indi. Sabah incecik bir ses onu uyandırdı: “Lütfen, bana bir koyun çizer misin?” Karşısında altın saçlı küçük bir çocuk duruyordu. Pilot sonunda üç delikli bir kutu çizdi ve çocuk çok sevindi. Çocuk minicik bir gezegenden geliyordu ve orada bir gülü vardı.',
      kelime: [['çöl', 'Yağmurun çok az yağdığı, kumlu ve kurak yer'], ['gezegen', 'Bir yıldızın çevresinde dönen gök cismi'], ['filiz', 'Topraktan yeni çıkan körpe bitki']],
      sahne: ['Çölde bir uçak ve yalnız bir pilot.', 'Altın saçlı bir çocuk: “Bana bir koyun çizer misin?”', 'Minicik bir gezegende cam fanus altında bir gül.'],
      anla: ['Pilot sonunda koyun yerine ne çizdi?', ['Üç delikli bir kutu', 'Bir uçak', 'Bir gül'], 0],
      uret: 'Senin minicik bir gezegenin olsaydı her sabah neye özen gösterirdin? İki cümleyle yaz.'
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
  };  /* Sahne görselleri, resimli okuma sayfaları ve izle videosu olan kitaplar. Olmayanlarda her adımda kapak görünür. */
  const EK = {
    'kucuk-prens': {
      dir: 'img/kucuk-prens/',
      gorsel: ['p1', null, 'p3', null, 'p4', 'p6'],
      oku: [
        ['p1', 'Pilotun uçağı, Büyük Sahra Çölü’nün üstünde birden sarsıldı. Motor sustu ve uçak kumlara indi. Yanında ne bir yolcu vardı ne de bir tamirci. Matarasındaki su ancak birkaç gün yeterdi. O gece yıldızların altında uyurken, kendini okyanusun ortasındaki bir saldan daha yalnız hissetti.'],
        ['p2', 'Sabah, güneş doğarken incecik bir ses onu uyandırdı: “Lütfen… bana bir koyun çizer misin?” Pilot yerinden fırladı. Karşısında altın saçlı, ciddi bakışlı küçük bir çocuk duruyordu. Ne yorgun görünüyordu ne aç ne de korkmuş. Sanki çölün ortasında hiç kaybolmamış gibiydi.'],
        ['p3', 'Pilot birkaç koyun çizdi ama çocuk hiçbirini beğenmedi. “Bu çok hasta.” “Bu bir koç, boynuzları var.” “Bu da çok yaşlı.” Sabrı tükenen pilot üç delikli bir kutu çizdi: “İstediğin koyun bunun içinde.” Çocuğun yüzü aydınlandı: “Tam istediğim gibi!”'],
        ['p4', 'Pilot zamanla öğrendi: Çocuk, bir evden biraz büyük, minicik bir gezegenden geliyordu. Orada iki tüten, bir sönmüş yanardağ vardı. Her sabah onları özenle temizliyordu. Baobap filizlerini de küçükken söküyordu; çünkü büyürlerse kökleri koca gezegeni paramparça edebilirdi.'],
        ['p5', 'Gezegeni öyle küçüktü ki, gün batımını izlemek için akşamı beklemesi gerekmiyordu. Sandalyesini birkaç adım çekmesi yetiyordu. “Bir gün gün batımını kırk dört kez izledim,” dedi. Sonra biraz sustu ve ekledi: “İnsan çok üzgün olunca gün batımlarını sever.”'],
        ['p6', 'Gezegeninde bir de gül vardı. Rüzgârdan bir cam fanusla korunuyor, her gün sulanıyordu. Biraz kibirli, biraz nazlıydı ama çocuk onu çok seviyordu. Milyonlarca yıldızın birinde böyle bir gül varsa, insan gökyüzüne bakınca mutlu olabilirdi.']
      ]
    },
    pinokyo: {
      dir: 'img/pinokyo/',
      gorsel: ['p1', null, 'p3', null, 'p4', 'p6'],   // adım başına sol panel (null: adım kendi görselini taşır)
      oku: [
        ['p1', 'Kiraz Usta’nın atölyesinde sıradan bir odun parçası vardı. Usta baltasını kaldırdı: “Bundan güzel bir masa ayağı yaparım.” Tam o sırada incecik bir ses duyuldu: “Bana sakın sert vurma!”'],
        ['p2', 'Korkan Kiraz Usta odunu arkadaşı Gepetto’ya verdi. Gepetto bir kukla yapmak istiyordu. Oydu, yonttu; önce saçlar, sonra alın, sonra gözler çıktı ortaya. Gözler kıpırdadı ve ona baktı!'],
        ['p3', 'Gepetto kuklaya Pinokyo adını verdi ve ona yürümeyi öğretti. Pinokyo’nun tahta bacakları önce titredi. Bir adım attı. Sonra bir adım daha…'],
        ['p4', 'Pinokyo daha yürümeyi yeni öğrenmişti ki kapıdan fırlayıp sokağa kaçtı! Gepetto nefes nefese arkasından koştu. Sokaktakiler şaşkınlıkla bakakaldı.'],
        ['p5', 'O akşam Pinokyo evde yalnızdı. Duvardaki rafta küçük bir çekirge belirdi. “Söz dinleyen çocuk yolunu kaybetmez,” dedi. Pinokyo bu öğüdü pek beğenmedi.'],
        ['p6', 'Ertesi sabah Gepetto ceketini satıp Pinokyo’ya bir alfabe kitabı aldı. Pinokyo kitabını sıkıca tuttu. “Bugün okula gideceğim, çok şey öğreneceğim!” dedi ve yola düştü.']
      ],
      ses: { dir: 'ses/', k: [["s1.mp3",[0.0,0.56,0.88,1.08,1.84,2.84,2.98,3.28,3.74,4.76,5.12,5.66,6.88,7.24,7.56,7.82,8.24,9.64,9.84,9.98,10.32,11.04,11.14,11.3,12.58,12.76,13.12,13.36]],["s2.mp3",[0.12,0.58,0.78,1.5,1.72,2.36,2.82,2.98,4.06,4.48,4.66,5.1,5.44,6.68,8.6,8.78,9.78,10.0,10.76,11.02,11.54,11.72,12.9,13.4,13.94,14.1,14.36]],["s3.mp3",[0.12,0.62,0.98,1.08,1.54,1.86,2.86,3.14,3.62,4.72,5.2,5.34,5.64,6.2,6.5,7.66,8.06,8.94,9.14,9.36,9.62]],["s4.mp3",[0.12,0.66,0.88,1.44,1.68,2.4,3.0,3.3,3.72,4.18,5.32,5.68,6.12,6.44,7.0,8.24,8.98,9.72]],["s5.mp3",[0.12,0.24,0.56,1.08,1.42,2.56,3.12,3.46,3.98,4.28,4.74,5.74,6.04,6.4,6.56,6.96,7.98,8.9,9.36,9.52,9.98,10.14]],["s6.mp3",[0.12,0.54,0.94,1.44,1.96,2.36,3.04,3.1,3.2,3.5,3.92,4.78,5.26,6.18,7.3,7.54,7.82,8.54,8.66,8.86,9.44,9.64,10.32,10.58]]] },   // sayfa sesi + ekrandaki kelimelerin başlangıç saniyesi
      izle: {
        webp: 'izle.webp', mp4: 'izle.mp4?v=vo1', poster: 'izle_poster.webp',
        alt: [[0.6, 7.6, 'Kiraz Usta’nın atölyesinde sıradan bir odun parçası vardı. Ama bu odun… konuşuyordu!'], [8.1, 14.4, 'Odunu dostu Gepetto aldı. Oydu, yonttu… ve kuklanın gözleri açıldı.'], [15.6, 21.6, 'Adını Pinokyo koydu. Pinokyo ilk adımını attı. Sonra bir tane daha…'], [23.1, 27.8, 'Pinokyo daha yürümeyi yeni öğrenmişti ki kapıdan fırlayıp sokağa kaçtı!'], [30.3, 36.5, 'O akşam küçük çekirge ona bir öğüt verdi: “Söz dinleyen çocuk yolunu kaybetmez.”'], [37.5, 43.6, 'Gepetto ceketini satıp ona bir alfabe kitabı aldı. Ve Pinokyo okul yoluna düştü.']]
      }
    }
  };
/*</dil>*/
  /* Ortak kod (Okumino ve Readmino aynı): yukarıdaki dil bloğu dışında iki sitede birebir aynı tutulur. */
  const SON = 4;   // son etkinlik adımı; SON + 1 final ekranı
  const $ = (s, r = document) => r.querySelector(s);
  const karistir = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
  const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cumleler = t => t.match(/[^.!?…]+[.!?…]+[”’"]*\s*/g) || [t];

  /* Ses efektleri: seçim, doğru, yanlış, sayfa, adım tamam, durak bitti. Başlıktaki hoparlör düğmesi kapatır (tercih tarayıcıda kalır). */
  const SFX = {}; ['sec', 'dogru', 'yanlis', 'sayfa', 'adim', 'final'].forEach(n => { SFX[n] = new Audio(`img/sfx/${n}.mp3`); SFX[n].preload = 'auto'; });
  let sesAcik = true; try { sesAcik = localStorage.getItem('okSes') !== '0'; } catch (e) {}
  const efekt = (n, vol = .6) => { if (!sesAcik || !SFX[n]) return; const a = SFX[n].cloneNode(); a.volume = vol; a.play().catch(() => {}); };
  const dlg = document.createElement('dialog');
  dlg.className = 'oyun'; dlg.setAttribute('aria-labelledby', 'oyunBaslik'); dlg.lang = L.lang;
  dlg.innerHTML = `<div class="oyun-ust"><img class="oyun-kapak" alt=""><div><p class="oyun-k" id="oyunBaslik"></p><ol class="oyun-ilerleme" aria-label="${L.adimlar}"></ol></div>
      <button class="oyun-sfx" type="button" aria-pressed="true" aria-label="Ses efektlerini kapat"><span aria-hidden="true">🔊</span></button><button class="oyun-kapat" type="button" aria-label="${L.kapat}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
    <div class="oyun-orta"><figure class="oyun-gorsel" aria-hidden="true"><img class="og-arka" alt=""><img class="og-sahne" alt=""><img class="og-kapak" alt=""></figure>
      <div class="oyun-govde" aria-live="polite"></div></div>
    <div class="oyun-alt"><button class="oyun-geri" type="button">${L.geri}</button><button class="btn oyun-ileri" type="button">${L.ileri}</button></div>`;
  document.body.appendChild(dlg);
  const govde = $('.oyun-govde', dlg), ileri = $('.oyun-ileri', dlg), geri = $('.oyun-geri', dlg), gorsel = $('.oyun-gorsel', dlg);
  let kitap = null, veri = null, ek = null, adim = 0, durum = {};
  const kapakSrc = () => `img/covers/${kitap.id}.webp`;

  function ac(k, basla = 0) {
    kitap = k; veri = D[k.id]; ek = EK[k.id] || null; durum = { tamam: new Set(), sayfa: 0 }; adim = basla;
    $('.oyun-kapak', dlg).src = kapakSrc();
    $('#oyunBaslik', dlg).textContent = L.durak(k.title);
    ciz(); dlg.showModal();
  }
  function sustur() { calan = false; sesA.pause(); window.speechSynthesis && speechSynthesis.cancel(); dlg.querySelectorAll('video').forEach(v => v.pause()); }
  function kapat() { sustur(); dlg.close(); }
  $('.oyun-kapat', dlg).addEventListener('click', kapat);
  const sfxBtn = $('.oyun-sfx', dlg), sfxCiz = () => { sfxBtn.firstChild.textContent = sesAcik ? '🔊' : '🔇'; sfxBtn.setAttribute('aria-pressed', sesAcik); sfxBtn.setAttribute('aria-label', sesAcik ? 'Ses efektlerini kapat' : 'Ses efektlerini aç'); };
  sfxBtn.addEventListener('click', () => { sesAcik = !sesAcik; try { localStorage.setItem('okSes', sesAcik ? '1' : '0'); } catch (e) {} sfxCiz(); efekt('sec'); }); sfxCiz();
  dlg.addEventListener('cancel', sustur);
  dlg.addEventListener('click', e => { if (e.target === dlg) kapat(); });
  geri.addEventListener('click', () => { if (adim > 0) { adim--; ciz(); } });
  ileri.addEventListener('click', () => { if (adim <= SON) { adim++; ciz(); } else kapat(); });

  function tamamla(i) { if (!durum.tamam.has(i)) setTimeout(() => efekt('adim', .45), 380); durum.tamam.add(i); ilerlemeCiz(); if (i === adim) ileri.disabled = false; }
  function ilerlemeCiz() {
    $('.oyun-ilerleme', dlg).innerHTML = L.adim.map((a, i) => `<li class="${i === adim ? 'simdi' : ''} ${durum.tamam.has(i) ? 'bitti' : ''}"><button type="button" data-a="${i}" aria-label="${L.adimEtiket(i + 1, a, durum.tamam.has(i))}">${durum.tamam.has(i) ? '✓' : i + 1}</button><span>${a}</span></li>`).join('');
    dlg.querySelectorAll('.oyun-ilerleme button').forEach(b => b.addEventListener('click', () => { adim = +b.dataset.a; ciz(); }));
  }
  /* sol panel: kitabın sahnesi (varsa), yoksa kapak; tahmin adımında kapak öne çıkar */
  function gorselCiz() {
    const ad = ek && ek.gorsel ? ek.gorsel[adim] : undefined;
    const tamEkran = adim === 1 || (adim === 3 && ek && ek.izle);   // dinle ve oku ve videolu izle görselini kendi taşır
    dlg.classList.toggle('genis', tamEkran);
    if (tamEkran) return;
    const sahne = ad ? ek.dir + ad + '.webp' : null;
    $('.og-arka', gorsel).src = sahne || kapakSrc();
    $('.og-sahne', gorsel).hidden = !sahne || adim === 0;
    if (sahne) $('.og-sahne', gorsel).src = sahne;
    $('.og-kapak', gorsel).src = kapakSrc();
    gorsel.className = 'oyun-gorsel ' + (!sahne || adim === 0 ? 'kapak-modu' : 'sahne-modu');
  }
  function ciz() {
    sustur(); dlg.querySelectorAll('.oyun-alt .sayfa-gez').forEach(e => e.remove());
    ilerlemeCiz(); gorselCiz();
    govde.className = 'oyun-govde a' + adim;
    geri.hidden = adim === 0 || adim > SON;
    ileri.textContent = adim === SON ? L.bitir : adim > SON ? L.don : L.ileri;
    ileri.disabled = adim <= SON && !durum.tamam.has(adim);
    [tahmin, dinleOku, kelime, izle, anla, final][adim]();
    govde.scrollTop = 0;
    const h = govde.querySelector('h3'); h && h.focus({ preventScroll: true });
  }
  const baslik = (i, alt) => `<p class="oyun-faz"><b>${i + 1}</b> ${L.faz[i]}</p><h3 tabindex="-1">${L.adim[i]}</h3>${alt ? `<p class="oyun-alt-yazi">${alt}</p>` : ''}`;

  function secenekler(soru, sonra) {
    const [q, s, d] = soru, sira = karistir(s.map((t, i) => [t, i]));
    govde.insertAdjacentHTML('beforeend', `<p class="oyun-soru">${esc(q)}</p><div class="secenek">${sira.map(([t, i]) => `<button type="button" data-i="${i}">${esc(t)}</button>`).join('')}</div><p class="geri-bildirim" role="status"></p>`);
    govde.querySelectorAll('.secenek button').forEach(b => b.addEventListener('click', () => sonra(+b.dataset.i, b, d)));
  }

  function tahmin() {
    govde.innerHTML = baslik(0, L.tahminAlt);
    secenekler(veri.tahmin, (i, b) => {
      durum.tahmin = i; efekt('sec');
      govde.querySelectorAll('.secenek button').forEach(x => x.classList.toggle('secili', x === b));
      $('.geri-bildirim', govde).textContent = L.tahminOk;
      tamamla(0);
    });
    if (durum.tahmin != null) govde.querySelector(`.secenek button[data-i="${durum.tahmin}"]`).classList.add('secili');
  }

  /* Dinle ve oku: resimli kitap sayfaları + Dinle/Durdur. Dinlerken okunan kelime parlar, sayfa bitince kitap çevrilir.
     Sesi olan kitapta (EK.ses) Vids anlatımı çalar; yoksa tarayıcının sesi. Çocuk dinlemeden kendi de okuyabilir (sesli okuma yok). */
  function sayfalar() {
    if (ek && ek.oku) return ek.oku.map(([g, t], i) => ({ img: ek.dir + g + '.webp', metin: t, ses: ek.ses && ek.ses.k[i] }));
    const c = cumleler(veri.metin), n = Math.min(3, Math.ceil(c.length / 2)), boy = Math.ceil(c.length / n);
    return Array.from({ length: n }, (_, i) => ({ img: kapakSrc(), metin: c.slice(i * boy, i * boy + boy).join('').trim(), kapak: true }));
  }
  const sesA = new Audio(); let calan = false, cerceve = 0;
  function dinleOku() {
    govde.innerHTML = '';
    const S = sayfalar(); durum.okunan = durum.okunan || new Set();
    govde.insertAdjacentHTML('beforeend', `<div class="kitap-acik"><div class="ka-sol"><img alt=""></div><div class="ka-sag"><p class="okuma" lang="${L.lang}"></p><span class="ka-no"></span></div></div>
      <div class="sayfa-gez"><button class="sg-geri" type="button" aria-label="${L.onceki}">‹</button><button class="dinle-btn do-btn" type="button"></button><ol class="sg-nokta">${S.map((_, i) => `<li><button type="button" data-s="${i}" aria-label="${L.sayfa(i + 1, S.length)}"></button></li>`).join('')}</ol><button class="sg-ileri btn btn-sm" type="button">${L.cevir} ›</button></div><p class="geri-bildirim" role="status"></p>`);
    // sayfa düğmeleri Geri/İleri satırına taşınır, geri bildirim sayfanın içine: kitap tüm yüksekliği alır
    const gez = $('.sayfa-gez', govde); $('.ka-sag', govde).appendChild($('.geri-bildirim', govde)); geri.after(gez);
    const ka = $('.kitap-acik', govde), img = $('.ka-sol img', govde), p = $('.okuma', govde), btn = $('.do-btn', gez), fb = $('.geri-bildirim', govde);
    let kelimeler = [];
    const dugme = () => { btn.innerHTML = calan ? `<span aria-hidden="true">❚❚</span> ${L.durdur}` : `<span aria-hidden="true">▶</span> ${L.dinleBtn}`; btn.classList.toggle('caliyor', calan); btn.setAttribute('aria-pressed', calan); };
    const isaretle = i => kelimeler.forEach((w, k) => { w.classList.toggle('su', k === i); w.classList.toggle('gecti', k < i); });
    const goster = (s, yon = 0) => {
      durum.sayfa = s; durum.okunan.add(s);
      img.src = S[s].img; ka.classList.toggle('kapakli', !!S[s].kapak);
      let n = 0;
      p.innerHTML = cumleler(S[s].metin).map(c => `<span class="cm">${c.trim().split(' ').map(w => `<span class="w" data-i="${n++}">${esc(w)}</span>`).join(' ')}</span>`).join(' ');
      kelimeler = [...p.querySelectorAll('.w')];
      $('.ka-no', govde).textContent = L.sayfa(s + 1, S.length);
      gez.querySelectorAll('.sg-nokta button').forEach((b, i) => { b.classList.toggle('su', i === s); b.classList.toggle('okundu', durum.okunan.has(i)); b.setAttribute('aria-current', i === s ? 'page' : 'false'); });
      $('.sg-geri', gez).disabled = s === 0; $('.sg-ileri', gez).hidden = s === S.length - 1;
      if (yon) { efekt('sayfa', .7); ka.classList.remove('cevir-ileri', 'cevir-geri'); void ka.offsetWidth; ka.classList.add(yon > 0 ? 'cevir-ileri' : 'cevir-geri'); }
      if (durum.okunan.size === S.length && !durum.tamam.has(1)) { fb.textContent = L.okuBitti; tamamla(1); }
      else if (!durum.tamam.has(1)) fb.textContent = s === S.length - 1 ? L.okuSon : '';
    };
    const sayfaBitti = () => {
      isaretle(kelimeler.length);
      if (durum.sayfa < S.length - 1) { goster(durum.sayfa + 1, 1); setTimeout(() => calan && sayfaCal(true), 700); }
      else {
        calan = false; dugme(); btn.innerHTML = `<span aria-hidden="true">↻</span> ${L.tekrarDinle}`;
        const t = veri.tahmin, c = t[1][t[2]];
        fb.textContent = durum.tahmin == null ? L.cevap(c) : durum.tahmin === t[2] ? L.dogruTahmin(c) : L.farkliTahmin(c);
      }
    };
    function sayfaCal(bastan) {
      const s = S[durum.sayfa];
      cancelAnimationFrame(cerceve);
      if (s.ses) {
        const src = ek.dir + ek.ses.dir + s.ses[0];
        if (bastan || !sesA.src.endsWith(src)) { sesA.src = src; sesA.currentTime = 0; }
        sesA.onended = () => calan && sayfaBitti();
        sesA.play().catch(() => { calan = false; dugme(); });
        const t = s.ses[1];
        const izle = () => { if (!calan) return; let i = 0; while (i < t.length - 1 && t[i + 1] <= sesA.currentTime + .05) i++; isaretle(i); cerceve = requestAnimationFrame(izle); };
        izle();
      } else {
        const ses = window.speechSynthesis && speechSynthesis.getVoices().find(v => L.ses.test(v.lang));
        const metin = kelimeler.map(w => w.textContent).join(' ');
        if (!ses) {   // ses yoksa yazıyı dinleme temposunda vurgula
          let i = 0; const z = setInterval(() => { if (!calan || !govde.contains(p)) return clearInterval(z); isaretle(i++); if (i > kelimeler.length) { clearInterval(z); sayfaBitti(); } }, 380);
          return;
        }
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(metin); u.lang = L.sesKod; u.voice = ses; u.rate = .92;
        const baslar = []; let q = 0; kelimeler.forEach(w => { baslar.push(q); q += w.textContent.length + 1; });
        u.onboundary = e => { if (e.charIndex != null) isaretle(baslar.findIndex((b, k) => e.charIndex >= b && (k === baslar.length - 1 || e.charIndex < baslar[k + 1]))); };
        u.onend = () => calan && sayfaBitti();
        speechSynthesis.speak(u);
      }
    }
    btn.addEventListener('click', () => {
      if (calan) { calan = false; sesA.pause(); window.speechSynthesis && speechSynthesis.cancel(); cancelAnimationFrame(cerceve); }
      else { calan = true; sayfaCal(false); }
      dugme();
    });
    const sayfayaGit = (s, yon) => { sesA.pause(); window.speechSynthesis && speechSynthesis.cancel(); goster(s, yon); if (calan) sayfaCal(true); };
    p.addEventListener('click', e => { const c = e.target.closest('.cm'); if (!c || calan) return; p.querySelectorAll('.cm').forEach(x => x.classList.toggle('isik', x === c && !c.classList.contains('isik'))); });
    $('.sg-geri', gez).addEventListener('click', () => durum.sayfa > 0 && sayfayaGit(durum.sayfa - 1, -1));
    $('.sg-ileri', gez).addEventListener('click', () => durum.sayfa < S.length - 1 && sayfayaGit(durum.sayfa + 1, 1));
    gez.querySelectorAll('.sg-nokta button').forEach(b => b.addEventListener('click', () => sayfayaGit(+b.dataset.s, +b.dataset.s - durum.sayfa)));
    calan = false; dugme();
    goster(Math.min(durum.sayfa, S.length - 1));
  }

  function kelime() {
    govde.innerHTML = baslik(2, L.kelimeAlt);
    const k = veri.kelime, anlam = karistir(k.map((x, i) => [x[1], i]));
    govde.insertAdjacentHTML('beforeend', `<div class="eslestir"><div class="sutun">${k.map((x, i) => `<button type="button" class="kel" data-i="${i}">${esc(x[0])}</button>`).join('')}</div>
      <div class="sutun">${anlam.map(([t, i]) => `<button type="button" class="anl" data-i="${i}">${esc(t)}</button>`).join('')}</div></div><p class="geri-bildirim" role="status"></p>`);
    let sec = null, eslesen = 0; const fb = $('.geri-bildirim', govde);
    govde.querySelectorAll('.kel').forEach(b => b.addEventListener('click', () => {
      if (b.classList.contains('ok')) return;
      govde.querySelectorAll('.kel').forEach(x => x.classList.remove('secili')); b.classList.add('secili'); sec = b; efekt('sec', .5);
    }));
    govde.querySelectorAll('.anl').forEach(b => b.addEventListener('click', () => {
      if (!sec || b.classList.contains('ok')) { if (!sec) fb.textContent = L.kelimeSec; return; }
      if (b.dataset.i === sec.dataset.i) {
        b.classList.add('ok'); sec.classList.add('ok'); sec.classList.remove('secili'); sec = null; eslesen++; efekt('dogru', .5);
        fb.textContent = eslesen === k.length ? L.kelimeTam : L.kelimeOk;
        if (eslesen === k.length) tamamla(2);
      } else { efekt('yanlis', .5); b.classList.add('yanlis'); fb.textContent = L.tekrar; setTimeout(() => b.classList.remove('yanlis'), 500); }
    }));
    if (durum.tamam.has(2)) { govde.querySelectorAll('.kel,.anl').forEach(b => b.classList.add('ok')); fb.textContent = L.adimBitti; }
  }

  function izle() {
    if (ek && ek.izle) return izleVideo(ek.izle);
    govde.innerHTML = baslik(3, L.izleAlt);
    govde.insertAdjacentHTML('beforeend', `<div class="sahne-ekran"><img src="${kapakSrc()}" alt=""><p class="altyazi"></p>
      <button class="oynat" type="button" aria-label="${L.oynat}"><span aria-hidden="true">▶</span></button></div><p class="geri-bildirim" role="status"></p>`);
    const ekran = $('.sahne-ekran', govde), alt = $('.altyazi', govde), btn = $('.oynat', govde);
    btn.addEventListener('click', () => {
      btn.hidden = true; ekran.classList.remove('oynuyor'); void ekran.offsetWidth; ekran.classList.add('oynuyor');
      const burada = () => dlg.open && adim === 3 && govde.contains(alt);
      veri.sahne.forEach((s, i) => setTimeout(() => { if (!burada()) return; alt.textContent = s; alt.classList.remove('gir'); void alt.offsetWidth; alt.classList.add('gir'); }, i * 3000));
      setTimeout(() => { if (!burada()) return; btn.hidden = false; btn.setAttribute('aria-label', L.tekrarIzle); btn.innerHTML = '<span aria-hidden="true">↻</span>'; $('.geri-bildirim', govde).textContent = L.izledin; tamamla(3); }, 9200);
    });
  }
  /* Videolu izle: önce sessiz, döngülü WebP animasyon görünür; oynatınca sesli video altyazıyla başlar. */
  function izleVideo(v) {
    govde.innerHTML = baslik(3, L.izleVideoAlt);
    govde.insertAdjacentHTML('beforeend', `<div class="sahne-ekran video"><img class="izle-onizleme" src="${ek.dir + v.webp}" alt="">
      <video playsinline preload="none" poster="${ek.dir + v.poster}"></video><p class="altyazi" aria-live="off"></p>
      <button class="oynat" type="button" aria-label="${L.sesliIzle}"><span aria-hidden="true">▶</span></button><span class="sesli-etiket" aria-hidden="true">🔊 ${L.sesliIzle}</span></div><p class="geri-bildirim" role="status"></p>`);
    const ekran = $('.sahne-ekran', govde), vid = $('video', govde), alt = $('.altyazi', govde), btn = $('.oynat', govde);
    let son = -1;
    vid.addEventListener('timeupdate', () => {
      const t = vid.currentTime, i = v.alt.findIndex(([a, b]) => t >= a && t < b);
      if (i !== son) { son = i; alt.textContent = i < 0 ? '' : v.alt[i][2]; if (i >= 0) { alt.classList.remove('gir'); void alt.offsetWidth; alt.classList.add('gir'); } }
      if (vid.duration && t > vid.duration * .85 && !durum.tamam.has(3)) { $('.geri-bildirim', govde).textContent = L.izledin; tamamla(3); }
    });
    vid.addEventListener('ended', () => { btn.hidden = false; btn.setAttribute('aria-label', L.tekrarIzle); btn.innerHTML = '<span aria-hidden="true">↻</span>'; vid.controls = false; });
    btn.addEventListener('click', () => {
      ekran.classList.add('oynuyor'); btn.hidden = true;
      if (!vid.src) { vid.src = ek.dir + v.mp4; vid.preload = 'auto'; }
      vid.currentTime = 0; vid.controls = true; vid.play();
    });
  }

  function anla() {
    govde.innerHTML = baslik(4, L.anlaAlt);
    secenekler(veri.anla, (i, b, d) => {
      const fb = $('.geri-bildirim', govde);
      if (i === d) {
        efekt('dogru'); b.classList.add('ok'); govde.querySelectorAll('.secenek button').forEach(x => x.disabled = true);
        fb.textContent = L.anlaOk;
        $('.uret', govde).hidden = false; $('.uret textarea', govde).focus();
      } else { efekt('yanlis', .5); b.classList.add('yanlis'); fb.textContent = L.anlaYanlis; setTimeout(() => b.classList.remove('yanlis'), 500); }
    });
    govde.insertAdjacentHTML('beforeend', `<label class="uret" hidden><span>${esc(veri.uret)}</span><textarea rows="3" maxlength="300" placeholder="${L.yazPh}"></textarea><small>${L.yazNot}</small></label>`);
    const ta = $('.uret textarea', govde);
    ta.addEventListener('input', () => { if (ta.value.trim().length >= 8) tamamla(4); });
  }

  function final() {
    efekt('final', .55);
    $('.oyun-ilerleme', dlg).innerHTML = L.adim.map(a => `<li class="bitti"><button type="button" disabled>✓</button><span>${a}</span></li>`).join('');
    govde.innerHTML = `<div class="final-ekran"><div class="final-damga" aria-hidden="true"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#FFFDF5" stroke="currentColor" stroke-width="6" stroke-dasharray="7 4"/><text x="50" y="47" text-anchor="middle">${L.damga[0]}</text><text x="50" y="68" text-anchor="middle" class="t2">${L.damga[1]}</text></svg></div>
      <img class="final-mino" src="img/mino_selam.webp" alt="">
      <h3 tabindex="-1">${esc(L.finalBaslik(kitap.title))}</h3><p>${L.finalMetin}</p></div>`;
    document.dispatchEvent(new CustomEvent(L.olay, { detail: { id: kitap.id } }));
  }

  window[L.global] = { ac, var: id => !!D[id] };
})();
