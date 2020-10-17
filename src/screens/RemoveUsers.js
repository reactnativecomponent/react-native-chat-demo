/*
 * @Descripttion: 把用户移出群聊
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:32:10
 */

import React, {useRef} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native-ui-lib';
import {NimTeam} from 'react-native-netease-im';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RemoveUsersScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [dataList, setDataList] = React.useState(route.params?.members);
  const [accounts, setAccounts] = React.useState([]);
  let _listData = useRef(route.params?.members);

  const _getIds = React.useCallback(() => {
    const arr = [];
    accounts.map((res) => {
      arr.push(res.contactId);
    });
    return arr;
  }, [accounts]);

  const _removeMember = React.useCallback(() => {
    const result = _getIds();
    if (result.length > 0) {
      NimTeam.removeMember(route.params?.teamId, result).then(() => {
        navigation.pop(2);
      });
    }
  }, [navigation, route.params.teamId, _getIds]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
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
            onPress={_removeMember}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, _removeMember]);

  const _select = (res, rowId) => {
    let newSelect = accounts;
    if (res.isSelect) {
      newSelect = _removeItem(newSelect, res);
    } else {
      newSelect.push(res);
    }
    _listData.current?.splice(rowId, 1, {
      ...res,
      isSelect: res.isSelect ? false : true,
    });
    setAccounts([...newSelect]);
    setDataList([..._listData.current]);
  };
  const _removeItem = (arr, item) => {
    let newList = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].contactId !== item.contactId) {
        newList.push(arr[i]);
      }
    }
    return newList;
  };
  const _renderSelect = () => {
    return accounts.map((res) => (
      <Image
        key={res.contactId}
        style={{width: 35, height: 35, marginRight: 5}}
        source={
          res.avatar ? {uri: res.avatar} : require('../images/discuss_logo.png')
        }
      />
    ));
  };
  const _renderRow = ({item, index}) => {
    return (
      <TouchableOpacity
        row
        centerV
        paddingL-12
        style={{height: 50}}
        activeOpacity={1}
        onPress={
          item.contactId !== global.imaccount
            ? () => _select(item, index)
            : null
        }>
        {item.contactId === global.imaccount ? (
          <Icon
            size={25}
            name="ios-checkmark-circle"
            style={{marginRight: 8, color: '#ccc'}}
          />
        ) : (
          <Icon
            size={25}
            name={
              item.isSelect ? 'ios-checkmark-circle' : 'ios-radio-button-off'
            }
            style={{marginRight: 8, color: item.isSelect ? '#d82617' : '#ccc'}}
          />
        )}
        <Image
          style={{width: 35, height: 35, marginRight: 12}}
          source={
            item.avatar
              ? {uri: item.avatar}
              : require('../images/discuss_logo.png')
          }
        />
        <View flex>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View flex style={{backgroundColor: '#f7f7f7'}}>
      <View
        style={{
          width,
          height: 51,
          backgroundColor: '#fff',
          justifyContent: 'center',
          paddingHorizontal: 8,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: '#eee',
        }}>
        <ScrollView
          horizontal
          style={{flex: 1}}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {_renderSelect()}
        </ScrollView>
      </View>

      <FlatList
        style={{backgroundColor: '#fff'}}
        data={dataList}
        renderItem={_renderRow}
        keyExtractor={(item) => item.contactId}
      />
    </View>
  );
}
const {width} = Dimensions.get('window');
