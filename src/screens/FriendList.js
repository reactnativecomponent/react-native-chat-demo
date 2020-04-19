/*
 * @通讯录
 * @Author: huangjun
 * @Date: 2018-10-10 16:21:48
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:17:13
 */
import React from 'react';
import {View, NativeAppEventEmitter, SectionList, Image} from 'react-native';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {Container, ListItem, Text, Body} from 'native-base';
import {NimFriend} from 'react-native-netease-im';

export default class FriendList extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: '通讯录',
    headerRight: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          title="添加"
          color="#037aff"
          onPress={navigation.getParam('handlerAddBtn')}
        />
      </HeaderButtons>
    ),
  });
  // 构造
  constructor(props) {
    super(props);

    this.state = {
      ds: [],
    };
  }
  addFriend = () => {
    console.log('search');
    this.props.navigation.push('SearchScreen');
  };

  componentDidMount() {
    NimFriend.startFriendList();
    this.props.navigation.setParams({
      handlerAddBtn: this.addFriend,
    });
    this.friendListener = NativeAppEventEmitter.addListener(
      'observeFriend',
      (data) => {
        this.setState({
          ds: this.formatData(data),
        });
      },
    );
  }
  formatData = (data) => {
    const newObj = [];
    const h = transform(data).sort();
    h.map((res) => {
      // newObj[res] = data[res];
      newObj.push({
        title: res,
        data: data[res],
      });
    });
    console.log(newObj);
    return newObj;
  };
  componentWillUnmount() {
    NimFriend.stopFriendList();
    this.friendListener && this.friendListener.remove();
  }
  toFriendDetail(id) {
    NimFriend.getUserInfo(id).then((data) => {
      this.props.navigation.push('FriendDetail', {
        friendData: data,
      });
    });
  }
  _renderRow = ({item}) => (
    <ListItem onPress={() => this.toFriendDetail(item.contactId)}>
      <Image
        style={{width: 35, height: 35}}
        source={
          item.avatar
            ? {uri: item.avatar}
            : require('../images/discuss_logo.png')
        }
      />
      <Body>
        <Text>{item.name}</Text>
      </Body>
    </ListItem>
  );
  _renderSectionHeader = ({section: {title}}) => (
    <ListItem itemDivider>
      <Text>{title}</Text>
    </ListItem>
  );
  render() {
    return (
      <Container style={{flex: 1}}>
        <SectionList
          style={{backgroundColor: '#fff'}}
          sections={this.state.ds}
          renderItem={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
          keyExtractor={(item, index) => item + index}
          ListHeaderComponent={
            <View>
              <ListItem
                last
                onPress={() => this.props.navigation.push('NewFriend')}>
                <Body>
                  <Text>新的朋友</Text>
                </Body>
              </ListItem>
            </View>
          }
        />
      </Container>
    );
  }
}
function transform(obj) {
  const arr = [];
  for (const item in obj) {
    arr.push(item);
  }
  arr.sort(mySorter);
  return arr;
}
function mySorter(a, b) {
  if (/^\d/.test(a) !== /^\D/.test(b)) {
    return a > b ? 1 : (a = b ? 0 : -1);
  }
  return a > b ? -1 : a == b ? 0 : 1;
}
