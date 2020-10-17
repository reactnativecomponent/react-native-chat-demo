package cn.jiguang.imui.chatinput.emoji;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import java.util.ArrayList;
import java.util.List;

import androidx.recyclerview.widget.RecyclerView;
import cn.jiguang.imui.chatinput.model.FileItem;
import cn.jiguang.imui.messagelist.R;

public class EmojiAdapter extends RecyclerView.Adapter<EmojiAdapter.PhotoViewHolder> {

    private Context mContext;

    private List<FileItem> mMedias = new ArrayList<>();


    public EmojiAdapter(List<FileItem> list) {
        if (list != null) {
            mMedias = list;
        }
    }

    @Override
    public PhotoViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        mContext = parent.getContext();
        View layout = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_photo_select, parent, false);
        return new PhotoViewHolder(layout);
    }

    @Override
    public void onBindViewHolder(final PhotoViewHolder holder, int position) {
        if (holder.container.getHeight() != holder.container.getWidth()) {
//            FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
//                    FrameLayout.LayoutParams.WRAP_CONTENT, holder.container.getWidth());
//            holder.container.setLayoutParams(layoutParams);
        }

        FileItem item = mMedias.get(position);
//        Glide.with(mContext)
//                .load(item.getFilePath())
//                .placeholder(R.drawable.aurora_picture_not_found)
//                .into(holder.ivPhoto);
    }

    @Override
    public int getItemCount() {
        return mMedias.size();
    }

    @Override
    public int getItemViewType(int position) {
        return mMedias.get(position).getType().getCode();
    }

    private void addDeselectedAnimation(View... views) {
        List<Animator> valueAnimators = new ArrayList<>();
        for (View v : views) {
            ObjectAnimator scaleX = ObjectAnimator.ofFloat(v, "scaleX", 1.0f);
            ObjectAnimator scaleY = ObjectAnimator.ofFloat(v, "scaleY", 1.0f);

            valueAnimators.add(scaleX);
            valueAnimators.add(scaleY);
        }

        AnimatorSet set = new AnimatorSet();
        set.playTogether(valueAnimators);
        set.setDuration(150);
        set.start();
    }

    private void addSelectedAnimation(View... views) {
        List<Animator> valueAnimators = new ArrayList<>();
        for (View v : views) {
            ObjectAnimator scaleX = ObjectAnimator.ofFloat(v, "scaleX", 0.90f);
            ObjectAnimator scaleY = ObjectAnimator.ofFloat(v, "scaleY", 0.90f);

            valueAnimators.add(scaleX);
            valueAnimators.add(scaleY);
        }

        AnimatorSet set = new AnimatorSet();
        set.playTogether(valueAnimators);
        set.setDuration(150);
        set.start();
    }

    static final class PhotoViewHolder extends RecyclerView.ViewHolder {
        View container;
        ImageView ivPhoto;

        PhotoViewHolder(View itemView) {
            super(itemView);
            container = itemView;
            ivPhoto = (ImageView) itemView.findViewById(R.id.image_photoselect_photo);
        }
    }
}
