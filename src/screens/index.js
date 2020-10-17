/*
 * @Descripttion: 路由
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-16 18:17:23
 */

import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './Login';
import Chat from './Chat';
import ChatList from './ChatList';
import FriendList from './FriendList';
import FriendDetail from './FriendDetail';
import CreateTeam from './CreateTeam';
import NewFriend from './NewFriend';
import RemoveUsers from './RemoveUsers';
import SessionTeamDetail from './SessionTeamDetail';
import SessionUserDetail from './SessionUserDetail';
import SendAddFriend from './SendAddFriend';
import UpdateTeamName from './UpdateTeamName';
import SearchScreen from './SearchScreen';
import SelectUsers from './SelectUsers';
import LocationPicker from './LocationPicker';
import LocationView from './LocationView';

const Stack = createStackNavigator();
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        options={{headerTitle: '会话列表'}}
        component={ChatList}
      />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen
        name="FriendList"
        options={{headerTitle: '我的好友'}}
        component={FriendList}
      />
      <Stack.Screen
        name="FriendDetail"
        options={{headerTitle: '个人信息'}}
        component={FriendDetail}
      />
      <Stack.Screen
        name="NewFriend"
        options={{headerTitle: '新的朋友'}}
        component={NewFriend}
      />
      <Stack.Screen
        name="RemoveUsers"
        options={{headerTitle: '移出用户'}}
        component={RemoveUsers}
      />
      <Stack.Screen
        name="SessionTeamDetail"
        options={{headerTitle: '会话详情'}}
        component={SessionTeamDetail}
      />
      <Stack.Screen
        name="SessionUserDetail"
        options={{headerTitle: '会话详情'}}
        component={SessionUserDetail}
      />
      <Stack.Screen
        name="SendAddFriend"
        options={{headerTitle: '添加好友'}}
        component={SendAddFriend}
      />
      <Stack.Screen
        name="UpdateTeamName"
        options={{headerTitle: '修改群组名称'}}
        component={UpdateTeamName}
      />
      <Stack.Screen
        name="SelectUsers"
        options={{headerTitle: '选择用户'}}
        component={SelectUsers}
      />
      <Stack.Screen name="LocationPicker" component={LocationPicker} />
      <Stack.Screen name="LocationView" component={LocationView} />
    </Stack.Navigator>
  );
}
const RootStack = createStackNavigator();

function Root() {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen
        name="Main"
        options={{headerShown: false}}
        component={MainStack}
      />
      <RootStack.Screen
        name="SearchScreen"
        options={{headerShown: false}}
        component={SearchScreen}
      />
      <RootStack.Screen
        name="CreateTeam"
        options={{headerTitle: '创建群组'}}
        component={CreateTeam}
      />
    </RootStack.Navigator>
  );
}

export default Root;
