import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import GiftedAvatar from './GiftedAvatar';
import PropTypes from 'prop-types';

export default class Avatar extends React.Component {
  render() {
    return (
        <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
            <GiftedAvatar
                avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
                user={this.props.currentMessage.user}
            />
        </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8,
    },
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
};

Avatar.defaultProps = {
  isSameDay: () => {},
  isSameUser: () => {},
  position: 'left',
  currentMessage: {
    user: null,
  },
  nextMessage: {},
  containerStyle: {},
  imageStyle: {},
};

Avatar.propTypes = {
  isSameDay: PropTypes.func,
  isSameUser: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: PropTypes.oneOfType([View.propTypes.style, Image.propTypes.style]),
};
