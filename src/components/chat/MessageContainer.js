import React from 'react';

import {
    ListView,
    View,
    Text
} from 'react-native';

import shallowequal from '../../utils/showEqual';
import InfiniteScrollView from './InfiniteScrollView.js';
import md5 from '../../utils/md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {
    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderScrollComponent = this.renderScrollComponent.bind(this);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1.hash !== r2.hash;
            }
        });
        const messagesData = this.prepareMessages(props.messages);

        this.state = {
            dataSource: dataSource.cloneWithRows(messagesData.blob, messagesData.keys),
        };
    }
    prepareMessages(messages) {
        return {
            keys: messages.map(m => m._id),
            blob: messages.reduce((o, m, i) => {
                const previousMessage = messages[i + 1] || {};
                const nextMessage = messages[i - 1] || {};
                // add next and previous messages to hash to ensure updates
                const toHash = JSON.stringify(m) + previousMessage._id + nextMessage._id;
                o[m._id] = {
                    ...m,
                    previousMessage,
                    nextMessage,
                    hash: md5.createHash(toHash)
                };
                return o;
            }, {})
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!shallowequal(this.props, nextProps)) {
            return true;
        }
        if (!shallowequal(this.state, nextState)) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.messages === nextProps.messages) {
            return;
        }
        const messagesData = this.prepareMessages(nextProps.messages);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(messagesData.blob, messagesData.keys)
        });
    }


    scrollTo(options) {
        this._invertibleScrollViewRef.scrollTo(options);
    }

    renderRow(message, sectionId, rowId) {
        if (!message._id && message._id !== 0) {
            console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(message));
        }
        if (!message.user) {
            console.warn('GiftedChat: `user` is missing for message', JSON.stringify(message));
            message.user = {};
        }
        var position;
        if (message.notiObj && message.msgType === '5') {
            position = "center";
        } else {
            position = message.user._id === this.props.user._id ? 'right' : 'left';
        }
        const messageProps = {
            ...this.props,
            key: message._id,
            currentMessage: message,
            previousMessage: message.previousMessage,
            nextMessage: message.nextMessage,
            position: position,
        };

        if (this.props.renderMessage) {
            return this.props.renderMessage(messageProps);
        }
        return <Message {...messageProps}/>;
    }

    renderScrollComponent(props) {
        const invertibleScrollViewProps = this.props.invertibleScrollViewProps;
        return (
            <InfiniteScrollView
                {...props}
                {...invertibleScrollViewProps}
                ref={component => this._invertibleScrollViewRef = component}
            />
        );
    }

    render() {
        return (
            <View ref='container' style={{flex:1}}>
                <ListView
                    enableEmptySections={true}
                    keyboardShouldPersistTaps="always"
                    automaticallyAdjustContentInsets={false}
                    initialListSize={20}
                    pageSize={20}
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
                    dataSource={this.state.dataSource}

                    renderRow={this.renderRow}
                    renderScrollComponent={this.renderScrollComponent}

                    canLoadMore={this.props.canLoadMore}
                    onLoadMoreAsync={this.props.onLoadMoreAsync}
                />
            </View>
        );
    }
}

MessageContainer.defaultProps = {
    messages: [],
    user: {},
    renderMessage: null,
};

MessageContainer.propTypes = {
    messages: React.PropTypes.array,
    user: React.PropTypes.object,
    renderMessage: React.PropTypes.func,
};
