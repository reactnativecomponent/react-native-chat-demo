package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.IUser;
import cn.jiguang.imui.messagelist.MessageConstant;



public class RCTUser implements IUser {



    private String userId;
    private String displayName;
    private String avatarPath;
    private static Gson sGSON = new Gson();

    public RCTUser(String userId, String displayName, String avatarPath) {
        this.userId = userId;
        this.displayName = displayName;
        this.avatarPath = avatarPath;
    }

    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.User.USER_ID, userId);
        json.addProperty(MessageConstant.User.DISPLAY_NAME, displayName);
        json.addProperty(MessageConstant.User.AVATAR_PATH, avatarPath);
        return json;
    }
    @Override
    public String getId() {
        return this.userId;
    }

    @Override
    public String getDisplayName() {
        return this.displayName;
    }

    @Override
    public String getAvatarFilePath() {
        return this.avatarPath;
    }

    WritableMap toWritableMap(){
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.User.USER_ID, userId);
        writableMap.putString(MessageConstant.User.DISPLAY_NAME, displayName);
        writableMap.putString(MessageConstant.User.AVATAR_PATH, avatarPath);
        return writableMap;
    }
    @Override
    public String toString() {
        return sGSON.toJson(toJSON());
    }
}
