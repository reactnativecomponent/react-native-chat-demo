package cn.jiguang.imui.messagelist;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ImageView;

import com.bumptech.glide.DrawableTypeRequest;
import com.bumptech.glide.Glide;
import com.bumptech.glide.RequestManager;
import com.bumptech.glide.request.target.Target;
import com.dialog.CustomAlertDialog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.popup.tool.PopupUtil;
import com.popupmenu.NIMPopupMenu;
import com.popupmenu.PopupMenuItem;
import com.scwang.smartrefresh.header.WaterDropHeader;
import com.scwang.smartrefresh.layout.SmartRefreshLayout;
import com.scwang.smartrefresh.layout.api.RefreshLayout;
import com.scwang.smartrefresh.layout.header.ClassicsHeader;
import com.scwang.smartrefresh.layout.listener.OnRefreshListener;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import cn.jiguang.imui.commons.ImageLoader;
import cn.jiguang.imui.commons.models.IMediaFile;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.module.RCTMessage;
import cn.jiguang.imui.messages.MessageList;
import cn.jiguang.imui.messages.MsgListAdapter;
import cn.jiguang.imui.utils.PhotoViewPagerViewUtil;
import cn.jiguang.imui.utils.SessorUtil;

import static cn.jiguang.imui.messagelist.MessageUtil.configMessage;


public class ReactMsgListManager extends ViewGroupManager<SmartRefreshLayout> implements LifecycleEventListener {

    private static final String REACT_MESSAGE_LIST = "RCTMessageList";
    private static final String TAG = "RCTMessageList";
    public static final String SEND_MESSAGE = "send_message";
    private static final String RECEIVE_MESSAGE = "receive_message";
    private static final String LOAD_HISTORY = "load_history_message";
    private static final String UPDATE_MESSAGE = "update_message";

    private static final String ON_LINK_CLICK_EVENT = "onLinkClick";
    private static final String ON_AVATAR_CLICK_EVENT = "onAvatarClick";
    private static final String ON_MSG_CLICK_EVENT = "onMsgClick";
    private static final String ON_MSG_LONG_CLICK_EVENT = "onMsgLongClick";
    private static final String ON_STATUS_VIEW_CLICK_EVENT = "onStatusViewClick";
    private static final String ON_TOUCH_MSG_LIST_EVENT = "onTouchMsgList";
    private static final String ON_PULL_TO_REFRESH_EVENT = "onPullToRefresh";
    private static final String ON_CLICK_CHANGE_AUTO_SCROLL_EVENT = "onClickChangeAutoScroll";
    private static final String ON_DECODE_QR_CODE_EVENT = "onClickScanImageView";

    public static final String RCT_APPEND_MESSAGES_ACTION = "cn.jiguang.imui.messagelist.intent.appendMessages";
    public static final String RCT_UPDATE_MESSAGE_ACTION = "cn.jiguang.imui.messagelist.intent.updateMessage";
    public static final String RCT_INSERT_MESSAGES_ACTION = "cn.jiguang.imui.messagelist.intent.insertMessages";
    public static final String RCT_DELETE_MESSAGES_ACTION = "cn.jiguang.imui.messagelist.intent.deleteMessages";
    public static final String RCT_CLEAR_MESSAGES_ACTION = "cn.jiguang.imui.messagelist.intent.clearMessages";
    public static final String RCT_STOP_PLAY_VOICE_ACTION = "cn.jiguang.imui.messagelist.intent.stopPlayVoice";

    public static final String RCT_SCROLL_TO_BOTTOM_ACTION = "cn.jiguang.imui.messagelist.intent.scrollToBottom";

    private MsgListAdapter mAdapter;
    private ReactContext mContext;
    private MessageList msgList;
    private SmartRefreshLayout swipeRefreshLayout;

    static {
        ClassicsHeader.REFRESH_HEADER_PULLDOWN = "";
        ClassicsHeader.REFRESH_HEADER_REFRESHING = "";
        ClassicsHeader.REFRESH_HEADER_LOADING = "";
        ClassicsHeader.REFRESH_HEADER_RELEASE = "";
        ClassicsHeader.REFRESH_HEADER_FINISH = "";
        ClassicsHeader.REFRESH_HEADER_FAILED = "";
        ClassicsHeader.REFRESH_HEADER_LASTTIME = "";
    }

    @Override
    public String getName() {
        return REACT_MESSAGE_LIST;
    }

