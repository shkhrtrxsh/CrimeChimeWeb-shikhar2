import { useEffect } from 'react';
import {messaging} from "src/config/Firebase"; // Import the initialized messaging instance
// import 'firebase/messaging';
import { getMessaging,getToken,onMessage } from 'firebase/messaging';
const PushNotification = () => {
  const getFCMToken = async () => {
    const permissionStatus = await Notification.requestPermission();   
    if (permissionStatus === 'granted') {
      // Get the FCM token
      const currentToken = await getToken(getMessaging());
      // console.log('FCM Token:', currentToken);
    } else {
      console.warn('Notification permission denied');
    }
  };
  useEffect(() => {
    getFCMToken();
  }, []);

  // ... rest of your component

  return (
    <></>
  );
};

export default PushNotification;