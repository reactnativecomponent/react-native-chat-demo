package cn.jiguang.imui.commons.models;

import java.util.Map;

/**
 * Created by dowin on 2017/8/18.
 */

public interface IAccountNotice extends IExtend {

    String getTitle();

    String getTime();

    String getDate();

    String getAmount();

    Map<String,String> getBody();

    String getSeriaNo();
}
