"""Configuration for the Question Generator pipeline."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the question-generator directory
BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / '.env', override=True)

# === API ===
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '')
CLAUDE_MODEL = 'claude-sonnet-4-20250514'
MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds

# === Paths ===
PROJECT_ROOT = BASE_DIR.parent.parent  # psikometrik-test/
RULES_DIR = BASE_DIR / 'rules'
TEMPLATES_DIR = BASE_DIR / 'templates'
PDFS_DIR = BASE_DIR / 'pdfs'
OUTPUT_DIR = BASE_DIR / 'output'
HISTORY_DIR = BASE_DIR / 'history'
SEED_DIR = PROJECT_ROOT / 'data' / 'questions'
STORE_FILE = PROJECT_ROOT / 'lib' / 'store.ts'

# === Defaults ===
DEFAULT_PER_LEVEL = 20
DEFAULT_OPTIONS_COUNT = 5
DEFAULT_DIFFICULTIES = ['cok-kolay', 'kolay', 'orta', 'zor', 'cok-zor']

# === Difficulty labels (Turkish) ===
DIFFICULTY_LABELS = {
    'cok-kolay': 'Çok Kolay',
    'kolay': 'Kolay',
    'orta': 'Orta',
    'zor': 'Zor',
    'cok-zor': 'Çok Zor',
}

# === Module → Seed file mapping ===
MODULE_SEED_MAP = {
    'tp-sayisal': {'file': 'seed-tp-sayisal.ts', 'export': 'seedTpSayisal', 'prefix': 'seed-tps', 'svg_prefix': 'SVG_TPS', 'options': 4},
    'tp-sozel': {'file': 'seed-tp-sozel.ts', 'export': 'seedTpSozel', 'prefix': 'seed-ts', 'svg_prefix': 'SVG_TS', 'options': 5},
    'capp-sayisal': {'file': 'seed-capp-sayisal.ts', 'export': 'seedCappSayisal', 'prefix': 'seed-cps', 'svg_prefix': 'SVG_CPS', 'options': 5},
    'capp-sozel': {'file': 'seed-capp-sozel.ts', 'export': 'seedCappSozel', 'prefix': 'seed-cs', 'svg_prefix': 'SVG_CS', 'options': 5},
    'sayisal-muhakeme': {'file': 'seed-numerical-reasoning.ts', 'export': 'seedNumericalReasoning', 'prefix': 'seed-nr', 'svg_prefix': 'SVG_NR', 'options': 5},
    'sayisal-okuma-anlama': {'file': 'seed-sayisal-okuma.ts', 'export': 'seedSayisalOkuma', 'prefix': 'seed-so', 'svg_prefix': 'SVG_SO', 'options': 5},
    'sayisal-kritik-akil': {'file': 'seed-sayisal-kritik-tables.ts', 'export': 'seedSayisalKritikTables', 'prefix': 'seed-skt', 'svg_prefix': 'SVG_SKT', 'options': 5},
    'sayisal-karsilastirma': {'file': 'seed-sayisal-karsilastirma.ts', 'export': 'seedSayisalKarsilastirma', 'prefix': 'seed-sk', 'svg_prefix': 'SVG_SK', 'options': 5},
    'sozel-muhakeme': {'file': 'seed-sozel-muhakeme.ts', 'export': 'seedSozelMuhakeme', 'prefix': 'seed-sm', 'svg_prefix': 'SVG_SM', 'options': 5},
    'sozel-okuma-anlama': {'file': 'seed-sozel-okuma-anlama.ts', 'export': 'seedSozelOkumaAnlama', 'prefix': 'seed-soa', 'svg_prefix': 'SVG_SOA', 'options': 5},
    'kiyaslar': {'file': 'seed-kiyaslar.ts', 'export': 'seedKiyaslar', 'prefix': 'seed-ky', 'svg_prefix': 'SVG_KY', 'options': 5},
    # === Henüz soru üretilmemiş modüller ===
    'mantiksal': {'file': 'seed-mantiksal.ts', 'export': 'seedMantiksal', 'prefix': 'seed-mt', 'svg_prefix': 'SVG_MT', 'options': 5},
    'tumevarimsal': {'file': 'seed-tumevarimsal.ts', 'export': 'seedTumevarimsal', 'prefix': 'seed-tv', 'svg_prefix': 'SVG_TV', 'options': 5},
    'tumdengelimsel': {'file': 'seed-tumdengelimsel.ts', 'export': 'seedTumdengelimsel', 'prefix': 'seed-td', 'svg_prefix': 'SVG_TD', 'options': 5},
    'diyagramatik': {'file': 'seed-diyagramatik.ts', 'export': 'seedDiyagramatik', 'prefix': 'seed-dy', 'svg_prefix': 'SVG_DY', 'options': 5},
    'argumanlar': {'file': 'seed-argumanlar.ts', 'export': 'seedArgumanlar', 'prefix': 'seed-ar', 'svg_prefix': 'SVG_AR', 'options': 5},
    'varsayimlar': {'file': 'seed-varsayimlar.ts', 'export': 'seedVarsayimlar', 'prefix': 'seed-vr', 'svg_prefix': 'SVG_VR', 'options': 5},
    'cikarimlar': {'file': 'seed-cikarimlar.ts', 'export': 'seedCikarimlar', 'prefix': 'seed-ck', 'svg_prefix': 'SVG_CK', 'options': 5},
    'cikarsamalar': {'file': 'seed-cikarsamalar.ts', 'export': 'seedCikarsamalar', 'prefix': 'seed-cks', 'svg_prefix': 'SVG_CKS', 'options': 5},
    'bilgi-yorumlama': {'file': 'seed-bilgi-yorumlama.ts', 'export': 'seedBilgiYorumlama', 'prefix': 'seed-by', 'svg_prefix': 'SVG_BY', 'options': 5},
    'elestirel-tam-test': {'file': 'seed-elestirel-tam-test.ts', 'export': 'seedElestirelTamTest', 'prefix': 'seed-ett', 'svg_prefix': 'SVG_ETT', 'options': 5},
    'elestirel-kiyaslar': {'file': 'seed-elestirel-kiyaslar.ts', 'export': 'seedElestirelKiyaslar', 'prefix': 'seed-ek', 'svg_prefix': 'SVG_EK', 'options': 5},
    'hata-bulma': {'file': 'seed-hata-bulma.ts', 'export': 'seedHataBulma', 'prefix': 'seed-hb', 'svg_prefix': 'SVG_HB', 'options': 5},
    'mekanik': {'file': 'seed-mekanik.ts', 'export': 'seedMekanik', 'prefix': 'seed-mk', 'svg_prefix': 'SVG_MK', 'options': 5},
    'sjt': {'file': 'seed-sjt.ts', 'export': 'seedSjt', 'prefix': 'seed-sj', 'svg_prefix': 'SVG_SJ', 'options': 5},
    'in-tray': {'file': 'seed-in-tray.ts', 'export': 'seedInTray', 'prefix': 'seed-it', 'svg_prefix': 'SVG_IT', 'options': 5},
    'e-tray': {'file': 'seed-e-tray.ts', 'export': 'seedETray', 'prefix': 'seed-et', 'svg_prefix': 'SVG_ET', 'options': 5},
    'vaka-analizi': {'file': 'seed-vaka-analizi.ts', 'export': 'seedVakaAnalizi', 'prefix': 'seed-va', 'svg_prefix': 'SVG_VA', 'options': 5},
    'sunum-egzersizi': {'file': 'seed-sunum-egzersizi.ts', 'export': 'seedSunumEgzersizi', 'prefix': 'seed-se', 'svg_prefix': 'SVG_SE', 'options': 5},
    'grup-egzersizi': {'file': 'seed-grup-egzersizi.ts', 'export': 'seedGrupEgzersizi', 'prefix': 'seed-ge', 'svg_prefix': 'SVG_GE', 'options': 5},
}

# === Category → SubModules mapping ===
CATEGORY_MODULES = {
    'sayisal-yetenek': ['sayisal-muhakeme', 'sayisal-okuma-anlama', 'sayisal-kritik-akil', 'sayisal-karsilastirma', 'capp-sayisal', 'tp-sayisal'],
    'sozel-yetenek': ['sozel-muhakeme', 'sozel-okuma-anlama', 'kiyaslar', 'capp-sozel', 'tp-sozel'],
    'mantiksal-akil-yurutme': ['mantiksal', 'tumevarimsal', 'tumdengelimsel', 'diyagramatik'],
    'elestirel-dusunme': ['argumanlar', 'varsayimlar', 'cikarimlar', 'cikarsamalar', 'bilgi-yorumlama', 'elestirel-tam-test', 'elestirel-kiyaslar'],
    'dikkat-hata-bulma': ['hata-bulma'],
    'mekanik-akil-yurutme': ['mekanik'],
    'durumsal-yargi': ['sjt'],
    'degerlendirme-merkezi': ['in-tray', 'e-tray', 'vaka-analizi', 'sunum-egzersizi', 'grup-egzersizi'],
}
