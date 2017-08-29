import React from 'react';
import {
    NativeAppEventEmitter,
    ListView,Image
} from 'react-native';
import {Container,Icon,ListItem,Text,Body,Right,Left} from 'native-base';
import {NimFriend} from 'react-native-netease-im';

/**
 * 黑名单
 */
export default class BlackList extends React.Component {
    static navigatorStyle = {
        StatusBarColor: '#fc513a',
        tabBarHidden: true,
        navBarBackgroundColor:"#fc513a",
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
        NimFriend.startBlackList();
    }
    componentDidMount() {
        this.friendListener = NativeAppEventEmitter.addListener("observeBlackList",(data)=>{
            this.setState({
                ds:this.state.ds.cloneWithRows(data)
            });
        });
    }
    componentWillUnmount() {
        NimFriend.stopBlackList();
        this.friendListener && this.friendListener.remove();
    }
    toFriendDetail(id){
        NimFriend.getUserInfo(id).then((data)=>{
            this.props.navigator.push({
                screen:'FeiMa.FriendSetting',
                title:'资料设置',
                passProps:{
                    friendData:data
                }
            });
        })
    }
    _renderRow(res){
        return(
            <ListItem onPress={()=>this.toFriendDetail(res.contactId)}>
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
            <Container style={{flex:1,backgroundColor:"#f7f7f7"}}>
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