/*
 * @群组列表
 * @Author: huangjun
 * @Date: 2018-10-10 16:35:25
 * @Last Modified by: huangjun
 * @Last Modified time: 2019-03-26 17:14:27
 */
import React from 'react'
import {
  NativeAppEventEmitter,
  ListView,
  Image,
} from 'react-native'
import { Container, ListItem, Text, Body } from 'native-base'
import { NimTeam } from 'react-native-netease-im'

export default class TeamList extends React.Component {

  static navigationOptions = (navigation) => ({
    title: '我的群聊',
  })
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = {
      ds: ds.cloneWithRows([]),
    }
  }

  componentWillMount() {
    NimTeam.startTeamList()
  }
  componentDidMount() {
    this.friendListener = NativeAppEventEmitter.addListener(
      'observeTeam',
      data => {
        console.log(data)
        this.setState({
          ds: this.state.ds.cloneWithRows(data),
        })
      },
    )
  }
  componentWillUnmount() {
    NimTeam.stopTeamList()
    this.friendListener && this.friendListener.remove()
  }
  toChat(res) {
    const { navigation } = this.props
    navigation.popToTop()
    const session = {
      ...res,
      sessionType: '1',
      contactId: res.teamId,
    }
    navigator.push('Chat', {
      session,
      title: res.name,
    })
  }
  _renderRow = (res) => (
    <ListItem onPress={() => this.toChat(res)}>
      <Image
        style={{ width: 35, height: 35 }}
        source={
            res.avatar
              ? { uri: res.avatar }
              : require('../../images/discuss_logo.png')
          }
      />
      <Body>
        <Text>{res.name}</Text>
      </Body>
    </ListItem>
  )

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: '#fff' }}>
        <ListView
          style={{ backgroundColor: '#fff' }}
          dataSource={this.state.ds}
          renderRow={this._renderRow}
          enableEmptySections
          removeClippedSubviews
        />
      </Container>
    )
  }
}
