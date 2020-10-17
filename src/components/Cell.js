/*
 * @Descripttion:
 * @Author: huangjun
 * @Date: 2020-04-29 09:25:37
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-16 18:01:05
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, Image, Colors} from 'react-native-ui-lib';
import {RectButton} from 'react-native-gesture-handler';

const Cell = ({
  source,
  value,
  title,
  titleLeft,
  titleAfter,
  desc,
  onPress,
  border = true,
  containerStyle,
  valueColor,
  titleStyle,
  valueStyle,
  arrowIconSize,
  renderRight,
  iconLeftStyle,
}) => {
  const WrapComponet = onPress ? RectButton : View;
  return (
    <View style={[styles.wrap, containerStyle]}>
      <WrapComponet
        activeOpacity={1}
        underlayColor="rgb(242, 242, 242)"
        style={[styles.item]}
        onPress={onPress}>
        <View style={styles.cellContent}>
          {source && (
            <Image style={[styles.icon, iconLeftStyle]} source={source} />
          )}
          <View style={styles.body}>
            <View row centerV>
              <Text t14 fdark style={titleStyle}>
                {titleLeft && (
                  <Text numberOfLines={1} style={styles.bold} marginR-12>
                    {titleLeft}
                  </Text>
                )}
              </Text>
              <Text t14 fdark style={titleStyle} suppressHighlighting>
                {title}
              </Text>
              {titleAfter && (
                <Text numberOfLines={1} marginR-12 t13 hdark>
                  {titleAfter}
                </Text>
              )}
            </View>
            {desc && (
              <Text t12 c9 marginT-5 numberOfLines={1}>
                {desc}
              </Text>
            )}
          </View>
          {renderRight ? (
            renderRight
          ) : (
            <View style={styles.right}>
              {value && (
                <Text
                  suppressHighlighting
                  t14
                  dark30
                  marginR-5
                  numberOfLines={1}
                  style={[valueColor && {color: valueColor}, valueStyle]}>
                  {value}
                </Text>
              )}
              {onPress && (
                <Image
                  source={require('../images/arrow_right.png')}
                  resizeMode="contain"
                  style={[
                    styles.arrow,
                    arrowIconSize && {width: arrowIconSize},
                  ]}
                />
              )}
            </View>
          )}
        </View>
      </WrapComponet>
      {border && <View style={styles.line} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'white',
    height: 50,
    width: '100%',
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
    marginLeft: 17,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',

    paddingLeft: 12,
    paddingRight: 12,
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 5,
  },
  cellContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  arrow: {
    tintColor: Colors.rgba(Colors.black, 0.3),
    width: 12,
    height: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default Cell;
