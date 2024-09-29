'use client';

import axios from '@/lib/axios';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

const CreateTaskForm = () => {
    const { mutate } = useMutation({
        mutationKey: ['createTask'],
        mutationFn: fetchTasks,
    });
    return (
        <div>
            <Button variant="outlined" onClick={() => mutate()}>
                Create Task
            </Button>
        </div>
    );
};

export default CreateTaskForm;

const fetchTasks = async () => {
    return await axios.post('/task/create', {
        title: 'Task 1',
        dateTime: '2024-10-23T14:00:00Z',
        timezone: 'Asia/Kolkata',
        notifications: [
            {
                value: 10,
                unit: 'days',
            },
            {
                value: 1,
                unit: 'days',
            },
        ],
    });
};
