"""Prompt Builder — Construct Claude API prompts from rules + content."""
from pathlib import Path
from typing import Optional
from config import RULES_DIR, DIFFICULTY_LABELS


def build_prompt(module: str, category: str, difficulty: str, count: int,
                 options_count: int, content: Optional[dict] = None,
                 existing_questions: list = None) -> str:
    """
    Build a Claude API prompt for question generation.

    Combines:
    - Global rules (Turkification, dates, currency)
    - Module-specific rules
    - PDF content (if available)
    - Difficulty instructions
    - Format requirements
    - Exclusion list (for uniqueness)
    """
    parts = []

    # === System context ===
    parts.append(_build_system_context(module, category, difficulty, count, options_count))

    # === Global rules ===
    global_rules = _load_rules('global.md')
    if global_rules:
        parts.append(f'\n## GENEL KURALLAR (Türkçeleştirme & Uyarlama)\n{global_rules}')

    # === Module-specific rules ===
    module_rules = _load_rules(f'{module}.md')
    if module_rules:
        parts.append(f'\n## MODÜL KURALLARI ({module})\n{module_rules}')

    # === PDF Content (if available) ===
    if content:
        parts.append(_build_content_section(content))

    # === Difficulty instructions ===
    parts.append(_build_difficulty_instructions(difficulty, count))

    # === Format requirements ===
    parts.append(_build_format_requirements(module, category, options_count, count))

    # === Distribution requirement ===
    parts.append(_build_distribution_requirement(count, options_count))

    # === Exclusion list ===
    if existing_questions:
        parts.append(_build_exclusion_list(existing_questions))

    return '\n'.join(parts)


def _build_system_context(module, category, difficulty, count, options_count):
    return f"""Sen bir psikometrik test soru yazarısın. Türkçe soru üretiyorsun.

GÖREV: {count} adet {DIFFICULTY_LABELS[difficulty]} seviyesinde soru üret.
MODÜL: {module}
KATEGORİ: {category}
SEÇENEK SAYISI: {options_count} ({', '.join([chr(65+i) for i in range(options_count)])})
ZORLUK: {difficulty} ({DIFFICULTY_LABELS[difficulty]})

Tüm sorular Türkçe olmalı. İngilizce kaynak varsa tamamen Türkçeleştir."""


def _load_rules(filename: str) -> Optional[str]:
    """Load a rules file from the rules directory."""
    rules_path = RULES_DIR / filename
    if rules_path.exists():
        return rules_path.read_text(encoding='utf-8')
    return None


def _build_content_section(content: dict) -> str:
    """Build the content section from extracted PDF content."""
    parts = ['\n## KAYNAK İÇERİK (PDF\'den çıkarılmış)\n']

    if content.get('passages'):
        parts.append('### Metin Pasajları:')
        for i, passage in enumerate(content['passages'][:20]):  # Limit to 20
            parts.append(f'{i+1}. {passage[:500]}')  # Limit length

    if content.get('tables'):
        parts.append('\n### Tablolar:')
        for i, table in enumerate(content['tables'][:10]):  # Limit to 10
            parts.append(f'\nTablo {i+1} ({table["source"]}):')
            parts.append(f'Başlıklar: {" | ".join(table["headers"])}')
            for row in table['rows'][:5]:  # Show first 5 rows
                parts.append(f'  {" | ".join(row)}')
            if len(table['rows']) > 5:
                parts.append(f'  ... ({len(table["rows"])} satır toplam)')

    parts.append(f'\nÖzet: {content.get("summary", "")}')
    parts.append('\nBu içeriği REFERANS olarak kullan. Birebir kopyalama, uyarla ve Türkçeleştir.')
    parts.append('Gerekirse yeni tablolar, metinler ve senaryolar oluştur.')

    return '\n'.join(parts)


def _build_difficulty_instructions(difficulty: str, count: int) -> str:
    instructions = {
        'cok-kolay': f"""
## ZORLUK: ÇOK KOLAY ({count} soru)
- Belgeden/tablodan DOĞRUDAN okunan bilgi
- Tek bir hücre/cümle okuma yeterli
- Yanıltıcı seçenek az, ayrım net
- Metin uzunluğu: 2-3 cümle veya küçük tablo (3-4 satır)""",
        'kolay': f"""
## ZORLUK: KOLAY ({count} soru)
- Basit çıkarım veya tek adım hesaplama
- Toplama, çıkarma, basit oran
- Neden-sonuç ilişkisi (açık)
- Metin uzunluğu: 3-4 cümle veya orta tablo (4-5 satır)""",
        'orta': f"""
## ZORLUK: ORTA ({count} soru)
- Çıkarım gerektiren sorular
- "Söylenemez" (belgeden çıkarılamaz) tespiti
- Karar önerisi ("Bu durumda ne yapılmalı?")
- Yüzde hesaplama, karşılaştırma
- Metin uzunluğu: 4-5 cümle veya detaylı tablo (5-6 satır)""",
        'zor': f"""
## ZORLUK: ZOR ({count} soru)
- Çelişki tespiti (belgede birbiriyle çelişen bilgiler)
- İnce çıkarımlar (satır arası okuma)
- Çok adımlı hesaplama
- Birden fazla bilgiyi birleştirme
- Metin uzunluğu: 5-6 cümle veya karmaşık tablo""",
        'cok-zor': f"""
## ZORLUK: ÇOK ZOR ({count} soru)
- Çok katmanlı çıkarım
- Paradoks tespiti
- Stratejik yorum ("Uzun vadede bu ne anlama gelir?")
- İma edilen ama açıkça belirtilmeyen bilgi
- Birden fazla belgeyi/tabloyu ilişkilendirme
- Metin uzunluğu: 5-7 cümle veya çok boyutlu tablo"""
    }
    return instructions.get(difficulty, '')


