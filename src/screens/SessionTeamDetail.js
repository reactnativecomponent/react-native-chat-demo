import React, { Component } from 'react';
import {Image,TouchableOpacity,View,StyleSheet,Switch,Dimensions } from 'react-native';
import { Container,Text, Content,Header,Title, Button, Icon,Thumbnail ,Left,Right,Body,List,ListItem} from 'native-base';
import {NimTeam,NimFriend,NimSession} from 'react-native-netease-im';

export  default class SessionTeamDetail extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '群组设置'
    });
    constructor(props) {
        super(props);
        this.state = {
            teamInfo:{},
            members:[]
        };
    }
    componentDidMount() {
        const {session} = this.props.navigation.state.params;
        NimTeam.getTeamInfo(session.contactId).then((data)=>{
            this.setState({
                teamInfo:data
            });
        });
        NimTeam.fetchTeamMemberList(session.contactId).then((data)=>{
            this.setState({
                members:data
            });
        });
    }
    _removeUser(){
        const {navigation} = this.props;
        const {session} = navigation.state.params;
        navigation.navigate("RemoveUsers",{
            members:this.state.members,
            teamId:session.contactId,
            onResult:function(){
                setTimeout(()=>{
                    navigation.goBack();
                },100);
            }
        });

    }
    toFriendDetail(id){
        NimFriend.getUserInfo(id).then((data)=>{
            this.props.navigation.navigate("FriendDetail",{
                friendData:data
            });
        })
    }
    _renderMembers(){
        const {members} = this.state;
        if(members && members.length > 0){
            return members.map(res=>{
                return (
                    <View key={res.contactId}>
                        <TouchableOpacity activeOpacity={1}  style={styles.member} onPress={()=>this.toFriendDetail(res.contactId)}>
                            <Image source={res.avatar ? {uri:res.avatar} : require('../images/head.png')} style={styles.avatar}/>
                            <Text style={{fontSize:11,marginTop:5}} note numberOfLines={1}>{res.alias || res.name}</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        }
    }
    _addUserToTeam(){
        const {navigation} = this.props;
        const {session} = navigation.state.params;
        navigation.navigate("SelectUsers",{
            members:this.state.members,
            teamId:session.contactId,
            onResult:function(){
                setTimeout(()=>{
                    navigation.goBack();
                },100);
            }
        });
    }
    _changeState(v){
        const {session} = this.props.navigation.state.params;
        if(v){
           NimTeam.setTeamNotify(session.contactId,'0').then(()=>{
               this.setState({
                   teamInfo:{
                       ...this.state.teamInfo,
                       mute:'0'
                   }
               })
           });

        }else{
            NimTeam.setTeamNotify(session.contactId,'1').then(()=>{
                this.setState({
                    teamInfo:{
                        ...this.state.teamInfo,
                        mute:'1'
                    }
                })
            });
        }

    }
    _updateTeamName(){
        const {navigation} = this.props;
        const {session} = navigation.state.params;
        let self = this;
        navigation.navigate("UpdateTeamName",{
            teamData:this.state.teamInfo,
            onResult:function(){
                NimTeam.getTeamInfo(session.contactId).then((data)=>{
                    self.setState({
                        teamInfo:data
                    });
                });
            }
        });

    }
    clearMessage(){
        const {session} = this.props;
        NimSession.clearMessage(session.contactId);
    }
    render() {
        const deleteAction = (
            <TouchableOpacity activeOpacity={1} style={styles.member} onPress={()=>this._removeUser()}>
                <Icon name="ios-remove" style={{fontSize:45,color:'#666666'}}/>
            </TouchableOpacity>
        );
        return (
            <Container style={{backgroundColor:"#f7f7f7"}}>
                <Content>
                    <View style={styles.membersWarp}>
                        {this._renderMembers()}
                        <TouchableOpacity activeOpacity={1} style={styles.member} onPress={()=>this._addUserToTeam()}>
                            <Icon name="ios-add" style={{fontSize:45,color:'#666666'}}/>
                        </TouchableOpacity>
                        {global.imaccount === this.state.teamInfo.creator ? deleteAction : null}
                    </View>
                    <View style={{backgroundColor:'#fff',marginTop:12}}>
                        <ListItem icon onPress={()=>this._updateTeamName()}>
                            <Body>
                                <Text>群聊名称</Text>
                            </Body>
                            <Right>
                                <Text>{this.state.teamInfo.name}</Text>
                                <Icon name="ios-arrow-forward"/>
                            </Right>
                        </ListItem>
                        <ListItem icon last>
                            <Body>
                            <Text>消息免打扰</Text>
                            </Body>
                            <Right>
                                <Switch value={this.state.teamInfo.mute === '0'} onValueChange={(v)=>this._changeState(v)}/>
                            </Right>
                        </ListItem>
                    </View>
                    <View style={{backgroundColor:'#fff',marginTop:12}}>
                        <ListItem icon last onPress={()=>this.clearMessage()}>
                            <Body>
                            <Text>清空聊天信息</Text>
                            </Body>
                        </ListItem>
                    </View>
                </Content>
            </Container>
        );
    }
}
const {width,height} = Dimensions.get('window');
const maxCount = ((width-24)%70)/2;
const styles = StyleSheet.create({
    membersWarp:{
        backgroundColor:"#fff",
        padding:12,
        flexWrap:'wrap',
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:maxCount+12
    },
    member:{
        width:70,
        height:85,
        alignItems:'center',
        paddingVertical:5
    },
    avatar:{
        width:45,
        height:45,
        borderRadius:5
    },
    deleteBtn:{
        position:'absolute',
        top:-3,
        left:8,
        backgroundColor:'transparent'
    }
});
