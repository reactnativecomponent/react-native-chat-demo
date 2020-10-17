package cn.jiguang.imui.messagelist;

import com.ScreenUtil;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import dowin.com.emoji.EmojiUtil;


public class ReactIMUIPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> nativeModules = new ArrayList<>();
        nativeModules.add(new AuroraIMUIModule(reactContext));
        return nativeModules;
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        ScreenUtil.init(reactContext);
        EmojiUtil.init(reactContext);
        List<ViewManager> viewManagers = new ArrayList<>();
        viewManagers.add(new ReactMsgListManager());
        viewManagers.add(new ReactChatInputManager());
        viewManagers.add(new ReactTimerTipManager());
        return  viewManagers;
    }
}
