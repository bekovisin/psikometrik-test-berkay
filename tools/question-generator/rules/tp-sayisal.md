# TP Sayisal — Modul Kurallari

## Format
- Is senaryosu baglaminda sayisal degerlendirme
- Her soru bir TABLO veya GRAFIGE dayanir
- Rol odakli cerceveleme: "Siz bir [rol] olarak bu raporu inceliyorsunuz..."

## Gorsel Turleri
1. Satis tablosu — urun bazli, bolge bazli, donem bazli
2. Cubuk grafik — karsilastirma, trend
3. Finansal tablo — gelir-gider, kar-zarar, butce
4. Performans tablosu — KPI, hedef vs gerceklesen
5. Uretim tablosu — kapasite, verimlilik

## Soru Tipleri
1. Dogrudan okuma — Tablodan/grafikten deger okuma
2. Hesaplama — Toplam, fark, ortalama
3. Oran/Yuzde — Yuzde degisim, oran hesaplama
4. Karsilastirma — En buyuk/kucuk, siralama
5. Cikarim — Trendden sonuc cikarma

## visualContent Formati
- type: "table" veya "chart"
- table: content JSON string {"headers": [...], "rows": [[...]]}
- chart: content JSON string {"chartType": "bar", "labels": [...], "values": [...], "unit": "TL"}

## Secenekler
- 4 sik (A-D) — DİKKAT: Bu modul 4 siklidir!
- Sayisal degerler net olmali (1.250 TL, %15, 3,5 kat)
