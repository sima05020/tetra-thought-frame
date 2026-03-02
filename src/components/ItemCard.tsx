import { ChevronRight, Trash2 } from 'lucide-react';
import { CATEGORY_LABELS, ThoughtItem } from '../types';

interface ItemCardProps {
    item: ThoughtItem;
    isResolved: boolean;
    onSelect: (item: ThoughtItem) => void;
    onDelete: (itemId: string) => void;
}

export function ItemCard({ item, isResolved, onSelect, onDelete }: ItemCardProps) {
    return (
        <div
            className={`category-border p-3 rounded shadow-sm cursor-pointer transition-all hover:shadow-md ${isResolved ? 'resolved-item' : ''
                } category-${item.category}`}
            onClick={() => onSelect(item)}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {CATEGORY_LABELS[item.category]}
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }}
                    className="p-1 hover:bg-red-200 rounded transition-colors flex-shrink-0"
                    title="削除"
                >
                    <Trash2 size={14} className="text-red-600" />
                </button>
            </div>
            {item.childIds.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                    <ChevronRight size={12} />
                    <span>{item.childIds.length}件の昇華</span>
                </div>
            )}
        </div>
    );
}
