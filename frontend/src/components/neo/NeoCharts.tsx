import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { ChartDataPoint } from '../../types/api';

interface NeoChartsProps {
  chartData: ChartDataPoint[];
  pieData: Array<{ name: string; value: number; color: string }>;
}

export const NeoCharts: React.FC<NeoChartsProps> = ({ chartData, pieData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Daily Count Chart */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">
          Daily Asteroid Count
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Bar dataKey="count" fill="#3B82F6" />
            <Bar dataKey="hazardous" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hazard Distribution */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">
          Hazard Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                color: '#111827',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
