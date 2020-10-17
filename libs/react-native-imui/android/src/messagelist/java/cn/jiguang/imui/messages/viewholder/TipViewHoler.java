package cn.jiguang.imui.messages.viewholder;

import android.graphics.Color;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.View;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;
import cn.jiguang.imui.messages.MsgListAdapter;

/**
 * Created by dowin on 2017/8/9.
 */

public class TipViewHoler<MESSAGE extends IMessage>
        extends BaseMessageViewHolder<MESSAGE>
        implements MsgListAdapter.DefaultMessageViewHolder {

    private TextView mEvent;
    final static String SEND_FRIEND = "发送朋友验证";

    public TipViewHoler(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView);
        mEvent = (TextView) itemView.findViewById(R.id.aurora_tv_msgitem_event);
        mEvent.setMovementMethod(LinkMovementMethod.getInstance());
    }

    @Override
    public void onBind(MESSAGE message) {
        final String mText = message.getText();

        final int fIndex = mText.lastIndexOf(SEND_FRIEND);
        if (fIndex != -1) {
            SpannableString spann = new SpannableString(message.getText());
            spann.setSpan(new TipViewHoler.ClickAble(message), fIndex, fIndex + SEND_FRIEND.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            mEvent.setText(spann);
        }else {

            mEvent.setText(mText);
        }

    }

    @Override
    public void applyStyle(MessageListStyle style) {

        mEvent.setTextColor(Color.WHITE);
        mEvent.setTextSize(12);
        mEvent.setPadding(style.getEventPadding(), style.getEventPadding(), style.getEventPadding(), style.getEventPadding());
    }

    class ClickAble extends ClickableSpan implements View.OnClickListener {
        MESSAGE message;

        public ClickAble(MESSAGE message) {
            this.message = message;
        }

        @Override
        public void onClick(View widget) {
            if (mMsgClickListener != null) {
                mMsgClickListener.onMessageClick(message);
            }
        }

        @Override
        public void updateDrawState(TextPaint ds) {
            ds.setColor(Color.parseColor("#0000ff"));
            ds.setUnderlineText(false);
        }
    }
}

