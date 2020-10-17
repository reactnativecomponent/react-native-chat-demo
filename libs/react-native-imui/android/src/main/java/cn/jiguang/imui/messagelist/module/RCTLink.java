package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.ILink;
import cn.jiguang.imui.messagelist.MessageConstant;



public class RCTLink extends RCTExtend implements ILink {



    private String title;
    private String describe;
    private String image;
    private String linkUrl;

    public RCTLink(String title, String describe, String image, String linkUrl) {
        this.title = title;
        this.describe = describe;
        this.image = image;
        this.linkUrl = linkUrl;
    }

    @Override
    WritableMap toWritableMap(){
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.Link.TITLE, title);
        writableMap.putString(MessageConstant.Link.DESCRIBE, describe);
        writableMap.putString(MessageConstant.Link.IMAGE, image);
        writableMap.putString(MessageConstant.Link.LINK_URL, linkUrl);
        return writableMap;
    }
    @Override
    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.Link.TITLE, title);
        json.addProperty(MessageConstant.Link.DESCRIBE, describe);
        json.addProperty(MessageConstant.Link.IMAGE, image);
        json.addProperty(MessageConstant.Link.LINK_URL, linkUrl);
        return json;
    }


    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getDescribe() {
        return describe;
    }

    @Override
    public String getImage() {
        return image;
    }

    @Override
    public String getLinkUrl() {
        return linkUrl;
    }
}
