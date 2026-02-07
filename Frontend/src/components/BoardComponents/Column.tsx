// Column.tsx
import React, { useState } from "react";
import type { Task, ApiTask, CreateTaskPayload, Priority } from "../../types";
import { mapApiTaskToTask } from "../../types";
import TaskCard from "./TaskCard";
import "./Column.css";
import Modal from "../sharedComponents/Modal";
import { Droppable } from "@hello-pangea/dnd";
import { api } from "../../api";
import { toast } from "sonner";

interface ColumnProps {
  id: string;
  projectId: string;
  title: string;
  tasks: Task[];
  onTaskCreated?: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({
  id,
  projectId,
  title,
  tasks,
  onTaskCreated,
}) => {
  // console.log("tasks in column:", title, tasks);

  const [taskModalOpen, setTaskModal] = useState(false);

  //Form Input Fields - to make it controlled components
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<string>("low");
  const [taskTags, setTaskTags] = useState<string>("");
  const [status, setStatus] = useState<string>("in progress");
  const [newTaskOrder, setNewTaskOrder] = useState<number>(tasks.length);

  const onCreateTaskSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    // Handle task creation logic here
    setTaskModal(false);

    try {
      if (!taskTitle.trim() || !taskPriority.trim()) {
        toast.error("Task and Priority fields are required.");
        return;
      }

      // Build strongly-typed payload
      const payload: CreateTaskPayload = {
        title: taskTitle,
        priority: taskPriority as Priority,
        tags: taskTags,
        status,
        order: newTaskOrder,
        projectId,
        columnId: id,
      };

      // Creating the task in DB via API call — response is { message, task }
      const res = await api.post<{ message: string; task: ApiTask }>("/api/tasks/createTask", payload);

      // Convert API response to UI Task using the mapper
      // Backend returns { message, task }, so we need res.data.task
      if(res){
        toast.success(res.data.message);
      }
      const newTask: Task = mapApiTaskToTask(res.data.task);

      // Update UI immediately (no refresh) by informing the parent.
      onTaskCreated?.(newTask);

      //reset the form fields
      setTaskTitle("");
      setTaskPriority("low");
      setTaskTags("");
      setStatus("in progress");
      setNewTaskOrder(tasks.length + 1);
    } catch (error: any) {
      console.error("Error validating task input:", error);
      toast.error(error.response?.data?.message || "Failed to create task.");
    }
  };

  return (
    <div className="board-column" data-column-id={id}>
      <div className="board-column-header">
        <h2>{title}</h2>
        {/* <span className="task-count">{tasks.length}</span> */}
      </div>

      <div className="add-task-button-container">
        <button onClick={() => setTaskModal(true)}>+ Add Task</button>
      </div>
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModal(false)}
        title="Create A New Task"
      >
        {/* Task creation form goes here */}
        <form className="task-creation-form" onSubmit={onCreateTaskSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              type="text"
              id="task-title"
              name="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="task-priority">Task Priority</label>
            <select
              id="task-priority"
              name="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="task-tags">Task Tags (comma separated)</label>
            <input
              type="text"
              id="task-tags"
              name="taskTags"
              value={taskTags}
              onChange={(e) => setTaskTags(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="create-task-button">
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Tasks list */}
      {/* Make the column Area Droppable where the tasks will be dropped */}
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            className="board-column-body"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                id={task.id}
                index={index}
                title={task.title}
                priority={task.priority}
                tags={task.tags}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
