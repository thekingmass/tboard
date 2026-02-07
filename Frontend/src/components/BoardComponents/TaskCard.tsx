// TaskCard.tsx
import React, { useState } from "react";
import type { Priority } from "../../types";
import "./TaskCard.css";
import { CiCirclePlus } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import Modal from "../sharedComponents/Modal";

import { Draggable } from "@hello-pangea/dnd";

interface TaskCardProps {
  id: string;
  index: number;
  title: string;
  priority: Priority;
  tags: string[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  index,
  title,
  priority,
  tags,
}) => {
  const priorityColor =
    priority === "high"
      ? "#e53e3e"
      : priority === "medium"
      ? "#d69e2e"
      : "#38a169";

  const [isAddTagVisible, setIsAddTagVisible] = useState(false);

  return (
    // make the task card draggable by wrapping it with Draggable component
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-card-header">
            <span className="task-title">{title}</span>
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
