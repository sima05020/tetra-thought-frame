import { Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useThought } from '../contexts/ThoughtContext';

export function ProjectSelector() {
    const { projects, currentProjectId, createProject, switchProject, deleteProject, toggleShowResolved, showResolved } = useThought();
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');

    const currentProject = projects.find(p => p.id === currentProjectId);

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            createProject(newProjectName, newProjectDesc);
            setNewProjectName('');
            setNewProjectDesc('');
            setIsCreating(false);
        }
    };

    return (
        <div className="bg-white border-b shadow-sm">
            <div className="max-w-full px-4 py-4">
                {/* Current Project Display */}
                {currentProject ? (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{currentProject.name}</h2>
                        {currentProject.description && (
                            <p className="text-sm text-gray-600 mt-1">{currentProject.description}</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">プロジェクトを選択してください</p>
                )}

                {/* Controls */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {/* Project Dropdown */}
                    {projects.length > 0 && (
                        <select
                            value={currentProjectId || ''}
                            onChange={(e) => switchProject(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                        >
                            <option value="">プロジェクトを選択...</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Toggle Show Resolved */}
                    <button
                        onClick={toggleShowResolved}
                        className={`flex items-center gap-1 px-3 py-2 rounded text-sm transition-colors ${showResolved
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        title="解決済みの項目も表示"
                    >
                        <Eye size={16} />
                        <span>解決済み表示</span>
                    </button>

                    {/* Create Project Button */}
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                        <Plus size={16} />
                        <span>新規プロジェクト</span>
                    </button>

                    {/* Delete Current Project */}
                    {currentProject && (
                        <button
                            onClick={() => {
                                if (confirm(`プロジェクト「${currentProject.name}」を削除しますか？\nこのアクションは取り消せません。`)) {
                                    deleteProject(currentProject.id);
                                }
                            }}
                            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                        >
                            <Trash2 size={16} />
                            <span>削除</span>
                        </button>
                    )}
                </div>

                {/* Create Project Form */}
                {isCreating && (
                    <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">プロジェクト名</label>
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="プロジェクト名を入力..."
                                className="w-full border rounded px-3 py-2 text-sm"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleCreateProject();
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">説明（任意）</label>
                            <textarea
                                value={newProjectDesc}
                                onChange={(e) => setNewProjectDesc(e.target.value)}
                                placeholder="プロジェクトの説明..."
                                rows={2}
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCreateProject}
                                className="flex-1 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition-colors"
                            >
                                作成
                            </button>
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewProjectName('');
                                    setNewProjectDesc('');
                                }}
                                className="flex-1 bg-gray-400 text-white py-2 rounded font-medium hover:bg-gray-500 transition-colors"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
