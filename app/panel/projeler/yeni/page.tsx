'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Briefcase,
  Clock,
  List,
  Target,
  Settings2,
  FileText,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit2,
} from 'lucide-react';

const STEPS = ['Temel Bilgiler', 'Envanterler', 'Testler', 'Ayarlar', 'Önizleme'];

const mockInventories = [
  { id: 'inv1', title: 'OCEAN Kişilik Envanteri', type: 'Kişilik Envanteri', items: 90, time: 20, typeColor: 'bg-purple-100 text-purple-700' },
  { id: 'inv2', title: 'Çalışma Değerleri Envanteri', type: 'Çalışma Değerleri', items: 168, time: 20, typeColor: 'bg-teal-100 text-teal-700' },
];

const mockTestCategories = [
  {
    id: 'cat4',
    title: 'Eleştirel Düşünme',
    count: 10,
    tests: [
      { id: 't1', title: 'Eleştirel Düşünme / Bilgi Yorumlama — Giriş Seviye', level: 'Giriş Seviye', levelColor: 'bg-emerald-100 text-emerald-700', questions: 4, time: 8, passRate: 50, easyCount: 2, mediumCount: 2, hardCount: 0 },
      { id: 't2', title: 'Eleştirel Düşünme — Giriş Seviye', level: 'Giriş Seviye', levelColor: 'bg-emerald-100 text-emerald-700', questions: 4, time: 8, passRate: 50, easyCount: 3, mediumCount: 1, hardCount: 0 },
      { id: 't3', title: 'Eleştirel Düşünme — Orta Seviye', level: 'Orta Seviye', levelColor: 'bg-blue-100 text-blue-700', questions: 6, time: 12, passRate: 60, easyCount: 1, mediumCount: 3, hardCount: 2 },
    ],
  },
];

