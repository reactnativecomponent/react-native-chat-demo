package cn.jiguang.imui.messages.viewholder;

import android.graphics.Color;
import android.text.style.ImageSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.BuildConfig;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.ClickLinkMovementMethod;
import cn.jiguang.imui.messages.MessageListStyle;
import dowin.com.emoji.emoji.LinkClick;
import dowin.com.emoji.emoji.MoonUtil;

public class TxtViewHolder<MESSAGE extends IMessage> extends AvatarViewHolder<MESSAGE> {

    protected TextView mMsgTv;


    public TxtViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView, isSender);
        mMsgTv = (TextView) itemView.findViewById(R.id.aurora_tv_msgitem_message);
    }


    @Override
    public void onBind(final MESSAGE message) {
        super.onBind(message);
//        mMsgTv.setText(message.getText());
        String mText = message.getText();

        MoonUtil.identifyFaceExpression(mMsgTv.getContext(), mMsgTv, mText, ImageSpan.ALIGN_BOTTOM, new LinkClick.OnLinkClickListener() {

            @Override
            public void onClick(View widget, String url) {
                if (onLinkClickListener != null) {
                    onLinkClickListener.onLinkClick(widget, url);
                }
            }
        });
        if (mText.length() <= 3) {
            mMsgTv.setGravity(Gravity.CENTER);
        } else {
            mMsgTv.setGravity(Gravity.CENTER_VERTICAL | Gravity.LEFT);
        }
        mMsgTv.setMovementMethod(ClickLinkMovementMethod.getInstance());

//        mMsgTv.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                if (mMsgClickListener != null) {
//                    mMsgClickListener.onMessageClick(message);
//                }
//            }
//        });

        mMsgTv.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
//                Log.w("MoonUtil", mMsgTv.getMovementMethod().getClass().getName());
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

    @Override
    public void applyStyle(MessageListStyle style) {
        super.applyStyle(style);
        mMsgTv.setMaxWidth((int) (style.getWindowWidth() * style.getBubbleMaxWidth()));
        mMsgTv.setTextSize(18);
        mMsgTv.setTextIsSelectable(false);
        mMsgTv.setClickable(false);
        mMsgTv.setTextColor(mIsSender ? Color.WHITE : Color.BLACK);
        mMsgTv.setLinkTextColor(mIsSender ? Color.parseColor("#bbdcff") : Color.parseColor("#238dfa"));

    }

    public TextView getMsgTextView() {
        return mMsgTv;
    }

}