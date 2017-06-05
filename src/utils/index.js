import React from 'react';
import {Linking,Dimensions} from 'react-native';
import moment from 'moment';
require('moment/locale/zh-cn.js');
const colors = ['#E74C3C', '#C0392B', '#1ABC9C',
	'#16A085', '#2ECC71', '#27AE60', '#3498DB',
	'#2980B9', '#9B59B6', '#8E44AD', '#34495E',
	'#2C3E50', '#E67E22',
	'#D35400', '#7F8C8D'];


function getRandomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	return (Min + Math.round(Rand * Range));
}


export function parseImgUrl(url) {
	if (/^\/\/.*/.test(url)) {
		url = 'http:' + url
	}
	return url
}


export function genColor() {
	return colors[getRandomNum(0, colors.length - 1)];
}


export function link(url) {
	Linking.canOpenURL(url).then(supported=> {
			if (supported) {
				return Linking.openURL(url)
			}
		})
		.catch(err=> {
			console.error('An error occurred', err);
		})
}
export function getFaceAction(size=3) {
	//let arr = [];
	let arr = [1,2,3,4];
	//if(Platform.OS === '')
	//	let arr = [1,2,3,4];
	let out = [];
	while(out.length < size){
		var temp = (Math.random()*arr.length) >> 0;
		out.push(arr.splice(temp,1)[0]);
	}
	return out;
}
export function toDecimal2(x) { //格式化
	var f = parseFloat(x);
	if (isNaN(f)) {
		return '0.00';
	}
	var f = Math.round(x*100)/100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s;
}
export function MillisecondToTime(msd) {
	let s = parseInt(msd % 60);
	var m = parseInt(msd/60);
	return m+':'+s;
}
export function formatMoney(v) {
	if(v<10000){
		return v;
	}else{
		let rv = (v/10000);
		let s = rv.toString();
		if(s.indexOf('.') < 0){
			return rv + "万";
		}else{
			return rv.toFixed(2)+"万";
		}
	}
}
export  function isNum(v){
	if(!!v && v.indexOf(".") > -1){
		let fv = v.substring(v.indexOf(".")+1);
		if(fv.length > 0){
			if(fv.length > 2){
				return v.substring(0,v.indexOf(".")+3);
			}
			let t = v.substring(0,v.indexOf("."));
			if(!/[\d]{1,2}/.test(fv)){
				if(isNaN(parseInt(t))){
					return '0.';
				}
				return t+'.';
			}
			if(!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(v)){
				return toDecimal2(v);
			}
		}
		return v;
	}
	return v.replace(/[^\d]/g,'');
	//if(/^d*(?:.d{0,2})?$/.test(v)){
	//	return v;
	//}
	//return '0.00';
	//if(!!v){
	//	return v == 0 || new RegExp("^[1-9]{1}[0-9]{0,8}$|^[1-9]{1}[0-9]{0,8}\\.[0-9]{1,2}$|^0\\.[0-9]{1,2}$").test(v);
	//}
	//return false;

}
export function getRouterByName(key,routers = []){
	let name = '';
	routers.map(res=>{
		if(res.routeName === key){
			name =  res.routeName;
		}
	});
	return name;
}


const deviceH = Dimensions.get('window').height;
const deviceW = Dimensions.get('window').width;

const basePx = 375;

export function px2dp(px) {
	return px *  deviceW / basePx;
}
export function showTime(msgDate){
	let nowDate = new Date();
	let result = "";
	let startTime = nowDate.getTime();
	let endTime = msgDate.getTime();

	//let dates = Math.abs((startTime - endTime))/(1000*60*60*24);\
	let d = moment.duration(moment(nowDate,'YYYYMMDD').diff(moment(msgDate,"YYYYMMDD")));
	let dates = Math.round(d.asDays());
	if(dates === 0) //同一天,显示时间
	{
		result = moment(msgDate).format("HH:mm");
	}
	else if(dates === 1)//昨天
	{
		result = moment(msgDate).format("昨天 HH:mm");
	}
	//else if(nowDateComponents.day == (msgDateComponents.day+2)) //前天
	//{
	//	result = moment(msgDate).format("ddd, hA");
	//}
	else if(dates < 7)//一周内
	{
		result = moment(msgDate).locale("zh-cn").format("dddd HH:mm");
	}else//显示日期
	{
		result = moment(msgDate).format("YYYY年MM月DD HH:mm");
	}
	return result;

}