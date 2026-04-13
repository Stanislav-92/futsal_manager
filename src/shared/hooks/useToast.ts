import { useState } from 'react';

type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  message: string;
  severity: ToastSeverity;
}

export const useToast = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, severity: ToastSeverity = 'success') => {
    setToast({ message, severity });
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
};
