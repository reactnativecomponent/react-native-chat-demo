package cn.jiguang.imui.messagelist;

import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.util.HashMap;
import java.util.Map;

import cn.jiguang.imui.messagelist.module.RCTAccountNotice;
import cn.jiguang.imui.messagelist.module.RCTBankTransfer;
import cn.jiguang.imui.messagelist.module.RCTCard;
import cn.jiguang.imui.messagelist.module.RCTExtend;
import cn.jiguang.imui.messagelist.module.RCTLink;
import cn.jiguang.imui.messagelist.module.RCTLocation;
import cn.jiguang.imui.messagelist.module.RCTMediaFile;
import cn.jiguang.imui.messagelist.module.RCTMember;
import cn.jiguang.imui.messagelist.module.RCTMessage;
import cn.jiguang.imui.messagelist.module.RCTRedPacket;
import cn.jiguang.imui.messagelist.module.RCTRedPacketOpen;
import cn.jiguang.imui.messagelist.module.RCTUser;
import cn.jiguang.imui.utils.TimeUtil;


public class MessageUtil {


    static Map<String, String> getMap(ReadableMap ext, String key) {
        ReadableMap map = ext.getMap(key);
        Map<String, String> reslut = null;
        if (map != null) {
            reslut = new HashMap<>();
            ReadableMapKeySetIterator iterator = map.keySetIterator();
            while (iterator.hasNextKey()) {
                String aKey = iterator.nextKey();
                reslut.put(aKey, map.getString(aKey));
            }
        }
        return reslut;
    }

