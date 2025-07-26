import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json'; // must match top-level "name"
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background Message:', remoteMessage);
});

messaging().onMessage(async remoteMessage => {
  console.log('📩 Foreground Message:', remoteMessage);
});

AppRegistry.registerComponent('main', () => App); // ✅ THIS IS THE ENTRY POINT FOR EXPO DEV CLIENT


