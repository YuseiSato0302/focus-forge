import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { WorkSession } from '../db';
import { groupTagsBySessions } from '../utils/group';

export type TagPieChartProps = {
  data: WorkSession[];
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];

/**
 * タグごとの集中時間割合を円グラフで表示するコンポーネント
 */
export const TagPieChart: React.FC<TagPieChartProps> = ({ data }) => {
  const pieData = React.useMemo(() => groupTagsBySessions(data), [data]);

  return (
    <div data-testid="tag-chart" className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={pieData} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
