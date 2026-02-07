import React, { useState } from "react";
import "./styles/TopControl.css";
import InputBox from "./sharedComponents/InputBox";
import NewProjectButton from "./sharedComponents/NewProjectButton";
import Modal from "./sharedComponents/Modal";
import NewProjectForm from "./sharedComponents/NewProjectForm";


type TopControlProps = {
  onSearch: (searchText: string) => void;
  onCreated?: () => void;
};

const TopControl: React.FC<TopControlProps> = ({ onSearch, onCreated }) => {
  
  const [modalOpen, setModalOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  }

  return (
    <div className="TopControl-container">
      <InputBox placeholder="Search across Projects" onChange={handleInputChange} />

      {/* Modal with hardCode data as of now */}
      <NewProjectButton onClick={() => setModalOpen(true)} />

      {/* Model to Create a new Project */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Project"
      >
        <NewProjectForm
          onDismiss={() => setModalOpen(false)}
          onCreated={onCreated}
        />
      </Modal>
    </div>
  );
};

export default TopControl;
