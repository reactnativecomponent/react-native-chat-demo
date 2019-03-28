/*
 * 初始化界面
 * @Author: huangjun
 * @Date: 2018-10-10 16:42:42
 * @Last Modified by: huangjun
 * @Last Modified time: 2019-03-26 14:45:19
 */
import React, { Component } from 'react'
import { View } from 'react-native'
import { Theme } from 'native-base-shoutem-theme'
import getTheme from '../native-base-theme/components'
import platform from '../native-base-theme/variables/platform'
import AppNavigator from './screens'

export default class App  extends Component{
  constructor(props) {
    super(props)
    Theme.setDefaultThemeStyle(getTheme(platform))
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppNavigator />
      </View>
    )
  }
}
