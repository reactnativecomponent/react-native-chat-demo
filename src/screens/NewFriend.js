/*
 * @添加好友
 * @Author: huangjun
 * @Date: 2018-10-10 16:23:32
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:07:52
 */
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  NativeAppEventEmitter,
  ListView,
  Image,
  Text,
} from 'react-native';
import {Container, Content, ListItem, Body, Text as TextNB} from 'native-base';
import {NimSystemMsg, NimFriend} from 'react-native-netease-im';
import {RNToasty} from 'react-native-toasty';
import {HeaderButtons} from 'react-navigation-header-buttons';

export default class NewFriend extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: '新的朋友',
    headerRight: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          title="查找"
          color="#037aff"
          onPress={() => navigation.push('SearchScreen')}
        />
      </HeaderButtons>
    ),
  });
  // 构造
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }
  componentWillMount() {
    NimSystemMsg.startSystemMsg();
  }
  componentDidMount() {
    this.friendListener = NativeAppEventEmitter.addListener(
      'observeReceiveSystemMsg',
      (data) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data),
        });
      },
    );
  }
  componentWillUnmount() {
    NimSystemMsg.stopSystemMsg();
    this.friendListener && this.friendListener.remove();
  }
  toFriendDetail(res) {
    NimFriend.fetchUserInfo(res.fromAccount).then((data) => {
      this.props.navigation.push('FriendDetail', {
        friendData: data,
        isRequest: res.status !== '1',
      });
    });
  }
  delete = (res) => {
    NimSystemMsg.ackAddFriendRequest(
      res.messageId,
      res.fromAccount,
      '0',
      res.time,
    ).then(() => {
      RNToasty.Show({
        title: '拒绝了添加',
      });
    });
  };
  accect = (res) => {
    NimSystemMsg.ackAddFriendRequest(
      res.messageId,
      res.fromAccount,
      '1',
      res.time,
    ).then(
      () => {
        RNToasty.Show({
          title: '添加成功',
        });
      },
      (err) => {
        console.log(err);
      },
    );
  };
  _renderRow = (res) => (
    <ListItem
      style={{backgroundColor: '#fff'}}
      key={res.messageId}
      onPress={() => this.toFriendDetail(res)}>
      <Image
        style={{width: 35, height: 35}}
        source={
          res.avatar ? {uri: res.avatar} : require('../images/discuss_logo.png')
        }
      />
      <Body>
        <TextNB>{res.name}</TextNB>
        <TextNB note>{res.verifyText}</TextNB>
      </Body>
      {res.status === '0' ? (
        <TouchableOpacity
          style={{backgroundColor: '#d82617', borderRadius: 3, padding: 8}}
          onPress={() => this.accect(res)}>
          <Text style={{color: '#fff', fontSize: 13}}>接受</Text>
        </TouchableOpacity>
      ) : (
        <TextNB note>已接受</TextNB>
      )}
    </ListItem>
  );
  _renderHiddenRow = (res) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteBtn}
        activeOpacity={1}
        onPress={() => this.delete(res)}>
        <TextNB style={{color: '#fff'}}>删除</TextNB>
      </TouchableOpacity>
    </View>
  );
  render() {
    return (
      <Container style={{flex: 1, backgroundColor: '#f7f7f7'}}>
        <Content>
          <View style={{backgroundColor: '#fff'}}>
            <ListView
              ref={(v) => (this.swList = v)}
              enableEmptySections
              dataSource={this.state.dataSource}
              renderRow={this._renderRow}
            />
          </View>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  deleteBtn: {
    height: 67,
    width: 75,
    backgroundColor: '#d82617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
