// src/components/Column.tsx

import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { addOutline, ellipsisVertical } from 'ionicons/icons';
import TaskCard from './TaskCard';
import { Column as ColumnType, Task } from '../types/task';

interface ColumnProps {
    column: ColumnType;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onDrop: (e: React.DragEvent, columnId: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onTaskClick: (task: Task) => void;
    onAddTask: (columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
    column,
    onDragStart,
    onDrop,
    onDragOver,
    onTaskClick,
    onAddTask,
}) => {
    const columnColors: { [key: string]: string } = {
        'todo': '#4e73df',
        'doing': '#f6c23e',
        'review': '#e74a3b',
        'done': '#28a745',
        'rework': '#858796',
    };

    const headerColor = columnColors[column.id] || '#6c757d';

    return (
        <div
            onDrop={(e) => onDrop(e, column.id)}
            onDragOver={onDragOver}
            style={{
                background: '#f4f5f7',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                width: '100%',
            }}
        >
            {/* HEADER */}
            <div style={{
                padding: '10px 14px',
                background: '#fafbfc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1px',
                }}>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1a1a2e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginRight: '4px',
                    }}>
                        {column.title}
                    </div>

                    {/* Tombol + */}
                    <IonButton
                        fill="outline"
                        size="small"
                        onClick={() => onAddTask(column.id)}
                        style={{
                            margin: 0,
                            padding: '0 4px',
                            minHeight: '20px',
                            height: '20px',
                            '--border-color': '#d1d5db',
                            '--color': '#6c757d',
                            '--border-radius': '3px',
                            '--border-width': '1px',
                        }}
                    >
                        <IonIcon icon={addOutline} style={{ fontSize: '12px', margin: 0 }} />
                    </IonButton>

                    {/* Icon ⋮ (titik tiga) */}
                    <IonButton
                        fill="clear"
                        size="small"
                        style={{
                            margin: 0,
                            padding: '0 2px',
                            minHeight: '20px',
                            height: '20px',
                        }}
                    >
                        <IonIcon icon={ellipsisVertical} style={{ fontSize: '14px', color: '#6c757d' }} />
                    </IonButton>
                </div>

                {/* ===== ICON PANAH MIRING (⤢) - PAKAI UNICODE ===== */}
                <IonButton
                    fill="clear"
                    size="small"
                    style={{
                        margin: 0,
                        padding: '0 4px',
                        minHeight: '20px',
                        height: '20px',
                    }}
                >
                    <span style={{ fontSize: '18px', color: '#6c757d', fontWeight: 'bold' }}>
                        ⤢
                    </span>
                </IonButton>
            </div>

            {/* GARIS PEMISAH */}
            <div style={{
                borderBottom: `2px solid ${headerColor}`,
                margin: '0 14px 8px 14px',
            }} />

            {/* TASK LIST */}
            <div
                style={{
                    padding: '0 14px 8px 14px',
                    flex: 1,
                    overflow: 'visible',
                }}
            >
                {column.tasks.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        color: '#bbb',
                        padding: '20px 0',
                        fontSize: '12px',
                    }}>
                        <p style={{ marginBottom: '2px' }}>📭</p>
                        <p style={{ fontSize: '11px' }}>Tidak ada task</p>
                    </div>
                ) : (
                    column.tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDragStart={onDragStart}
                            onClick={() => onTaskClick(task)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Column;