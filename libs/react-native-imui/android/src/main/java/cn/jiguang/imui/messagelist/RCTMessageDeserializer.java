package cn.jiguang.imui.messagelist;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

import cn.jiguang.imui.messagelist.module.RCTAccountNotice;
import cn.jiguang.imui.messagelist.module.RCTBankTransfer;
import cn.jiguang.imui.messagelist.module.RCTCard;
import cn.jiguang.imui.messagelist.module.RCTExtend;
import cn.jiguang.imui.messagelist.module.RCTLink;
import cn.jiguang.imui.messagelist.module.RCTLocation;
import cn.jiguang.imui.messagelist.module.RCTMediaFile;
import cn.jiguang.imui.messagelist.module.RCTMessage;
import cn.jiguang.imui.messagelist.module.RCTRedPacket;
import cn.jiguang.imui.messagelist.module.RCTRedPacketOpen;
import cn.jiguang.imui.messagelist.module.RCTUser;


public class RCTMessageDeserializer implements JsonDeserializer<RCTMessage> {


    String getGsonString(JsonObject ext, String key) {
        JsonElement e = ext.get(key);
        return e == null ? null : e.getAsString();
    }

    Map<String, String> getGsonMap(JsonObject ext, String key) {
        JsonElement e = ext.get(key);
        Map<String, String> map = null;
        if (e != null) {
            JsonObject object = e.getAsJsonObject();
            if (object != null) {
                map = new HashMap<>();
                for (Map.Entry<String, JsonElement> entry : object.entrySet()) {
                    map.put(entry.getKey(), entry.getValue() == null ? null : entry.getValue().getAsString());
                }
            }
        }
        return map;
    }

