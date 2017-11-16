import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
export default class Send extends React.Component {
  render() {
    if (this.props.text.trim().length > 0) {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.props.onSend({text: this.props.text.trim()}, true);
          }}
        >
          <Text style={[styles.text, this.props.textStyle]}>{this.props.label}</Text>
        </TouchableOpacity>
      );
    }
    return <View/>;
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
};

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
