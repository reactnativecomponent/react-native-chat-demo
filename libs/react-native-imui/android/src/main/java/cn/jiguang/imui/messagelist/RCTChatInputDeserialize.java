package cn.jiguang.imui.messagelist;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;

import cn.jiguang.imui.messagelist.module.RCTMember;

/**
 * Created by dowin on 2017/9/1.
 */

public class RCTChatInputDeserialize implements JsonDeserializer<RCTMember> {
    @Override
    public RCTMember deserialize(JsonElement jsonElement, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {

        JsonObject jsonObject = jsonElement.getAsJsonObject();
        RCTMember input = new RCTMember(jsonObject.get(ChatInputConstant.Member.NAME).getAsString(),
                jsonObject.get(ChatInputConstant.Member.CONTACT_ID).getAsString());

        if(jsonObject.has(ChatInputConstant.Member.ALIAS)){
            input.setAlias(jsonObject.get(ChatInputConstant.Member.ALIAS).getAsString());
        }
        return input;
    }
}
