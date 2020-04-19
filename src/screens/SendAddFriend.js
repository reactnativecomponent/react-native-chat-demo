/*
 * @发送好友添加请求
 * @Author: huangjun
 * @Date: 2018-10-10 16:31:31
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 15:15:16
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import HeaderButtons from 'react-navigation-header-buttons';
import {Container, Text, Content, Item, Form, Input} from 'native-base';
import {NimFriend} from 'react-native-netease-im';
import {RNToasty} from 'react-native-toasty';

export default class SendAddFriend extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '发送请求',
    headerRight: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          title="发送"
          color="#037aff"
          onPress={navigation.getParam('handlerSend')}
        />
      </HeaderButtons>
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      remark: '',
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({
      handlerSend: this.submit,
    });
  }
  submit = () => {
    const {friendData = {}} = this.props.navigation.state.params;
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(this.state.remark)) {
      RNToasty.Show({
        title: '不能包含特殊字符',
      });
      return;
    }
    NimFriend.addFriend(friendData.contactId, this.state.remark).then(
      () => {
        RNToasty.Show({
          title: '已发送请求',
        });
        this.props.navigation.pop();
      },
      (err) => {
        RNToasty.Show({
          title: err,
        });
      },
    );
  };
  render() {
    return (
      <Container style={{backgroundColor: '#f7f7f7'}}>
        <Content>
          <Form style={{backgroundColor: '#fff'}}>
            <View style={{backgroundColor: '#f7f7f7', padding: 12}}>
              <Text note>你需要发送的请求,等对方通过</Text>
            </View>
            <Item inlineLabel last>
              <Input
                value={this.state.remark}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(remark) => {
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
