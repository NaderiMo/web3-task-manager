import { Plus } from "lucide-react";

const AddTaskButton = ({ onclick }: { onclick: () => void }) => {
  return (
    <button onClick={onclick} className="btn-primary">
      <div className="btn-content">
        <Plus className="w-4 h-4" />
        Add Task
      </div>
    </button>
  );
};

export default AddTaskButton;
