#!/usr/bin/env python3
"""
Psikometrik Test — Otomatik Soru Üretici (CLI)
Usage:
  python main.py --module tp-sozel --per-level 20
  python main.py --module tp-sayisal --per-level 100 --options 4
  python main.py --module capp-sozel --cok-kolay 50 --kolay 30
  python main.py --module tp-sozel --dry-run --per-level 5

Pipeline (9 adım):
  1. PDF okuma
  2. İçerik çıkarma
  3-4. Soru üretimi (zorluk başına)
  5. Görsel içerik işleme (tablo→JSON, passage→HTML, chart→SVG)
  6. Cevap doğrulama (çapraz doğrulama)
  7. Benzersizlik kontrolü
  8. Dağılım dengesi
  9. TypeScript yazma
"""
import argparse
import json
import sys
import time
from pathlib import Path

from config import (
    DEFAULT_PER_LEVEL, DEFAULT_DIFFICULTIES, DIFFICULTY_LABELS,
    MODULE_SEED_MAP, CATEGORY_MODULES, PDFS_DIR, OUTPUT_DIR, HISTORY_DIR,
    SEED_DIR, ANTHROPIC_API_KEY
)
from pipeline.pdf_reader import read_pdfs_from_folder
from pipeline.content_extractor import extract_content
from pipeline.prompt_builder import build_prompt
from pipeline.question_generator import generate_questions
from pipeline.visual_generator import process_visual_content
from pipeline.answer_validator import validate_answers
from pipeline.distribution_fixer import fix_distribution
from pipeline.apostrophe_fixer import fix_apostrophes
from pipeline.dedup import check_and_update_history
from pipeline.ts_writer import write_ts_file