def _build_format_requirements(module, category, options_count, count):
    labels = [chr(65 + i) for i in range(options_count)]
    return f"""
## ÇIKTI FORMATI

Yanıtını SADECE JSON olarak ver. Başka metin ekleme.

```json
{{
  "questions": [
    {{
      "questionText": "Soru metni burada...",
      "visualContent": {{
        "type": "passage|table|document|chart",
        "title": "Başlık (metin veya tablo üst başlığı)",
        "description": "Kaynak notu veya ek açıklama (opsiyonel)",
        "content": "Metin içeriği veya tablo/grafik verisi (tipe göre)"
      }},
      "options": [
        {', '.join(['{{"label": "' + l + '", "text": "Seçenek metni"}}' for l in labels])}
      ],
      "correctAnswer": 0,
      "solution": "Adım adım çözüm açıklaması — ZORUNLU",
      "tags": ["{module}", "etiket1", "etiket2"]
    }}
  ]
}}
```

### visualContent Tipleri:
- **passage**: Kısa metin pasajı (CAPP Sözel tarzı)
- **document**: İş belgesi (TP Sözel tarzı — e-posta, duyuru, toplantı notu)
- **table**: Sayısal tablo (satır/sütun verisi)
- **chart**: Grafik verisi (çubuk, pasta, çizgi)

### visualContent Alanları:
- **title**: Görsel içeriğin başlığı (ör: "2024 Yılı Satış Raporu")
- **description**: Opsiyonel kaynak notu veya açıklama (ör: "Kaynak: İstatistik Kurumu, birimler bin TL")
- **content**: Tipe göre değişir (aşağıya bak)

### visualContent.content Formatları:
- passage/document: Düz metin string (paragraf halinde)
- table: JSON objesi: {{"headers": ["Ürün","Gelir"], "rows": [["A","500"],["B","750"]]}}
- chart: JSON objesi: {{"chartType": "bar", "labels": [...], "values": [...], "unit": "TL"}}

### Kurallar:
- correctAnswer: 0-indexed (0={labels[0]}, 1={labels[1]}, ..., {options_count-1}={labels[-1]})
- Her soru benzersiz olmalı
- **solution ZORUNLU**: Her soru için adım adım çözüm yaz (2-4 cümle). Çözümü olmayan soru GEÇERSİZDİR.
  Önce soruyu çöz, adım adım düşün, sonra doğru cevabı belirle.
- tags: En az 2 etiket
- Toplam {count} soru üret

### Tablo Kuralları (ÖNEMLİ):
- Tablolarda MAKSIMUM 6 sütun kullan. 7 veya daha fazla sütun KULLANMA.
- Sütun başlıkları KISA olmalı (max 15 karakter). Uzun birim bilgilerini parantez içinde kısalt.
- İyi örnek: "Bütçe (M₺)", "Maliyet (M₺)", "Oran (%)", "Gelir (₺)"
- Kötü örnek: "Planlanan Bütçe (Milyon TL)", "Gerçekleşen Maliyet (Milyon TL)"
- Birim bilgisini tablo başlığında veya dipnotta belirt, sütun başlığında kısalt
- Tablo content alanı JSON objesi olmalı (string değil), headers ve rows alanları zorunlu
"""


def _build_distribution_requirement(count, options_count):
    per_answer = count // options_count
    labels = [chr(65 + i) for i in range(options_count)]
    dist = ', '.join([f'{l}={per_answer}' for l in labels])
    return f"""
## CEVAP DAĞILIMI (KRİTİK!)

{count} soru için doğru cevap dağılımı MUTLAKA şu şekilde olmalı:
{dist}

Yani her seçenek tam {per_answer} kez doğru cevap olmalı.
Bunu sağlamak için önce soruları yaz, sonra doğru cevapları kontrol et ve dengele.
"""


def _build_exclusion_list(existing_questions: list) -> str:
    if not existing_questions:
        return ''

    texts = [q.get('questionText', '')[:100] for q in existing_questions[:50]]
    exclusion = '\n'.join([f'- {t}' for t in texts if t])

    return f"""
## BENZERSİZLİK — DAHA ÖNCE ÜRETİLMİŞ SORULAR (TEKRARLAMA!)

Aşağıdaki sorulara benzer sorular üretme. Tamamen farklı senaryolar, veriler ve sorular kullan:

{exclusion}
"""
