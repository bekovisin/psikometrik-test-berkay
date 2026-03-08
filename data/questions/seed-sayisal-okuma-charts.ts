import { Question } from '@/lib/types';

const T = '2025-02-01T00:00:00.000Z';

// ── G1: Dikey Bar Chart — İl Bazlı Yıllık Konut Satışı (bin adet) ──
const SVG_G1 = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="600" height="300" fill="#f8fafc" rx="10"/><text x="300" y="25" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">İl Bazlı Yıllık Konut Satışı (bin adet)</text><line x1="70" y1="250" x2="570" y2="250" stroke="#94a3b8" stroke-width="1"/><line x1="70" y1="250" x2="70" y2="40" stroke="#94a3b8" stroke-width="1"/><line x1="70" y1="197" x2="570" y2="197" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="145" x2="570" y2="145" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="92" x2="570" y2="92" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="40" x2="570" y2="40" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><text x="62" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text><text x="62" y="201" text-anchor="end" font-size="9" fill="#64748b">50</text><text x="62" y="149" text-anchor="end" font-size="9" fill="#64748b">100</text><text x="62" y="96" text-anchor="end" font-size="9" fill="#64748b">150</text><text x="62" y="44" text-anchor="end" font-size="9" fill="#64748b">200</text><rect x="95" y="55" width="60" height="195" fill="#6366f1" rx="4"/><text x="125" y="48" text-anchor="middle" font-size="10" font-weight="bold" fill="#6366f1">185</text><text x="125" y="268" text-anchor="middle" font-size="10" fill="#475569">İstanbul</text><rect x="178" y="150" width="60" height="100" fill="#8b5cf6" rx="4"/><text x="208" y="143" text-anchor="middle" font-size="10" font-weight="bold" fill="#8b5cf6">95</text><text x="208" y="268" text-anchor="middle" font-size="10" fill="#475569">Ankara</text><rect x="261" y="174" width="60" height="76" fill="#a78bfa" rx="4"/><text x="291" y="167" text-anchor="middle" font-size="10" font-weight="bold" fill="#a78bfa">72</text><text x="291" y="268" text-anchor="middle" font-size="10" fill="#475569">İzmir</text><rect x="344" y="178" width="60" height="72" fill="#c4b5fd" rx="4"/><text x="374" y="171" text-anchor="middle" font-size="10" font-weight="bold" fill="#c4b5fd">68</text><text x="374" y="268" text-anchor="middle" font-size="10" fill="#475569">Antalya</text><rect x="427" y="192" width="60" height="58" fill="#ddd6fe" rx="4"/><text x="457" y="185" text-anchor="middle" font-size="10" font-weight="bold" fill="#7c3aed">55</text><text x="457" y="268" text-anchor="middle" font-size="10" fill="#475569">Bursa</text><rect x="510" y="206" width="60" height="44" fill="#ede9fe" rx="4"/><text x="540" y="199" text-anchor="middle" font-size="10" font-weight="bold" fill="#7c3aed">42</text><text x="540" y="268" text-anchor="middle" font-size="10" fill="#475569">Mersin</text><text x="570" y="290" text-anchor="end" font-size="9" fill="#94a3b8">Kaynak: TÜİK 2024 Konut İstatistikleri</text></svg>`;
// ── G2: Line Chart — XYZ A.Ş. Aylık Net Kâr Trendi (milyon TL) ──
const SVG_G2 = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="600" height="300" fill="#f8fafc" rx="10"/><text x="300" y="25" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">XYZ A.Ş. Aylık Net Kâr Trendi (milyon TL)</text><line x1="60" y1="250" x2="560" y2="250" stroke="#94a3b8" stroke-width="1"/><line x1="60" y1="250" x2="60" y2="40" stroke="#94a3b8" stroke-width="1"/><line x1="60" y1="215" x2="560" y2="215" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="180" x2="560" y2="180" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="145" x2="560" y2="145" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="110" x2="560" y2="110" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="75" x2="560" y2="75" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="40" x2="560" y2="40" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><text x="52" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text><text x="52" y="219" text-anchor="end" font-size="9" fill="#64748b">5</text><text x="52" y="184" text-anchor="end" font-size="9" fill="#64748b">10</text><text x="52" y="149" text-anchor="end" font-size="9" fill="#64748b">15</text><text x="52" y="114" text-anchor="end" font-size="9" fill="#64748b">20</text><text x="52" y="79" text-anchor="end" font-size="9" fill="#64748b">25</text><text x="52" y="44" text-anchor="end" font-size="9" fill="#64748b">30</text><text x="95" y="268" text-anchor="middle" font-size="10" fill="#475569">Oca</text><text x="161" y="268" text-anchor="middle" font-size="10" fill="#475569">Şub</text><text x="228" y="268" text-anchor="middle" font-size="10" fill="#475569">Mar</text><text x="294" y="268" text-anchor="middle" font-size="10" fill="#475569">Nis</text><text x="361" y="268" text-anchor="middle" font-size="10" fill="#475569">May</text><text x="427" y="268" text-anchor="middle" font-size="10" fill="#475569">Haz</text><text x="494" y="268" text-anchor="middle" font-size="10" fill="#475569">Tem</text><text x="560" y="268" text-anchor="middle" font-size="10" fill="#475569">Ağu</text><polygon points="95,166 161,145 228,124 294,152 361,96 427,75 494,110 560,54 560,250 95,250" fill="#ef4444" opacity="0.1"/><polyline points="95,166 161,145 228,124 294,152 361,96 427,75 494,110 560,54" stroke="#ef4444" stroke-width="2.5" fill="none"/><circle cx="95" cy="166" r="4.5" fill="#ef4444"/><text x="95" y="158" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">12</text><circle cx="161" cy="145" r="4.5" fill="#ef4444"/><text x="161" y="137" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">15</text><circle cx="228" cy="124" r="4.5" fill="#ef4444"/><text x="228" y="116" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">18</text><circle cx="294" cy="152" r="4.5" fill="#ef4444"/><text x="294" y="144" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">14</text><circle cx="361" cy="96" r="4.5" fill="#ef4444"/><text x="361" y="88" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">22</text><circle cx="427" cy="75" r="4.5" fill="#ef4444"/><text x="427" y="67" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">25</text><circle cx="494" cy="110" r="4.5" fill="#ef4444"/><text x="494" y="102" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">20</text><circle cx="560" cy="54" r="4.5" fill="#ef4444"/><text x="560" y="46" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">28</text><text x="560" y="290" text-anchor="end" font-size="9" fill="#94a3b8">Kaynak: XYZ A.Ş. 2024 Mali Tabloları</text></svg>`;
// ── G3: Pie Chart — Türkiye Enerji Kaynakları Dağılımı ──
const SVG_G3 = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="600" height="300" fill="#f8fafc" rx="10"/><text x="300" y="25" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">Türkiye Enerji Kaynakları Dağılımı</text><path d="M 200,160 L 200,50 A 110,110 0 0,1 305,215 Z" fill="#3b82f6"/><path d="M 200,160 L 305,215 A 110,110 0 0,1 131,255 Z" fill="#64748b"/><path d="M 200,160 L 131,255 A 110,110 0 0,1 96,115 Z" fill="#06b6d4"/><path d="M 200,160 L 96,115 A 110,110 0 0,1 147,63 Z" fill="#10b981"/><path d="M 200,160 L 147,63 A 110,110 0 0,1 200,50 Z" fill="#f59e0b"/><text x="260" y="110" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">%32</text><text x="250" y="230" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">%28</text><text x="120" y="200" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">%20</text><text x="120" y="110" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">%12</text><text x="165" y="65" text-anchor="middle" font-size="9" font-weight="bold" fill="#fff">%8</text><rect x="370" y="70" width="14" height="14" rx="3" fill="#3b82f6"/><text x="390" y="82" font-size="11" fill="#334155">Doğalgaz %32</text><rect x="370" y="95" width="14" height="14" rx="3" fill="#64748b"/><text x="390" y="107" font-size="11" fill="#334155">Kömür %28</text><rect x="370" y="120" width="14" height="14" rx="3" fill="#06b6d4"/><text x="390" y="132" font-size="11" fill="#334155">Hidroelektrik %20</text><rect x="370" y="145" width="14" height="14" rx="3" fill="#10b981"/><text x="390" y="157" font-size="11" fill="#334155">Rüzgâr %12</text><rect x="370" y="170" width="14" height="14" rx="3" fill="#f59e0b"/><text x="390" y="182" font-size="11" fill="#334155">Güneş %8</text><text x="560" y="290" text-anchor="end" font-size="9" fill="#94a3b8">Kaynak: EPDK 2024 Enerji Raporu</text></svg>`;
// ── G4: Grouped Bar Chart — Sektör Bazlı İstihdam Değişimi (bin kişi) ──
const SVG_G4 = `<svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="620" height="300" fill="#f8fafc" rx="10"/><text x="310" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">Sektör Bazlı İstihdam Değişimi (bin kişi)</text><rect x="180" y="33" width="10" height="10" fill="#94a3b8"/><text x="195" y="42" font-size="9" fill="#334155">2022</text><rect x="240" y="33" width="10" height="10" fill="#6366f1"/><text x="255" y="42" font-size="9" fill="#334155">2023</text><rect x="300" y="33" width="10" height="10" fill="#4f46e5"/><text x="315" y="42" font-size="9" fill="#334155">2024</text><line x1="70" y1="250" x2="590" y2="250" stroke="#94a3b8" stroke-width="1"/><line x1="70" y1="250" x2="70" y2="55" stroke="#94a3b8" stroke-width="1"/><line x1="70" y1="211" x2="590" y2="211" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="172" x2="590" y2="172" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="133" x2="590" y2="133" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="94" x2="590" y2="94" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="55" x2="590" y2="55" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><text x="62" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text><text x="62" y="215" text-anchor="end" font-size="9" fill="#64748b">50</text><text x="62" y="176" text-anchor="end" font-size="9" fill="#64748b">100</text><text x="62" y="137" text-anchor="end" font-size="9" fill="#64748b">150</text><text x="62" y="98" text-anchor="end" font-size="9" fill="#64748b">200</text><text x="62" y="59" text-anchor="end" font-size="9" fill="#64748b">250</text><rect x="90" y="110" width="35" height="140" fill="#94a3b8" rx="3"/><text x="107" y="105" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748b">180</text><rect x="128" y="87" width="35" height="163" fill="#6366f1" rx="3"/><text x="145" y="82" text-anchor="middle" font-size="8" font-weight="bold" fill="#6366f1">210</text><rect x="166" y="56" width="35" height="194" fill="#4f46e5" rx="3"/><text x="183" y="51" text-anchor="middle" font-size="8" font-weight="bold" fill="#4f46e5">250</text><text x="145" y="270" text-anchor="middle" font-size="10" fill="#475569">Teknoloji</text><rect x="228" y="133" width="35" height="117" fill="#94a3b8" rx="3"/><text x="245" y="128" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748b">150</text><rect x="266" y="122" width="35" height="128" fill="#6366f1" rx="3"/><text x="283" y="117" text-anchor="middle" font-size="8" font-weight="bold" fill="#6366f1">165</text><rect x="304" y="110" width="35" height="140" fill="#4f46e5" rx="3"/><text x="321" y="105" text-anchor="middle" font-size="8" font-weight="bold" fill="#4f46e5">180</text><text x="283" y="270" text-anchor="middle" font-size="10" fill="#475569">Finans</text><rect x="366" y="156" width="35" height="94" fill="#94a3b8" rx="3"/><text x="383" y="151" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748b">120</text><rect x="404" y="145" width="35" height="105" fill="#6366f1" rx="3"/><text x="421" y="140" text-anchor="middle" font-size="8" font-weight="bold" fill="#6366f1">135</text><rect x="442" y="130" width="35" height="120" fill="#4f46e5" rx="3"/><text x="459" y="125" text-anchor="middle" font-size="8" font-weight="bold" fill="#4f46e5">155</text><text x="421" y="270" text-anchor="middle" font-size="10" fill="#475569">Sağlık</text><rect x="504" y="32" width="35" height="218" fill="#94a3b8" rx="3"/><text x="521" y="27" text-anchor="middle" font-size="8" font-weight="bold" fill="#64748b">280</text><rect x="542" y="48" width="35" height="202" fill="#6366f1" rx="3"/><text x="559" y="43" text-anchor="middle" font-size="8" font-weight="bold" fill="#6366f1">260</text><rect x="542" y="60" width="35" height="190" fill="#4f46e5" rx="3"/><text x="559" y="55" text-anchor="middle" font-size="8" font-weight="bold" fill="#4f46e5">245</text><text x="540" y="270" text-anchor="middle" font-size="10" fill="#475569">Üretim</text></svg>`;
// ── G5: Stacked Bar Chart — Şirket Çeyreklik Gider Dağılımı (bin TL) ──
const SVG_G5 = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="600" height="300" fill="#f8fafc" rx="10"/><text x="300" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">Şirket Çeyreklik Gider Dağılımı (bin TL)</text><rect x="150" y="33" width="10" height="10" fill="#6366f1"/><text x="165" y="42" font-size="9" fill="#334155">Personel</text><rect x="230" y="33" width="10" height="10" fill="#f59e0b"/><text x="245" y="42" font-size="9" fill="#334155">Kira</text><rect x="290" y="33" width="10" height="10" fill="#10b981"/><text x="305" y="42" font-size="9" fill="#334155">Malzeme</text><line x1="70" y1="260" x2="550" y2="260" stroke="#94a3b8" stroke-width="1"/><line x1="70" y1="260" x2="70" y2="50" stroke="#94a3b8" stroke-width="1"/><line x1="70" y1="218" x2="550" y2="218" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="176" x2="550" y2="176" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="134" x2="550" y2="134" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="92" x2="550" y2="92" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="50" x2="550" y2="50" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4,3"/><text x="62" y="264" text-anchor="end" font-size="9" fill="#64748b">0</text><text x="62" y="222" text-anchor="end" font-size="9" fill="#64748b">50</text><text x="62" y="180" text-anchor="end" font-size="9" fill="#64748b">100</text><text x="62" y="138" text-anchor="end" font-size="9" fill="#64748b">150</text><text x="62" y="96" text-anchor="end" font-size="9" fill="#64748b">200</text><text x="62" y="54" text-anchor="end" font-size="9" fill="#64748b">250</text><rect x="95" y="109" width="80" height="151" fill="#6366f1" rx="3"/><rect x="95" y="71" width="80" height="38" fill="#f59e0b" rx="3"/><rect x="95" y="21" width="80" height="50" fill="#10b981" rx="3"/><text x="135" y="190" text-anchor="middle" font-size="9" fill="#fff">180</text><text x="135" y="94" text-anchor="middle" font-size="9" fill="#fff">45</text><text x="135" y="50" text-anchor="middle" font-size="9" fill="#fff">60</text><text x="135" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">285</text><text x="135" y="278" text-anchor="middle" font-size="10" fill="#475569">Q1</text><rect x="215" y="96" width="80" height="164" fill="#6366f1" rx="3"/><rect x="215" y="58" width="80" height="38" fill="#f59e0b" rx="3"/><rect x="215" y="3" width="80" height="55" fill="#10b981" rx="3"/><text x="255" y="183" text-anchor="middle" font-size="9" fill="#fff">195</text><text x="255" y="81" text-anchor="middle" font-size="9" fill="#fff">45</text><text x="255" y="35" text-anchor="middle" font-size="9" fill="#fff">65</text><text x="255" y="-3" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">305</text><text x="255" y="278" text-anchor="middle" font-size="10" fill="#475569">Q2</text><rect x="335" y="92" width="80" height="168" fill="#6366f1" rx="3"/><rect x="335" y="52" width="80" height="40" fill="#f59e0b" rx="3"/><rect x="335" y="-7" width="80" height="59" fill="#10b981" rx="3"/><text x="375" y="181" text-anchor="middle" font-size="9" fill="#fff">200</text><text x="375" y="76" text-anchor="middle" font-size="9" fill="#fff">48</text><text x="375" y="26" text-anchor="middle" font-size="9" fill="#fff">70</text><text x="375" y="-13" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">318</text><text x="375" y="278" text-anchor="middle" font-size="10" fill="#475569">Q3</text><rect x="455" y="84" width="80" height="176" fill="#6366f1" rx="3"/><rect x="455" y="44" width="80" height="40" fill="#f59e0b" rx="3"/><rect x="455" y="-19" width="80" height="63" fill="#10b981" rx="3"/><text x="495" y="177" text-anchor="middle" font-size="9" fill="#fff">210</text><text x="495" y="68" text-anchor="middle" font-size="9" fill="#fff">48</text><text x="495" y="17" text-anchor="middle" font-size="9" fill="#fff">75</text><text x="495" y="-25" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">333</text><text x="495" y="278" text-anchor="middle" font-size="10" fill="#475569">Q4</text></svg>`;

