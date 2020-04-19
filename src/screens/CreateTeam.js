/*
 * @创建群
 * @Author: huangjun
 * @Date: 2018-10-10 16:14:54
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:06:26
 */

import React from 'react';
import {View, SectionList, Image, ScrollView, Dimensions} from 'react-native';
import {Container, Icon, ListItem, Text, Body} from 'native-base';
import {NimTeam, NimFriend} from 'react-native-netease-im';
import {HeaderButtons} from 'react-navigation-header-buttons';

export default class CreateTeam extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: '创建群聊',
    headerLeft: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          color="#037aff"
          title="取消"
          onPress={() => navigation.pop()}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          color="#037aff"
          title="确定"
          onPress={navigation.getParam('handlerSubmit')}
        />
      </HeaderButtons>
    ),
  });
  // 构造
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectAccounts: [],
    };
  }
  componentWillMount() {
    this.props.navigation.setParams({
      handlerSubmit: this.createTeam,
    });
    NimFriend.getFriendList('').then((data) => {
      this.listData = this.formatData(data);
      console.log(this.listData);
      this.setState({
        data: this.listData,
      });
    });
  }
  createTeam = () => {
    const {navigation} = this.props;
    const {members = [], onSuccess} = navigation.state.params;
    const result = this.getIds();
    if (members && members.length > 0) {
      result.push(members[0].contactId);
    }
    if (result.length > 0) {
      NimTeam.createTeam(
        {
          name: '群聊',
          introduce: '群介绍',
          verifyType: '0',
          inviteMode: '1',
          beInviteMode: '1',
          teamUpdateMode: '1',
        },
        '0',
        result,
      ).then((res) => {
        navigation.goBack();
        onSuccess && onSuccess(res);
      });
    }
  };
  getIds() {
    const arr = [];
    this.state.selectAccounts.map((res) => {
      arr.push(res.contactId);
    });
    return arr;
  }
  formatData = (data) => {
    const newList = [];
    const h = transform(data).sort();
    h.map((res) => {
      newList.push({
        key: res,
        data: data[res],
      });
    });
    return newList;
  };
  getStatus(data) {
    const {members = []} = this.props;
    let isSelect = false;
    members.map((res) => {
      if (data.contactId === res.contactId) {
        isSelect = true;
      }
    });
    return isSelect;
  }
  removeItem(arr, item) {
    let newList = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].contactId !== item.contactId) {
        newList.push(arr[i]);
      }
    }
    return newList;
  }
  _select(res, sectionId, rowId) {
    let newSelect = this.state.selectAccounts;
    if (res.isSelect) {
      newSelect = this.removeItem(newSelect, res);
    } else {
      newSelect.push(res);
    }
    this.listData.map((sectionList) => {
      if (sectionList.key === sectionId) {
        sectionList.data.splice(rowId, 1, {
          ...res,
          isSelect: res.isSelect ? false : true,
        });
      }
    });
    this.setState({
      selectAccounts: newSelect,
      data: this.listData,
    });
  }
  _renderSelect() {
    return this.state.selectAccounts.map((res) => (
      <Image
        key={res.contactId}
        style={{width: 35, height: 35, marginRight: 5}}
        source={
          res.avatar ? {uri: res.avatar} : require('../images/discuss_logo.png')
        }
      />
    ));
  }
  _renderRow = ({item, section, index}) => {
    if (this.getStatus(item)) {
      return (
        <ListItem>
          <Icon
            name="ios-checkmark-circle"
            style={{color: '#ccc', marginRight: 8}}
          />
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
    }
    return (
      <ListItem onPress={() => this._select(item, section.key, index)}>
        <Icon
          name={item.isSelect ? 'ios-checkmark-circle' : 'ios-radio-button-off'}
          style={{marginRight: 8, color: item.isSelect ? '#d82617' : '#ccc'}}
        />
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
  };
  _renderSectionHeader = ({section}) => (
    <ListItem itemDivider last>
      <Text>{section.key}</Text>
    </ListItem>
  );
  render() {
    return (
      <Container style={{flex: 1, backgroundColor: '#f7f7f7'}}>
        <View
          style={{
            width,
            height: 51,
            backgroundColor: '#fff',
            justifyContent: 'center',
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#c9c9c9',
          }}>
          <ScrollView
            horizontal
            style={{flex: 1}}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this._renderSelect()}
          </ScrollView>
        </View>
        <SectionList
          style={{backgroundColor: '#fff'}}
          sections={this.state.data}
          renderItem={this._renderRow}
          keyExtractor={(item) => item.contactId}
          renderSectionHeader={this._renderSectionHeader}
        />
      </Container>
    );
  }
}
const {width} = Dimensions.get('window');
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
