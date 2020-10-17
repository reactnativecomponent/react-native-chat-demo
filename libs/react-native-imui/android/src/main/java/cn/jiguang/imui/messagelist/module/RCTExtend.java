package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.google.gson.JsonElement;

import cn.jiguang.imui.commons.models.IExtend;



public abstract class RCTExtend implements IExtend {

    private static Gson sGSON = new Gson();

    abstract JsonElement toJSON();

    abstract WritableMap toWritableMap();
    @Override
    public String toString() {
        return sGSON.toJson(toJSON());
    }
}
