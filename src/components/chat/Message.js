import React from 'react';
import {
    View,
    Image,
    StyleSheet,Text
} from 'react-native';

import moment from 'moment';

import Avatar from './Avatar';
import Bubble from './Bubble';
import Day from './Day';


export default class Message extends React.Component {

    isSameDay(currentMessage = {}, diffMessage = {}) {
        let diff = 0;
        if (diffMessage.createdAt && currentMessage.createdAt) {
            //diff = Math.abs(moment(diffMessage.createdAt).startOf('milliseconds').diff(moment(currentMessage.createdAt).startOf('milliseconds'), 'ms'));
            diff = currentMessage.createdAt.getTime() - diffMessage.createdAt.getTime();
            //console.info(diff)
        } else {
            diff = 7000*6;
        }
        if (diff < 7000*6) {
            return true;
        }
        return false;
    }

    isSameUser(currentMessage = {}, diffMessage = {}) {
        if (diffMessage.user && currentMessage.user) {
            if (diffMessage.user._id === currentMessage.user._id) {
                return true;
            }
        }
        return false;
    }

    renderDay() {
        if (this.props.currentMessage.createdAt) {
            const {containerStyle, ...other} = this.props;
            const dayProps = {
                ...other,
                isSameUser: this.isSameUser,
                isSameDay: this.isSameDay,
            };
            if (this.props.renderDay) {
                return this.props.renderDay(dayProps);
            }
            return <Day {...dayProps}/>;
        }
        return null;
    }

    renderBubble() {
        const {containerStyle, ...other} = this.props;
        const bubbleProps = {
            ...other,
            isSameUser: this.isSameUser,
            isSameDay: this.isSameDay,
        };
        return <Bubble {...bubbleProps}/>;
    }

    renderAvatar() {
        const {containerStyle, ...other} = this.props;
        const avatarProps = {
            ...other,
            isSameUser: this.isSameUser,
            isSameDay: this.isSameDay,
        };

        return <Avatar {...avatarProps}/>;
    }
    renderName(){
        const {currentMessage,session} = this.props;
        if(session.sessionType === '1' && this.props.position === 'left'){
            return (
                <View style={{flexDirection:'column'}}>
                    <Text style={{color:'#666666',fontSize:10,marginBottom:3}}>{currentMessage.user.fromNick}</Text>
                    {this.renderBubble()}
                </View>
            )
        }
        return this.renderBubble();
    }
    render() {
        return (
            <View>
                {this.renderDay()}
                <View style={[styles[this.props.position].container, {
                        marginBottom: this.isSameUser(this.props.currentMessage, this.props.nextMessage) ? 12 : 12,
                    }, this.props.containerStyle[this.props.position]]}>
                    {this.props.position === 'left' ? this.renderAvatar() : null}
                    {this.renderName()}
                    {this.props.position === 'right' ? this.renderAvatar() : null}
                </View>
            </View>
        );
    }
}

const styles = {
    left: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginLeft: 8,
            marginRight: 0,
        },
    }),
    right: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            marginLeft: 0,
            marginRight: 8,
        },
    }),
    center: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
};

Message.defaultProps = {
    renderAvatar: null,
    renderBubble: null,
    renderDay: null,
    position: 'left',
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
};

Message.propTypes = {
    renderAvatar: React.PropTypes.func,
    renderBubble: React.PropTypes.func,
    renderDay: React.PropTypes.func,
    position: React.PropTypes.oneOf(['left', 'right', 'center']),
    currentMessage: React.PropTypes.object,
    nextMessage: React.PropTypes.object,
    previousMessage: React.PropTypes.object,
    user: React.PropTypes.object,
    containerStyle: React.PropTypes.shape({
        left: View.propTypes.style,
        right: View.propTypes.style,
    }),
};
