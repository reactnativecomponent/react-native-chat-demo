/*
 * 初始化界面
 * @Author: huangjun
 * @Date: 2018-10-10 16:42:42
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 15:31:29
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import AppNavigator from './screens';

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <AppNavigator />
      </View>
    );
  }
}
