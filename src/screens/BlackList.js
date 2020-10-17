/*
 * @黑名单列表
 * @Author: huangjun
 * @Date: 2018-10-10 16:22:07
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 15:09:29
 */
import React from 'react';
import {NimFriend} from 'react-native-netease-im';
import {NativeAppEventEmitter, FlatList} from 'react-native';
import Cell from '../components/Cell';

export default function BlackListScreen({navigation}) {
  const [dataList, setDataList] = React.useState([]);
  React.useEffect(() => {
    NimFriend.startBlackList();
    const _friendListener = NativeAppEventEmitter.addListener(
      'observeBlackList',
      (data) => {
        setDataList(data);
      },
    );
    return () => {
      NimFriend.stopBlackList();
      _friendListener.remove();
    };
  }, []);
  const _toFriendDetail = (id) => {
    NimFriend.getUserInfo(id).then((data) => {
      // this.props.navigator.push({
      //   screen: 'FeiMa.FriendSetting',
      //   title: '资料设置',
      //   passProps: {
      //     friendData: data,
      //   },
      // });
    });
  };
  const _renderItem = ({item}) => {
    return (
      <Cell
        source={
          item.avatar
            ? {uri: item.avatar}
            : require('../../images/discuss_logo.png')
        }
        onPress={() => _toFriendDetail(item.contactId)}
        iconLeftStyle={{width: 35, height: 35}}
        title={item.name}
      />
    );
  };
  return (
    <FlatList
      contentContainerStyle={{backgroundColor: 'white'}}
      data={dataList}
      renderItem={_renderItem}
    />
  );
}
