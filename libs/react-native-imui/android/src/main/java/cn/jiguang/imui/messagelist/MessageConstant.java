package cn.jiguang.imui.messagelist;

/**
 * Created by dowin on 2017/8/28.
 */

public class MessageConstant {

    public class MsgType {
        public final static String TEXT = "text";
        public final static String VOICE = "voice";
        public final static String IMAGE = "image";
        public final static String VIDEO = "video";
        public final static String FILE = "file";
        public final static String ROBOT = "robot";
        public final static String BANK_TRANSFER = "transfer";
        public final static String ACCOUNT_NOTICE = "account_notice";
        public final static String EVENT = "event";
        public final static String LOCATION = "location";
        public final static String NOTIFICATION = "notification";
        public final static String TIP = "tip";
        public final static String RED_PACKET = "redpacket";
        public final static String RED_PACKET_OPEN = "redpacketOpen";
        public final static String LINK = "url";
        public final static String CARD = "card";
        public final static String CUSTON = "custom";
    }

    public class MsgStatus {

        public final static String SEND_DRAFT = "send_draft";
        public final static String SEND_FAILE = "send_failed";
        public final static String SEND_SENDING = "send_going";
        public final static String SEND_SUCCESS = "send_succed";
        public final static String RECEIVE_READ = "receive_read";
        public final static String RECEIVE_UNREAD = "receive_unread";
    }

    public class Message {

        public static final String MSG_ID = "msgId";
        public static final String MSG_TYPE = "msgType";
        public static final String IS_OUTGOING = "isOutgoing";
        public static final String TIME_STRING = "timeString";
        public static final String MSG_TEXT = "text";
        public static final String STATUS = "status";

        public static final String FROM_USER = "fromUser";
        public static final String EXTEND = "extend";

        public static final String IS_REMOTE_READ = "isRemoteRead";
        public static final String ATTACH_STATUS = "attachStatus";
        public static final String SESSION_TYPE = "sessionType";
        public static final String SESSION_ID = "sessionId";


        public static final String TIME = "time";
    }


    public static class User {
        public static final String USER_ID = "_id";
        public static final String DISPLAY_NAME = "name";
        public static final String AVATAR_PATH = "avatar";
    }

    public static class AccountNotice {
        public final static String TITLE = "title";
        public final static String TIME = "time";
        public final static String DATE = "date";
        public final static String AMOUNT = "amount";
        public final static String BODY = "body";
        public final static String SERIAL_NO = "serialNo";
    }

    public static class BankTransfer {
        public final static String AMOUNT = "amount";
        public final static String SERIA_NO = "serialNo";
        public final static String COMMENTS = "comments";
    }

    public static class Link {
        public final static String TITLE = "title";
        public final static String DESCRIBE = "describe";
        public final static String IMAGE = "image";
        public final static String LINK_URL = "linkUrl";
    }

    public static class Location {
        public final static String LATITUDE = "latitude";
        public final static String LONGITUDE = "longitude";
        public final static String ADDRESS = "title";
    }

    public static class MediaFile {
        public final static String HEIGHT = "imageHeight";
        public final static String WIDTH = "imageWidth";
        public final static String DISPLAY_NAME = "displayName";
        public final static String DURATION = "duration";
        public final static String THUMB_PATH = "thumbPath";
        public final static String PATH = "path";
        public final static String URL = "url";

        public final static String SIZE = "size";
    }

    public static class RedPacket {
        public final static String TYPE = "type";
        public final static String COMMENTS = "comments";
        public final static String SERIAL_NO = "serialNo";
    }

    public static class RedPacketOpen {
        public final static String HAS_RED_PACKET = "hasRedPacket";
        public final static String SERIAL_NO = "serialNo";
        public final static String TIP_MSG = "tipMsg";

        public final static String SEND_ID = "sendId";
        public final static String OPEN_ID = "openId";

    }

    public static class Card{
        public final static String type = "type";
        public final static String name = "name";
        public final static String imgPath = "imgPath";
        public final static String sessionId = "sessionId";
    }

    public static class Opt {
        public final static String MESSAGE = "message";
        public final static String OPT = "opt";
        public final static String REVOKE = "revoke";
        public final static String DELETE = "delete";
        public final static String RESEND = "resend";
    }

    public static class Voice {
        public final static String MEDIA_PATH = "mediaPath";
        public final static String DURATION = "duration";
        public final static String STATUS = "status";
        public final static String DB = "db";
        public final static String TIME = "time";
    }
}
