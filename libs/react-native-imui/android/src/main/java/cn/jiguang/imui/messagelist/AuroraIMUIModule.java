package cn.jiguang.imui.messagelist;


import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIManagerModule;

import cn.jiguang.imui.messagelist.module.RCTMember;
import cn.jiguang.imui.messagelist.module.RCTMessage;

import static cn.jiguang.imui.messagelist.MessageUtil.configChatInput;
import static cn.jiguang.imui.messagelist.MessageUtil.configMessage;


public class AuroraIMUIModule extends ReactContextBaseJavaModule {


    private final String REACT_MSG_LIST_MODULE = "AuroraIMUIModule";

    public AuroraIMUIModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MSG_LIST_MODULE;
    }

    @Override
    public void initialize() {
        super.initialize();
        UIImplementation t;
        UIManagerModule a;
    }

    @ReactMethod
    public void appendMessages(ReadableArray messages) {
        String[] rctMessages = new String[messages.size()];
        for (int i = 0; i < messages.size(); i++) {
            RCTMessage rctMessage = configMessage(messages.getMap(i));
            rctMessages[i] = rctMessage.toString();
        }
        Intent intent = new Intent();
        intent.setAction(ReactMsgListManager.RCT_APPEND_MESSAGES_ACTION);
        intent.putExtra("messages", rctMessages);
        getReactApplicationContext().sendBroadcast(intent);
    }

    @ReactMethod
    public void updateMessage(ReadableMap message) {
        RCTMessage rctMessage = configMessage(message);
        Intent intent = new Intent();
        intent.setAction(ReactMsgListManager.RCT_UPDATE_MESSAGE_ACTION);
        intent.putExtra("message", rctMessage.toString());
        getReactApplicationContext().sendBroadcast(intent);
    }

    @ReactMethod
    public void insertMessagesToTop(ReadableArray messages) {
        String[] rctMessages = new String[messages.size()];
        for (int i = 0; i < messages.size(); i++) {
            RCTMessage rctMessage = configMessage(messages.getMap(i));
            rctMessages[i] = rctMessage.toString();
        }
        Intent intent = new Intent();
        intent.setAction(ReactMsgListManager.RCT_INSERT_MESSAGES_ACTION);
        intent.putExtra("messages", rctMessages);
        getReactApplicationContext().sendBroadcast(intent);
    }

    @ReactMethod
    public void insertMessage(ReadableMap message) {
    }

    @ReactMethod
    public void deleteMessage(ReadableArray messages) {
        String[] rctMessages = new String[messages.size()];
        for (int i = 0; i < messages.size(); i++) {
            ReadableMap item = messages.getMap(i);
            if (item.hasKey(MessageConstant.Message.MSG_ID)) {
                String id = item.getString(MessageConstant.Message.MSG_ID);
                rctMessages[i] = id;
            }
        }
        Intent intent = new Intent();
        intent.setAction(ReactMsgListManager.RCT_DELETE_MESSAGES_ACTION);
        intent.putExtra("messages", rctMessages);
        getReactApplicationContext().sendBroadcast(intent);
    }

    @ReactMethod
    public void clearMessage() {
        Intent intent = new Intent();
        intent.setAction(ReactMsgListManager.RCT_CLEAR_MESSAGES_ACTION);
        getReactApplicationContext().sendBroadcast(intent);
    }

    @ReactMethod
    public void stopPlayVoice() {
        Log.w(getClass().getName(), "stopPlayVoice");
        Intent intent = new Intent();
        intent.setAction(ReactMsgListManager.RCT_STOP_PLAY_VOICE_ACTION);
        getReactApplicationContext().sendBroadcast(intent);
    }

    @ReactMethod
    public void scrollToBottom() {
        Intent intent = new Intent();
        intent.setAction(ReactMsgListManager.RCT_SCROLL_TO_BOTTOM_ACTION);
        getReactApplicationContext().sendBroadcast(intent);
    }

    @ReactMethod
    public void getAitMember(ReadableMap member) {

        RCTMember chatInput = configChatInput(member);
        Intent intent = new Intent();
        intent.setAction(ReactChatInputManager.RCT_AIT_MEMBERS_ACTION);
        intent.putExtra(ReactChatInputManager.RCT_DATA, chatInput.toString());
        getReactApplicationContext().sendBroadcast(intent);
    }

}
