interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/50"
        onClick={onClose}
      />
      <div className="relative p-6 mx-4 w-full max-w-md rounded-2xl border shadow-2xl backdrop-blur-xl bg-white/90 border-white/30">
        <div className="mb-6 text-center">
          {icon && (
            <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-2xl backdrop-blur-sm bg-red-50/80">
              {icon}
            </div>
          )}
          <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 font-medium text-gray-700 rounded-xl border border-gray-300 transition-all duration-200 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 font-medium text-white bg-red-500 rounded-xl transition-all duration-200 hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
