import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useThought } from '../contexts/ThoughtContext';
import { CATEGORY_LABELS, CategoryId, ItemStatus, ThoughtItem } from '../types';

interface ItemModalProps {
    item: ThoughtItem;
    parentItem?: ThoughtItem;
    childItems: ThoughtItem[];
    isOpen: boolean;
    onNavigateToItem: (item: ThoughtItem) => void;
    onClose: () => void;
}

interface SublimateItem {
    id: string;
    category: CategoryId;
    title: string;
}

export function ItemModal({
    item,
    parentItem,
    childItems,
    isOpen,
    onNavigateToItem,
    onClose
}: ItemModalProps) {
    const { updateItem, sublimateMultipleItems } = useThought();
    const [draftTitle, setDraftTitle] = useState(item.title);
    const [draftStatus, setDraftStatus] = useState<ItemStatus>(item.status);
    const [draftMemo, setDraftMemo] = useState(item.memo);
    const [sublimateItems, setSublimateItems] = useState<SublimateItem[]>([]);
    const [tempCategory, setTempCategory] = useState<CategoryId>(1);
    const [tempTitle, setTempTitle] = useState('');

    useEffect(() => {
        setDraftTitle(item.title);
        setDraftStatus(item.status);
        setDraftMemo(item.memo);
        setSublimateItems([]);
        setTempCategory(1);
        setTempTitle('');
    }, [item.id]);

    const saveTitleIfChanged = () => {
        if (draftTitle !== item.title) {
            updateItem(item.id, { title: draftTitle });
        }
    };

    const saveStatusIfChanged = () => {
        if (draftStatus !== item.status) {
            updateItem(item.id, { status: draftStatus });
        }
    };

    const saveMemoIfChanged = () => {
        if (draftMemo !== item.memo) {
            updateItem(item.id, { memo: draftMemo });
        }
    };

    const handleAddSublimateItem = () => {
        if (!tempTitle.trim()) return;
        const newItem: SublimateItem = {
            id: Date.now().toString(),
            category: tempCategory,
            title: tempTitle
        };
        setSublimateItems([...sublimateItems, newItem]);
        setTempTitle('');
    };

    const handleRemoveSublimateItem = (id: string) => {
        setSublimateItems(sublimateItems.filter(item => item.id !== id));
    };

    const handleSublimateAll = () => {
        if (sublimateItems.length === 0) return;
        sublimateMultipleItems(
            item.id,
            sublimateItems.map(s => ({ category: s.category, title: s.title }))
        );
        setSublimateItems([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">項目の詳細</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title and Category */}
                    <div className={`p-4 rounded-lg category-${item.category}`}>
                        <input
                            type="text"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            onBlur={saveTitleIfChanged}
                            className="w-full text-xl font-bold mb-2 p-2 border rounded"
                        />
                        <p className="text-sm text-gray-600">{CATEGORY_LABELS[item.category]}</p>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-2">ステータス</label>
                        <select
                            value={draftStatus}
                            onChange={(e) => setDraftStatus(e.target.value as ItemStatus)}
                            onBlur={saveStatusIfChanged}
                            className="w-full border rounded p-2"
                        >
                            <option value="active">進行中</option>
                            <option value="resolved">解決済み</option>
                            <option value="sublimated">昇華済み</option>
                        </select>
                    </div>

                    {/* Memo */}
                    <div>
                        <label className="block text-sm font-medium mb-2">メモ（Markdown）</label>
                        <textarea
                            value={draftMemo}
                            onChange={(e) => setDraftMemo(e.target.value)}
                            onBlur={saveMemoIfChanged}
                            rows={6}
                            className="w-full border rounded p-3 font-mono text-sm"
                            placeholder="メモを入力..."
                        />
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">作成日時:</span>
                            <p>{new Date(item.createdAt).toLocaleString('ja-JP')}</p>
                        </div>
                        {item.resolvedAt && (
                            <div>
                                <span className="font-medium">解決日時:</span>
                                <p>{new Date(item.resolvedAt).toLocaleString('ja-JP')}</p>
                            </div>
                        )}
                    </div>

                    {/* Lineage */}
                    {parentItem && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                            <p className="text-sm font-medium mb-2 text-blue-900">この項目の由来（親）:</p>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">{parentItem.title}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    {CATEGORY_LABELS[parentItem.category]}
                                </p>
                            </div>
                        </div>
                    )}

                    {childItems.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded p-4">
                            <p className="text-sm font-medium mb-3 text-green-900">
                                この項目から発展したもの（{childItems.length}件）:
                            </p>
                            <div className="space-y-2">
                                {childItems.map((child) => (
                                    <button
                                        key={child.id}
                                        type="button"
                                        onClick={() => onNavigateToItem(child)}
                                        className={`text-sm p-2 rounded bg-white border-l-4 category-${child.category} cursor-pointer hover:shadow-sm`}
                                    >
                                        <p className="font-medium">{child.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {CATEGORY_LABELS[child.category]}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sublimation Section */}
                    {item.status === 'active' && (
                        <div className="border-t pt-6">
                            <h4 className="font-medium mb-4">昇華（この項目を具体化する）</h4>
                            <div className="space-y-3">
                                {/* Input Section */}
                                <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">昇華先のカテゴリ</label>
                                        <select
                                            value={tempCategory}
                                            onChange={(e) => setTempCategory(parseInt(e.target.value) as CategoryId)}
                                            className="w-full border rounded p-2"
                                        >
                                            {([1, 2, 3, 4] as CategoryId[]).map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}. {CATEGORY_LABELS[cat]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">新しい項目のタイトル</label>
                                        <input
                                            type="text"
                                            value={tempTitle}
                                            onChange={(e) => setTempTitle(e.target.value)}
                                            placeholder="具体的なタイトルを入力..."
                                            className="w-full border rounded p-2"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddSublimateItem();
                                                }
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddSublimateItem}
                                        disabled={!tempTitle.trim()}
                                        className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        リストに追加
                                    </button>
                                </div>

                                {/* Sublimate Items List */}
                                {sublimateItems.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">昇華する項目（{sublimateItems.length}件）</p>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {sublimateItems.map((sublimateItemData) => (
                                                <div
                                                    key={sublimateItemData.id}
                                                    className={`flex items-center justify-between gap-2 p-3 rounded bg-white border-l-4 category-${sublimateItemData.category}`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm">{sublimateItemData.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {sublimateItemData.category}. {CATEGORY_LABELS[sublimateItemData.category]}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveSublimateItem(sublimateItemData.id)}
                                                        className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                                                        title="削除"
                                                    >
                                                        <X size={16} className="text-red-600" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleSublimateAll}
                                            className="w-full bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700 transition-colors"
                                        >
                                            すべて昇華する
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
