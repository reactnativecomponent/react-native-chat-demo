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

public class CustonViewHolder<MESSAGE extends IMessage>
        extends BaseMessageViewHolder<MESSAGE>
        implements MsgListAdapter.DefaultMessageViewHolder {

    private TextView mTextView;

    public CustonViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView);
        mTextView = (TextView) itemView.findViewById(R.id.aurora_tv_msgitem_event);
        mTextView.setMovementMethod(LinkMovementMethod.getInstance());
        String start = "收到当前版本不支持的消息，请";
        String end = "更新版本";

        SpannableString spann = new SpannableString(start + end + "查看");
        spann.setSpan(new ClickAble(), start.length() - 1, start.length() + end.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        mTextView.setText(spann);
    }

    @Override
    public void onBind(MESSAGE message) {



    }

    @Override
    public void applyStyle(MessageListStyle style) {

        mTextView.setTextColor(Color.WHITE);
        mTextView.setTextSize(12);
    }

    class ClickAble extends ClickableSpan implements View.OnClickListener {

        @Override
        public void onClick(View widget) {
            if (onLinkClickListener != null) {
//                onLinkClickListener.onLinkClick(widget, "");
            }
        }

        @Override
        public void updateDrawState(TextPaint ds) {
            ds.setColor(Color.rgb(35,141,250));
            ds.setUnderlineText(true);
        }
    }
}