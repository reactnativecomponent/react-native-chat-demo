package com.dowin.imageviewer;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;
import java.util.List;

import androidx.viewpager.widget.PagerAdapter;
import cn.jiguang.imui.messagelist.R;
import me.relex.photodraweeview.OnPhotoTapListener;
import me.relex.photodraweeview.OnViewTapListener;
import me.relex.photodraweeview.PhotoDraweeView;

/**
 * Created by dowin on 2016/12/9.
 */

public class DraweePagerAdapter<T> extends PagerAdapter {
    private View.OnClickListener listener = null;
    private View.OnLongClickListener longClickListener = null;
    private ImageLoader imageLoader;

    public DraweePagerAdapter(List<T> urls, View.OnClickListener listener,View.OnLongClickListener longClickListener, ImageLoader<T> imageLoader) {
        this.listener = listener;
        this.mDrawables = urls;
        this.imageLoader = imageLoader;
        this.longClickListener = longClickListener;
    }

    private List<T> mDrawables = new ArrayList<>();

    @Override
    public int getCount() {
        return mDrawables.size();
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
        return view == object;
    }

    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
        container.removeView((View) object);
    }

    @Override
    public Object instantiateItem(ViewGroup viewGroup, int position) {

        final T item = mDrawables.get(position);
        LayoutInflater inflater = LayoutInflater.from(viewGroup.getContext());
        View view = inflater.inflate(R.layout.item_photo_view, null);

        final PhotoDraweeView photoDraweeView = (PhotoDraweeView) view.findViewById(R.id.photo_drawee_view);
        if (listener != null) {
            photoDraweeView.setOnPhotoTapListener(new OnPhotoTapListener() {
                @Override
                public void onPhotoTap(View view, float x, float y) {
                    listener.onClick(view);
                }
            });
            photoDraweeView.setOnViewTapListener(new OnViewTapListener() {
                @Override
                public void onViewTap(View view, float x, float y) {
                    listener.onClick(view);
                }
            });
            photoDraweeView.setOnLongClickListener(longClickListener);
        }
//        photoDraweeView.getHierarchy();
        imageLoader.load(photoDraweeView, item);
        try {
            viewGroup.addView(photoDraweeView, ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return photoDraweeView;
    }
}
