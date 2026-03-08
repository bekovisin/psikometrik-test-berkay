'use client';

import { StatsOverview } from '@/components/musteri-paneli/StatsOverview';
import { ProjectTracking } from '@/components/musteri-paneli/ProjectTracking';
import { BottomWidgets } from '@/components/musteri-paneli/BottomWidgets';

export default function MusteriPaneli() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <StatsOverview />
      <ProjectTracking />
      <BottomWidgets />
    </div>
  );
}
