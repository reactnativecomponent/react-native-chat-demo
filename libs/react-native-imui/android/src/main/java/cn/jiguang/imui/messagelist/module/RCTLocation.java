package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.ILocation;
import cn.jiguang.imui.messagelist.MessageConstant;



public class RCTLocation extends RCTExtend implements ILocation {



    private String latitude;
    private String longitude;
    private String address;

    public RCTLocation(String latitude, String longitude, String address) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }
    @Override
    WritableMap toWritableMap(){
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.Location.LATITUDE, latitude);
        writableMap.putString(MessageConstant.Location.LONGITUDE, longitude);
        writableMap.putString(MessageConstant.Location.ADDRESS, address);
        return writableMap;
    }
    @Override
    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.Location.LATITUDE, latitude);
        json.addProperty(MessageConstant.Location.LONGITUDE, longitude);
        json.addProperty(MessageConstant.Location.ADDRESS, address);
        return json;
    }

    @Override
    public String getlatitude() {
        return latitude;
    }

    @Override
    public String getLongitude() {
        return longitude;
    }

    @Override
    public String getAddress() {
        return address;
    }
}
