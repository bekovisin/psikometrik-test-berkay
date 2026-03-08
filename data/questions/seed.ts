import { Question } from '@/lib/types';

const T = '2024-01-01T00:00:00.000Z';

export const seedQuestions: Question[] = [
  // ============================================================
  // 1. SAYISAL YETENEK — Sayısal Muhakeme (5 soru)
  // ============================================================
  {
    id: 'seed-say-k', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-muhakeme', difficulty: 'kolay',
    questionText: 'Aşağıdaki çubuk grafiğe göre, Şubat ayındaki satışlar Ocak ayına göre yüzde kaç artmıştır?',
    svg: `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="250" fill="#f8fafc"/><text x="200" y="20" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">Aylık Satışlar (Bin TL)</text><line x1="60" y1="205" x2="360" y2="205" stroke="#cbd5e1" stroke-width="1"/><rect x="90" y="105" width="50" height="100" fill="#3b82f6" rx="4"/><text x="115" y="222" text-anchor="middle" font-size="11" fill="#475569">Ocak</text><text x="115" y="100" text-anchor="middle" font-size="10" fill="#3b82f6" font-weight="bold">200</text><rect x="180" y="55" width="50" height="150" fill="#10b981" rx="4"/><text x="205" y="222" text-anchor="middle" font-size="11" fill="#475569">Şubat</text><text x="205" y="50" text-anchor="middle" font-size="10" fill="#10b981" font-weight="bold">300</text><rect x="270" y="80" width="50" height="125" fill="#f59e0b" rx="4"/><text x="295" y="222" text-anchor="middle" font-size="11" fill="#475569">Mart</text><text x="295" y="75" text-anchor="middle" font-size="10" fill="#f59e0b" font-weight="bold">250</text></svg>`,
    options: [
      { label: 'A', text: '%25' },
      { label: 'B', text: '%50' },
      { label: 'C', text: '%75' },
      { label: 'D', text: '%100' },
      { label: 'E', text: '%150' },
    ],
    correctAnswer: 1, solution: 'Ocak: 200, Şubat: 300. Artış: (300-200)/200 × 100 = %50.',
    tags: ['grafik', 'yüzde', 'artış'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-say-cz', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-muhakeme', difficulty: 'cok-zor',
    questionText: 'Aşağıdaki grafiğe göre, 100.000 TL ile başlayan bir yatırımcının 3 yıl sonundaki toplam getiri oranı (bileşik) yaklaşık yüzde kaçtır?',
    svg: `<svg viewBox="0 0 380 180" xmlns="http://www.w3.org/2000/svg"><rect width="380" height="180" fill="#f8fafc"/><text x="190" y="18" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">Yatırım Fonu Yıllık Getiri</text><line x1="60" y1="140" x2="340" y2="140" stroke="#cbd5e1" stroke-width="1"/><line x1="60" y1="80" x2="340" y2="80" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/><text x="55" y="84" text-anchor="end" font-size="9" fill="#94a3b8">%0</text><line x1="60" y1="40" x2="340" y2="40" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/><text x="55" y="44" text-anchor="end" font-size="9" fill="#94a3b8">+%15</text><line x1="60" y1="120" x2="340" y2="120" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/><text x="55" y="124" text-anchor="end" font-size="9" fill="#94a3b8">-%8</text><rect x="100" y="42" width="55" height="38" fill="#10b981" rx="4"/><text x="127" y="37" text-anchor="middle" font-size="11" font-weight="bold" fill="#10b981">+%12</text><text x="127" y="155" text-anchor="middle" font-size="10" fill="#475569">1. Yıl</text><rect x="195" y="80" width="55" height="40" fill="#ef4444" rx="4"/><text x="222" y="75" text-anchor="middle" font-size="11" font-weight="bold" fill="#ef4444">−%8</text><text x="222" y="155" text-anchor="middle" font-size="10" fill="#475569">2. Yıl</text><rect x="290" y="40" width="55" height="40" fill="#10b981" rx="4"/><text x="317" y="35" text-anchor="middle" font-size="11" font-weight="bold" fill="#10b981">+%15</text><text x="317" y="155" text-anchor="middle" font-size="10" fill="#475569">3. Yıl</text><text x="190" y="175" text-anchor="middle" font-size="10" fill="#64748b">Başlangıç: 100.000 TL</text></svg>`,
    options: [
      { label: 'A', text: '%17.5' },
      { label: 'B', text: '%18.3' },
      { label: 'C', text: '%19.0' },
      { label: 'D', text: '%20.1' },
      { label: 'E', text: '%21.7' },
    ],
    correctAnswer: 1, solution: '100.000 × 1.12 = 112.000 → 112.000 × 0.92 = 103.040 → 103.040 × 1.15 = 118.496. Toplam getiri: (118.496 - 100.000) / 100.000 = %18.496 ≈ %18.3.',
    tags: ['bileşik getiri', 'yatırım', 'çok adımlı'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },

  // ============================================================
  // 2. SÖZEL YETENEK — Sözel Muhakeme (5 soru)
  // ============================================================
  {
    id: 'seed-soz-ck', categoryId: 'sozel-yetenek', subModuleId: 'sozel-muhakeme', difficulty: 'cok-kolay',
    questionText: '"ABC Şirketi, 2023 yılında çalışan sayısını 500\'den 650\'ye çıkarmıştır." Bu metne göre aşağıdaki ifadelerden hangisi kesinlikle doğrudur?',
    options: [
      { label: 'A', text: 'ABC Şirketi büyüme dönemindedir' },
      { label: 'B', text: 'ABC Şirketi 150 yeni çalışan işe almıştır' },
      { label: 'C', text: 'ABC Şirketi sektör lideridir' },
      { label: 'D', text: 'ABC Şirketi kârlı bir şirkettir' },
      { label: 'E', text: 'ABC Şirketi yurt dışına açılmaktadır' },
    ],
    correctAnswer: 1, solution: 'Metinde sadece çalışan sayısının 500\'den 650\'ye çıktığı belirtilmiştir. 650-500=150 yeni çalışan. Diğer seçenekler metinden çıkarılamaz.',
    tags: ['metin anlama', 'doğru/yanlış'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-soz-k', categoryId: 'sozel-yetenek', subModuleId: 'sozel-muhakeme', difficulty: 'kolay',
    questionText: '"Uzaktan çalışma modeli, çalışanların iş-yaşam dengesini iyileştirirken, bazı araştırmalar ekip içi iletişimin zayıfladığını ortaya koymaktadır." Bu metne göre aşağıdakilerden hangisi söylenebilir?',
    options: [
      { label: 'A', text: 'Uzaktan çalışma her açıdan faydalıdır' },
      { label: 'B', text: 'Uzaktan çalışmanın hem olumlu hem olumsuz yönleri vardır' },
      { label: 'C', text: 'Uzaktan çalışma kaldırılmalıdır' },
      { label: 'D', text: 'Tüm çalışanlar uzaktan çalışmayı tercih etmektedir' },
      { label: 'E', text: 'Ekip içi iletişim yüz yüze çalışmada da zayıftır' },
    ],
    correctAnswer: 1, solution: 'Metin hem olumlu (iş-yaşam dengesi) hem olumsuz (iletişim zayıflaması) bir durum sunmaktadır. Sadece B seçeneği bu iki yönü doğru yansıtır.',
    tags: ['çıkarım', 'dengeli yorum'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-soz-o', categoryId: 'sozel-yetenek', subModuleId: 'sozel-muhakeme', difficulty: 'orta',
    questionText: '"Şirketimizin müşteri memnuniyet anketi sonuçlarına göre, ürün kalitesinden memnuniyet %85 iken, teslimat süresinden memnuniyet %62\'dir. Geçen yıl teslimat memnuniyeti %58 idi." Aşağıdakilerden hangisi bu metne göre kesin olarak SÖYLENEMEZ?',
    options: [
      { label: 'A', text: 'Ürün kalitesi memnuniyeti teslimat memnuniyetinden yüksektir' },
      { label: 'B', text: 'Teslimat memnuniyetinde geçen yıla göre iyileşme vardır' },
      { label: 'C', text: 'Ürün kalitesi memnuniyeti geçen yıla göre artmıştır' },
      { label: 'D', text: 'Teslimat süresi hâlâ geliştirilmesi gereken bir alandır' },
      { label: 'E', text: '%85 ürün memnuniyeti yüksek bir orandır' },
    ],
    correctAnswer: 2, solution: 'Metinde ürün kalitesi memnuniyetinin geçen yılki değeri verilmemiştir. Bu nedenle artıp artmadığı söylenemez. Diğer seçenekler metinden çıkarılabilir.',
    tags: ['söylenemez', 'çıkarım', 'anket'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-soz-z', categoryId: 'sozel-yetenek', subModuleId: 'sozel-muhakeme', difficulty: 'zor',
    questionText: '"Yapay zeka teknolojileri iş gücü piyasasını dönüştürmektedir. Rutin ve tekrarlayan görevler otomasyona devredilirken, yaratıcı düşünme ve problem çözme becerileri gerektiren roller önem kazanmaktadır. Ancak bu dönüşümün hızı sektörlere göre farklılık göstermektedir." Aşağıdaki çıkarımlardan hangisi metnin mantıksal uzantısı olarak EN GÜÇLÜdür?',
    options: [
      { label: 'A', text: 'Tüm işler yakında yapay zeka tarafından yapılacaktır' },
      { label: 'B', text: 'Bazı sektörlerde çalışanların uyum süreci diğerlerinden daha acil olabilir' },
      { label: 'C', text: 'Yaratıcı meslekler hiçbir zaman etkilenmeyecektir' },
      { label: 'D', text: 'Otomasyon sadece mavi yakalı işleri etkilemektedir' },
      { label: 'E', text: 'İş gücü piyasasında herhangi bir değişim yaşanmayacaktır' },
    ],
    correctAnswer: 1, solution: 'Dönüşüm hızının sektörlere göre farklılık göstermesi, bazı sektörlerdeki çalışanların daha hızlı uyum sağlaması gerektiğini ima eder. B seçeneği metnin mantıksal uzantısıdır.',
    tags: ['çıkarım', 'güçlü argüman', 'yapay zeka'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-soz-cz', categoryId: 'sozel-yetenek', subModuleId: 'sozel-muhakeme', difficulty: 'cok-zor',
    questionText: 'Metin 1: "X Şirketi son 5 yılda AR-GE bütçesini her yıl %20 artırmıştır." Metin 2: "Sektör ortalamasında AR-GE harcamaları gelirin %3-5\'i arasındadır. X Şirketi\'nin geliri son 5 yılda yıllık %30 artmıştır." Bu iki metni birlikte değerlendirdiğinizde aşağıdakilerden hangisi DOĞRU olabilir?',
    options: [
      { label: 'A', text: 'X Şirketi kesinlikle sektör ortalamasının üzerinde AR-GE harcaması yapmaktadır' },
      { label: 'B', text: 'X Şirketi\'nin AR-GE harcamalarının gelire oranı zamanla düşüyor olabilir' },
      { label: 'C', text: 'X Şirketi AR-GE\'ye yeterli kaynak ayırmamaktadır' },
      { label: 'D', text: 'AR-GE bütçesi gelir artışından hızlı büyümektedir' },
      { label: 'E', text: 'X Şirketi rakiplerinden daha inovatiftir' },
    ],
    correctAnswer: 1, solution: 'Gelir %30/yıl, AR-GE bütçesi %20/yıl artıyor. Gelir daha hızlı büyüdüğü için AR-GE\'nin gelire oranı zamanla düşüyor olabilir. D yanlış çünkü AR-GE daha yavaş büyüyor. A kesin değil çünkü başlangıç oranını bilmiyoruz.',
    tags: ['çapraz kaynak', 'oran analizi', 'çıkarım'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },

  // ============================================================
  // 3. MANTIKSAL & AKIL YÜRÜTME — Tümevarımsal (5 soru)
  // ============================================================
  {
    id: 'seed-man-ck', categoryId: 'mantiksal-akil-yurutme', subModuleId: 'tumevarimsal', difficulty: 'cok-kolay',
    questionText: 'Aşağıdaki şekil serisinde sıradaki şekil hangisidir?',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="80" fill="#f8fafc"/><circle cx="50" cy="40" r="20" fill="#3b82f6"/><circle cx="130" cy="40" r="20" fill="#ef4444"/><circle cx="210" cy="40" r="20" fill="#3b82f6"/><circle cx="290" cy="40" r="20" fill="#ef4444"/><text x="365" y="45" text-anchor="middle" font-size="24" fill="#94a3b8">?</text></svg>`,
    options: [
      { label: 'A', text: 'Mavi daire', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="#3b82f6"/></svg>` },
      { label: 'B', text: 'Kırmızı daire', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="#ef4444"/></svg>` },
      { label: 'C', text: 'Mavi kare', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="40" height="40" fill="#3b82f6"/></svg>` },
      { label: 'D', text: 'Kırmızı kare', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="40" height="40" fill="#ef4444"/></svg>` },
      { label: 'E', text: 'Yeşil daire', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="#10b981"/></svg>` },
    ],
    correctAnswer: 0, solution: 'Seri: mavi, kırmızı, mavi, kırmızı şeklinde dönüşümlü devam etmektedir. Sıradaki mavi dairedir.',
    tags: ['şekil serisi', 'renk örüntüsü'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-man-k', categoryId: 'mantiksal-akil-yurutme', subModuleId: 'tumevarimsal', difficulty: 'kolay',
    questionText: 'Serideki şekillerin kenar sayısı bir örüntü izliyor. Sıradaki şekil hangisidir?',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="80" fill="#f8fafc"/><polygon points="50,20 70,60 30,60" fill="#8b5cf6"/><rect x="110" y="20" width="40" height="40" fill="#8b5cf6"/><polygon points="210,20 240,30 250,60 190,60 180,30" fill="#8b5cf6"/><polygon points="310,20 340,30 345,55 300,65 275,40" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4"/><text x="310" y="48" text-anchor="middle" font-size="16" fill="#94a3b8">?</text></svg>`,
    options: [
      { label: 'A', text: 'Üçgen (3 kenar)', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><polygon points="25,5 45,45 5,45" fill="#8b5cf6"/></svg>` },
      { label: 'B', text: 'Kare (4 kenar)', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="40" height="40" fill="#8b5cf6"/></svg>` },
      { label: 'C', text: 'Beşgen (5 kenar)', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><polygon points="25,5 47,20 40,45 10,45 3,20" fill="#8b5cf6"/></svg>` },
      { label: 'D', text: 'Altıgen (6 kenar)', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><polygon points="25,3 45,15 45,35 25,47 5,35 5,15" fill="#8b5cf6"/></svg>` },
      { label: 'E', text: 'Daire', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="22" fill="#8b5cf6"/></svg>` },
    ],
    correctAnswer: 3, solution: 'Seri: 3 kenar (üçgen) → 4 kenar (kare) → 5 kenar (beşgen) → 6 kenar (altıgen). Her adımda kenar sayısı 1 artıyor.',
    tags: ['kenar sayısı', 'artış örüntüsü'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-man-o', categoryId: 'mantiksal-akil-yurutme', subModuleId: 'tumevarimsal', difficulty: 'orta',
    questionText: 'Aşağıdaki seride her adımda şekil 90° saat yönünde dönüyor ve rengi değişiyor (mavi→yeşil→kırmızı→mavi...). 4. adımdaki şeklin rengi ve yönü nedir?',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="80" fill="#f8fafc"/><polygon points="50,20 70,60 30,60" fill="#3b82f6"/><polygon points="110,30 150,50 110,50" fill="#10b981"/><polygon points="150,60 130,20 170,20" fill="#ef4444"/><text x="240" y="48" text-anchor="middle" font-size="16" fill="#94a3b8">4. ?</text></svg>`,
    options: [
      { label: 'A', text: 'Sola bakan mavi üçgen', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><polygon points="40,5 40,45 5,25" fill="#3b82f6"/></svg>` },
      { label: 'B', text: 'Yukarı bakan yeşil üçgen', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><polygon points="25,5 45,45 5,45" fill="#10b981"/></svg>` },
      { label: 'C', text: 'Sola bakan kırmızı üçgen', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><polygon points="40,5 40,45 5,25" fill="#ef4444"/></svg>` },
      { label: 'D', text: 'Aşağı bakan mavi üçgen', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><polygon points="5,5 45,5 25,45" fill="#3b82f6"/></svg>` },
      { label: 'E', text: 'Sağa bakan mavi üçgen', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><polygon points="5,5 45,25 5,45" fill="#3b82f6"/></svg>` },
    ],
    correctAnswer: 0, solution: 'Dönüş: aşağı→sağ→yukarı→sol (90° saat yönünde). Renk: mavi→yeşil→kırmızı→mavi. 4. adım: sola bakan mavi üçgen.',
    tags: ['dönüş', 'renk döngüsü', 'çift kural'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-man-z', categoryId: 'mantiksal-akil-yurutme', subModuleId: 'tumevarimsal', difficulty: 'zor',
    questionText: 'Aşağıdaki 3×3 matristeki örüntüde her satırda üçgen sayısı 1 artıyor, her sütunda daire sayısı 1 artıyor. "?" hücresinde kaç şekil vardır?',
    svg: `<svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="280" fill="#f8fafc"/><text x="75" y="20" text-anchor="middle" font-size="10" fill="#64748b">Sütun 1</text><text x="180" y="20" text-anchor="middle" font-size="10" fill="#64748b">Sütun 2</text><text x="285" y="20" text-anchor="middle" font-size="10" fill="#64748b">Sütun 3</text><rect x="20" y="30" width="105" height="70" fill="white" stroke="#e2e8f0" stroke-width="1.5"/><polygon points="50,50 60,70 40,70" fill="#8b5cf6"/><circle cx="80" cy="60" r="8" fill="#3b82f6"/><rect x="125" y="30" width="105" height="70" fill="white" stroke="#e2e8f0" stroke-width="1.5"/><polygon points="145,50 155,70 135,70" fill="#8b5cf6"/><circle cx="180" cy="55" r="7" fill="#3b82f6"/><circle cx="200" cy="65" r="7" fill="#3b82f6"/><rect x="230" y="30" width="105" height="70" fill="white" stroke="#e2e8f0" stroke-width="1.5"/><polygon points="250,50 260,70 240,70" fill="#8b5cf6"/><circle cx="280" cy="50" r="7" fill="#3b82f6"/><circle cx="300" cy="60" r="7" fill="#3b82f6"/><circle cx="290" cy="75" r="7" fill="#3b82f6"/><rect x="20" y="105" width="105" height="70" fill="white" stroke="#e2e8f0" stroke-width="1.5"/><polygon points="40,125 50,145 30,145" fill="#8b5cf6"/><polygon points="65,125 75,145 55,145" fill="#8b5cf6"/><circle cx="95" cy="135" r="8" fill="#3b82f6"/><rect x="125" y="105" width="105" height="70" fill="white" stroke="#e2e8f0" stroke-width="1.5"/><polygon points="140,125 150,145 130,145" fill="#8b5cf6"/><polygon points="165,125 175,145 155,145" fill="#8b5cf6"/><circle cx="195" cy="125" r="7" fill="#3b82f6"/><circle cx="205" cy="145" r="7" fill="#3b82f6"/><rect x="230" y="105" width="105" height="70" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="4"/><text x="282" y="145" text-anchor="middle" font-size="11" fill="#94a3b8">...</text><rect x="20" y="180" width="105" height="70" fill="white" stroke="#e2e8f0" stroke-width="1.5"/><polygon points="35,200 45,220 25,220" fill="#8b5cf6"/><polygon points="60,200 70,220 50,220" fill="#8b5cf6"/><polygon points="85,200 95,220 75,220" fill="#8b5cf6"/><circle cx="110" cy="210" r="7" fill="#3b82f6"/><rect x="125" y="180" width="105" height="70" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="4"/><text x="177" y="220" text-anchor="middle" font-size="11" fill="#94a3b8">...</text><rect x="230" y="180" width="105" height="70" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><text x="282" y="222" text-anchor="middle" font-size="20" font-weight="bold" fill="#f59e0b">?</text></svg>`,
    options: [
      { label: 'A', text: '4 şekil (2 üçgen, 2 daire)' },
      { label: 'B', text: '5 şekil (3 üçgen, 2 daire)' },
      { label: 'C', text: '5 şekil (2 üçgen, 3 daire)' },
      { label: 'D', text: '6 şekil (3 üçgen, 3 daire)' },
      { label: 'E', text: '4 şekil (3 üçgen, 1 daire)' },
    ],
    correctAnswer: 3, solution: 'Satır 3: üçgen sayısı = satır numarası = 3. Sütun 3: daire sayısı = sütun numarası = 3. Toplam: 3+3 = 6 şekil.',
    tags: ['matris', 'çift değişken'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-man-cz', categoryId: 'mantiksal-akil-yurutme', subModuleId: 'tumevarimsal', difficulty: 'cok-zor',
    questionText: 'Bir seride: (1) şeklin kenar sayısı her adımda 1 artar, (2) dolgu rengi R→G→B döngüsünde ilerler, (3) boyut küçük→orta→büyük→küçük döngüsünde ilerler. 7. adımdaki şekil nasıldır?',
    options: [
      { label: 'A', text: 'Büyük mavi dokuzgen' },
      { label: 'B', text: 'Küçük mavi dokuzgen' },
      { label: 'C', text: 'Küçük kırmızı dokuzgen' },
      { label: 'D', text: 'Orta yeşil sekizgen' },
      { label: 'E', text: 'Büyük yeşil dokuzgen' },
    ],
    correctAnswer: 2, solution: 'Adım 7: Kenar = 3+6 = 9 (dokuzgen). Renk: R,G,B,R,G,B,R → 7. adım R (kırmızı). Boyut: K,O,B,K,O,B,K → 7. adım K (küçük). Cevap: Küçük kırmızı dokuzgen.',
    tags: ['üçlü kural', 'döngü', 'karmaşık örüntü'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },

  // ============================================================
  // 4. ELEŞTİREL DÜŞÜNME — Argümanlar (5 soru)
  // ============================================================
  {
    id: 'seed-ele-ck', categoryId: 'elestirel-dusunme', subModuleId: 'argumanlar', difficulty: 'cok-kolay',
    questionText: 'İddia: "Şirketler çalışanlarına yılda en az 40 saat eğitim vermelidir." Argüman: "Çünkü eğitim, çalışanların yetkinliklerini artırır." Bu argüman güçlü müdür?',
    options: [
      { label: 'A', text: 'Güçlü — doğrudan iddiayı destekliyor' },
      { label: 'B', text: 'Zayıf — eğitim her zaman faydalı değildir' },
      { label: 'C', text: 'Zayıf — maliyet göz ardı ediliyor' },
      { label: 'D', text: 'Güçlü — yasal zorunluluk var' },
      { label: 'E', text: 'Değerlendirilemez — yeterli bilgi yok' },
    ],
    correctAnswer: 0, solution: 'Argüman doğrudan iddiayı desteklemektedir: eğitim yetkinlik artırır, bu da eğitim verilmesi gerektiğini destekler. Bu güçlü bir argümandır.',
    tags: ['argüman değerlendirme', 'güçlü/zayıf'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-ele-k', categoryId: 'elestirel-dusunme', subModuleId: 'argumanlar', difficulty: 'kolay',
    questionText: 'İddia: "Açık ofis planı terk edilmelidir." Argüman: "Açık ofis planında gürültü seviyesi yüksektir ve bu konsantrasyonu düşürür." Bu argüman güçlü müdür?',
    options: [
      { label: 'A', text: 'Güçlü — somut bir sorun belirtip iddiayı destekliyor' },
      { label: 'B', text: 'Zayıf — gürültü kulaklıkla çözülebilir' },
      { label: 'C', text: 'Zayıf — açık ofis iletişimi artırır' },
      { label: 'D', text: 'Güçlü — açık ofis modası geçmiştir' },
      { label: 'E', text: 'Zayıf — konuyla ilgisiz' },
    ],
    correctAnswer: 0, solution: 'Argüman somut bir problemi (gürültü → konsantrasyon düşüşü) belirterek iddiayı doğrudan desteklemektedir. Güçlü bir argümandır.',
    tags: ['argüman', 'iş ortamı'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-ele-o', categoryId: 'elestirel-dusunme', subModuleId: 'argumanlar', difficulty: 'orta',
    questionText: 'İddia: "Esnek çalışma saatleri tüm çalışanlara sunulmalıdır." Argüman: "Bir ankette çalışanların %72\'si esnek saatleri tercih ettiğini belirtmiştir." Bu argüman güçlü müdür, zayıf mıdır?',
    options: [
      { label: 'A', text: 'Güçlü — çoğunluk istiyor' },
      { label: 'B', text: 'Zayıf — tercih, gereklilik anlamına gelmez' },
      { label: 'C', text: 'Güçlü — istatistiksel kanıt var' },
      { label: 'D', text: 'Zayıf — anketin güvenilirliği bilinmiyor' },
      { label: 'E', text: 'Orta güçte — destekliyor ama eksik' },
    ],
    correctAnswer: 4, solution: 'Argüman istatistiksel veri sunarak iddiayı destekliyor (güçlü yönü) ancak tercih ile iş verimliliği/gereklilik arasında bağ kurmuyor (eksik yönü). Orta güçte bir argümandır.',
    tags: ['argüman', 'anket', 'nüanslı'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-ele-z', categoryId: 'elestirel-dusunme', subModuleId: 'argumanlar', difficulty: 'zor',
    questionText: 'İddia: "Yapay zeka destekli işe alım sistemleri kullanılmamalıdır." Aşağıdaki argümanlardan hangisi bu iddiaya karşı EN GÜÇLÜ karşıt argümandır?',
    options: [
      { label: 'A', text: 'YZ sistemleri hızlıdır ve zamandan tasarruf sağlar' },
      { label: 'B', text: 'YZ sistemleri insan önyargılarını ortadan kaldırarak daha adil seçim yapabilir' },
      { label: 'C', text: 'Birçok büyük şirket YZ kullanmaktadır' },
      { label: 'D', text: 'YZ teknolojisi her alanda yaygınlaşmaktadır' },
      { label: 'E', text: 'YZ sistemleri maliyetleri düşürür' },
    ],
    correctAnswer: 1, solution: 'En güçlü karşıt argüman B\'dir çünkü adalet/etik boyutunu doğrudan ele alarak "kullanılmamalı" iddiasının temel gerekçesine (potansiyel önyargı) cevap verir. Diğerleri pratik faydalar sunsa da temel etik kaygıyı yanıtlamaz.',
    tags: ['karşıt argüman', 'YZ', 'etik'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-ele-cz', categoryId: 'elestirel-dusunme', subModuleId: 'argumanlar', difficulty: 'cok-zor',
    questionText: 'İddia: "Asgari ücret %40 artırılmalıdır." Aşağıdaki argüman setinden hangisi hem güçlü bir destekleyici hem de güçlü bir karşıt argüman içerir?',
    options: [
      { label: 'A', text: 'Destekleyici: Enflasyon son yıl %35 oldu. Karşıt: KOBİ\'ler bu maliyeti kaldıramaz ve işten çıkarmalar artabilir.' },
      { label: 'B', text: 'Destekleyici: Çalışanlar mutsuz. Karşıt: Firmalar kâr etmeli.' },
      { label: 'C', text: 'Destekleyici: Diğer ülkelerde de artıyor. Karşıt: Türkiye farklı bir ekonomi.' },
      { label: 'D', text: 'Destekleyici: Herkes daha çok para ister. Karşıt: Para her şey değildir.' },
      { label: 'E', text: 'Destekleyici: Satın alma gücü düştü. Karşıt: Vergi indirimi alternatif olabilir.' },
    ],
    correctAnswer: 0, solution: 'A şıkkı en güçlü çifti içerir: Enflasyon verisi somut ve ölçülebilir bir destekleyici argümandır. KOBİ etkisi ise somut bir ekonomik karşıt argümandır. Diğer şıklar ya yüzeysel ya da dolaylıdır.',
    tags: ['argüman çifti', 'ekonomi', 'değerlendirme'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },

  // ============================================================
  // 5. DİKKAT & HATA BULMA (5 soru)
  // ============================================================

  // ============================================================
  // 6. MEKANİK AKIL YÜRÜTME (5 soru)
  // ============================================================
  {
    id: 'seed-mek-ck', categoryId: 'mekanik-akil-yurutme', subModuleId: 'mekanik', difficulty: 'cok-kolay',
    questionText: 'Bir dişli saat yönünde dönüyorsa, ona bağlı olan ikinci dişli hangi yönde döner?',
    svg: `<svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="150" fill="#f8fafc"/><circle cx="90" cy="75" r="35" fill="none" stroke="#3b82f6" stroke-width="3"/><text x="90" y="79" text-anchor="middle" font-size="11" fill="#3b82f6" font-weight="bold">A</text><path d="M115 60 L125 55 L118 65" fill="#3b82f6"/><circle cx="175" cy="75" r="30" fill="none" stroke="#ef4444" stroke-width="3"/><text x="175" y="79" text-anchor="middle" font-size="11" fill="#ef4444" font-weight="bold">B</text><text x="133" y="78" text-anchor="middle" font-size="16" fill="#64748b">⚙</text><text x="90" y="120" text-anchor="middle" font-size="10" fill="#64748b">Saat yönü →</text></svg>`,
    options: [
      { label: 'A', text: 'Saat yönünde' },
      { label: 'B', text: 'Saat yönünün tersine' },
      { label: 'C', text: 'Aynı yönde (saat yönü)' },
      { label: 'D', text: 'Dönmez' },
      { label: 'E', text: 'Bilinemez' },
    ],
    correctAnswer: 1, solution: 'Birbirine bağlı iki dişli her zaman ters yönde döner. A saat yönünde dönüyorsa, B saat yönünün tersine döner.',
    tags: ['dişli', 'dönüş yönü'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-mek-k', categoryId: 'mekanik-akil-yurutme', subModuleId: 'mekanik', difficulty: 'kolay',
    questionText: 'Aşağıdaki terazide denge sağlanması için sol kefeye kaç kg eklenmeli?',
    svg: `<svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="180" fill="#f8fafc"/><polygon points="180,140 170,160 190,160" fill="#64748b"/><line x1="60" y1="140" x2="300" y2="140" stroke="#334155" stroke-width="3"/><line x1="180" y1="140" x2="180" y2="160" stroke="#64748b" stroke-width="3"/><rect x="40" y="120" width="60" height="20" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="3"/><text x="70" y="135" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e40af">3 kg</text><rect x="260" y="120" width="60" height="20" fill="#fce7f3" stroke="#ec4899" stroke-width="2" rx="3"/><text x="290" y="135" text-anchor="middle" font-size="12" font-weight="bold" fill="#be185d">5 kg</text><rect x="110" y="122" width="40" height="16" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4" rx="3"/><text x="130" y="134" text-anchor="middle" font-size="11" fill="#94a3b8">? kg</text><text x="70" y="112" text-anchor="middle" font-size="10" fill="#64748b">Sol kefe</text><text x="290" y="112" text-anchor="middle" font-size="10" fill="#64748b">Sağ kefe</text></svg>`,
    options: [
      { label: 'A', text: '1 kg' },
      { label: 'B', text: '2 kg' },
      { label: 'C', text: '3 kg' },
      { label: 'D', text: '5 kg' },
      { label: 'E', text: '8 kg' },
    ],
    correctAnswer: 1, solution: 'Denge için iki taraf eşit olmalı: Sol=3+x, Sağ=5. x=5-3=2 kg.',
    tags: ['terazi', 'denge'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-mek-o', categoryId: 'mekanik-akil-yurutme', subModuleId: 'mekanik', difficulty: 'orta',
    questionText: 'Aşağıdaki üç dişli sisteminde A dişlisi saat yönünde dönüyor. C dişlisi hangi yönde döner?',
    svg: `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="160" fill="#f8fafc"/><circle cx="80" cy="80" r="38" fill="none" stroke="#3b82f6" stroke-width="3"/><text x="80" y="84" text-anchor="middle" font-size="16" font-weight="bold" fill="#3b82f6">A</text><path d="M105 60 L115 53 L108 67" fill="#3b82f6"/><text x="80" y="130" text-anchor="middle" font-size="10" fill="#3b82f6">Saat yönü →</text><circle cx="185" cy="80" r="32" fill="none" stroke="#f59e0b" stroke-width="3"/><text x="185" y="84" text-anchor="middle" font-size="16" font-weight="bold" fill="#f59e0b">B</text><circle cx="280" cy="80" r="36" fill="none" stroke="#ef4444" stroke-width="3"/><text x="280" y="84" text-anchor="middle" font-size="16" font-weight="bold" fill="#ef4444">C</text><text x="280" y="130" text-anchor="middle" font-size="14" fill="#94a3b8">?</text><line x1="118" y1="80" x2="153" y2="80" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3"/><line x1="217" y1="80" x2="244" y2="80" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3"/><path d="M56 65 A38 38 0 0 1 104 65" fill="none" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arr)"/></svg>`,
    options: [
      { label: 'A', text: 'Saat yönünde' },
      { label: 'B', text: 'Saat yönünün tersine' },
      { label: 'C', text: 'Dönmez' },
      { label: 'D', text: 'Bazen saat yönü, bazen tersi' },
      { label: 'E', text: 'A ile aynı hızda döner' },
    ],
    correctAnswer: 0, solution: 'A saat yönü → B ters yön → C saat yönü. Her bağlantıda yön değişir. 2 bağlantı olduğunda son dişli ilk dişli ile aynı yönde döner.',
    tags: ['dişli zinciri', '3 dişli'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-mek-z', categoryId: 'mekanik-akil-yurutme', subModuleId: 'mekanik', difficulty: 'zor',
    questionText: 'Aşağıdaki kaldıraçta denge sağlanması için X kaç kg olmalıdır?',
    svg: `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="160" fill="#f8fafc"/><line x1="50" y1="90" x2="350" y2="90" stroke="#334155" stroke-width="4" stroke-linecap="round"/><polygon points="200,90 190,120 210,120" fill="#64748b"/><line x1="200" y1="90" x2="200" y2="120" stroke="#64748b" stroke-width="2"/><rect x="70" y="65" width="40" height="25" fill="#3b82f6" rx="4"/><text x="90" y="82" text-anchor="middle" font-size="12" font-weight="bold" fill="white">8 kg</text><rect x="280" y="65" width="40" height="25" fill="#ef4444" rx="4"/><text x="300" y="82" text-anchor="middle" font-size="14" font-weight="bold" fill="white">X</text><line x1="90" y1="100" x2="200" y2="100" stroke="#3b82f6" stroke-width="1.5"/><text x="145" y="115" text-anchor="middle" font-size="11" fill="#3b82f6" font-weight="bold">60 cm</text><line x1="200" y1="100" x2="300" y2="100" stroke="#ef4444" stroke-width="1.5"/><text x="250" y="115" text-anchor="middle" font-size="11" fill="#ef4444" font-weight="bold">40 cm</text><circle cx="90" cy="100" r="2" fill="#3b82f6"/><circle cx="200" cy="100" r="2" fill="#64748b"/><circle cx="300" cy="100" r="2" fill="#ef4444"/><text x="200" y="140" text-anchor="middle" font-size="10" fill="#64748b">▲ Destek Noktası</text></svg>`,
    options: [
      { label: 'A', text: '8 kg' },
      { label: 'B', text: '10 kg' },
      { label: 'C', text: '12 kg' },
      { label: 'D', text: '14 kg' },
      { label: 'E', text: '16 kg' },
    ],
    correctAnswer: 2, solution: 'Moment dengesi: 8 × 60 = X × 40 → 480 = 40X → X = 12 kg.',
    tags: ['kaldıraç', 'moment', 'denge'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-mek-cz', categoryId: 'mekanik-akil-yurutme', subModuleId: 'mekanik', difficulty: 'cok-zor',
    questionText: 'Aşağıdaki makara sisteminde 100 kg yükü kaldırmak için kaç Newton kuvvet uygulanmalıdır? (g=10 m/s², sürtünme yok)',
    svg: `<svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="280" fill="#f8fafc"/><rect x="110" y="10" width="80" height="12" fill="#64748b" rx="2"/><line x1="150" y1="22" x2="150" y2="45" stroke="#334155" stroke-width="2"/><circle cx="150" cy="55" r="15" fill="none" stroke="#3b82f6" stroke-width="2.5"/><circle cx="150" cy="55" r="3" fill="#3b82f6"/><text x="180" y="60" font-size="9" fill="#3b82f6" font-weight="bold">Sabit</text><line x1="135" y1="55" x2="135" y2="120" stroke="#334155" stroke-width="1.5"/><line x1="165" y1="55" x2="165" y2="200" stroke="#334155" stroke-width="1.5"/><circle cx="135" cy="130" r="13" fill="none" stroke="#ef4444" stroke-width="2.5"/><circle cx="135" cy="130" r="3" fill="#ef4444"/><text x="105" y="135" font-size="8" fill="#ef4444" font-weight="bold">H1</text><line x1="122" y1="130" x2="122" y2="190" stroke="#334155" stroke-width="1.5"/><line x1="148" y1="130" x2="165" y2="150" stroke="#334155" stroke-width="1.5"/><circle cx="122" cy="200" r="12" fill="none" stroke="#f59e0b" stroke-width="2.5"/><circle cx="122" cy="200" r="3" fill="#f59e0b"/><text x="92" y="205" font-size="8" fill="#f59e0b" font-weight="bold">H2</text><rect x="95" y="225" width="55" height="35" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" rx="4"/><text x="122" y="247" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">100 kg</text><line x1="122" y1="212" x2="122" y2="225" stroke="#334155" stroke-width="1.5"/><text x="175" y="210" font-size="10" fill="#334155">F = ?</text><path d="M170 195 L170 220" stroke="#10b981" stroke-width="2" marker-end="url(#arrowG)"/><defs><marker id="arrowG" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#10b981"/></marker></defs></svg>`,
    options: [
      { label: 'A', text: '100 N' },
      { label: 'B', text: '250 N' },
      { label: 'C', text: '333 N' },
      { label: 'D', text: '500 N' },
      { label: 'E', text: '1000 N' },
    ],
    correctAnswer: 1, solution: 'Yükün ağırlığı: 100 × 10 = 1000 N. 2 hareketli makara mekanik avantajı 4 kat sağlar (her hareketli makara 2 kat). Gerekli kuvvet: 1000/4 = 250 N.',
    tags: ['makara', 'mekanik avantaj', 'kuvvet'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },

  // ============================================================
  // 7. DURUMSAL YARGI — SJT (5 soru)
  // ============================================================
  {
    id: 'seed-sjt-ck', categoryId: 'durumsal-yargi', subModuleId: 'sjt', difficulty: 'cok-kolay',
    questionText: 'Yeni bir çalışan olarak ilk gününüzde masanızda beklerken, yanınızdaki meslektaşınız sizi fark etmeden telefonla konuşuyor. Ne yaparsınız?',
    options: [
      { label: 'A', text: 'Telefon görüşmesinin bitmesini bekler, sonra kendinizi tanıtırsınız' },
      { label: 'B', text: 'Görüşmeyi yarıda keserek kendinizi tanıtırsınız' },
      { label: 'C', text: 'Hiçbir şey yapmadan iş yapmaya başlarsınız' },
      { label: 'D', text: 'Yöneticinizi arayarak şikayette bulunursunuz' },
      { label: 'E', text: 'Başka bir yere oturmaya çalışırsınız' },
    ],
    correctAnswer: 0, solution: 'En uygun davranış saygılı ve sabırlı olmaktır. Görüşmenin bitmesini bekleyip sonra tanışmak profesyonel ve nazik bir yaklaşımdır.',
    tags: ['ilk gün', 'nezaket', 'sabır'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-sjt-k', categoryId: 'durumsal-yargi', subModuleId: 'sjt', difficulty: 'kolay',
    questionText: 'Bir toplantıda patronunuz bir fikir sunuyor, ancak siz bu fikrin uygulanmasında ciddi bir sorun olduğunu fark ediyorsunuz. Ne yaparsınız?',
    options: [
      { label: 'A', text: 'Toplantıda herkesin önünde sorunu hemen belirtirsiniz' },
      { label: 'B', text: 'Toplantıdan sonra patronunuzla özel olarak konuşursunuz' },
      { label: 'C', text: 'Hiçbir şey söylemez, sonuçları beklersiniz' },
      { label: 'D', text: 'Meslektaşlarınıza e-posta ile endişelerinizi iletirsiniz' },
      { label: 'E', text: 'Anonim bir şekilde geri bildirim gönderirsiniz' },
    ],
    correctAnswer: 1, solution: 'Toplantı sonrası özel konuşma en uygun yaklaşımdır. Patronunuzu herkesin önünde eleştirmek uygun değildir, ancak endişeyi dile getirmemek de sorumsuzluktur.',
    tags: ['patron', 'geri bildirim', 'diplomatik'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-sjt-o', categoryId: 'durumsal-yargi', subModuleId: 'sjt', difficulty: 'orta',
    questionText: 'Ekip arkadaşınız son zamanlarda performansı düşük ve bu sizin iş yükünüzü artırıyor. Durumu yöneticinize bildirmek istemiyorsunuz. Ne yaparsınız?',
    options: [
      { label: 'A', text: 'Arkadaşınızla özel olarak konuşup durumu sorarsınız' },
      { label: 'B', text: 'Ekstra iş yükünü sessizce üstlenirsiniz' },
      { label: 'C', text: 'Yöneticiye doğrudan şikayette bulunursunuz' },
      { label: 'D', text: 'Diğer ekip üyelerine durumu anlatıp destek ararsınız' },
      { label: 'E', text: 'Kendi iş yükünüzü azaltmak için bazı görevleri ertelersiniz' },
    ],
    correctAnswer: 0, solution: 'Önce doğrudan ve özel olarak konuşmak en uygun yaklaşımdır. Empati göstererek sorunu anlamaya çalışmak hem ilişkiyi korur hem de çözüme yönelir.',
    tags: ['ekip', 'performans', 'iletişim'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-sjt-z', categoryId: 'durumsal-yargi', subModuleId: 'sjt', difficulty: 'zor',
    questionText: 'Müşteri toplantısında meslektaşınız yanlış bir bilgi veriyor. Bu bilgi anlaşmayı etkileyebilir. Müşteri de sizin alanınızda bir soru soruyor. Ne yaparsınız?',
    options: [
      { label: 'A', text: 'Meslektaşınızı açıkça düzeltirsiniz' },
      { label: 'B', text: 'Soruyu yanıtlarken doğru bilgiyi dolaylı olarak eklersiniz' },
      { label: 'C', text: 'Sessiz kalır, toplantı sonrası meslektaşınızı uyarırsınız' },
      { label: 'D', text: 'Müşteriye "bu konuyu daha detaylı araştıralım" dersiniz' },
      { label: 'E', text: 'Meslektaşınızı görmezden gelip kendi alanınızdaki soruyu yanıtlarsınız' },
    ],
    correctAnswer: 1, solution: 'En profesyonel yaklaşım, soruyu yanıtlarken doğru bilgiyi doğal bir şekilde dahil etmektir. Bu hem meslektaşınızı utandırmaz hem de müşteriye doğru bilgi ulaşır.',
    tags: ['müşteri toplantısı', 'diplomatik düzeltme'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-sjt-cz', categoryId: 'durumsal-yargi', subModuleId: 'sjt', difficulty: 'cok-zor',
    questionText: 'Proje teslim tarihi yarın, ancak kalite testlerinde ciddi bir hata keşfedildi. Düzeltmek en az 3 gün sürecek. Müşteri gecikmeyi tolere etmeyeceğini ima etti. Yöneticiniz tatilde. Ne yaparsınız?',
    options: [
      { label: 'A', text: 'Hatayı düzeltmeden teslim eder, sonra güncelleme sözü verirsiniz' },
      { label: 'B', text: 'Yöneticinizi tatilde arayıp durumu anlatır, karar beklersiniz' },
      { label: 'C', text: 'Müşteriye durumu şeffaf şekilde anlatır, çözüm önerileriyle birlikte 3 gün ek süre istersiniz' },
      { label: 'D', text: 'Ekibi fazla mesaiye çağırıp 1 günde düzeltmeye çalışırsınız' },
      { label: 'E', text: 'Hatanın kritikliğini azaltarak rapor eder, teslimi yaparsınız' },
    ],
    correctAnswer: 2, solution: 'En etik ve profesyonel yaklaşım şeffaf olmaktır (C). Hatalı ürün teslim etmek (A,E) uzun vadede güveni sarsar. Yöneticiyi tatilde aramak (B) pasif kalma anlamına gelir. 1 günde düzeltme (D) gerçekçi değildir.',
    tags: ['kriz yönetimi', 'etik', 'müşteri ilişkileri'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },

  // ============================================================
  // 8. DEĞERLENDİRME MERKEZİ — In-Tray (5 soru)
  // ============================================================
  {
    id: 'seed-dm-ck', categoryId: 'degerlendirme-merkezi', subModuleId: 'in-tray', difficulty: 'cok-kolay',
    questionText: 'Gelen kutunuzda 3 e-posta var: (1) Müdürünüz: "Bugün 14:00\'teki toplantıya hazırlan", (2) IT: "Şifreniz yarın sona erecek", (3) Kantin: "Yeni menü hazır." İlk hangisini ele alırsınız?',
    options: [
      { label: 'A', text: 'Kantin menüsü' },
      { label: 'B', text: 'IT şifre uyarısı' },
      { label: 'C', text: 'Müdürün toplantı talimatı' },
      { label: 'D', text: 'Hepsini aynı anda' },
      { label: 'E', text: 'Hiçbiri — önce kahve alırım' },
    ],
    correctAnswer: 2, solution: 'Müdürün talimatı hem acil (bugün 14:00) hem de önemli (üst makamdan gelen). Önceliklendirmede acil + önemli olan ilk sıradadır.',
    tags: ['önceliklendirme', 'aciliyet'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-dm-k', categoryId: 'degerlendirme-merkezi', subModuleId: 'in-tray', difficulty: 'kolay',
    questionText: 'Sabah masanıza geldiğinizde 4 görev sizi bekliyor: (1) 10:00\'da müşteri sunumu, (2) Dün tamamlanması gereken rapor, (3) Yeni stajyeri karşılama (11:00), (4) Bilgisayar güncellemesi. Doğru öncelik sırası hangisidir?',
    options: [
      { label: 'A', text: '2 → 1 → 3 → 4' },
      { label: 'B', text: '1 → 2 → 3 → 4' },
      { label: 'C', text: '4 → 1 → 2 → 3' },
      { label: 'D', text: '1 → 3 → 2 → 4' },
      { label: 'E', text: '3 → 1 → 2 → 4' },
    ],
    correctAnswer: 0, solution: 'Gecikmiş rapor (2) zaten geç, hemen tamamlanmalı. Sonra 10:00 sunumu (1). 11:00\'de stajyer (3). Güncelleme (4) en düşük öncelik.',
    tags: ['önceliklendirme', 'sıralama'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-dm-o', categoryId: 'degerlendirme-merkezi', subModuleId: 'in-tray', difficulty: 'orta',
    questionText: 'Gelen kutunuzda 5 e-posta var:\n1. CEO: "Strateji sunumu için veriler lazım" (bugün 17:00\'ye kadar)\n2. Müşteri şikayeti: Teslimat gecikmiş (dün gönderilmiş)\n3. İK: Yıllık izin formunu onaylayın (bu hafta)\n4. Ekip üyesi: "Projede takıldım, yardım lazım" (30 dk önce)\n5. Tedarikçi: Fiyat teklifi (bilgi amaçlı)\n\nİlk 2 sırada hangilerini ele alırsınız?',
    options: [
      { label: 'A', text: '1 (CEO) ve 2 (müşteri şikayeti)' },
      { label: 'B', text: '2 (müşteri şikayeti) ve 4 (ekip üyesi)' },
      { label: 'C', text: '1 (CEO) ve 4 (ekip üyesi)' },
      { label: 'D', text: '4 (ekip üyesi) ve 2 (müşteri şikayeti)' },
      { label: 'E', text: '1 (CEO) ve 3 (İK formu)' },
    ],
    correctAnswer: 0, solution: 'CEO talebi hem acil (bugün 17:00) hem stratejik önem taşıyor. Müşteri şikayeti ise müşteri memnuniyeti açısından kritik ve zaten gecikmiş. İkisi birlikte en yüksek öncelikli çifti oluşturur.',
    tags: ['önceliklendirme', 'CEO', 'müşteri'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-dm-z', categoryId: 'degerlendirme-merkezi', subModuleId: 'in-tray', difficulty: 'zor',
    questionText: 'Pazartesi sabahı. Yöneticiniz 2 günlük izinde. Gelen kutunuzda:\n1. Genel Müdür: "Cuma sunumu için departman performans raporu" (Çarşamba\'ya kadar)\n2. Tedarikçi: "Sözleşme feshi uyarısı — 48 saat içinde ödeme yapılmazsa" (acil)\n3. IT: "Güvenlik açığı tespiti — tüm şifrelerin değiştirilmesi gerekiyor" (bugün)\n4. Müşteri A: "Proje revizyonu talebi" (bu hafta)\n5. İK: "Yeni işe alım onayı" (yöneticinizin onayı gerekli)\n\nDoğru aksiyon planı hangisidir?',
    options: [
      { label: 'A', text: '2→3→1→4→5 sırasıyla tek tek ele al' },
      { label: 'B', text: '2 ve 5 için yöneticiyi ara, 3\'ü hemen yap, 1 ve 4\'ü planla' },
      { label: 'C', text: '3→2→1→4→5 — güvenlik her zaman ilk' },
      { label: 'D', text: '1→2→3→4→5 — Genel Müdür en önemli' },
      { label: 'E', text: 'Hepsini yöneticiye yönlendir, dönüşünü bekle' },
    ],
    correctAnswer: 1, solution: 'Tedarikçi ödeme krizi (2) mali sonuçları nedeniyle yönetici onayı gerektirir — hemen aranmalı. İK onayı (5) da yönetici gerektirir. Güvenlik (3) hemen uygulanabilir. GM raporu (1) Çarşamba\'ya kadar süre var, planlanabilir. Müşteri revizyonu (4) bu hafta.',
    tags: ['çoklu karar', 'delegasyon', 'acil durum'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
  {
    id: 'seed-dm-cz', categoryId: 'degerlendirme-merkezi', subModuleId: 'in-tray', difficulty: 'cok-zor',
    questionText: 'Bir bölge müdürü olarak Cuma öğleden sonra masanızda 7 konu var. Haftaya Pazartesi tatilsiniz. Biri dışında hepsi Pazartesi\'ye kadar çözülmeli. Ekibinizde 2 kıdemli ve 1 yeni çalışan var.\n\n1. Yönetim kurulu sunumu (Salı) — veriler hazır değil\n2. Şube müdürü istifası — bugün teslim etti\n3. Müşteri davası riski — avukat yarın son gün diyor\n4. Bütçe revizyonu (gelecek hafta Perşembe)\n5. Yeni şube açılış planı (bu ay)\n6. Medya talebi — şirket hakkında haber yapılacak (Pazartesi)\n7. Stajyer değerlendirme formu (gelecek hafta)\n\nHangi strateji en etkilidir?',
    options: [
      { label: 'A', text: '3 ve 2\'yi bugün çöz, 1\'i kıdemli çalışana delege et, 6 için iletişim birimine yönlendir, 4-5-7\'yi gelecek haftaya bırak' },
      { label: 'B', text: '1-7 hepsini sırayla kendin çöz' },
      { label: 'C', text: 'Tüm görevleri kıdemli çalışanlara dağıt' },
      { label: 'D', text: '2\'yi İK\'ya yönlendir, 3\'ü avukata bırak, geri kalanı gelecek hafta' },
      { label: 'E', text: 'Pazartesi iznini iptal edip tüm görevleri hafta sonunda yap' },
    ],
    correctAnswer: 0, solution: 'A en stratejik: Avukat deadline (3) ve istifa (2) acil ve kişisel müdahale gerektirir. YK sunumu (1) delegasyon uygun. Medya (6) uzmana yönlendirilmeli. Bütçe (4), şube planı (5) ve stajyer formu (7) acil değil.',
    tags: ['delegasyon', 'zaman yönetimi', 'stratejik önceliklendirme'], svgPosition: 'top', createdAt: T, updatedAt: T,
  },
];

