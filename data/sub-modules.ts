import { SubModule } from '@/lib/types';

export const subModules: SubModule[] = [
  // === SAYISAL YETENEK ===
  { id: 'sayisal-muhakeme', categoryId: 'sayisal-yetenek', name: 'Sayısal Muhakeme', nameEn: 'Numerical Reasoning', slug: 'sayisal-muhakeme', description: 'Tablo ve grafik verilerini yorumlayarak sayısal hesaplamalar yapma', whatItMeasures: 'Tablo, grafik yorumlama, temel hesaplama', referenceSource: 'AC Folder 1 → numerical reasoning test' },
  { id: 'sayisal-okuma-anlama', categoryId: 'sayisal-yetenek', name: 'Sayısal Okuma Anlama', nameEn: 'Numerical Comprehension', slug: 'sayisal-okuma-anlama', description: 'Metin içindeki sayısal verileri anlama ve yorumlama', whatItMeasures: 'Metin içindeki sayısal veriyi anlama', referenceSource: 'AC Folder 1 → numerical comprehension' },
  { id: 'sayisal-kritik-akil', categoryId: 'sayisal-yetenek', name: 'Sayısal Kritik Akıl Yürütme', nameEn: 'Numerical Critical Reasoning', slug: 'sayisal-kritik-akil', description: 'Sayısal verileri kritik gözle analiz edip çıkarım yapma', whatItMeasures: 'Veri analizi, çıkarım yapma', referenceSource: 'AC Folder 1 → numerical critical reasoning' },
  { id: 'sayisal-karsilastirma', categoryId: 'sayisal-yetenek', name: 'Sayısal Karşılaştırma & Veri Yeterliliği', nameEn: 'Numerical Comparisons & Data Sufficiency', slug: 'sayisal-karsilastirma', description: 'Veri setlerini karşılaştırma ve yeterlilik analizi', whatItMeasures: 'İleri düzey veri yeterliliği analizi', referenceSource: 'AC Folder 1 → numerical comparisons' },
  { id: 'capp-sayisal', categoryId: 'sayisal-yetenek', name: 'CAPP Sayısal', nameEn: 'CAPP Numerical', slug: 'capp-sayisal', description: 'CAPP formatında sayısal değerlendirme testleri', whatItMeasures: 'CAPP formatında sayısal yetenek ölçümü', referenceSource: 'AC Folder 12 → capp numerical' },
  { id: 'tp-sayisal', categoryId: 'sayisal-yetenek', name: 'TP Sayısal', nameEn: 'Test Partnership Numerical', slug: 'tp-sayisal', description: 'Test Partnership formatında sayısal değerlendirme', whatItMeasures: 'TP formatında sayısal yetenek ölçümü', referenceSource: 'AC Folder 14 → test partnership numerical' },

  // === SÖZEL YETENEK ===
  { id: 'sozel-muhakeme', categoryId: 'sozel-yetenek', name: 'Sözel Muhakeme', nameEn: 'Verbal Reasoning', slug: 'sozel-muhakeme', description: 'Metinleri okuyup Doğru/Yanlış/Söylenemez değerlendirmesi yapma', whatItMeasures: 'Doğru/Yanlış/Söylenemez metinleri', referenceSource: 'AC Folder 2 → verbal tests' },
  { id: 'sozel-okuma-anlama', categoryId: 'sozel-yetenek', name: 'Sözel Okuma Anlama', nameEn: 'Verbal Comprehension', slug: 'sozel-okuma-anlama', description: 'Metin anlama, ana fikir ve detay çıkarma', whatItMeasures: 'Metin anlama, ana fikir çıkarma', referenceSource: 'AC Folder 2 → verbal comprehension' },
  { id: 'kiyaslar', categoryId: 'sozel-yetenek', name: 'Kıyaslar (Syllogisms)', nameEn: 'Syllogisms', slug: 'kiyaslar', description: 'Öncül ifadelerden mantıksal sonuç çıkarma', whatItMeasures: 'Öncüllerden sonuç çıkarma', referenceSource: 'AC Folder 2 → syllogisms' },
  { id: 'capp-sozel', categoryId: 'sozel-yetenek', name: 'CAPP Sözel', nameEn: 'CAPP Verbal', slug: 'capp-sozel', description: 'CAPP formatında sözel değerlendirme testleri', whatItMeasures: 'CAPP formatında sözel yetenek ölçümü', referenceSource: 'AC Folder 13 → capp verbal' },
  { id: 'tp-sozel', categoryId: 'sozel-yetenek', name: 'TP Sözel', nameEn: 'Test Partnership Verbal', slug: 'tp-sozel', description: 'Test Partnership formatında sözel değerlendirme', whatItMeasures: 'TP formatında sözel yetenek ölçümü', referenceSource: 'AC Folder 15 → test partnership verbal' },

  // === MANTIKSAL & AKIL YÜRÜTME ===
  { id: 'mantiksal', categoryId: 'mantiksal-akil-yurutme', name: 'Mantıksal Akıl Yürütme', nameEn: 'Logical Reasoning', slug: 'mantiksal', description: 'Kural tabanlı mantık ve koşullu çıkarım problemleri', whatItMeasures: 'Kural tabanlı mantık, koşullu çıkarım', referenceSource: 'AC Folder 5 → logical tests' },
  { id: 'tumevarimsal', categoryId: 'mantiksal-akil-yurutme', name: 'Tümevarımsal Akıl Yürütme', nameEn: 'Inductive Reasoning', slug: 'tumevarimsal', description: 'Şekil serileri ve görsel örüntü tanıma', whatItMeasures: 'Örüntü tanıma, seri tamamlama', referenceSource: 'AC Folder 3 → inductive tests' },
  { id: 'tumdengelimsel', categoryId: 'mantiksal-akil-yurutme', name: 'Tümdengelimsel Akıl Yürütme', nameEn: 'Deductive Reasoning', slug: 'tumdengelimsel', description: 'Genel kurallardan özel durumlara çıkarım yapma', whatItMeasures: 'Genel kuraldan özele çıkarım', referenceSource: 'AC Folder 11 → deductive reasoning tests' },
  { id: 'diyagramatik', categoryId: 'mantiksal-akil-yurutme', name: 'Diyagramatik Akıl Yürütme', nameEn: 'Diagrammatic Reasoning', slug: 'diyagramatik', description: 'Diyagram ve akış şemalarındaki işlem kurallarını çözme', whatItMeasures: 'Diyagram tabanlı işlem kuralları', referenceSource: 'AC Folder 4 → diagrammatic tests' },

  // === ELEŞTİREL DÜŞÜNME ===
  { id: 'argumanlar', categoryId: 'elestirel-dusunme', name: 'Argümanlar', nameEn: 'Arguments', slug: 'argumanlar', description: 'Bir argümanın güçlü mü zayıf mı olduğunu değerlendirme', whatItMeasures: 'Argüman güçlü mü zayıf mı', referenceSource: 'AC Folder 10 → arguments' },
  { id: 'varsayimlar', categoryId: 'elestirel-dusunme', name: 'Varsayımlar', nameEn: 'Assumptions', slug: 'varsayimlar', description: 'İfadelerin altında yatan gizli varsayımları tespit etme', whatItMeasures: 'Gizli varsayımları tespit etme', referenceSource: 'AC Folder 10 → assumptions' },
  { id: 'cikarimlar', categoryId: 'elestirel-dusunme', name: 'Çıkarımlar (Deductions)', nameEn: 'Deductions', slug: 'cikarimlar', description: 'Verilen önermelerden zorunlu sonuçlar çıkarma', whatItMeasures: 'Verilen önermeden zorunlu sonuç', referenceSource: 'AC Folder 10 → deductions' },
  { id: 'cikarsamalar', categoryId: 'elestirel-dusunme', name: 'Çıkarsamalar (Inferences)', nameEn: 'Inferences', slug: 'cikarsamalar', description: 'Olasılık bazlı çıkarsama ve sonuç değerlendirme', whatItMeasures: 'Olasılık bazlı çıkarsama', referenceSource: 'AC Folder 10 → inferences' },
  { id: 'bilgi-yorumlama', categoryId: 'elestirel-dusunme', name: 'Bilgi Yorumlama', nameEn: 'Interpreting Information', slug: 'bilgi-yorumlama', description: 'Verilen bilgilerden mantıksal sonuç çıkarılıp çıkarılamayacağını değerlendirme', whatItMeasures: 'Sonuç mantıken çıkar mı', referenceSource: 'AC Folder 10 → interpreting information' },
  { id: 'elestirel-tam-test', categoryId: 'elestirel-dusunme', name: 'Tam Testler', nameEn: 'Full Tests', slug: 'tam-testler', description: 'Tüm eleştirel düşünme becerilerinin birleşik testi', whatItMeasures: 'Tüm becerilerin kombinasyonu', referenceSource: 'AC Folder 10 → full test' },
  { id: 'elestirel-kiyaslar', categoryId: 'elestirel-dusunme', name: 'Kıyaslar (Syllogisms)', nameEn: 'Syllogisms', slug: 'elestirel-kiyaslar', description: 'Öncül bazlı mantık çıkarımları', whatItMeasures: 'Öncül bazlı mantık', referenceSource: 'AC Folder 10 → syllogisms' },

  // === DİKKAT & HATA BULMA ===
  { id: 'hata-bulma', categoryId: 'dikkat-hata-bulma', name: 'Hata Bulma', nameEn: 'Error Checking', slug: 'hata-bulma', description: 'Veri setlerindeki hataları ve tutarsızlıkları tespit etme', whatItMeasures: 'Veri doğrulama, tutarsızlık tespiti', referenceSource: 'AC Folder 9 → error checking exercises' },

  // === MEKANİK AKIL YÜRÜTME ===
  { id: 'mekanik', categoryId: 'mekanik-akil-yurutme', name: 'Mekanik Testler', nameEn: 'Mechanical Tests', slug: 'mekanik', description: 'Fiziksel ve mekanik prensipleri anlama testleri', whatItMeasures: 'Fizik/mekanik prensipleri anlama', referenceSource: 'AC Folder 16 → mechanical tests' },

  // === DURUMSAL YARGI ===
  { id: 'sjt', categoryId: 'durumsal-yargi', name: 'Durumsal Yargı Testleri', nameEn: 'Situational Judgement Tests', slug: 'sjt', description: 'İş ortamı senaryolarında en uygun davranışı seçme', whatItMeasures: 'İş senaryolarında karar verme', referenceSource: 'AC Folder 6 → situational judgement tests' },

  // === DEĞERLENDİRME MERKEZİ ===
  { id: 'in-tray', categoryId: 'degerlendirme-merkezi', name: 'In-Tray Egzersizi', nameEn: 'In-Tray Exercise', slug: 'in-tray', description: 'Gelen kutusu simülasyonunda önceliklendirme ve karar verme', whatItMeasures: 'Önceliklendirme, karar verme', referenceSource: 'AC Folder 7 → in-tray exercise' },
  { id: 'e-tray', categoryId: 'degerlendirme-merkezi', name: 'E-Tray Egzersizi', nameEn: 'E-Tray Exercise', slug: 'e-tray', description: 'Dijital ortamda e-posta ve görev yönetimi simülasyonu', whatItMeasures: 'Dijital ortamda iş yönetimi', referenceSource: 'AC Folder 7 → e-tray exercise' },
  { id: 'vaka-analizi', categoryId: 'degerlendirme-merkezi', name: 'Vaka Analizi', nameEn: 'Case Study', slug: 'vaka-analizi', description: 'İş vakalarını analiz edip çözüm önerisi sunma', whatItMeasures: 'Analitik düşünme, sunum', referenceSource: 'AC Folder 8 → case study' },
  { id: 'sunum-egzersizi', categoryId: 'degerlendirme-merkezi', name: 'Sunum Egzersizi', nameEn: 'Presentation Exercise', slug: 'sunum-egzersizi', description: 'Belirli bir konu hakkında sunum hazırlama ve sunma', whatItMeasures: 'İletişim, ikna', referenceSource: 'AC Folder 8 → presentation exercise' },
  { id: 'grup-egzersizi', categoryId: 'degerlendirme-merkezi', name: 'Grup Egzersizleri', nameEn: 'Group Exercises', slug: 'grup-egzersizi', description: 'Grup tartışması ve ortak karar verme egzersizleri', whatItMeasures: 'Takım çalışması, liderlik', referenceSource: 'AC Folder 8 → group exercises' },
  { id: 'day-in-the-life', categoryId: 'degerlendirme-merkezi', name: 'Day-in-the-Life Serileri', nameEn: 'Day in the Life Series', slug: 'day-in-the-life', description: 'Bir iş gününü simüle eden analiz, grup ve rol yapma egzersizleri', whatItMeasures: 'İş günü simülasyonu', referenceSource: 'AC Folder 8 → day in the life series' },
];
