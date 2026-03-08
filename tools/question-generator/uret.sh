#!/bin/bash
# ============================================
# Pratik Soru Üretici
# ============================================
# Kullanım:
#   ./uret.sh tp-sozel 100        → 100 soru (20×5 zorluk)
#   ./uret.sh capp-sayisal 500    → 500 soru (100×5 zorluk)
#   ./uret.sh tp-sozel 10         → 10 soru (2×5 zorluk)
#   ./uret.sh listele             → Tüm modülleri göster
# ============================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PDF_BASE="/Users/tamerbolat/Desktop/AC-soru bankası-v2"

get_pdf_folder() {
  case "$1" in
    # === 01 SAYISAL YETENEK ===
    sayisal-muhakeme)      echo "01-Sayısal Yetenek/Sayısal Muhakeme" ;;
    sayisal-okuma-anlama)  echo "01-Sayısal Yetenek/Sayısal Okuma Anlama" ;;
    sayisal-kritik-akil)   echo "01-Sayısal Yetenek/Sayısal Kritik Akıl Yürütme" ;;
    sayisal-karsilastirma) echo "01-Sayısal Yetenek/Sayısal Karşılaştırma" ;;
    capp-sayisal)          echo "01-Sayısal Yetenek/CAPP Sayısal" ;;
    tp-sayisal)            echo "01-Sayısal Yetenek/TP Sayısal" ;;

    # === 02 SÖZEL YETENEK ===
    sozel-muhakeme)        echo "02-Sözel Yetenek/Sözel Muhakeme" ;;
    sozel-okuma-anlama)    echo "02-Sözel Yetenek/Sözel Okuma Anlama" ;;
    kiyaslar)              echo "02-Sözel Yetenek/Kıyaslar" ;;
    capp-sozel)            echo "02-Sözel Yetenek/CAPP Sözel" ;;
    tp-sozel)              echo "02-Sözel Yetenek/TP Sözel" ;;

    # === 03 MANTIKSAL & AKIL YÜRÜTME ===
    mantiksal)             echo "03-Mantıksal ve Akıl Yürütme/Mantıksal Akıl Yürütme" ;;
    tumevarimsal)          echo "03-Mantıksal ve Akıl Yürütme/Tümevarımsal" ;;
    tumdengelimsel)        echo "03-Mantıksal ve Akıl Yürütme/Tümdengelimsel" ;;
    diyagramatik)          echo "03-Mantıksal ve Akıl Yürütme/Diyagramatik" ;;

    # === 04 ELEŞTİREL DÜŞÜNME ===
    argumanlar)            echo "04-Eleştirel Düşünme/Argümanlar" ;;
    varsayimlar)           echo "04-Eleştirel Düşünme/Varsayımlar" ;;
    cikarimlar)            echo "04-Eleştirel Düşünme/Çıkarımlar" ;;
    cikarsamalar)          echo "04-Eleştirel Düşünme/Çıkarsamalar" ;;
    bilgi-yorumlama)       echo "04-Eleştirel Düşünme/Bilgi Yorumlama" ;;
    elestirel-tam-test)    echo "04-Eleştirel Düşünme/Tam Testler" ;;
    elestirel-kiyaslar)    echo "04-Eleştirel Düşünme/Kıyaslar" ;;

    # === 05-08 DİĞER ===
    hata-bulma)            echo "05-Dikkat ve Hata Bulma/Hata Bulma" ;;
    mekanik)               echo "06-Mekanik Akıl Yürütme/Mekanik Testler" ;;
    sjt)                   echo "07-Durumsal Yargı/Durumsal Yargı Testleri" ;;
    in-tray)               echo "08-Değerlendirme Merkezi/In-Tray" ;;
    e-tray)                echo "08-Değerlendirme Merkezi/E-Tray" ;;
    vaka-analizi)          echo "08-Değerlendirme Merkezi/Vaka Analizi" ;;
    sunum-egzersizi)       echo "08-Değerlendirme Merkezi/Sunum Egzersizi" ;;
    grup-egzersizi)        echo "08-Değerlendirme Merkezi/Grup Egzersizleri" ;;

    *) echo "" ;;
  esac
}

