# Fillout Form Builder - Kapsamli Analiz Raporu

> Tarih: 2026-02-24
> Amac: Psikometrik test admin panelimiz icin referans UI/UX analizi

---

## 1. GENEL YAPI (Layout)

### 3 Panel Layout
```
+------------------+---------------------------+------------------+
|   SOL PANEL      |      ORTA PANEL           |   SAG PANEL      |
|   (w-56/240px)   |   (flex-1, centered)      |   (w-72/280px)   |
|                  |                           |                  |
| Soru Tipleri     |  Form Onizleme/Editor     |  Soru Ayarlari   |
| (scroll)         |  (WYSIWYG)                |  (collapsible)   |
+------------------+---------------------------+------------------+
```

### Ust Bar (Top Navigation)
- **Sol:** Home ikonu, Form adi (dropdown ile degistirilebilir), Form tipi badge (Quiz/Form)
- **Orta:** Edit | Integrate | Share | Results (4 ana tab)
- **Sag:** Saat ikonu, Kullanici avatar, + (davet), Settings (disli cark), Preview butonu, Publish butonu (koyu, vurgulu)

### Alt Bar (Bottom Navigation)
- `+ Add page` | `Page` (sayfa adi) | `Ending` (bitis sayfasi) | `Logic` (mantik kurallari)

### Orta Panel Uzerindeki Toolbar
- Form icinde soru secildiginde sagda floating toolbar gorunur:
  - Yesil tik (onayla/duzenle)
  - Settings (disli cark) - sag paneli acar
  - Oklar (tasima)
  - Kopyala ikonu
  - Kirmizi cop ikonu (sil)

---

## 2. SOL PANEL - SORU TIPLERI (Tam Liste)

### Quiz Questions (Quiz Modu Aktifken)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Multiple choice | Chat balonu | Tek secimli coktan secmeli |
| Picture choice | Resim + chat | Resimli secenekler |
| Dropdown | Chevron-down | Acilir liste |
| Checkboxes | Onay kutusu | Coklu onay |
| Multiselect | Coklu secim | Coklu secim |
| Number | Rakam grid | Sayi girisi |
| Short answer | Kisa cizgi | Kisa metin |
| Long answer | Uzun cizgi | Uzun metin |
| Opinion scale | Bar chart | Gorush olcegi |

### Display Text (Gorunum Metinleri)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Heading | H1 | Baslik |
| Paragraph | Paragraf | Aciklama metni |
| Banner | Bayrak | Vurgulu banner |

### Choices (Secenekler)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Dropdown | Chevron | Acilir liste |
| Picture choice | Resim | Resimli secim |
| Multiselect | Coklu | Coklu secim |
| Switch | Toggle | Acik/Kapali |
| Multiple choice | Chat | Coktan secmeli |
| Checkbox | Tik | Tek onay kutusu |
| Checkboxes | Onay kutulari | Coklu onay |
| Choice matrix | Grid | Matris secim |

### Time (Tarih/Saat)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Date picker | Takvim | Tarih secici |
| Date time picker | Takvim+saat | Tarih ve saat |
| Time picker | Saat | Saat secici |
| Date range | Takvim aralik | Tarih araligi |

### Rating & Ranking (Derecelendirme)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Ranking | Siralama oklari | Siralama |
| Star Rating | Yildiz | Yildiz puanlama |
| Slider | Kaydirgac | Kaydirgac |
| Opinion scale | Cubuk grafik | 1-10 olcek |

### Text (Metin)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Short answer | Kisa cizgi | Kisa metin girisi |
| Long answer | Uzun cizgi | Uzun metin (textarea) |
| Rich text | Zengin metin | WYSIWYG editor |

### Contact Info (Iletisim)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Email input | Zarf | E-posta girisi |
| Phone number | Telefon | Telefon numarasi |
| Address | Konum pin | Adres girisi |

### Number (Sayi)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Number | Rakam | Sayi girisi |
| Currency | Para birimi | Para birimi girisi |