    @SuppressLint("ClickableViewAccessibility")
    @SuppressWarnings("unchecked")
    @Override
    protected SmartRefreshLayout createViewInstance(final ThemedReactContext reactContext) {
        Log.w(TAG, "createViewInstance");
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(RCT_APPEND_MESSAGES_ACTION);
        intentFilter.addAction(RCT_UPDATE_MESSAGE_ACTION);
        intentFilter.addAction(RCT_INSERT_MESSAGES_ACTION);
        intentFilter.addAction(RCT_DELETE_MESSAGES_ACTION);
        intentFilter.addAction(RCT_CLEAR_MESSAGES_ACTION);
        intentFilter.addAction(RCT_STOP_PLAY_VOICE_ACTION);
        intentFilter.addAction(RCT_SCROLL_TO_BOTTOM_ACTION);

        mContext = reactContext;
        reactContext.addLifecycleEventListener(this);
        SessorUtil.getInstance(reactContext).register(true);
        mContext.registerReceiver(RCTMsgListReceiver, intentFilter);

        swipeRefreshLayout = new SmartRefreshLayout(reactContext) {
            private final Runnable measureAndLayout = new Runnable() {

                int width = 0;
                int height = 0;

                @Override
                public void run() {

                    width = getWidth();
                    height = getHeight();
                    measure(MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
                            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY));
                    layout(getLeft(), getTop(), getRight(), getBottom());
                }
            };

            @Override
            public void requestLayout() {
                super.requestLayout();
                post(measureAndLayout);
            }
        };
        Activity activity = reactContext.getCurrentActivity();
        msgList = new MessageList(activity, null);
        swipeRefreshLayout.addView(msgList);

        final Handler handler = new Handler() {

            @Override
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case 1:
                        swipeRefreshLayout.finishRefresh(true);
                        break;
                }
            }
        };
