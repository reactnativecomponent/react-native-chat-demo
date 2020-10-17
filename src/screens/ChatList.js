/*
 * @会话列表
 * @Author: huangjun
 * @Date: 2018-10-10 16:21:58
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 15:46:00
 */
import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  FlatList,
  NativeAppEventEmitter,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NimSession} from 'react-native-netease-im';
import {HeaderButtons} from 'react-navigation-header-buttons';
import SwipeableRow from '../components/SwipeableRow';

export default function ChatListScreen() {
  const navigation = useNavigation();
  const _createTeam = React.useCallback(() => {
    navigation.push('CreateTeam', {
      onSuccess(res) {
        navigation.push('Chat', {
          session: {
            contactId: res.teamId,
            name: '群聊',
            sessionType: '1',
          },
          title: '群聊',
        });
      },
    });
  }, [navigation]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons color="#037aff">
          <HeaderButtons.Item
            color="#037aff"
            title="朋友"
            onPress={() => navigation.push('FriendList')}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons color="#037aff">
          <HeaderButtons.Item
            color="#037aff"
            title="创建群聊"
            onPress={_createTeam}
          />
        </HeaderButtons>
      ),
    });
  }, [_createTeam, navigation]);

  const [dataList, setDataList] = React.useState([]);
  React.useEffect(() => {
    const _sessionListener = NativeAppEventEmitter.addListener(
      'observeRecentContact',
      (data) => {
        setDataList(data.recents);
        console.info('会话列表', data);
      },
    );
    return () => {
      _sessionListener.remove();
    };
  }, []);
  const _onItemPress = (data) => {
    navigation.push('Chat', {
      title: data.name,
      session: data,
    });
  };
  const _delete = (contactId) => {
    NimSession.deleteRecentContact(contactId);
  };

  const _addFriend = () => {
    navigation.push('SearchScreen');
  };
  const _renderSeparator = () => <View style={styles.line} />;
  const _renderItem = ({item}) => (
    <View>
      <SwipeableRow id={item.contactId} onDelActionsPress={_delete}>
        <TouchableHighlight onPress={() => _onItemPress(item)}>
          <View style={[styles.row, styles.last]}>
            <Image
              style={styles.logo}
              source={
                item.imagePath
                  ? {uri: item.imagePath}
                  : require('../images/discuss_logo.png')
              }
            />
            <View style={styles.content}>
              <View style={[styles.crow]}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.name}
                </Text>

                <Text style={styles.time}> {item.time}</Text>
              </View>
              <View style={[styles.crow, {marginTop: 3}]}>
                <Text style={styles.desc} numberOfLines={1}>
                  {(item.unreadCount > 0 ? `[${item.unreadCount}条]` : '') +
                    item.content}
                </Text>
              </View>
            </View>
            {parseInt(item.unreadCount, 10) > 0 ? (
              <View style={styles.badge} />
            ) : null}
          </View>
        </TouchableHighlight>
      </SwipeableRow>
    </View>
  );
  return (
    <FlatList
      style={styles.list}
      data={dataList}
      keyExtractor={(item) => item.contactId}
      renderItem={_renderItem}
      ItemSeparatorComponent={_renderSeparator}
      ListHeaderComponent={_renderSeparator}
      ListFooterComponent={_renderSeparator}
    />
  );
}

const {width} = Dimensions.get('window');
const px = 9;
const borderWidth = StyleSheet.hairlineWidth;
const styles = StyleSheet.create({
  list: {
    borderTopWidth: borderWidth,
    borderTopColor: '#fafafa',
    borderBottomWidth: borderWidth,
    borderBottomColor: '#fafafa',
  },
  row: {
    paddingLeft: px,
    paddingVertical: px,
    borderBottomWidth: borderWidth,
    borderBottomColor: '#c9c9c9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 1,
    backgroundColor: '#fff',
  },
  last: {
    borderBottomWidth: 0,
  },

  logo: {
    width: 50,
    height: 50,
    marginRight: px,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 45,
    marginRight: 3,
    flex: 1,
  },
  crow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,

    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    lineHeight: 19,
    overflow: 'hidden',
    color: '#333333',
  },
  time: {
    fontSize: 10,
    color: '#9d9d9e',
  },
  desc: {
    fontSize: 13,
    color: '#9d9d9e',
    overflow: 'hidden',
  },
  rowBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  line: {
    height: borderWidth,
    width: width - 8,
    backgroundColor: '#c9c9c9',
    marginLeft: 8,
  },
  deleteBtn: {
    height: 67,
    width: 75,
    backgroundColor: '#d82617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 26,
    height: 26,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    position: 'absolute',
    left: 55,
    top: 7,
  },
});
