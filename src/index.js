import React,{
	Component
} from 'react';
import {Platform,NativeModules,Modal,StyleSheet} from 'react-native';
import registerScreens from './screens';
import {Navigation} from 'react-native-navigation';


registerScreens();

const navigatorStyle = {
	drawUnderNavBar:true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white',
	statusBarTextColorScheme: 'light',
	statusBarColor:'#000',


};
export default class App extends Component{
	constructor(props) {
		super(props);
		this.initial();
	}
	initial(){
		Navigation.startSingleScreenApp({
			screen: {
				screen: 'ImDemo.Login',
				title: '登录',
				navigatorStyle: {
					...navigatorStyle,
					statusBarTextColorScheme: 'dark',
					navBarBackgroundColor:'#fc513a',
					navBarHidden:true
				}
			}
		});
	}
}
