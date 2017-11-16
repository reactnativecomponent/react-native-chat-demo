'use strict';

import React from 'react';
import {
    Platform,
    ScrollView,
    View,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import ScrollableMixin from 'react-native-scrollable-mixin';

import cloneReferencedElement from 'react-clone-referenced-element';

import DefaultLoadingIndicator from './DefaultLoadingIndicator';


//infinite && invertible
export default class InfiniteScrollView extends React.Component {
  static propTypes = {
    ...ScrollView.propTypes,
    distanceToLoadMore: PropTypes.number.isRequired,
    canLoadMore: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool,
    ]).isRequired,
    onLoadMoreAsync: PropTypes.func.isRequired,
    onLoadError: PropTypes.func,
    renderLoadingIndicator: PropTypes.func.isRequired,
    renderLoadingErrorIndicator: PropTypes.func.isRequired,
  };

  static defaultProps = {
    distanceToLoadMore: Platform.select({
      ios: -50,
      android: 54,
    }),
    canLoadMore: false,
    scrollEventThrottle: 100,
    renderLoadingIndicator: () => <DefaultLoadingIndicator />,
    renderLoadingErrorIndicator: () => <View />,
    renderScrollComponent: props => <ScrollView {...props} />,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isDisplayingError: false,
    };

    this._handleScroll = this._handleScroll.bind(this);
    this._loadMoreAsync = this._loadMoreAsync.bind(this);
  }

  getScrollResponder() {
    return this._scrollComponent.getScrollResponder();
  }

  setNativeProps(nativeProps) {
    this._scrollComponent.setNativeProps(nativeProps);
  }

  render() {
    let statusIndicator;

    if (this.state.isDisplayingError) {
      statusIndicator = React.cloneElement(
          this.props.renderLoadingErrorIndicator(
              { onRetryLoadMore: this._loadMoreAsync }
          ),
          { key: 'loading-error-indicator' },
      );
    } else if (this.state.isLoading) {
      statusIndicator = React.cloneElement(
          this.props.renderLoadingIndicator(),
          { key: 'loading-indicator' },
      );
    }

    let {
        inverted,
        renderScrollComponent,
        ...props,
        } = this.props;
    Object.assign(props, {
      onScroll: this._handleScroll,
      children: [this.props.children, statusIndicator],
    });

    if (inverted) {
      props.style = [styles.verticallyInverted, props.style];
      props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted);
    }

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component; },
    });
  }

  _renderInvertedChildren(children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });
  }

  _handleScroll(event) {
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }

    if (this._shouldLoadMore(event)) {
      this._loadMoreAsync().catch(error => {
        console.error('Unexpected error while loading more content:', error);
      });
    }
  }

  _shouldLoadMore(event) {
    let canLoadMore = (typeof this.props.canLoadMore === 'function') ?
        this.props.canLoadMore() :
        this.props.canLoadMore;


    return !this.state.isLoading &&
        canLoadMore &&
        !this.state.isDisplayingError &&
        this._distanceFromEnd(event) < this.props.distanceToLoadMore;
  }

  async _loadMoreAsync() {
    if (this.state.isLoading && __DEV__) {
      throw new Error('_loadMoreAsync called while isLoading is true');
    }

    try {
      this.setState({isDisplayingError: false, isLoading: true});
      await this.props.onLoadMoreAsync();
    } catch (e) {
      if (this.props.onLoadError) {
        this.props.onLoadError(e);
      }
      this.setState({isDisplayingError: true});
    } finally {
      this.setState({isLoading: false});
    }
  }

  _distanceFromEnd(event): number {
    let {
        contentSize,
        contentInset,
        contentOffset,
        layoutMeasurement,
        } = event.nativeEvent;

    let contentLength;
    let trailingInset;
    let scrollOffset;
    let viewportLength;
    if (this.props.horizontal) {
      contentLength = contentSize.width;
      trailingInset = contentInset.right;
      scrollOffset = contentOffset.x;
      viewportLength = layoutMeasurement.width;
    } else {
      contentLength = contentSize.height;
      trailingInset = contentInset.bottom;
      scrollOffset = contentOffset.y;
      viewportLength = layoutMeasurement.height;
    }

    return contentLength + trailingInset - scrollOffset - viewportLength;
  }
}



var styles = StyleSheet.create({
  verticallyInverted: {
    transform: [
      { scaleY: -1 },
    ],
  }
});
Object.assign(InfiniteScrollView.prototype, ScrollableMixin);
