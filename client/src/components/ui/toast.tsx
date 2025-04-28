import React from "react";

export interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ToastActionElement = React.ReactElement;

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  action,
  open,
  onOpenChange,
}) => {
  if (!open) return null;

  return (
    <div className="toast">
      <div className="toast-header">
        <strong>{title}</strong>
        {action && <div className="toast-action">{action}</div>}
      </div>
      {description && <div className="toast-body">{description}</div>}
      <button onClick={() => onOpenChange?.(false)}>Close</button>
    </div>
  );
};

export default Toast;
