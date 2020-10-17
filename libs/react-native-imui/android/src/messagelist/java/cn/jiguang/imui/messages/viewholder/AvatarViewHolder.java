package cn.jiguang.imui.messages.viewholder;

import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.BuildConfig;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;
import cn.jiguang.imui.messages.MsgListAdapter;

/**
 * Created by dowin on 2017/8/10.
 */

public class AvatarViewHolder<MESSAGE extends IMessage>
        extends BaseMessageViewHolder<MESSAGE>
        implements MsgListAdapter.DefaultMessageViewHolder {

    protected TextView mDateTv;
    protected TextView mDisplayNameTv;
    protected ImageView mAvatarIv;
    protected ImageButton mResendIb;
    protected ProgressBar mSendingPb;
    protected boolean mIsSender;

    protected View layout;

    public AvatarViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView);
        this.mIsSender = isSender;
        mDateTv = (TextView) itemView.findViewById(R.id.aurora_tv_msgitem_date);
        mAvatarIv = (ImageView) itemView.findViewById(R.id.aurora_iv_msgitem_avatar);
        mDisplayNameTv = (TextView) itemView.findViewById(R.id.aurora_tv_msgitem_display_name);
        mResendIb = (ImageButton) itemView.findViewById(R.id.aurora_ib_msgitem_resend);
        mSendingPb = (ProgressBar) itemView.findViewById(R.id.aurora_pb_msgitem_sending);

        layout = itemView.findViewById(R.id.item_layout);

    }


    @Override
    public void onBind(final MESSAGE message) {


        if (getAdapter().needShowTime(message)) {
            mDateTv.setText(message.getTimeString());
            mDateTv.setVisibility(View.VISIBLE);
        } else {
            mDateTv.setVisibility(View.GONE);
        }
        boolean isAvatarExists = message.getFromUser().getAvatarFilePath() != null
                && !message.getFromUser().getAvatarFilePath().isEmpty();
        if (isAvatarExists && mImageLoader != null) {
            mImageLoader.loadAvatarImage(mAvatarIv, message.getFromUser().getAvatarFilePath());
        } else if (mImageLoader == null) {
            mAvatarIv.setVisibility(View.GONE);
        }
        if (!mIsSender) {
            if (mDisplayNameTv.getVisibility() == View.VISIBLE) {
                mDisplayNameTv.setMaxEms(8);
                mDisplayNameTv.setText(message.getFromUser().getDisplayName());
            }
        } else {
            switch (message.getMessageStatus()) {
                case SEND_SENDING:
                    mSendingPb.setVisibility(View.VISIBLE);
                    mResendIb.setVisibility(View.INVISIBLE);
                    Log.i("TxtViewHolder", "sending message");
                    break;
                case SEND_FAILE:
                    mSendingPb.setVisibility(View.GONE);
                    Log.i("TxtViewHolder", "send message failed");
                    mResendIb.setVisibility(View.VISIBLE);
                    mResendIb.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            if (mMsgResendListener != null) {
                                mMsgResendListener.onMessageResend(message);
                            }
                        }
                    });
                    break;
                case SEND_SUCCEED:
                case RECEIVE_READ:
                case RECEIVE_UNREAD:
                    mSendingPb.setVisibility(View.GONE);
                    mResendIb.setVisibility(View.INVISIBLE);
                    Log.i("TxtViewHolder", "send message succeed");
                    break;
                default:
                    mSendingPb.setVisibility(View.GONE);
                    mResendIb.setVisibility(View.INVISIBLE);
                    break;
            }
        }

        mAvatarIv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (mAvatarClickListener != null) {
                    mAvatarClickListener.onAvatarClick(view, message);
                }
            }
        });

        if (layout != null) {
            layout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if (mMsgClickListener != null) {
                        mMsgClickListener.onMessageClick(message);
                    }
                }
            });

            layout.setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                public boolean onLongClick(View view) {
                    if (mMsgLongClickListener != null) {
                        mMsgLongClickListener.onMessageLongClick(message);
                    } else {
                        if (BuildConfig.DEBUG) {
                            Log.w("MsgListAdapter", "Didn't set long click listener! Drop event.");
                        }
                    }
                    return true;
                }
            });
        }
    }

    @Override
    public void applyStyle(MessageListStyle style) {
        if (layout != null && mAvatarIv.getVisibility() == View.VISIBLE) {
            layout.getLayoutParams().width = (int) (style.getWindowWidth() * style.getBubbleMaxWidth());
        }
        if(mDateTv!=null){
            mDateTv.setTextColor(Color.WHITE);
            mDateTv.setTextSize(12);
        }
        if (!mIsSender) {
            if (mDisplayNameTv.getVisibility() == View.VISIBLE) {
                mDisplayNameTv.setMaxEms(8);
                mDisplayNameTv.setTextColor(Color.rgb(157,157,158));
            }
        }
    }

    public ImageView getAvatar() {
        return mAvatarIv;
    }
}