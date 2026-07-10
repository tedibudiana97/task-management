// src/types/task.ts

export interface Task {
    id: string;
    title: string;
    description: string;
    assignees: string[];
    dueDate: string;
    label: 'Feature' | 'Bug' | 'Issue' | 'Undefined';
    priority?: 'Low' | 'Medium' | 'High';
    checklist: ChecklistItem[];
    attachments: string[];
    columnId: string;
    createdAt: string;
    coverImage?: string;
    isCompleted?: boolean;  
}

export interface ChecklistItem {
    id: string;
    text: string;
    checked: boolean;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}