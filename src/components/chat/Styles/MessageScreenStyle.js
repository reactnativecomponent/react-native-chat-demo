// @flow

import {StyleSheet, PixelRatio,Dimensions} from 'react-native'
import {Colors, Metrics, Fonts} from '../Themes'
import {create} from './PlatformStyleSheet'
const {width,height}=Dimensions.get('window');

export default create({
    container: {
        flexDirection: 'column',
    },
    search: {
        //marginTop: 5,
        flexDirection: 'column',
        //paddingTop: 10,
        backgroundColor: Colors.white1,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.coolGrey50
    },
    inputRow: {
        flexDirection: 'row',
        backgroundColor: Colors.white1,
        justifyContent: 'center',
        alignItems:"center",
    },
    iconRow: {
        flexDirection: 'row',
        padding:15

    },
    actionIcon:{

    },
    iconTouch: {
        justifyContent:'center',
        alignItems:'center'
    },
    searchRow: {
        flex: 1,
        flexDirection: 'column',        
        //backgroundColor: Colors.snow,
        justifyContent: 'center',
        marginLeft:4,
    },
    searchInput: {
        borderRadius: 4,
        fontSize: 15,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.coolGrey190,
        backgroundColor:'#fff'
    },
    searchIcon: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    searchFocus: {
        flex: 0,
        width: 20,
        alignItems: 'center'
    },
    searchExtra: {
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchPlus: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendText: {
        ...Fonts.rowText,
        color: Colors.textRed,
        textAlign: 'center'
    },
    emojiRow: {
        backgroundColor: Colors.emojiBackground,
    },
    wrapper: {
        backgroundColor: Colors.emojiBackground,
    },
    slide: {
        height: 150,
        paddingTop: 15,
        paddingHorizontal: 15,
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    slideRow: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 30,
    },
    sendRow: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    emoji: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 25,
        paddingLeft: 4,
        paddingBottom: 1,
        // height: 30
        color: '#fff'
    },
    send: {
        marginRight: 12,
        paddingVertical: 8,
        width: 50,
    }
})
