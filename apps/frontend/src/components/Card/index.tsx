import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  isFullWidth?: boolean;
}
const Card = ({ children, className, isFullWidth = false }: CardProps) => {
  const containerClasses = isFullWidth
    ? "w-full max-w-none px-4 sm:px-6 lg:px-8"
    : "mx-auto max-w-md";

  return (
    <div className={`mt-4 animate-fade-in ${containerClasses} ${className}`}>
      <div className="p-8 rounded-xl glass-card glass-card-hover">
        {children}
      </div>
    </div>
  );
};

export default Card;
