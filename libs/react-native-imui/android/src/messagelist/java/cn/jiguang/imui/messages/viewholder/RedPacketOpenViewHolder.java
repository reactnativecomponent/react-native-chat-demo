package cn.jiguang.imui.messages.viewholder;

import android.graphics.Color;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.View;
import android.widget.TextView;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.commons.models.IRedPacketOpen;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;
import cn.jiguang.imui.messages.MsgListAdapter;

/**
 * Created by dowin on 2017/8/9.
 */

public class RedPacketOpenViewHolder<MESSAGE extends IMessage>
        extends BaseMessageViewHolder<MESSAGE>
        implements MsgListAdapter.DefaultMessageViewHolder {

    private TextView mTextView;
    final static Pattern pattern = Pattern.compile("红包{1}");

    public RedPacketOpenViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView);
        mTextView = (TextView) itemView.findViewById(R.id.aurora_tv_msgitem_event);
        mTextView.setMovementMethod(LinkMovementMethod.getInstance());
    }

    @Override
    public void onBind(MESSAGE message) {


        IRedPacketOpen extend = getExtend(message);
        if (extend != null) {
            String mText = extend.getTipMsg();
            Matcher m = pattern.matcher(mText);
            SpannableString spann = new SpannableString(mText);
//            if (imageSpan == null) {
//                Bitmap b = BitmapFactory.decodeResource(mContext.getResources(), R.drawable.icon_packet);
//                imageSpan = new ImageSpan(mContext, b);
//            }
//        spann.setSpan(imageSpan, 0, 4, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            while (m.find()) {
                int start = m.start();
                int end = m.end();
                spann.setSpan(new ClickAble(message), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

            }
            mTextView.setText(spann);
        }
    }

    @Override
    public void applyStyle(MessageListStyle style) {

        mTextView.setTextColor(Color.WHITE);
        mTextView.setTextSize(12);
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
            ds.setColor(Color.parseColor("#ff0000"));
            ds.setUnderlineText(true);
        }
    }
}

