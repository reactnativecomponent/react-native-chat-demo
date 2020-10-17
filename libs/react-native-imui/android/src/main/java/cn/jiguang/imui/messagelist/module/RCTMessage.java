package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.IExtend;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.commons.models.IUser;
import cn.jiguang.imui.messagelist.MessageConstant;


public class RCTMessage implements IMessage {

    private final String msgId;
    private final String statusStr;
    private MessageStatus status;
    private final String msgTypeStr;
    private final MessageType msgType;
    private final boolean isOutgoing;

    private String timeString;
    private long time;
    private String text;
    private RCTExtend extend;
    private String thumb;
    //    private String progress;
    private RCTUser rctUser;
    private static Gson sGSON = new Gson();

    public RCTMessage(String msgId, String status, String msgType, boolean isOutgoing) {
        this.msgId = msgId;
        this.statusStr = status;
        this.msgTypeStr = msgType;
        this.isOutgoing = isOutgoing;

        this.status = getStatus(status);
        this.msgType = getType(msgType, isOutgoing);
    }

    MessageStatus getStatus(String status) {
        if (MessageConstant.MsgStatus.SEND_DRAFT.equals(status)) {
            return MessageStatus.SEND_DRAFT;
        } else if (MessageConstant.MsgStatus.SEND_FAILE.equals(status)) {
            return MessageStatus.SEND_FAILE;
        } else if (MessageConstant.MsgStatus.SEND_SENDING.equals(status)) {
            return MessageStatus.SEND_SENDING;
        } else if (MessageConstant.MsgStatus.SEND_SUCCESS.equals(status)) {
            return MessageStatus.SEND_SUCCESS;
        } else if (MessageConstant.MsgStatus.RECEIVE_READ.equals(status)) {
            return MessageStatus.RECEIVE_READ;
        } else if (MessageConstant.MsgStatus.RECEIVE_UNREAD.equals(status)) {
            return MessageStatus.RECEIVE_UNREAD;
        } else {
            return MessageStatus.SEND_DRAFT;
        }
    }

    MessageType getType(String msgType, boolean isOutgoing) {
        if (isOutgoing) {
            switch (msgType) {
                case MessageConstant.MsgType.TEXT:
                    return MessageType.SEND_TEXT;
                case MessageConstant.MsgType.VOICE:
                    return MessageType.SEND_VOICE;
                case MessageConstant.MsgType.IMAGE:
                    return MessageType.SEND_IMAGE;
                case MessageConstant.MsgType.VIDEO:
                    return MessageType.SEND_VIDEO;
                case MessageConstant.MsgType.TIP:
                    return MessageType.TIP;
                case MessageConstant.MsgType.EVENT:
                    return MessageType.EVENT;
                case MessageConstant.MsgType.NOTIFICATION:
                    return MessageType.NOTIFICATION;
                case MessageConstant.MsgType.RED_PACKET_OPEN:
                    return MessageType.RED_PACKET_OPEN;
                case MessageConstant.MsgType.RED_PACKET:
                    return MessageType.SEND_RED_PACKET;
                case MessageConstant.MsgType.BANK_TRANSFER:
                    return MessageType.SEND_BANK_TRANSFER;
                case MessageConstant.MsgType.ACCOUNT_NOTICE:
                    return MessageType.SEND_ACCOUNT_NOTICE;
                case MessageConstant.MsgType.LOCATION:
                    return MessageType.SEND_LOCATION;
                case MessageConstant.MsgType.LINK:
                    return MessageType.SEND_LINK;
                case MessageConstant.MsgType.CUSTON:
                    return MessageType.CUSTOM;
                case MessageConstant.MsgType.CARD:
                    return MessageType.SEND_CARD;
                default:
                    return MessageType.CUSTOM;
            }
        } else {
            switch (msgType) {
                case MessageConstant.MsgType.TEXT:
                    return MessageType.RECEIVE_TEXT;
                case MessageConstant.MsgType.VOICE:
                    return MessageType.RECEIVE_VOICE;
                case MessageConstant.MsgType.IMAGE:
                    return MessageType.RECEIVE_IMAGE;
                case MessageConstant.MsgType.VIDEO:
                    return MessageType.RECEIVE_VIDEO;
                case MessageConstant.MsgType.TIP:
                    return MessageType.TIP;
                case MessageConstant.MsgType.EVENT:
                    return MessageType.EVENT;
                case MessageConstant.MsgType.NOTIFICATION:
                    return MessageType.NOTIFICATION;
                case MessageConstant.MsgType.RED_PACKET_OPEN:
                    return MessageType.RED_PACKET_OPEN;
                case MessageConstant.MsgType.RED_PACKET:
                    return MessageType.RECEIVE_RED_PACKET;
                case MessageConstant.MsgType.BANK_TRANSFER:
                    return MessageType.RECEIVE_BANK_TRANSFER;
                case MessageConstant.MsgType.ACCOUNT_NOTICE:
                    return MessageType.RECEIVE_ACCOUNT_NOTICE;
                case MessageConstant.MsgType.LOCATION:
                    return MessageType.RECEIVE_LOCATION;
                case MessageConstant.MsgType.LINK:
                    return MessageType.RECEIVE_LINK;
                case MessageConstant.MsgType.CARD:
                    return MessageType.RECEIVE_CARD;
                case MessageConstant.MsgType.CUSTON:
                    return MessageType.CUSTOM;
                default:
                    return MessageType.CUSTOM;
            }
        }
    }

