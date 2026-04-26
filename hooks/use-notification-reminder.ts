import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function requestPermissions() {
  if (!Device.isDevice) return false;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

async function scheduleReminderNotification() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trigger: any = {
    type: 'interval' as const,
    repeats: true,
    seconds: 300,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Open Femmmy',
      body: 'Don\'t forget to track your cycle today!',
    },
    trigger,
  });
}

export function useNotificationReminder() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notificationListener = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseListener = useRef<any>(null);

  useEffect(() => {
    requestPermissions().then((hasPermission) => {
      if (hasPermission) {
        scheduleReminderNotification();
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {});
    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {});

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
}