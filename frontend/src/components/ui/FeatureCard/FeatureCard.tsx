import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  to: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  description: string;
  hoverColor: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  to,
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  subtitle,
  description,
  hoverColor,
}) => {
  return (
    <Link
      to={to}
      className="card hover:scale-105 transition-all duration-300 cosmic-glow group"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`p-3 ${iconBgColor} bg-opacity-20 rounded-lg`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <div className="text-left">
          <h3
            className={`text-xl font-semibold text-white group-hover:${hoverColor} transition-colors`}
          >
            {title}
          </h3>
          <p className="text-gray-400">{subtitle}</p>
        </div>
      </div>
      <p className="text-gray-300 text-left">{description}</p>
    </Link>
  );
};
