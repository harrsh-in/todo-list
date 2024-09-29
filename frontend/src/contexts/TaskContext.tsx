'use client';

import { RecurrenceType, TaskExecutionStatus } from '@/lib/enum';
import { createContext, ReactNode, useContext, useState } from 'react';

export interface Task {
    id: string;
    status: TaskExecutionStatus;
    taskId: string;
    title: string;
    description: string;
    timezone: string;
    recurrenceType: RecurrenceType | null;
    recurrenceRule: string | null;
    taskTime: Date;
    completedAt: Date | null;
}

interface TaskContextType {
    tasks: Task[];
    handleSetTasks: (newTasks: Task[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const handleSetTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
    };

    return (
        <TaskContext.Provider value={{ tasks, handleSetTasks }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};