    public boolean isOutgoing() {
        return isOutgoing;
    }

    @Override
    public String getMsgId() {
        return this.msgId;
    }

    public void setFromUser(RCTUser user) {
        this.rctUser = user;
    }

    @Override
    public IUser getFromUser() {
        return rctUser;
    }

    public void setTimeString(String timeString) {
        this.timeString = timeString;
    }

    @Override
    public String getTimeString() {
        return this.timeString;
    }

    public void setTime(long time) {
        this.time = time;
    }

    @Override
    public long getTime() {
        return time;
    }

    @Override
    public MessageType getType() {
        return msgType;
    }


    @Override
    public MessageStatus getMessageStatus() {
        return status;
    }

    @Override
    public void setMessageStatus(MessageStatus status) {
        this.status = status;
    }

    public void setThumb(String thumb) {
        this.thumb = thumb;
    }

    @Override
    public String getThumb() {
        return thumb;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public String getText() {
        return this.text;
    }

    public void setExtend(RCTExtend extend) {
        this.extend = extend;
    }

    @Override
    public IExtend getExtend() {
        return extend;
    }

//    public void setProgress(String progress) {
//        this.progress = progress;
//    }

//    @Override
//    public String getProgress() {
//        return this.progress;
//    }

    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        if (msgId != null) {
            json.addProperty(MessageConstant.Message.MSG_ID, msgId);
        }
        if (statusStr != null) {
            json.addProperty(MessageConstant.Message.STATUS, statusStr);
        }
        if (msgType != null) {
            json.addProperty(MessageConstant.Message.MSG_TYPE, msgTypeStr);
        }
        json.addProperty(MessageConstant.Message.IS_OUTGOING, isOutgoing );
        if (timeString != null) {
            json.addProperty(MessageConstant.Message.TIME_STRING, timeString);
        }
        if (time != 0L) {
            json.addProperty(MessageConstant.Message.TIME, time);
        }
        if (text != null) {
            json.addProperty(MessageConstant.Message.MSG_TEXT, text);
        }
//        if (progress != null) {
//            json.addProperty(MessageConstant.Message.STATUS, progress);
//        }
        if (extend != null) {
            json.add(MessageConstant.Message.EXTEND, extend.toJSON());
        }
        json.add(MessageConstant.Message.FROM_USER, rctUser.toJSON());

        return json;
    }

    public WritableMap toWritableMap() {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.Message.MSG_ID, msgId);
        writableMap.putString(MessageConstant.Message.STATUS, statusStr);
        writableMap.putString(MessageConstant.Message.MSG_TYPE, msgTypeStr);
        writableMap.putString(MessageConstant.Message.MSG_TEXT, text);
        writableMap.putString(MessageConstant.Message.IS_OUTGOING, isOutgoing? "0" : "1");
//        writableMap.putString(MessageConstant.Message.STATUS, progress);
        if (rctUser != null) {
            writableMap.putMap(MessageConstant.Message.FROM_USER, rctUser.toWritableMap());
        }
        if (extend != null) {
            writableMap.putMap(MessageConstant.Message.EXTEND, extend.toWritableMap());
        }
        return writableMap;
    }

    @Override
    public String toString() {
        return sGSON.toJson(toJSON());
    }
}
