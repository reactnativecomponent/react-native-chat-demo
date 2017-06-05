import React, { Component } from 'react';
import { View,Image,TextInput,StyleSheet,Text,Dimensions,TouchableOpacity} from 'react-native';
import { Container, Content, Button, Icon,ListItem,Left,Right,Body } from 'native-base';
import NIM from 'react-native-netease-im';
import Toast from 'react-native-simple-toast';
import md5 from '../utils/md5';

export default class Login extends Component {
    static navigatorStyle = {
        statusBarColor: '#fff'
    };
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            password: ''
        };
    }
    componentWillUnmount() {
        //清除密码
        this.setState({password: ''});
    }

    loginIn() {
        const {navigator} = this.props;
        NIM.login(this.state.name,md5.createHash(this.state.password)).then((data)=>{
            console.info(data);
            global.imaccount = this.state.name;
            navigator.resetTo({
                screen:'ImDemo.ChatList',
                title:"消息"
            });
        },(err)=>{
            console.warn(err);
        })
    }
    _renderContent(){
        return (
            <View style={styles.content}>
                <View style={[styles.inputView,{borderTopWidth:borderWidth,borderTopColor:'#ccc'}]}>
                    <Text style={styles.inputLabel}>账户</Text>
                    <TextInput
                        style={styles.textViewStyle}
                        value={this.state.name}
                        underlineColorAndroid="transparent"
                        keyboardType="numeric"
                        placeholder="请输入帐号"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        onChangeText={name => {
                                    this.setState({name});
                                }}
                    />
                </View>
                <View style={styles.inputView}>
                    <Text style={styles.inputLabel}>密码</Text>
                    <TextInput
                        style={styles.textViewStyle}
                        value={this.state.password}
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        placeholder="请输入密码"
                        onChangeText={password => {
                                        this.setState({password});
                                    }}
                    />
                </View>
            </View>
        );

    }
    render() {
        return (
            <Container>
                <Content alwaysBounceVertical={false}>
                    {this._renderContent()}
                    <View style={styles.bottom}>
                        <Button block onPress={() => this.loginIn()}>
                            <Text style={styles.buttonText}>登录</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}
const borderWidth = StyleSheet.hairlineWidth;
const {height,width} = Dimensions.get('window');
const styles = StyleSheet.create({
    content: {
        backgroundColor: '#fff',
        flex: 1,
        marginTop:height/2-150,
        padding:12
    },
    bottom: {
        padding:12
    },

    inputView: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingLeft: 9,
        paddingRight: 9,
        alignItems: 'center',
        borderBottomWidth: borderWidth,
        borderBottomColor: '#ccc',
        height: 41,
        borderLeftWidth: borderWidth,
        borderLeftColor: '#ccc',
        borderRightWidth: borderWidth,
        borderRightColor: '#ccc'
    },
    inputLabel: {
        fontSize: 14,
        marginRight: 10
    },
    textViewStyle: {
        flex: 1,
        fontSize: 14,
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff'
    },
});
