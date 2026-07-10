// src/pages/Board.tsx

import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonModal,
    IonButton,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonItem,
    IonLabel,
    IonIcon,
    IonToast,
} from '@ionic/react';
import { 
    closeOutline, 
    downloadOutline, 
    cloudUploadOutline,
} from 'ionicons/icons';
import { useTaskStore } from '../store/taskStore';
import Column from '../components/Column';
import { Task } from '../types/task';

const Board: React.FC = () => {
    const { columns, addTask, updateTask, deleteTask, moveTask, addChecklist, toggleChecklist } = useTaskStore();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('');
    const [filterLabel, setFilterLabel] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState('');
    const [newChecklistText, setNewChecklistText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // ===== STATE FORM =====
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignees: [] as string[],  // ← multiple assignees
        dueDate: '',
        label: 'Undefined' as const,
        priority: 'Medium' as const,
        coverImage: '',
    });

    const [newAssignee, setNewAssignee] = useState('');  // ← input tambah assignee

    // ===== FUNCTIONS =====
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = columns.find((col) =>
            col.tasks.some((task) => task.id === taskId)
        );
        if (sourceColumn) {
            moveTask(taskId, sourceColumn.id, columnId);
            setToastMessage(`Task dipindahkan ke ${columns.find(c => c.id === columnId)?.title}`);
            setShowToast(true);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleAddTask = (columnId: string) => {
        setCurrentColumnId(columnId);
        setFormData({
            title: '',
            description: '',
            assignees: ['John Doe', 'Jane Smith', 'Michael Brown'],
            dueDate: new Date().toISOString(),
            label: 'Undefined',
            priority: 'Medium',
            coverImage: '',
        });
        setNewAssignee('');
        setIsAddModalOpen(true);
    };

    // ===== FUNGSI TAMBAH ASSIGNEE =====
    const handleAddAssignee = () => {
        if (newAssignee.trim() && !formData.assignees.includes(newAssignee.trim())) {
            setFormData({
                ...formData,
                assignees: [...formData.assignees, newAssignee.trim()]
            });
            setNewAssignee('');
        }
    };

    // ===== FUNGSI HAPUS ASSIGNEE =====
    const handleRemoveAssignee = (name: string) => {
        setFormData({
            ...formData,
            assignees: formData.assignees.filter(a => a !== name)
        });
    };

    const handleSaveTask = () => {
        if (!formData.title.trim()) {
            alert('Title wajib diisi!');
            return;
        }
        if (formData.assignees.length === 0) {
            alert('Minimal 1 assignee!');
            return;
        }
        addTask(formData, currentColumnId);
        setIsAddModalOpen(false);
        setToastMessage('Task berhasil ditambahkan!');
        setShowToast(true);
    };

    const handleUpdateTask = () => {
        if (selectedTask) {
            updateTask(selectedTask.id, selectedTask);
            setIsModalOpen(false);
            setToastMessage('Task berhasil diupdate!');
            setShowToast(true);
        }
    };

    const handleDeleteTask = () => {
        if (selectedTask && window.confirm('Yakin ingin menghapus task ini?')) {
            deleteTask(selectedTask.id);
            setIsModalOpen(false);
            setToastMessage('Task berhasil dihapus!');
            setShowToast(true);
        }
    };

    const handleAddChecklist = () => {
        if (selectedTask && newChecklistText.trim()) {
            addChecklist(selectedTask.id, newChecklistText);
            setNewChecklistText('');
            const updatedTask = columns
                .flatMap(col => col.tasks)
                .find(t => t.id === selectedTask.id);
            if (updatedTask) {
                setSelectedTask(updatedTask);
            }
        }
    };

    const filteredColumns = columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => {
            const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchAssignee = !filterAssignee || task.assignees?.includes(filterAssignee);
            const matchLabel = !filterLabel || task.label === filterLabel;
            return matchSearch && matchAssignee && matchLabel;
        }),
    }));

    const allAssignees = Array.from(
        new Set(columns.flatMap(col => col.tasks.flatMap(t => t.assignees || [])))
    );

    return (
        <IonPage>
            {/* HEADER */}
            {/* HEADER */}
            <IonHeader>
                <IonToolbar style={{ 
                    '--background': '#ffffff',
                    '--min-height': '56px',
                    padding: '0 16px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    borderBottom: '1px solid #f0f0f0',
                }}>
                    {/* KIRI: Gembok + Adhivasindo + Panah Bawah + Avatar Stack + Invite */}
                    <div slot="start" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                    }}>
                        <span style={{ fontSize: '14px', color: '#888' }}>🔒</span>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e' }}>Adhivasindo</span>
                        <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>▼</span>
                        <span style={{ width: '4px' }} />

                        {/* ===== AVATAR STACK ===== */}
                        <div style={{ display: 'flex', position: 'relative', alignItems: 'center' }}>
                            <img 
                                src="https://i.pravatar.cc/32?img=1" 
                                alt="Avatar 1"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    objectFit: 'cover',
                                    position: 'relative',
                                    zIndex: 3,
                                }}
                            />
                            <img 
                                src="https://i.pravatar.cc/32?img=2" 
                                alt="Avatar 2"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    objectFit: 'cover',
                                    position: 'relative',
                                    marginLeft: '-10px',
                                    zIndex: 2,
                                }}
                            />
                            <img 
                                src="https://i.pravatar.cc/32?img=3" 
                                alt="Avatar 3"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    objectFit: 'cover',
                                    position: 'relative',
                                    marginLeft: '-10px',
                                    zIndex: 1,
                                }}
                            />
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: '#e0e0e0',
                                    border: '2px solid white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#555',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    marginLeft: '-10px',
                                    zIndex: 0,
                                    flexShrink: 0,
                                }}
                            >
                                +2
                            </div>
                        </div>

                        {/* Invite Button */}
                        <IonButton 
                            fill="outline"
                            size="small"
                            style={{ 
                                '--color': '#4a6cf7',
                                '--border-color': '#4a6cf7',
                                '--border-radius': '8px',
                                fontSize: '11px',
                                fontWeight: 500,
                                height: '32px',
                                minHeight: '32px',
                                padding: '0 14px',
                                textTransform: 'none',
                                margin: 0,
                            }}
                        >
                            <span style={{ marginRight: '6px', fontSize: '14px' }}>👤</span>
                            Invite
                        </IonButton>
                    </div>

                    {/* KANAN: Filter + Export/Import + Search */}
                    <div slot="end" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonButton 
                            fill="outline"
                            size="small"
                            onClick={() => setShowFilter(!showFilter)}
                            style={{ 
                                '--color': '#4a6cf7',
                                '--border-color': '#4a6cf7',
                                '--border-radius': '8px',
                                fontSize: '11px',
                                fontWeight: 500,
                                height: '32px',
                                minHeight: '32px',
                                padding: '0 14px',
                                textTransform: 'none',
                                margin: 0,
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px', flexShrink: 0 }}>
                                <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
                            </svg>
                            Filter
                        </IonButton>

                        <IonButton 
                            fill="outline"
                            size="small"
                            style={{ 
                                '--color': '#4a6cf7',
                                '--border-color': '#4a6cf7',
                                '--border-radius': '8px',
                                fontSize: '11px',
                                fontWeight: 500,
                                height: '32px',
                                minHeight: '32px',
                                padding: '0 14px',
                                textTransform: 'none',
                                margin: 0,
                            }}
                        >
                            <span style={{ marginRight: '5px', fontSize: '14px' }}>🌐</span>
                            Export / Import
                        </IonButton>

                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            background: '#f1f3f4',
                            borderRadius: '20px',
                            padding: '0 12px',
                            maxWidth: '200px',
                            width: '100%',
                            height: '36px',
                            gap: '6px',
                        }}>
                            <span style={{ fontSize: '15px', color: '#888' }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search Tasks"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    fontSize: '13px',
                                    color: '#333',
                                    height: '100%',
                                    direction: 'ltr',
                                    textAlign: 'left',
                                }}
                                autoFocus={true}
                            />
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>

            {/* CONTENT */}
            <IonContent scrollY={false} style={{ '--overflow': 'hidden' }}>
                {/* FILTER */}
                {showFilter && (
                    <div style={{ 
                        padding: '8px 16px', 
                        background: '#f8f9fa',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: '1px solid #e9ecef',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#666' }}>Filter:</span>
                        <IonSelect
                            placeholder="Assignee"
                            value={filterAssignee}
                            onIonChange={(e) => setFilterAssignee(e.detail.value)}
                            style={{ 
                                minWidth: '100px', 
                                maxWidth: '140px',
                                fontSize: '11px',
                                '--background': 'white',
                                '--border-radius': '8px',
                            }}
                        >
                            <IonSelectOption value="">All Assignees</IonSelectOption>
                            {allAssignees.map(name => (
                                <IonSelectOption key={name} value={name}>{name}</IonSelectOption>
                            ))}
                        </IonSelect>
                        <IonSelect
                            placeholder="Label"
                            value={filterLabel}
                            onIonChange={(e) => setFilterLabel(e.detail.value)}
                            style={{ 
                                minWidth: '100px', 
                                maxWidth: '140px',
                                fontSize: '11px',
                                '--background': 'white',
                                '--border-radius': '8px',
                            }}
                        >
                            <IonSelectOption value="">All Labels</IonSelectOption>
                            <IonSelectOption value="Feature">Feature</IonSelectOption>
                            <IonSelectOption value="Bug">Bug</IonSelectOption>
                            <IonSelectOption value="Issue">Issue</IonSelectOption>
                            <IonSelectOption value="Undefined">Undefined</IonSelectOption>
                        </IonSelect>
                        <IonButton 
                            size="small" 
                            fill="clear"
                            onClick={() => {
                                setFilterAssignee('');
                                setFilterLabel('');
                            }}
                            style={{ fontSize: '11px', color: '#0d6efd', margin: 0, padding: '0 8px', height: '28px' }}
                        >
                            Clear All
                        </IonButton>
                    </div>
                )}

                {/* BOARD */}
                <div 
                    style={{ 
                        height: 'calc(100vh - 140px)',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        padding: '12px 16px',
                    }}
                >
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'row',
                        gap: '0px', 
                        alignItems: 'flex-start',
                        flexWrap: 'nowrap',
                        minHeight: '100%',
                        height: 'auto',
                    }}>
                        {filteredColumns.map((column, index) => (
                            <React.Fragment key={column.id}>
                                <div
                                    style={{
                                        minWidth: '280px',
                                        maxWidth: '320px',
                                        width: '100%',
                                        flexShrink: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '0 6px',
                                        height: 'auto',
                                    }}
                                >
                                    <Column
                                        column={column}
                                        onDragStart={handleDragStart}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onTaskClick={handleTaskClick}
                                        onAddTask={handleAddTask}
                                    />
                                </div>

                                {index < filteredColumns.length - 1 && (
                                    <div
                                        style={{
                                            width: '1px',
                                            height: 'auto',
                                            minHeight: '100%',
                                            background: 'transparent',
                                            borderRight: '2px dashed #d1d5db',
                                            flexShrink: 0,
                                            margin: '0 4px',
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        ))}

                        <div
                            style={{
                                minWidth: '160px',
                                maxWidth: '200px',
                                flexShrink: 0,
                                borderRadius: '8px',
                                border: '2px dashed #d1d5db',
                                background: '#fafafa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                padding: '8px 16px',
                                height: '44px',
                                alignSelf: 'flex-start',
                                marginTop: '4px',
                                gap: '6px',
                                marginLeft: '6px',
                            }}
                            onClick={() => {
                                const newColumnName = prompt('Masukkan nama column baru:');
                                if (newColumnName && newColumnName.trim()) {
                                    alert(`Column "${newColumnName}" akan ditambahkan! (Fitur ini bisa dikembangkan lebih lanjut)`);
                                }
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#4a6cf7';
                                e.currentTarget.style.background = '#f0f7ff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.background = '#fafafa';
                            }}
                        >
                            <span style={{ fontSize: '18px', color: '#9ca3af', lineHeight: 1 }}>+</span>
                            <span style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Add List</span>
                        </div>
                    </div>
                </div>

               {/* ===== MODAL DETAIL TASK  ===== */}
                <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                    {selectedTask ? (
                        <div style={{ 
                            padding: '24px', 
                            maxHeight: '90vh', 
                            overflowY: 'auto',
                            backgroundColor: '#ffffff',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}>
                            {/* ===== HEADER ===== */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                marginBottom: '20px' 
                            }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a2e' }}>Detail Task</h3>
                                <IonButton fill="clear" onClick={() => setIsModalOpen(false)} style={{ margin: 0, padding: '8px' }}>
                                    <IonIcon icon={closeOutline} style={{ fontSize: '24px', color: '#666' }} />
                                </IonButton>
                            </div>

                            {/* ===== MARK COMPLETE ===== */}
                            <IonButton 
                                expand="block"
                                color={selectedTask.isCompleted ? 'success' : 'primary'}
                                onClick={() => {
                                    setSelectedTask({ 
                                        ...selectedTask, 
                                        isCompleted: !selectedTask.isCompleted 
                                    });
                                }}
                                style={{ 
                                    marginBottom: '16px',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    height: '44px',
                                    fontSize: '14px',
                                }}
                            >
                                {selectedTask.isCompleted ? '✅ Mark Complete' : 'Mark Complete'}
                            </IonButton>

                            {/* ===== ADD COVER IMAGE ===== */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: '#555', 
                                    display: 'block', 
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                }}>
                                    Add Cover Image
                                </label>
                                <IonInput
                                    value={selectedTask.coverImage || ''}
                                    onIonChange={(e) => setSelectedTask({ ...selectedTask, coverImage: e.detail.value || '' })}
                                    placeholder="https://picsum.photos/seed/xxx/400/200"
                                    style={{
                                        '--background': '#f5f7fa',
                                        '--border-radius': '8px',
                                        '--padding-start': '14px',
                                        minHeight: '44px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* ===== CRUD EMPLOYEE ===== */}
                            <div style={{ marginBottom: '4px' }}>
                                <label style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: '#555', 
                                    display: 'block',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                }}>
                                    CRUD Employee
                                </label>
                            </div>

                            {/* ===== ASSIGNEE ===== */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: '#555', 
                                    display: 'block', 
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                }}>
                                    Assignee
                                </label>
                                <IonInput
                                    value={selectedTask.assignees?.join(', ') || ''}
                                    onIonChange={(e) => setSelectedTask({ 
                                        ...selectedTask, 
                                        assignees: e.detail.value ? e.detail.value.split(',').map(s => s.trim()) : [] 
                                    })}
                                    placeholder="John Doe, Jane Smith"
                                    style={{
                                        '--background': '#f5f7fa',
                                        '--border-radius': '8px',
                                        '--padding-start': '14px',
                                        minHeight: '44px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* ===== DUE DATE ===== */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: '#555', 
                                    display: 'block', 
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                }}>
                                    Due Date
                                </label>
                                <IonInput
                                    value={selectedTask.dueDate || ''}
                                    onIonChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.detail.value || '' })}
                                    placeholder="20 Aug 2025"
                                    style={{
                                        '--background': '#f5f7fa',
                                        '--border-radius': '8px',
                                        '--padding-start': '14px',
                                        minHeight: '44px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* ===== BOARD & COLUMN ===== */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        fontSize: '12px', 
                                        fontWeight: 500, 
                                        color: '#555', 
                                        display: 'block', 
                                        marginBottom: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3px',
                                    }}>
                                        Board
                                    </label>
                                    <IonInput
                                        value="Northern Light"
                                        disabled
                                        style={{
                                            '--background': '#f5f7fa',
                                            '--border-radius': '8px',
                                            '--padding-start': '14px',
                                            minHeight: '44px',
                                            fontSize: '14px',
                                            '--color': '#333',
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        fontSize: '12px', 
                                        fontWeight: 500, 
                                        color: '#555', 
                                        display: 'block', 
                                        marginBottom: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3px',
                                    }}>
                                        Column
                                    </label>
                                    <IonSelect
                                        value={selectedTask.columnId || selectedTask.column}
                                        onIonChange={(e) => setSelectedTask({ ...selectedTask, columnId: e.detail.value })}
                                        style={{
                                            '--background': '#f5f7fa',
                                            '--border-radius': '8px',
                                            minHeight: '44px',
                                            width: '100%',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {columns.map(col => (
                                            <IonSelectOption key={col.id} value={col.id}>
                                                {col.title}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>
                                </div>
                            </div>

                            {/* ===== LABEL & PRIORITY ===== */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        fontSize: '12px', 
                                        fontWeight: 500, 
                                        color: '#555', 
                                        display: 'block', 
                                        marginBottom: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3px',
                                    }}>
                                        Label
                                    </label>
                                    <IonSelect
                                        value={selectedTask.label || 'Undefined'}
                                        onIonChange={(e) => setSelectedTask({ ...selectedTask, label: e.detail.value })}
                                        style={{
                                            '--background': '#f5f7fa',
                                            '--border-radius': '8px',
                                            minHeight: '44px',
                                            width: '100%',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <IonSelectOption value="Feature">Feature</IonSelectOption>
                                        <IonSelectOption value="Bug">Bug</IonSelectOption>
                                        <IonSelectOption value="Issue">Issue</IonSelectOption>
                                        <IonSelectOption value="Undefined">Undefined</IonSelectOption>
                                    </IonSelect>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        fontSize: '12px', 
                                        fontWeight: 500, 
                                        color: '#555', 
                                        display: 'block', 
                                        marginBottom: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3px',
                                    }}>
                                        Priority
                                    </label>
                                    <IonSelect
                                        value={selectedTask.priority || 'Medium'}
                                        onIonChange={(e) => setSelectedTask({ ...selectedTask, priority: e.detail.value })}
                                        style={{
                                            '--background': '#f5f7fa',
                                            '--border-radius': '8px',
                                            minHeight: '44px',
                                            width: '100%',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <IonSelectOption value="Low">Low</IonSelectOption>
                                        <IonSelectOption value="Medium">Medium</IonSelectOption>
                                        <IonSelectOption value="High">High</IonSelectOption>
                                    </IonSelect>
                                </div>
                            </div>

                            {/* ===== DESCRIPTION ===== */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: '#555', 
                                    display: 'block', 
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                }}>
                                    Description
                                </label>
                                <IonTextarea
                                    value={selectedTask.description || ''}
                                    onIonChange={(e) => setSelectedTask({ ...selectedTask, description: e.detail.value || '' })}
                                    placeholder="Description"
                                    rows={4}
                                    style={{
                                        '--background': '#f5f7fa',
                                        '--border-radius': '8px',
                                        '--padding-start': '14px',
                                        '--padding-top': '12px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* ===== CHECK LIST ===== */}
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    marginBottom: '8px' 
                                }}>
                                    <label style={{ 
                                        fontSize: '12px', 
                                        fontWeight: 500, 
                                        color: '#555',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3px',
                                    }}>
                                        Check List
                                    </label>
                                    <span style={{ fontSize: '12px', color: '#999' }}>
                                        {selectedTask.checklist?.filter(c => c.checked).length || 0}/{selectedTask.checklist?.length || 0}
                                    </span>
                                </div>
                                
                                {selectedTask.checklist && selectedTask.checklist.length > 0 ? (
                                    selectedTask.checklist.map((item) => (
                                        <div key={item.id} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px', 
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f0f0f0',
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={item.checked || false}
                                                onChange={() => {
                                                    toggleChecklist(selectedTask.id, item.id);
                                                    const updated = columns
                                                        .flatMap(col => col.tasks)
                                                        .find(t => t.id === selectedTask.id);
                                                    if (updated) setSelectedTask(updated);
                                                }}
                                                style={{ width: '16px', height: '16px', accentColor: '#4a6cf7', cursor: 'pointer' }}
                                            />
                                            <span style={{ 
                                                textDecoration: item.checked ? 'line-through' : 'none', 
                                                color: item.checked ? '#999' : '#333',
                                                flex: 1,
                                                fontSize: '13px',
                                            }}>
                                                {item.text}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ color: '#999', fontSize: '13px', padding: '10px 0' }}>
                                        Belum ada subtask
                                    </div>
                                )}
                                
                                {/* ===== + ADD SUBTASK ===== */}
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <IonInput
                                        placeholder="+ Add subtask"
                                        value={newChecklistText}
                                        onIonChange={(e) => setNewChecklistText(e.detail.value || '')}
                                        style={{
                                            '--background': '#f5f7fa',
                                            '--border-radius': '8px',
                                            '--padding-start': '14px',
                                            minHeight: '40px',
                                            flex: 1,
                                            fontSize: '13px',
                                        }}
                                    />
                                    <IonButton 
                                        onClick={handleAddChecklist} 
                                        size="small"
                                        style={{
                                            '--border-radius': '8px',
                                            textTransform: 'none',
                                            minHeight: '40px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Add
                                    </IonButton>
                                </div>
                            </div>

                            {/* ===== ACTIVITY ===== */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: '#555', 
                                    display: 'block', 
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                }}>
                                    Activity
                                </label>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#999', 
                                    padding: '10px 0',
                                    borderBottom: '1px solid #f0f0f0',
                                }}>
                                    No activity yet
                                </div>
                            </div>

                            {/* ===== BUTTONS ===== */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <IonButton 
                                    expand="block" 
                                    color="medium" 
                                    onClick={() => setIsModalOpen(false)}
                                    style={{
                                        '--border-radius': '8px',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        flex: 1,
                                        height: '44px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Discard
                                </IonButton>
                                <IonButton 
                                    expand="block" 
                                    color="primary" 
                                    onClick={handleUpdateTask}
                                    style={{
                                        '--border-radius': '8px',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        flex: 1,
                                        height: '44px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Save
                                </IonButton>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <p>Loading...</p>
                        </div>
                    )}
                </IonModal>

              {/* ===== MODAL ADD TASK  ===== */}
                <IonModal isOpen={isAddModalOpen} onDidDismiss={() => setIsAddModalOpen(false)}>
                    <div style={{ 
                        padding: '24px', 
                        maxHeight: '90vh', 
                        overflowY: 'auto',
                        backgroundColor: '#ffffff',
                    }}>
                        {/* HEADER */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '20px' 
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a2e' }}>Tambah Task Baru</h3>
                            <IonButton fill="clear" onClick={() => setIsAddModalOpen(false)} style={{ margin: 0 }}>
                                <IonIcon icon={closeOutline} style={{ fontSize: '24px', color: '#666' }} />
                            </IonButton>
                        </div>

                        {/* ===== ADD COVER IMAGE - DRAG & DROP + ICON ADD IMAGE ===== */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                marginBottom: '6px',
                            }}>
                                {/* ICON ADD IMAGE (SVG) */}
                                <svg 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="#4a6cf7" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                    <line x1="12" y1="3" x2="12" y2="21" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                </svg>
                                
                                <label style={{ 
                                    fontSize: '13px', 
                                    fontWeight: 500, 
                                    color: '#555',
                                    cursor: 'pointer',
                                }}>
                                    Add Cover Image
                                </label>
                            </div>
                            
                            {/* PREVIEW GAMBAR */}
                            {formData.coverImage && (
                                <div style={{ 
                                    marginBottom: '8px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    width: '100%',
                                    height: '100px',
                                    background: '#f0f2f5',
                                    position: 'relative',
                                }}>
                                    <img 
                                        src={formData.coverImage} 
                                        alt="Cover"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <button
                                        onClick={() => setFormData({ ...formData, coverImage: '' })}
                                        style={{
                                            position: 'absolute',
                                            top: '6px',
                                            right: '6px',
                                            background: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            
                            {/* ===== DRAG & DROP ZONE + ICON ADD IMAGE ===== */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '20px',
                                    background: '#fafbfc',
                                    borderRadius: '8px',
                                    border: '2px dashed #d1d5db',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    minHeight: '100px',
                                    gap: '6px',
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#4a6cf7';
                                    e.currentTarget.style.background = '#f0f4ff';
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.background = '#fafbfc';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.background = '#fafbfc';
                                    
                                    const files = e.dataTransfer.files;
                                    if (files && files.length > 0) {
                                        const file = files[0];
                                        if (!file.type.startsWith('image/')) {
                                            alert('Harap pilih file gambar!');
                                            return;
                                        }
                                        if (file.size > 2 * 1024 * 1024) {
                                            alert('Ukuran gambar maksimal 2MB!');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const base64 = event.target?.result as string;
                                            setFormData({ ...formData, coverImage: base64 });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                onClick={() => {
                                    document.getElementById('coverImageInput')?.click();
                                }}
                            >
                                {/* ICON ADD IMAGE (BESAR) */}
                                <svg 
                                    width="48" 
                                    height="48" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="#4a6cf7" 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                    <line x1="12" y1="3" x2="12" y2="21" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                </svg>
                                
                                <span style={{ fontSize: '14px', color: '#555' }}>
                                    Drag & Drop image here
                                </span>
                                <span style={{ fontSize: '13px', color: '#999' }}>
                                    or <span style={{ color: '#4a6cf7', fontWeight: 500, textDecoration: 'underline' }}>browse from device</span>
                                </span>
                                <span style={{ fontSize: '11px', color: '#aaa' }}>
                                    Max 2MB · JPG, PNG, GIF
                                </span>
                                
                                <input
                                    id="coverImageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (!file.type.startsWith('image/')) {
                                            alert('Harap pilih file gambar!');
                                            return;
                                        }
                                        if (file.size > 2 * 1024 * 1024) {
                                            alert('Ukuran gambar maksimal 2MB!');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const base64 = event.target?.result as string;
                                            setFormData({ ...formData, coverImage: base64 });
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        {/* ===== CRUD EMPLOYEE ===== */}
                        <div style={{ 
                            marginBottom: '16px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid #f0f0f0',
                        }}>
                            <h4 style={{ 
                                margin: 0, 
                                fontSize: '16px', 
                                fontWeight: 600, 
                                color: '#1a1a2e',
                            }}>
                                CRUD Employe
                            </h4>
                        </div>

                        {/* ===== LAYOUT 2 KOLOM (LABEL DI ATAS) ===== */}
                        <div style={{ display: 'flex', gap: '32px' }}>
                            {/* === KOLOM KIRI === */}
                            <div style={{ flex: 1 }}>
                                {/* ===== ASSIGNEE - AVATAR BERTUMPUK ===== */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ 
                                        fontSize: '13px', 
                                        fontWeight: 500, 
                                        color: '#555',
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}>
                                        Assignee
                                    </label>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}>
                                        {/* AVATAR STACK (BERTUMPUK) */}
                                        <div style={{ display: 'flex', position: 'relative' }}>
                                            {formData.assignees && formData.assignees.length > 0 ? (
                                                <>
                                                    {/* Avatar 1 */}
                                                    {formData.assignees.slice(0, 3).map((name, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                background: ['#4a6cf7', '#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#0984e3'][index % 6],
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontSize: '12px',
                                                                fontWeight: 700,
                                                                marginLeft: index > 0 ? '-10px' : '0',
                                                                border: '2px solid white',
                                                                zIndex: formData.assignees.length - index,
                                                                flexShrink: 0,
                                                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                                transition: 'all 0.2s ease',
                                                            }}
                                                            title={name}
                                                        >
                                                            {name.charAt(0).toUpperCase()}
                                                        </div>
                                                    ))}
                                                    {/* +N kalau lebih dari 3 */}
                                                    {formData.assignees.length > 3 && (
                                                        <div
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                background: '#e0e0e0',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#555',
                                                                fontSize: '10px',
                                                                fontWeight: 700,
                                                                marginLeft: '-10px',
                                                                border: '2px solid white',
                                                                flexShrink: 0,
                                                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                            }}
                                                        >
                                                            +{formData.assignees.length - 3}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span style={{ fontSize: '13px', color: '#999' }}>Tidak ada assignee</span>
                                            )}
                                        </div>
                                        
                                        {/* JUMLAH ORANG */}
                                        {formData.assignees && formData.assignees.length > 0 && (
                                            <span style={{ 
                                                fontSize: '13px', 
                                                color: '#333',
                                                fontWeight: 500,
                                            }}>
                                                {formData.assignees.length} orang
                                            </span>
                                        )}
                                        
                                        {/* TOMBOL + */}
                                        <IonButton 
                                            fill="clear"
                                            size="small"
                                            onClick={() => {
                                                const names = prompt('Masukkan nama assignee (pisah dengan koma):', formData.assignees?.join(', ') || '');
                                                if (names !== null) {
                                                    setFormData({ 
                                                        ...formData, 
                                                        assignees: names ? names.split(',').map(s => s.trim()).filter(s => s) : [] 
                                                    });
                                                }
                                            }}
                                            style={{
                                                margin: 0,
                                                padding: '0 6px',
                                                minHeight: '32px',
                                                height: '32px',
                                                '--color': '#4a6cf7',
                                                fontWeight: 'bold',
                                                fontSize: '22px',
                                            }}
                                        >
                                            +
                                        </IonButton>
                                    </div>
                                </div>

                                {/* BOARD */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ 
                                        fontSize: '13px', 
                                        fontWeight: 500, 
                                        color: '#555',
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}>
                                        Board
                                    </label>
                                    <div style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        background: '#f5f7fa',
                                        fontSize: '13px',
                                        color: '#333',
                                        minHeight: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>
                                        Northern Light
                                    </div>
                                </div>

                                {/* LABEL */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ 
                                        fontSize: '13px', 
                                        fontWeight: 500, 
                                        color: '#555',
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}>
                                        Label
                                    </label>
                                    <IonSelect
                                        value={formData.label || 'Undefined'}
                                        onIonChange={(e) => setFormData({ ...formData, label: e.detail.value })}
                                        style={{
                                            '--background': '#f5f7fa',
                                            '--border-radius': '8px',
                                            minHeight: '36px',
                                            width: '100%',
                                            fontSize: '13px',
                                        }}
                                    >
                                        <IonSelectOption value="Feature">Feature</IonSelectOption>
                                        <IonSelectOption value="Bug">Bug</IonSelectOption>
                                        <IonSelectOption value="Issue">Issue</IonSelectOption>
                                        <IonSelectOption value="Undefined">Undefined</IonSelectOption>
                                    </IonSelect>
                                </div>
                            </div>

                            {/* === KOLOM KANAN === */}
                            <div style={{ flex: 1 }}>
                                {/* DUE DATE */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ 
                                        fontSize: '13px', 
                                        fontWeight: 500, 
                                        color: '#555',
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}>
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, dueDate: e.target.value });
                                        }}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #d1d5db',
                                            background: '#f5f7fa',
                                            fontSize: '13px',
                                            color: '#333',
                                            minHeight: '36px',
                                            width: '100%',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </div>

                                {/* COLUMN */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ 
                                        fontSize: '13px', 
                                        fontWeight: 500, 
                                        color: '#555',
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}>
                                        Column
                                    </label>
                                    <IonSelect
                                        value={currentColumnId}
                                        onIonChange={(e) => setCurrentColumnId(e.detail.value)}
                                        style={{
                                            '--background': '#f5f7fa',
                                            '--border-radius': '8px',
                                            minHeight: '36px',
                                            width: '100%',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {columns.map(col => (
                                            <IonSelectOption key={col.id} value={col.id}>
                                                {col.title}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>
                                </div>

                                {/* PRIORITY */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ 
                                        fontSize: '13px', 
                                        fontWeight: 500, 
                                        color: '#555',
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}>
                                        Priority
                                    </label>
                                    <IonSelect
                                        value={formData.priority || 'Medium'}
                                        onIonChange={(e) => setFormData({ ...formData, priority: e.detail.value })}
                                        style={{
                                            '--background': '#f5f7fa',
                                            '--border-radius': '8px',
                                            minHeight: '36px',
                                            width: '100%',
                                            fontSize: '13px',
                                        }}
                                    >
                                        <IonSelectOption value="Low">Low</IonSelectOption>
                                        <IonSelectOption value="Medium">Medium</IonSelectOption>
                                        <IonSelectOption value="High">High</IonSelectOption>
                                    </IonSelect>
                                </div>
                            </div>
                        </div>

                        {/* ===== DESCRIPTION ===== */}
                        <div style={{ marginBottom: '14px', marginTop: '8px' }}>
                            <label style={{ 
                                fontSize: '13px', 
                                fontWeight: 500, 
                                color: '#555',
                                display: 'block',
                                marginBottom: '4px',
                            }}>
                                Description
                            </label>
                            <IonTextarea
                                value={formData.description || ''}
                                onIonChange={(e) => setFormData({ ...formData, description: e.detail.value || '' })}
                                placeholder="Description"
                                rows={3}
                                style={{
                                    '--background': '#f5f7fa',
                                    '--border-radius': '8px',
                                    '--padding-start': '14px',
                                    '--padding-top': '10px',
                                    fontSize: '13px',
                                }}
                            />
                        </div>

                        {/* ===== ATTACHMENTS - DRAG & DROP ===== */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ 
                                fontSize: '13px', 
                                fontWeight: 500, 
                                color: '#555',
                                display: 'block',
                                marginBottom: '4px',
                            }}>
                                Attachments
                            </label>
                            
                            {/* LIST ATTACHMENTS */}
                            {formData.attachments && formData.attachments.length > 0 && (
                                <div style={{ marginBottom: '8px' }}>
                                    {formData.attachments.map((file, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '6px 12px',
                                                background: '#f5f7fa',
                                                borderRadius: '6px',
                                                marginBottom: '4px',
                                                fontSize: '13px',
                                                color: '#333',
                                            }}
                                        >
                                            <span>📎 {file}</span>
                                            <button
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        attachments: formData.attachments.filter((f) => f !== file)
                                                    });
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#e74a3b',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    padding: '0 4px',
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* ===== DRAG & DROP ZONE ===== */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '30px 20px',
                                    background: '#fafbfc',
                                    borderRadius: '8px',
                                    border: '2px dashed #d1d5db',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    minHeight: '120px',
                                    gap: '8px',
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#4a6cf7';
                                    e.currentTarget.style.background = '#f0f4ff';
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.background = '#fafbfc';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.background = '#fafbfc';
                                    
                                    const files = e.dataTransfer.files;
                                    if (files && files.length > 0) {
                                        const fileNames: string[] = [];
                                        for (let i = 0; i < files.length; i++) {
                                            fileNames.push(files[i].name);
                                        }
                                        setFormData({
                                            ...formData,
                                            attachments: [...formData.attachments, ...fileNames]
                                        });
                                    }
                                }}
                                onClick={() => {
                                    // Trigger file input via click
                                    document.getElementById('fileInput')?.click();
                                }}
                            >
                                <span style={{ fontSize: '28px' }}>📎</span>
                                <span style={{ fontSize: '14px', color: '#555' }}>
                                    Drag & Drop files here
                                </span>
                                <span style={{ fontSize: '13px', color: '#999' }}>
                                    or <span style={{ color: '#4a6cf7', fontWeight: 500, textDecoration: 'underline' }}>browse from device</span>
                                </span>
                                
                                <input
                                    id="fileInput"
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;
                                        const fileNames: string[] = [];
                                        for (let i = 0; i < files.length; i++) {
                                            fileNames.push(files[i].name);
                                        }
                                        setFormData({
                                            ...formData,
                                            attachments: [...formData.attachments, ...fileNames]
                                        });
                                        e.target.value = '';
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                       {/* ===== CHECK LIST (0/0 DI BAWAH) ===== */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ 
                                fontSize: '13px', 
                                fontWeight: 500, 
                                color: '#555',
                                display: 'block',
                                marginBottom: '2px',
                            }}>
                                Check List
                            </label>
                            
                            <div style={{ 
                                fontSize: '12px', 
                                color: '#999',
                                marginBottom: '6px',
                            }}>
                                0/0
                            </div>
                            
                            {/* GARIS PEMISAH WARNA BIRU */}
                            <div style={{
                                borderBottom: '2px solid #4a6cf7',
                            }} />
                        </div>

                        {/* ===== BUTTON ADD TASK ===== */}
                        <IonButton 
                            expand="block" 
                            fill="outline"
                            onClick={handleSaveTask}
                            style={{
                                '--border-color': '#4a6cf7',
                                '--color': '#4a6cf7',
                                '--border-radius': '8px',
                                '--border-width': '2px',
                                height: '48px',
                                fontSize: '15px',
                                fontWeight: 600,
                                textTransform: 'none',
                                marginTop: '8px',
                                marginBottom: '20px',  // ← TAMBAHKAN JARAK KE BAWAH
                            }}
                        >
                            + Add Task
                        </IonButton>

                        {/* ===== ACTIVITY ===== */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ 
                                fontSize: '13px', 
                                fontWeight: 500, 
                                color: '#555',
                                display: 'block',
                                marginBottom: '4px',
                            }}>
                                Activity
                            </label>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#999', 
                                padding: '8px 0',
                                borderBottom: '1px solid #f0f0f0',
                            }}>
                              
                            </div>
                        </div>

                        {/* BUTTONS (KECIL DI KANAN) */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                            <IonButton 
                                fill="clear"
                                onClick={() => setIsAddModalOpen(false)}
                                style={{
                                    '--color': '#666',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    height: '36px',
                                    fontSize: '14px',
                                    margin: 0,
                                }}
                            >
                                Discard
                            </IonButton>
                            <IonButton 
                                fill="solid"
                                color="primary"
                                onClick={handleSaveTask}
                                style={{
                                    '--border-radius': '8px',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    height: '36px',
                                    fontSize: '14px',
                                    margin: 0,
                                }}
                            >
                                Save
                            </IonButton>
                        </div>
                    </div>
                </IonModal>
                {/* TOAST */}
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                    position="bottom"
                />
            </IonContent>
        </IonPage>
    );
};

export default Board;