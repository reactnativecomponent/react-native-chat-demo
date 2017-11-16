import React from 'react';
import {

    View,
    TouchableOpacity,
    NativeAppEventEmitter,
    ListView,Image
} from 'react-native';
import {Container,Icon,ListItem,Text,Body,Right,Left} from 'native-base';
import {NimFriend} from 'react-native-netease-im';

export default class FriendList extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: '通讯录',
        headerRight:(
            <View style={{flexDirection:'row',paddingRight:8,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>navigation.navigate("SearchScreen",{
                    searchCallback:function(result){
                        setTimeout(()=>{
                            navigation.navigate("FriendDetail",{friendData:result})
                        },100)
                    }
                })}>
                    <Text style={{color:"#fff"}}>添加</Text>
                </TouchableOpacity>
            </View>
        )
    });
    // 构造
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged:(s1,s2)=> s1 !== s2
        });
        this.state = {
            ds:ds.cloneWithRowsAndSections([]),
        };
    }

    componentWillMount() {
        NimFriend.startFriendList();

    }
    componentDidMount() {
        this.friendListener = NativeAppEventEmitter.addListener("observeFriend",(data)=>{
            this.setState({
                ds:this.state.ds.cloneWithRowsAndSections(this.formatData(data)),
            });
        });

    }
    formatData(data){
        let newObj = {};
        let h = transform(data).sort();
        h.map(res=>{
            newObj[res] = data[res];
        });
        return newObj;
    }
    componentWillUnmount() {
        NimFriend.stopFriendList();
        this.friendListener && this.friendListener.remove();
    }
    toFriendDetail(id){
        NimFriend.getUserInfo(id).then((data)=>{
            this.props.navigation.navigate("FriendDetail",{
                friendData:data,
                from:this.props.navigation.state.key
            });
        })
    }
    _renderRow(res){
        return(
            <ListItem onPress={()=>this.toFriendDetail(res.contactId)}>
                <Image style={{width:35,height:35}} source={res.avatar ? {uri:res.avatar} : require('../images/discuss_logo.png')} />
                <Body>
                <Text>
                    {res.name}
                </Text>
                </Body>
            </ListItem>
        );
    }
    _renderSectionHeader(sectionData,sectionID){
        return (
            <ListItem itemDivider><Text>{sectionID}</Text></ListItem>
        );
    }
    render() {
        return (
            <Container style={{flex:1}}>
                <ListView
                    style={{backgroundColor:"#fff"}}
                    dataSource= {this.state.ds}
                    renderRow= {this._renderRow.bind(this)}
                    enableEmptySections= {true}
                    removeClippedSubviews= {true}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                    renderHeader={()=>
                    <View>
                        <ListItem onPress={()=>this.props.navigation.navigate("NewFriend")}>
                            <Body>
                            <Text>
                                新的朋友
                            </Text>
                            </Body>
                        </ListItem>
                        </View>
                    }
                />
            </Container>
        );
    }
}
function  transform(obj){
    var arr = [];
    for(var item in obj){
        arr.push(item);
    }
    arr.sort(mySorter);
    return arr;
}
function  mySorter(a, b){
    if (/^\d/.test(a) !== /^\D/.test(b)) return a > b ? 1 : (a = b ? 0 : -1);
    return a> b?-1:(a== b?0:1);
}