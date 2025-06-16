import React, { useEffect, useState } from 'react';
import { WorkSession } from '../db';

export const HistoryList: React.FC = () => {
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await window.api.listSessions();
        setSessions(data);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-6">読み込み中...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">作業履歴</h2>
      {sessions.length === 0 ? (
        <div>記録がありません。</div>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">日付</th>
              <th className="border-b px-4 py-2 text-left">タイトル</th>
              <th className="border-b px-4 py-2 text-right">時間 (分)</th>
              <th className="border-b px-4 py-2 text-left">タグ</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">
                  {session.created_at?.toLocaleString()}
                </td>
                <td className="border-b px-4 py-2">{session.title}</td>
                <td className="border-b px-4 py-2 text-right">{session.duration_minutes}</td>
                <td className="border-b px-4 py-2">
                  {session.tags.map(tag => (
                    <span key={tag} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 mr-1 rounded">
                      {tag}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
