package com.imdemo;
import android.app.Application;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.netease.im.RNNeteaseImPackage;
import cn.jiguang.imui.messagelist.ReactIMUIPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import cn.qiuxiang.react.amap3d.AMap3DPackage;
import me.ele.dodo.AMapLocationReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.netease.im.IMApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {


    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new SvgPackage(),
                new RNNeteaseImPackage(),
                new ReactIMUIPackage(),
                new PickerPackage(),
                new AMap3DPackage(),
                new AMapLocationReactPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }


    @Override
    public void onCreate() {
        super.onCreate();
        //new IMApplication.MiPushConfig("appId","appKey","pushname")
        IMApplication.init(this, MainActivity.class, R.drawable.ic_stat_notify_msg, null
        );

        SoLoader.init(this, /* native exopackage */ false);
    }
}
