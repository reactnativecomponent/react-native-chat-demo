package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.ICard;
import cn.jiguang.imui.messagelist.MessageConstant;

/**
 * Created by dowin on 2017/10/23.
 */

public class RCTCard extends RCTExtend implements ICard {

    private String cardType;
    private String name;
    private String imgPath;
    private String sessionId;

    public RCTCard(String cardType, String name, String imgPath, String sessionId) {
        this.cardType = cardType;
        this.name = name;
        this.imgPath = imgPath;
        this.sessionId = sessionId;
    }

    @Override
    public String getCardType() {
        return cardType;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getImgPath() {
        return imgPath;
    }

    @Override
    public String getSessionId() {
        return sessionId;
    }

    @Override
    JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.Card.type, cardType);
        json.addProperty(MessageConstant.Card.name, name);
        json.addProperty(MessageConstant.Card.imgPath, imgPath);
        json.addProperty(MessageConstant.Card.sessionId, sessionId);
        return json;
    }

    @Override
    WritableMap toWritableMap() {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.Card.type, cardType);
        writableMap.putString(MessageConstant.Card.name, name);
        writableMap.putString(MessageConstant.Card.imgPath, imgPath);
        writableMap.putString(MessageConstant.Card.sessionId, sessionId);
        return writableMap;
    }
}
