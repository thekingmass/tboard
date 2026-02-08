// TaskCard.tsx
import React, { useState } from "react";
import type { Priority } from "../../types";
import "./TaskCard.css";
import { CiCirclePlus } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Modal from "../sharedComponents/Modal";

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
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  index,
  title,
  priority,
  tags,
  updateUiOnDelete
}) => {
  const priorityColor =
    priority === "high"
      ? "#e53e3e"
      : priority === "medium"
        ? "#d69e2e"
        : "#38a169";

  const [isAddTagVisible, setIsAddTagVisible] = useState(false);

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
              <span className="task-card-edit-icon">
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
                <CiCirclePlus onClick={() => setIsAddTagVisible(true)} />
              </span>
            </div>
            <Modal
              isOpen={isAddTagVisible}
              onClose={() => setIsAddTagVisible(false)}
              title="Add New Tag"
            >
              <div className="addTagmodal-body">
                <form action="" className="addTag-form">
                  <input type="text" placeholder="Enter tag name" />
                  <button onClick={() => {}}>Add Tag</button>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
