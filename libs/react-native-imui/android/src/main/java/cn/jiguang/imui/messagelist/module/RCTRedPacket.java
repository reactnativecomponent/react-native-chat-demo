package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.IRedPacket;
import cn.jiguang.imui.messagelist.MessageConstant;



public class RCTRedPacket extends RCTExtend implements IRedPacket {



    private String type;
    private String comments;
    private String serialNo;

    public RCTRedPacket(String type, String comments, String serialNo) {
        this.type = type;
        this.comments = comments;
        this.serialNo = serialNo;
    }
    @Override
    WritableMap toWritableMap(){
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.RedPacket.TYPE, type);
        writableMap.putString(MessageConstant.RedPacket.COMMENTS, comments);
        writableMap.putString(MessageConstant.RedPacket.SERIAL_NO, serialNo);
        return writableMap;
    }
    @Override
    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.RedPacket.TYPE, type);
        json.addProperty(MessageConstant.RedPacket.COMMENTS, comments);
        json.addProperty(MessageConstant.RedPacket.SERIAL_NO, serialNo);
        return json;
    }

    @Override
    public String getType() {
        return type;
    }

    @Override
    public String getComments() {
        return comments;
    }

    @Override
    public String getSeriaNo() {
        return serialNo;
    }

}
