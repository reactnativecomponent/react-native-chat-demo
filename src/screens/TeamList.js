import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    TouchableOpacity,
    NativeAppEventEmitter,
    ListView,Image
} from 'react-native';
import {Container,Icon,ListItem,Text,Body,Right,Left} from 'native-base';
import {NimTeam} from 'react-native-netease-im';

/**
 * 群组列表
 */
export default class TeamList extends React.Component {
    static navigatorStyle = {
        StatusBarColor: '#444',
        tabBarHidden: true,
        navBarBackgroundColor:"#444",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff"
    };
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            ds:ds.cloneWithRows([]),
        };

    }

    componentWillMount() {
        NimTeam.startTeamList();
    }
    componentDidMount() {
        this.friendListener = NativeAppEventEmitter.addListener("observeTeam",(data)=>{
            console.log(data)
            this.setState({
                ds:this.state.ds.cloneWithRows(data),
            });
        });
    }
    componentWillUnmount() {
        NimTeam.stopTeamList();
        this.friendListener && this.friendListener.remove();
    }
    toChat(res){
        const {navigator} = this.props;
        navigator.popToRoot({
            animated: false,
        });
        let session = {
            ...res,
            sessionType:'1',
            contactId:res.teamId
        };
        navigator.push({
            screen:'FeiMa.Chat',
            title:res.name,
            passProps:{
                session
            }
        });
    }
    _renderRow(res){
        return(
            <ListItem onPress={()=>this.toChat(res)}>
                <Image style={{width:35,height:35}} source={res.avatar ? {uri:res.avatar} : require('../../images/discuss_logo.png')} />
                <Body>
                <Text>
                    {res.name}
                </Text>
                </Body>
            </ListItem>
        );
    }

    render() {
        return (
            <Container style={{flex:1,backgroundColor:"#fff"}}>
                <ListView
                    style={{backgroundColor:"#fff"}}
                    dataSource= {this.state.ds}
                    renderRow= {this._renderRow.bind(this)}
                    enableEmptySections= {true}
                    removeClippedSubviews= {true}
                />
            </Container>
        );
    }
}