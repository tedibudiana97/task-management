// src/components/TaskCard.tsx

import React, { useState } from 'react';
import { IonCard, IonCardContent, IonChip, IonIcon, IonLabel } from '@ionic/react';
import { calendarOutline, checkboxOutline, attachOutline } from 'ionicons/icons';
import { Task } from '../types/task';

interface TaskCardProps {
    task: Task;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onClick: () => void;
}

const CARD_COLORS = [
    '#fff5f5', '#f0f8ff', '#f0fff4', '#fff8f0',
    '#f5f0ff', '#fff0f6', '#f0faff', '#f5fff5',
];

const AVATAR_COLORS = ['#4a6cf7', '#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#0984e3', '#fd79a8', '#00cec9'];

const getCardColor = (id: string) => CARD_COLORS[id.length % CARD_COLORS.length];
const getAvatarColor = (name: string, index: number) => AVATAR_COLORS[index % AVATAR_COLORS.length];
const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        const parts = dateString.split(' ');
        if (parts.length === 3) {
            const month = parts[0];
            const day = parts[1].replace(',', '');
            const year = parts[2];
            return `${day} ${month} ${year}`;
        }
        return dateString;
    }
    return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const cardColor = getCardColor(task.id);
    
    const labelColors = { Feature: 'success', Bug: 'danger', Issue: 'warning', Undefined: 'medium' };

    const checkedCount = task.checklist.filter((item) => item.checked).length;
    const totalChecklist = task.checklist.length;
    const progress = totalChecklist > 0 ? (checkedCount / totalChecklist) * 100 : 0;

    const assignees = task.assignees || (task.assignee ? [task.assignee] : []);
    const imageUrl = task.coverImage || `https://picsum.photos/seed/${task.id}/400/200`;

    return (
        <IonCard
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                cursor: 'grab',
                marginBottom: '10px',
                borderRadius: '12px',
                background: cardColor,
                boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: isHovered ? '2px solid #0d6efd' : '1px solid rgba(0,0,0,0.06)',
                transition: 'all 0.25s ease',
                transform: isHovered ? 'translateY(-3px) scale(1.01)' : 'none',
                overflow: 'hidden',
            }}
        >
            <IonCardContent style={{ padding: '0' }}>
                {/* COVER IMAGE */}
                {!imageError ? (
                    <div style={{
                        width: '100%',
                        height: '120px',
                        overflow: 'hidden',
                        background: '#f0f2f5',
                        position: 'relative',
                    }}>
                        <img 
                            src={imageUrl}
                            alt={task.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                            onError={() => setImageError(true)}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            display: 'flex',
                            gap: '6px',
                        }}>
                            <span style={{
                                background: task.label === 'Feature' ? '#d4edda' :
                                           task.label === 'Bug' ? '#f8d7da' :
                                           task.label === 'Issue' ? '#fff3cd' : '#e9ecef',
                                fontSize: '9px',
                                fontWeight: 600,
                                padding: '2px 10px',
                                borderRadius: '12px',
                                color: '#333',
                            }}>
                                {task.label}
                            </span>
                            {task.priority && (
                                <span style={{
                                    background: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    fontSize: '9px',
                                    fontWeight: 600,
                                    padding: '2px 10px',
                                    borderRadius: '12px',
                                }}>
                                    {task.priority}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{
                        width: '100%',
                        height: '120px',
                        background: '#e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '12px',
                    }}>
                        🖼️ No Image
                    </div>
                )}

                {/* KONTEN */}
                <div style={{ padding: '12px 14px 14px 14px' }}>
                    {/* JUDUL */}
                    <h6 style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        marginBottom: '4px',
                        color: '#1a1a2e',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4,
                    }}>
                        {task.title}
                    </h6>

                    {/* DESCRIPTION */}
                    {task.description && (
                        <div style={{
                            fontSize: '11px',
                            color: '#888',
                            marginBottom: '8px',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {task.description}
                        </div>
                    )}

                    {/* ===== ASSIGNEE + DUE DATE - LAYOUT BARU ===== */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginTop: '6px',
                    }}>
                        {/* BARIS 1: AVATAR + NAMA + JUMLAH */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            {assignees.length > 0 ? (
                                <>
                                    <div style={{ display: 'flex', position: 'relative', flexShrink: 0 }}>
                                        {assignees.slice(0, 3).map((name, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    width: '26px',
                                                    height: '26px',
                                                    borderRadius: '50%',
                                                    background: getAvatarColor(name, index),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    marginLeft: index > 0 ? '-6px' : '0',
                                                    border: '2px solid white',
                                                    zIndex: assignees.length - index,
                                                    flexShrink: 0,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                }}
                                                title={name}
                                            >
                                                {getInitials(name)}
                                            </div>
                                        ))}
                                        {assignees.length > 3 && (
                                            <div
                                                style={{
                                                    width: '26px',
                                                    height: '26px',
                                                    borderRadius: '50%',
                                                    background: '#e0e0e0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#555',
                                                    fontSize: '9px',
                                                    fontWeight: 700,
                                                    marginLeft: '-6px',
                                                    border: '2px solid white',
                                                    flexShrink: 0,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                }}
                                            >
                                                +{assignees.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* NAMA LENGKAP (TIDAK DIPOTONG) */}
                                    <span style={{
                                        fontSize: '12px',
                                        color: '#333',
                                        fontWeight: 500,
                                        flex: 1,
                                    }}>
                                        {assignees.map((name, idx) => (
                                            <span key={idx}>
                                                {idx > 0 && ', '}
                                                {name}
                                            </span>
                                        ))}
                                    </span>
                                </>
                            ) : (
                                <span style={{ fontSize: '12px', color: '#999' }}>Unassigned</span>
                            )}
                        </div>

                        {/* BARIS 2: DUE DATE + CHECKLIST PROGRESS */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            {/* DUE DATE */}
                            <span style={{
                                fontSize: '11px',
                                color: '#666',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                <IonIcon icon={calendarOutline} style={{ fontSize: '12px' }} />
                                {formatDate(task.dueDate)}
                            </span>

                            {/* CHECKLIST PROGRESS (SIMPEL) */}
                            {totalChecklist > 0 && (
                                <span style={{
                                    fontSize: '11px',
                                    color: '#777',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    <IonIcon icon={checkboxOutline} style={{ fontSize: '11px' }} />
                                    {checkedCount}/{totalChecklist} ({Math.round(progress)}%)
                                </span>
                            )}
                        </div>

                        {/* PROGRESS BAR (DI BAWAH) */}
                        {totalChecklist > 0 && (
                            <div style={{
                                height: '4px',
                                background: 'rgba(0,0,0,0.08)',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                marginTop: '2px',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    background: progress === 100 ? '#28a745' : '#0d6efd',
                                    borderRadius: '4px',
                                    transition: 'width 0.4s ease',
                                }} />
                            </div>
                        )}
                    </div>

                    {/* ATTACHMENTS */}
                    {task.attachments && task.attachments.length > 0 && (
                        <div style={{
                            marginTop: '8px',
                            fontSize: '10px',
                            color: '#999',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            <IonIcon icon={attachOutline} style={{ fontSize: '10px' }} />
                            {task.attachments.length} file
                        </div>
                    )}
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default TaskCard;