### Miscellaneous (Cesitli)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| URL input | Link | URL girisi |
| Color picker | Renk | Renk secici |
| Password | Kilit | Sifre girisi |
| File uploader | Yukle | Dosya yukleme |
| Signature | Imza | E-imza |
| Voice recording | Mikrofon | Ses kaydi |
| Submission picker | Secici | Onceki gonderim secimi |
| Subform | Alt form | Ic ice form |
| Captcha | Kalkan | Bot koruma |
| Location coordinates | Konum | GPS koordinat |
| Table | Tablo | Tablo girisi |

### Navigation & Layout
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Section collapse | Akordiyon | Acilir/kapanir bolum |
| Divider | Cizgi | Ayirici cizgi |
| HTML | Kod | Ozel HTML |

### Media (Medya)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Image | Resim | Gorsel ekleme |
| Video | Video | Video ekleme |
| PDF viewer | PDF | PDF goruntuleme |
| Social media links | Paylasim | Sosyal medya linkleri |

### Page Features (Sayfa Ozellikleri)
| Tip | Ikon | Aciklama |
|-----|------|----------|
| Progress bar | Ilerleme | Ilerleme cubugu |
| Payment page | Odeme | Odeme sayfasi |
| Scheduling page | Takvim | Randevu planlama |
| Login page | Kilit | Giris sayfasi |

**TOPLAM: ~45+ soru/eleman tipi**

---

## 3. SAG PANEL - SORU AYARLARI

### Genel Yapi
Sag panel secilen soruya gore dinamik degisir. Her soru tipi icin:

### Basic (Temel) - Her zaman acik
- **Label:** Soru metni (sayfadaki metne tiklayarak duzenle)
- **Caption:** Alt aciklama metni
- **Tipe ozel alanlar:**
  - Picture Choice: "Can choose multiple" toggle, "Option background color"
  - Multiple Choice: Secenekler listesi
  - Short/Long Answer: Placeholder
  - Number: Min/Max deger
- **Options:** Secenekler (tiklayarak sayfada duzenle)
- **Default value:** Varsayilan deger
- **Required:** Zorunlu alan toggle

### Logic (Mantik) - Collapsible
- Kosullu gosterme/gizleme kurallari
- Sayfa yonlendirme mantigi

### Layout (Gorunum) - Collapsible
- **Image height:** Piksel cinsinden yukseklik (orn: 130)
- **One image per row on mobile:** Mobil gorunum toggle
- **Layout:** Normal / Diger secenekler (dropdown)

### Advanced (Gelismis) - Collapsible
- **Custom values:** Ozel deger atama toggle
- **Randomize order:** Secenekleri karistir toggle

### Validation (Dogrulama) - Collapsible
- Metin/sayi dogrulama kurallari

---

## 4. TEMA/TASARIM SISTEMI

### Form Designer Paneli
Sol panelde "Theme" butonuna tiklandiginda acilir.

#### Current Tab
- Mevcut tema bilgisi
- Tema secili degilse: "No theme chosen" + "Choose a theme" butonu

#### All Themes Tab
- **Filtre:** Featured / All dropdown
- **"Create with AI"** butonu (AI ile tema olustur)
- **Hazir Temalar:**
  - Light (beyaz, mavi aksan)
  - Dark (siyah arka plan)
  - Eco-friendly (yesil aksan)
  - Charcoal (koyu gri)
  - Quiet Sands (sari/bej aksan)
  - Calm (pastel)
  - ...ve daha fazlasi
- **Custom theme:** Premium ozellik
- Her tema karti: Onizleme + Text field + Aksan renk gosterimi

---

## 5. UST MENU TABLARI

### Edit (Duzenle)
- 3 panelli form editor
- Sol: Soru tipleri, Sag: Ayarlar, Orta: Onizleme
- Theme butonu (sol ust)
- "Quiz questions" ile "Settings" alt sekmeleri (sol panel ustte)

### Integrate (Entegrasyon)
#### Integrations Tab
**Popular Apps (12):**
- Zite Database, Airtable, Notion, Google Sheets, Generate PDF, HubSpot
- Google Drive, Slack, Webhook, Mailchimp, Monday, Dropbox

**More Integrations (20+):**
- Salesforce (Enterprise), SmartSuite, ActiveCampaign, SendGrid
- Microsoft Teams, Google Docs, Attio, Amazon S3 (Enterprise)
- Facebook Pixel (Paid), Intercom, Klaviyo, Linear
- OneDrive, Zendesk, Excel, Tag Manager (Paid)
- Trello, Brevo, Discord, Pipedrive, Twilio, ClickUp

