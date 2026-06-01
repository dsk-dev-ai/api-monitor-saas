'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusDistributionProps {
  data: {
    up: number;
    down: number;
    degraded: number;
  };
}

const COLORS = {
  up: '#22c55e',
  down: '#ef4444',
  degraded: '#f59e0b',
};

export function StatusDistributionChart({ data }: StatusDistributionProps) {
  const chartData = [
    { name: 'Up', value: data.up, color: COLORS.up },
    { name: 'Down', value: data.down, color: COLORS.down },
    { name: 'Degraded', value: data.degraded, color: COLORS.degraded },
  ].filter((item) => item.value > 0);

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
