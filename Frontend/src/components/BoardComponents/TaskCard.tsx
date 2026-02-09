// TaskCard.tsx
import React, { useState } from "react";
import type { Priority, Task as UiTask } from "../../types";
import "./TaskCard.css";
import { CiCirclePlus } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Modal from "../sharedComponents/Modal";
import { mapApiTaskToTask } from "../../types";

import { Draggable } from "@hello-pangea/dnd";
import { api } from "../../api";
import { toast } from "sonner";

interface TaskCardProps {
  id: string;
  index: number;
  title: string;
  priority: Priority;
  tags: string[];
  updateUiOnDelete?: (taskId: string) => void;
  updateUiOnTaskUpdate?: (updatedTask: UiTask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  index,
  title,
  priority,
  tags,
  updateUiOnDelete,
  updateUiOnTaskUpdate,
}) => {
  const priorityColor =
    priority === "high"
      ? "#e53e3e"
      : priority === "medium"
        ? "#d69e2e"
        : "#38a169";

  const [isAddTagVisible, setIsAddTagVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form Input States for Edit Task Modal
  const [taskTitle, setTitle] = useState<string>(title);
  const [taskPriority, setTaskPriority] = useState<string>(priority);
  const [taskTags, setTaskTags] = useState<string>(tags.join(", "));

  const handleAddTagButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditModalOpen(false);
    setIsAddTagVisible(true);
  };

  const handleEditTaskClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsAddTagVisible(false);
    setIsEditModalOpen(true);
  };

  const handleTaskDeleteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?",
      );
      if (confirmDelete) {
        // Call API to delete task here
        await api.delete(`/api/tasks/deleteTask/${id}`);
        toast.success("Task deleted successfully");
        console.log("Task deleted with ID:", id);

        // Call onDelete callback to update parent component
        if (updateUiOnDelete) {
          updateUiOnDelete(id);
        }
      } else {
        console.log("Task deletion cancelled.");
      }
      console.log("Delete task with ID:", id);
    } catch (error) {
      console.log("Error deleting task:", error);
      toast.error("Error deleting task:");
    }
  };

  const handleUpdateButtonClick = async () => {
    setIsEditModalOpen(false);

    try {
      const response = await api.patch(`/api/tasks/updateTask/${id}`, {
        title: taskTitle,
        priority: taskPriority,
        tags: taskTags,
      });

      const responseTask = response.data.updateResponse;
      console.log("Task update response:", responseTask);
      // Mapping the updated task from API response to UiTask
      const updatedTask = mapApiTaskToTask(responseTask);
      // Update the UI by informing the parent component
      updateUiOnTaskUpdate && updateUiOnTaskUpdate(updatedTask);

      const responseMessage = response.data.message;
      toast.success(responseMessage);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task:");
    }
  };

  return (
    // make the task card draggable by wrapping it with Draggable component
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          task-data-id={id}
        >
          <div className="task-card-header">
            <div className="task-title">{title}</div>
            <div className="task-card-actions">
              <span
                onClick={handleEditTaskClick}
                className="task-card-edit-icon"
              >
                <MdOutlineEdit />
              </span>
              <span
                onClick={handleTaskDeleteClick}
                className="task-card-delete-icon"
              >
                <MdDeleteForever />
              </span>
            </div>
          </div>

          <div className="task-card-footer">
            <span
              className="task-priority"
              style={{
                backgroundColor: priorityColor,
                color: "white",
                padding: "0.1rem 0.4rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
              }}
            >
              {priority.toUpperCase()}
            </span>

            <div className="task-tags">
              {tags.map((tag) => (
                <span key={tag} className="tags">
                  {tag}
                  <RxCrossCircled className="tag-remove-icon" />
                </span>
              ))}
              <span className="addTagButton">
                <CiCirclePlus onClick={handleAddTagButtonClick} />
              </span>
            </div>
            {/* Add Tag Modal Goes Below */}
            <Modal
              isOpen={isAddTagVisible}
              onClose={() => setIsAddTagVisible(false)}
              title="Add New Tag"
            >
              <div className="addTagmodal-body">
                <form action="" className="addTag-form modal-form">
                  <input type="text" placeholder="Enter tag name" />
                  <button onClick={() => {}}>Add Tag</button>
                </form>
              </div>
            </Modal>
          </div>
          {/* Edit Task Modal Goes Below */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit Task"
          >
            <div className="editTaskModal-body">
              <form action="" className="editTask-form modal-form">
                <label htmlFor="edit-task-title">Task Title</label>
                <input
                  type="text"
                  id="edit-task-title"
                  value={taskTitle}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(event.target.value);
                  }}
                />
                <label htmlFor="edit-task-priority">Task Priority</label>
                <select
                  name="edit-task-priority"
                  id="edit-task-priority"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <label htmlFor="edit-task-tags">Task Tags</label>
                <input
                  type="text"
                  id="edit-task-tags"
                  value={taskTags}
                  onChange={(e) => setTaskTags(e.target.value)}
                />
                <button type="button" onClick={handleUpdateButtonClick}>
                  Update Task
                </button>
              </form>
            </div>
          </Modal>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
