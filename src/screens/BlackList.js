/*
 * @黑名单列表
 * @Author: huangjun
 * @Date: 2018-10-10 16:22:07
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 15:09:29
 */
import React from 'react';
import {NativeAppEventEmitter, ListView, Image} from 'react-native';
import {Container, ListItem, Text, Body} from 'native-base';
import {NimFriend} from 'react-native-netease-im';

export default class BlackList extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: '黑名单',
  });
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      ds: ds.cloneWithRows([]),
    };
  }

  componentWillMount() {
    NimFriend.startBlackList();
  }
  componentDidMount() {
    this.friendListener = NativeAppEventEmitter.addListener(
      'observeBlackList',
      (data) => {
        this.setState({
          ds: this.state.ds.cloneWithRows(data),
        });
      },
    );
  }
  componentWillUnmount() {
    NimFriend.stopBlackList();
    this.friendListener && this.friendListener.remove();
  }
  toFriendDetail(id) {
    NimFriend.getUserInfo(id).then((data) => {
      this.props.navigator.push({
        screen: 'FeiMa.FriendSetting',
        title: '资料设置',
        passProps: {
          friendData: data,
        },
      });
    });
  }
  _renderRow = (res) => (
    <ListItem onPress={() => this.toFriendDetail(res.contactId)}>
      <Image
        style={{width: 35, height: 35}}
        source={
          res.avatar
            ? {uri: res.avatar}
            : require('../../images/discuss_logo.png')
        }
      />
      <Body>
        <Text>{res.name}</Text>
      </Body>
    </ListItem>
  );

  render() {
    return (
      <Container style={{flex: 1, backgroundColor: '#f7f7f7'}}>
        <ListView
          style={{backgroundColor: '#fff'}}
          dataSource={this.state.ds}
          renderRow={this._renderRow}
          enableEmptySections
          removeClippedSubviews
        />
      </Container>
    );
  }
}
