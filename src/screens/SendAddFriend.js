/*
 * @Descripttion: 发送添加好友请求
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:52:07
 */

import * as React from 'react';
import HeaderButtons from 'react-navigation-header-buttons';
import {
  View,
  Text,
  TextField,
  KeyboardAwareScrollView,
} from 'react-native-ui-lib';
import {NimFriend} from 'react-native-netease-im';
import {RNToasty} from 'react-native-toasty';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function SendAddFriend() {
  const navigation = useNavigation();
  const route = useRoute();
  const {friendData = {}} = route.params || {};
  const [remark, setRemark] = React.useState('');

  const _submit = React.useCallback(() => {
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(remark)) {
      RNToasty.Show({
        title: '不能包含特殊字符',
      });
      return;
    }
    NimFriend.addFriend(friendData.contactId, remark).then(
      () => {
        RNToasty.Show({
          title: '已发送请求',
        });
        navigation.pop();
      },
      (err) => {
        RNToasty.Show({
          title: err,
        });
      },
    );
  }, [friendData, remark, navigation]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons color="#037aff">
          <HeaderButtons.Item title="发送" color="#037aff" onPress={_submit} />
        </HeaderButtons>
      ),
    });
  }, [_submit, navigation]);

  return (
    <KeyboardAwareScrollView>
      <View bg-white>
        <View style={{backgroundColor: '#f7f7f7', padding: 12}}>
          <Text note>你需要发送的请求,等对方通过</Text>
        </View>
        <TextField
          value={remark}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={(val) => setRemark(val)}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
