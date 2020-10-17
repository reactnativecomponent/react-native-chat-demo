import React from 'react';
import {
  Dimensions,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Layout = {
  window: {
    width: Dimensions.get('window').width,
  },
};
const SearchContainerHorizontalMargin = 10;
const SearchContainerWidth =
  Layout.window.width - SearchContainerHorizontalMargin * 2;

const SearchIcon = () => (
  <View style={styles.searchIconContainer}>
    <Ionicons name="ios-search" size={18} color="#999" />
  </View>
);

class PlaceholderButtonSearchBar extends React.PureComponent {
  static defaultProps = {
    placeholder: '查找账号',
    placeholderTextColor: '#999',
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          hitSlop={{top: 10, left: 10, bottom: 5, right: 10}}
          onPress={this.props.onPress}>
          <View
            style={[styles.searchContainer, {flex: 1}]}
            pointerEvents="box-only">
            <TextInput
              editable={false}
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              selectionColor={this.props.selectionColor}
              style={styles.searchInput}
              underlineColorAndroid="transparent"
            />

            <SearchIcon />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

class SearchBar extends React.PureComponent {
  state = {
    text: this.props.text || '',
    showCancelButton: false,
    inputWidth: SearchContainerWidth,
    visible: false,
  };

  _textInput;

  componentDidMount() {
    requestAnimationFrame(() => {
      this._textInput.focus();
    });
  }

  _handleLayoutCancelButton = (e) => {
    if (this.state.showCancelButton) {
      return;
    }

    const cancelButtonWidth = e.nativeEvent.layout.width;
    requestAnimationFrame(() => {
      LayoutAnimation.configureNext({
        duration: 200,
        create: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 0.9,
          initialVelocity: 10,
        },
      });

      this.setState({
        showCancelButton: true,
        inputWidth: SearchContainerWidth - cancelButtonWidth,
      });
    });
  };

  render() {
    let {inputWidth, showCancelButton} = this.state;
    let searchInputStyle = {};
    if (this.props.textColor) {
      searchInputStyle.color = this.props.textColor;
    }
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.searchContainer,
            {width: inputWidth, paddingLeft: 32},
          ]}>
          <TextInput
            ref={(view) => {
              this._textInput = view;
            }}
            clearButtonMode="while-editing"
            onChangeText={this._handleChangeText}
            value={this.state.text}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            placeholder="请输入搜索内容"
            placeholderTextColor={this.props.placeholderTextColor || '#999'}
            onSubmitEditing={this._handleSubmit}
            style={[styles.searchInput, searchInputStyle]}
          />

          <SearchIcon />
        </View>

        <View
          key={
            showCancelButton
              ? 'visible-cancel-button'
              : 'layout-only-cancel-button'
          }
          style={[styles.buttonContainer, {opacity: showCancelButton ? 1 : 0}]}>
          <TouchableOpacity
            style={styles.button}
            hitSlop={{top: 15, bottom: 15, left: 15, right: 20}}
            onLayout={this._handleLayoutCancelButton}
            onPress={this._handlePressCancelButton}>
            <Text
              style={{
                fontSize: 17,
                color: this.props.tintColor || '#007AFF',
              }}>
              {this.props.cancelButtonText || '取消'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _handleChangeText = (text) => {
    this.setState({text});
    this.props.onChangeQuery && this.props.onChangeQuery(text);
  };

  _handleSubmit = () => {
    let {text} = this.state;
    this.props.onSubmit && this.props.onSubmit(text);
    this._textInput.blur();
  };

  _handlePressCancelButton = () => {
    if (this.props.onCancelPress) {
      this.props.onCancelPress();
    } else {
      this.props.navigation.pop();
    }
  };
}

export const PlaceholderSearchButton = PlaceholderButtonSearchBar;
export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingRight: 17,
    paddingLeft: 2,
  },
  searchContainer: {
    height: 30,
    width: SearchContainerWidth,
    backgroundColor: '#f6f6f6',
    borderRadius: 15,
    marginHorizontal: SearchContainerHorizontalMargin,
    marginTop: 10,
    paddingLeft: 32,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 12,
    top: 6,
    bottom: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    textAlignVertical: 'center',
    includeFontPadding: false,
    letterSpacing: 0,
    paddingVertical: 5,
    color: '#333',
  },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
    justifyContent: 'flex-end',
  },
});
