/*
 * @Descripttion: 修改群组名称
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:35:10
 */

import * as React from 'react';
import {
  View,
  Text,
  TextField,
  KeyboardAwareScrollView,
} from 'react-native-ui-lib';
import {NimTeam} from 'react-native-netease-im';
import {RNToasty} from 'react-native-toasty';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function UpdateTeamNameScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {teamData = {}, onResult} = route.params || {};
  const [name, setName] = React.useState(teamData.name || '');

  const _submit = React.useCallback(() => {
    if (!name) {
      RNToasty.Show({
        title: '请填写群名称',
      });
      return;
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(name)) {
      RNToasty.Show({
        title: '不能包含特殊字符',
      });
      return;
    }
    const len = name.replace(/[^\x00-\xff]/g, 'aa').length;
    if (name && len > 16) {
      RNToasty.Show({
        title: '长度不能超过8个字符',
      });
      return;
    }
    NimTeam.updateTeamName(teamData.teamId, name).then(() => {
      navigation.pop();
      onResult && onResult();
    });
  }, [navigation, name, onResult, teamData]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons color="#037aff">
          <HeaderButtons.Item title="完成" color="#037aff" onPress={_submit} />
        </HeaderButtons>
      ),
    });
  }, [navigation, _submit]);

  return (
    <KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
      <View style={{backgroundColor: '#f7f7f7', padding: 12}}>
        <Text note>群聊名称</Text>
      </View>
      <View bg-white marginT-10>
        <TextField
          style={{paddingLeft: 15}}
          value={name}
          placeholder="请输入帐号"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={(val) => setName(val)}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
