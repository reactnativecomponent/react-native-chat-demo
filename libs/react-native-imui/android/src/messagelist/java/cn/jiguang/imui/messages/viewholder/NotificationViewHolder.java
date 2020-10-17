package cn.jiguang.imui.messages.viewholder;

import android.graphics.Color;
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

public class NotificationViewHolder<MESSAGE extends IMessage>
        extends BaseMessageViewHolder<MESSAGE>
        implements MsgListAdapter.DefaultMessageViewHolder {
    private TextView mEvent;

    public NotificationViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView);
        mEvent = (TextView) itemView.findViewById(R.id.aurora_tv_msgitem_event);
    }

    @Override
    public void onBind(MESSAGE message) {
        mEvent.setText(message.getText());
    }

    @Override
    public void applyStyle(MessageListStyle style) {

        mEvent.setTextColor(Color.WHITE);
        mEvent.setTextSize(12);
        mEvent.setPadding(style.getEventPadding(), style.getEventPadding(), style.getEventPadding(), style.getEventPadding());
    }
}
