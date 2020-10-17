package cn.jiguang.imui.messages.viewholder;

import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import java.text.DecimalFormat;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.IBankTransfer;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.BuildConfig;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;

/**
 * Created by dowin on 2017/8/9.
 */

public class BankTransferViewHolder<MESSAGE extends IMessage> extends AvatarViewHolder<MESSAGE> {

    private TextView value;
    private TextView comments;
    private View layoutTop;

    public BankTransferViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView, isSender);
        value = (TextView) itemView.findViewById(R.id.bank_transfer_value);
        comments = (TextView) itemView.findViewById(R.id.bank_transfer_comments);
        layoutTop = itemView.findViewById(R.id.layout_top);
    }

    @Override
    public void onBind(final MESSAGE message) {
        super.onBind(message);
        IBankTransfer extend = getExtend(message);
        if (extend != null) {
            value.setText(formatAmount(extend.getAmount()));
            if (TextUtils.isEmpty(extend.getComments())) {
                comments.setText("飞马转账");
            } else {
                comments.setText(extend.getComments());
            }
        }
        layoutTop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mMsgClickListener != null) {
                    mMsgClickListener.onMessageClick(message);
                }
            }
        });
        layoutTop.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
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

    final DecimalFormat format = new DecimalFormat("#.00");

    String formatAmount(String amount) {

        try {
            return format.format(Integer.valueOf(amount)) + "元";
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return amount + "元";
        }
    }

    @Override
    public void applyStyle(MessageListStyle style) {
        super.applyStyle(style);
//        layout.getLayoutParams().width = (int) (style.getWindowWidth() * 0.65);
        layoutTop.setBackground(style.getRedPacketTopDrawable());
    }
}