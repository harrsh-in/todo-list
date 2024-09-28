"use client";

import axios from "axios";
import moment from "moment-timezone";
import { useState } from "react";

const TaskForm = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    startTime: "",
    timezone: moment.tz.guess(),
    recurrence: "",
  });

  const handleChangeTaskData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(taskData);

    // TODO: Validate inputs later
    await axios.post("http://localhost:3000/api/create-task", taskData);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-1/3 border border-gray-500"
      >
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          onChange={handleChangeTaskData}
        />

        <input
          type="text"
          id="description"
          name="description"
          placeholder="Description"
          onChange={handleChangeTaskData}
        />

        <input
          type="datetime-local"
          name="startTime"
          id="startTime"
          onChange={handleChangeTaskData}
        />

        <input
          type="text"
          name="recurrence"
          id="recurrence"
          onChange={handleChangeTaskData}
          placeholder="* * * * * *"
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default TaskForm;
