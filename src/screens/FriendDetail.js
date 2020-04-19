/*
 * @好友信息
 * @Author: huangjun
 * @Date: 2018-10-10 16:17:05
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 15:12:43
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import {
  Container,
  Text,
  Content,
  Button,
  Icon,
  Thumbnail,
  Right,
  Body,
  ListItem,
} from 'native-base';
import {NimFriend} from 'react-native-netease-im';

export default class FriendDetail extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '详细资料',
  });
  toChat() {
    const {navigation} = this.props;
    const {friendData = {}} = navigation.state.params;
    navigation.popToTop();
    const session = {
      ...friendData,
      sessionType: '0',
    };
    navigation.push('Chat', {
      title: session.alias || session.name,
      session,
    });
  }
  submitRequest() {
    const {navigation} = this.props;
    const {friendData = {}} = navigation.state.params;
    NimFriend.ackAddFriendRequest(friendData.contactId, true).then(() => {
      navigation.pop();
    });
  }
  _renderRemark() {
    const {navigation} = this.props;
    const {friendData = {}} = navigation.state.params;
    if (/^\d{5}$/.test(friendData.contactId)) {
      return (
        <Content style={{paddingTop: 12}}>
          <View style={{backgroundColor: '#fff'}}>
            <ListItem last>
              <Thumbnail
                square
                style={{width: 49, height: 49, borderRadius: 10}}
                source={
                  friendData.avatar
                    ? {uri: friendData.avatar}
                    : require('../images/head.png')
                }
              />
              <Body>
                <Text>{friendData.name}</Text>
              </Body>
            </ListItem>
          </View>
          <View style={{backgroundColor: '#fff', marginTop: 12}}>
            <ListItem last>
              <Text>功能介绍</Text>

              <Right>
                <Text note>飞马钱包官方帐号</Text>
              </Right>
            </ListItem>
          </View>
        </Content>
      );
    }
    return (
      <Content style={{paddingTop: 12}}>
        <View style={{backgroundColor: '#fff'}}>
          <ListItem last>
            <Thumbnail
              square
              style={{width: 49, height: 49, borderRadius: 10}}
              source={
                friendData.avatar
                  ? {uri: friendData.avatar}
                  : require('../images/head.png')
              }
            />
            <Body>
              <Text>{friendData.alias || friendData.name}</Text>
              {friendData.alias ? (
                <Text note>昵称 : {friendData.name}</Text>
              ) : null}
            </Body>
          </ListItem>
        </View>
        <View style={{backgroundColor: '#fff', marginTop: 12}}>
          <ListItem last icon>
            <Body>
              <Text>设置备注</Text>
            </Body>
            <Right>
              <Icon name="ios-arrow-forward" />
            </Right>
          </ListItem>
        </View>
        <View style={{padding: 12}}>{this._renderButton()}</View>
      </Content>
    );
  }
  _renderButton() {
    const {friendData = {}, isRequest} = this.props;
    if (isRequest) {
      return (
        <Button block danger rounded onPress={() => this.submitRequest()}>
          <Text>通过验证</Text>
        </Button>
      );
    }
    if (friendData.isMyFriend === '0') {
      return (
        <Button
          block
          danger
          rounded
          onPress={() =>
            this.props.navigation.push('SendAddFriend', {
              friendData,
            })
          }>
          <Text>添加到通讯录</Text>
        </Button>
      );
    }
    return (
      <Button block danger rounded onPress={() => this.toChat()}>
        <Text>发消息</Text>
      </Button>
    );
  }
  render() {
    return (
      <Container style={{backgroundColor: '#f7f7f7'}}>
        {this._renderRemark()}
      </Container>
    );
  }
}
