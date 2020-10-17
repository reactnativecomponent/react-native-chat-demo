package cn.jiguang.imui.messages;

import android.app.Activity;
import android.content.Context;
import android.media.MediaPlayer;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import androidx.annotation.LayoutRes;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.ImageLoader;
import cn.jiguang.imui.commons.ViewHolder;
import cn.jiguang.imui.commons.models.IMediaFile;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.viewholder.AccountNoticeViewHolder;
import cn.jiguang.imui.messages.viewholder.BankTransferViewHolder;
import cn.jiguang.imui.messages.viewholder.BaseMessageViewHolder;
import cn.jiguang.imui.messages.viewholder.CardViewHolder;
import cn.jiguang.imui.messages.viewholder.CustonViewHolder;
import cn.jiguang.imui.messages.viewholder.EventViewHolder;
import cn.jiguang.imui.messages.viewholder.LinkViewHolder;
import cn.jiguang.imui.messages.viewholder.LocationViewHolder;
import cn.jiguang.imui.messages.viewholder.NotificationViewHolder;
import cn.jiguang.imui.messages.viewholder.PhotoViewHolder;
import cn.jiguang.imui.messages.viewholder.RedPacketOpenViewHolder;
import cn.jiguang.imui.messages.viewholder.RedPacketViewHolder;
import cn.jiguang.imui.messages.viewholder.TipViewHoler;
import cn.jiguang.imui.messages.viewholder.TxtViewHolder;
import cn.jiguang.imui.messages.viewholder.VideoViewHolder;
import cn.jiguang.imui.messages.viewholder.VoiceViewHolder;


