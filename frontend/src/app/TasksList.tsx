'use client';

import { Task, useTask } from '@/contexts/TaskContext';
import axios from '@/lib/axios';
import { Meta } from '@/lib/interfaces';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const TasksList = () => {
    const { tasks, handleSetTasks } = useTask();
    const { isLoading, data } = useQuery({
        queryKey: ['tasks'],
        queryFn: fetchTasks,
    });

    useEffect(() => {
        if (data) {
            console.log(data.tasks);
            handleSetTasks(data.tasks);
        }
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {tasks.map((task) => (
                <div key={task.id}>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                </div>
            ))}
        </div>
    );
};

export default TasksList;

const fetchTasks = async () => {
    return (await axios.get('/task/list')) as unknown as {
        tasks: Task[];
        meta: Meta;
    };
};
