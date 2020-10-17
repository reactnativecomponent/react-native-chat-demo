package cn.jiguang.imui.messages.viewholder;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.Locale;
import java.util.concurrent.TimeUnit;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.commons.models.IMediaFile;
import cn.jiguang.imui.commons.models.IMessage;
import cn.jiguang.imui.messagelist.R;
import cn.jiguang.imui.messages.MessageListStyle;


public class VideoViewHolder<MESSAGE extends IMessage> extends AvatarViewHolder<MESSAGE> {

    private final ImageView mImageCover;
    private final ImageView mImagePlay;
    private final TextView mTvDuration;

    public VideoViewHolder(RecyclerView.Adapter adapter, View itemView, boolean isSender) {
        super(adapter, itemView, isSender);
        mImageCover = (ImageView) itemView.findViewById(R.id.aurora_iv_msgitem_cover);
        mImagePlay = (ImageView) itemView.findViewById(R.id.aurora_iv_msgitem_play);
        mTvDuration = (TextView) itemView.findViewById(R.id.aurora_tv_duration);
    }

    @Override
    public void onBind(final MESSAGE message) {
        super.onBind(message);

        IMediaFile ext = getExtend(message);
        if (ext == null) {
            return;
        }
        mImageLoader.loadImage(mImageCover, ext.getThumbPath());
        mImageCover.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mMsgClickListener.onMessageClick(message);
            }
        });
        mImageCover.setOnLongClickListener(new View.OnLongClickListener() {

            @Override
            public boolean onLongClick(View view) {
                mMsgLongClickListener.onMessageLongClick(message);
                return false;
            }
        });

        String durationStr = String.format(Locale.CHINA, "%02d:%02d",
                TimeUnit.MILLISECONDS.toMinutes(ext.getDuration()),
                TimeUnit.MILLISECONDS.toSeconds(ext.getDuration()));
        mTvDuration.setText(durationStr);
    }

    @Override
    public void applyStyle(MessageListStyle style) {
        super.applyStyle(style);
    }
}