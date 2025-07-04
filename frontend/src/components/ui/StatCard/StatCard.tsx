import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  value: string;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconColor,
  value,
  label,
}) => {
  return (
    <div className="card text-center">
      <Icon className={`h-8 w-8 ${iconColor} mx-auto mb-2`} />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
};
