/*
 * @Descripttion: 云信RN示例
 * @Author: huangjun
 * @Date: 2020-10-15 16:36:54
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:02:55
 */

import 'react-native-gesture-handler';
import {AppRegistry, YellowBox} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);
AppRegistry.registerComponent(appName, () => App);
