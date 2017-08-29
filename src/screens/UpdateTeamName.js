import React, { Component } from 'react';
import {View} from 'react-native';
import { Container,Header,Title,Text, Content, Button, Icon ,Left,Body,Right,Item,Form,Label,Input} from 'native-base';
import {NimTeam} from 'react-native-netease-im';
import Toast from 'react-native-simple-toast';

export default class UpdateTeamName extends Component {

    static navigatorStyle = {
        StatusBarColor: '#444',
        tabBarHidden: true,
        navBarBackgroundColor:"#444",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff"
    };
    static navigatorButtons = {
        rightButtons:[{
            id:'submit',
            buttonColor:'#fff',
            title:'完成'
        }]
    };
    constructor(props) {
        super(props);
        const {teamData={}} = props;
        this.state = {
            name:  teamData.name||''
        };
        this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }
    _onNavigatorEvent(event){

        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'submit') { // this is the same id field from the static navigatorButtons definition
                this.submit();
            }
        }
    }
    submit() {
        const {actions,navigator,teamData} = this.props;
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
            this.props.onResult && this.props.onResult();
            navigator.pop();
        });
    }
    render() {

        return (
            <Container style={{backgroundColor:"#f7f7f7"}}>
                <Content>
                    <Form style={{backgroundColor:'#fff'}}>
                        <View style={{backgroundColor:"#f7f7f7",padding:12}}><Text note>群聊名称</Text></View>
                        <Item inlineLabel last>
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

