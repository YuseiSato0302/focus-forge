import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { WorkSession } from '../db';

export type TagPieChartProps = {
  data: WorkSession[];
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];

/**
 * タグごとの集中時間割合を円グラフで表示するコンポーネント
 */
export const TagPieChart: React.FC<TagPieChartProps> = ({ data }) => {
  // タグ集計ロジック（pure な関数として外部に抽出しても良い）
  const pieData = React.useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(({ duration_minutes, tags }) => {
      const perTag = duration_minutes / tags.length;
      tags.forEach(tag => {
        map[tag] = (map[tag] || 0) + perTag;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="w-full h-64">
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
