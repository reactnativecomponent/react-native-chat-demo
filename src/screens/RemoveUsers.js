import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    TouchableOpacity,
    NativeAppEventEmitter,
    ListView,Image,
    ScrollView,
    Dimensions
} from 'react-native';
import {Container,Icon,ListItem,Text,Body,Right,Left,Header,Button,Title} from 'native-base';
import {NimTeam} from 'react-native-netease-im';

export  default class RemoveUsers extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: '移出群聊',

    });

    // 构造
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) =>{
                return r1 !== r2;
            }
        });
        this.state = {
            ds:ds.cloneWithRows(props.navigation.state.params.members||[]),
            selectAccounts:[]
        };
        this.listData = props.navigation.state.params.members||[];

    }
    removeTeam(){
        const {teamId,onResult} = this.props.navigation.state.params;
        let result = this.getIds();
        if(result.length > 0){
            NimTeam.removeMember(teamId,result).then(()=>{
                onResult && onResult();
                this.props.navigation.goBack();
            });

        }
    }
    getIds(){
        let arr = [];
        this.state.selectAccounts.map(res=>{
            arr.push(res.contactId);
        });
        return arr;
    }
    _select(res,selectId,rowId){
        let newSelect = this.state.selectAccounts;
        if(res.isSelect){
            newSelect.splice(newSelect.indexOf(res),1)
        }else{
            newSelect.push(res);
        }

        this.setState({
            selectAccounts:newSelect,
            ds:this.state.ds.cloneWithRows(this.formatList(this.listData,res)),
        });
    }
    formatList(list,obj){
        let ne = [];
        list.map(res=>{
            if(res.contactId === obj.contactId){
                ne.push({
                    ...res,
                    isSelect:res.isSelect ? false :true
                });
            }else{
                ne.push(res);
            }
        });
        this.listData = ne;
        return ne;
    }
    _renderSelect(){
        return this.state.selectAccounts.map(res=>{
            return (
                <Image key={res.contactId}
                       style={{width:35,height:35,marginRight:5}}
                       source={res.avatar ? {uri:res.avatar} : require('../images/discuss_logo.png')} />

            )
        });
    }
    _renderRow(res,sectionID,rowId){
        return(
            <ListItem key={res.contactId} onPress={()=>this._select(res,sectionID,rowId)}>
                <Icon name={res.isSelect ? 'ios-checkmark-circle' : 'ios-radio-button-off'}
                      style={{marginRight:8,color:res.isSelect ? '#d82617' : '#ccc'}}/>
                <Image style={{width:35,height:35}} source={res.avatar ? {uri:res.avatar} : require('../images/discuss_logo.png')} />
                <Body>
                <Text>
                    {res.name}
                </Text>
                </Body>
            </ListItem>
        );


    }
    render() {
        const {navigation} = this.props;
        return (
            <Container style={{flex:1,backgroundColor:"#f7f7f7"}}>
                <Header>
                    <Left>
                        <Button transparent onPress={()=>navigation.goBack()}>
                            <Text>取消</Text>
                        </Button>
                    </Left>
                    <Body>
                    <Title>
                        创建群聊
                    </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=>this.removeTeam()}>
                            <Text>确定</Text>
                        </Button>
                    </Right>
                </Header>
                <View style={{width:width,height:51,backgroundColor:'#fff',justifyContent:'center',paddingHorizontal:8,borderBottomWidth:1,borderBottomColor:'#c9c9c9'}}>
                    <ScrollView horizontal style={{flex:1}} contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
                        {this._renderSelect()}
                    </ScrollView>
                </View>

                <ListView
                    style={{backgroundColor:"#fff",flex:1}}
                    dataSource= {this.state.ds}
                    renderRow= {this._renderRow.bind(this)}
                    enableEmptySections= {true}
                    removeClippedSubviews= {true}
                />
            </Container>
        );
    }
}
const {width,height} = Dimensions.get('window');