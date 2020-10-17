package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.Map;

import cn.jiguang.imui.commons.models.IAccountNotice;
import cn.jiguang.imui.messagelist.MessageConstant;


public class RCTAccountNotice extends RCTExtend implements IAccountNotice {

    private String title;
    private String time;
    private String date;
    private String amount;
    private Map<String, String> body;
    private String serialNo;

    public RCTAccountNotice(String title, String time, String date, String amount, Map<String, String> body, String serialNo) {
        this.title = title;
        this.time = time;
        this.date = date;
        this.amount = amount;
        this.body = body;
        this.serialNo = serialNo;
    }

    @Override
    WritableMap toWritableMap() {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.AccountNotice.TITLE, title);
        writableMap.putString(MessageConstant.AccountNotice.TIME, time);
        writableMap.putString(MessageConstant.AccountNotice.DATE, date);
        writableMap.putString(MessageConstant.AccountNotice.AMOUNT, amount);
//        if (body != null && body.size() > 0) {
//        writableMap.putMap(MessageConstant.AccountNotice.BODY, body);
//        }
        writableMap.putString(MessageConstant.AccountNotice.SERIAL_NO, serialNo);
        return writableMap;
    }

    @Override
    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.AccountNotice.TITLE, title);
        json.addProperty(MessageConstant.AccountNotice.TIME, time);
        json.addProperty(MessageConstant.AccountNotice.DATE, date);
        json.addProperty(MessageConstant.AccountNotice.AMOUNT, amount);

        if (body != null && body.size() > 0) {
            JsonObject eBody = new JsonObject();
            for (Map.Entry<String, String> entry : body.entrySet()) {
                eBody.addProperty(entry.getKey(),entry.getValue());
            }
            json.add(MessageConstant.AccountNotice.BODY, eBody);
        }

        json.addProperty(MessageConstant.AccountNotice.SERIAL_NO, serialNo);
        return json;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getTime() {
        return time;
    }

    @Override
    public String getDate() {
        return date;
    }

    @Override
    public String getAmount() {
        return amount;
    }

    @Override
    public Map<String, String> getBody() {
        return body;
    }

    @Override
    public String getSeriaNo() {
        return serialNo;
    }
}
