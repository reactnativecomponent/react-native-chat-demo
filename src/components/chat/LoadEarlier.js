import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
export default class LoadEarlier extends React.Component {
  renderLoading() {
    if (this.props.isLoadingEarlier === false) {
      return (
        <Text style={[styles.text, this.props.textStyle]}>
          {this.props.label}
        </Text>
      );
    }
    return (
      <View>
        <Text style={[styles.text, this.props.textStyle, {
            opacity: 0,
          }]}>
          {this.props.label}
        </Text>
        <ActivityIndicator
          color='white'
          size='small'
          style={[styles.activityIndicator, this.props.activityIndicatorStyle]}
        />
      </View>
    );
  }
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          if (this.props.onLoadMoreAsync) {
            this.props.onLoadMoreAsync();
          }
        }}
        disabled={this.props.isLoadingEarlier === true}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          {this.renderLoading()}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b2b2b2',
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 12,
  },
  activityIndicator: {
    marginTop: Platform.select({
      ios: -14,
      android: -16,
    }),
  }
});

LoadEarlier.defaultProps = {
  onLoadEarlier: () => {},
  isLoadingEarlier: false,
  label: '查看历史消息',
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  activityIndicatorStyle: {},
};

LoadEarlier.propTypes = {
  onLoadEarlier: PropTypes.func,
  isLoadingEarlier: PropTypes.bool,
  label: PropTypes.string,
  containerStyle: View.propTypes.style,
  wrapperStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
  activityIndicatorStyle: View.propTypes.style,
};
