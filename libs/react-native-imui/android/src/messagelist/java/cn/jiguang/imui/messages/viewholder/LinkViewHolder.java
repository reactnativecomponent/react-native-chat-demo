package cn.jiguang.imui.messages.viewholder;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.ILink;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;

/**
 * Created by dowin on 2017/8/14.
 */

public class LinkViewHolder<MESSAGE extends IMessage> extends AvatarViewHolder<MESSAGE> {

    private TextView title;
    private TextView content;
    private ImageView image;

    public LinkViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView, isSender);

        title = (TextView) itemView.findViewById(R.id.link_title);
        content = (TextView) itemView.findViewById(R.id.link_content);
    }

    @Override
    public void onBind(MESSAGE message) {
        super.onBind(message);

        ILink extend = getExtend(message);
        if (extend != null) {
            title.setText(extend.getTitle());
            content.setText(extend.getDescribe());
            mImageLoader.loadImage(image, extend.getImage());
        }
    }

    @Override
    public void applyStyle(MessageListStyle style) {
        super.applyStyle(style);
        layout.setBackground(style.getLinkDrawable());
    }
}