**3rd Party (Zapier/Make/Relay):**
- Zapier, Make, Relay.app, Asana, Firebase, Freshdesk
- Documint, Square, Shopify

#### Workflows Tab
- Otomasyon akislari (0 workflow)

### Share (Paylas)
- Form linki gosterimi (orn: https://forms.fillout.com/t/...)
- "Customize" linki (URL ozellestirme)
- 3 cihaz onizleme (desktop/tablet/mobile mockup)
- Publish butonu

### Results (Sonuclar)
#### Sol sidebar:
- **Submissions:** Tablo gorunumunde gonderimler (Sort, Filter, Hide fields)
- **In progress:** Devam eden yanitlar
- **Summary:** Ozet istatistikler
- **Analytics:** Grafik dashboard
  - Ust: Istatistik kartlari (Views, Submissions, Completion rate)
  - Completed submissions (cizgi grafik, zamana gore)
  - Page drop off rates (sayfa terk oranlari)
- **Link to database:** Veritabani baglantisi
- **Share results** butonu (sag ust)

---

## 6. FORM AYARLARI (Settings Modal)

### Notifications (Bildirimler)
- **General Tab:**
  - Self-email notifications (toggle) - form gonderildiginde email al
  - Respondent notifications (toggle) - yanitlayiciya email gonder
- **Custom emails Tab:** Ozel email sablonlari

### URL Parameters
- URL parametreleri yonetimi

### Form Behavior (Form Davranisi)
- Cookie consent (toggle)
- Allow resuming partial submissions (toggle, varsayilan: acik)
- Auto-jump to the next page (toggle)
- Show progress bar (toggle, varsayilan: acik)
- Only use external storage (Enterprise)

### Access (Erisim)
- Close form (toggle) - formu kapat
- Form open date (toggle) - acilis tarihi
- Form expiration date (toggle) - bitis tarihi
- Form submission limit (toggle) - gonderim limiti

### Language (Dil)
- Default language: English (dropdown)
- Disable auto-translate (toggle)
- Right to left (toggle) - RTL destek
- Enable translations (toggle) - coklu dil

### Quiz Mode
- Quiz mode enabled (toggle)
- Show correct answers after each page (toggle)
- Answer key: Her soru icin dogru cevap belirleme

### Custom Code (Business)
- Ozel kod ekleme (Business plan)

### Conversion Kit (Add-on)
- Donusum optimizasyon araci

---

## 7. ORTA PANEL - FORM EDITOR

### WYSIWYG Yaklasim
- Soru metni dogrudan sayfada tiklanarak duzenlenir ("Click text on page to modify")
- Secenekler de ayni sekilde inline duzenlenir
- "Add option" linki ile yeni secenek eklenir
- Submit butonu gorunur (gercek form gibi)

### Soru Sirasi
- Sol kenarda 6 noktali drag handle (⋮⋮) ile surukle-birak
- Sayfalar arasi tasima destegi

### Sayfa Yonetimi (Alt bar)
- "+ Add page" ile yeni sayfa
- "Page" aktif sayfa gosterimi
- "Ending" bitis sayfasi ayarlari
- "Logic" sayfa mantik kurallari

---

## 8. ONEMLI UI/UX PATERNLERI

### 1. Inline Editing
Fillout'un en belirgin ozelligi: Soru metinleri ve secenekler dogrudan form onizlemesi uzerinde duzenlenir. Ayri bir editor/form yok.

### 2. Collapsible Sections
Sag panel ayarlari (Basic, Logic, Layout, Advanced, Validation) collapsible accordion yapidadir. Sadece gerekli bolumler acilir.

### 3. Toggle-First Design
Hemen her ayar toggle (acik/kapali) ile baslar. Detaylar toggle acildiginda gosterilir.

### 4. Floating Toolbar
Soru secildiginde sag tarafta floating toolbar gorunur (edit, settings, copy, delete). Bu toolbar form icinde contextual olarak gorunur.

### 5. Badge System
- Plan gereksinimleri badge ile gosterilir: "Business", "Enterprise", "Paid", "Add-on", "Premium"
- Form tipi badge: "Quiz", "Form"

### 6. Theme Preview
Tema seciminde anlik onizleme. Her tema kartinda kucuk mockup gorunur.

### 7. Multi-Page Form
Alt bar'da sayfa yonetimi. Her sayfa ayri duzenlenir. Ending sayfasi ozel olarak yonetilir.

---

## 9. BIZIM PROJEMIZ ICIN CIKARTILACAK DERSLER

### Benzerlikler (Zaten Var)
- 3 panel layout ✓
- Sol: Soru tipleri, Orta: Editor, Sag: Ayarlar ✓
- Collapsible sag panel bolumleri ✓
- Soru tipi gruplama ✓

### Eklenebilecek Ozellikler
1. **Inline editing** - Soru metni dogrudan onizlemede duzenlenebilir
2. **Floating toolbar** - Soru secildiginde contextual islemler
3. **Theme sistemi** - Hazir tema sablonlari
4. **Sayfa yonetimi** - Coklu sayfa destegi (alt bar)
5. **Logic builder** - Kosullu gosterim mantigi
6. **Preview modu** - Gercek form gibi onizleme (zaten var, gelistirilebilir)
7. **Drag-and-drop siralama** - Soru sirasi degistirme
8. **Search fields** - Sol panelde arama

### Soru Tipi Karsilastirmasi
| Fillout (~45 tip) | Bizim Proje (17 tip) | Durum |
|---|---|---|
| Multiple choice | single | ✓ |
| Checkboxes/Multiselect | multiple | ✓ |
| Dropdown | dropdown | ✓ |
| Picture choice | image_choice | ✓ |
| Short answer | short_text | ✓ |
| Long answer | long_text | ✓ |
| Star Rating | star | ✓ |
| Opinion scale | scale | ✓ |
| Slider | slider | ✓ |
| Ranking | ranking | ✓ |
| Choice matrix | matrix | ✓ |
| File uploader | file_upload | ✓ |
| Date picker | date | ✓ |
| Time picker | time | ✓ |
| NPS (yok) | nps | Bizde var ✓ |
| Matching (yok) | matching | Bizde var ✓ |
| MaxDiff (yok) | maxdiff | Bizde var ✓ |
| Number | - | Fillout'ta var |
| Currency | - | Fillout'ta var |
| Email/Phone/Address | - | Fillout'ta var |
| Signature | - | Fillout'ta var |
| Voice recording | - | Fillout'ta var |
| Color picker | - | Fillout'ta var |
| Table | - | Fillout'ta var |
| Rich text | - | Fillout'ta var |
| Switch | - | Fillout'ta var |
| Banner/Heading/Paragraph | - | Display text |
| Subform | - | Fillout'ta var |
| Captcha | - | Fillout'ta var |
| PDF viewer | - | Fillout'ta var |

### Psikometrik Teste Ozel (Fillout'ta Yok)
- NPS (Net Promoter Score) ✓
- Matching (Eslestirme) ✓
- MaxDiff ✓
- Zorluk seviyesi sistemi ✓
- Kategori/Alt modul hiyerarsisi ✓
- SVG/gorsel medya sistemi (hizalama, boyut) ✓
- Cozum aciklamasi (RichText) ✓
- Quiz mode answer key (Fillout'ta basit, bizde detayli)

---

## 10. SONUC

Fillout genel amacli bir form builder olarak genis bir soru tipi yelpazesine (~45) sahip. Ancak psikometrik test icin ozel tipler (NPS, Matching, MaxDiff) ve egitim ozellikleri (zorluk seviyesi, cozum aciklamasi, kategori sistemi) bizim projemizde daha gelismis.

Fillout'un guclu yanlari:
- Inline WYSIWYG editing deneyimi
- Zengin entegrasyon ekosistemi (30+ native + Zapier/Make)
- Hazir tema sistemi
- Coklu sayfa + mantik yonetimi
- Analytics dashboard

Bizim projemizin guclu yanlari:
- Psikometrik teste ozel soru tipleri
- Detayli zorluk + kategorizasyon sistemi
- SVG/gorsel medya ile zenginlestirilmis sorular
- Cozum aciklamasi ile egitim odakli yaklasim
