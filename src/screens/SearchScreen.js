import React, { Component } from 'react';
import {View,Platform,Image} from 'react-native';
import { Container, Header,Text, Title, Content,  Button, Icon,Item,Form,Left,Body,Right,Label,ListItem,Input } from 'native-base';
import {NimFriend} from 'react-native-netease-im';

export default class SearchScreen extends Component {
    static navigatorStyle = {
        backButtonHidden:true,
        navBarHidden:true,
        statusBarTextColorScheme:'dark',
        StatusBarColor: '#444',
        navBarBackgroundColor:"#444",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff"
    };
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            account:'',
            result:[]
        };
    }
    _check(){
        NimFriend.fetchUserInfo(this.state.account).then((res)=>{
            let arr = [];
            arr.push(res);
            this.setState({
                result:arr
            });
        });
    }
    onSelectResult(data){
        this.props.onResult && this.props.onResult(data);
        this.props.navigator.dismissModal({
            animationType: 'none'
        });
    }
    _renderResult(){
        if(this.state.result && this.state.result.length > 0){
            return this.state.result.map(res=>{
                return (
                    <ListItem key={res.contactId} onPress={()=>this.onSelectResult(res)}>
                        <Image style={{width:35,height:35}} source={res.avatar ? {uri:res.avatar} : require('../images/discuss_logo.png')} />
                        <Body>
                        <Text>
                            {res.name}
                        </Text>
                        </Body>
                    </ListItem>
                );
            });
        }
        return null;

    }
    render() {
        return (
            <Container style={{backgroundColor:"#f7f7f7"}}>
                <View style={{flexDirection:'row',justifyContent:'center',paddingTop:Platform.OS === 'ios' ? 20:0,padding:8}} >
                    <Item style={{backgroundColor:'#fff',flex:1,padding:5}}>
                        <Icon name="ios-search" />
                        <Input
                            value={this.state.account}
                            placeholder="手机号/帐号"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus={true}
                            clearButtonMode="while-editing"
                            returnKeyType={Platform.OS === 'ios' ? 'search' : 'previous'}
                            onChangeText={(account) => {
                                    this.setState({account:account});
                                }}
                            onSubmitEditing={()=>this._check()}
                        />
                    </Item>
                    <Button transparent onPress={()=>this.props.navigator.dismissModal()}>
                        <Text>取消</Text>
                    </Button>
                </View>
                <Content>
                    <View style={{backgroundColor:'#fff'}}>
                        {this._renderResult()}
                    </View>
                </Content>
            </Container>
        );
    }
}
