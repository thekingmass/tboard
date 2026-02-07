import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../BoardComponents/ProjectBoard.css";
import { LuCircleArrowLeft } from "react-icons/lu";
import InputBox from "../sharedComponents/InputBox";
import Column from "./Column";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { api } from "../../api";

import { toast } from "sonner";

import type {
  ApiColumn,
  Column as UiColumn,
  ApiTask,
  Task as UiTask,
  Project as UiProject,
  ApiProject,
} from "../../types";

import {
  mapApiTaskToTask,
  mapApiColumnToColumn,
  mapApiProjectToProject,
} from "../../types";

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams<{
    projectId: string;
    name: string;
    description: string;
  }>();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<UiTask[]>([]);
  const [columns, setColumns] = useState<UiColumn[]>([]);
  const [projectData, setProjectData] = useState<UiProject | null>(null);

  const handleTaskCreated = (task: UiTask) => {
    setTasks((prev) => {
      // Avoid duplicates if API returns and UI already has it.
      if (prev.some((t) => t.id === task.id)) return prev;
      return [...prev, task];
    });
  };

  const onDragEnd = async (result: DropResult) => {
    // Handle drag and drop logic here
    console.log(typeof result, "Drag Result:->", result);
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const res = await api.patch("/api/tasks/updateTaskOnDragEnd", { result });

    if (res.status !== 200) {
      toast.error("Failed to move the task");
      return;
    }

    console.log("API Response on Drag End:", res.data);

    setTasks((prevTasks) => {
      // Find the dragged task
      const draggedTask = prevTasks.find((task) => task.id === draggableId);
      if (!draggedTask) return prevTasks;

      // Remove from old position
      let newTasks = prevTasks.filter((task) => task.id !== draggableId);

      // Update the columnId of the dragged task
      const updatedTask = { ...draggedTask, columnId: destination.droppableId };

      // Insert into new position
      newTasks.splice(destination.index, 0, updatedTask);

      return newTasks;
    });
  };

  useEffect(() => {
    if (!projectId) return;

    // Best practice: cancel in-flight requests when projectId changes or component unmounts.
    // This prevents stale responses from overwriting the current project's state.
    const controller = new AbortController();

    (async () => {
      try {
        const [columnsResponse, tasksResponse, projectResponse] =
          await Promise.all([
            api.get<ApiColumn[]>(`/api/projects/columns/${projectId}`, {
              signal: controller.signal,
            }),
            api.get<ApiTask[]>(`/api/projects/tasks/${projectId}`, {
              signal: controller.signal,
            }),
            api.get<ApiProject>(`/api/projects/${projectId}`, {
              signal: controller.signal,
            }),
          ]);

        // map API Column -> UI shape using mapper
        const uiColumns: UiColumn[] = columnsResponse.data
          .map(mapApiColumnToColumn)
          .sort((a, b) => a.order - b.order);
        setColumns(uiColumns);

        // Map API Task -> UI Task using mapper
        const uiTasks: UiTask[] = tasksResponse.data.map(mapApiTaskToTask);
        setTasks(uiTasks);

        // Map Project -> UiProject using mapper
        const projectData: UiProject = mapApiProjectToProject(projectResponse.data);

        setProjectData(projectData);
      } catch (error: any) {
        // Ignore abort/cancel errors (expected during navigation or refresh)
        const name = error?.name ?? error?.code;
        if (
          name === "CanceledError" ||
          name === "ERR_CANCELED" ||
          name === "AbortError"
        ) {
          return;
        }

        console.error("Error fetching columns/tasks:", error);
        console.log("FAILED URL:", error?.config?.url);
        console.log("STATUS:", error?.response?.status);
        console.log("DATA:", error?.response?.data);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [projectId]);

  return (
    <>
      <div className="board-page-container" data-project-id={projectId ?? ""}>
        <div className="boardhead">
          <div className="line1">
            <div className="line1Left">
              <LuCircleArrowLeft
                className="back-icon"
                onClick={() => navigate("/projects")}
              />
              <div className="projectName">
                Title: {projectData?.title ?? "Untitled"}
              </div>
            </div>
            <div className="line1Right">
              <InputBox placeholder="Search tasks..." />
              <img src="https://picsum.photos/200" alt="User Avatar" />
            </div>
          </div>
          <div className="line2">
            {/* Tooltip for the full Description text */}
            <span className="tooltip tooltip-effect-1">
              <span
                className="tooltip-item"
                aria-label="Project description"
                title="Hover to see full description"
              >
                Description:{" "}
                {(projectData?.description ?? "Untitled")
                  .trim()
                  .slice(0, 40)}
                {(projectData?.description ?? "").trim().length > 40
                  ? "…"
                  : ""}
              </span>
              <span className="tooltip-content">
                <span className="tooltip-text">
                  {(projectData?.description ?? "Untitled").trim()}
                </span>
              </span>
            </span>

            {/* <div className="fullDescription">
              <span></span>
            </div> */}
          </div>
        </div>
        <div className="board-content-container">
          {/* to make the tasks of the columns draggable and the columns droppable wrap the whole column component with DragDropContext */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="columns-container">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  id={column.id}
                  projectId={projectId!}
                  title={column.title}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  onTaskCreated={handleTaskCreated}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default ProjectBoard;
