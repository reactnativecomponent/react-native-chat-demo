package com.dowin.imageviewer;

import me.relex.photodraweeview.PhotoDraweeView;

/**
 * Created by dowin on 2017/8/21.
 */

public interface ImageLoader<T> {

    void load(PhotoDraweeView imageView, T t);
}
