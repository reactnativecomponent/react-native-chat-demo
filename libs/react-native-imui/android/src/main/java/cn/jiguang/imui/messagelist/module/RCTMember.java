package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.messagelist.ChatInputConstant;

/**
 * Created by dowin on 2017/9/1.
 */

public class RCTMember {

    private String name;
    private String alias;
    private String contactId;

    public RCTMember(String name, String contactId) {
        this.name = name;
        this.contactId = contactId;
    }


    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getAlias() {
        return alias;
    }

    public String getName() {
        return name;
    }

    public String getContactId() {
        return contactId;
    }

    private static Gson sGSON = new Gson();

    public WritableMap toWritableMap() {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(ChatInputConstant.Member.NAME, name);
        writableMap.putString(ChatInputConstant.Member.CONTACT_ID, contactId);
        writableMap.putString(ChatInputConstant.Member.ALIAS, alias);
        return writableMap;
    }

    private JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(ChatInputConstant.Member.NAME, name);
        json.addProperty(ChatInputConstant.Member.CONTACT_ID, contactId);
        if(alias!=null) {
            json.addProperty(ChatInputConstant.Member.ALIAS, alias);
        }
        return json;
    }

    @Override
    public String toString() {
        return sGSON.toJson(toJSON());
    }


}
