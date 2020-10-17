package cn.jiguang.imui.messages.viewholder;

import android.graphics.Color;
import android.graphics.drawable.AnimationDrawable;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.IOException;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.IMediaFile;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.BuildConfig;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;
import cn.jiguang.imui.messages.ViewHolderController;
import cn.jiguang.imui.utils.DisplayUtil;
import cn.jiguang.imui.utils.SessorUtil;
import cn.jiguang.imui.utils.TimeUtil;

public class VoiceViewHolder<MESSAGE extends IMessage> extends AvatarViewHolder<MESSAGE> {

    private TextView mMsgTv;
    private ImageView mVoiceIv;
    private TextView mLengthTv;
    private ImageView mUnreadStatusIv;
    private boolean mSetData = false;
    private AnimationDrawable mVoiceAnimation;
    private FileInputStream mFIS;
    private FileDescriptor mFD;
    private int mSendDrawable;
    private int mReceiveDrawable;
    private int mPlaySendAnim;
    private int mPlayReceiveAnim;
    private ViewHolderController mController;

    public VoiceViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView, isSender);
        mMsgTv = (TextView) itemView.findViewById(R.id.aurora_tv_msgitem_message);
        mVoiceIv = (ImageView) itemView.findViewById(R.id.aurora_iv_msgitem_voice_anim);
        mLengthTv = (TextView) itemView.findViewById(R.id.aurora_tv_voice_length);
        if (!isSender) {
            mUnreadStatusIv = (ImageView) itemView.findViewById(R.id.aurora_iv_msgitem_read_status);
        } else {
        }
        mController = ViewHolderController.getInstance();
    }

    @Override
    public void onBind(final MESSAGE message) {
        super.onBind(message);

        if (!mIsSender) {
            if (message.getMessageStatus() == IMessage.MessageStatus.RECEIVE_READ) {
                mUnreadStatusIv.setVisibility(View.INVISIBLE);
            } else {
                mUnreadStatusIv.setVisibility(View.VISIBLE);
            }
        }
        final IMediaFile extend = getExtend(message);
        if (extend == null) {
            return;
        }

        mMediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener() {

            @Override
            public boolean onError(MediaPlayer mp, int what, int extra) {
                return false;
            }
        });
        long duration = TimeUtil.getSecondsByMilliseconds(extend.getDuration());
        duration = duration < 0 ? 0 : duration;
        duration = duration > 60 ? 60 : duration;
        String lengthStr = duration + mContext.getString(R.string.aurora_symbol_second);
        int width = (int) (-0.04 * duration * duration + 4.526 * duration + 75.214);
        mMsgTv.setWidth((int) (width * mDensity));
        mLengthTv.setText(lengthStr);


        mMsgTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!mIsSender && message.getMessageStatus() != IMessage.MessageStatus.RECEIVE_READ) {
                    mUnreadStatusIv.setVisibility(View.INVISIBLE);
                    message.setMessageStatus(IMessage.MessageStatus.RECEIVE_READ);
                    if (mMsgClickListener != null) {
                        mMsgClickListener.onMessageClick(message);
                    }
                }
                // stop animation whatever this time is play or pause audio
//                if (mVoiceAnimation != null) {
//                    mVoiceAnimation.stop();
//                    mVoiceAnimation = null;
//                }
                if (mIsSender) {
                    mController.notifyAnimStop(mSendDrawable);
                    mVoiceIv.setImageResource(mPlaySendAnim);
                } else {
                    mController.notifyAnimStop(mReceiveDrawable);
                    mVoiceIv.setImageResource(mPlayReceiveAnim);
                }
                mVoiceAnimation = (AnimationDrawable) mVoiceIv.getDrawable();
                mController.addView(getAdapterPosition(), mVoiceIv);
                // If audio is playing, pause
//                Log.e("VoiceViewHolder", "MediaPlayer playing " + mMediaPlayer.isPlaying() + "now position " + getAdapterPosition());
                if (mController.getLastPlayPosition() == getAdapterPosition()) {
                    if (mMediaPlayer.isPlaying()) {
                        pauseVoice();
                        mVoiceAnimation.stop();
                        if (mIsSender) {
                            mVoiceIv.setImageResource(mSendDrawable);
                        } else {
                            mVoiceIv.setImageResource(mReceiveDrawable);
                        }
                    } else if (mSetData) {
                        mMediaPlayer.start();
                        mVoiceAnimation.start();
                    } else {
                        playVoice(getAdapterPosition(), extend);
                    }
                    // Start playing audio
                } else {
                    playVoice(getAdapterPosition(), extend);
                }
            }
        });

        mMsgTv.setOnLongClickListener(new View.OnLongClickListener() {
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

    private void playVoice(int position, IMediaFile extend) {
        mController.setLastPlayPosition(position);
        try {
            if (SessorUtil.getInstance(mContext).isEarPhoneOn()) {
                mMediaPlayer.setAudioStreamType(AudioManager.STREAM_VOICE_CALL);
            } else {
                mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            }
            mMediaPlayer.reset();
            mFIS = new FileInputStream(extend.getPath());
            mFD = mFIS.getFD();
            mMediaPlayer.setDataSource(mFD);
            mMediaPlayer.prepare();
            mMediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    mVoiceAnimation.start();
                    mp.start();
                }
            });
            mMediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mp) {
                    mVoiceAnimation.stop();
                    mp.reset();
                    mSetData = false;
                    if (mIsSender) {
                        mVoiceIv.setImageResource(mSendDrawable);
                    } else {
                        mVoiceIv.setImageResource(mReceiveDrawable);
                    }
                }
            });
        } catch (Exception e) {
            Toast.makeText(mContext, mContext.getString(R.string.aurora_file_not_found_toast),
                    Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        } finally {
            try {
                if (mFIS != null) {
                    mFIS.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void pauseVoice() {
        mMediaPlayer.pause();
        mSetData = true;
    }


    @Override
    public void applyStyle(MessageListStyle style) {
        super.applyStyle(style);
        mSendDrawable = style.getSendVoiceDrawable();
        mReceiveDrawable = style.getReceiveVoiceDrawable();
        mPlaySendAnim = style.getPlaySendVoiceAnim();
        mPlayReceiveAnim = style.getPlayReceiveVoiceAnim();
        final int padding = 8;
        if (mIsSender) {
            mVoiceIv.setImageResource(mSendDrawable);
            mMsgTv.setBackground(style.getSendBubbleDrawable());
            mMsgTv.setPadding(0,DisplayUtil.dp2px(style.mContext,padding),DisplayUtil.dp2px(style.mContext,3),DisplayUtil.dp2px(style.mContext,padding));
            if (style.getSendingProgressDrawable() != null) {
                mSendingPb.setProgressDrawable(style.getSendingProgressDrawable());
            }
            if (style.getSendingIndeterminateDrawable() != null) {
                mSendingPb.setIndeterminateDrawable(style.getSendingIndeterminateDrawable());
            }
        } else {
            mVoiceIv.setImageResource(mReceiveDrawable);
            mMsgTv.setBackground(style.getReceiveBubbleDrawable());
            mMsgTv.setPadding(DisplayUtil.dp2px(style.mContext,3),DisplayUtil.dp2px(style.mContext,padding),0,DisplayUtil.dp2px(style.mContext,padding));
        }
        mLengthTv.setTextColor(Color.rgb(157, 157, 158));
    }


}