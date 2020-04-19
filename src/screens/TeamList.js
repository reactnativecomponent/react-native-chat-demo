/*
 * @群组列表
 * @Author: huangjun
 * @Date: 2018-10-10 16:35:25
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:14:04
 */
import React from 'react';
import {NativeAppEventEmitter, Image} from 'react-native';
import {Container, ListItem, Text, Body} from 'native-base';
import {NimTeam} from 'react-native-netease-im';
import {FlatList} from 'react-native-gesture-handler';

export default class TeamList extends React.Component {
  static navigationOptions = (navigation) => ({
    title: '我的群聊',
  });
  constructor(props) {
    super(props);
    this.state = {
      ds: [],
    };
  }

  componentWillMount() {
    NimTeam.startTeamList();
  }
  componentDidMount() {
    this.friendListener = NativeAppEventEmitter.addListener(
      'observeTeam',
      (data) => {
        this.setState({
          ds: [],
        });
      },
    );
  }
  componentWillUnmount() {
    NimTeam.stopTeamList();
    this.friendListener && this.friendListener.remove();
  }
  toChat(res) {
    const {navigation} = this.props;
    navigation.popToTop();
    const session = {
      ...res,
      sessionType: '1',
      contactId: res.teamId,
    };
    navigator.push('Chat', {
      session,
      title: res.name,
    });
  }
  _renderRow = ({item}) => (
    <ListItem onPress={() => this.toChat(item)}>
      <Image
        style={{width: 35, height: 35}}
        source={
          item.avatar
            ? {uri: item.avatar}
            : require('../../images/discuss_logo.png')
        }
      />
      <Body>
        <Text>{item.name}</Text>
      </Body>
    </ListItem>
  );

  render() {
    return (
      <Container style={{flex: 1, backgroundColor: '#fff'}}>
        <FlatList
          style={{backgroundColor: '#fff'}}
          data={this.state.ds}
          renderItem={this._renderRow}
          keyExtractor={(item, index) => item + index}
        />
      </Container>
    );
  }
}
