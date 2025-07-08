import { WorkSession } from '../db';

/**
 * WorkSession[] を CSV 文字列に変換するユーティリティ
 */
export function sessionsToCSV(sessions: WorkSession[]): string {
  const header = ['id', 'title', 'started_at', 'ended_at', 'duration_minutes', 'tags', 'created_at'];
  const rows = sessions.map(s => ([
    s.id,
    s.title,
    s.started_at.toISOString(),
    s.ended_at.toISOString(),
    s.duration_minutes.toString(),
    // 配列をカンマ区切り文字列として格納
    `"${s.tags.join(',')}"`,
    s.created_at ? s.created_at.toISOString() : ''
  ]));
  const lines = [header, ...rows].map(fields => fields.join(','));
  return lines.join('\n');
}

// // File: src/App.tsx (一部修正)
// import { sessionsToCSV } from './utils/csv';

// export const App: React.FC = () => {
//   // ... 既存のコード

//   // CSV エクスポートハンドラ
//   const handleExport = async () => {
//     const sessions = await window.api.listSessions();
//     const csv = sessionsToCSV(sessions);
//     // ダイアログ&ファイル保存は main プロセス側で実装
//     await window.api.saveCSV(csv);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       {/* ... 既存の JSX ... */}

//       {view === 'timer' && (
//         <>
//           {/* 設定エリア */}
//           <div className="mt-6">
//             <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">
//               Settings
//               <button
//                 className="ml-4 px-4 py-2 bg-green-600 text-white rounded"
//                 onClick={handleExport}
//               >エクスポート (CSV)</button>
//             </h2>
//             <TimerSettings config={config} onChange={setConfig} />
//           </div>
//           {/* モーダル */}
//           <SessionModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
//         </>
//       )}
//       {/* ... */}
//     </div>
//   );
// };
