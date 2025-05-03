import { useEffect, useCallback } from 'react';
import { Task } from '../types';

export const useNotifications = (tasks: Task[]) => {
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  }, []);

  const checkDueTasks = useCallback(() => {
    const now = new Date();
    tasks.forEach(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        
        // Notify 1 hour before due time
        if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000) {
          showNotification(
            'Task Due Soon!',
            `"${task.title}" is due in less than an hour!`
          );
        }
        // Notify when task is overdue
        else if (timeDiff < 0 && timeDiff > -60 * 1000) { // Just became overdue
          showNotification(
            'Task Overdue!',
            `"${task.title}" is now overdue!`
          );
        }
      }
    });
  }, [tasks, showNotification]);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  useEffect(() => {
    const interval = setInterval(checkDueTasks, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [checkDueTasks]);

  return {
    requestNotificationPermission,
    showNotification
  };
};

export default useNotifications;