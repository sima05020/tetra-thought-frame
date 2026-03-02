export type ItemStatus = 'active' | 'resolved' | 'sublimated';
export type CategoryId = 1 | 2 | 3 | 4;

export interface ThoughtItem {
    id: string;
    projectId: string;
    category: CategoryId;
    status: ItemStatus;
    title: string;
    memo: string;
    parentId: string | null;
    childIds: string[];
    createdAt: number;
    resolvedAt?: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: number;
}

export interface AppState {
    projects: Project[];
    currentProjectId: string | null;
    items: ThoughtItem[];
    showResolved: boolean;
}

export const CATEGORY_LABELS: Record<CategoryId, string> = {
    1: '絶対にこうあるべき',
    2: 'こうだったら嬉しい',
    3: 'なんか違う、違和感がある',
    4: '絶対アカン'
};

export const CATEGORY_DESCRIPTIONS: Record<CategoryId, string> = {
    1: 'Goals/Requirements - 明確なゴール、仕様、要件',
    2: 'Nice-to-Have - ゆるやかな方針や理想',
    3: 'Intuitive Discomfort - 正体不明の違和感',
    4: 'Critical Avoidance - 徹底して避けるべき状態'
};
