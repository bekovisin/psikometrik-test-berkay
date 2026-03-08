#!/usr/bin/env python3
"""
AC-soru bankası klasörlerini Türkçe kategori/modül yapısına göre yeniden düzenler.
Orijinal dosyaları KOPYALAR (taşımaz), eski klasör korunur.
"""
import os
import shutil

SRC = os.path.expanduser("~/Desktop/AC-soru bankası")
DST = os.path.expanduser("~/Desktop/AC-soru bankası-v2")

# Modül ID → (hedef klasör yolu, kaynak klasör yolları listesi)
MAPPING = {
    # ── 01 Sayısal Yetenek ──
    "sayisal-muhakeme": (
        "01-Sayısal Yetenek/Sayısal Muhakeme",
        ["1-numerical tests/numereical reasoning test"],
    ),
    "sayisal-okuma-anlama": (
        "01-Sayısal Yetenek/Sayısal Okuma Anlama",
        ["1-numerical tests/numerical comprehension"],
    ),
    "sayisal-kritik-akil": (
        "01-Sayısal Yetenek/Sayısal Kritik Akıl Yürütme",
        ["1-numerical tests/numerical critical reasoning"],
    ),
    "sayisal-karsilastirma": (
        "01-Sayısal Yetenek/Sayısal Karşılaştırma",
        ["1-numerical tests/numerical comparions and sufficiency of information"],
    ),
    "capp-sayisal": (
        "01-Sayısal Yetenek/CAPP Sayısal",
        ["12-capp numerical"],
    ),
    "tp-sayisal": (
        "01-Sayısal Yetenek/TP Sayısal",
        ["14-test partnership numerical"],
    ),

    # ── 02 Sözel Yetenek ──
    "sozel-muhakeme": (
        "02-Sözel Yetenek/Sözel Muhakeme",
        ["2-verbal tests/verbal tests", "2-verbal tests"],  # root 6 + verbal tests 22
    ),
    "sozel-okuma-anlama": (
        "02-Sözel Yetenek/Sözel Okuma Anlama",
        ["2-verbal tests/verbal comprehension"],
    ),
    "kiyaslar": (
        "02-Sözel Yetenek/Kıyaslar",
        ["2-verbal tests/syllogisms"],
    ),
    "capp-sozel": (
        "02-Sözel Yetenek/CAPP Sözel",
        ["13-capp verbal"],
    ),
    "tp-sozel": (
        "02-Sözel Yetenek/TP Sözel",
        ["15-test partnership verbal"],
    ),

    # ── 03 Mantıksal & Akıl Yürütme ──
    "mantiksal": (
        "03-Mantıksal ve Akıl Yürütme/Mantıksal Akıl Yürütme",
        ["5-logical tests"],
    ),
    "tumevarimsal": (
        "03-Mantıksal ve Akıl Yürütme/Tümevarımsal",
        ["3-inductive tests"],
    ),
    "tumdengelimsel": (
        "03-Mantıksal ve Akıl Yürütme/Tümdengelimsel",
        ["11-deductive reasoning tests"],
    ),
    "diyagramatik": (
        "03-Mantıksal ve Akıl Yürütme/Diyagramatik",
        ["4-diagrammatic tests"],
    ),

    # ── 04 Eleştirel Düşünme ──
    "argumanlar": (
        "04-Eleştirel Düşünme/Argümanlar",
        ["10-critical thinking tests/critical thinking tests-1"],
    ),
    "varsayimlar": (
        "04-Eleştirel Düşünme/Varsayımlar",
        ["10-critical thinking tests/critical thinking tests-2"],
    ),
    "cikarimlar": (
        "04-Eleştirel Düşünme/Çıkarımlar",
        ["10-critical thinking tests/critical thinking tests-3"],
    ),
    "cikarsamalar": (
        "04-Eleştirel Düşünme/Çıkarsamalar",
        ["10-critical thinking tests/critical thinking tests-4"],
    ),
    "bilgi-yorumlama": (
        "04-Eleştirel Düşünme/Bilgi Yorumlama",
        ["10-critical thinking tests/critical thinking tests-5"],
    ),
    "elestirel-tam-test": (
        "04-Eleştirel Düşünme/Tam Testler",
        [
            "10-critical thinking tests/critical thinking tests-6",
            "10-critical thinking tests/critical thinking tests-7",
            "10-critical thinking tests/critical thinking tests-8",
            "10-critical thinking tests/critical thinking tests-9",
            "10-critical thinking tests/critical thinking tests-free",
        ],
    ),
    "elestirel-kiyaslar": (
        "04-Eleştirel Düşünme/Kıyaslar",
        ["10-critical thinking tests/syllogisms"],
    ),

    # ── 05 Dikkat & Hata Bulma ──
    "hata-bulma": (
        "05-Dikkat ve Hata Bulma/Hata Bulma",
        ["9-error checking exercises"],
    ),

    # ── 06 Mekanik Akıl Yürütme ──
    "mekanik": (
        "06-Mekanik Akıl Yürütme/Mekanik Testler",
        ["16-mechanical tests"],
    ),

    # ── 07 Durumsal Yargı ──
    "sjt": (
        "07-Durumsal Yargı/Durumsal Yargı Testleri",
        ["6-situational judgement tests"],
    ),

    # ── 08 Değerlendirme Merkezi ──
    "in-tray": (
        "08-Değerlendirme Merkezi/In-Tray",
        ["7-In-Tray&E-Tray Exercies/in-tray exercise"],
    ),
    "e-tray": (
        "08-Değerlendirme Merkezi/E-Tray",
        ["7-In-Tray&E-Tray Exercies/e-tray exercise"],
    ),
    "vaka-analizi": (
        "08-Değerlendirme Merkezi/Vaka Analizi",
        [
            "8-assessment centre exercises/case study and presentation exercies",
            "8-assessment centre exercises/Case Study and Presentation Exercises/Case Study Exercise",
        ],
    ),
    "sunum-egzersizi": (
        "08-Değerlendirme Merkezi/Sunum Egzersizi",
        ["8-assessment centre exercises/Case Study and Presentation Exercises/Presentation Exercise"],
    ),
    "grup-egzersizi": (
        "08-Değerlendirme Merkezi/Grup Egzersizleri",
        [
            "8-assessment centre exercises/group exercises",
            "8-assessment centre exercises/group exercises/Day in the Life Series of Exercises/Analysis Exercise",
            "8-assessment centre exercises/group exercises/Day in the Life Series of Exercises/Group Exercise",
            "8-assessment centre exercises/group exercises/Day in the Life Series of Exercises/Role Play Exercise",
            "8-assessment centre exercises/day in the life series of exercises",
        ],
    ),
}