export default function YeniOzelProjePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedInventories, setSelectedInventories] = useState<Set<string>>(new Set());
  const [selectedTests, setSelectedTests] = useState<any[]>([]);

  const toggleInventory = (id: string) => {
    const next = new Set(selectedInventories);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedInventories(next);
  };

  const addTest = (test: any) => {
    if (!selectedTests.find((t) => t.id === test.id)) setSelectedTests([...selectedTests, test]);
  };

  const removeTest = (id: string) => setSelectedTests(selectedTests.filter((t) => t.id !== id));
  const moveTest = (index: number, direction: number) => {
    const next = [...selectedTests];
    const tmp = next[index];
    next[index] = next[index + direction];
    next[index + direction] = tmp;
    setSelectedTests(next);
  };

  const totals = useMemo(() => {
    const invTime = mockInventories.filter((i) => selectedInventories.has(i.id)).reduce((a, b) => a + b.time, 0);
    const testTime = selectedTests.reduce((a, b) => a + (b.time || 0), 0);
    const questions = selectedTests.reduce((a, b) => a + (b.questions || 0), 0);
    return { invTime, testTime, questions, total: invTime + testTime };
  }, [selectedInventories, selectedTests]);

  return (
    <div className="-mx-4 lg:-mx-6 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] bg-[#F8F9FC] flex flex-col">
      <div className="px-4 lg:px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-1">
            <button onClick={() => router.push('/panel/projeler')} className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Geri
            </button>
            <div className="w-px h-3 bg-slate-300 mx-1" />
            <span className="text-slate-900 font-bold hidden lg:inline whitespace-nowrap">Özel Proje Oluştur</span>
          </div>
          <div className="hidden md:flex items-center justify-center w-full max-w-2xl px-4">
            {STEPS.map((label, idx) => {
              const no = idx + 1;
              const isActive = step === no;
              const isPast = step > no;
              return (
                <div key={label} className="flex items-center flex-1">
                  <button onClick={() => setStep(no)} className="relative flex flex-col items-center group">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isActive ? 'bg-indigo-600 text-white ring-2 ring-indigo-50' : isPast ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-300'}`}>
                      {isPast ? <Check size={10} strokeWidth={3} /> : no}
                    </div>
                    <span className={`absolute top-6 whitespace-nowrap text-[9px] ${isActive ? 'text-indigo-600 font-bold' : 'text-slate-400 font-medium'}`}>{label}</span>
                  </button>
                  {idx < STEPS.length - 1 && <div className={`flex-1 h-px mx-1.5 ${isPast ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
                </div>
              );
            })}
          </div>
          <div className="flex-1" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {step === 1 && (
          <div className="w-full max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Proje Adı *</label>
                <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Açıklama</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Sektör *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Üretim & Sanayi</option>
                    <option>Bilişim & Teknoloji</option>
                    <option>Finans & Bankacılık</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Pozisyon Seviyesi *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Yönetici</option>
                    <option>Orta Kademe</option>
                    <option>Uzman</option>
                    <option>Ekip Lideri</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Mevcut Envanterler</h3>
              {mockInventories.map((inv) => {
                const active = selectedInventories.has(inv.id);
                return (
                  <div key={inv.id} className={`p-4 rounded-xl border ${active ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{inv.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{inv.items} madde • {inv.time} dk</p>
                      </div>
                      <button onClick={() => toggleInventory(inv.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${active ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>{active ? 'Kaldır' : 'Ekle'}</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Seçilen Envanterler ({selectedInventories.size})</h3>
              <div className="space-y-2">
                {Array.from(selectedInventories).map((id, idx) => {
                  const inv = mockInventories.find((i) => i.id === id);
                  if (!inv) return null;
                  return (
                    <div key={id} className="p-3 border border-slate-200 rounded-lg flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">{idx + 1}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{inv.title}</p>
                        <p className="text-xs text-slate-500">{inv.items} madde • {inv.time} dk</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr_420px] gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-3">
              <h3 className="text-sm font-bold text-slate-900 mb-2 px-1">Kategoriler</h3>
              <button className="w-full p-3 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold text-left">{mockTestCategories[0].title}</button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              {mockTestCategories[0].tests.map((t) => (
                <div key={t.id} className="p-3 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{t.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{t.questions} soru • {t.time} dk • %{t.passRate}</p>
                    </div>
                    <button onClick={() => addTest(t)} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">Ekle</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Bölümler ({selectedTests.length})</h3>
              <div className="space-y-2">
                {selectedTests.map((t, i) => (
                  <div key={t.id} className="p-3 rounded-lg border border-slate-200">
                    <p className="text-sm font-bold text-slate-900">{t.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{t.questions} soru • {t.time} dk</p>
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                      <button disabled={i === 0} onClick={() => moveTest(i, -1)} className="p-1.5 rounded bg-slate-50 disabled:opacity-40"><ChevronUp size={14} /></button>
                      <button disabled={i === selectedTests.length - 1} onClick={() => moveTest(i, 1)} className="p-1.5 rounded bg-slate-50 disabled:opacity-40"><ChevronDown size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-slate-50"><Edit2 size={14} /></button>
                      <button onClick={() => removeTest(t.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Settings2 size={16} className="text-indigo-600" /> Soru Sunumu ve Süre</h3>
              <label className="flex items-center gap-3 text-[13px]"><input type="radio" name="qtype" defaultChecked /> Tek tek</label>
              <label className="flex items-center gap-3 text-[13px]"><input type="radio" name="qtype" /> Sayfa sayfa</label>
              <label className="flex items-center gap-3 text-[13px]"><input type="checkbox" defaultChecked /> Soruları karıştır</label>
              <label className="flex items-center gap-3 text-[13px]"><input type="checkbox" defaultChecked /> Seçenekleri karıştır</label>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Target size={16} className="text-indigo-600" /> Güvenlik ve Aday Deneyimi</h3>
              <label className="flex items-center gap-3 text-[13px]"><input type="checkbox" defaultChecked /> Sekme değiştirme algılama</label>
              <label className="flex items-center gap-3 text-[13px]"><input type="checkbox" defaultChecked /> Kopyalama engelleme</label>
              <label className="flex items-center gap-3 text-[13px]"><input type="checkbox" defaultChecked /> Adaya sonuçları göster</label>
              <label className="flex items-center gap-3 text-[13px]"><input type="checkbox" /> Doğru cevapları göster</label>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h1 className="text-lg font-bold text-slate-900 mb-1.5">Yeni İşe Alım Projesi</h1>
                <p className="text-[13px] text-slate-500">Bu proje, adayların yetkinliklerini ve kişilik özelliklerini değerlendirmek amacıyla oluşturulmuştur.</p>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                  <span className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700 flex items-center gap-1.5"><Building2 size={12} /> Finans & Bankacılık</span>
                  <span className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700 flex items-center gap-1.5"><Briefcase size={12} /> Yönetici</span>
                  <span className="px-2.5 py-1 rounded-md border border-indigo-100 bg-indigo-50 text-[11px] font-medium text-indigo-700 flex items-center gap-1.5"><FileText size={12} /> {selectedInventories.size} Envanter, {selectedTests.length} Test</span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="text-[13px] font-bold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Değerlendirme Testleri</h3>
                <div className="space-y-2">
                  {selectedTests.map((t, idx) => (
                    <div key={t.id} className="p-3 rounded-lg border border-slate-100">
                      <p className="text-[13px] font-bold text-slate-900">{idx + 1}. {t.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{t.questions} soru • {t.time} dk</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 h-fit sticky top-4">
              <h3 className="text-[13px] font-bold text-slate-900 mb-4 flex items-center gap-2"><Settings2 size={14} className="text-slate-500" /> Proje Ayarları Özeti</h3>
              <ul className="space-y-2 text-[11px]">
                <li className="flex justify-between"><span className="text-slate-600">Toplam Süre</span><span className="font-bold text-slate-900">{totals.total} dk</span></li>
                <li className="flex justify-between"><span className="text-slate-600">Toplam Soru</span><span className="font-bold text-slate-900">{totals.questions}</span></li>
                <li className="flex justify-between"><span className="text-slate-600">Envanter</span><span className="font-bold text-slate-900">{selectedInventories.size}</span></li>
                <li className="flex justify-between"><span className="text-slate-600">Test Bölümü</span><span className="font-bold text-slate-900">{selectedTests.length}</span></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 lg:px-6 py-4 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
        <button onClick={() => (step > 1 ? setStep(step - 1) : router.push('/panel/projeler'))} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm">
          <ArrowLeft size={16} /> Geri
        </button>
        <button onClick={() => (step < 5 ? setStep(step + 1) : router.push('/panel/projeler'))} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm shadow-sm">
          {step === 5 ? 'Tamamla' : 'İleri'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
