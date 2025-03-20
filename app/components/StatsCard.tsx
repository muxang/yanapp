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
      <div className="stat-card">
        <div className="stat-label">Loading...</div>
        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
      </div>
    );
  }

  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  );
}
