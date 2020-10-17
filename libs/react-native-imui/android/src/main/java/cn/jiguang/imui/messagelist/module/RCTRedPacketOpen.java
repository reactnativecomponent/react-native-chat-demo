package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.IRedPacketOpen;
import cn.jiguang.imui.messagelist.MessageConstant;



public class RCTRedPacketOpen extends RCTExtend implements IRedPacketOpen {



    private String hasRedPacket;
    private String seriaNo;
    private String tipMsg;
    private String sendId;
    private String openId;

    public RCTRedPacketOpen(String hasRedPacket, String seriaNo, String tipMsg, String sendId, String openId) {
        this.hasRedPacket = hasRedPacket;
        this.seriaNo = seriaNo;
        this.tipMsg = tipMsg;
        this.sendId = sendId;
        this.openId = openId;
    }
    @Override
    WritableMap toWritableMap(){
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.RedPacketOpen.HAS_RED_PACKET, hasRedPacket);
        writableMap.putString(MessageConstant.RedPacketOpen.SERIAL_NO, seriaNo);
        writableMap.putString(MessageConstant.RedPacketOpen.TIP_MSG, tipMsg);
        writableMap.putString(MessageConstant.RedPacketOpen.SEND_ID, sendId);
        writableMap.putString(MessageConstant.RedPacketOpen.OPEN_ID, openId);
        return writableMap;
    }
    @Override
    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.RedPacketOpen.HAS_RED_PACKET, hasRedPacket);
        json.addProperty(MessageConstant.RedPacketOpen.SERIAL_NO, seriaNo);
        json.addProperty(MessageConstant.RedPacketOpen.TIP_MSG, tipMsg);
        json.addProperty(MessageConstant.RedPacketOpen.SEND_ID, sendId);
        json.addProperty(MessageConstant.RedPacketOpen.OPEN_ID, openId);
        return json;
    }

    @Override
    public String getOpenId() {
        return openId;
    }

    @Override
    public String getSendId() {
        return sendId;
    }

    @Override
    public String getHasRedPacket() {
        return hasRedPacket;
    }

    @Override
    public String getSeriaNo() {
        return seriaNo;
    }

    @Override
    public String getTipMsg() {
        return tipMsg;
    }
}
