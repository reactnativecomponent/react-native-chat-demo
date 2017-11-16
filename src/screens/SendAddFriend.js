import React, { Component } from 'react';
import {View,TouchableOpacity} from 'react-native';
import { Container,Header,Title,Text, Content, Button, Icon ,Left,Body,Right,Item,Form,Label,Input} from 'native-base';
import {NimFriend} from 'react-native-netease-im';
import Toast from 'react-native-simple-toast';
let _this={};

export default class SendAddFriend extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '添加好友',
        headerRight:(
            <View style={{flexDirection:'row',paddingRight:8,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>_this.submit()}>
                    <Text style={{color:"#fff"}}>发送</Text>
                </TouchableOpacity>
            </View>
        )
    });
    constructor(props) {
        super(props);
        this.state = {
            remark:''
        };
        _this = this;
    }
    submit() {
        const {friendData={}} = this.props;
        if(!(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/).test(this.state.remark)){
            Toast.show('不能包含特殊字符');
            return;
        }
        NimFriend.addFriend(friendData.contactId,this.state.remark).then((res)=>{
            Toast.show('已发送请求');
            this.props.navigation.goBack();
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

