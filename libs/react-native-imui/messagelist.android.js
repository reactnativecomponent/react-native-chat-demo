'use strict';

import React from 'react';
import ReactNative from 'react-native';
const {requireNativeComponent, ViewPropTypes} = ReactNative;
import PropTypes from 'prop-types';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this._onLinkClick = this._onLinkClick.bind(this);
    this._onMsgClick = this._onMsgClick.bind(this);
    this._onClickChangeAutoScroll = this._onClickChangeAutoScroll.bind(this);
    this._onAvatarClick = this._onAvatarClick.bind(this);
    this._onStatusViewClick = this._onStatusViewClick.bind(this);
    this._onTouchMsgList = this._onTouchMsgList.bind(this);
    this._onClickScanImageView = this._onClickScanImageView.bind(this);
    this._onPullToRefresh = this._onPullToRefresh.bind(this);
  }

  _onMsgClick(event) {
    if (!this.props.onMsgClick) {
      return;
    }
    this.props.onMsgClick(event.nativeEvent.message);
  }
  _onLinkClick(event) {
    if (!this.props.onLinkClick) {
      return;
    }
    this.props.onLinkClick(event.nativeEvent.message);
  }
  _onClickChangeAutoScroll(event) {
    if (!this.props.onClickChangeAutoScroll) {
      return;
    }
    this.props.onClickChangeAutoScroll(event.nativeEvent.isAutoScroll);
  }

  _onAvatarClick(event) {
    if (!this.props.onAvatarClick) {
      return;
    }
    this.props.onAvatarClick(event.nativeEvent.message);
  }

  _onStatusViewClick(event) {
    if (!this.props.onStatusViewClick) {
      return;
    }
    this.props.onStatusViewClick(
      event.nativeEvent.message,
      event.nativeEvent.opt,
    );
  }

  _onClickScanImageView(event) {
    if (!this.props.onClickScanImageView) {
      return;
    }
    this.props.onClickScanImageView(event.nativeEvent);
  }
  _onTouchMsgList() {
    if (!this.props.onTouchMsgList) {
      return;
    }
    this.props.onTouchMsgList();
  }

  _onPullToRefresh() {
    if (!this.props.onPullToRefresh) {
      return;
    }
    this.props.onPullToRefresh();
  }

  render() {
    return (
      <RCTMessageList
        {...this.props}
        onLinkClick={this._onLinkClick}
        onMsgClick={this._onMsgClick}
        onAvatarClick={this._onAvatarClick}
        onClickChangeAutoScroll={this._onClickChangeAutoScroll}
        onStatusViewClick={this._onStatusViewClick}
        onTouchMsgList={this._onTouchMsgList}
        onClickScanImageView={this._onClickScanImageView}
        onPullToRefresh={this._onPullToRefresh}
      />
    );
  }
}

MessageList.propTypes = {
  initList: PropTypes.array,
  onLinkClick: PropTypes.func,
  onMsgClick: PropTypes.func,
  onClickChangeAutoScroll: PropTypes.func,
  onAvatarClick: PropTypes.func,
  onStatusViewClick: PropTypes.func,
  onTouchMsgList: PropTypes.func,
  onClickScanImageView: PropTypes.func,
  onPullToRefresh: PropTypes.func,

  sendBubble: PropTypes.object,
  receiveBubble: PropTypes.object,
  sendBubbleTextColor: PropTypes.string,
  receiveBubbleTextColor: PropTypes.string,
  sendBubbleTextSize: PropTypes.number,
  receiveBubbleTextSize: PropTypes.number,
  sendBubblePadding: PropTypes.object,
  receiveBubblePadding: PropTypes.object,
  dateTextSize: PropTypes.number,
  dateTextColor: PropTypes.string,
  datePadding: PropTypes.number,
  avatarSize: PropTypes.object,
  isShowDisplayName: PropTypes.bool,
  ...ViewPropTypes,
};

const RCTMessageList = requireNativeComponent('RCTMessageList', MessageList);
