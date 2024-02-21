import 'firebase/messaging';
import { getMessaging,getToken,onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBBMSr0ywRcDcVMIa-B7yw_eDvSi7wvGfM",
  authDomain: "crimechime-fddd5.firebaseapp.com",
  projectId: "crimechime-fddd5",
  storageBucket: "crimechime-fddd5.appspot.com",
  messagingSenderId: "1055894599370",
  appId: "1:1055894599370:web:4e6b3749ad7b846b3b2633"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// getToken(messaging)
//   .then((currentToken) => {
//     console.log(currentToken)
//     if (currentToken) {
//       console.log('Current FCM token:', currentToken);
//     } else {
//       console.log('No registration token available. Permission is requested automatically.');
//     }
//   })
//   .catch((error) => {
//     console.error('Error getting FCM token:', error);
//   });

// // Handle incoming messages
// onMessage(messaging, (payload) => {
//   console.log('Message received:', payload);
//   // Handle the notification in your app
// });

export { messaging };