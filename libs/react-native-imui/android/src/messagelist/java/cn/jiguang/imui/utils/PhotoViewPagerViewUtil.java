package cn.jiguang.imui.utils;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.Animatable;
import android.net.Uri;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

import com.dowin.imageviewer.DraweePagerAdapter;
import com.dowin.imageviewer.FrescUtil;
import com.dowin.imageviewer.ImageLoader;
import com.dowin.imageviewer.MultiTouchViewPager;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.common.RotationOptions;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;

import java.io.File;
import java.util.List;

import cn.jiguang.imui.commons.models.IMediaFile;
import cn.jiguang.imui.messagelist.R;
import dowin.com.emoji.media.ScreenUtil;
import me.relex.photodraweeview.PhotoDraweeView;

/**
 * Created by dowin on 2017/8/21.
 */

public class PhotoViewPagerViewUtil {
    static ImageLoader imageLoader = new ImageLoader<IMediaFile>() {
        @Override
        public void load(final PhotoDraweeView photoDraweeView, IMediaFile o) {

//                RequestManager m = Glide.with(photoDraweeView.getContext());
//                DrawableTypeRequest request;
//
//                if (TextUtils.isEmpty(o.getUrl())) {
//                    request = m.load(o.getUrl());
//                } else {
//                    request = m.load(new File(o.getThumbPath()));
//                }
//                request.fitCenter()
//                        .placeholder(R.drawable.aurora_picture_not_found)
//                        .override(400, Target.SIZE_ORIGINAL)
//                        .into(photoDraweeView);

            try {
                Uri uri;
                if (TextUtils.isEmpty(o.getUrl())) {
                    uri = Uri.fromFile(new File(o.getThumbPath()));
//                    request = ImageRequest.fromFile(new File(o.getThumbPath()));
                } else {
//                    request = ImageRequest.fromUri(o.getUrl());
                    uri = Uri.parse(o.getUrl());
                }

                PipelineDraweeControllerBuilder controller = Fresco.newDraweeControllerBuilder();
//                controller.setImageRequest(request);
                int size = Math.max(ScreenUtil.getDisplayWidth(photoDraweeView.getContext()),ScreenUtil.getDisplayHeight(photoDraweeView.getContext()));
                ImageRequest request =  ImageRequestBuilder.newBuilderWithSource(uri)
                        .setResizeOptions(ResizeOptions.forSquareSize(size))
                        .setRotationOptions(RotationOptions.autoRotateAtRenderTime())
                        .build();
                controller.setImageRequest(request);
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
                ImagePipelineConfig.newBuilder(photoDraweeView.getContext()).setDownsampleEnabled(true).build();
                photoDraweeView.setController(controller.build());
            } catch (Throwable e) {
                e.printStackTrace();
            }
        }
    };

    public interface IPhotoLongClickListener {
        boolean onClick(Dialog dialog, View v, IMediaFile mediaFile);
    }

    public static void show(final Activity mActivity, final List<IMediaFile> list, int curIndex, final IPhotoLongClickListener longClickListener) {

        final Dialog dialog = new Dialog(mActivity, R.style.ImageDialog);
        final View view = mActivity.getLayoutInflater().inflate(R.layout.activity_viewpager, null);

//        CircleIndicator indicator = (CircleIndicator) view.findViewById(R.id.indicator);
        final MultiTouchViewPager viewPager = (MultiTouchViewPager) view.findViewById(R.id.view_pager);
        viewPager.setBackgroundColor(Color.BLACK);
        View.OnClickListener onClickListener = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.dismiss();
            }
        };
        View.OnLongClickListener onLongClickListener = new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {

                if (longClickListener != null) {
                    final int index = viewPager.getCurrentItem();
                    if (index >= 0 && index < list.size()) {
                        longClickListener.onClick(dialog, v, list.get(index));
                    }
                }
                return false;
            }
        };
        final DraweePagerAdapter<IMediaFile> adapter = new DraweePagerAdapter(list, onClickListener, onLongClickListener, imageLoader);

        dialog.setOnKeyListener(new DialogInterface.OnKeyListener() {
            @Override
            public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    dialog.dismiss();
                }
                return false;
            }
        });
        View download = view.findViewById(R.id.download);
//        try {
//            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) download.getLayoutParams();
//            params.bottomMargin = 37;
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
        download.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final int index = viewPager.getCurrentItem();
                if (index >= 0 && index < list.size()) {
                    saveImageToAlbum(list.get(index), mActivity);
                }
            }
        });
        viewPager.setAdapter(adapter);
        viewPager.setCurrentItem(curIndex);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(view);
        dialog.setCanceledOnTouchOutside(false);
        dialog.setCancelable(false);
        WindowManager.LayoutParams lay = dialog.getWindow().getAttributes();
        DisplayMetrics dm = new DisplayMetrics();
        mActivity.getWindowManager().getDefaultDisplay().getMetrics(dm);
        Rect rect = new Rect();
        View decorView = mActivity.getWindow().getDecorView();
        decorView.getWindowVisibleDisplayFrame(rect);
        lay.height = dm.heightPixels - rect.top;
        lay.width = dm.widthPixels;
        dialog.show();
    }

    public static void saveImageToAlbum(String imagePath, Context context) {
        if(TextUtils.isEmpty(imagePath)){
            return;
        }
        File imageFile = new File(imagePath);
        if (imageFile.exists()) {
            try {
                String path = MediaStore.Images.Media.insertImage(context.getContentResolver(), imageFile.getAbsolutePath(), "title", "description");
                context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse("file://" + imageFile.getAbsolutePath())));
                Toast.makeText(context, "保存到相册！", Toast.LENGTH_SHORT).show();
            } catch (Throwable e) {
                e.printStackTrace();
            }
        }
    }

    public static void saveImageToAlbum(IMediaFile mediaFile, Context context) {
        if (TextUtils.isEmpty(mediaFile.getUrl())) {
            saveImageToAlbum(mediaFile.getThumbPath(), context);
            return;
        }
        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        Uri uri = Uri.parse(mediaFile.getUrl());
        boolean inMemoryCache = imagePipeline.isInBitmapMemoryCache(uri);
        if (!inMemoryCache) {
            saveImageToAlbum(mediaFile.getThumbPath(), context);
        } else {
            String path = FrescUtil.getPath(context, mediaFile.getUrl());
            saveImageToAlbum(path, context);
        }

    }
}