// ── G6: Horizontal Bar Chart — Calisan Memnuniyet Anketi Sonuclari (%) ──
const SVG_G6 = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="600" height="300" fill="#f8fafc" rx="10"/><text x="300" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">Calisan Memnuniyet Anketi Sonuclari (%)</text><line x1="180" y1="48" x2="180" y2="268" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="260" y1="48" x2="260" y2="268" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="340" y1="48" x2="340" y2="268" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="420" y1="48" x2="420" y2="268" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="500" y1="48" x2="500" y2="268" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="100" y1="268" x2="500" y2="268" stroke="#94a3b8" stroke-width="1"/><text x="100" y="282" text-anchor="middle" font-size="9" fill="#64748b">0</text><text x="180" y="282" text-anchor="middle" font-size="9" fill="#64748b">20</text><text x="260" y="282" text-anchor="middle" font-size="9" fill="#64748b">40</text><text x="340" y="282" text-anchor="middle" font-size="9" fill="#64748b">60</text><text x="420" y="282" text-anchor="middle" font-size="9" fill="#64748b">80</text><text x="500" y="282" text-anchor="middle" font-size="9" fill="#64748b">100</text><text x="95" y="70" text-anchor="end" font-size="11" fill="#334155">Is-Yasam Dengesi</text><rect id="g6_bar1" x="100" y="55" width="312" height="24" rx="4" fill="#6366f1"/><text x="418" y="72" font-size="10" font-weight="bold" fill="#6366f1">%78</text><text x="95" y="108" text-anchor="end" font-size="11" fill="#334155">Maas</text><rect id="g6_bar2" x="100" y="93" width="248" height="24" rx="4" fill="#8b5cf6"/><text x="354" y="110" font-size="10" font-weight="bold" fill="#8b5cf6">%62</text><text x="95" y="146" text-anchor="end" font-size="11" fill="#334155">Kariyer Firsatlari</text><rect id="g6_bar3" x="100" y="131" width="284" height="24" rx="4" fill="#ec4899"/><text x="390" y="148" font-size="10" font-weight="bold" fill="#ec4899">%71</text><text x="95" y="184" text-anchor="end" font-size="11" fill="#334155">Yonetim</text><rect id="g6_bar4" x="100" y="169" width="272" height="24" rx="4" fill="#f59e0b"/><text x="378" y="186" font-size="10" font-weight="bold" fill="#f59e0b">%68</text><text x="95" y="222" text-anchor="end" font-size="11" fill="#334155">Calisma Ortami</text><rect id="g6_bar5" x="100" y="207" width="340" height="24" rx="4" fill="#10b981"/><text x="446" y="224" font-size="10" font-weight="bold" fill="#10b981">%85</text><text x="95" y="260" text-anchor="end" font-size="11" fill="#334155">Egitim Imkanlari</text><rect id="g6_bar6" x="100" y="245" width="296" height="24" rx="4" fill="#06b6d4"/><text x="402" y="262" font-size="10" font-weight="bold" fill="#06b6d4">%74</text></svg>`;
// ── G7: Area Chart — E-Ticaret Gunluk Siparis Sayisi ──
const SVG_G7 = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style><linearGradient id="g7_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.5"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.05"/></linearGradient></defs><rect width="600" height="300" fill="#f8fafc" rx="10"/><text x="300" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">E-Ticaret Gunluk Siparis Sayisi</text><line x1="60" y1="250" x2="560" y2="250" stroke="#94a3b8" stroke-width="1"/><line x1="60" y1="250" x2="60" y2="40" stroke="#94a3b8" stroke-width="1"/><line x1="60" y1="212" x2="560" y2="212" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="174" x2="560" y2="174" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="136" x2="560" y2="136" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="98" x2="560" y2="98" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="60" y1="60" x2="560" y2="60" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><text x="52" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text><text x="52" y="216" text-anchor="end" font-size="9" fill="#64748b">500</text><text x="52" y="178" text-anchor="end" font-size="9" fill="#64748b">1.000</text><text x="52" y="140" text-anchor="end" font-size="9" fill="#64748b">1.500</text><text x="52" y="102" text-anchor="end" font-size="9" fill="#64748b">2.000</text><text x="52" y="64" text-anchor="end" font-size="9" fill="#64748b">2.500</text><polygon id="g7_area" points="100,159 183,148 266,166 349,140 432,114 515,83 560,90 560,250 100,250" fill="url(#g7_grad)"/><polyline id="g7_line" points="100,159 183,148 266,166 349,140 432,114 515,83" stroke="#8b5cf6" stroke-width="2.5" fill="none"/><circle cx="100" cy="159" r="4" fill="#8b5cf6"/><text x="100" y="149" text-anchor="middle" font-size="9" font-weight="bold" fill="#7c3aed">1.200</text><circle cx="183" cy="148" r="4" fill="#8b5cf6"/><text x="183" y="138" text-anchor="middle" font-size="9" font-weight="bold" fill="#7c3aed">1.350</text><circle cx="266" cy="166" r="4" fill="#8b5cf6"/><text x="266" y="156" text-anchor="middle" font-size="9" font-weight="bold" fill="#7c3aed">1.100</text><circle cx="349" cy="140" r="4" fill="#8b5cf6"/><text x="349" y="130" text-anchor="middle" font-size="9" font-weight="bold" fill="#7c3aed">1.450</text><circle cx="432" cy="114" r="4" fill="#8b5cf6"/><text x="432" y="104" text-anchor="middle" font-size="9" font-weight="bold" fill="#7c3aed">1.800</text><circle cx="515" cy="83" r="4" fill="#8b5cf6"/><text x="515" y="73" text-anchor="middle" font-size="9" font-weight="bold" fill="#7c3aed">2.200</text><circle cx="560" cy="90" r="4" fill="#8b5cf6"/><text x="560" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="#7c3aed">1.950</text><text x="100" y="270" text-anchor="middle" font-size="10" fill="#475569">Pzt</text><text x="183" y="270" text-anchor="middle" font-size="10" fill="#475569">Sal</text><text x="266" y="270" text-anchor="middle" font-size="10" fill="#475569">Car</text><text x="349" y="270" text-anchor="middle" font-size="10" fill="#475569">Per</text><text x="432" y="270" text-anchor="middle" font-size="10" fill="#475569">Cum</text><text x="515" y="270" text-anchor="middle" font-size="10" fill="#475569">Cmt</text><text x="560" y="270" text-anchor="middle" font-size="10" fill="#475569">Paz</text></svg>`;
// ── G8: Donut Chart — Belediye Yillik Butce Dagilimi ──
const SVG_G8 = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="600" height="300" fill="#f8fafc" rx="10"/><text x="300" y="25" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">Belediye Yillik Butce Dagilimi</text><path id="g8_s1" d="M200,50 A110,110 0 0,1 305,194 L257,179 A60,60 0 0,0 200,100 Z" fill="#3b82f6"/><path id="g8_s2" d="M305,194 A110,110 0 0,1 186,269 L193,220 A60,60 0 0,0 257,179 Z" fill="#10b981"/><path id="g8_s3" d="M186,269 A110,110 0 0,1 95,194 L143,179 A60,60 0 0,0 193,220 Z" fill="#f59e0b"/><path id="g8_s4" d="M95,194 A110,110 0 0,1 111,95 L152,125 A60,60 0 0,0 143,179 Z" fill="#ef4444"/><path id="g8_s5" d="M111,95 A110,110 0 0,1 166,55 L181,103 A60,60 0 0,0 152,125 Z" fill="#8b5cf6"/><path id="g8_s6" d="M166,55 A110,110 0 0,1 200,50 L200,100 A60,60 0 0,0 181,103 Z" fill="#94a3b8"/><text x="200" y="155" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">850</text><text x="200" y="170" text-anchor="middle" font-size="10" fill="#64748b">Milyon TL</text><rect x="370" y="65" width="14" height="14" rx="3" fill="#3b82f6"/><text x="390" y="77" font-size="11" fill="#334155">Altyapi %30 (255 M)</text><rect x="370" y="90" width="14" height="14" rx="3" fill="#10b981"/><text x="390" y="102" font-size="11" fill="#334155">Ulasim %22 (187 M)</text><rect x="370" y="115" width="14" height="14" rx="3" fill="#f59e0b"/><text x="390" y="127" font-size="11" fill="#334155">Egitim %18 (153 M)</text><rect x="370" y="140" width="14" height="14" rx="3" fill="#ef4444"/><text x="390" y="152" font-size="11" fill="#334155">Saglik %15 (127,5 M)</text><rect x="370" y="165" width="14" height="14" rx="3" fill="#8b5cf6"/><text x="390" y="177" font-size="11" fill="#334155">Kultur %10 (85 M)</text><rect x="370" y="190" width="14" height="14" rx="3" fill="#94a3b8"/><text x="390" y="202" font-size="11" fill="#334155">Diger %5 (42,5 M)</text></svg>`;
// ── G9: Multi-Line Chart — 3 Sehir Konut Fiyat Endeksi (2021=100) ──
const SVG_G9 = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="600" height="300" fill="#f8fafc" rx="10"/><text x="300" y="25" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">3 Sehir Konut Fiyat Endeksi (2021=100)</text><line x1="80" y1="250" x2="540" y2="250" stroke="#94a3b8" stroke-width="1"/><line x1="80" y1="250" x2="80" y2="50" stroke="#94a3b8" stroke-width="1"/><line x1="80" y1="210" x2="540" y2="210" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="80" y1="170" x2="540" y2="170" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="80" y1="130" x2="540" y2="130" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="80" y1="90" x2="540" y2="90" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="80" y1="50" x2="540" y2="50" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><text x="72" y="254" text-anchor="end" font-size="9" fill="#64748b">50</text><text x="72" y="214" text-anchor="end" font-size="9" fill="#64748b">100</text><text x="72" y="174" text-anchor="end" font-size="9" fill="#64748b">150</text><text x="72" y="134" text-anchor="end" font-size="9" fill="#64748b">200</text><text x="72" y="94" text-anchor="end" font-size="9" fill="#64748b">250</text><text x="120" y="270" text-anchor="middle" font-size="10" fill="#475569">2021</text><text x="260" y="270" text-anchor="middle" font-size="10" fill="#475569">2022</text><text x="400" y="270" text-anchor="middle" font-size="10" fill="#475569">2023</text><text x="540" y="270" text-anchor="middle" font-size="10" fill="#475569">2024</text><polyline id="g9_ist" points="120,210 260,156 400,100 540,58" stroke="#ef4444" stroke-width="2.5" fill="none"/><circle cx="120" cy="210" r="4" fill="#ef4444"/><text x="120" y="202" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">100</text><circle cx="260" cy="156" r="4" fill="#ef4444"/><text x="260" y="148" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">135</text><circle cx="400" cy="100" r="4" fill="#ef4444"/><text x="400" y="92" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">185</text><circle cx="540" cy="58" r="4" fill="#ef4444"/><text x="540" y="50" text-anchor="middle" font-size="9" font-weight="bold" fill="#ef4444">240</text><polyline id="g9_ank" points="120,210 260,160 400,118 540,90" stroke="#3b82f6" stroke-width="2.5" fill="none"/><circle cx="120" cy="210" r="4" fill="#3b82f6"/><text x="130" y="220" text-anchor="start" font-size="9" font-weight="bold" fill="#3b82f6">100</text><circle cx="260" cy="160" r="4" fill="#3b82f6"/><text x="270" y="168" text-anchor="start" font-size="9" font-weight="bold" fill="#3b82f6">125</text><circle cx="400" cy="118" r="4" fill="#3b82f6"/><text x="410" y="126" text-anchor="start" font-size="9" font-weight="bold" fill="#3b82f6">160</text><circle cx="540" cy="90" r="4" fill="#3b82f6"/><text x="530" y="86" text-anchor="end" font-size="9" font-weight="bold" fill="#3b82f6">200</text><polyline id="g9_izm" points="120,210 260,158 400,106 540,78" stroke="#10b981" stroke-width="2.5" fill="none"/><circle cx="120" cy="210" r="4" fill="#10b981"/><text x="110" y="220" text-anchor="end" font-size="9" font-weight="bold" fill="#10b981">100</text><circle cx="260" cy="158" r="4" fill="#10b981"/><text x="250" y="152" text-anchor="end" font-size="9" font-weight="bold" fill="#10b981">130</text><circle cx="400" cy="106" r="4" fill="#10b981"/><text x="390" y="100" text-anchor="end" font-size="9" font-weight="bold" fill="#10b981">170</text><circle cx="540" cy="78" r="4" fill="#10b981"/><text x="530" y="72" text-anchor="end" font-size="9" font-weight="bold" fill="#10b981">215</text><line x1="200" y1="38" x2="225" y2="38" stroke="#ef4444" stroke-width="2.5"/><text x="230" y="42" font-size="10" fill="#475569">Istanbul</text><line x1="300" y1="38" x2="325" y2="38" stroke="#3b82f6" stroke-width="2.5"/><text x="330" y="42" font-size="10" fill="#475569">Ankara</text><line x1="400" y1="38" x2="425" y2="38" stroke="#10b981" stroke-width="2.5"/><text x="430" y="42" font-size="10" fill="#475569">Izmir</text></svg>`;
// ── G10: Combo Bar+Line Chart — Fabrika Aylik Uretim (ton) ve Hata Orani (%) ──
const SVG_G10 = `<svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg"><defs><style>text{font-family:Arial,sans-serif}</style></defs><rect width="620" height="300" fill="#f8fafc" rx="10"/><text x="310" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">Fabrika Aylik Uretim (ton) ve Hata Orani (%)</text><line x1="70" y1="245" x2="570" y2="245" stroke="#94a3b8" stroke-width="1"/><line x1="70" y1="245" x2="70" y2="45" stroke="#94a3b8" stroke-width="1"/><line x1="570" y1="245" x2="570" y2="45" stroke="#94a3b8" stroke-width="1"/><line x1="70" y1="212" x2="570" y2="212" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="178" x2="570" y2="178" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="145" x2="570" y2="145" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="112" x2="570" y2="112" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="78" x2="570" y2="78" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><line x1="70" y1="45" x2="570" y2="45" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="4,3"/><text x="62" y="249" text-anchor="end" font-size="9" fill="#6366f1">0</text><text x="62" y="215" text-anchor="end" font-size="9" fill="#6366f1">100</text><text x="62" y="182" text-anchor="end" font-size="9" fill="#6366f1">200</text><text x="62" y="148" text-anchor="end" font-size="9" fill="#6366f1">300</text><text x="62" y="115" text-anchor="end" font-size="9" fill="#6366f1">400</text><text x="62" y="82" text-anchor="end" font-size="9" fill="#6366f1">500</text><text x="62" y="48" text-anchor="end" font-size="9" fill="#6366f1">600</text><text x="578" y="249" text-anchor="start" font-size="9" fill="#ef4444">0</text><text x="578" y="215" text-anchor="start" font-size="9" fill="#ef4444">1%</text><text x="578" y="182" text-anchor="start" font-size="9" fill="#ef4444">2%</text><text x="578" y="148" text-anchor="start" font-size="9" fill="#ef4444">3%</text><text x="578" y="115" text-anchor="start" font-size="9" fill="#ef4444">4%</text><rect id="g10_b1" x="100" y="97" width="50" height="148" rx="3" fill="#6366f1" opacity="0.8"/><text x="125" y="91" text-anchor="middle" font-size="9" font-weight="bold" fill="#6366f1">450</text><rect id="g10_b2" x="180" y="87" width="50" height="158" rx="3" fill="#6366f1" opacity="0.8"/><text x="205" y="81" text-anchor="middle" font-size="9" font-weight="bold" fill="#6366f1">480</text><rect id="g10_b3" x="260" y="74" width="50" height="171" rx="3" fill="#6366f1" opacity="0.8"/><text x="285" y="68" text-anchor="middle" font-size="9" font-weight="bold" fill="#6366f1">520</text><rect id="g10_b4" x="340" y="84" width="50" height="161" rx="3" fill="#6366f1" opacity="0.8"/><text x="365" y="78" text-anchor="middle" font-size="9" font-weight="bold" fill="#6366f1">490</text><rect id="g10_b5" x="420" y="64" width="50" height="181" rx="3" fill="#6366f1" opacity="0.8"/><text x="445" y="58" text-anchor="middle" font-size="9" font-weight="bold" fill="#6366f1">550</text><rect id="g10_b6" x="500" y="54" width="50" height="191" rx="3" fill="#6366f1" opacity="0.8"/><text x="525" y="48" text-anchor="middle" font-size="9" font-weight="bold" fill="#6366f1">580</text><polyline id="g10_line" points="125,140 205,153 285,163 365,146 445,173 525,183" stroke="#ef4444" stroke-width="2.5" fill="none"/><circle cx="125" cy="140" r="4" fill="#ef4444"/><text x="125" y="133" text-anchor="middle" font-size="8" font-weight="bold" fill="#ef4444">%3,2</text><circle cx="205" cy="153" r="4" fill="#ef4444"/><text x="205" y="146" text-anchor="middle" font-size="8" font-weight="bold" fill="#ef4444">%2,8</text><circle cx="285" cy="163" r="4" fill="#ef4444"/><text x="285" y="156" text-anchor="middle" font-size="8" font-weight="bold" fill="#ef4444">%2,5</text><circle cx="365" cy="146" r="4" fill="#ef4444"/><text x="365" y="139" text-anchor="middle" font-size="8" font-weight="bold" fill="#ef4444">%3,0</text><circle cx="445" cy="173" r="4" fill="#ef4444"/><text x="445" y="166" text-anchor="middle" font-size="8" font-weight="bold" fill="#ef4444">%2,2</text><circle cx="525" cy="183" r="4" fill="#ef4444"/><text x="525" y="176" text-anchor="middle" font-size="8" font-weight="bold" fill="#ef4444">%1,9</text><text x="125" y="262" text-anchor="middle" font-size="10" fill="#475569">Oca</text><text x="205" y="262" text-anchor="middle" font-size="10" fill="#475569">Sub</text><text x="285" y="262" text-anchor="middle" font-size="10" fill="#475569">Mar</text><text x="365" y="262" text-anchor="middle" font-size="10" fill="#475569">Nis</text><text x="445" y="262" text-anchor="middle" font-size="10" fill="#475569">May</text><text x="525" y="262" text-anchor="middle" font-size="10" fill="#475569">Haz</text><rect x="170" y="280" width="12" height="10" rx="2" fill="#6366f1" opacity="0.8"/><text x="186" y="289" font-size="9" fill="#334155">Uretim (ton)</text><line x1="300" y1="285" x2="320" y2="285" stroke="#ef4444" stroke-width="2.5"/><circle cx="310" cy="285" r="3" fill="#ef4444"/><text x="326" y="289" font-size="9" fill="#334155">Hata Orani (%)</text></svg>`;

