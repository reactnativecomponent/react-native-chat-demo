package cn.jiguang.imui.chatinput.record;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.Button;


public class RecordVoiceButton extends Button {

    private final static String TAG = "RecordVoiceButton";
    private Context mContext;
    private RecordVoiceBtnStyle mStyle;

    public RecordVoiceButton(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.mContext = context;
        init(context, attrs);
    }

    public RecordVoiceButton(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        this.mContext = context;
        init(context, attrs);
    }

    private void init(Context context, AttributeSet attrs) {
        mStyle = RecordVoiceBtnStyle.parse(context, attrs);
    }


}
