package cn.jiguang.imui.messages.viewholder;

import android.view.View;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.IAccountNotice;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;

/**
 * Created by dowin on 2017/8/9.
 */

public class AccountNoticeViewHolder<MESSAGE extends IMessage> extends AvatarViewHolder<MESSAGE> {

    private TextView value;
    private TextView comments;


    public AccountNoticeViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView, isSender);
        value = (TextView) itemView.findViewById(R.id.bank_transfer_value);
        comments = (TextView) itemView.findViewById(R.id.bank_transfer_comments);

    }

    @Override
    public void onBind(final MESSAGE message) {
        super.onBind(message);
        IAccountNotice accountNotice = getExtend(message);
        if (accountNotice != null) {
            value.setText(accountNotice.getAmount());
        }

    }

    @Override
    public void applyStyle(MessageListStyle style) {
        super.applyStyle(style);
    }
}