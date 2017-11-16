import React, { Component } from 'react';
import {View,TouchableOpacity} from 'react-native';
import { Container,Header,Title,Text, Content, Button, Icon ,Left,Body,Right,Item,Form,Label,Input} from 'native-base';
import {NimTeam} from 'react-native-netease-im';
import Toast from 'react-native-simple-toast';
let _this = {};
export default class UpdateTeamName extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '更新群聊名称',
        headerRight:(
            <View style={{flexDirection:'row',paddingRight:8,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>_this.submit()}>
                    <Text style={{color:"#fff"}}>完成</Text>
                </TouchableOpacity>
            </View>
        )
    });
    constructor(props) {
        super(props);
        const {teamData={}} = props.navigation.state.params;
        this.state = {
            name:  teamData.name||''
        };
       _this = this;
    }
    submit() {
        const {teamData,onResult} = this.props.navigation.state.params;
        if(!this.state.name){
            Toast.show('请填写群名称');
            return;
        }
        if(!(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/).test(this.state.name)){
            Toast.show('不能包含特殊字符');
            return;
        }
        let len = this.state.name.replace(/[^\x00-\xff]/g,"aa").length;
        if(this.state.name && (len > 16)){
            Toast.show('长度不能超过8个字符');
            return;
        }

        NimTeam.updateTeamName(teamData.teamId,this.state.name).then((data)=>{
            onResult && onResult();
            this.props.navigation.goBack();
        });
    }
    render() {

        return (
            <Container style={{backgroundColor:"#f7f7f7"}}>
                <Content>
                    <Form style={{backgroundColor:'#fff'}}>
                        <View style={{backgroundColor:"#f7f7f7",padding:12}}><Text note>群聊名称</Text></View>
                        <Item inlineLabel first last>
                            <Input
                                value={this.state.name}
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                onChangeText={name => {
                                    this.setState({name});
                                }}
                            />
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}

