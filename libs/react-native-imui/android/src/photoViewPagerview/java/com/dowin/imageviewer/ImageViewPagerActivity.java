package com.dowin.imageviewer;

import android.app.Activity;
import android.graphics.drawable.Animatable;
import android.net.Uri;
import android.os.Bundle;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.imagepipeline.image.ImageInfo;

import java.util.ArrayList;
import java.util.List;

import cn.jiguang.imui.messagelist.R;
import me.relex.photodraweeview.PhotoDraweeView;

/**
 * Created by dowin on 2016/12/9.
 */

public class ImageViewPagerActivity extends Activity {

    public final static String BUNDLE_IMAGE_URL = "image-url";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

//        CircleIndicator indicator = (CircleIndicator) findViewById(R.id.indicator);
        MultiTouchViewPager viewPager = (MultiTouchViewPager) findViewById(R.id.view_pager);
        ImageLoader<String> imageloader = new ImageLoader<String>() {
            @Override
            public void load(final PhotoDraweeView photoDraweeView, String o) {
                PipelineDraweeControllerBuilder controller = Fresco.newDraweeControllerBuilder();
                controller.setUri(Uri.parse(o));//"res:///" + id
                controller.setOldController(photoDraweeView.getController());
                controller.setControllerListener(new BaseControllerListener<ImageInfo>() {
                    @Override
                    public void onFinalImageSet(String id, ImageInfo imageInfo, Animatable animatable) {
                        super.onFinalImageSet(id, imageInfo, animatable);
                        if (imageInfo == null) {
                            return;
                        }
                        photoDraweeView.update(imageInfo.getWidth(), imageInfo.getHeight());
                    }
                });
                photoDraweeView.setController(controller.build());
            }
        };
        List<String> list = new ArrayList<>();
        viewPager.setAdapter(new DraweePagerAdapter(list, null,null, imageloader));
//        indicator.setViewPager(viewPager);
    }
}
