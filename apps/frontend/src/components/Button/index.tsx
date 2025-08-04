import LoadingSpinner from "../Spinner/LoadingSpinner";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "secondary" | "success" | "danger";
  Icon?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const Button = ({
  children,
  onClick,
  variant,
  Icon,
  isLoading,
  isDisabled,
  size = "sm",
}: ButtonProps) => {
  const sizeClasses = {
    sm: "py-2 px-4",
    md: "py-3 px-6",
    lg: "py-4 px-8",
  };

  return (
    <button
      onClick={onClick}
      className={`flex gap-2 items-center btn-${variant} ${isLoading || isDisabled ? "opacity-50 cursor-not-allowed" : ""} ${sizeClasses[size]}`}
      disabled={isLoading || isDisabled}
    >
      {Icon && Icon}
      {isLoading && <LoadingSpinner size="sm" color="white" />}
      {children}
    </button>
  );
};

export default Button;
