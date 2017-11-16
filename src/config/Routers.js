import {Easing,Animated} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Login from '../screens/Login';
import Chat from '../screens/Chat';
import ChatList from '../screens/ChatList';
import FriendList from '../screens/FriendList';
import FriendDetail from '../screens/FriendDetail';
import CreateTeam from '../screens/CreateTeam';
import NewFriend from '../screens/NewFriend';
import RemoveUsers from '../screens/RemoveUsers';
import SessionTeamDetail from '../screens/SessionTeamDetail';
import SessionUserDetail from '../screens/SessionUserDetail';
import SendAddFriend from '../screens/SendAddFriend';
import UpdateTeamName from '../screens/UpdateTeamName';
import SearchScreen from '../screens/SearchScreen';
import SelectUsers from '../screens/SelectUsers';
const MainNavigator = StackNavigator({
        ChatList:{
            key:"index",
            screen: ChatList,
        },
        Chat: {
            screen: Chat,
        },
        FriendList: {
            screen: FriendList,
        },
        FriendDetail: {
            screen: FriendDetail,
        },
        UpdateTeamName: {
            screen: UpdateTeamName,
        },
        NewFriend: {
            screen: NewFriend,
        },
        SendAddFriend: {
            screen: SendAddFriend,
        },
        SessionTeamDetail: {
            screen: SessionTeamDetail,
        },
        SessionUserDetail: {
            screen: SessionUserDetail,
        },

    },
    {
        headerMode: 'float',
        navigationOptions:{
            headerStyle:{
                backgroundColor:"#444"
            },
            headerTitleStyle:{
                color:"#fff"
            },
            headerBackTitleStyle:{
                color:"#fff"
            },
            headerTintColor:"#fff"
        }
    }
);
const AppNavigator = StackNavigator({
    Login: {
        screen: Login,
    },
    Main: { screen: MainNavigator },

    CreateTeam: {
        screen: CreateTeam,
    },
    RemoveUsers: {
        screen: RemoveUsers,
    },
    SearchScreen:{
        screen: SearchScreen,
    },
    SelectUsers:{
        screen: SelectUsers,
    }
}, {

        headerMode: 'none',
        mode: 'modal',
        navigationOptions: {
            gesturesEnabled: false,
        },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 300,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps
                const { index } = scene

                const height = layout.initHeight
                const translateY = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [height, 0, 0],
                })

                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index],
                    outputRange: [0, 1, 1],
                })

                return { opacity, transform: [{ translateY }] }
            },
        }),
    });
export function getCurrentScreen(navigationState) {
    if (!navigationState) {
        return null
    }
    const route = navigationState.routes[navigationState.index]
    if (route.routes) {
        return getCurrentScreen(route)
    }
    return route.routeName
}
export default AppNavigator;