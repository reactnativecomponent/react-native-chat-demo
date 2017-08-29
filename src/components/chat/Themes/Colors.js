// @flow
import {Platform} from 'react-native'

// 不能使用rgb，必须rgba
const colors = {
  background: 'rgba(0, 0, 0, 0)',
  clear: 'rgba(0,0,0,0)',
  facebook: '#3b5998',
  transparent: 'rgba(0,0,0,0)',
  silver: '#F7F7F7',
  steel: '#CCCCCC',
  error: 'rgba(200, 0, 0, 0.8)',
  ricePaper: 'rgba(255,255,255, 0.75)',
  frost: '#D8D8D8',
  cloud: 'rgba(200,200,200, 0.35)',
  windowTint: 'rgba(0, 0, 0, 0.4)',
  panther: '#161616',
  charcoal: '#595959',
  coal: '#2d2d2d',
  bloodOrange: '#fb5f26',
  snow: 'white',
  ember: 'rgba(164, 0, 48, 0.5)',
  fire: '#e73536',
  drawer: 'rgba(30, 30, 29, 0.95)',
  login: 'rgba(61, 92, 120, 1)',
  coolGrey: '#adb9c1',
  coolGrey50: 'rgba(173, 185, 193, 0.5)',
  placeholderTextColor: '#adb9c1',
  selectionColor: '#404f5a',
  almostBlack: 'rgba(12, 18, 24, 1)',
  almostWhite: 'rgba(255, 255, 255, 0.7)',
  centerLine: '#4a4a4a',
  andBgStart: '#3e5c78',
  andBgEnd: '#243e55',
  buttonSignin: '#00ba6e',
  modelHeaderText: 'rgba(0, 186, 110, 1)',
  button: '#adb9c1',
  frogGreen: 'rgba(82, 210, 0, 1)',
  iconColor: '#8798a4',
  blueGrey: 'rgba(135, 152, 164, 1)',
  denim: 'rgba(64, 94, 122, 1)',
  buttonGreen: '#08ba6e',
  buttonGrey: '#8798a4',
  steelGrey: 'rgba(112, 126, 137, 1)',
  paleGrey: 'rgba(228, 233, 236, 1)',
  white1: 'rgba(250, 251, 252, 1)',
  orangeRed: 'rgba(255, 59, 48, 1)',
  coolGrey190: 'rgba(190, 190, 190, 1)',
  textRed: 'rgba(0, 186, 110, 1)',
  paleGreyTwo: 'rgba(236, 239, 241, 1)',
  messageSelf: 'rgba(0, 186, 110, 1)',
  emojiBackground: '#e8ebef'
}
const colorsIos = {}

const colorsAndroid = {}

export default Object.assign(colors, (Platform.OS == 'ios' ? colorsIos : colorsAndroid))