    @Override
    public RCTMessage deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext)
            throws JsonParseException {
        JsonObject jsonObject = jsonElement.getAsJsonObject();
        JsonObject userObject = jsonObject.get(MessageConstant.Message.FROM_USER).getAsJsonObject();

        String userId = getGsonString(userObject, MessageConstant.User.USER_ID);
        String displayName = getGsonString(userObject, MessageConstant.User.DISPLAY_NAME);
        String avatarPath = getGsonString(userObject, MessageConstant.User.AVATAR_PATH);
        RCTUser rctUser = new RCTUser(userId, displayName, avatarPath);

        String msgId = getGsonString(jsonObject, MessageConstant.Message.MSG_ID);
        String status = getGsonString(jsonObject, MessageConstant.Message.STATUS);
        String msgType = getGsonString(jsonObject, MessageConstant.Message.MSG_TYPE);
        boolean isOutgoing = jsonObject.get(MessageConstant.Message.IS_OUTGOING).getAsBoolean();

        RCTMessage rctMessage = new RCTMessage(msgId, status, msgType, isOutgoing);
        rctMessage.setFromUser(rctUser);
        if (jsonObject.has(MessageConstant.Message.MSG_TEXT)) {
            rctMessage.setText(getGsonString(jsonObject, MessageConstant.Message.MSG_TEXT));
        }
        if (jsonObject.has(MessageConstant.Message.TIME_STRING)) {
            rctMessage.setTimeString(getGsonString(jsonObject, MessageConstant.Message.TIME_STRING));
        }
        if (jsonObject.has(MessageConstant.Message.TIME)) {
            rctMessage.setTime(jsonObject.get(MessageConstant.Message.TIME).getAsLong());
        }
//        if (jsonObject.has(MessageConstant.Message.STATUS)) {
//            rctMessage.setProgress(getGsonString(jsonObject, MessageConstant.Message.STATUS));
//        }
        if (jsonObject.has(MessageConstant.Message.EXTEND)) {
            JsonObject ext = jsonObject.get(MessageConstant.Message.EXTEND).getAsJsonObject();
//            Map<String,String> extend = new HashMap<>();
//            for(Map.Entry<String,JsonElement> entry:ext.entrySet()){
//                extend.put(entry.getKey(),entry.getValue().getAsString());
//            }
            RCTExtend extend = null;
            switch (rctMessage.getType()) {
                case SEND_VOICE:
                case RECEIVE_VOICE:
                case SEND_VIDEO:
                case RECEIVE_VIDEO:
                case SEND_FILE:
                case RECEIVE_FILE:
                case SEND_IMAGE:
                case RECEIVE_IMAGE:
                    if (jsonObject.has(MessageConstant.Message.EXTEND)) {
                        ext = jsonObject.get(MessageConstant.Message.EXTEND).getAsJsonObject();
                        RCTMediaFile e = new RCTMediaFile(getGsonString(ext, MessageConstant.MediaFile.THUMB_PATH), getGsonString(ext, MessageConstant.MediaFile.PATH),
                                getGsonString(ext, MessageConstant.MediaFile.URL));
                        if (ext.has(MessageConstant.MediaFile.DISPLAY_NAME)) {
                            e.setDisplayName(getGsonString(ext, MessageConstant.MediaFile.DISPLAY_NAME));
                        }
                        if (ext.has(MessageConstant.MediaFile.DURATION)) {
                            e.setDuration(ext.get(MessageConstant.MediaFile.DURATION).getAsLong());
                        }
                        if (ext.has(MessageConstant.MediaFile.HEIGHT)) {
                            e.setHeight(getGsonString(ext, MessageConstant.MediaFile.HEIGHT));
                        }
                        if (ext.has(MessageConstant.MediaFile.WIDTH)) {
                            e.setWidth(getGsonString(ext, MessageConstant.MediaFile.WIDTH));
                        }
                        extend = e;
                    }
                    break;
                case SEND_LOCATION:
                case RECEIVE_LOCATION:
                    if (jsonObject.has(MessageConstant.Message.EXTEND)) {
                        ext = jsonObject.get(MessageConstant.Message.EXTEND).getAsJsonObject();
                        extend = new RCTLocation(getGsonString(ext, MessageConstant.Location.LATITUDE), getGsonString(ext, MessageConstant.Location.LONGITUDE),
                                getGsonString(ext, MessageConstant.Location.ADDRESS));
                    }
                    break;
                case SEND_BANK_TRANSFER:
                case RECEIVE_BANK_TRANSFER:
                    if (jsonObject.has(MessageConstant.Message.EXTEND)) {
                        ext = jsonObject.get(MessageConstant.Message.EXTEND).getAsJsonObject();
                        extend = new RCTBankTransfer(getGsonString(ext, MessageConstant.BankTransfer.AMOUNT), getGsonString(ext, MessageConstant.BankTransfer.SERIA_NO),
                                getGsonString(ext, MessageConstant.BankTransfer.COMMENTS));
                    }
                    break;
                case SEND_ACCOUNT_NOTICE:
                case RECEIVE_ACCOUNT_NOTICE:
                    if (jsonObject.has(MessageConstant.Message.EXTEND)) {
                        ext = jsonObject.get(MessageConstant.Message.EXTEND).getAsJsonObject();
                        extend = new RCTAccountNotice(getGsonString(ext, MessageConstant.AccountNotice.TITLE), getGsonString(ext, MessageConstant.AccountNotice.TIME),
                                getGsonString(ext, MessageConstant.AccountNotice.DATE), getGsonString(ext, MessageConstant.AccountNotice.AMOUNT),
                                getGsonMap(ext, MessageConstant.AccountNotice.BODY), getGsonString(ext, MessageConstant.AccountNotice.SERIAL_NO));
                    }
                    break;
                case SEND_RED_PACKET:
                case RECEIVE_RED_PACKET:
                    if (jsonObject.has(MessageConstant.Message.EXTEND)) {
                        ext = jsonObject.get(MessageConstant.Message.EXTEND).getAsJsonObject();
                        extend = new RCTRedPacket(getGsonString(ext, MessageConstant.RedPacket.TYPE), getGsonString(ext, MessageConstant.RedPacket.COMMENTS),
                                getGsonString(ext, MessageConstant.RedPacket.SERIAL_NO));
                    }
                    break;
                case SEND_LINK:
                case RECEIVE_LINK:
                    if (jsonObject.has(MessageConstant.Message.EXTEND)) {
                        ext = ext.get(MessageConstant.Message.EXTEND).getAsJsonObject();
                        extend = new RCTLink(getGsonString(ext, MessageConstant.Link.TITLE), getGsonString(ext, MessageConstant.Link.DESCRIBE),
                                getGsonString(ext, MessageConstant.Link.IMAGE), getGsonString(ext, MessageConstant.Link.LINK_URL));
                    }
                    break;
                case RED_PACKET_OPEN:
                    if (jsonObject.has(MessageConstant.Message.EXTEND)) {
                        ext = jsonObject.get(MessageConstant.Message.EXTEND).getAsJsonObject();
                        extend = new RCTRedPacketOpen(getGsonString(ext, MessageConstant.RedPacketOpen.HAS_RED_PACKET), getGsonString(ext, MessageConstant.RedPacketOpen.SERIAL_NO),
                                getGsonString(ext, MessageConstant.RedPacketOpen.TIP_MSG), getGsonString(ext, MessageConstant.RedPacketOpen.SEND_ID), getGsonString(ext, MessageConstant.RedPacketOpen.OPEN_ID));
                    }
                    break;
                case SEND_CARD:
                case RECEIVE_CARD:
                    if (jsonObject.has(MessageConstant.Message.EXTEND)) {
                        ext = jsonObject.get(MessageConstant.Message.EXTEND).getAsJsonObject();
                        extend = new RCTCard(getGsonString(ext, MessageConstant.Card.type),getGsonString(ext, MessageConstant.Card.name),
                                getGsonString(ext, MessageConstant.Card.imgPath),getGsonString(ext, MessageConstant.Card.sessionId));
                    }
                    break;
                default:
            }
            rctMessage.setExtend(extend);
        }
        return rctMessage;
    }
}
