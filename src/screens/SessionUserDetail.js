/*
 * @会话设置
 * @Author: huangjun
 * @Date: 2018-10-10 16:34:07
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 15:16:42
 */
import React, {Component} from 'react';
import {Image, TouchableOpacity, View, StyleSheet, Switch} from 'react-native';
import {
  Container,
  Text,
  Content,
  Icon,
  Right,
  Body,
  ListItem,
} from 'native-base';
import {NimSession, NimFriend, NimTeam} from 'react-native-netease-im';

export default class SessionUserDetail extends Component {
  static navigationOptions = (navigation) => ({
    title: '会话详情',
  });
  // 构造
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
    // 初始状态
  }
  componentDidMount() {
    const {session} = this.props.navigation.state.params;
    NimFriend.getUserInfo(session.contactId).then((data) => {
      this.setState({
        userInfo: data,
      });
    });
  }
  _addUserToTeam() {
    const {navigation} = this.props;
    navigation.push('CreateTeam', {
      members: [this.state.userInfo],
      onSuccess: (res) => {
        const session = {
          contactId: res.teamId,
          name: '群聊',
          sessionType: '1',
        };
        navigation.popToTop();
        navigation.push('Chat', {
          session,
        });
      },
    });
  }
  _changeState(v) {
    const {session = {}} = this.props.navigation.state.params;
    if (v) {
      NimTeam.setMessageNotify(session.contactId, '0').then((res) => {
        console.log(v, res);
        this.setState({
          userInfo: {
            ...this.state.userInfo,
            mute: '0',
          },
        });
      });
    } else {
      NimTeam.setMessageNotify(session.contactId, '1').then((res) => {
        console.log(v, res);
        this.setState({
          userInfo: {
            ...this.state.userInfo,
            mute: '1',
          },
        });
      });
    }
  }
  clearMessage() {
    const {session = {}, onResult} = this.props.navigation.state.params;
    NimSession.clearMessage(session.contactId, '0');
    onResult && onResult();
  }
  render() {
    const {userInfo} = this.state;
    return (
      <Container style={{backgroundColor: '#f7f7f7'}}>
        <Content>
          <View style={styles.membersWarp}>
            <TouchableOpacity activeOpacity={1} style={styles.member}>
              <Image
                source={
                  userInfo.avatar
                    ? {uri: userInfo.avatar}
                    : require('../images/head.png')
                }
                style={styles.avatar}
              />
              <Text style={{fontSize: 11, marginTop: 5}} note numberOfLines={1}>
                {userInfo.alias || userInfo.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.member]}
              onPress={() => this._addUserToTeam()}>
              <Icon name="ios-add" style={{fontSize: 45, color: '#666666'}} />
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor: '#fff', marginTop: 12}}>
            <ListItem icon last>
              <Body>
                <Text>消息免打扰</Text>
              </Body>
              <Right>
                <Switch
                  value={this.state.userInfo.mute === '0'}
                  onValueChange={(v) => this._changeState(v)}
                />
              </Right>
            </ListItem>
          </View>
          <View style={{backgroundColor: '#fff', marginTop: 12}}>
            <ListItem icon last onPress={() => this.clearMessage()}>
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
const styles = StyleSheet.create({
  membersWarp: {
    backgroundColor: '#fff',
    padding: 12,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  member: {
    width: 70,
    height: 85,
    alignItems: 'center',
    paddingVertical: 5,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
});
