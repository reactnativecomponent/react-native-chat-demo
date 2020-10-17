package cn.jiguang.imui.messages.viewholder;

import android.content.Context;
import android.media.MediaPlayer;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.ImageLoader;
import cn.jiguang.imui.commons.ViewHolder;
import cn.jiguang.imui.commons.models.IExtend;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messages.MsgListAdapter;

public abstract class BaseMessageViewHolder<MESSAGE extends IMessage>
        extends ViewHolder<MESSAGE> {

    public Context mContext;

    public float mDensity;
    public int mPosition;
    public boolean mIsSelected;
    public ImageLoader mImageLoader;

    public MsgListAdapter.OnMsgLongClickListener<MESSAGE> mMsgLongClickListener;
    public MsgListAdapter.OnMsgClickListener<MESSAGE> mMsgClickListener;
    public MsgListAdapter.OnAvatarClickListener<MESSAGE> mAvatarClickListener;
    public MsgListAdapter.OnMsgResendListener<MESSAGE> mMsgResendListener;
    public MsgListAdapter.OnLinkClickListener onLinkClickListener;
    public MediaPlayer mMediaPlayer;

    public RecyclerView.Adapter adapter;

    public BaseMessageViewHolder(RecyclerView.Adapter adapter, View itemView) {
        super(itemView);
        this.adapter = adapter;
    }

    public MsgListAdapter getAdapter() {
        return (MsgListAdapter) adapter;
    }

    public boolean isSelected() {
        return mIsSelected;
    }

    <T extends IExtend> T getExtend(MESSAGE message) {
        try {
            return (T) message.getExtend();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ImageLoader getImageLoader() {
        return mImageLoader;
    }
}