export const seedSayisalOkumaCharts: Question[] = [
  // ─── G1: İl Bazlı Yıllık Konut Satışı — 5 soru ───
  // İstanbul:185, Ankara:95, İzmir:72, Antalya:68, Bursa:55, Mersin:42 → Toplam: 517
  { id: 'seed-soa-51', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-kolay', questionText: 'Grafiğe göre en fazla konut satışı yapan il hangisidir?', svg: SVG_G1, options: [{ label: 'A', text: 'Ankara' }, { label: 'B', text: 'İzmir' }, { label: 'C', text: 'İstanbul' }, { label: 'D', text: 'Antalya' }, { label: 'E', text: 'Bursa' }], correctAnswer: 2, solution: 'Bar yüksekliklerine bakıldığında İstanbul 185 bin adet ile en yüksek konut satışına sahiptir.', tags: ['grafik-okuma', 'konut', 'bar-chart'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-52', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'kolay', questionText: '6 ilin toplam yıllık konut satışı kaç bin adettir?', svg: SVG_G1, options: [{ label: 'A', text: '497' }, { label: 'B', text: '507' }, { label: 'C', text: '517' }, { label: 'D', text: '527' }, { label: 'E', text: '537' }], correctAnswer: 2, solution: '185 + 95 + 72 + 68 + 55 + 42 = 517 bin adet.', tags: ['grafik-okuma', 'konut', 'toplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-53', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'orta', questionText: 'İstanbul\'un toplam konut satışı içindeki payı yaklaşık yüzde kaçtır?', svg: SVG_G1, options: [{ label: 'A', text: '%31,8' }, { label: 'B', text: '%33,5' }, { label: 'C', text: '%35,8' }, { label: 'D', text: '%37,2' }, { label: 'E', text: '%39,1' }], correctAnswer: 2, solution: 'Toplam: 517. İstanbul payı: 185/517 × 100 = %35,78 ≈ %35,8.', tags: ['grafik-okuma', 'konut', 'yuzde-hesaplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-54', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'zor', questionText: 'İstanbul\'un konut satışı, Bursa ve Mersin\'in toplam satışının kaç katıdır?', svg: SVG_G1, options: [{ label: 'A', text: '1,72' }, { label: 'B', text: '1,82' }, { label: 'C', text: '1,91' }, { label: 'D', text: '2,01' }, { label: 'E', text: '2,12' }], correctAnswer: 2, solution: 'Bursa + Mersin = 55 + 42 = 97. İstanbul/Toplam = 185/97 = 1,907 ≈ 1,91 kat.', tags: ['grafik-okuma', 'konut', 'oran-hesaplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-55', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-zor', questionText: 'Her konut ortalama 2,5 milyon TL\'ye satılıyorsa, Ankara ve İzmir\'in toplam konut satış hacmi kaç milyar TL\'dir?', svg: SVG_G1, options: [{ label: 'A', text: '367,5' }, { label: 'B', text: '382,5' }, { label: 'C', text: '400,0' }, { label: 'D', text: '417,5' }, { label: 'E', text: '425,0' }], correctAnswer: 3, solution: 'Ankara + İzmir = 95 + 72 = 167 bin adet. 167.000 × 2,5 milyon TL = 417.500 milyon TL = 417,5 milyar TL.', tags: ['grafik-okuma', 'konut', 'hacim-hesaplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  // ─── G2: XYZ A.Ş. Aylık Net Kâr Trendi — 5 soru ───
  // Oca:12, Şub:15, Mar:18, Nis:14, May:22, Haz:25, Tem:20, Ağu:28 → Toplam: 154
  { id: 'seed-soa-56', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-kolay', questionText: 'Grafiğe göre en yüksek net kâr hangi ayda gerçekleşmiştir?', svg: SVG_G2, options: [{ label: 'A', text: 'Haziran' }, { label: 'B', text: 'Temmuz' }, { label: 'C', text: 'Ağustos' }, { label: 'D', text: 'Mayıs' }, { label: 'E', text: 'Mart' }], correctAnswer: 2, solution: 'Çizgi grafiğinde en yüksek nokta Ağustos ayında 28 milyon TL\'dir.', tags: ['grafik-okuma', 'kar', 'line-chart'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-57', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'kolay', questionText: 'İlk 4 ayın (Oca-Nis) toplam net kârı kaç milyon TL\'dir?', svg: SVG_G2, options: [{ label: 'A', text: '55' }, { label: 'B', text: '57' }, { label: 'C', text: '59' }, { label: 'D', text: '61' }, { label: 'E', text: '63' }], correctAnswer: 2, solution: 'Oca(12) + Şub(15) + Mar(18) + Nis(14) = 59 milyon TL.', tags: ['grafik-okuma', 'kar', 'toplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-58', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'orta', questionText: 'Mart\'tan Nisan\'a net kârdaki yüzde düşüş yaklaşık kaçtır?', svg: SVG_G2, options: [{ label: 'A', text: '%18,5' }, { label: 'B', text: '%20,0' }, { label: 'C', text: '%22,2' }, { label: 'D', text: '%24,5' }, { label: 'E', text: '%26,7' }], correctAnswer: 2, solution: 'Mar: 18, Nis: 14. Düşüş: (18 - 14)/18 × 100 = 4/18 × 100 = %22,2.', tags: ['grafik-okuma', 'kar', 'yuzde-degisim'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-59', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'zor', questionText: '8 aylık ortalama net kâr ile Nisan ayı net kârı arasındaki fark kaç milyon TL\'dir?', svg: SVG_G2, options: [{ label: 'A', text: '3,25' }, { label: 'B', text: '4,50' }, { label: 'C', text: '5,25' }, { label: 'D', text: '6,00' }, { label: 'E', text: '6,75' }], correctAnswer: 2, solution: '8 aylık toplam: 12+15+18+14+22+25+20+28 = 154. Ortalama: 154/8 = 19,25. Fark: 19,25 - 14 = 5,25 milyon TL.', tags: ['grafik-okuma', 'kar', 'ortalama-fark'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-60', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-zor', questionText: 'Bir önceki aya göre en büyük yüzde artış hangi ay geçişinde yaşanmıştır?', svg: SVG_G2, options: [{ label: 'A', text: 'Nis→May (%57,1)' }, { label: 'B', text: 'Haz→Tem (%-20,0)' }, { label: 'C', text: 'Tem→Ağu (%40,0)' }, { label: 'D', text: 'Oca→Şub (%25,0)' }, { label: 'E', text: 'Şub→Mar (%20,0)' }], correctAnswer: 0, solution: 'Oca→Şub: (15-12)/12=%25. Şub→Mar: 3/15=%20. Mar→Nis: -4/18=%-22,2. Nis→May: (22-14)/14=%57,1. May→Haz: 3/22=%13,6. Haz→Tem: -5/25=%-20. Tem→Ağu: 8/20=%40. En büyük artış: Nis→May %57,1.', tags: ['grafik-okuma', 'kar', 'trend-analizi'], svgPosition: 'top', createdAt: T, updatedAt: T },

  // ─── G3: Türkiye Enerji Kaynakları Dağılımı — 5 soru ───
  // Doğalgaz:%32, Kömür:%28, Hidro:%20, Rüzgâr:%12, Güneş:%8 → Toplam: %100
  { id: 'seed-soa-61', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-kolay', questionText: 'Pasta grafiğine göre en büyük paya sahip enerji kaynağı hangisidir?', svg: SVG_G3, options: [{ label: 'A', text: 'Kömür' }, { label: 'B', text: 'Hidroelektrik' }, { label: 'C', text: 'Doğalgaz' }, { label: 'D', text: 'Rüzgâr' }, { label: 'E', text: 'Güneş' }], correctAnswer: 2, solution: 'Pasta grafiğinde en büyük dilim Doğalgaz olup %32 paya sahiptir.', tags: ['grafik-okuma', 'enerji', 'pie-chart'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-62', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'kolay', questionText: 'Yenilenebilir enerji kaynaklarının (Hidro + Rüzgâr + Güneş) toplam payı yüzde kaçtır?', svg: SVG_G3, options: [{ label: 'A', text: '%32' }, { label: 'B', text: '%36' }, { label: 'C', text: '%40' }, { label: 'D', text: '%44' }, { label: 'E', text: '%48' }], correctAnswer: 2, solution: 'Hidroelektrik(%20) + Rüzgâr(%12) + Güneş(%8) = %40.', tags: ['grafik-okuma', 'enerji', 'yenilenebilir'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-63', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'orta', questionText: 'Doğalgaz payı, Güneş payının kaç katıdır?', svg: SVG_G3, options: [{ label: 'A', text: '3,0' }, { label: 'B', text: '3,5' }, { label: 'C', text: '4,0' }, { label: 'D', text: '4,5' }, { label: 'E', text: '5,0' }], correctAnswer: 2, solution: 'Doğalgaz: %32, Güneş: %8. Oran: 32/8 = 4,0 kat.', tags: ['grafik-okuma', 'enerji', 'oran-hesaplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-64', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'zor', questionText: 'Toplam kurulu güç 120 GW ise fosil kaynakların (Doğalgaz + Kömür) toplam kapasitesi kaç GW\'dır?', svg: SVG_G3, options: [{ label: 'A', text: '60,0' }, { label: 'B', text: '66,0' }, { label: 'C', text: '72,0' }, { label: 'D', text: '76,8' }, { label: 'E', text: '80,4' }], correctAnswer: 2, solution: 'Fosil pay: %32 + %28 = %60. 120 × 0,60 = 72,0 GW.', tags: ['grafik-okuma', 'enerji', 'kapasite-hesaplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-65', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-zor', questionText: 'Güneş enerjisi payı yıllık 2 puan artarken diğer kaynaklar oransal olarak küçülürse, 3 yıl sonra Güneş\'in payı yaklaşık yüzde kaçtır?', svg: SVG_G3, options: [{ label: 'A', text: '%12' }, { label: 'B', text: '%14' }, { label: 'C', text: '%16' }, { label: 'D', text: '%18' }, { label: 'E', text: '%20' }], correctAnswer: 1, solution: 'Güneş 3 yılda 3×2 = 6 puan artar. Başlangıç: %8 + 6 = %14. Toplam yine %100 olacağından diğer kaynaklar oransal küçülür. Güneş\'in yeni payı %14.', tags: ['grafik-okuma', 'enerji', 'projeksiyon'], svgPosition: 'top', createdAt: T, updatedAt: T },

  // ─── G4: Sektör Bazlı İstihdam Değişimi — 5 soru ───
  // Teknoloji: 2022=180, 2023=210, 2024=250
  // Finans: 2022=150, 2023=165, 2024=180
  // Sağlık: 2022=120, 2023=135, 2024=155
  // Üretim: 2022=280, 2023=260, 2024=245
  { id: 'seed-soa-66', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-kolay', questionText: '2024 yılında en fazla istihdama sahip sektör hangisidir?', svg: SVG_G4, options: [{ label: 'A', text: 'Teknoloji' }, { label: 'B', text: 'Finans' }, { label: 'C', text: 'Sağlık' }, { label: 'D', text: 'Üretim' }, { label: 'E', text: 'Teknoloji ve Üretim eşit' }], correctAnswer: 0, solution: '2024 değerleri: Teknoloji 250, Finans 180, Sağlık 155, Üretim 245. En fazla: Teknoloji (250 bin kişi).', tags: ['grafik-okuma', 'istihdam', 'grouped-bar'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-67', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'kolay', questionText: '2022 yılında 4 sektörün toplam istihdamı kaç bin kişidir?', svg: SVG_G4, options: [{ label: 'A', text: '710' }, { label: 'B', text: '720' }, { label: 'C', text: '730' }, { label: 'D', text: '740' }, { label: 'E', text: '750' }], correctAnswer: 2, solution: '2022: 180 + 150 + 120 + 280 = 730 bin kişi.', tags: ['grafik-okuma', 'istihdam', 'toplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-68', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'orta', questionText: 'Teknoloji sektöründe 2022\'den 2024\'e istihdamdaki yüzde artış yaklaşık kaçtır?', svg: SVG_G4, options: [{ label: 'A', text: '%32,5' }, { label: 'B', text: '%35,0' }, { label: 'C', text: '%38,9' }, { label: 'D', text: '%41,2' }, { label: 'E', text: '%44,0' }], correctAnswer: 2, solution: 'Teknoloji 2022: 180, 2024: 250. Artış: (250-180)/180 × 100 = 70/180 × 100 = %38,9.', tags: ['grafik-okuma', 'istihdam', 'yuzde-artis'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-69', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'zor', questionText: 'Üretim sektörü istihdam kaybederken, 2022-2024 döneminde toplam ne kadar istihdam kaybetmiştir ve bu kayıp Sağlık sektörünün aynı dönemdeki artışının yüzde kaçıdır?', svg: SVG_G4, options: [{ label: 'A', text: '35 bin kişi kayıp, Sağlık artışının %100\'ü' }, { label: 'B', text: '30 bin kişi kayıp, Sağlık artışının %90\'ı' }, { label: 'C', text: '25 bin kişi kayıp, Sağlık artışının %85\'i' }, { label: 'D', text: '35 bin kişi kayıp, Sağlık artışının %80\'i' }, { label: 'E', text: '40 bin kişi kayıp, Sağlık artışının %110\'u' }], correctAnswer: 0, solution: 'Üretim kaybı: 280-245 = 35 bin kişi. Sağlık artışı: 155-120 = 35 bin kişi. Oran: 35/35 × 100 = %100.', tags: ['grafik-okuma', 'istihdam', 'capraz-karsilastirma'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-70', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-zor', questionText: 'Teknoloji sektörü 2024-2025 döneminde de 2023-2024 ile aynı büyüme oranını korursa, 2025\'te tahmini istihdam kaç bin kişi olur?', svg: SVG_G4, options: [{ label: 'A', text: '280' }, { label: 'B', text: '290' }, { label: 'C', text: '297' }, { label: 'D', text: '305' }, { label: 'E', text: '310' }], correctAnswer: 2, solution: '2023→2024 büyüme: (250-210)/210 = 40/210 = %19,05. 2025 tahmini: 250 × 1,1905 = 297,6 ≈ 297 bin kişi.', tags: ['grafik-okuma', 'istihdam', 'projeksiyon'], svgPosition: 'top', createdAt: T, updatedAt: T },

  // ─── G5: Şirket Çeyreklik Gider Dağılımı — 5 soru ───
  // Q1: Personel:180 + Kira:45 + Malzeme:60 = 285
  // Q2: 195 + 45 + 65 = 305
  // Q3: 200 + 48 + 70 = 318
  // Q4: 210 + 48 + 75 = 333
  // Yıllık toplam: 285+305+318+333 = 1241
  { id: 'seed-soa-71', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-kolay', questionText: 'Grafiğe göre en yüksek toplam gider hangi çeyrekte gerçekleşmiştir?', svg: SVG_G5, options: [{ label: 'A', text: 'Q1' }, { label: 'B', text: 'Q2' }, { label: 'C', text: 'Q3' }, { label: 'D', text: 'Q4' }, { label: 'E', text: 'Q2 ve Q3 eşit' }], correctAnswer: 3, solution: 'Toplam giderler: Q1=285, Q2=305, Q3=318, Q4=333. En yüksek Q4 (333 bin TL).', tags: ['grafik-okuma', 'gider', 'stacked-bar'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-72', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'kolay', questionText: 'Yıllık toplam personel gideri kaç bin TL\'dir?', svg: SVG_G5, options: [{ label: 'A', text: '765' }, { label: 'B', text: '775' }, { label: 'C', text: '785' }, { label: 'D', text: '795' }, { label: 'E', text: '805' }], correctAnswer: 2, solution: 'Personel: 180 + 195 + 200 + 210 = 785 bin TL.', tags: ['grafik-okuma', 'gider', 'toplama'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-73', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'orta', questionText: 'Q4\'te personel giderinin toplam gider içindeki payı yaklaşık yüzde kaçtır?', svg: SVG_G5, options: [{ label: 'A', text: '%58,2' }, { label: 'B', text: '%60,5' }, { label: 'C', text: '%63,1' }, { label: 'D', text: '%65,8' }, { label: 'E', text: '%68,0' }], correctAnswer: 2, solution: 'Q4 toplam: 333. Personel: 210. Pay: 210/333 × 100 = %63,06 ≈ %63,1.', tags: ['grafik-okuma', 'gider', 'yuzde-pay'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-74', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'zor', questionText: 'Q1\'den Q4\'e toplam giderdeki artış, Q1 toplam giderinin yüzde kaçıdır?', svg: SVG_G5, options: [{ label: 'A', text: '%14,2' }, { label: 'B', text: '%15,6' }, { label: 'C', text: '%16,8' }, { label: 'D', text: '%17,5' }, { label: 'E', text: '%18,3' }], correctAnswer: 2, solution: 'Q1: 285, Q4: 333. Artış: 333-285 = 48. Yüzde: 48/285 × 100 = %16,84 ≈ %16,8.', tags: ['grafik-okuma', 'gider', 'yuzde-artis'], svgPosition: 'top', createdAt: T, updatedAt: T },

  { id: 'seed-soa-75', categoryId: 'sayisal-yetenek', subModuleId: 'sayisal-okuma-anlama', difficulty: 'cok-zor', questionText: 'Yıllık toplam giderin (tüm çeyrekler toplamı) içinde kira giderinin payı yaklaşık yüzde kaçtır?', svg: SVG_G5, options: [{ label: 'A', text: '%13,2' }, { label: 'B', text: '%15,0' }, { label: 'C', text: '%16,8' }, { label: 'D', text: '%18,5' }, { label: 'E', text: '%20,1' }], correctAnswer: 1, solution: 'Yıllık kira: 45+45+48+48 = 186. Yıllık toplam: 285+305+318+333 = 1.241. Pay: 186/1.241 × 100 = %14,99 ≈ %15,0.', tags: ['grafik-okuma', 'gider', 'yillik-pay-analizi'], svgPosition: 'top', createdAt: T, updatedAt: T },

  // ─── G6: Calisan Memnuniyet Anketi (5 soru) ───
  // Veri: Is-Yasam Dengesi:78, Maas:62, Kariyer Firsatlari:71, Yonetim:68, Calisma Ortami:85, Egitim Imkanlari:74
  {
    id: 'seed-soa-76',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-kolay',
    questionText: 'Grafige gore en yuksek memnuniyet puanini alan alan hangisidir?',
    svg: SVG_G6,
    options: [
      { label: 'A', text: 'Is-Yasam Dengesi' },
      { label: 'B', text: 'Maas' },
      { label: 'C', text: 'Calisma Ortami' },
      { label: 'D', text: 'Egitim Imkanlari' },
      { label: 'E', text: 'Kariyer Firsatlari' }
    ],
    correctAnswer: 2,
    solution: 'Grafikteki barlara bakildiginda Calisma Ortami %85 ile en yuksek memnuniyet puanina sahiptir.',
    tags: ['grafik-okuma', 'memnuniyet', 'yatay-bar'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-77',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'kolay',
    questionText: '6 alanin memnuniyet puanlarinin toplami kactir?',
    svg: SVG_G6,
    options: [
      { label: 'A', text: '428' },
      { label: 'B', text: '438' },
      { label: 'C', text: '448' },
      { label: 'D', text: '418' },
      { label: 'E', text: '458' }
    ],
    correctAnswer: 1,
    solution: '78 + 62 + 71 + 68 + 85 + 74 = 438.',
    tags: ['grafik-okuma', 'memnuniyet', 'toplama'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-78',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'orta',
    questionText: 'Calisma Ortami ile Maas arasindaki memnuniyet farki, Maas puaninin yaklasik yuzde kacidir?',
    svg: SVG_G6,
    options: [
      { label: 'A', text: '%32,1' },
      { label: 'B', text: '%35,5' },
      { label: 'C', text: '%37,1' },
      { label: 'D', text: '%40,3' },
      { label: 'E', text: '%29,8' }
    ],
    correctAnswer: 2,
    solution: 'Fark: 85 - 62 = 23. Oran: 23 / 62 x 100 = %37,1.',
    tags: ['grafik-okuma', 'memnuniyet', 'yuzde-fark'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-79',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'zor',
    questionText: '6 alanin ortalama memnuniyet puani 73\'tur. Ortalamanin uzerinde kac alan vardir?',
    svg: SVG_G6,
    options: [
      { label: 'A', text: '2' },
      { label: 'B', text: '3' },
      { label: 'C', text: '4' },
      { label: 'D', text: '5' },
      { label: 'E', text: '1' }
    ],
    correctAnswer: 1,
    solution: 'Ortalama: 438/6 = 73. Degerler: 78, 62, 71, 68, 85, 74. 73\'un uzerindekiler: Is-Yasam Dengesi (78), Calisma Ortami (85), Egitim Imkanlari (74) = 3 alan.',
    tags: ['grafik-okuma', 'memnuniyet', 'ortalama', 'karsilastirma'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-80',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-zor',
    questionText: 'Maas memnuniyeti 10 puan, Yonetim memnuniyeti 7 puan arttirilirsa 6 alanin yeni ortalamasi kac olur?',
    svg: SVG_G6,
    options: [
      { label: 'A', text: '74,8' },
      { label: 'B', text: '75,5' },
      { label: 'C', text: '75,8' },
      { label: 'D', text: '76,2' },
      { label: 'E', text: '77,0' }
    ],
    correctAnswer: 2,
    solution: 'Mevcut toplam: 438. Artis: 10 + 7 = 17. Yeni toplam: 455. Yeni ortalama: 455 / 6 = 75,83 yaklasik 75,8.',
    tags: ['grafik-okuma', 'memnuniyet', 'senaryo', 'ortalama'],
    createdAt: T,
    updatedAt: T
  },

  // ─── G7: E-Ticaret Gunluk Siparis Sayisi (5 soru) ───
  // Veri: Pzt:1.200, Sal:1.350, Car:1.100, Per:1.450, Cum:1.800, Cmt:2.200, Paz:1.950
  {
    id: 'seed-soa-81',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-kolay',
    questionText: 'Grafige gore en fazla siparis hangi gun alinmistir?',
    svg: SVG_G7,
    options: [
      { label: 'A', text: 'Cuma' },
      { label: 'B', text: 'Cumartesi' },
      { label: 'C', text: 'Pazar' },
      { label: 'D', text: 'Persembe' },
      { label: 'E', text: 'Sali' }
    ],
    correctAnswer: 1,
    solution: 'Grafige gore en yuksek nokta Cumartesi gunu 2.200 siparistir.',
    tags: ['grafik-okuma', 'e-ticaret', 'alan-grafik'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-82',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'kolay',
    questionText: 'Haftalik toplam siparis sayisi kactir?',
    svg: SVG_G7,
    options: [
      { label: 'A', text: '10.850' },
      { label: 'B', text: '11.050' },
      { label: 'C', text: '11.250' },
      { label: 'D', text: '11.450' },
      { label: 'E', text: '10.650' }
    ],
    correctAnswer: 1,
    solution: '1.200 + 1.350 + 1.100 + 1.450 + 1.800 + 2.200 + 1.950 = 11.050.',
    tags: ['grafik-okuma', 'e-ticaret', 'toplama'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-83',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'orta',
    questionText: 'Carsamba\'dan Cumartesi\'ye siparis sayisindaki artis yuzdesi kactir?',
    svg: SVG_G7,
    options: [
      { label: 'A', text: '%80' },
      { label: 'B', text: '%90' },
      { label: 'C', text: '%100' },
      { label: 'D', text: '%110' },
      { label: 'E', text: '%120' }
    ],
    correctAnswer: 2,
    solution: 'Carsamba: 1.100, Cumartesi: 2.200. Artis: (2.200 - 1.100) / 1.100 x 100 = %100.',
    tags: ['grafik-okuma', 'e-ticaret', 'yuzde-artis'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-84',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'zor',
    questionText: 'Hafta sonu (Cmt+Paz) ortalamasi, hafta ici (Pzt-Cum) ortalamasindan ne kadar fazladir?',
    svg: SVG_G7,
    options: [
      { label: 'A', text: '595' },
      { label: 'B', text: '645' },
      { label: 'C', text: '695' },
      { label: 'D', text: '745' },
      { label: 'E', text: '550' }
    ],
    correctAnswer: 2,
    solution: 'Hafta ici ortalama: (1.200+1.350+1.100+1.450+1.800)/5 = 6.900/5 = 1.380. Hafta sonu ortalama: (2.200+1.950)/2 = 4.150/2 = 2.075. Fark: 2.075 - 1.380 = 695.',
    tags: ['grafik-okuma', 'e-ticaret', 'ortalama', 'karsilastirma'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-85',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-zor',
    questionText: 'Ortalama siparis degeri 120 TL ise haftalik toplam ciro kac TL\'dir?',
    svg: SVG_G7,
    options: [
      { label: 'A', text: '1.266.000' },
      { label: 'B', text: '1.326.000' },
      { label: 'C', text: '1.386.000' },
      { label: 'D', text: '1.350.000' },
      { label: 'E', text: '1.290.000' }
    ],
    correctAnswer: 1,
    solution: 'Toplam siparis: 11.050. Ciro: 11.050 x 120 = 1.326.000 TL.',
    tags: ['grafik-okuma', 'e-ticaret', 'ciro', 'hesaplama'],
    createdAt: T,
    updatedAt: T
  },

  // ─── G8: Belediye Yillik Butce Dagilimi (5 soru) ───
  // Veri: Altyapi:%30(255M), Ulasim:%22(187M), Egitim:%18(153M), Saglik:%15(127,5M), Kultur:%10(85M), Diger:%5(42,5M). Toplam: 850M TL
  {
    id: 'seed-soa-86',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-kolay',
    questionText: 'Grafige gore en buyuk butce kalemi hangisidir?',
    svg: SVG_G8,
    options: [
      { label: 'A', text: 'Ulasim' },
      { label: 'B', text: 'Egitim' },
      { label: 'C', text: 'Altyapi' },
      { label: 'D', text: 'Saglik' },
      { label: 'E', text: 'Kultur' }
    ],
    correctAnswer: 2,
    solution: 'Donut grafikte en buyuk dilim Altyapi\'dir (%30, 255 milyon TL).',
    tags: ['grafik-okuma', 'butce', 'donut-grafik'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-87',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'kolay',
    questionText: 'Altyapi ve Ulasim kalemlerinin toplam butcesi kac milyon TL\'dir?',
    svg: SVG_G8,
    options: [
      { label: 'A', text: '420' },
      { label: 'B', text: '432' },
      { label: 'C', text: '442' },
      { label: 'D', text: '450' },
      { label: 'E', text: '460' }
    ],
    correctAnswer: 2,
    solution: 'Altyapi: 255 M + Ulasim: 187 M = 442 milyon TL.',
    tags: ['grafik-okuma', 'butce', 'toplama'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-88',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'orta',
    questionText: 'Egitim butcesi, Saglik butcesinin kac katidir?',
    svg: SVG_G8,
    options: [
      { label: 'A', text: '1,10' },
      { label: 'B', text: '1,20' },
      { label: 'C', text: '1,25' },
      { label: 'D', text: '1,30' },
      { label: 'E', text: '1,15' }
    ],
    correctAnswer: 1,
    solution: 'Egitim: 153 M, Saglik: 127,5 M. Oran: 153 / 127,5 = 1,20 kat.',
    tags: ['grafik-okuma', 'butce', 'oran'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-89',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'zor',
    questionText: 'Saglik butcesine 40 milyon TL ek kaynak ayrilirsa, Saglik\'in toplam butce icindeki yeni payi yaklasik yuzde kac olur?',
    svg: SVG_G8,
    options: [
      { label: 'A', text: '%17,2' },
      { label: 'B', text: '%18,1' },
      { label: 'C', text: '%18,8' },
      { label: 'D', text: '%19,5' },
      { label: 'E', text: '%16,5' }
    ],
    correctAnswer: 2,
    solution: 'Mevcut Saglik: 127,5 M. Yeni: 127,5 + 40 = 167,5 M. Yeni toplam butce: 850 + 40 = 890 M. Pay: 167,5 / 890 x 100 = %18,8.',
    tags: ['grafik-okuma', 'butce', 'senaryo', 'yuzde'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-90',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-zor',
    questionText: 'Belediye geliri %12 artarsa ve artis tamamen Egitim\'e eklenirse, Egitim\'in yeni butcedeki payi yaklasik yuzde kac olur?',
    svg: SVG_G8,
    options: [
      { label: 'A', text: '%24,3' },
      { label: 'B', text: '%25,6' },
      { label: 'C', text: '%26,8' },
      { label: 'D', text: '%27,5' },
      { label: 'E', text: '%28,2' }
    ],
    correctAnswer: 2,
    solution: 'Artis: 850 x 0,12 = 102 M. Yeni toplam: 952 M. Yeni Egitim: 153 + 102 = 255 M. Pay: 255 / 952 x 100 = %26,8.',
    tags: ['grafik-okuma', 'butce', 'senaryo', 'projeksiyon'],
    createdAt: T,
    updatedAt: T
  },

  // ─── G9: 3 Sehir Konut Fiyat Endeksi (5 soru) ───
  // Veri: Istanbul: 100,135,185,240 | Ankara: 100,125,160,200 | Izmir: 100,130,170,215
  {
    id: 'seed-soa-91',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-kolay',
    questionText: '2024 yilinda en yuksek konut fiyat endeksine sahip sehir hangisidir?',
    svg: SVG_G9,
    options: [
      { label: 'A', text: 'Ankara' },
      { label: 'B', text: 'Izmir' },
      { label: 'C', text: 'Istanbul' },
      { label: 'D', text: 'Hepsi esit' },
      { label: 'E', text: 'Ankara ve Izmir' }
    ],
    correctAnswer: 2,
    solution: '2024 degerleri: Istanbul 240, Ankara 200, Izmir 215. En yuksek Istanbul (240).',
    tags: ['grafik-okuma', 'konut', 'coklu-cizgi'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-92',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'kolay',
    questionText: '2024\'te 3 sehrin endeks degerlerinin toplami kactir?',
    svg: SVG_G9,
    options: [
      { label: 'A', text: '635' },
      { label: 'B', text: '645' },
      { label: 'C', text: '655' },
      { label: 'D', text: '665' },
      { label: 'E', text: '625' }
    ],
    correctAnswer: 2,
    solution: 'Istanbul: 240 + Ankara: 200 + Izmir: 215 = 655.',
    tags: ['grafik-okuma', 'konut', 'toplama'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-93',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'orta',
    questionText: 'Istanbul\'un 2021\'den 2024\'e toplam artis yuzdesi kactir?',
    svg: SVG_G9,
    options: [
      { label: 'A', text: '%120' },
      { label: 'B', text: '%130' },
      { label: 'C', text: '%140' },
      { label: 'D', text: '%150' },
      { label: 'E', text: '%160' }
    ],
    correctAnswer: 2,
    solution: 'Istanbul: (240 - 100) / 100 x 100 = %140 artis.',
    tags: ['grafik-okuma', 'konut', 'yuzde-artis'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-94',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'zor',
    questionText: '2022-2023 doneminde en yuksek puan artisi gosteren sehir hangisidir ve artis kac puandir?',
    svg: SVG_G9,
    options: [
      { label: 'A', text: 'Istanbul, 50 puan' },
      { label: 'B', text: 'Izmir, 40 puan' },
      { label: 'C', text: 'Ankara, 35 puan' },
      { label: 'D', text: 'Istanbul, 45 puan' },
      { label: 'E', text: 'Izmir, 45 puan' }
    ],
    correctAnswer: 0,
    solution: '2022-2023 artislari: Istanbul: 185-135=50, Ankara: 160-125=35, Izmir: 170-130=40. En yuksek Istanbul 50 puan.',
    tags: ['grafik-okuma', 'konut', 'karsilastirma', 'artis'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-95',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-zor',
    questionText: 'Istanbul\'da 2023-2024 artis hizi (puan olarak) ayni kalirsa 2025 tahmini endeks degeri kac olur?',
    svg: SVG_G9,
    options: [
      { label: 'A', text: '280' },
      { label: 'B', text: '290' },
      { label: 'C', text: '295' },
      { label: 'D', text: '300' },
      { label: 'E', text: '310' }
    ],
    correctAnswer: 2,
    solution: 'Istanbul 2023-2024 artisi: 240 - 185 = 55 puan. Ayni hiz devam ederse 2025: 240 + 55 = 295.',
    tags: ['grafik-okuma', 'konut', 'projeksiyon', 'trend'],
    createdAt: T,
    updatedAt: T
  },

  // ─── G10: Fabrika Aylik Uretim ve Hata Orani (5 soru) ───
  // Veri: Oca:450/3,2%, Sub:480/2,8%, Mar:520/2,5%, Nis:490/3,0%, May:550/2,2%, Haz:580/1,9%
  {
    id: 'seed-soa-96',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-kolay',
    questionText: 'Grafige gore en yuksek uretim yapilan ay hangisidir?',
    svg: SVG_G10,
    options: [
      { label: 'A', text: 'Mayis' },
      { label: 'B', text: 'Haziran' },
      { label: 'C', text: 'Mart' },
      { label: 'D', text: 'Nisan' },
      { label: 'E', text: 'Subat' }
    ],
    correctAnswer: 1,
    solution: 'Barlara bakildiginda en yuksek uretim Haziran ayinda 580 ton olarak gerceklesmistir.',
    tags: ['grafik-okuma', 'uretim', 'combo-grafik'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-97',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'kolay',
    questionText: '6 aylik toplam uretim kac tondur?',
    svg: SVG_G10,
    options: [
      { label: 'A', text: '2.970' },
      { label: 'B', text: '3.020' },
      { label: 'C', text: '3.070' },
      { label: 'D', text: '3.120' },
      { label: 'E', text: '2.920' }
    ],
    correctAnswer: 2,
    solution: '450 + 480 + 520 + 490 + 550 + 580 = 3.070 ton.',
    tags: ['grafik-okuma', 'uretim', 'toplama'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-98',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'orta',
    questionText: 'Ocak\'tan Haziran\'a hata oranindaki dusus kac puandir?',
    svg: SVG_G10,
    options: [
      { label: 'A', text: '1,1 puan' },
      { label: 'B', text: '1,3 puan' },
      { label: 'C', text: '1,5 puan' },
      { label: 'D', text: '1,0 puan' },
      { label: 'E', text: '0,9 puan' }
    ],
    correctAnswer: 1,
    solution: 'Ocak: %3,2 - Haziran: %1,9 = 1,3 puanlik dusus.',
    tags: ['grafik-okuma', 'hata-orani', 'fark'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-99',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'zor',
    questionText: 'Hata orani %2,5\'in altinda olan aylarin toplam uretimi kac tondur?',
    svg: SVG_G10,
    options: [
      { label: 'A', text: '1.030' },
      { label: 'B', text: '1.060' },
      { label: 'C', text: '1.130' },
      { label: 'D', text: '1.070' },
      { label: 'E', text: '1.100' }
    ],
    correctAnswer: 2,
    solution: 'Hata orani %2,5\'in altindaki aylar: Mayis (%2,2) ve Haziran (%1,9). Toplam: 550 + 580 = 1.130 ton.',
    tags: ['grafik-okuma', 'uretim', 'filtreleme', 'toplama'],
    createdAt: T,
    updatedAt: T
  },
  {
    id: 'seed-soa-100',
    categoryId: 'sayisal-yetenek',
    subModuleId: 'sayisal-okuma-anlama',
    difficulty: 'cok-zor',
    questionText: 'Uretim artis orani (Ocak-Haziran) ile hata orani dusus orani (Ocak-Haziran) karsilastirildiginda, hangisi daha yuksektir ve yaklasik kac puanlik fark vardir?',
    svg: SVG_G10,
    options: [
      { label: 'A', text: 'Uretim artisi, 12 puan farkla' },
      { label: 'B', text: 'Hata dususu, 5 puan farkla' },
      { label: 'C', text: 'Hata dususu, 12 puan farkla' },
      { label: 'D', text: 'Esit' },
      { label: 'E', text: 'Uretim artisi, 5 puan farkla' }
    ],
    correctAnswer: 2,
    solution: 'Uretim artis orani: (580-450)/450 x 100 = %28,9. Hata dusus orani: (3,2-1,9)/3,2 x 100 = %40,6. Hata dususu daha yuksek: 40,6 - 28,9 = 11,7 yaklasik 12 puan fark.',
    tags: ['grafik-okuma', 'uretim', 'hata-orani', 'karsilastirma', 'yuzde'],
    createdAt: T,
    updatedAt: T
  }
];
