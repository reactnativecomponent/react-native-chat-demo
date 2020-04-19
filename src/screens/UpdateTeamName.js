/*
 * @更新群组名称
 * @Author: huangjun
 * @Date: 2018-10-10 16:37:22
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:11:50
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import {Container, Text, Content, Item, Form, Input} from 'native-base';
import {NimTeam} from 'react-native-netease-im';
import {RNToasty} from 'react-native-toasty';
import {HeaderButtons} from 'react-navigation-header-buttons';

export default class UpdateTeamName extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '修改群组名称',
    headerRight: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          title="完成"
          color="#037aff"
          onPress={navigation.getParam('handlerDone')}
        />
      </HeaderButtons>
    ),
  });
  constructor(props) {
    super(props);
    const {teamData = {}} = props.navigation.state.params;
    this.state = {
      name: teamData.name || '',
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({
      handlerDone: this.submit,
    });
  }
  submit = () => {
    const {navigation} = this.props;
    const {teamData, onResult} = navigation.state.params;
    if (!this.state.name) {
      RNToasty.Show({
        title: '请填写群名称',
      });
      return;
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(this.state.name)) {
      RNToasty.Show({
        title: '不能包含特殊字符',
      });
      return;
    }
    const len = this.state.name.replace(/[^\x00-\xff]/g, 'aa').length;
    if (this.state.name && len > 16) {
      RNToasty.Show({
        title: '长度不能超过8个字符',
      });
      return;
    }

    NimTeam.updateTeamName(teamData.teamId, this.state.name).then(() => {
      navigation.pop();
      onResult && onResult();
    });
  };
  render() {
    return (
      <Container style={{backgroundColor: '#f7f7f7'}}>
        <Content>
          <Form style={{backgroundColor: '#fff'}}>
            <View style={{backgroundColor: '#f7f7f7', padding: 12}}>
              <Text note>群聊名称</Text>
            </View>
            <Item inlineLabel last>
              <Input
                value={this.state.name}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(name) => {
                  this.setState({name});
                }}
              />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}
