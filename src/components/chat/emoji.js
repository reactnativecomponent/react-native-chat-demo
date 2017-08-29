var emoji = require('node-emoji')
var emojis = [
    'grinning',
    'smiley',
    'wink',
    'sweat_smile',
    'yum',
    'sunglasses',
    'rage',
    'confounded',
    'flushed',
    'disappointed',
    'sob',
    'neutral_face',
    'innocent',
    'grin',
    'smirk',
    'scream',
    'sleeping',
    'flushed',
    'confused',
    'mask',
    'blush',
    'worried',
    'hushed',
    'heartbeat',
    'broken_heart',
    'crescent_moon',
    'star2',
    'sunny',
    'rainbow',
    'heart_eyes',
    'kissing_smiling_eyes',
    'lips',
    'rose',
    'rose',
    '+1',
];

var map = {};
for (var i in emojis) {
    var name = emojis[i];
    var code = emoji.get(name);
    map[code] = name;
    //console.log("code:", code);
    //console.log("name:", name);
}

module.exports = {
  map: map
};
