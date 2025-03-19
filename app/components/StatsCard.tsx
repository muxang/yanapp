"use client";

interface StatsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  isLoading?: boolean;
}

export function StatsCard({ label, value, unit, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="stats-card">
        <div className="loading-pulse h-4 w-20 mb-2"></div>
        <div className="loading-pulse h-8 w-16"></div>
      </div>
    );
  }

  return (
    <div className="stats-card">
      <div className="stats-label">{label}</div>
      <div className="stats-value">
        {value}
        {unit && (
          <span className="text-base ml-1 text-[--text-secondary]">{unit}</span>
        )}
      </div>
    </div>
  );
}
