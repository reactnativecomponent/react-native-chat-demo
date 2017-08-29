import React, { Component } from 'react';
import {View} from 'react-native';
import { Container,Header,Title,Text, Content, Button, Icon ,Left,Right,Item,Form,Label,Input} from 'native-base';
import {NimSystemMsg,NimFriend} from 'react-native-netease-im';
import Toast from 'react-native-simple-toast';

export default class SendAddFriend extends Component {
    static navigatorStyle = {
        statusBarColor: '#444',
        navBarBackgroundColor:"#444",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff"
    };
    static navigatorButtons = {
        rightButtons:[{
            id:'ver-add',
            buttonColor:'#fff',
            title:'发送'
        }]
    };
    constructor(props) {
        super(props);
        this.state = {
            remark:''
        };
        this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }
    _onNavigatorEvent(event){
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'ver-add') {
                this.submit();
            }
        }
    }
    submit() {
        const {friendData={}} = this.props;
        if(!(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/).test(this.state.remark)){
            Toast.show('不能包含特殊字符');
            return;
        }
        NimFriend.addFriend(friendData.contactId,this.state.remark).then((res)=>{
            Toast.show('已发送请求');
            this.props.navigator.pop();
        },(err)=>{
            Toast.show(err);
        });

    }
    render() {
        return (
            <Container style={{backgroundColor:"#f7f7f7"}}>
                <Content>
                    <Form style={{backgroundColor:'#fff'}}>
                        <View style={{backgroundColor:"#f7f7f7",padding:12}}><Text note>你需要发送的请求,等对方通过</Text></View>
                        <Item inlineLabel last>
                            <Input
                                value={this.state.remark}
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                onChangeText={remark => {
                                    this.setState({remark});
                                }}
                            />
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}

