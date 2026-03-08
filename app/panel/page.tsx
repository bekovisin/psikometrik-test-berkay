'use client';

import { StatsOverview } from '@/components/musteri-paneli/StatsOverview';
import { ProjectTracking } from '@/components/musteri-paneli/ProjectTracking';
import { BottomWidgets } from '@/components/musteri-paneli/BottomWidgets';

export default function PanelDashboard() {
  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <StatsOverview />
      <ProjectTracking />
      <BottomWidgets />
    </div>
  );
}
