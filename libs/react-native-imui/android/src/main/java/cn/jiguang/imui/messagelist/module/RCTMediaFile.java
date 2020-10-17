package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.IMediaFile;
import cn.jiguang.imui.messagelist.MessageConstant;


public class RCTMediaFile extends RCTExtend implements IMediaFile{



    private String id;
    private String height;
    private String width;
    private String displayName;
    private long duration;
    private String thumbPath;
    private String path;
    private String url;

    public RCTMediaFile(String thumbPath,String path, String url) {
        this.thumbPath = thumbPath;
        this.path = path;
        this.url = url;
    }
    @Override
    WritableMap toWritableMap(){
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.MediaFile.HEIGHT, height);
        writableMap.putString(MessageConstant.MediaFile.WIDTH, width);
        writableMap.putString(MessageConstant.MediaFile.DISPLAY_NAME, displayName);
        writableMap.putString(MessageConstant.MediaFile.DURATION, Long.toString(duration));
        writableMap.putString(MessageConstant.MediaFile.THUMB_PATH, thumbPath);
        writableMap.putString(MessageConstant.MediaFile.PATH, path);
        writableMap.putString(MessageConstant.MediaFile.URL, url);
        return writableMap;
    }
    @Override
    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.MediaFile.HEIGHT, height);
        json.addProperty(MessageConstant.MediaFile.WIDTH, width);
        json.addProperty(MessageConstant.MediaFile.DISPLAY_NAME, displayName);
        json.addProperty(MessageConstant.MediaFile.DURATION, duration);
        json.addProperty(MessageConstant.MediaFile.THUMB_PATH, thumbPath);
        json.addProperty(MessageConstant.MediaFile.PATH, path);
        json.addProperty(MessageConstant.MediaFile.URL, url);
        return json;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getHeight() {
        return height;
    }

    @Override
    public String getWidth() {
        return width;
    }

    @Override
    public String getDisplayName() {
        return displayName;
    }

    @Override
    public long getDuration() {
        return duration;
    }

    @Override
    public String getPath() {
        return path;
    }

    @Override
    public String getThumbPath() {
        return thumbPath;
    }

    @Override
    public String getUrl() {
        return url;
    }

    @Override
    public boolean equals(Object obj) {
        return super.equals(obj);
    }
}