public class MsgListAdapter<MESSAGE extends IMessage> extends RecyclerView.Adapter<ViewHolder>
        implements ScrollMoreListener.OnLoadMoreListener {

    // Text message
    private final int TYPE_RECEIVE_TXT = 0;
    private final int TYPE_SEND_TXT = 1;

    // Photo message
    private final int TYPE_SEND_IMAGE = 2;
    private final int TYPE_RECEIVER_IMAGE = 3;

    // Location message
    private final int TYPE_SEND_LOCATION = 4;
    private final int TYPE_RECEIVER_LOCATION = 5;

    // Voice message
    private final int TYPE_SEND_VOICE = 6;
    private final int TYPE_RECEIVER_VOICE = 7;

    // Video message
    private final int TYPE_SEND_VIDEO = 8;
    private final int TYPE_RECEIVE_VIDEO = 9;

    // Group change message
    private final int TYPE_EVENT = 10;

    // Custom message
    private final int TYPE_CUSTOM = 11;

    private final int TYPE_SEND_RED_PACKET = 13;
    private final int TYPE_RECEIVER_RED_PACKET = 14;

    private final int TYPE_SEND_BANK_TRANSFER = 15;
    private final int TYPE_RECEIVER_BANK_TRANSFER = 16;

    private final int TYPE_RED_PACKET_OPEN = 17;
    private final int TYPE_NOTIFICATION = 18;

    private final int TYPE_TIP = 19;

    private final int TYPE_SEND_LINK = 20;
    private final int TYPE_RECEIVER_LINK = 21;

    private final int TYPE_SEND_ACCOUNT_NOTICE = 22;
    private final int TYPE_RECEIVER_ACCOUNT_NOTICE = 23;

    private final int TYPE_SEND_CARD = 24;
    private final int TYPE_RECEIVER_CARD = 25;

    private Context mContext;
    private Activity mActivity;
    private String mSenderId;
    private HoldersConfig mHolders;
    private OnLoadMoreListener mListener;

    private ImageLoader mImageLoader;
    private boolean mIsSelectedMode;
    private OnMsgClickListener<MESSAGE> mMsgClickListener;
    private OnMsgLongClickListener<MESSAGE> mMsgLongClickListener;
    private OnAvatarClickListener<MESSAGE> mAvatarClickListener;
    private OnMsgResendListener<MESSAGE> mMsgResendListener;
    private OnLinkClickListener onLinkClickListener;
    private SelectionListener mSelectionListener;
    private int mSelectedItemCount;
    private LinearLayoutManager mLayoutManager;
    private MessageListStyle mStyle;
    private MediaPlayer mMediaPlayer = new MediaPlayer();

    private List<Wrapper> mItems;

    private Set<String> mTimedItems;
    private List<IMediaFile> imageList;

    private MESSAGE lastShowTimeItem;

    public MsgListAdapter(String senderId, ImageLoader imageLoader) {
        this(senderId, new HoldersConfig(), imageLoader);
    }

    public MsgListAdapter(String senderId, HoldersConfig holders, ImageLoader imageLoader) {
        mSenderId = senderId;
        mHolders = holders;
        mImageLoader = imageLoader;
        mItems = new ArrayList<>();
        mTimedItems = new HashSet<>();
        imageList = new ArrayList<>();
    }

    public boolean needShowTime(MESSAGE message) {
        return mTimedItems.contains(message.getMsgId());
    }

    private void setShowTime(MESSAGE message, boolean show) {
        //Log.w("MsgListAdatper", message.getTimeString() + "-" + show);
        if (show) {
            mTimedItems.add(message.getMsgId());
        } else {
            mTimedItems.remove(message.getMsgId());
        }
    }

    public void updateShowTimeItem(List<MESSAGE> items, boolean fromStart, boolean update) {
        MESSAGE anchor = fromStart ? null : lastShowTimeItem;
        for (MESSAGE item : items) {
            if (setShowTimeFlag(item, anchor)) {
                anchor = item;
            }
        }

        if (update) {
            lastShowTimeItem = anchor;
        }
    }

    private boolean setShowTimeFlag(MESSAGE message, MESSAGE anchor) {
        boolean update = false;

        if (hideTimeAlways(message)) {
            setShowTime(message, false);
        } else {
            if (anchor == null) {
                setShowTime(message, true);
                update = true;
            } else {
                long time = anchor.getTime();
                long now = message.getTime();

                if (now - time == 0) {
                    // 消息撤回时使用
                    setShowTime(message, true);
                    lastShowTimeItem = message;
                    update = true;
                } else if (now - time < (long) (5 * 60 * 1000)) {
                    setShowTime(message, false);
                } else {
                    setShowTime(message, true);
                    update = true;
                }
            }
        }

        return update;
    }

    private boolean hideTimeAlways(MESSAGE message) {
        switch (message.getType()) {
            case NOTIFICATION:
                return true;
            default:
                return false;
        }
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        switch (viewType) {
            case TYPE_SEND_TXT:
                return getHolder(parent, mHolders.mSendTxtLayout, mHolders.mSendTxtHolder, true);
            case TYPE_RECEIVE_TXT:
                return getHolder(parent, mHolders.mReceiveTxtLayout, mHolders.mReceiveTxtHolder, false);
            case TYPE_SEND_VOICE:
                return getHolder(parent, mHolders.mSendVoiceLayout, mHolders.mSendVoiceHolder, true);
            case TYPE_RECEIVER_VOICE:
                return getHolder(parent, mHolders.mReceiveVoiceLayout, mHolders.mReceiveVoiceHolder, false);
            case TYPE_SEND_IMAGE:
                return getHolder(parent, mHolders.mSendPhotoLayout, mHolders.mSendPhotoHolder, true);
            case TYPE_RECEIVER_IMAGE:
                return getHolder(parent, mHolders.mReceivePhotoLayout, mHolders.mReceivePhotoHolder, false);
            case TYPE_SEND_VIDEO:
                return getHolder(parent, mHolders.mSendVideoLayout, mHolders.mSendVideoHolder, true);
            case TYPE_RECEIVE_VIDEO:
                return getHolder(parent, mHolders.mReceiveVideoLayout, mHolders.mReceiveVideoHolder, false);
            case TYPE_EVENT:
                return getHolder(parent, mHolders.mEventLayout, mHolders.mEventMsgHolder, true);
            case TYPE_CUSTOM:
                return getHolder(parent, mHolders.mCustomMsgLayout, mHolders.mCustomMsgHolder, true);


            case TYPE_TIP:
                return getHolder(parent, mHolders.mTipLayout, mHolders.mTipMsgHolder, true);
            case TYPE_NOTIFICATION:
                return getHolder(parent, mHolders.mNotificationLayout, mHolders.mNotificationMsgHolder, true);
            case TYPE_RED_PACKET_OPEN:
                return getHolder(parent, mHolders.mRedPacketOpenLayout, mHolders.mRedPacketOpenMsgHolder, true);
            case TYPE_SEND_RED_PACKET:
                return getHolder(parent, mHolders.mSendRedPacketLayout, mHolders.mSendRedPacketHolder, true);
            case TYPE_RECEIVER_RED_PACKET:
                return getHolder(parent, mHolders.mReceiveRedPacketLayout, mHolders.mReceiveRedPacketHolder, false);
            case TYPE_SEND_BANK_TRANSFER:
                return getHolder(parent, mHolders.mSendBankTransferLayout, mHolders.mSendBankTransferHolder, true);
            case TYPE_RECEIVER_BANK_TRANSFER:
                return getHolder(parent, mHolders.mReceiveBankTransferLayout, mHolders.mReceiveBankTransferHolder, false);
            case TYPE_SEND_ACCOUNT_NOTICE:
                return getHolder(parent, mHolders.mSendAccountNoticeLayout, mHolders.mSendAccountNoticeHolder, true);
            case TYPE_RECEIVER_ACCOUNT_NOTICE:
                return getHolder(parent, mHolders.mReceiveAccountNoticeLayout, mHolders.mReceiveAccountNoticeHolder, false);

            case TYPE_SEND_CARD:
                return getHolder(parent, mHolders.mSendCardLayout, mHolders.mSendCardHolder, true);
            case TYPE_RECEIVER_CARD:
                return getHolder(parent, mHolders.mReceiveCardLayout, mHolders.mReceiveCardHolder, false);
            case TYPE_SEND_LOCATION:
                return getHolder(parent, mHolders.mSendLocationLayout, mHolders.mSendLocationHolder, true);
            case TYPE_RECEIVER_LOCATION:
                return getHolder(parent, mHolders.mReceiveLocationLayout, mHolders.mReceiveLocationHolder, false);
            case TYPE_SEND_LINK:
                return getHolder(parent, mHolders.mSendLinkLayout, mHolders.mSendLinkHoler, true);
            case TYPE_RECEIVER_LINK:
                return getHolder(parent, mHolders.mReceiveLinkLayout, mHolders.mReceiveLinkHolder, false);
            default:
                return getHolder(parent, mHolders.mCustomMsgLayout, mHolders.mCustomMsgHolder, false);
        }
    }

    @Override
    public int getItemViewType(int position) {
        Wrapper wrapper = mItems.get(position);
        if (wrapper.item instanceof IMessage) {
            IMessage message = (IMessage) wrapper.item;
            switch (message.getType()) {
                case SEND_TEXT:
                    return TYPE_SEND_TXT;
                case RECEIVE_TEXT:
                    return TYPE_RECEIVE_TXT;
                case SEND_VOICE:
                    return TYPE_SEND_VOICE;
                case RECEIVE_VOICE:
                    return TYPE_RECEIVER_VOICE;
                case SEND_IMAGE:
                    return TYPE_SEND_IMAGE;
                case RECEIVE_IMAGE:
                    return TYPE_RECEIVER_IMAGE;
                case SEND_VIDEO:
                    return TYPE_SEND_VIDEO;
                case RECEIVE_VIDEO:
                    return TYPE_RECEIVE_VIDEO;
                case EVENT:
                    return TYPE_EVENT;
                case CUSTOM:
                    return TYPE_CUSTOM;

                case SEND_LOCATION:
                    return TYPE_SEND_LOCATION;
                case RECEIVE_LOCATION:
                    return TYPE_RECEIVER_LOCATION;
                case TIP:
                    return TYPE_TIP;
                case NOTIFICATION:
                    return TYPE_NOTIFICATION;
                case RED_PACKET_OPEN:
                    return TYPE_RED_PACKET_OPEN;
                case SEND_RED_PACKET:
                    return TYPE_SEND_RED_PACKET;
                case RECEIVE_RED_PACKET:
                    return TYPE_RECEIVER_RED_PACKET;
                case SEND_BANK_TRANSFER:
                    return TYPE_SEND_BANK_TRANSFER;
                case RECEIVE_BANK_TRANSFER:
                    return TYPE_RECEIVER_BANK_TRANSFER;

                case SEND_ACCOUNT_NOTICE:
                    return TYPE_SEND_ACCOUNT_NOTICE;
                case RECEIVE_ACCOUNT_NOTICE:
                    return TYPE_RECEIVER_ACCOUNT_NOTICE;

                case SEND_CARD:
                    return TYPE_SEND_CARD;
                case RECEIVE_CARD:
                    return TYPE_RECEIVER_CARD;
                case SEND_LINK:
                    return TYPE_SEND_LINK;
                case RECEIVE_LINK:
                    return TYPE_RECEIVER_LINK;
                default:
                    return TYPE_CUSTOM;
            }
        }
        return TYPE_CUSTOM;
    }

    private <HOLDER extends ViewHolder> ViewHolder getHolder(ViewGroup parent, @LayoutRes int layout,
                                                             Class<HOLDER> holderClass, boolean isSender) {
        View v = LayoutInflater.from(parent.getContext()).inflate(layout, parent, false);
        try {
            Constructor<HOLDER> constructor = holderClass.getDeclaredConstructor(RecyclerView.Adapter.class, View.class, boolean.class);
            constructor.setAccessible(true);
            HOLDER holder = constructor.newInstance(this, v, isSender);
            if (holder instanceof DefaultMessageViewHolder) {
                ((DefaultMessageViewHolder) holder).applyStyle(mStyle);
            }
            return holder;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Wrapper wrapper = mItems.get(holder.getAdapterPosition());
        if (wrapper.item instanceof IMessage) {
            ((BaseMessageViewHolder) holder).mPosition = holder.getAdapterPosition();
            ((BaseMessageViewHolder) holder).mContext = this.mContext;
            DisplayMetrics dm = mContext.getResources().getDisplayMetrics();
            ((BaseMessageViewHolder) holder).mDensity = dm.density;
            ((BaseMessageViewHolder) holder).mIsSelected = wrapper.isSelected;
            ((BaseMessageViewHolder) holder).mImageLoader = this.mImageLoader;
            ((BaseMessageViewHolder) holder).mMsgLongClickListener = this.mMsgLongClickListener;
            ((BaseMessageViewHolder) holder).mMsgClickListener = this.mMsgClickListener;
            ((BaseMessageViewHolder) holder).mAvatarClickListener = this.mAvatarClickListener;
            ((BaseMessageViewHolder) holder).mMsgResendListener = this.mMsgResendListener;
            ((BaseMessageViewHolder) holder).onLinkClickListener = this.onLinkClickListener;
            ((BaseMessageViewHolder) holder).mMediaPlayer = this.mMediaPlayer;
        }
        holder.onBind(wrapper.item);
    }

    public void setActivity(Activity mActivity) {
        this.mActivity = mActivity;
    }

    public Activity getActivity() {
        return mActivity;
    }

    @Override
    public int getItemCount() {
        return mItems.size();
    }

    private class Wrapper<DATA> {
        private DATA item;
        boolean isSelected;

        Wrapper(DATA item) {
            this.item = item;
        }
    }

    /**
     * Add message to bottom of list
     *
     * @param messages       message to be add
     * @param scrollToBottom if true scroll list to bottom
     */
    public void addToStart(List<MESSAGE> messages, boolean scrollToBottom, boolean check) {
        boolean first = mItems.isEmpty();
        updateShowTimeItem(messages, first, true);
        for (int i = 0; i < messages.size(); i++) {//3 2 1
            MESSAGE message = messages.get(i);

            if (check) {
                int position = getMessagePositionById(message.getMsgId());
                if (position >= 0) {
                    continue;
                }
            }
            mItems.add(0, new Wrapper<>(message));
            notifyItemRangeInserted(0, 1);
            addImage(message, false);
        }

//        notifyItemRangeInserted(0, messages.size());
        if (mLayoutManager != null) {
            if (scrollToBottom) {
                mLayoutManager.scrollToPosition(0);
            }
            mLayoutManager.requestLayout();
        }
    }

    boolean isToBottom() {
        int firstVisibleItemPosition = mLayoutManager.findFirstVisibleItemPosition();
        Log.w(getClass().getName(), firstVisibleItemPosition + "");
        return firstVisibleItemPosition <= 0;

    }

    /**
     * Add messages chronologically, to load last page of messages from history, use this method.
     *
     * @param messages Last page of messages.
     */
    public void addToEnd(List<MESSAGE> messages) {
        boolean updated = !mItems.isEmpty();
        int oldSize = mItems.size();
        for (int i = 0; i < messages.size(); i++) {
            MESSAGE message = messages.get(i);
            mItems.add(new Wrapper<>(message));
            addImage(message, true);
        }
        updateShowTimeItem(messages, true, updated);
        notifyItemRangeInserted(oldSize, mItems.size() - oldSize);
        if (mLayoutManager != null) {
            mLayoutManager.requestLayout();
        }
    }

    void deleteImage(MESSAGE message) {
        if (message.getType() == IMessage.MessageType.RECEIVE_IMAGE || message.getType() == IMessage.MessageType.SEND_IMAGE) {
            IMediaFile extend = (IMediaFile) message.getExtend();
            for (int i = 0; i < imageList.size(); i++) {
                if (TextUtils.equals(message.getMsgId(), imageList.get(i).getId())) {
                    imageList.remove(i);
                    break;
                }
            }
        }
    }

    void updateImage(MESSAGE message) {
        if (message.getType() == IMessage.MessageType.RECEIVE_IMAGE || message.getType() == IMessage.MessageType.SEND_IMAGE) {
            IMediaFile extend = (IMediaFile) message.getExtend();
            extend.setId(message.getMsgId());
            for (int i = 0; i < imageList.size(); i++) {
                if (TextUtils.equals(message.getMsgId(), imageList.get(i).getId())) {
                    imageList.set(i, extend);
                    break;
                }
            }
        }
    }

    void addImage(MESSAGE message, boolean fromStart) {
        if (message.getType() == IMessage.MessageType.RECEIVE_IMAGE || message.getType() == IMessage.MessageType.SEND_IMAGE) {
            IMediaFile extend = (IMediaFile) message.getExtend();
            extend.setId(message.getMsgId());
            if (fromStart) {
                imageList.add(0, extend);
            } else {
                imageList.add(extend);
            }
        }
    }

    public int getImageIndex(IMediaFile mediaFile) {
        for (int i = 0; i < imageList.size(); i++) {
            if (TextUtils.equals(imageList.get(i).getId(), mediaFile.getId())) {
                return i;
            }
        }
        return 0;
    }

    public List<IMediaFile> getImageList() {
        return imageList;
    }

    @SuppressWarnings("unchecked")
    private int getMessagePositionById(String id) {
        for (int i = 0; i < mItems.size(); i++) {
            Wrapper wrapper = mItems.get(i);
            if (wrapper.item instanceof IMessage) {
                MESSAGE message = (MESSAGE) wrapper.item;
                if (message.getMsgId().contentEquals(id)) {
                    return i;
                }
            }
        }
        return -1;
    }

    public List<MESSAGE> getMessageList() {
        List<MESSAGE> msgList = new ArrayList<>();
        for (Wrapper wrapper : mItems) {
            if (wrapper.item instanceof IMessage) {
                msgList.add((MESSAGE) wrapper.item);
            }
        }
        return msgList;
    }

    /**
     * Update message by its id.
     *
     * @param message message to be updated.
     */
    public void updateMessage(MESSAGE message) {
        updateMessage(message.getMsgId(), message);
    }

    /**
     * Updates message by old identifier.
     *
     * @param oldId      message id to be updated
     * @param newMessage message to be updated
     */
    public void updateMessage(String oldId, MESSAGE newMessage) {
        int position = getMessagePositionById(oldId);
        if (position >= 0) {
            Wrapper<MESSAGE> element = new Wrapper<>(newMessage);
            mItems.set(position, element);
            updateImage(newMessage);
            notifyItemChanged(position);
            if (mLayoutManager != null) {
                mLayoutManager.requestLayout();
            }
        } else {
            List<MESSAGE> list = new ArrayList<>();
            list.add(newMessage);
            addToStart(list, true, false);
        }

    }

    /**
     * Delete message.
     *
     * @param messageId message to be deleted.
     */
    public void delete(String messageId) {
        deleteById(messageId);
    }

    /**
     * Delete message by identifier.
     *
     * @param id identifier of message.
     */
    public void deleteById(String id) {
        int index = getMessagePositionById(id);
        if (index >= 0) {
            Wrapper wrapper = mItems.get(index);
            if (wrapper.item instanceof IMessage) {
                MESSAGE message = (MESSAGE) wrapper.item;
                deleteImage(message);
            }
            mItems.remove(index);
            notifyItemRemoved(index);
        }
    }

    /**
     * Delete messages.
     *
     * @param messages messages list to be deleted.
     */
    public void delete(List<MESSAGE> messages) {
        for (MESSAGE message : messages) {
            int index = getMessagePositionById(message.getMsgId());
            if (index >= 0) {
                mItems.remove(index);
                notifyItemRemoved(index);
            }
        }
    }

    /**
     * Delete messages by identifiers.
     *
     * @param ids ids array of identifiers of messages to be deleted.
     */
    public void deleteByIds(String[] ids) {
        for (String id : ids) {
            int index = getMessagePositionById(id);
            if (index >= 0) {
                mItems.remove(index);
                notifyItemRemoved(index);
            }
        }
    }

    /**
     * Clear messages list.
     */
    public void clear() {
        mItems.clear();
        mTimedItems.clear();
        lastShowTimeItem = null;
        notifyDataSetChanged();
    }

    /**
     * Enable selection mode.
     *
     * @param listener SelectionListener. To get selected messages use {@link #getSelectedMessages()}.
     */
    public void enableSelectionMode(SelectionListener listener) {
        if (listener == null) {
            throw new IllegalArgumentException("SelectionListener must not be null.");
        } else {
            mSelectionListener = listener;
        }
    }

    /**
     * Disable selection mode, and deselect all items.
     */
    public void disableSelectionMode() {
        mSelectionListener = null;
        deselectAllItems();
    }

    /**
     * Get selected messages.
     *
     * @return ArrayList with selected messages.
     */
    @SuppressWarnings("unchecked")
    public ArrayList<MESSAGE> getSelectedMessages() {
        ArrayList<MESSAGE> list = new ArrayList<>();
        for (Wrapper wrapper : mItems) {
            if (wrapper.item instanceof IMessage && wrapper.isSelected) {
                list.add((MESSAGE) wrapper.item);
            }
        }
        return list;
    }

    /**
     * Delete all selected messages
     */
    public void deleteSelectedMessages() {
        List<MESSAGE> selectedMessages = getSelectedMessages();
        delete(selectedMessages);
        deselectAllItems();
    }

    /**
     * Deselect all items.
     */
    public void deselectAllItems() {
        for (int i = 0; i < mItems.size(); i++) {
            Wrapper wrapper = mItems.get(i);
            if (wrapper.isSelected) {
                wrapper.isSelected = false;
                notifyItemChanged(i);
            }
        }
        mIsSelectedMode = false;
        mSelectedItemCount = 0;
        notifySelectionChanged();
    }

    private void notifySelectionChanged() {
        if (mSelectionListener != null) {
            mSelectionListener.onSelectionChanged(mSelectedItemCount);
        }
    }

    /**
     * Set onMsgClickListener, fires onClick event only if list is not in selection mode.
     *
     * @param listener OnMsgClickListener
     */
    public void setOnMsgClickListener(OnMsgClickListener<MESSAGE> listener) {
        mMsgClickListener = listener;
    }

    private View.OnClickListener getMsgClickListener(final Wrapper<MESSAGE> wrapper) {
        return new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (mSelectionListener != null && mIsSelectedMode) {
                    wrapper.isSelected = !wrapper.isSelected;
                    if (wrapper.isSelected) {
                        incrementSelectedItemsCount();
                    } else {
                        decrementSelectedItemsCount();
                    }

                    MESSAGE message = (wrapper.item);
                    notifyItemChanged(getMessagePositionById(message.getMsgId()));
                } else {
                    notifyMessageClicked(wrapper.item);
                }
            }
        };
    }

    private void incrementSelectedItemsCount() {
        mSelectedItemCount++;
        notifySelectionChanged();
    }

    private void decrementSelectedItemsCount() {
        mSelectedItemCount--;
        mIsSelectedMode = mSelectedItemCount > 0;
        notifySelectionChanged();
    }

    private void notifyMessageClicked(MESSAGE message) {
        if (mMsgClickListener != null) {
            mMsgClickListener.onMessageClick(message);
        }
    }

    /**
     * Set long click listener for item, fires only if selection mode is disabled.
     *
     * @param listener onMsgLongClickListener
     */
    public void setMsgLongClickListener(OnMsgLongClickListener<MESSAGE> listener) {
        mMsgLongClickListener = listener;
    }

    private View.OnLongClickListener getMessageLongClickListener(final Wrapper<MESSAGE> wrapper) {
        return new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
                if (mSelectionListener == null) {
                    notifyMessageLongClicked(wrapper.item);
                    return true;
                } else {
                    mIsSelectedMode = true;
                    view.callOnClick();
                    return true;
                }
            }
        };
    }

    private void notifyMessageLongClicked(MESSAGE message) {
        if (mMsgLongClickListener != null) {
            mMsgLongClickListener.onMessageLongClick(message);
        }
    }

    public void setOnAvatarClickListener(OnAvatarClickListener<MESSAGE> listener) {
        mAvatarClickListener = listener;
    }

    public void setLayoutManager(LinearLayoutManager layoutManager) {
        mLayoutManager = layoutManager;
    }

    public RecyclerView.LayoutManager getLayoutManager() {
        return mLayoutManager;
    }

    public void setStyle(Context context, MessageListStyle style) {
        mContext = context;
        mStyle = style;
    }

    public void setOnLoadMoreListener(OnLoadMoreListener listener) {
        mListener = listener;
    }

    @Override
    public void onLoadMore(int page, int total) {
        if (null != mListener) {
            mListener.onLoadMore(page, total);
        }
    }

    @Override
    public void onAutoScroll(boolean autoScroll) {
        if (null != mListener) {
            mListener.onAutoScroll(autoScroll);
        }
    }

    public interface DefaultMessageViewHolder {
        void applyStyle(MessageListStyle style);
    }

    public interface OnLoadMoreListener {
        void onLoadMore(int page, int totalCount);

        void onAutoScroll(boolean autoScroll);
    }

    public interface SelectionListener {
        void onSelectionChanged(int count);
    }

    /**
     * Callback will invoked when message item is clicked
     *
     * @param <MESSAGE>
     */
    public interface OnMsgClickListener<MESSAGE extends IMessage> {
        void onMessageClick(MESSAGE message);
    }

    /**
     * Callback will invoked when message item is long clicked
     *
     * @param <MESSAGE>
     */
    public interface OnMsgLongClickListener<MESSAGE extends IMessage> {
        void onMessageLongClick(MESSAGE message);
    }

    public interface OnAvatarClickListener<MESSAGE extends IMessage> {
        void onAvatarClick(View view, MESSAGE message);
    }

    public interface OnLinkClickListener {
        void onLinkClick(View view, String o);
    }

    public void setOnLinkClickListener(OnLinkClickListener onLinkClickListener) {
        this.onLinkClickListener = onLinkClickListener;
    }

    public void setMsgResendListener(OnMsgResendListener<MESSAGE> listener) {
        this.mMsgResendListener = listener;
    }

    public interface OnMsgResendListener<MESSAGE extends IMessage> {
        void onMessageResend(MESSAGE message);
    }

    /**
     * Holders Config
     * Config your custom layouts and view holders into adapter.
     * You need instantiate HoldersConfig, otherwise will use default MessageListStyle.
     */
    public static class HoldersConfig {

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendTxtHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveTxtHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendVoiceHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveVoiceHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendPhotoHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceivePhotoHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendVideoHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveVideoHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mCustomMsgHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mEventMsgHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mTipMsgHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mNotificationMsgHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mRedPacketOpenMsgHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendBankTransferHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveBankTransferHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendAccountNoticeHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveAccountNoticeHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendRedPacketHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveRedPacketHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendCardHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveCardHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendLocationHolder;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveLocationHolder;

        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mSendLinkHoler;
        private Class<? extends BaseMessageViewHolder<? extends IMessage>> mReceiveLinkHolder;

        private int mSendTxtLayout;
        private int mReceiveTxtLayout;

        private int mSendVoiceLayout;
        private int mReceiveVoiceLayout;

        private int mSendPhotoLayout;
        private int mReceivePhotoLayout;

        private int mSendVideoLayout;
        private int mReceiveVideoLayout;

        private int mCustomMsgLayout;

        private int mEventLayout;

        private int mTipLayout;
        private int mNotificationLayout;
        private int mRedPacketOpenLayout;

        private int mSendRedPacketLayout;
        private int mReceiveRedPacketLayout;

        private int mSendCardLayout;
        private int mReceiveCardLayout;

        private int mSendBankTransferLayout;
        private int mReceiveBankTransferLayout;

        private int mSendAccountNoticeLayout;
        private int mReceiveAccountNoticeLayout;

        private int mSendLocationLayout;
        private int mReceiveLocationLayout;

        private int mSendLinkLayout;
        private int mReceiveLinkLayout;

        public HoldersConfig() {
            mSendTxtHolder = DefaultTxtViewHolder.class;
            mReceiveTxtHolder = DefaultTxtViewHolder.class;

            mSendVoiceHolder = DefaultVoiceViewHolder.class;
            mReceiveVoiceHolder = DefaultVoiceViewHolder.class;

            mSendPhotoHolder = DefaultPhotoViewHolder.class;
            mReceivePhotoHolder = DefaultPhotoViewHolder.class;

            mSendVideoHolder = DefaultVideoViewHolder.class;
            mReceiveVideoHolder = DefaultVideoViewHolder.class;

            mSendRedPacketHolder = DefaultRedPacketViewHolder.class;
            mReceiveRedPacketHolder = DefaultRedPacketViewHolder.class;

            mSendCardHolder = DefaultCardViewHolder.class;
            mReceiveCardHolder = DefaultCardViewHolder.class;

            mSendBankTransferHolder = DefaultBankTransferViewHolder.class;
            mReceiveBankTransferHolder = DefaultBankTransferViewHolder.class;

            mSendAccountNoticeHolder = DefaultAccountNoticeViewHolder.class;
            mReceiveAccountNoticeHolder = DefaultAccountNoticeViewHolder.class;

            mSendLocationHolder = DefaultLocationViewHolder.class;
            mReceiveLocationHolder = DefaultLocationViewHolder.class;

            mCustomMsgHolder = DefaultCustonViewHolder.class;

            mSendLinkHoler = DefaultLinkViewHolder.class;
            mReceiveLinkHolder = DefaultLinkViewHolder.class;

            mSendTxtLayout = R.layout.item_send_text;
            mReceiveTxtLayout = R.layout.item_receive_txt;

            mSendVoiceLayout = R.layout.item_send_voice;
            mReceiveVoiceLayout = R.layout.item_receive_voice;

            mSendPhotoLayout = R.layout.item_send_photo;
            mReceivePhotoLayout = R.layout.item_receive_photo;

            mSendVideoLayout = R.layout.item_send_video;
            mReceiveVideoLayout = R.layout.item_receive_video;

            mCustomMsgLayout = R.layout.item_custom_message;

            mSendRedPacketLayout = R.layout.item_send_red_packet;
            mReceiveRedPacketLayout = R.layout.item_receive_red_packet;

            mSendCardLayout = R.layout.item_send_card;
            mReceiveCardLayout = R.layout.item_receive_card;

            mSendBankTransferLayout = R.layout.item_send_bank_transfer;
            mReceiveBankTransferLayout = R.layout.item_receive_bank_transfer;

            mSendAccountNoticeLayout = R.layout.item_send_account_notice;
            mReceiveAccountNoticeLayout = R.layout.item_receive_account_notice;

            mSendLocationLayout = R.layout.item_send_location;
            mReceiveLocationLayout = R.layout.item_receive_location;

            mSendLinkLayout = R.layout.item_send_link;
            mReceiveLinkLayout = R.layout.item_receive_link;

            mSendVideoLayout = R.layout.item_send_video;
            mReceiveVideoLayout = R.layout.item_receive_video;

            mSendVideoLayout = R.layout.item_send_video;
            mReceiveVideoLayout = R.layout.item_receive_video;

            mEventMsgHolder = DefaultEventMsgViewHolder.class;
            mEventLayout = R.layout.item_event_message;

            mTipMsgHolder = DefaultTipMsgViewHolder.class;
            mTipLayout = R.layout.item_tip_message;

            mNotificationMsgHolder = DefaultNotificationMsgViewHolder.class;
            mNotificationLayout = R.layout.item_notification_message;

            mRedPacketOpenMsgHolder = DefaultRedPacketOpenMsgViewHolder.class;
            mRedPacketOpenLayout = R.layout.item_red_packet_open_message;
        }

        /**
         * In place of default send text message style by passing custom view holder and layout.
         *
         * @param holder Custom view holder that extends BaseMessageViewHolder.
         * @param layout Custom send text message layout.
         */
        public void setSenderTxtMsg(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                    @LayoutRes int layout) {
            this.mSendTxtHolder = holder;
            this.mSendTxtLayout = layout;
        }

        /**
         * In place of default receive text message style by passing custom view holder and layout.
         *
         * @param holder Custom view holder that extends BaseMessageViewHolder.
         * @param layout Custom receive text message layout.
         */
        public void setReceiverTxtMsg(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                      @LayoutRes int layout) {
            this.mReceiveTxtHolder = holder;
            this.mReceiveTxtLayout = layout;
        }

        /**
         * Customize send text message layout.
         *
         * @param layout Custom send text message layout.
         */
        public void setSenderLayout(@LayoutRes int layout) {
            this.mSendTxtLayout = layout;
        }

        /**
         * Customize receive text message layout.
         *
         * @param layout Custom receive text message layout.
         */
        public void setReceiverLayout(@LayoutRes int layout) {
            this.mReceiveTxtLayout = layout;
        }

        /**
         * In place of default send voice message style by passing custom view holder and layout.
         *
         * @param holder Custom view holder that extends BaseMessageViewHolder.
         * @param layout Custom send voice message layout.
         */
        public void setSenderVoiceMsg(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                      @LayoutRes int layout) {
            this.mSendVoiceHolder = holder;
            this.mSendVoiceLayout = layout;
        }

        /**
         * Customize send voice message layout.
         *
         * @param layout Custom send voice message layout.
         */
        public void setSendVoiceLayout(@LayoutRes int layout) {
            this.mSendVoiceLayout = layout;
        }

        /**
         * In place of default receive voice message style by passing custom view holder and layout.
         *
         * @param holder Custom view holder that extends BaseMessageViewHolder.
         * @param layout Custom receive voice message layout.
         */
        public void setReceiverVoiceMsg(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                        @LayoutRes int layout) {
            this.mReceiveVoiceHolder = holder;
            this.mReceiveVoiceLayout = layout;
        }

        /**
         * Customize receive voice message layout.
         *
         * @param layout Custom receive voice message layout.
         */
        public void setReceiveVoiceLayout(@LayoutRes int layout) {
            this.mReceiveVoiceLayout = layout;
        }

        /**
         * In place of default send photo message style by passing custom view holder and layout.
         *
         * @param holder Custom view holder that extends BaseMessageViewHolder.
         * @param layout Custom send photo message layout
         */
        public void setSendPhotoMsg(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                    @LayoutRes int layout) {
            this.mSendPhotoHolder = holder;
            this.mSendPhotoLayout = layout;
        }

        /**
         * Customize send voice message layout.
         *
         * @param layout Custom send photo message layout.
         */
        public void setSendPhotoLayout(@LayoutRes int layout) {
            this.mSendPhotoLayout = layout;
        }

        /**
         * In place of default receive photo message style by passing custom view holder and layout.
         *
         * @param holder Custom view holder that extends BaseMessageViewHolder.
         * @param layout Custom receive photo message layout
         */
        public void setReceivePhotoMsg(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                       @LayoutRes int layout) {
            this.mReceivePhotoHolder = holder;
            this.mReceivePhotoLayout = layout;
        }

        /**
         * Customize receive voice message layout.
         *
         * @param layout Custom receive photo message layout.
         */
        public void setReceivePhotoLayout(@LayoutRes int layout) {
            this.mReceivePhotoLayout = layout;
        }

        /**
         * In place of default send video message style by passing custom view holder and layout.
         *
         * @param holder Custom view holder that extends BaseMessageViewHolder.
         * @param layout custom send video message layout
         */
        public void setSendVideoMsg(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                    @LayoutRes int layout) {
            this.mSendVideoHolder = holder;
            this.mSendVideoLayout = layout;
        }

        /**
         * Customize send voice message layout.
         *
         * @param layout Custom send Video message layout.
         */
        public void setSendVideoLayout(@LayoutRes int layout) {
            this.mSendVideoLayout = layout;
        }

        /**
         * In place of default receive video message style by passing custom view holder and layout.
         *
         * @param holder Custom view holder that extends BaseMessageViewHolder.
         * @param layout Custom receive video message layout
         */
        public void setReceiveVideoMsg(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                       @LayoutRes int layout) {
            this.mReceiveVideoHolder = holder;
            this.mReceiveVideoLayout = layout;
        }

        /**
         * Customize receive video message layout.
         *
         * @param layout Custom receive video message layout.
         */
        public void setReceiveVideoLayout(@LayoutRes int layout) {
            this.mReceiveVideoLayout = layout;
        }

        public void setEventMessage(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                    @LayoutRes int layout) {
            this.mEventMsgHolder = holder;
            this.mEventLayout = layout;
        }

        public void setTipMessage(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                  @LayoutRes int layout) {
            this.mTipMsgHolder = holder;
            this.mTipLayout = layout;
        }

        public void setNotificationMessage(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                           @LayoutRes int layout) {
            this.mNotificationMsgHolder = holder;
            this.mNotificationLayout = layout;
        }

        public void setRedPacketOpenMessage(Class<? extends BaseMessageViewHolder<? extends IMessage>> holder,
                                            @LayoutRes int layout) {
            this.mRedPacketOpenMsgHolder = holder;
            this.mRedPacketOpenLayout = layout;
        }
    }

    private static class DefaultTxtViewHolder extends TxtViewHolder<IMessage> {

        public DefaultTxtViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);

        }
    }

    private static class DefaultVoiceViewHolder extends VoiceViewHolder<IMessage> {

        public DefaultVoiceViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultPhotoViewHolder extends PhotoViewHolder<IMessage> {

        public DefaultPhotoViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultVideoViewHolder extends VideoViewHolder<IMessage> {

        public DefaultVideoViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultEventMsgViewHolder extends EventViewHolder<IMessage> {
        public DefaultEventMsgViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultCustonViewHolder extends CustonViewHolder<IMessage> {

        public DefaultCustonViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultLinkViewHolder extends LinkViewHolder<IMessage> {

        public DefaultLinkViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultTipMsgViewHolder extends TipViewHoler<IMessage> {
        public DefaultTipMsgViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultNotificationMsgViewHolder extends NotificationViewHolder<IMessage> {
        public DefaultNotificationMsgViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultRedPacketOpenMsgViewHolder extends RedPacketOpenViewHolder<IMessage> {
        public DefaultRedPacketOpenMsgViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultBankTransferViewHolder extends BankTransferViewHolder<IMessage> {

        public DefaultBankTransferViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultAccountNoticeViewHolder extends AccountNoticeViewHolder<IMessage> {

        public DefaultAccountNoticeViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultCardViewHolder extends CardViewHolder<IMessage>{

        public DefaultCardViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }
    private static class DefaultRedPacketViewHolder extends RedPacketViewHolder<IMessage> {

        public DefaultRedPacketViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    private static class DefaultLocationViewHolder extends LocationViewHolder<IMessage> {

        public DefaultLocationViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
            super(adapter, itemView, isSender);
        }
    }

    @Override
    public void onViewDetachedFromWindow(ViewHolder holder) {
        super.onViewDetachedFromWindow(holder);
        ViewHolderController.getInstance().remove(holder.getAdapterPosition());
    }

    @Override
    public void onDetachedFromRecyclerView(RecyclerView recyclerView) {
        super.onDetachedFromRecyclerView(recyclerView);
        ViewHolderController.getInstance().release();
    }

    public void releasePlayVoice() {
        if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
            mMediaPlayer.pause();
        }
    }

    public void stopPlayVoice() {
        Log.w(getClass().getName(), "stopPlayVoice");
        if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
            mMediaPlayer.stop();
        }

    }
}
