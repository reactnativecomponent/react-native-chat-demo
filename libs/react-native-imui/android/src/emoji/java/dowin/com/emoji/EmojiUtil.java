package dowin.com.emoji;

import android.content.Context;

import dowin.com.emoji.emoji.EmojiManager;
import dowin.com.emoji.media.ScreenUtil;

/**
 * Created by dowin on 2017/8/8.
 */

public class EmojiUtil {
    public static void init(Context context){
        ScreenUtil.init(context);
        EmojiManager.init(context);
//        StickerManager.getInstance().init(context);
    }
}
