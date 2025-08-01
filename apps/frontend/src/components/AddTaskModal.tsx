import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Input,
  // Textarea,
} from "@heroui/modal";

interface Task {
  title: string;
  description: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onTaskChange: (task: Task) => void;
  onAddTask: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  // task,
  // onTaskChange,
  // onAddTask,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add New Task</ModalHeader>
        <ModalBody>
          {/* <Input
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={(e) => onTaskChange({ ...task, title: e.target.value })}
            className="mb-4"
          /> */}
          {/* <Textarea
            placeholder="Task description (optional)"
            value={task.description}
            onChange={(e) =>
              onTaskChange({ ...task, description: e.target.value })
            }
            className="resize-none"
            rows={3}
          /> */}
        </ModalBody>
        <ModalFooter>
          {/* <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={onAddTask}>
            Add Task
          </Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
