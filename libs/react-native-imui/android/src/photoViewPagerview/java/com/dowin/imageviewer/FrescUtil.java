package com.dowin.imageviewer;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import com.facebook.binaryresource.BinaryResource;
import com.facebook.binaryresource.FileBinaryResource;
import com.facebook.cache.common.CacheKey;
import com.facebook.cache.disk.DiskCacheConfig;
import com.facebook.common.internal.Supplier;
import com.facebook.common.util.ByteConstants;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.cache.DefaultCacheKeyFactory;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.imagepipeline.core.ImagePipelineFactory;
import com.facebook.imagepipeline.request.ImageRequest;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by dowin on 2017/8/30.
 */

public class FrescUtil {
    public static void init(final Context context){
        Log.w(FrescUtil.class.getName(),""+DiskCacheConfig.class.getName());
        DiskCacheConfig diskCacheConfig = DiskCacheConfig.newBuilder(context)
                .setBaseDirectoryPathSupplier(
                        new Supplier<File>() {
                            @Override
                            public File get() {
                                return getCacheDir(context);
                            }
                        })
                .setBaseDirectoryName("image")
                .setMaxCacheSize(40 * ByteConstants.MB)
                .setMaxCacheSizeOnLowDiskSpace(10 * ByteConstants.MB)
                .setMaxCacheSizeOnVeryLowDiskSpace(2 * ByteConstants.MB)
                .build();
        ImagePipelineConfig config = ImagePipelineConfig.newBuilder(context)
                .setCacheKeyFactory(DefaultCacheKeyFactory.getInstance())
                .setDownsampleEnabled(true)
                .setMainDiskCacheConfig(diskCacheConfig)
                .build();
        config.getMainDiskCacheConfig();
        Fresco.initialize(context, config);
    }
    public static File getCacheDir(Context context) {
        File f = new File(Environment.getExternalStorageDirectory(), context.getPackageName() + "/nim/");
        if (!f.exists()) {
            f.mkdirs();
        }
        return f;
    }

    public static String getPath(Context context,String url){
        ImageRequest imageRequest=ImageRequest.fromUri(url);
        CacheKey cacheKey=DefaultCacheKeyFactory.getInstance()
                .getEncodedCacheKey(imageRequest,null);
        BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
        File file=((FileBinaryResource)resource).getFile();
        File out  = new File(getCacheDir(context),"image/");
        if(!out.exists()){
            out.mkdirs();
        }
        out = new File(out,file.getName()+".jpg");
        Log.w(FrescUtil.class.getName(),file.getAbsolutePath());
        Log.w(FrescUtil.class.getName(),out.getAbsolutePath());
        FileOutputStream outputStream = null;
        InputStream inputStream = null;
        try {
            outputStream = new FileOutputStream(out);
            inputStream = resource.openStream();
            final int BUF_SIZE = 0x1000;
            byte[] buffer = new byte[BUF_SIZE];
            int length;
            while ((length = inputStream.read(buffer))!=-1){
                outputStream.write(buffer,0,length);
            }
            outputStream.flush();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(inputStream!=null){
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(outputStream!=null){
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
        return out.getAbsolutePath();
    }
}
