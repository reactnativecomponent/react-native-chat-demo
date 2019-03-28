/*
 * @导航
 * @Author: huangjun
 * @Date: 2018-10-10 16:21:43
 * @Last Modified by: huangjun
 * @Last Modified time: 2019-03-27 14:29:29
 */
import { Platform } from 'react-native'
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation'
import { StackViewStyleInterpolator } from 'react-navigation-stack'

import Login from './Login'
import Chat from './Chat'
import ChatList from './ChatList'
import FriendList from './FriendList'
import FriendDetail from './FriendDetail'
import CreateTeam from './CreateTeam'
import NewFriend from './NewFriend'
import RemoveUsers from './RemoveUsers'
import SessionTeamDetail from './SessionTeamDetail'
import SessionUserDetail from './SessionUserDetail'
import SendAddFriend from './SendAddFriend'
import UpdateTeamName from './UpdateTeamName'
import SearchScreen from './SearchScreen'
import SelectUsers from './SelectUsers'
import LocationPicker from './LocationPicker'
import LocationView from './LocationView'

const MainStack = createStackNavigator({
  ChatList,
  FriendList,
  FriendDetail,
  Chat,
  NewFriend,
  RemoveUsers,
  SessionTeamDetail,
  SessionUserDetail,
  SendAddFriend,
  UpdateTeamName,

  SelectUsers,
  LocationPicker,
  LocationView,
}, {
  headerMode: Platform.OS === 'ios' && 'float',
  headerTransitionPreset: 'uikit',
  headerLayoutPreset: 'center',
  defaultNavigationOptions: {
    // headerTransparent: true,
    // headerTintColor: '#fff',
    // headerStyle: {
    //   backgroundColor: 'rgba(0,0,0,0.8)',
    // },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
  transitionConfig: () => ({ screenInterpolator: StackViewStyleInterpolator.forHorizontal }),
})
const ModalStack = createStackNavigator({
  MainNavigator: {
    screen: MainStack,
    navigationOptions: {
      header: null,
    },
  },
  SearchScreen,
  CreateTeam,
}, {
  mode: 'modal',
  initialRouteName: 'MainNavigator',
  // headerMode: 'float',
  headerLayoutPreset: 'center',
  headerTransitionPreset: 'uikit',
  defaultNavigationOptions: {
    // headerTransparent: true,
    // headerTintColor: '#fff',
    // headerStyle: {
    //   backgroundColor: 'rgba(0,0,0,0.8)',
    // },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
})

const AppNavigator = createSwitchNavigator({
  Login,
  App: ModalStack,

})

export default createAppContainer(AppNavigator)
