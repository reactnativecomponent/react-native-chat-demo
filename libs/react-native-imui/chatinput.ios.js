import React, {Component} from 'react';
import {requireNativeComponent, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this._onFeatureView = this._onFeatureView.bind(this);
    this._onShowKeyboard = this._onShowKeyboard.bind(this);
    this._onChangeBarHeight = this._onChangeBarHeight.bind(this);
    this._onSendTextMessage = this._onSendTextMessage.bind(this);
    this._onSendRecordMessage = this._onSendRecordMessage.bind(this);
    this._onClickMention = this._onClickMention.bind(this);
  }
  _onFeatureView(event) {
    if (!this.props.onFeatureView) {
      return;
    }
    this.props.onFeatureView(
      event.nativeEvent.inputHeight,
      event.nativeEvent.showType,
    );
  }
  _onShowKeyboard(event) {
    if (!this.props.onShowKeyboard) {
      return;
    }
    this.props.onShowKeyboard(
      event.nativeEvent.inputHeight,
      event.nativeEvent.showType,
    );
  }
  _onChangeBarHeight(event) {
    if (!this.props.onChangeBarHeight) {
      return;
    }
    this.props.onChangeBarHeight(
      event.nativeEvent.inputHeight,
      event.nativeEvent.marginTop,
    );
  }
  _onSendTextMessage(event) {
    if (!this.props.onSendTextMessage) {
      return;
    }
    this.props.onSendTextMessage(
      event.nativeEvent.text,
      event.nativeEvent.IDArr,
    );
  }
  _onSendRecordMessage(event) {
    if (!this.props.onSendRecordMessage) {
      return;
    }
    this.props.onSendRecordMessage(event.nativeEvent.Path);
  }
  _onClickMention() {
    if (!this.props.onClickMention) {
      return;
    }
    this.props.onClickMention();
  }

  render() {
    return (
      <RNCustomInputViewApi
        {...this.props}
        onFeatureView={this._onFeatureView}
        onShowKeyboard={this._onShowKeyboard}
        onChangeBarHeight={this._onChangeBarHeight}
        onSendTextMessage={this._onSendTextMessage}
        onSendRecordMessage={this._onSendRecordMessage}
        onClickMention={this._onClickMention}
      />
    );
  }
}
ChatInput.propTypes = {
  ...ViewPropTypes,
  // menuViewH:PropTypes.number,
  defaultToolHeight: PropTypes.number,
  onFeatureView: PropTypes.func,
  onShowKeyboard: PropTypes.func,
  onChangeBarHeight: PropTypes.func,
  onSendTextMessage: PropTypes.func,
  onSendRecordMessage: PropTypes.func,
  onClickMention: PropTypes.func,
};
const RNCustomInputViewApi = requireNativeComponent(
  'RNCustomInputView',
  ChatInput,
);
