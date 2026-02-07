import React, { useState } from "react";
import "./NewProjectForm.css";

import { api } from "../../api";
import { TITLE_MAX_LEN } from "../../types"
import { DESCRIPTION_MAX_LEN } from "../../types";
import { toast } from "sonner";

interface NewProjectFormProps {
  onDismiss: () => void;
  onCreated?: () => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({
  onDismiss,
  onCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");

  const onChangeProjectTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
  };

  const onChangeProjectDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setProjectDescription(e.target.value);
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = projectTitle.trim();
    const description = projectDescription.trim();

    if (!title || !description) {
      setSubmitError("Please fill in title and description.");
      return;
    }

    if(title.length > TITLE_MAX_LEN) {
      toast.error(`Title cannot exceed ${TITLE_MAX_LEN} characters.`);
      return;
    }

    if(description.length > DESCRIPTION_MAX_LEN) {
      toast.error(`Description cannot exceed ${DESCRIPTION_MAX_LEN} characters.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.post("/api/projects/createNewProject", {
        title,
        description,
        totalTasks: 0,
        openTasks: 0,
      });

      // Reset local state
      setProjectTitle("");
      setProjectDescription("");

      // Let parent know something was created so it can refresh
      onCreated?.();

      onDismiss();
    } catch (err) {
      console.error("Error creating project:", err);
      setSubmitError("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="NewProjectForm" onSubmit={handleCreateProject}>
      <div className="formFields">
        <input
          type="text"
          placeholder="Project Title"
          value={projectTitle}
          onChange={onChangeProjectTitle}
          required
        />
        <textarea
          maxLength={DESCRIPTION_MAX_LEN}
          placeholder="Project Description"
          value={projectDescription}
          onChange={onChangeProjectDescription}
          required
        />
      </div>

      {submitError && (
        <p style={{ color: "#b42318", margin: "0", textAlign: "left" }}>
          {submitError}
        </p>
      )}

      <div className="form-buttons">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </button>
        <button type="button" onClick={onDismiss} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewProjectForm;
