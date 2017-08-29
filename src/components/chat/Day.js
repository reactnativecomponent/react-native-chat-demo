import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {showTime} from '../../utils';

export default class Day extends React.Component {
    render() {
        if (!this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
            return (
                <View style={[styles.container, this.props.containerStyle]}>
                    <View style={[styles.wrapper, this.props.wrapperStyle]}>
                        <Text style={[styles.text, this.props.textStyle]}>
                            {showTime(this.props.currentMessage.createdAt)}
                        </Text>
                    </View>
                </View>
            );
        }
        return null;
    }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
     backgroundColor: '#cecece',
     borderRadius: 5,
     paddingLeft: 5,
     paddingRight: 5,
     paddingTop: 3,
     paddingBottom: 3,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
  },
});

Day.contextTypes = {
    getLocale: React.PropTypes.func,
};

Day.defaultProps = {
  isSameDay: () => {},
  currentMessage: {
    // TODO test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
};

Day.propTypes = {
  isSameDay: React.PropTypes.func,
  currentMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  wrapperStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
