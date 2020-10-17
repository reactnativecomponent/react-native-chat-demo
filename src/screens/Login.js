/*
 * @Descripttion: 登录
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:32:22
 */

import * as React from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import {View, Button} from 'react-native-ui-lib';
import {NimSession} from 'react-native-netease-im';
import {useNavigation} from '@react-navigation/native';
import md5 from '../utils/md5';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [name, setName] = React.useState('abc1');
  const [password, sePassword] = React.useState('123456');

  React.useEffect(() => {
    requestMultiple([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.ADD_VOICEMAIL,
    ]);
  }, []);

  const _loginIn = () => {
    NimSession.login(name, md5.createHash(password)).then(
      (res) => {
        global.imaccount = name;
        global.isLogin = true;
        navigation.replace('Main');
      },
      (err) => {
        console.warn(err);
      },
    );
  };
  const _renderContent = () => {
    return (
      <View style={styles.content}>
        <View style={[styles.inputView, styles.borderTop]}>
          <Text style={styles.inputLabel}>账户</Text>
          <TextInput
            style={styles.textViewStyle}
            value={name}
            underlineColorAndroid="transparent"
            placeholder="请输入帐号"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            onChangeText={(val) => setName(val)}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>密码</Text>
          <TextInput
            style={styles.textViewStyle}
            value={password}
            underlineColorAndroid="transparent"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            placeholder="请输入密码"
            onChangeText={(val) => sePassword(val)}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView alwaysBounceVertical={false} style={{backgroundColor: 'white'}}>
      {_renderContent()}
      <View style={styles.bottom}>
        <Button label="登录" onPress={_loginIn} />
      </View>
    </ScrollView>
  );
}
const borderWidth = StyleSheet.hairlineWidth;
const {height} = Dimensions.get('window');
const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: height / 2 - 250,
    padding: 12,
  },
  bottom: {
    padding: 12,
  },
  inputView: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingLeft: 9,
    paddingRight: 9,
    alignItems: 'center',
    borderBottomWidth: borderWidth,
    borderBottomColor: '#ccc',
    height: 41,
    borderLeftWidth: borderWidth,
    borderLeftColor: '#ccc',
    borderRightWidth: borderWidth,
    borderRightColor: '#ccc',
  },
  inputLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  textViewStyle: {
    flex: 1,
    fontSize: 14,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  borderTop: {
    borderTopWidth: borderWidth,
    borderTopColor: '#ccc',
  },
});
