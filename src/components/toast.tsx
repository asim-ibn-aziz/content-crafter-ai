"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { X, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ToastType = "success" | "error" | "info" | "loading";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 1000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const updateToast = (id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast))
    );
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, updateToast }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "loading":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "loading":
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
      default:
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case "success":
        return "text-green-800 dark:text-green-200";
      case "error":
        return "text-red-800 dark:text-red-200";
      case "info":
        return "text-blue-800 dark:text-blue-200";
      case "loading":
        return "text-gray-800 dark:text-gray-200";
      default:
        return "text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div
      className={`
        ${getBackgroundColor()}
        ${getTextColor()}
        border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]
        transform transition-all duration-300 ease-in-out
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm opacity-90 mt-1">{toast.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Convenience functions for common toast types
export function useToastHelpers() {
  const { addToast, updateToast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    return addToast({ type: "success", title, description });
  };

  const showError = (title: string, description?: string) => {
    return addToast({ type: "error", title, description });
  };

  const showInfo = (title: string, description?: string) => {
    return addToast({ type: "info", title, description });
  };

  const showLoading = (title: string, description?: string) => {
    return addToast({ type: "loading", title, description, duration: 0 });
  };

  const hideLoading = (
    id: string,
    successTitle: string,
    successDescription?: string
  ) => {
    updateToast(id, {
      type: "success",
      title: successTitle,
      description: successDescription,
      duration: 1000,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showLoading,
    hideLoading,
  };
}
