/*
 * @查询用户
 * @Author: huangjun
 * @Date: 2018-10-10 16:28:40
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:08:47
 */
import React, {Component} from 'react';
import {View, Platform, Image} from 'react-native';
import {
  Container,
  Text,
  Content,
  Button,
  Icon,
  Item,
  Body,
  ListItem,
  Input,
  Header,
} from 'native-base';
import {NimFriend} from 'react-native-netease-im';

export default class SearchScreen extends Component {
  static navigationOptions = (navigation) => ({
    title: '搜索',
    header: null,
  });

  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      account: '',
      result: [],
    };
  }
  _check() {
    NimFriend.fetchUserInfo(this.state.account).then((res) => {
      const arr = [];
      arr.push(res);
      this.setState({
        result: arr,
      });
    });
  }
  onSelectResult(data) {
    const {navigation} = this.props;
    navigation.goBack();
    navigation.push('FriendDetail', {
      friendData: data,
    });
  }
  _renderResult() {
    if (this.state.result && this.state.result.length > 0) {
      return this.state.result.map((res) => (
        <ListItem key={res.contactId} onPress={() => this.onSelectResult(res)}>
          <Image
            style={{width: 35, height: 35}}
            source={
              res.avatar
                ? {uri: res.avatar}
                : require('../images/discuss_logo.png')
            }
          />
          <Body>
            <Text>{res.name}</Text>
          </Body>
        </ListItem>
      ));
    }
    return null;
  }
  render() {
    return (
      <Container style={{backgroundColor: '#f7f7f7'}}>
        <Header searchBar rounded>
          <Item>
            <Icon active name="search" />
            <Input
              value={this.state.account}
              placeholder="手机号/帐号"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              clearButtonMode="while-editing"
              returnKeyType={Platform.OS === 'ios' ? 'search' : 'previous'}
              onChangeText={(account) => {
                this.setState({account});
              }}
              onSubmitEditing={() => this._check()}
            />
          </Item>
          <Button transparent onPress={() => this.props.navigation.pop()}>
            <Text>取消</Text>
          </Button>
        </Header>
        <Content>
          <View style={{backgroundColor: '#fff'}}>{this._renderResult()}</View>
        </Content>
      </Container>
    );
  }
}
