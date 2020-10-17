/*
 * @Descripttion: 邀请好友进群
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:30:55
 */

import React, {useRef} from 'react';
import {
  SectionList,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native-ui-lib';
import {NimTeam, NimFriend} from 'react-native-netease-im';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SelectUsersScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {teamId, onResult, members = []} = route.params || {};
  const [dataList, setDataList] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  let _listData = useRef([]);

  const _addMembers = React.useCallback(() => {
    const result = accounts.map((res) => {
      return res.contactId;
    });
    if (result.length > 0) {
      NimTeam.addMembers(teamId, result).then(() => {
        onResult && onResult();
        navigation.pop(2);
      });
    }
  }, [accounts, onResult, teamId, navigation]);
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
            onPress={_addMembers}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, _addMembers]);

  React.useEffect(() => {
    NimFriend.getFriendList('').then((data) => {
      _listData.current = formatData(data);
      setDataList(_listData.current);
    });
  }, []);

  const formatData = (data) => {
    const newList = [];
    const h = transform(data).sort();
    h.map((res) => {
      newList.push({
        key: res,
        data: data[res],
      });
    });
    return newList;
  };
  const _getStatus = (data) => {
    let isSelect = false;
    members.map((res) => {
      if (data.contactId === res.contactId) {
        isSelect = true;
      }
    });
    return isSelect;
  };
  const _select = (res, sectionId, rowId) => {
    const newSelect = accounts;
    if (res.isSelect) {
      newSelect.splice(newSelect.indexOf(res), 1);
    } else {
      newSelect.push(res);
    }
    _listData.current?.map((sectionList) => {
      if (sectionList.key === sectionId) {
        sectionList.data.splice(rowId, 1, {
          ...res,
          isSelect: res.isSelect ? false : true,
        });
      }
    });
    setAccounts([...newSelect]);
    setDataList([..._listData.current]);
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
  const _renderRow = ({item, section, index}) => {
    console.log(item);
    return (
      <TouchableOpacity
        row
        centerV
        paddingL-12
        style={{height: 50}}
        activeOpacity={1}
        onPress={
          !_getStatus(item) ? () => _select(item, section.key, index) : null
        }>
        {_getStatus(item) ? (
          <Icon
            size={25}
            name="ios-checkmark-circle"
            style={{marginRight: 8, color: '#ccc'}}
          />
        ) : (
          <Icon
            name={
              item.isSelect ? 'ios-checkmark-circle' : 'ios-radio-button-off'
            }
            style={{marginRight: 8, color: item.isSelect ? '#d82617' : '#ccc'}}
            size={25}
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
  const _renderSectionHeader = ({section}) => (
    <View centerV style={{height: 38}} paddingL-15>
      <Text>{section.key}</Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
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
      <SectionList
        style={{backgroundColor: '#fff'}}
        sections={dataList}
        renderItem={_renderRow}
        keyExtractor={(item) => item.contactId}
        renderSectionHeader={_renderSectionHeader}
      />
    </View>
  );
}
const {width} = Dimensions.get('window');
function transform(obj) {
  const arr = [];
  for (const item in obj) {
    arr.push(item);
  }
  arr.sort(mySorter);
  return arr;
}
function mySorter(a, b) {
  if (/^\d/.test(a) !== /^\D/.test(b)) {
    return a > b ? 1 : (a = b ? 0 : -1);
  }
  return a > b ? -1 : a === b ? 0 : 1;
}
