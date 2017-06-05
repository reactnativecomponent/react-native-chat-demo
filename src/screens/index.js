import { Navigation } from 'react-native-navigation';

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

export default function () {
    Navigation.registerComponent('ImDemo.Login', () => Login);
    Navigation.registerComponent('ImDemo.Chat', () => Chat);
    Navigation.registerComponent('ImDemo.ChatList', () => ChatList);
    Navigation.registerComponent('ImDemo.FriendList', () => FriendList);
    Navigation.registerComponent('ImDemo.FriendDetail', () => FriendDetail);
    Navigation.registerComponent('ImDemo.CreateTeam', () => CreateTeam);
    Navigation.registerComponent('ImDemo.NewFriend', () => NewFriend);
    Navigation.registerComponent('ImDemo.RemoveUsers', () => RemoveUsers);
    Navigation.registerComponent('ImDemo.SessionTeamDetail', () => SessionTeamDetail);
    Navigation.registerComponent('ImDemo.SessionUserDetail', () => SessionUserDetail);
    Navigation.registerComponent('ImDemo.SendAddFriend', () => SendAddFriend);
    Navigation.registerComponent('ImDemo.UpdateTeamName', () => UpdateTeamName);
    Navigation.registerComponent('ImDemo.SearchScreen', () => SearchScreen);
    Navigation.registerComponent('ImDemo.SelectUsers', () => SelectUsers);

}