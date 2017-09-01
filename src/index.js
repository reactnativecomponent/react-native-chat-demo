import React,{
	Component
} from 'react';
import registerScreens from './screens';
import {Navigation} from 'react-native-navigation';
import { Theme } from "native-base-shoutem-theme";
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
registerScreens();

const navigatorStyle = {
	drawUnderNavBar:true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white',
	statusBarTextColorScheme: 'light',
	statusBarColor:'#fff',
};
export default class App extends Component{
	constructor(props) {
		super(props);
		this.initial();
        Theme.setDefaultThemeStyle(getTheme(platform));

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
			},
			appleStyle:{
                statusBarColor:'#fff',
			}
		});
	}
}
