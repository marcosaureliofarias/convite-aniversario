import React, { useState, useEffect } from 'react';
import { CheckCircle, Save, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'save';
  duration?: number;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'save':
        return <Save className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getClasses = () => {
    const base = "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${base} bg-green-50 border-green-200 text-green-800`;
      case 'save':
        return `${base} bg-blue-50 border-blue-200 text-blue-800`;
      case 'error':
        return `${base} bg-red-50 border-red-200 text-red-800`;
      case 'info':
        return `${base} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${base} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  return (
    <div className={getClasses()}>
      {getIcon()}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-current hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

// Hook para gerenciar notificações
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'save';
    duration?: number;
  }>>([]);

  const addNotification = (
    message: string, 
    type: 'success' | 'error' | 'info' | 'save' = 'info',
    duration?: number
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer: React.FC = () => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );

  return {
    addNotification,
    removeNotification,
    NotificationContainer
  };
};
