import React,{
	Component
} from 'react';
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
					navBarBackgroundColor:'#444',
					navBarHidden:true
				}
			}
		});
	}
}
