import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { WorkSession } from '../db';
import { groupSessionsByPeriod } from '../utils/group';

export type FocusTimeChartProps = {
  data: WorkSession[];
  period: 'daily' | 'weekly' | 'monthly';
};

/**
 * 集中時間を日/週/月単位で棒グラフ表示するコンポーネント
 */
export const FocusTimeChart: React.FC<FocusTimeChartProps> = ({ data, period }) => {
  // グルーピングロジックをユーティリティ関数に委譲
  const grouped = React.useMemo(() => groupSessionsByPeriod(data, period), [data, period]);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={grouped} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};