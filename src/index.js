/*
 * 初始化界面
 * @Author: huangjun
 * @Date: 2018-10-10 16:42:42
 * @Last Modified by: huangjun
 * @Last Modified time: 2018-10-11 10:35:29
 */
import { Navigation } from 'react-native-navigation'
import { Theme } from 'native-base-shoutem-theme'
import getTheme from '../native-base-theme/components'
import platform from '../native-base-theme/variables/platform'
import registerScreens from './screens'

registerScreens()

const navigatorStyle = {
  drawUnderNavBar: true,
  navBarTextColor: 'white',
  navBarButtonColor: 'white',
  statusBarTextColorScheme: 'light',
  statusBarColor: '#fff',
}
export default class App {
  constructor() {
    this.initial()
    Theme.setDefaultThemeStyle(getTheme(platform))
  }
  initial = () => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'ImDemo.Login',
        title: '登录',
        navigatorStyle: {
          ...navigatorStyle,
          navBarBackgroundColor: '#444',
          navBarHidden: true,
        },
      },
      appleStyle: {
        statusBarColor: '#fff',
        statusBarTextColorScheme: 'light',
      },
    })
  }
}
