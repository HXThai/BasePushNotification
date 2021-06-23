// import 'react-native-gesture-handler';
import * as React from 'react';
import {View, Text} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import AppNavigation from './src/Navigation/AppNavigation';
// import {StatusBar} from 'react-native';
// import {Provider} from 'react-redux';
// import store from './src/Redux/index';
// if (__DEV__) {
//   import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
// }
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification from 'react-native-push-notification';
// import Firebase from '@react-native-firebase/app';
// import reactotron from 'reactotron-react-native';

export default class App extends React.Component {
  componentDidMount() {
    if (!messaging().hasPermission()) {
      messaging().requestPermission();
    }

    PushNotification.createChannel(
      {
        channelId: 'channel-id', // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    //Click Notification
    PushNotification.configure({
      onNotification(notification) {
        const clicked = notification.userInteraction;
        if (clicked) {
          const newData = {...notification};
          newData.data.data = JSON.parse(newData.data.data);
          apiClickNotification(newData.data.notification_code);
          Linking.openURL(
            `ceoaff://DetailNotification?passData=${JSON.stringify(
              newData,
            )}&notification_code=${newData.data.notification_code}`,
          );
        }
      },
    });
    // reactotron.log('thai')

    //Listen background hander
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (Platform.OS == 'android') {
        PushNotification.localNotification({
          channelId: 'channel-id',
          message: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          bigPictureUrl: remoteMessage.notification.android.imageUrl,
          smallIcon: remoteMessage.notification.android.imageUrl,
          userInfo: remoteMessage.data,
        });
      } else {
        PushNotificationIOS.addNotificationRequest({
          id: remoteMessage.messageId,
          body: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          userInfo: remoteMessage.data,
        });
      }
    });
    //Recieve notification
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('thaiiiiiiii', remoteMessage);
      if (Platform.OS == 'android') {
        PushNotification.localNotification({
          channelId: 'channel-id',
          message: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          bigPictureUrl: remoteMessage.notification.android.imageUrl,
          smallIcon: remoteMessage.notification.android.imageUrl,
          userInfo: remoteMessage.data,
        });
      } else {
        PushNotificationIOS.addNotificationRequest({
          id: remoteMessage.messageId,
          body: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          userInfo: remoteMessage.data,
        });
      }
    });

    messaging()
      .getToken()
      .then(res => {
        console.log(res);
      });
    // reactotron.log('thai meooooff');
    return unsubscribe;
  }

  render() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text>Test push notification</Text>
      </View>
    );
  }
}

import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
