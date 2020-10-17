/*
 * @Descripttion: 云信im示例
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-16 11:16:33
 */

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './screens';

export default function app() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
