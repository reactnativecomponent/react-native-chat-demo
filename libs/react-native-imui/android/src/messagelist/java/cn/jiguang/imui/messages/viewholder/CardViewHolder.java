package cn.jiguang.imui.messages.viewholder;

import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.ICard;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.BuildConfig;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;

/**
 * Created by dowin on 2017/10/23.
 */

public class CardViewHolder<MESSAGE extends IMessage> extends AvatarViewHolder<MESSAGE> {

    private ImageView image;
    private TextView name;
    private TextView cardType;
    private TextView sessionId;
    private View layoutTop;

    public CardViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView, isSender);

        image = (ImageView) itemView.findViewById(R.id.card_icon);
        name = (TextView) itemView.findViewById(R.id.card_name);
        cardType = (TextView) itemView.findViewById(R.id.card_type);
        sessionId = (TextView) itemView.findViewById(R.id.card_id);
        layoutTop = itemView.findViewById(R.id.layout_top);
    }

    @Override
    public void onBind(final MESSAGE message) {
        super.onBind(message);
        ICard card = getExtend(message);
        if (card != null) {
            if(!TextUtils.isEmpty(card.getImgPath())) {
                mImageLoader.loadAvatarImage(image, card.getImgPath());
            }
            name.setText(card.getName());
            cardType.setText(card.getCardType());
//            sessionId.setText(card.getSessionId());
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

    @Override
    public void applyStyle(MessageListStyle style) {
        super.applyStyle(style);
    }
}
