import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { patientAPI } from '../api/services';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Metro flag: true in dev builds (Expo Go, EAS dev), false in release/TestFlight/App Store.
// APNs uses sandbox for dev-signed builds, production otherwise.
const APNS_ENV: 'production' | 'sandbox' = __DEV__ ? 'sandbox' : 'production';

export function usePushRegistration(patientId: number | null) {
  useEffect(() => {
    if (!patientId) return;
    if (Platform.OS !== 'ios') return; // backend only wires APNs today

    let cancelled = false;

    (async () => {
      try {
        const existing = await Notifications.getPermissionsAsync();
        let status = existing.status;
        if (status !== 'granted') {
          const req = await Notifications.requestPermissionsAsync({
            ios: { allowAlert: true, allowBadge: true, allowSound: true },
          });
          status = req.status;
        }
        if (status !== 'granted') return;

        // getDevicePushTokenAsync returns the raw APNs token — what the backend needs.
        // getExpoPushTokenAsync would route via Expo's servers and doesn't match our APNs code.
        const { data: token } = await Notifications.getDevicePushTokenAsync();
        if (!token || cancelled) return;

        await patientAPI.registerPushToken(patientId, token, APNS_ENV);
      } catch (err) {
        console.warn('Push registration failed:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patientId]);
}
