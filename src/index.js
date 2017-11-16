import React,{
	Component
} from 'react';
import {Platform,View,BackHandler,StatusBar} from 'react-native';
import AppNavigator,{getCurrentScreen} from './config/Routers';
import {NavigationActions,addNavigationHelpers} from 'react-navigation';
import { Theme } from "native-base-shoutem-theme";
import getTheme from '../native-base-theme/components';
import theme from './themes';
export default class App extends Component{

    componentWillMount() {
        Theme.setDefaultThemeStyle(getTheme(theme));
        BackHandler.addEventListener('hardwareBackPress', this.backHandle)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
    }

    backHandle = () => {
        const currentScreen = getCurrentScreen(this.props.router)
        if (currentScreen === 'Login') {
            return true
        }
        if (currentScreen !== 'Home') {
            this.props.dispatch(NavigationActions.back())
            return true
        }
        return false
    }

    render() {
        // const { dispatch, router } = this.props
        // const navigation = addNavigationHelpers({ dispatch, state: router })
        return (<View style={{flex:1}}>
            <StatusBar backgroundColor="black"
                       barStyle="light-content"/>
            <AppNavigator />
        </View>)
    }
}
