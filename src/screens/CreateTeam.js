/*
 * @Descripttion: 创建群聊
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:00:51
 */

import * as React from 'react';
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

export default function CreateTeamSrceen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {members = [], onSuccess} = route.params || {};
  let _listData = React.useRef([]);
  const [dataList, setDataList] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const _getIds = React.useCallback(() => {
    const arr = [];
    accounts.map((res) => {
      arr.push(res.contactId);
    });
    return arr;
  }, [accounts]);
  const _createTeam = React.useCallback(() => {
    const result = _getIds();
    if (members && members.length > 0) {
      result.push(members[0].contactId);
    }
    if (result.length > 0) {
      NimTeam.createTeam(
        {
          name: '群聊',
          introduce: '群介绍',
          verifyType: '0',
          inviteMode: '1',
          beInviteMode: '1',
          teamUpdateMode: '1',
        },
        '0',
        result,
      ).then((res) => {
        navigation.goBack();
        onSuccess && onSuccess(res);
      });
    }
  }, [navigation, members, onSuccess, _getIds]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons color="#037aff">
          <HeaderButtons.Item
            color="#037aff"
            title="取消"
            onPress={() => navigation.pop()}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons color="#037aff">
          <HeaderButtons.Item
            color="#037aff"
            title="确定"
            onPress={_createTeam}
          />
        </HeaderButtons>
      ),
    });
  }, [_createTeam, navigation]);

  React.useEffect(() => {
    NimFriend.getFriendList('').then((data) => {
      _listData.current = _formatData(data);
      setDataList(_listData.current);
    });
  }, []);
  const _getStatus = (data) => {
    let isSelect = false;
    members.map((res) => {
      if (data.contactId === res.contactId) {
        isSelect = true;
      }
    });
    return isSelect;
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
  const _select = React.useCallback(
    (res, sectionId, rowId) => {
      let newSelect = accounts;
      if (res.isSelect) {
        newSelect = _removeItem(newSelect, res);
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
    },
    [accounts],
  );
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
    return (
      <TouchableOpacity
        activeOpacity={1}
        row
        centerV
        paddingL-12
        style={{height: 50}}
        onPress={
          !_getStatus(item) ? () => _select(item, section.key, index) : null
        }>
        <Icon
          name={item.isSelect ? 'checkmark-circle' : 'radio-button-off'}
          size={20}
          style={{
            marginRight: 8,
            color: item.isSelect ? '#d82617' : '#ccc',
          }}
        />
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
    <View centerV paddingL-12 style={{height: 39}}>
      <Text>{section.key}</Text>
    </View>
  );
  console.log(dataList);
  return (
    <View flex>
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
        extraData={accounts}
        keyExtractor={(item, index) => item.contactId + index}
        renderSectionHeader={_renderSectionHeader}
      />
    </View>
  );
}

const {width} = Dimensions.get('window');

function _formatData(data) {
  const newList = [];
  const h = transform(data).sort();
  h.map((res) => {
    newList.push({
      key: res,
      data: data[res],
    });
  });
  return newList;
}
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