//        swipeRefreshLayout.setProgressBackgroundColorSchemeColor(Color.WHITE);
//        swipeRefreshLayout.setColorSchemeColors(Color.BLUE,Color.GREEN,Color.YELLOW,Color.RED);
//        swipeRefreshLayout.setEnabled(false);
//        swipeRefreshLayout.setRefreshStyle(SmartRefreshLayout.RefreshStyle.PINNED);
        SmartRefreshLayout refreshLayout = swipeRefreshLayout;


        WaterDropHeader header = new WaterDropHeader(reactContext);
        refreshLayout.setRefreshHeader(header);
        swipeRefreshLayout.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh(RefreshLayout refreshlayout) {
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),
                        ON_PULL_TO_REFRESH_EVENT, null);
                handler.sendEmptyMessageDelayed(1, 5000);
            }
        });
        // Use default layout
        MsgListAdapter.HoldersConfig holdersConfig = new MsgListAdapter.HoldersConfig();
        ImageLoader imageLoader = new ImageLoader() {
            @Override
            public void loadAvatarImage(ImageView avatarImageView, String string) {

                Log.w(TAG, "loadAvatarImage: " + string);
                if (reactContext == null || reactContext.getCurrentActivity() == null || string == null) {
                    return;
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                    if (reactContext.getCurrentActivity().isDestroyed()) {
                        return;
                    }
                }
                if (string.startsWith("http://") || string.startsWith("https://")) {
                    Glide.with(reactContext)
                            .load(string)
                            .placeholder(IdHelper.getDrawable(reactContext, "aurora_headicon_default"))
                            .into(avatarImageView);
                } else {
                    int resId = IdHelper.getDrawable(reactContext, string);
                    if (resId != 0) {
                        avatarImageView.setImageResource(resId);
                    }
                }
            }

            @Override
            public void loadImage(ImageView imageView, String string) {
                // You can use other image load libraries.
                if (reactContext == null || reactContext.getCurrentActivity() == null) {
                    return;
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                    if (reactContext.getCurrentActivity().isDestroyed()) {
                        return;
                    }
                }
                if (string != null) {
                    try {
                        RequestManager m = Glide.with(reactContext);
                        DrawableTypeRequest request;

                        if (string.startsWith("http://") || string.startsWith("https://")) {
                            request = m.load(string);
                        } else {
                            request = m.load(new File(string));
                        }
                        request.fitCenter()
                                .placeholder(IdHelper.getDrawable(reactContext, "aurora_picture_not_found"))
                                .override(imageView.getMaxWidth(), Target.SIZE_ORIGINAL)
                                .into(imageView);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }


            }
        };
        mAdapter = new MsgListAdapter<>("0", holdersConfig, imageLoader);
        mAdapter.setActivity(mContext.getCurrentActivity());
        msgList.setAdapter(mAdapter, 5);
        mAdapter.setOnMsgClickListener(new MsgListAdapter.OnMsgClickListener<RCTMessage>() {
            @Override
            public void onMessageClick(RCTMessage message) {
                if (message.getType() == IMessage.MessageType.SEND_IMAGE || message.getType() == IMessage.MessageType.RECEIVE_IMAGE) {
                    IMediaFile extend = (IMediaFile) message.getExtend();
                    PhotoViewPagerViewUtil.show(reactContext.getCurrentActivity(), mAdapter.getImageList(), mAdapter.getImageIndex(extend), longClickListener);
                    return;
                }
                WritableMap event = Arguments.createMap();
                event.putMap("message", message.toWritableMap());
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), ON_MSG_CLICK_EVENT, event);
            }
        });

        mAdapter.setMsgLongClickListener(new MsgListAdapter.OnMsgLongClickListener<RCTMessage>() {
            @Override
            public void onMessageLongClick(RCTMessage message) {
                showMenu(reactContext, message);
//                WritableMap event = Arguments.createMap();
//                event.putMap("message", message.toWritableMap());
//                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), ON_MSG_LONG_CLICK_EVENT, event);
            }
        });

        mAdapter.setOnAvatarClickListener(new MsgListAdapter.OnAvatarClickListener<RCTMessage>() {
            @Override
            public void onAvatarClick(View view, RCTMessage message) {
//                initPopuptWindow(reactContext.getCurrentActivity(), view, "", 1);
                WritableMap event = Arguments.createMap();
                event.putMap("message", message.toWritableMap());
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), ON_AVATAR_CLICK_EVENT, event);
            }
        });

        mAdapter.setOnLinkClickListener(new MsgListAdapter.OnLinkClickListener() {
            @Override
            public void onLinkClick(View view, String o) {
                WritableMap event = Arguments.createMap();
                event.putString("message", o);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), ON_LINK_CLICK_EVENT, event);
            }
        });
        mAdapter.setMsgResendListener(new MsgListAdapter.OnMsgResendListener<RCTMessage>() {
            @Override
            public void onMessageResend(RCTMessage message) {
                WritableMap event = Arguments.createMap();
                event.putMap("message", message.toWritableMap());
                event.putString("opt", "resend");
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), ON_STATUS_VIEW_CLICK_EVENT, event);
            }
        });

        msgList.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), ON_TOUCH_MSG_LIST_EVENT, null);
                        if (reactContext.getCurrentActivity() != null) {
                            InputMethodManager imm = (InputMethodManager) reactContext.getCurrentActivity()
                                    .getSystemService(Context.INPUT_METHOD_SERVICE);
                            imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                            Window window = reactContext.getCurrentActivity().getWindow();
                            window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN
                                    | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
                        }
                        break;
                    case MotionEvent.ACTION_UP:
                        v.performClick();
                        break;
                }
                return false;
            }
        });
        mAdapter.setOnLoadMoreListener(new MsgListAdapter.OnLoadMoreListener() {
            @Override
            public void onLoadMore(int page, int total) {
//                swipeRefreshLayout.setRefreshing(true);
            }

            @Override
            public void onAutoScroll(boolean autoScroll) {
                WritableMap event = Arguments.createMap();
                event.putBoolean("isAutoScroll", autoScroll);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),
                        ON_CLICK_CHANGE_AUTO_SCROLL_EVENT, event);
            }
        });
        return swipeRefreshLayout;
    }

    int getId() {
        return swipeRefreshLayout.getId();
    }

    private PhotoViewPagerViewUtil.IPhotoLongClickListener longClickListener = new PhotoViewPagerViewUtil.IPhotoLongClickListener() {
        @Override
        public boolean onClick(final Dialog dialog, View v, final IMediaFile mediaFile) {
            String code = null;
            try {
                code = DecodeUtil.parseQRcodeBitmap(mediaFile.getThumbPath());
            } catch (Exception e) {
                e.printStackTrace();
            }
            List<String> list = new ArrayList<>();
            list.add("保存图片");
            if (code != null) {
                list.add("识别图中二维码");
            }
            list.add("取消");
            final String finalCode = code;
            PopupUtil.showDialog(mContext.getCurrentActivity(), null, list, new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    if (position == 0) {
                        PhotoViewPagerViewUtil.saveImageToAlbum(mediaFile, mContext);
                    } else if (position == 1) {
                        dialog.dismiss();
//                        Toast.makeText(mContext, finalCode, Toast.LENGTH_SHORT).show();
                        WritableMap event = Arguments.createMap();
                        event.putString("result", finalCode);
                        mContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),
                                ON_DECODE_QR_CODE_EVENT, event);
                    }
                }
            });
            return false;
        }
    };

    void showMenu(final ReactContext reactContext, final RCTMessage message) {
        CustomAlertDialog dialog = new CustomAlertDialog(reactContext.getCurrentActivity());
        if (message.getType() == IMessage.MessageType.RECEIVE_TEXT || message.getType() == IMessage.MessageType.SEND_TEXT) {
            dialog.addItem("复制", new CustomAlertDialog.onSeparateItemClickListener() {
                @Override
                public void onClick() {
//                    ClipboardManager cm = (ClipboardManager) reactContext.getSystemService(Context.CLIPBOARD_SERVICE);
//                    cm.setText(message.getText());
                    WritableMap event = Arguments.createMap();
                    event.putMap("message", message.toWritableMap());
                    event.putString("opt", "copy");
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),
                            ON_STATUS_VIEW_CLICK_EVENT, event);
                }
            });
        }
        dialog.addItem("删除", new CustomAlertDialog.onSeparateItemClickListener() {
            @Override
            public void onClick() {
                WritableMap event = Arguments.createMap();
                event.putMap("message", message.toWritableMap());
                event.putString("opt", "delete");
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),
                        ON_STATUS_VIEW_CLICK_EVENT, event);
            }
        });
        if (message.isOutgoing()
                && (message.getType() != IMessage.MessageType.SEND_RED_PACKET
                && message.getType() != IMessage.MessageType.SEND_BANK_TRANSFER)) {
            dialog.addItem("撤回", new CustomAlertDialog.onSeparateItemClickListener() {
                @Override
                public void onClick() {
                    WritableMap event = Arguments.createMap();
                    event.putMap("message", message.toWritableMap());
                    event.putString("opt", "revoke");
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),
                            ON_STATUS_VIEW_CLICK_EVENT, event);
                }
            });
        }
        dialog.show();
    }

    private static NIMPopupMenu.MenuItemClickListener listener = new NIMPopupMenu.MenuItemClickListener() {
        @Override
        public void onItemClick(final PopupMenuItem item) {
            switch (item.getTag()) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:

                    break;
            }
        }
    };
    private static NIMPopupMenu popupMenu;
    private static List<PopupMenuItem> menuItemList;

    private static void initPopuptWindow(Context context, View view, String sessionId, int sessionTypeEnum) {
        if (popupMenu == null) {
            menuItemList = new ArrayList<>();
            popupMenu = new NIMPopupMenu(context, menuItemList, listener);
        }
        menuItemList.clear();
        menuItemList.addAll(getMoreMenuItems(context, sessionId, sessionTypeEnum));
        popupMenu.notifyData();
        popupMenu.show(view);
    }

    private static List<PopupMenuItem> getMoreMenuItems(Context context, String sessionId, int sessionTypeEnum) {
        List<PopupMenuItem> moreMenuItems = new ArrayList<PopupMenuItem>();
        moreMenuItems.add(new PopupMenuItem(1, R.drawable.nim_picker_image_selected, "云消息记录"));
        moreMenuItems.add(new PopupMenuItem(2, R.drawable.nim_picker_image_selected, "云消息记录"));
        moreMenuItems.add(new PopupMenuItem(3, R.drawable.nim_picker_image_selected, "云消息记录"));
        return moreMenuItems;
    }

    @ReactProp(name = "initList")
    public void setInitList(SmartRefreshLayout messageList, ReadableArray messages) {

        mAdapter.clear();
        if (messages != null && messages.size() > 0) {
            final List<RCTMessage> list = new ArrayList<>();
            for (int i = 0; i < messages.size(); i++) {
                RCTMessage rctMessage = configMessage(messages.getMap(i));
                list.add(rctMessage);
            }
            mAdapter.addToStart(list, true, false);
        }
    }

    @ReactProp(name = "sendBubble")
    public void setSendBubble(SmartRefreshLayout messageList, ReadableMap map) {
        int resId = mContext.getResources().getIdentifier(map.getString("imageName"), "drawable", mContext.getPackageName());
        if (resId != 0) {
            msgList.setSendBubbleDrawable(resId);
        }
    }

    @ReactProp(name = "receiveBubble")
    public void setReceiveBubble(SmartRefreshLayout messageList, ReadableMap map) {
        int resId = mContext.getResources().getIdentifier(map.getString("imageName"), "drawable", mContext.getPackageName());
        if (resId != 0) {
            msgList.setReceiveBubbleDrawable(resId);
        }
    }

    @ReactProp(name = "sendBubbleTextColor")
    public void setSendBubbleTextColor(SmartRefreshLayout messageList, String color) {
        int colorRes = Color.parseColor(color);
        msgList.setSendBubbleTextColor(colorRes);
    }

    @ReactProp(name = "receiveBubbleTextColor")
    public void setReceiveBubbleTextColor(SmartRefreshLayout messageList, String color) {
        int colorRes = Color.parseColor(color);
        msgList.setReceiveBubbleTextColor(colorRes);
    }

    @ReactProp(name = "sendBubbleTextSize")
    public void setSendBubbleTextSize(SmartRefreshLayout messageList, int size) {
        msgList.setSendBubbleTextSize(size);
    }

    @ReactProp(name = "receiveBubbleTextSize")
    public void setReceiveBubbleTextSize(SmartRefreshLayout messageList, int size) {
        msgList.setReceiveBubbleTextSize(size);
    }

    @ReactProp(name = "sendBubblePadding")
    public void setSendBubblePadding(SmartRefreshLayout messageList, ReadableMap map) {
        msgList.setSendBubblePaddingLeft(map.getInt("left"));
        msgList.setSendBubblePaddingTop(map.getInt("top"));
        msgList.setSendBubblePaddingRight(map.getInt("right"));
        msgList.setSendBubblePaddingBottom(map.getInt("bottom"));
    }

    @ReactProp(name = "receiveBubblePadding")
    public void setReceiveBubblePaddingLeft(SmartRefreshLayout messageList, ReadableMap map) {
        msgList.setReceiveBubblePaddingLeft(map.getInt("left"));
        msgList.setReceiveBubblePaddingTop(map.getInt("top"));
        msgList.setReceiveBubblePaddingRight(map.getInt("right"));
        msgList.setReceiveBubblePaddingBottom(map.getInt("bottom"));
    }

    @ReactProp(name = "dateTextSize")
    public void setDateTextSize(SmartRefreshLayout messageList, int size) {
        msgList.setDateTextSize(size);
    }

    @ReactProp(name = "dateTextColor")
    public void setDateTextColor(SmartRefreshLayout messageList, String color) {
        int colorRes = Color.parseColor(color);
        msgList.setDateTextColor(colorRes);
    }

    @ReactProp(name = "datePadding")
    public void setDatePadding(SmartRefreshLayout messageList, int padding) {
        msgList.setDatePadding(padding);
    }

    @ReactProp(name = "avatarSize")
    public void setAvatarWidth(SmartRefreshLayout messageList, ReadableMap map) {
        msgList.setAvatarWidth(map.getInt("width"));
        msgList.setAvatarHeight(map.getInt("height"));
    }

    /**
     * if showDisplayName equals 1, then show display name.
     *
     * @param messageList       SmartRefreshLayout
     * @param isShowDisplayName boolean
     */
    @ReactProp(name = "isShowDisplayName")
    public void setShowDisplayName(SmartRefreshLayout messageList, boolean isShowDisplayName) {
        if (isShowDisplayName) {
            msgList.setShowDisplayName(1);
        }
    }

    @SuppressWarnings("unchecked")
    private BroadcastReceiver RCTMsgListReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Activity activity = mContext.getCurrentActivity();

            Gson gson = new GsonBuilder().registerTypeAdapter(RCTMessage.class, new RCTMessageDeserializer())
                    .create();
            if (intent.getAction().equals(RCT_APPEND_MESSAGES_ACTION)) {
                String[] messages = intent.getStringArrayExtra("messages");
                final List<RCTMessage> list = new ArrayList<>();
                for (String rctMsgStr : messages) {
                    final RCTMessage rctMessage = gson.fromJson(rctMsgStr, RCTMessage.class);
                    Log.d("RCTMessageListManager", "Add message to start, message: " + rctMsgStr);
                    Log.d("RCTMessageListManager", "RCTMessage: " + rctMessage);

                    list.add(rctMessage);

                }
                if (activity != null) {
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            mAdapter.addToStart(list, false, true);
                        }
                    });
                }
            } else if (intent.getAction().equals(RCT_UPDATE_MESSAGE_ACTION)) {
                String message = intent.getStringExtra("message");
                final RCTMessage rctMessage = gson.fromJson(message, RCTMessage.class);
                Log.d("RCTMessageListManager", "updating message, message: " + rctMessage);
                if (activity != null) {
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            mAdapter.updateMessage(rctMessage.getMsgId(), rctMessage);
                        }
                    });
                }
            } else if (intent.getAction().equals(RCT_INSERT_MESSAGES_ACTION)) {
                swipeRefreshLayout.finishRefresh(true);
                String[] messages = intent.getStringArrayExtra("messages");
                List<RCTMessage> list = new ArrayList<>();
                for (int i = messages.length - 1; i > -1; i--) {
//                for (int i = 0; i < messages.length; i++) {
                    final RCTMessage rctMessage = gson.fromJson(messages[i], RCTMessage.class);
                    list.add(rctMessage);
                }
                Log.d("RCTMessageListManager", "Add send message to top, messages: " + list.toString());
                mAdapter.addToEnd(list);
            } else if (intent.getAction().equals(RCT_SCROLL_TO_BOTTOM_ACTION)) {
                Log.i("RCTMessageListManager", "Scroll to bottom");
                if (msgList != null)
                    msgList.smoothScrollToPosition(0);
//                mAdapter.getLayoutManager().scrollToPosition(0);
            } else if (intent.getAction().equals(RCT_DELETE_MESSAGES_ACTION)) {
                String[] messages = intent.getStringArrayExtra("messages");
                for (int i = 0; i < messages.length; i++) {
                    mAdapter.delete(messages[i]);
                }
            } else if (intent.getAction().equals(RCT_CLEAR_MESSAGES_ACTION)) {
                if (mAdapter != null)
                    mAdapter.clear();
            } else if (intent.getAction().equals(RCT_STOP_PLAY_VOICE_ACTION)) {
                Log.w(TAG, "stopPlayVoice");
                if (mAdapter != null)
                    mAdapter.stopPlayVoice();
            }
        }
    };

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(ON_AVATAR_CLICK_EVENT, MapBuilder.of("registrationName", ON_AVATAR_CLICK_EVENT))
                .put(ON_MSG_CLICK_EVENT, MapBuilder.of("registrationName", ON_MSG_CLICK_EVENT))
                .put(ON_MSG_LONG_CLICK_EVENT, MapBuilder.of("registrationName", ON_MSG_LONG_CLICK_EVENT))
                .put(ON_STATUS_VIEW_CLICK_EVENT, MapBuilder.of("registrationName", ON_STATUS_VIEW_CLICK_EVENT))
                .put(ON_LINK_CLICK_EVENT, MapBuilder.of("registrationName", ON_LINK_CLICK_EVENT))
                .put(ON_TOUCH_MSG_LIST_EVENT, MapBuilder.of("registrationName", ON_TOUCH_MSG_LIST_EVENT))
                .put(ON_PULL_TO_REFRESH_EVENT, MapBuilder.of("registrationName", ON_PULL_TO_REFRESH_EVENT))
                .put(ON_CLICK_CHANGE_AUTO_SCROLL_EVENT, MapBuilder.of("registrationName", ON_CLICK_CHANGE_AUTO_SCROLL_EVENT))
                .put(ON_DECODE_QR_CODE_EVENT, MapBuilder.of("registrationName", ON_DECODE_QR_CODE_EVENT))
                .build();
    }

    @Override
    public void onDropViewInstance(SmartRefreshLayout view) {
        super.onDropViewInstance(view);
        Log.w(TAG, "onDropViewInstance");
        try {
            if (mAdapter != null) {
                mAdapter.stopPlayVoice();
            }
            SessorUtil.getInstance(mContext).register(false);
            mContext.unregisterReceiver(RCTMsgListReceiver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        Log.w(TAG, "onCatalystInstanceDestroy");

    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {
        Log.w(TAG, "onHostPause");
        if (mAdapter != null)
            mAdapter.stopPlayVoice();
    }

    @Override
    public void onHostDestroy() {

    }
}
