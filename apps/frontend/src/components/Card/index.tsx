import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}
const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`mx-auto mt-4 max-w-md animate-fade-in ${className}`}>
      <div className="p-8 rounded-xl glass-card glass-card-hover">
        {children}
      </div>
    </div>
  );
};

export default Card;