    public static RCTMessage configMessage(ReadableMap message) {
//        Log.d("AuroraIMUIModule", "configure message: " + message);
        RCTMessage rctMsg = new RCTMessage(message.getString(MessageConstant.Message.MSG_ID),
                message.getString(MessageConstant.Message.STATUS), message.getString(MessageConstant.Message.MSG_TYPE),
                "0".equals(message.getString(MessageConstant.Message.IS_OUTGOING)));
        RCTExtend extend = null;
        ReadableMap ext;
        switch (rctMsg.getType()) {
            case SEND_VOICE:
            case RECEIVE_VOICE:
            case SEND_VIDEO:
            case RECEIVE_VIDEO:
            case SEND_FILE:
            case RECEIVE_FILE:
            case SEND_IMAGE:
            case RECEIVE_IMAGE:
                if (message.hasKey(MessageConstant.Message.EXTEND)) {
                    ext = message.getMap(MessageConstant.Message.EXTEND);
                    RCTMediaFile e = new RCTMediaFile(ext.getString(MessageConstant.MediaFile.THUMB_PATH), ext.getString(MessageConstant.MediaFile.PATH),
                            ext.getString(MessageConstant.MediaFile.URL));
                    if (ext.hasKey(MessageConstant.MediaFile.DISPLAY_NAME)) {
                        e.setDisplayName(ext.getString(MessageConstant.MediaFile.DISPLAY_NAME));
                    }
                    if (ext.hasKey(MessageConstant.MediaFile.DURATION)) {
                        try {
                            e.setDuration(Long.parseLong(ext.getString(MessageConstant.MediaFile.DURATION)));
                        } catch (NumberFormatException e1) {
                            e1.printStackTrace();
                        }
                    }
                    if (ext.hasKey(MessageConstant.MediaFile.HEIGHT)) {
                        e.setHeight(ext.getString(MessageConstant.MediaFile.HEIGHT));
                    }
                    if (ext.hasKey(MessageConstant.MediaFile.WIDTH)) {
                        e.setWidth(ext.getString(MessageConstant.MediaFile.WIDTH));
                    }
                    extend = e;
                }
                break;
            case SEND_LOCATION:
            case RECEIVE_LOCATION:
                if (message.hasKey(MessageConstant.Message.EXTEND)) {
                    ext = message.getMap(MessageConstant.Message.EXTEND);
                    extend = new RCTLocation(ext.getString(MessageConstant.Location.LATITUDE), ext.getString(MessageConstant.Location.LONGITUDE),
                            ext.getString(MessageConstant.Location.ADDRESS));
                }
                break;
            case SEND_BANK_TRANSFER:
            case RECEIVE_BANK_TRANSFER:
                if (message.hasKey(MessageConstant.Message.EXTEND)) {
                    ext = message.getMap(MessageConstant.Message.EXTEND);
                    extend = new RCTBankTransfer(ext.getString(MessageConstant.BankTransfer.AMOUNT), ext.getString(MessageConstant.BankTransfer.SERIA_NO),
                            ext.getString(MessageConstant.BankTransfer.COMMENTS));
                }
                break;
            case SEND_ACCOUNT_NOTICE:
            case RECEIVE_ACCOUNT_NOTICE:
                if (message.hasKey(MessageConstant.Message.EXTEND)) {
                    ext = message.getMap(MessageConstant.Message.EXTEND);
                    extend = new RCTAccountNotice(ext.getString(MessageConstant.AccountNotice.TITLE), ext.getString(MessageConstant.AccountNotice.TIME),
                            ext.getString(MessageConstant.AccountNotice.DATE), ext.getString(MessageConstant.AccountNotice.AMOUNT),
                            getMap(ext, MessageConstant.AccountNotice.BODY), ext.getString(MessageConstant.AccountNotice.SERIAL_NO));
                }
                break;
            case SEND_RED_PACKET:
            case RECEIVE_RED_PACKET:
                if (message.hasKey(MessageConstant.Message.EXTEND)) {
                    ext = message.getMap(MessageConstant.Message.EXTEND);
                    extend = new RCTRedPacket(ext.getString(MessageConstant.RedPacket.TYPE), ext.getString(MessageConstant.RedPacket.COMMENTS),
                            ext.getString(MessageConstant.RedPacket.SERIAL_NO));
                }
                break;
            case SEND_LINK:
            case RECEIVE_LINK:
                if (message.hasKey(MessageConstant.Message.EXTEND)) {
                    ext = message.getMap(MessageConstant.Message.EXTEND);
                    extend = new RCTLink(ext.getString(MessageConstant.Link.TITLE), ext.getString(MessageConstant.Link.DESCRIBE),
                            ext.getString(MessageConstant.Link.IMAGE), ext.getString(MessageConstant.Link.LINK_URL));
                }
                break;
            case RED_PACKET_OPEN:
                if (message.hasKey(MessageConstant.Message.EXTEND)) {
                    ext = message.getMap(MessageConstant.Message.EXTEND);
                    extend = new RCTRedPacketOpen(ext.getString(MessageConstant.RedPacketOpen.HAS_RED_PACKET),
                            ext.getString(MessageConstant.RedPacketOpen.SERIAL_NO), ext.getString(MessageConstant.RedPacketOpen.TIP_MSG),
                            ext.getString(MessageConstant.RedPacketOpen.SEND_ID), ext.getString(MessageConstant.RedPacketOpen.OPEN_ID));
                }
                break;

            case SEND_CARD:
            case RECEIVE_CARD:
                if (message.hasKey(MessageConstant.Message.EXTEND)) {
                    ext = message.getMap(MessageConstant.Message.EXTEND);
                    extend = new RCTCard(ext.getString(MessageConstant.Card.type),ext.getString(MessageConstant.Card.name),
                            ext.getString(MessageConstant.Card.imgPath),ext.getString(MessageConstant.Card.sessionId));
                }
                break;
            case CUSTOM:
            case TIP:
            case NOTIFICATION:
            case EVENT:

            case SEND_TEXT:
            case RECEIVE_TEXT:
                rctMsg.setText(message.getString(MessageConstant.Message.MSG_TEXT));
                break;
            default:
                rctMsg.setText(message.getString(MessageConstant.Message.MSG_TEXT));
        }
        rctMsg.setExtend(extend);
        ReadableMap user = message.getMap(MessageConstant.Message.FROM_USER);
        RCTUser rctUser = new RCTUser(user.getString(MessageConstant.User.USER_ID), user.getString(MessageConstant.User.DISPLAY_NAME),
                user.getString(MessageConstant.User.AVATAR_PATH));
        Log.d("AuroraIMUIModule", "fromUser: " + rctUser);
        rctMsg.setFromUser(rctUser);
        if (message.hasKey(MessageConstant.Message.TIME_STRING)) {
            String timeString = message.getString(MessageConstant.Message.TIME_STRING);
            if (timeString != null) {

                try {
                    rctMsg.setTime(Long.parseLong(timeString) * 1000);
                    rctMsg.setTimeString(TimeUtil.getTimeShowString(rctMsg.getTime(), false));
                } catch (NumberFormatException e) {
                    rctMsg.setTime(0L);
                    rctMsg.setTimeString(timeString);
                    e.printStackTrace();
                }
            }

        }
//        if (message.hasKey(MessageConstant.Message.STATUS)) {
//            String progress = message.getString(MessageConstant.Message.STATUS);
//            if (progress != null) {
//                rctMsg.setProgress(progress);
//            }
//        }
        return rctMsg;
    }

    public static RCTMember configChatInput(ReadableMap chatInput) {
        Log.d("AuroraIMUIModule", "configure message: " + chatInput);
        RCTMember input = new RCTMember(chatInput.getString(ChatInputConstant.Member.NAME),
                chatInput.getString(ChatInputConstant.Member.CONTACT_ID));
        if(chatInput.hasKey(ChatInputConstant.Member.ALIAS)){
            input.setAlias(chatInput.getString(ChatInputConstant.Member.ALIAS));
        }

        return input;
    }
}
