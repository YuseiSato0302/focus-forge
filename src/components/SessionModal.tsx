import React, { useState, useEffect, useRef } from 'react';

export type SessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, tags: string[]) => void;
};

export const SessionModal: React.FC<SessionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('未定義セッション');
      setTags([]);
      setInputTag('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const addTag = () => {
    const tag = inputTag.trim();
    if (tag !== '' && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setInputTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    onSave(title.trim() || '無題セッション', tags);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 mx-2">
        <h3 className="text-xl mb-4">セッションを記録</h3>
        <div className="mb-4">
          <label className="block mb-1">タイトル</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">タグ</label>
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              className="flex-1 border p-2 rounded"
              value={inputTag}
              onChange={e => setInputTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              onClick={addTag}
              disabled={inputTag.trim() === ''}
              type="button"
            >追加</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="bg-gray-200 px-2 py-1 rounded flex items-center">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 text-red-500" type="button">×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose} type="button">キャンセル</button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            onClick={handleSave}
            disabled={title.trim() === ''}
            type="button"
          >保存</button>
        </div>
      </div>
    </div>
  );
};
