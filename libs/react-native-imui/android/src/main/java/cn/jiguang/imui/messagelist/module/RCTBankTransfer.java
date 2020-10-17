package cn.jiguang.imui.messagelist.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import cn.jiguang.imui.commons.models.IBankTransfer;
import cn.jiguang.imui.messagelist.MessageConstant;


public class RCTBankTransfer extends RCTExtend implements IBankTransfer {



    private String amount;
    private String serialNo;
    private String comments;
    private static Gson sGSON = new Gson();

    public RCTBankTransfer(String amount, String serialNo, String comments) {
        this.amount = amount;
        this.serialNo = serialNo;
        this.comments = comments;
    }

    @Override
    WritableMap toWritableMap(){
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MessageConstant.BankTransfer.AMOUNT, amount);
        writableMap.putString(MessageConstant.BankTransfer.SERIA_NO, serialNo);
        writableMap.putString(MessageConstant.BankTransfer.COMMENTS, comments);
        return writableMap;
    }
    @Override
    public JsonElement toJSON() {
        JsonObject json = new JsonObject();
        json.addProperty(MessageConstant.BankTransfer.AMOUNT,amount);
        json.addProperty(MessageConstant.BankTransfer.SERIA_NO,serialNo);
        json.addProperty(MessageConstant.BankTransfer.COMMENTS,comments);
        return json;
    }

    @Override
    public String getAmount() {
        return amount;
    }

    @Override
    public String getSeriaNo() {
        return serialNo;
    }

    @Override
    public String getComments() {
        return comments;
    }
}
