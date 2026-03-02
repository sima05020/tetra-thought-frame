import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useThought } from '../contexts/ThoughtContext';
import { CATEGORY_LABELS, CategoryId, ThoughtItem } from '../types';
import { ItemCard } from './ItemCard';
import { ItemModal } from './ItemModal';

const CATEGORIES: CategoryId[] = [1, 2, 3, 4];

export function Board() {
    const { items, currentProjectId, addItem, deleteItem, showResolved } = useThought();
    const [selectedItem, setSelectedItem] = useState<ThoughtItem | null>(null);
    const [newItemInput, setNewItemInput] = useState<Record<CategoryId, string>>({
        1: '',
        2: '',
        3: '',
        4: ''
    });

    if (!currentProjectId) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">プロジェクトを作成または選択してください</p>
            </div>
        );
    }

    const projectItems = items.filter(item => item.projectId === currentProjectId);

    const getItemsForCategory = (category: CategoryId) => {
        return projectItems.filter(item => item.category === category);
    };

    const handleAddItem = (category: CategoryId) => {
        const title = newItemInput[category].trim();
        if (title) {
            addItem(category, title);
            setNewItemInput({ ...newItemInput, [category]: '' });
        }
    };

    const parentItem = selectedItem && selectedItem.parentId
        ? projectItems.find(item => item.id === selectedItem.parentId)
        : undefined;

    const childItems = selectedItem
        ? projectItems.filter(item => selectedItem.childIds.includes(item.id))
        : [];

    return (
        <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="bg-white border-b p-4 shadow-sm">
                    <h1 className="text-2xl font-bold">思考整理ボード</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        4つのカテゴリで思考を整理し、昇華させていきます
                    </p>
                </div>

                {/* Columns Container */}
                <div className="flex-1 overflow-x-auto">
                    <div className="inline-flex gap-4 h-full p-4 min-w-full">
                        {CATEGORIES.map((category) => {
                            const categoryItems = getItemsForCategory(category);
                            const activeItems = categoryItems.filter(i =>
                                showResolved || (i.status === 'active')
                            );

                            return (
                                <div
                                    key={category}
                                    className="flex-shrink-0 w-80 bg-white rounded-lg shadow border border-gray-200 flex flex-col"
                                >
                                    {/* Column Header */}
                                    <div className={`p-4 border-b-2 category-1 category-${category}`}>
                                        <h2 className="font-bold text-sm mb-1">
                                            {category}. {CATEGORY_LABELS[category]}
                                        </h2>
                                        <p className="text-xs text-gray-600">
                                            {activeItems.length}件
                                        </p>
                                    </div>

                                    {/* Items List */}
                                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                        {activeItems.map((item) => (
                                            <ItemCard
                                                key={item.id}
                                                item={item}
                                                isResolved={item.status !== 'active'}
                                                onSelect={setSelectedItem}
                                                onDelete={deleteItem}
                                            />
                                        ))}
                                        {activeItems.length === 0 && (
                                            <p className="text-xs text-gray-400 text-center py-4">
                                                まだ項目がありません
                                            </p>
                                        )}
                                    </div>

                                    {/* Add Item Input */}
                                    <div className="border-t p-3 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newItemInput[category]}
                                                onChange={(e) =>
                                                    setNewItemInput({
                                                        ...newItemInput,
                                                        [category]: e.target.value
                                                    })
                                                }
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddItem(category);
                                                    }
                                                }}
                                                placeholder="クイック追加..."
                                                className="flex-1 border rounded px-2 py-1 text-sm"
                                            />
                                            <button
                                                onClick={() => handleAddItem(category)}
                                                className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors"
                                                title="追加"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedItem && (
                <ItemModal
                    item={selectedItem}
                    parentItem={parentItem}
                    childItems={childItems}
                    isOpen={!!selectedItem}
                    onNavigateToItem={setSelectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
