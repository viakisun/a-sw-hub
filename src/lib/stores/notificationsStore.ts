import { writable, derived, get } from 'svelte/store';
import type { Notification } from '$lib/types';
import { nanoid } from 'nanoid';
import { getCurrentUser } from '$lib/data/mockUsers';

interface NotificationsState {
  notifications: Notification[];
  showToast: boolean;
  toastNotification: Notification | null;
}

const initialState: NotificationsState = {
  notifications: [],
  showToast: false,
  toastNotification: null,
};

function createNotificationsStore() {
  const { subscribe, set, update } = writable<NotificationsState>(initialState);

  // Auto-generate notifications interval
  let notificationInterval: ReturnType<typeof setInterval> | null = null;

  const notificationTemplates = [
    {
      type: 'success' as const,
      title: 'Build Completed',
      messages: [
        'Build #1234 completed successfully',
        'Deployment to staging successful',
        'All tests passed for SmartFarm project',
      ],
    },
    {
      type: 'error' as const,
      title: 'Build Failed',
      messages: [
        'Build #1235 failed - check logs',
        'Deployment to production failed',
        'Security scan found vulnerabilities',
      ],
    },
    {
      type: 'warning' as const,
      title: 'Approval Required',
      messages: [
        'Urgent approval needed for production deployment',
        'Your review is requested for PR #456',
        'Configuration change requires approval',
      ],
    },
    {
      type: 'info' as const,
      title: 'System Update',
      messages: [
        'New version of CropManager available',
        'Scheduled maintenance tonight at 2 AM',
        'Project analytics report ready',
      ],
    },
  ];

  return {
    subscribe,

    // Add a notification
    addNotification: (
      type: 'info' | 'success' | 'warning' | 'error',
      title: string,
      message: string,
      actionUrl?: string
    ) => {
      const notification: Notification = {
        id: nanoid(),
        type,
        title,
        message,
        read: false,
        createdAt: new Date(),
        userId: getCurrentUser().id,
        actionUrl,
      };

      update((state) => ({
        ...state,
        notifications: [notification, ...state.notifications],
        showToast: true,
        toastNotification: notification,
      }));

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        update((state) => ({
          ...state,
          showToast: false,
          toastNotification: null,
        }));
      }, 5000);
    },

    // Mark as read
    markAsRead: (notificationId: string) => {
      update((state) => ({
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    },

    // Mark all as read
    markAllAsRead: () => {
      update((state) => ({
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    },

    // Delete notification
    deleteNotification: (notificationId: string) => {
      update((state) => ({
        ...state,
        notifications: state.notifications.filter((n) => n.id !== notificationId),
      }));
    },

    // Clear all notifications
    clearAll: () => {
      update((state) => ({
        ...state,
        notifications: [],
      }));
    },

    // Hide toast
    hideToast: () => {
      update((state) => ({
        ...state,
        showToast: false,
        toastNotification: null,
      }));
    },

    // Start auto-generating notifications
    startAutoNotifications: () => {
      if (notificationInterval) return;

      // Generate initial notifications
      const store = get({ subscribe });
      for (let i = 0; i < 3; i++) {
        const template =
          notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
        const message = template.messages[Math.floor(Math.random() * template.messages.length)];

        const notification: Notification = {
          id: nanoid(),
          type: template.type,
          title: template.title,
          message,
          read: false,
          createdAt: new Date(Date.now() - Math.random() * 3600000), // Within last hour
          userId: getCurrentUser().id,
        };

        update((state) => ({
          ...state,
          notifications: [...state.notifications, notification],
        }));
      }

      // Generate new notifications periodically
      notificationInterval = setInterval(
        () => {
          const template =
            notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
          const message = template.messages[Math.floor(Math.random() * template.messages.length)];

          const notification: Notification = {
            id: nanoid(),
            type: template.type,
            title: template.title,
            message,
            read: false,
            createdAt: new Date(),
            userId: getCurrentUser().id,
          };

          update((state) => ({
            ...state,
            notifications: [notification, ...state.notifications],
            showToast: true,
            toastNotification: notification,
          }));

          // Auto-hide toast after 5 seconds
          setTimeout(() => {
            update((state) => ({
              ...state,
              showToast: false,
              toastNotification: null,
            }));
          }, 5000);
        },
        30000 + Math.random() * 30000
      ); // Every 30-60 seconds
    },

    // Stop auto-generating notifications
    stopAutoNotifications: () => {
      if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
      }
    },
  };
}

export const notificationsStore = createNotificationsStore();

// Derived stores
export const unreadNotifications = derived(notificationsStore, ($store) =>
  $store.notifications.filter((n) => !n.read)
);

export const unreadCount = derived(unreadNotifications, ($unread) => $unread.length);

export const recentNotifications = derived(notificationsStore, ($store) => {
  const oneHourAgo = new Date(Date.now() - 3600000);
  return $store.notifications.filter((n) => n.createdAt > oneHourAgo);
});

export const notificationsByType = derived(notificationsStore, ($store) => {
  const grouped = {
    info: [] as Notification[],
    success: [] as Notification[],
    warning: [] as Notification[],
    error: [] as Notification[],
  };

  $store.notifications.forEach((n) => {
    grouped[n.type].push(n);
  });

  return grouped;
});