def parse_args():
    parser = argparse.ArgumentParser(
        description='Psikometrik Test — Otomatik Soru Üretici',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  python main.py --module tp-sozel --per-level 20
  python main.py --module tp-sayisal --per-level 100 --options 4
  python main.py --module capp-sozel --cok-kolay 50 --kolay 30
  python main.py --module tp-sozel --dry-run --per-level 5
  python main.py --list-modules
        """
    )
    parser.add_argument('--module', '-m', type=str, help='Modül ID (ör: tp-sozel, capp-sayisal)')
    parser.add_argument('--per-level', '-n', type=int, default=None, help=f'Her zorluk seviyesinden kaç soru (varsayılan: {DEFAULT_PER_LEVEL})')
    parser.add_argument('--options', '-o', type=int, default=None, help='Seçenek sayısı (4 veya 5, varsayılan modüle göre)')
    parser.add_argument('--pdf', type=str, default=None, help='Belirli bir PDF dosyası yolu')

    # Per-difficulty overrides
    parser.add_argument('--cok-kolay', type=int, default=None, help='Çok Kolay soru sayısı')
    parser.add_argument('--kolay', type=int, default=None, help='Kolay soru sayısı')
    parser.add_argument('--orta', type=int, default=None, help='Orta soru sayısı')
    parser.add_argument('--zor', type=int, default=None, help='Zor soru sayısı')
    parser.add_argument('--cok-zor', type=int, default=None, help='Çok Zor soru sayısı')

    parser.add_argument('--dry-run', action='store_true', help='API çağrısı yapmadan prompt göster')
    parser.add_argument('--list-modules', action='store_true', help='Tüm modülleri listele')
    parser.add_argument('--output', type=str, default=None, help='Çıktı dosya yolu (varsayılan: output/)')
    parser.add_argument('--no-dedup', action='store_true', help='Benzersizlik kontrolünü atla')
    parser.add_argument('--no-validate', action='store_true', help='Cevap doğrulamayı atla')
    parser.add_argument('--verbose', '-v', action='store_true', help='Detaylı çıktı')

    return parser.parse_args()


def list_modules():
    """Tüm modülleri kategorileriyle listele."""
    print('\n📋 Mevcut Modüller:\n')
    for cat, modules in CATEGORY_MODULES.items():
        print(f'  📁 {cat}')
        for mod in modules:
            info = MODULE_SEED_MAP.get(mod, {})
            opts = info.get('options', 5)
            print(f'     ├── {mod} ({opts} şık)')
        print()


def get_difficulty_counts(args):
    """Zorluk seviyesi başına soru sayılarını belirle."""
    per_level = args.per_level or DEFAULT_PER_LEVEL
    counts = {}

    for diff in DEFAULT_DIFFICULTIES:
        arg_name = diff.replace('-', '_')
        override = getattr(args, arg_name, None)
        counts[diff] = override if override is not None else per_level

    return counts


def run_pipeline(module: str, difficulty_counts: dict, options_count: int,
                 pdf_path: str = None, dry_run: bool = False,
                 no_dedup: bool = False, no_validate: bool = False,
                 verbose: bool = False, output_path: str = None):
    """Ana pipeline çalıştır."""

    module_info = MODULE_SEED_MAP[module]
    category = None
    for cat, mods in CATEGORY_MODULES.items():
        if module in mods:
            category = cat
            break

    total_questions = sum(difficulty_counts.values())
    print(f'\n🚀 Soru Üretimi Başlıyor')
    print(f'   Modül: {module} (Kategori: {category})')
    print(f'   Toplam: {total_questions} soru')
    print(f'   Seçenek: {options_count} şık')
    print(f'   Dağılım:')
    for diff, count in difficulty_counts.items():
        if count > 0:
            print(f'     {DIFFICULTY_LABELS[diff]:>10}: {count} soru')
    print()

    # === Step 1: PDF Okuma ===
    print('📄 [1/9] PDF dosyaları okunuyor...')
    pdf_folder = Path(pdf_path) if pdf_path else PDFS_DIR / module
    if pdf_folder.is_file():
        raw_content = read_pdfs_from_folder(pdf_folder.parent, specific_file=pdf_folder.name)
    elif pdf_folder.exists():
        raw_content = read_pdfs_from_folder(pdf_folder)
    else:
        print(f'   ⚠️  PDF klasörü bulunamadı: {pdf_folder}')
        print(f'   ℹ️  PDF olmadan devam ediliyor (Claude kendi içerik üretecek)')
        raw_content = None

    # === Step 2: İçerik Çıkarma ===
    print('🔍 [2/9] İçerik yapılandırılıyor...')
    structured_content = extract_content(raw_content) if raw_content else None

    if verbose and structured_content:
        print(f'   Tablolar: {len(structured_content.get("tables", []))}')
        print(f'   Paragraflar: {len(structured_content.get("passages", []))}')

    # === Step 3-4: Her zorluk seviyesi için soru üretimi ===
    all_questions = []
    for diff, count in difficulty_counts.items():
        if count == 0:
            continue

        print(f'\n🧠 [3/9] {DIFFICULTY_LABELS[diff]} — {count} soru üretiliyor...')

        # Build prompt
        prompt = build_prompt(
            module=module,
            category=category,
            difficulty=diff,
            count=count,
            options_count=options_count,
            content=structured_content,
            existing_questions=all_questions  # exclude for uniqueness
        )

        if dry_run:
            print(f'\n--- DRY RUN: {diff} Prompt ---')
            print(prompt[:2000])
            print(f'... ({len(prompt)} karakter toplam)')
            continue

        # Generate questions via Claude API
        questions = generate_questions(
            prompt=prompt,
            difficulty=diff,
            count=count,
            module=module,
            category=category,
            options_count=options_count,
            id_prefix=module_info['prefix'],
            start_index=len(all_questions) + 1,
            verbose=verbose
        )

        print(f'   ✅ {len(questions)} soru üretildi')
        all_questions.extend(questions)

    if dry_run:
        print('\n🏁 Dry run tamamlandı. API çağrısı yapılmadı.')
        return

    print(f'\n📊 [4/9] Toplam {len(all_questions)} soru üretildi')

    # === Step 5: Görsel İçerik İşleme (YENİ — SVG yerine) ===
    print('🎨 [5/9] Görsel içerik işleniyor...')
    text_count = 0
    table_count = 0
    svg_count = 0
    for q in all_questions:
        vc = process_visual_content(q, module)
        if vc:
            q['visualContent'] = vc
            vtype = vc.get('type', '')
            if vtype == 'text':
                text_count += 1
            elif vtype == 'table':
                table_count += 1
            elif vtype == 'svg':
                svg_count += 1
    print(f'   ✅ İşlendi: {text_count} metin, {table_count} tablo, {svg_count} grafik SVG')

    # === Step 6: Cevap Doğrulama (YENİ — Çapraz doğrulama) ===
    if not no_validate:
        print('🔍 [6/9] Cevap doğrulama (çapraz kontrol)...')
        all_questions = validate_answers(all_questions, module, verbose)

        # Report validation summary
        verified = sum(1 for q in all_questions if q.get('_validation') == 'verified')
        needs_review = sum(1 for q in all_questions if q.get('_validation') == 'needs_review')
        skipped = sum(1 for q in all_questions if q.get('_validation') == 'skipped')
        if needs_review > 0:
            print(f'   ⚠️  {needs_review} soru inceleme bekliyor')
    else:
        print('⏭️  [6/9] Cevap doğrulama atlandı')

    # === Step 7: Benzersizlik Kontrolü ===
    if not no_dedup:
        print('🔎 [7/9] Benzersizlik kontrolü...')
        unique_count = check_and_update_history(all_questions, module)
        print(f'   ✅ {unique_count}/{len(all_questions)} benzersiz soru')
    else:
        print('⏭️  [7/9] Benzersizlik kontrolü atlandı')

    # === Step 8: Dağılım Dengesi ===
    print('⚖️  [8/9] Cevap dağılımı dengeleniyor...')
    all_questions = fix_distribution(all_questions, options_count)
    print('   ✅ Dağılım dengelendi')

    # === Step 9: Apostrof Düzeltme & TS Yazma ===
    print('✍️  [9/9] TypeScript dosyası yazılıyor...')
    all_questions = fix_apostrophes(all_questions)

    # Determine output path
    if output_path:
        out_file = Path(output_path)
    else:
        out_file = OUTPUT_DIR / module_info['file']

    write_ts_file(
        questions=all_questions,
        output_path=out_file,
        export_name=module_info['export'],
        module=module,
        category=category
    )

    # Also write JSON for preview (includes validation info + visualContent)
    json_file = out_file.with_suffix('.json')
    preview_data = []
    for q in all_questions:
        qdata = {
            'id': q.get('id', ''),
            'categoryId': q.get('categoryId', ''),
            'subModuleId': q.get('subModuleId', ''),
            'difficulty': q.get('difficulty', ''),
            'questionText': q.get('questionText', ''),
            'visualContent': q.get('visualContent', {}),
            'options': q.get('options', []),
            'correctAnswer': q.get('correctAnswer', 0),
            'solution': q.get('solution', ''),
            'tags': q.get('tags', []),
        }
        # Include validation info for the UI
        if q.get('_validation'):
            qdata['_validation'] = q['_validation']
            qdata['_validation_detail'] = q.get('_validation_detail', '')
        preview_data.append(qdata)

    json_file.write_text(json.dumps(preview_data, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'   📋 JSON: {json_file}')

    print(f'\n🎉 Tamamlandı!')
    print(f'   📁 Dosya: {out_file}')
    print(f'   📝 Toplam: {len(all_questions)} soru')
    print(f'   📋 Export: {module_info["export"]}')

    # Validation summary
    if not no_validate:
        verified = sum(1 for q in all_questions if q.get('_validation') == 'verified')
        needs_review = sum(1 for q in all_questions if q.get('_validation') == 'needs_review')
        if needs_review > 0:
            print(f'   ⚠️  Doğrulama: {verified} ✅ | {needs_review} ⚠️ inceleme gerekli')
        else:
            print(f'   ✅ Doğrulama: {verified} soru doğrulandı')

    print(f'\n   Sonraki adım: Dosyayı data/questions/ altına kopyalayın')
    print(f'   cp {out_file} {SEED_DIR / module_info["file"]}')


def main():
    args = parse_args()

    if args.list_modules:
        list_modules()
        return

    if not args.module:
        print('❌ --module parametresi gerekli. --list-modules ile modülleri görün.')
        sys.exit(1)

    if args.module not in MODULE_SEED_MAP:
        print(f'❌ Bilinmeyen modül: {args.module}')
        print(f'   Geçerli modüller: {", ".join(MODULE_SEED_MAP.keys())}')
        sys.exit(1)

    if not ANTHROPIC_API_KEY and not args.dry_run:
        print('❌ ANTHROPIC_API_KEY bulunamadı.')
        print('   .env dosyasına API key ekleyin veya --dry-run kullanın.')
        sys.exit(1)

    module_info = MODULE_SEED_MAP[args.module]
    options_count = args.options or module_info.get('options', 5)
    difficulty_counts = get_difficulty_counts(args)

    start_time = time.time()
    run_pipeline(
        module=args.module,
        difficulty_counts=difficulty_counts,
        options_count=options_count,
        pdf_path=args.pdf,
        dry_run=args.dry_run,
        no_dedup=args.no_dedup,
        no_validate=args.no_validate,
        verbose=args.verbose,
        output_path=args.output
    )
    elapsed = time.time() - start_time
    print(f'\n⏱️  Süre: {elapsed:.1f} saniye')


if __name__ == '__main__':
    main()
