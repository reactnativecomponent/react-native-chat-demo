/*
 * @群组移除用户
 * @Author: huangjun
 * @Date: 2018-10-10 16:26:48
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:08:17
 */
import React from 'react';
import {View, FlatList, Image, ScrollView, Dimensions} from 'react-native';
import {Container, Icon, ListItem, Text, Body} from 'native-base';
import {NimTeam} from 'react-native-netease-im';
import {HeaderButtons} from 'react-navigation-header-buttons';

export default class RemoveUsers extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: '移除群聊',
    headerLeft: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          title="取消"
          color="#037aff"
          onPress={() => navigation.pop()}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          title="确定"
          color="#037aff"
          onPress={navigation.getParam('handlerSubmit')}
        />
      </HeaderButtons>
    ),
  });
  // 构造
  constructor(props) {
    super(props);
    const {params = {}} = props.navigation.state;
    this.state = {
      data: params.members,
      selectAccounts: [],
    };
    this.listData = params.members;
  }
  componentDidMount() {
    this.props.navigation.setParams({
      handlerSubmit: this.removeMember,
    });
  }
  removeMember = () => {
    const {navigation} = this.props;
    const {teamId, onResult} = navigation.state.params;
    const result = this.getIds();
    if (result.length > 0) {
      NimTeam.removeMember(teamId, result).then(() => {
        onResult && onResult();
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
  _select(res, rowId) {
    let newSelect = this.state.selectAccounts;
    if (res.isSelect) {
      newSelect = this.removeItem(newSelect, res);
    } else {
      newSelect.push(res);
    }
    this.listData.splice(rowId, 1, {
      ...res,
      isSelect: res.isSelect ? false : true,
    });
    this.setState({
      selectAccounts: newSelect,
      data: this.listData,
    });
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
  formatList(list, obj) {
    const ne = [];
    list.map((res) => {
      if (res.contactId === obj.contactId) {
        ne.push({
          ...res,
          isSelect: !res.isSelect,
        });
      } else {
        ne.push(res);
      }
    });
    this.listData = ne;
    return ne;
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
  _renderRow = ({item, index}) => {
    if (item.contactId === global.imaccount) {
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
      <ListItem onPress={() => this._select(item, index)}>
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

        <FlatList
          style={{backgroundColor: '#fff'}}
          data={this.state.data}
          renderItem={this._renderRow}
          keyExtractor={(item) => item.contactId}
        />
      </Container>
    );
  }
}
const {width} = Dimensions.get('window');