def main():
    if os.path.exists(DST):
        print(f"⚠️  Hedef klasör zaten var: {DST}")
        print("   Silip yeniden oluşturulsun mu? (evet/hayır)")
        resp = input("> ").strip().lower()
        if resp in ("evet", "e", "yes", "y"):
            shutil.rmtree(DST)
        else:
            print("İptal edildi.")
            return

    total_copied = 0
    total_modules = 0
    seen_files = {}  # track duplicates per destination

    for module_id, (dest_rel, sources) in MAPPING.items():
        dest_dir = os.path.join(DST, dest_rel)
        os.makedirs(dest_dir, exist_ok=True)

        copied = 0
        for src_rel in sources:
            src_dir = os.path.join(SRC, src_rel)
            if not os.path.isdir(src_dir):
                print(f"  ⚠️  Kaynak bulunamadı: {src_rel}")
                continue

            for fname in sorted(os.listdir(src_dir)):
                if not fname.lower().endswith(".pdf"):
                    continue
                src_file = os.path.join(src_dir, fname)
                if not os.path.isfile(src_file):
                    continue

                # Avoid duplicate filenames in same destination
                dest_key = (dest_rel, fname)
                if dest_key in seen_files:
                    continue
                seen_files[dest_key] = True

                dest_file = os.path.join(dest_dir, fname)
                shutil.copy2(src_file, dest_file)
                copied += 1

        total_copied += copied
        total_modules += 1
        print(f"  ✅ {module_id:25s} → {dest_rel:50s} ({copied} PDF)")

    print(f"\n{'='*70}")
    print(f"Toplam: {total_copied} PDF kopyalandı, {total_modules} modül oluşturuldu")
    print(f"Hedef: {DST}")


if __name__ == "__main__":
    main()
