package com.imdemo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import ui.toasty.RNToastyPackage;


import com.netease.im.ImPushConfig;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.netease.im.RNNeteaseImPackage;
import cn.jiguang.imui.messagelist.ReactIMUIPackage;
import com.netease.im.IMApplication;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import com.horcrux.svg.SvgPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import cn.qiuxiang.react.amap3d.AMap3DPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNToastyPackage(),
            new PickerPackage(),
            new RNNeteaseImPackage(),
            new ReactIMUIPackage(),
            new AMapGeolocationPackage(),
            new SvgPackage(),
            new RNGestureHandlerPackage(),
            new AMap3DPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    ImPushConfig config = new ImPushConfig();
    config.xmAppId = "";
    config.xmAppKey = "";
    config.xmCertificateName = "";
    config.hwCertificateName = "";
    IMApplication.init(this, MainActivity.class, R.drawable.ic_stat_notify_msg,config);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
