/*
 * @群组移除用户
 * @Author: huangjun
 * @Date: 2018-10-10 16:26:48
 * @Last Modified by: huangjun
 * @Last Modified time: 2018-10-10 16:40:13
 */
import React from 'react'
import { View, ListView, Image, ScrollView, Dimensions } from 'react-native'
import { Container, Icon, ListItem, Text, Body } from 'native-base'
import { NimTeam } from 'react-native-netease-im'

export default class RemoveUsers extends React.Component {
  static navigatorStyle = {
    statusBarTextColorScheme: 'light',
    StatusBarColor: '#444',
    tabBarHidden: true,
    navBarBackgroundColor: '#444',
    navBarButtonColor: '#fff',
    navBarTextColor: '#fff',
  }
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'cancel',
        buttonColor: '#fff',
        title: '取消',
      },
    ],
    rightButtons: [
      {
        id: 'del',
        buttonColor: '#fff',
        title: '确定',
      },
    ],
  }
  // 构造
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = {
      ds: ds.cloneWithRows(props.members),
      selectAccounts: [],
    }
    this.listData = props.members
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
  }
  _onNavigatorEvent(event) {
    const { navigator, teamId, onResult } = this.props
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'del') {
        const result = this.getIds()
        if (result.length > 0) {
          NimTeam.removeMember(teamId, result).then(() => {
            onResult && onResult()
          })
        }
      }
      if (event.id === 'cancel') {
        navigator.dismissModal()
      }
    }
  }
  getIds() {
    const arr = []
    this.state.selectAccounts.map(res => {
      arr.push(res.contactId)
    })
    return arr
  }
  _select(res) {
    const newSelect = this.state.selectAccounts
    if (res.isSelect) {
      newSelect.splice(newSelect.indexOf(res), 1)
    } else {
      newSelect.push(res)
    }
    this.setState({
      selectAccounts: newSelect,
      ds: this.state.ds.cloneWithRows(this.formatList(this.listData, res)),
    })
  }
  formatList(list, obj) {
    const ne = []
    list.map(res => {
      if (res.contactId === obj.contactId) {
        ne.push({
          ...res,
          isSelect: !res.isSelect,
        })
      } else {
        ne.push(res)
      }
    })
    this.listData = ne
    return ne
  }
  _renderSelect() {
    return this.state.selectAccounts.map(res => (
      <Image
        key={res.contactId}
        style={{ width: 35, height: 35, marginRight: 5 }}
        source={
            res.avatar
              ? { uri: res.avatar }
              : require('../images/discuss_logo.png')
          }
      />
    ))
  }
  _renderRow = (res, sectionID, rowId) => (
    <ListItem
      key={res.contactId}
      onPress={() => this._select(res, sectionID, rowId)}
    >
      <Icon
        name={res.isSelect ? 'ios-checkmark-circle' : 'ios-radio-button-off'}
        style={{ marginRight: 8, color: res.isSelect ? '#d82617' : '#ccc' }}
      />
      <Image
        style={{ width: 35, height: 35 }}
        source={
            res.avatar
              ? { uri: res.avatar }
              : require('../images/discuss_logo.png')
          }
      />
      <Body>
        <Text>{res.name}</Text>
      </Body>
    </ListItem>
  )
  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
        <View
          style={{
            width,
            height: 51,
            backgroundColor: '#fff',
            justifyContent: 'center',
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#c9c9c9',
          }}
        >
          <ScrollView
            horizontal
            style={{ flex: 1 }}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {this._renderSelect()}
          </ScrollView>
        </View>

        <ListView
          style={{ backgroundColor: '#fff', flex: 1 }}
          dataSource={this.state.ds}
          renderRow={this._renderRow}
          enableEmptySections
          removeClippedSubviews
        />
      </Container>
    )
  }
}
const { width } = Dimensions.get('window')
