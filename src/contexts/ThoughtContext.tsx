import React, { createContext, useCallback, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CategoryId, ItemStatus, Project, ThoughtItem } from '../types';

interface AppContextType {
    projects: Project[];
    currentProjectId: string | null;
    items: ThoughtItem[];
    showResolved: boolean;

    // Project operations
    createProject: (name: string, description: string) => string;
    deleteProject: (projectId: string) => void;
    switchProject: (projectId: string) => void;

    // Item operations
    addItem: (category: CategoryId, title: string) => void;
    updateItem: (itemId: string, updates: Partial<ThoughtItem>) => void;
    deleteItem: (itemId: string) => void;
    sublimateItem: (parentId: string, category: CategoryId, title: string) => string;
    sublimateMultipleItems: (parentId: string, newItems: Array<{ category: CategoryId; title: string }>) => void;

    // UI operations
    toggleShowResolved: () => void;
}

const ThoughtContext = createContext<AppContextType | undefined>(undefined);

export function ThoughtProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useLocalStorage<Project[]>('thought_projects', []);
    const [currentProjectId, setCurrentProjectId] = useLocalStorage<string | null>('thought_current_project', null);
    const [items, setItems] = useLocalStorage<ThoughtItem[]>('thought_items', []);
    const [showResolved, setShowResolved] = useState(false);

    const createProject = useCallback((name: string, description: string): string => {
        const newProject: Project = {
            id: Date.now().toString(),
            name,
            description,
            createdAt: Date.now()
        };
        setProjects([...projects, newProject]);
        setCurrentProjectId(newProject.id);
        return newProject.id;
    }, [projects, setProjects, setCurrentProjectId]);

    const deleteProject = useCallback((projectId: string) => {
        setProjects(projects.filter(p => p.id !== projectId));
        setItems(items.filter(item => item.projectId !== projectId));
        if (currentProjectId === projectId) {
            const nextProject = projects.find(p => p.id !== projectId);
            setCurrentProjectId(nextProject?.id || null);
        }
    }, [projects, items, currentProjectId, setProjects, setItems, setCurrentProjectId]);

    const switchProject = useCallback((projectId: string) => {
        setCurrentProjectId(projectId);
    }, [setCurrentProjectId]);

    const addItem = useCallback((category: CategoryId, title: string) => {
        if (!currentProjectId) return;
        const newItem: ThoughtItem = {
            id: Date.now().toString(),
            projectId: currentProjectId,
            category,
            status: 'active',
            title,
            memo: '',
            parentId: null,
            childIds: [],
            createdAt: Date.now()
        };
        setItems([...items, newItem]);
    }, [currentProjectId, items, setItems]);

    const updateItem = useCallback((itemId: string, updates: Partial<ThoughtItem>) => {
        setItems(items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
        ));
    }, [items, setItems]);

    const deleteItem = useCallback((itemId: string) => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        // Remove from parent's childIds
        if (item.parentId) {
            updateItem(item.parentId, {
                childIds: items.find(i => i.id === item.parentId)?.childIds.filter(id => id !== itemId) || []
            });
        }

        // Remove all children
        const newItems = items.filter(i => i.id !== itemId && !item.childIds.includes(i.id));
        setItems(newItems);
    }, [items, setItems, updateItem]);

    const sublimateItem = useCallback((parentId: string, category: CategoryId, title: string): string => {
        const newItemId = Date.now().toString();
        const parentItem = items.find(i => i.id === parentId);

        if (!parentItem) return newItemId;

        const newItem: ThoughtItem = {
            id: newItemId,
            projectId: parentItem.projectId,
            category,
            status: 'active',
            title,
            memo: '',
            parentId,
            childIds: [],
            createdAt: Date.now()
        };

        updateItem(parentId, {
            status: 'resolved',
            resolvedAt: Date.now(),
            childIds: [...parentItem.childIds, newItemId]
        });

        setItems([...items, newItem]);
        return newItemId;
    }, [items, setItems, updateItem]);

    const sublimateMultipleItems = useCallback((parentId: string, newItems: Array<{ category: CategoryId; title: string }>) => {
        const parentItem = items.find(i => i.id === parentId);
        if (!parentItem || newItems.length === 0) return;

        const now = Date.now();
        const childItems: ThoughtItem[] = [];
        const childIds: string[] = [];

        newItems.forEach((itemData, index) => {
            const newItemId = `${now}_${index}`;
            childIds.push(newItemId);
            childItems.push({
                id: newItemId,
                projectId: parentItem.projectId,
                category: itemData.category,
                status: 'active',
                title: itemData.title,
                memo: '',
                parentId,
                childIds: [],
                createdAt: now + index
            });
        });

        setItems(items.map(item =>
            item.id === parentId
                ? {
                    ...item,
                    status: 'resolved' as ItemStatus,
                    resolvedAt: now,
                    childIds: [...item.childIds, ...childIds]
                }
                : item
        ).concat(childItems));
    }, [items, setItems]);

    const toggleShowResolved = useCallback(() => {
        setShowResolved(!showResolved);
    }, [showResolved]);

    const value: AppContextType = {
        projects,
        currentProjectId,
        items,
        showResolved,
        createProject,
        deleteProject,
        switchProject,
        addItem,
        updateItem,
        deleteItem,
        sublimateItem,
        sublimateMultipleItems,
        toggleShowResolved
    };

    return <ThoughtContext.Provider value={value}>{children}</ThoughtContext.Provider>;
}

export function useThought() {
    const context = useContext(ThoughtContext);
    if (!context) {
        throw new Error('useThought must be used within ThoughtProvider');
    }
    return context;
}
