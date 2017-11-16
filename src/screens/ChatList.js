import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    ListView,
    NativeAppEventEmitter,
    StatusBar
} from 'react-native';
import {Container,Content,Left,Right,Title,ListItem,List,Header,Icon,Text as TextNB,Button} from 'native-base';
import {SwipeListView} from 'react-native-swipe-list-view';
import {NimSession} from 'react-native-netease-im';


class ChatList extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '消息',
        headerRight:(
            <View style={{flexDirection:'row',paddingRight:8,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity style={{marginRight:5}} onPress={()=>navigation.navigate("FriendList")}>
                    <TextNB style={{color:"#fff"}}>朋友</TextNB>
                </TouchableOpacity>
            </View>
        )
    });

    constructor (props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            rowOpen:false,
            dataSource: ds.cloneWithRows([])
        };
    }

    componentDidMount() {
        console.log(this.sessionListener)
        this.sessionListener = NativeAppEventEmitter.addListener("observeRecentContact",(data)=>{
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(data.recents || data.sessionList)
            });
            console.info('会话列表',data)
        });

    }
    componentWillUnmount() {
        this.sessionListener && this.sessionListener.remove();
    }
    onRowTap(data){
        const {navigation} = this.props;
        this.refs['swList'].safeCloseOpenRow();
        navigation.navigate("Chat",{
            title:data.name,
            session:data,
        });
    }
    _renderRow(data){
        return (
            <View>
                <TouchableHighlight  onPress={()=>this.onRowTap(data)}>
                    <View style={[styles.row,styles.last]}>
                        <Image style={styles.logo} source={data.imagePath ? {uri:data.imagePath} : require('../images/discuss_logo.png')} />
                        <View style={styles.content}>
                            <View style={[styles.crow]}>
                                <Text style={styles.title} numberOfLines={1}>{data.name}</Text>

                                <Text style={styles.time}> {data.time}</Text>
                            </View>
                            <View style={[styles.crow,{marginTop:3}]}>
                                <Text style={styles.desc} numberOfLines={1}>
                                    {(data.unreadCount > 0 ?'['+data.unreadCount+'条]' : '')+data.content}</Text>
                            </View>
                        </View>
                        {parseInt(data.unreadCount) > 0 ? <View style={styles.badge}/> : null}
                    </View>
                </TouchableHighlight>

            </View>
        )
    }
    delete(res){
        NimSession.deleteRecentContact(res.contactId);
        this.refs['swList'].safeCloseOpenRow();
    }
    _renderSeparator(){
        return (
            <View style={styles.line}/>
        );
    }
    _renderHiddenRow(res,index){
        return(
            <View style={styles.rowBack}>
                <TouchableOpacity style={styles.deleteBtn} activeOpacity={1} onPress={()=>this.delete(res)}>
                    <TextNB style={{color:'#fff'}}>删除</TextNB>
                </TouchableOpacity>
            </View>
        )
    }
    addFriend(){
        this.setState({isVisible: false});
        const {navigator} = this.props;
        navigator.n({
            screen:"FeiMa.SearchScreen",
            passProps:{
                onResult:function(result){
                    navigator.dismissAllModals({
                        animated:false,
                    });
                    navigator.push({
                        screen:'FeiMa.FriendDetail',
                        title:'详细资料',
                        passProps:{
                            friendData:result
                        }
                    });
                }
            }
        });
    }
    createTeam(){
        this.setState({isVisible: false});
        const {navigator} = this.props;
        navigator.showModal({
            screen:'FeiMa.CreateTeam',
            title:'选择联系人',
            passProps:{
                onSuccess:function(res){
                    let session = {
                        contactId:res.teamId,
                        name:'群聊',
                        sessionType:'1'
                    };
                    navigator.dismissAllModals({animationType: 'none',animated: false});
                    navigator.push({
                        screen:'FeiMa.Chat',
                        title:'群聊',
                        passProps:{session}
                    });
                }
            }
        });
    }
    render() {
        return (
            <Container>
                <StatusBar backgroundColor="black" barStyle="light-content"/>
                <SwipeListView
                    ref="swList"
                    enableEmptySections
                    style={styles.list}
                    disableRightSwipe
                    recalculateHiddenLayout
                    closeOnRowPress={true}
                    tension={-2}
                    friction={5}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    renderSeparator={this._renderSeparator.bind(this)}
                    renderHiddenRow={this._renderHiddenRow.bind(this)}
                    rightOpenValue={-75}
                    onRowOpen={()=>this.setState({rowOpen:true})}
                    onRowClose={()=>this.setState({rowOpen:false})}
                    swipeToOpenPercent={5}
                />
            </Container>
        );
    }
}
const width= Dimensions.get('window').width;
const px = 9;
const borderWidth = StyleSheet.hairlineWidth;
const styles = StyleSheet.create({
    list:{

        borderTopWidth:borderWidth,
        borderTopColor:'#fafafa',
        borderBottomWidth:borderWidth,
        borderBottomColor:'#fafafa',
    },
    row:{
        paddingLeft:px,
        paddingVertical:px,
        borderBottomWidth:borderWidth,
        borderBottomColor:'#c9c9c9',
        flexDirection:'row',
        alignItems:'center',
        paddingRight:1,
        backgroundColor:'#fff',

    },
    last:{
        borderBottomWidth:0,
    },

    logo:{
        width:50,
        height:50,
        marginRight:px,
        borderRadius:8
    },
    content:{
        flexDirection:"column",
        justifyContent:'center',
        height:45,
        marginRight:3,
        flex:1
    },
    crow:{
        flexDirection:'row',
        justifyContent:'space-between',
        flex:1,

        alignItems:'center'
    },
    title:{
        fontSize:17,
        lineHeight:19,
        overflow:'hidden',
        color:'#333333'
    },
    time:{
        fontSize:10,
        color:"#9d9d9e",
    },
    desc:{
       fontSize:13,
       color:'#9d9d9e',
       overflow:'hidden'
    },
    rowBack:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    line:{
        height:borderWidth,
        width:width-8,
        backgroundColor:'#c9c9c9',
        marginLeft:8
    },
    deleteBtn:{
        height:67,
        width:75,
        backgroundColor:'#d82617',
        alignItems:'center',
        justifyContent:'center'
    },
    tabIcon:{
        width:26,
        height:26
    },
    badge:{
        width:10,
        height:10,
        borderRadius:5,
        backgroundColor:'red',
        position:'absolute',
        left:55,
        top:7
    }

});
export default ChatList