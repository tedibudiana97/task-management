// src/store/taskStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Column, Task, ChecklistItem } from '../types/task';

// Generate ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

interface TaskStore {
    columns: Column[];
    addTask: (taskData: any, columnId: string) => void;
    updateTask: (taskId: string, updatedTask: Task) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
    addChecklist: (taskId: string, text: string) => void;
    toggleChecklist: (taskId: string, checklistId: string) => void;
}

const initialColumns: Column[] = [
    // ===== TO DO =====
    {
        id: 'todo',
        title: 'To Do',
        tasks: [
            {
                id: 'task1',
                title: 'Research for podcast and video website',
                description: 'Cari referensi website podcast yang bagus',
                assignees: ['John Doe', 'Jane Smith'],
                dueDate: '2025-08-08',
                label: 'Feature',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/podcast/400/200',
                checklist: [
                    { id: 'c1', text: 'Cari 5 website referensi', checked: true },
                    { id: 'c2', text: 'Buat list fitur', checked: false },
                    { id: 'c3', text: 'Presentasi ke tim', checked: false },
                ],
                attachments: ['file1.pdf', 'file2.jpg'],
                columnId: 'todo',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task2',
                title: 'Debug checkout process for e-commerce website',
                description: 'Perbaiki bug di proses checkout',
                assignees: ['Jane Smith', 'Michael Brown'],
                dueDate: '2025-08-10',
                label: 'Bug',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/ecommerce/400/200',
                checklist: [
                    { id: 'c4', text: 'Identifikasi bug', checked: true },
                    { id: 'c5', text: 'Perbaiki kode', checked: false },
                    { id: 'c6', text: 'Testing', checked: false },
                ],
                attachments: ['bug-report.pdf'],
                columnId: 'todo',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task3',
                title: 'Design wireframes for landing page revamp',
                description: 'Buat wireframe untuk landing page baru',
                assignees: ['Sarah Lee'],
                dueDate: '2025-08-12',
                label: 'Feature',
                priority: 'Medium',
                coverImage: 'https://picsum.photos/seed/wireframe/400/200',
                checklist: [
                    { id: 'c7', text: 'Research design trend', checked: true },
                    { id: 'c8', text: 'Buat wireframe', checked: false },
                ],
                attachments: ['wireframe-sketch.png'],
                columnId: 'todo',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
        ],
    },

    // ===== DOING =====
    {
        id: 'doing',
        title: 'Doing',
        tasks: [
            {
                id: 'task4',
                title: 'Create and refine logo designs for UI brand',
                description: 'Buat logo untuk brand baru',
                assignees: ['Sarah Lee', 'John Doe'],
                dueDate: '2025-08-15',
                label: 'Feature',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/logo/400/200',
                checklist: [
                    { id: 'c9', text: 'Research logo trend', checked: true },
                    { id: 'c10', text: 'Buat 5 sketsa', checked: true },
                    { id: 'c11', text: 'Finalisasi', checked: false },
                ],
                attachments: ['logo-sketch.png', 'logo-final.ai'],
                columnId: 'doing',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task5',
                title: 'Create icon library for the project',
                description: 'Buat library icon untuk project',
                assignees: ['John Doe'],
                dueDate: '2025-08-18',
                label: 'Issue',
                priority: 'Medium',
                coverImage: 'https://picsum.photos/seed/icons/400/200',
                checklist: [
                    { id: 'c12', text: 'List icon yang dibutuhkan', checked: true },
                    { id: 'c13', text: 'Design icon', checked: false },
                ],
                attachments: ['icon-list.pdf'],
                columnId: 'doing',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task6',
                title: 'Enhance website usability through user feedback',
                description: 'Improve UX berdasarkan feedback user',
                assignees: ['Michael', 'Jane Smith'],
                dueDate: '2025-08-20',
                label: 'Issue',
                priority: 'Medium',
                coverImage: 'https://picsum.photos/seed/ux/400/200',
                checklist: [
                    { id: 'c14', text: 'Kumpulkan feedback', checked: true },
                    { id: 'c15', text: 'Analisis feedback', checked: true },
                    { id: 'c16', text: 'Implementasi perubahan', checked: false },
                ],
                attachments: ['feedback-report.xlsx'],
                columnId: 'doing',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task7',
                title: 'Setup CI/CD Pipeline',
                description: 'Setup CI/CD untuk deployment',
                assignees: ['Michael Brown'],
                dueDate: '2025-08-07',
                label: 'Feature',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/cicd/400/200',
                checklist: [
                    { id: 'c17', text: 'Setup GitHub Actions', checked: true },
                    { id: 'c18', text: 'Setup deployment', checked: true },
                    { id: 'c19', text: 'Testing pipeline', checked: true },
                ],
                attachments: [],
                columnId: 'doing',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
        ],
    },

    // ===== REVIEW =====
    {
        id: 'review',
        title: 'Review',
        tasks: [
            {
                id: 'task8',
                title: 'Create Email Page layout and components',
                description: 'Buat layout dan component untuk email page',
                assignees: ['Jane Smith'],
                dueDate: '2025-08-09',
                label: 'Feature',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/email/400/200',
                checklist: [
                    { id: 'c20', text: 'Design layout', checked: true },
                    { id: 'c21', text: 'Buat component', checked: true },
                    { id: 'c22', text: 'Testing', checked: false },
                ],
                attachments: ['email-design.fig'],
                columnId: 'review',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task9',
                title: 'Blog Edit Page Modification',
                description: 'Modifikasi halaman edit blog',
                assignees: ['Sarah Lee'],
                dueDate: '2025-08-08',
                label: 'Feature',
                priority: 'Medium',
                coverImage: 'https://picsum.photos/seed/blog/400/200',
                checklist: [
                    { id: 'c23', text: 'Analisis kebutuhan', checked: true },
                    { id: 'c24', text: 'Implementasi', checked: true },
                ],
                attachments: [],
                columnId: 'review',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task10',
                title: 'Plan and execute training sessions',
                description: 'Rencanakan dan laksanakan training',
                assignees: ['John Doe', 'Michael Brown'],
                dueDate: '2025-08-09',
                label: 'Feature',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/training/400/200',
                checklist: [
                    { id: 'c25', text: 'Buat materi training', checked: true },
                    { id: 'c26', text: 'Jadwalkan training', checked: true },
                    { id: 'c27', text: 'Laksanakan training', checked: true },
                ],
                attachments: ['training-materials.pdf'],
                columnId: 'review',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
        ],
    },

    // ===== DONE =====
    {
        id: 'done',
        title: 'Done',
        tasks: [
            {
                id: 'task11',
                title: 'Deploy website to production',
                description: 'Deploy aplikasi ke server production',
                assignees: ['Michael Brown'],
                dueDate: '2025-07-25',
                label: 'Feature',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/deploy/400/200',
                checklist: [
                    { id: 'd1', text: 'Build aplikasi', checked: true },
                    { id: 'd2', text: 'Upload ke server', checked: true },
                    { id: 'd3', text: 'Testing production', checked: true },
                ],
                attachments: ['deploy-log.txt'],
                columnId: 'done',
                createdAt: new Date().toISOString(),
                isCompleted: true,
            },
            {
                id: 'task12',
                title: 'User testing feedback implementation',
                description: 'Implementasi feedback dari user testing',
                assignees: ['Sarah Lee', 'John Doe'],
                dueDate: '2025-07-20',
                label: 'Issue',
                priority: 'Medium',
                coverImage: 'https://picsum.photos/seed/feedback/400/200',
                checklist: [
                    { id: 'd4', text: 'Kumpulkan feedback', checked: true },
                    { id: 'd5', text: 'Implementasi perubahan', checked: true },
                ],
                attachments: ['feedback-summary.pdf'],
                columnId: 'done',
                createdAt: new Date().toISOString(),
                isCompleted: true,
            },
            {
                id: 'task13',
                title: 'Database optimization',
                description: 'Optimasi query database untuk performa',
                assignees: ['Michael Brown'],
                dueDate: '2025-07-15',
                label: 'Feature',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/database/400/200',
                checklist: [
                    { id: 'd6', text: 'Analisis query lambat', checked: true },
                    { id: 'd7', text: 'Optimasi index', checked: true },
                    { id: 'd8', text: 'Testing performa', checked: true },
                ],
                attachments: ['query-analysis.sql'],
                columnId: 'done',
                createdAt: new Date().toISOString(),
                isCompleted: true,
            },
        ],
    },

    // ===== REWORK =====
    {
        id: 'rework',
        title: 'Rework',
        tasks: [
            {
                id: 'task14',
                title: 'Fix UI responsive issues',
                description: 'Perbaiki masalah responsive di mobile',
                assignees: ['Sarah Lee'],
                dueDate: '2025-07-28',
                label: 'Bug',
                priority: 'High',
                coverImage: 'https://picsum.photos/seed/responsive/400/200',
                checklist: [
                    { id: 'r1', text: 'Identifikasi issue', checked: true },
                    { id: 'r2', text: 'Perbaiki CSS', checked: false },
                    { id: 'r3', text: 'Testing di mobile', checked: false },
                ],
                attachments: ['screenshot-issue.png'],
                columnId: 'rework',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task15',
                title: 'Refactor authentication module',
                description: 'Refactor kode autentikasi untuk lebih clean',
                assignees: ['John Doe', 'Michael Brown'],
                dueDate: '2025-07-30',
                label: 'Undefined',
                priority: 'Medium',
                coverImage: 'https://picsum.photos/seed/auth/400/200',
                checklist: [
                    { id: 'r4', text: 'Review kode', checked: true },
                    { id: 'r5', text: 'Refactor', checked: false },
                    { id: 'r6', text: 'Testing', checked: false },
                ],
                attachments: ['auth-module.ts'],
                columnId: 'rework',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
            {
                id: 'task16',
                title: 'Update API documentation',
                description: 'Update dokumentasi API terbaru',
                assignees: ['Jane Smith'],
                dueDate: '2025-08-01',
                label: 'Undefined',
                priority: 'Low',
                coverImage: 'https://picsum.photos/seed/api/400/200',
                checklist: [
                    { id: 'r7', text: 'Review API', checked: true },
                    { id: 'r8', text: 'Update docs', checked: false },
                ],
                attachments: ['api-docs.md'],
                columnId: 'rework',
                createdAt: new Date().toISOString(),
                isCompleted: false,
            },
        ],
    },
];

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            columns: initialColumns,

            addTask: (taskData: any, columnId: string) => {
                const newTask: Task = {
                    ...taskData,
                    id: generateId(),
                    assignees: taskData.assignees || [],
                    checklist: [],
                    attachments: [],
                    coverImage: taskData.coverImage || '',
                    columnId: columnId,
                    createdAt: new Date().toISOString(),
                    isCompleted: false,
                };

                set((state) => ({
                    columns: state.columns.map((col) =>
                        col.id === columnId
                            ? { ...col, tasks: [...col.tasks, newTask] }
                            : col
                    ),
                }));
            },

            updateTask: (taskId: string, updatedTask: Task) => {
                set((state) => ({
                    columns: state.columns.map((col) => ({
                        ...col,
                        tasks: col.tasks.map((task) =>
                            task.id === taskId ? updatedTask : task
                        ),
                    })),
                }));
            },

            deleteTask: (taskId: string) => {
                set((state) => ({
                    columns: state.columns.map((col) => ({
                        ...col,
                        tasks: col.tasks.filter((task) => task.id !== taskId),
                    })),
                }));
            },

            moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) => {
                const state = get();
                const sourceColumn = state.columns.find((col) => col.id === sourceColumnId);
                const targetColumn = state.columns.find((col) => col.id === targetColumnId);

                if (!sourceColumn || !targetColumn) return;

                const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId);
                if (taskIndex === -1) return;

                const task = sourceColumn.tasks[taskIndex];

                set((state) => ({
                    columns: state.columns.map((col) => {
                        if (col.id === sourceColumnId) {
                            return {
                                ...col,
                                tasks: col.tasks.filter((t) => t.id !== taskId),
                            };
                        }
                        if (col.id === targetColumnId) {
                            return {
                                ...col,
                                tasks: [...col.tasks, { ...task, columnId: targetColumnId }],
                            };
                        }
                        return col;
                    }),
                }));
            },

            addChecklist: (taskId: string, text: string) => {
                set((state) => ({
                    columns: state.columns.map((col) => ({
                        ...col,
                        tasks: col.tasks.map((task) =>
                            task.id === taskId
                                ? {
                                    ...task,
                                    checklist: [
                                        ...task.checklist,
                                        { id: generateId(), text, checked: false },
                                    ],
                                }
                                : task
                        ),
                    })),
                }));
            },

            toggleChecklist: (taskId: string, checklistId: string) => {
                set((state) => ({
                    columns: state.columns.map((col) => ({
                        ...col,
                        tasks: col.tasks.map((task) =>
                            task.id === taskId
                                ? {
                                    ...task,
                                    checklist: task.checklist.map((item) =>
                                        item.id === checklistId
                                            ? { ...item, checked: !item.checked }
                                            : item
                                    ),
                                }
                                : task
                        ),
                    })),
                }));
            },
        }),
        {
            name: 'task-storage',
        }
    )
);