package cn.jiguang.imui.commons.models;


public interface IMessage {

    /**
     * Message id.
     *
     * @return unique
     */
    String getMsgId();

    /**
     * Get user info of message.
     *
     * @return UserInfo of message
     */
    IUser getFromUser();

    /**
     * Time string that display in message list.
     *
     * @return Time string
     */
    String getTimeString();

    long getTime();

    /**
     * Type of Message
     */
    enum MessageType {


        SEND_LINK,
        RECEIVE_LINK,

        SEND_RED_PACKET,
        RECEIVE_RED_PACKET,

        SEND_BANK_TRANSFER,
        RECEIVE_BANK_TRANSFER,

        SEND_ACCOUNT_NOTICE,
        RECEIVE_ACCOUNT_NOTICE,

        SEND_CARD,
        RECEIVE_CARD,

        RED_PACKET_OPEN,
        NOTIFICATION,
        TIP,

        EVENT,
        SEND_TEXT,
        RECEIVE_TEXT,

        SEND_IMAGE,
        RECEIVE_IMAGE,

        SEND_VOICE,
        RECEIVE_VOICE,

        SEND_VIDEO,
        RECEIVE_VIDEO,

        SEND_LOCATION,
        RECEIVE_LOCATION,

        SEND_FILE,
        RECEIVE_FILE,

        CUSTOM;

        public String type;

        MessageType() {
        }
    }


    /**
     * Type of message, enum.
     *
     * @return Message Type
     */
    MessageType getType();

    /**
     * Status of message, enum.
     */
    enum MessageStatus {
        RECEIVE_UNREAD,
        RECEIVE_READ,
        SEND_SENDING,
        SEND_SUCCEED,
        SEND_FAILE,
        SEND_DRAFT,
        SEND_SUCCESS;
    }

    MessageStatus getMessageStatus();

    void setMessageStatus(MessageStatus status);


    IExtend getExtend();

    /**
     * Text of message.
     *
     * @return text
     */
    String getText();

    String getThumb();

//    String getProgress();
}
