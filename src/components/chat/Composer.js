import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
export default class Composer extends React.Component {
  render() {
    return (
      <TextInput
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={this.props.multiline}
        onChange={(e) => {
          this.props.onChange(e);
        }}
        style={[styles.textInput, this.props.textInputStyle, {
          height: this.props.composerHeight,
        }]}
        value={this.props.text}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        {...this.props.textInputProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    marginTop: Platform.select({
      ios: 8,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
});

Composer.defaultProps = {
  onChange: () => {},
  composerHeight: Platform.select({
    ios: 33,
    android: 41,
  }), // TODO SHARE with GiftedChat.js and tests
  text: '',
  placeholder: '',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
};

Composer.propTypes = {
  onChange: PropTypes.func,
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  multiline: PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
};