list_modules() {
  echo ""
  echo "════════════════════════════════════════════════════════════════════"
  echo "  Modül                    → Klasör                         (PDF)"
  echo "════════════════════════════════════════════════════════════════════"
  echo ""
  echo "  📊 01 Sayısal Yetenek:"
  echo "    sayisal-muhakeme       → Sayısal Muhakeme                (44)"
  echo "    sayisal-okuma-anlama   → Sayısal Okuma Anlama            (12)"
  echo "    sayisal-kritik-akil    → Sayısal Kritik Akıl Yürütme    (18)"
  echo "    sayisal-karsilastirma  → Sayısal Karşılaştırma            (4)"
  echo "    capp-sayisal           → CAPP Sayısal                    (10)"
  echo "    tp-sayisal             → TP Sayısal                       (8)"
  echo ""
  echo "  📝 02 Sözel Yetenek:"
  echo "    sozel-muhakeme         → Sözel Muhakeme                  (28)"
  echo "    sozel-okuma-anlama     → Sözel Okuma Anlama              (24)"
  echo "    kiyaslar               → Kıyaslar                         (8)"
  echo "    capp-sozel             → CAPP Sözel                      (10)"
  echo "    tp-sozel               → TP Sözel                         (8)"
  echo ""
  echo "  🧩 03 Mantıksal & Akıl Yürütme:"
  echo "    mantiksal              → Mantıksal Akıl Yürütme          (34)"
  echo "    tumevarimsal           → Tümevarımsal                    (28)"
  echo "    tumdengelimsel         → Tümdengelimsel                  (10)"
  echo "    diyagramatik           → Diyagramatik                    (14)"
  echo ""
  echo "  🔍 04 Eleştirel Düşünme:"
  echo "    argumanlar             → Argümanlar                      (12)"
  echo "    varsayimlar            → Varsayımlar                     (12)"
  echo "    cikarimlar             → Çıkarımlar                      (12)"
  echo "    cikarsamalar           → Çıkarsamalar                    (12)"
  echo "    bilgi-yorumlama        → Bilgi Yorumlama                 (12)"
  echo "    elestirel-tam-test     → Tam Testler                     (60)"
  echo "    elestirel-kiyaslar     → Kıyaslar                         (8)"
  echo ""
  echo "  👁 05 Dikkat & Hata Bulma:"
  echo "    hata-bulma             → Hata Bulma                      (12)"
  echo ""
  echo "  ⚙️  06 Mekanik Akıl Yürütme:"
  echo "    mekanik                → Mekanik Testler                  (8)"
  echo ""
  echo "  🤔 07 Durumsal Yargı:"
  echo "    sjt                    → Durumsal Yargı Testleri          (12)"
  echo ""
  echo "  🏢 08 Değerlendirme Merkezi:"
  echo "    in-tray                → In-Tray                          (6)"
  echo "    e-tray                 → E-Tray                           (6)"
  echo "    vaka-analizi           → Vaka Analizi                     (4)"
  echo "    sunum-egzersizi        → Sunum Egzersizi                  (2)"
  echo "    grup-egzersizi         → Grup Egzersizleri               (20)"
  echo ""
  echo "  Toplam: 30 modül, 458 PDF"
  echo ""
}

# ---- ANA MANTIK ----

if [ -z "$1" ] || [ "$1" = "help" ] || [ "$1" = "--help" ]; then
  echo ""
  echo "════════════════════════════════════════"
  echo "  Psikometrik Test — Soru Üretici"
  echo "════════════════════════════════════════"
  echo ""
  echo "  Kullanım:"
  echo "    ./uret.sh <modül> <soru-sayısı>"
  echo ""
  echo "  Örnekler:"
  echo "    ./uret.sh tp-sozel 100"
  echo "    ./uret.sh capp-sayisal 500"
  echo "    ./uret.sh tp-sozel 10"
  echo ""
  echo "  Modülleri görmek için:"
  echo "    ./uret.sh listele"
  echo ""
  exit 0
fi

if [ "$1" = "listele" ] || [ "$1" = "list" ]; then
  list_modules
  exit 0
fi

MODULE="$1"
TOTAL="${2:-100}"

PDF_FOLDER=$(get_pdf_folder "$MODULE")
if [ -z "$PDF_FOLDER" ]; then
  echo "❌ Bilinmeyen modül: $MODULE"
  echo "   ./uret.sh listele ile modülleri görün"
  exit 1
fi

PDF_PATH="$PDF_BASE/$PDF_FOLDER"

# Klasör var mı kontrol
if [ ! -d "$PDF_PATH" ]; then
  echo "⚠️  PDF klasörü bulunamadı: $PDF_PATH"
  echo "   Claude PDF olmadan kendi içerik üretecek."
  PDF_ARG=""
else
  PDF_COUNT=$(find "$PDF_PATH" -maxdepth 1 -name "*.pdf" 2>/dev/null | wc -l | tr -d ' ')
  PDF_ARG="--pdf $PDF_PATH"
fi

PER_LEVEL=$((TOTAL / 5))

echo ""
echo "════════════════════════════════════════"
echo "  Soru Üretimi Başlıyor"
echo "════════════════════════════════════════"
echo ""
echo "  Modül:     $MODULE"
echo "  Toplam:    $TOTAL soru ($PER_LEVEL × 5 zorluk)"
echo "  PDF:       $PDF_PATH"
if [ -n "$PDF_COUNT" ]; then
  echo "  PDF Sayısı: $PDF_COUNT dosya"
fi
echo ""

cd "$SCRIPT_DIR"

if [ -n "$PDF_ARG" ]; then
  python3 main.py \
    --module "$MODULE" \
    --cok-kolay "$PER_LEVEL" \
    --kolay "$PER_LEVEL" \
    --orta "$PER_LEVEL" \
    --zor "$PER_LEVEL" \
    --cok-zor "$PER_LEVEL" \
    --pdf "$PDF_PATH" \
    --verbose
else
  python3 main.py \
    --module "$MODULE" \
    --cok-kolay "$PER_LEVEL" \
    --kolay "$PER_LEVEL" \
    --orta "$PER_LEVEL" \
    --zor "$PER_LEVEL" \
    --cok-zor "$PER_LEVEL" \
    --verbose
fi

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo ""
  echo "✅ Dosyayı projeye kopyalamak için:"
  echo "   cp output/seed-${MODULE}.ts ../../data/questions/seed-${MODULE}.ts"
  echo ""
fi

exit $EXIT_CODE
