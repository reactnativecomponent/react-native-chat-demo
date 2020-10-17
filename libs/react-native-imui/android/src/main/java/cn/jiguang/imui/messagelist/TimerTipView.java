package cn.jiguang.imui.messagelist;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.AttrRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * Created by dowin on 2017/8/28.
 */

public class TimerTipView extends FrameLayout {

    final static String LAST_TIME = "还可以说%s秒";
    final static String TCT_NAME = "TimerTip";
    final static int TIP_COLOR = 0Xcc882D2C;
    private ImageView imageView;
    private TextView timerTipText;
    private View timerTipLayout;

    private int timerStatus = 0;
    private String[] timerTip = {"手指上滑，取消发送", "松开手指，取消发送", "录音时间太短", "录音时间过长"};
    GradientDrawable bgDrawable;
    private String timeStr;

    public TimerTipView(@NonNull Context context) {
        this(context, null);
    }

    public TimerTipView(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TimerTipView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    void init(Context context) {

        inflate(context, R.layout.timer_tip, this);

        imageView = (ImageView) findViewById(R.id.progress);
        timerTipLayout = findViewById(R.id.timer_tip_layout);
        timerTipText = (TextView) findViewById(R.id.timer_tip);
        imageView.getDrawable().setLevel(3000 + 6000 * 50 / 100);

        bgDrawable = new GradientDrawable();
        bgDrawable.setStroke(1, Color.DKGRAY, 0, 0);
        bgDrawable.setShape(GradientDrawable.RECTANGLE);

        bgDrawable.setGradientRadius(10);
        bgDrawable.setGradientType(GradientDrawable.LINEAR_GRADIENT);
        bgDrawable.setCornerRadius(7);
        bgDrawable.setColor(TIP_COLOR);
    }

    public void updateStatus(int level, int status, int time) {


        if (time > 0 && time <= 10) {
            timeStr = "" + time;
        } else {
            timeStr = null;
        }
        updateTextStatus(status);
        updateImageStatus(status);
        if (status == 0) {
            imageView.getDrawable().setLevel(3700 + 6300 * level / 100);
        }
    }

    void updateImageStatus(int status) {
        switch (status) {
            case 2:
            case 3:
                imageView.setImageResource(R.drawable.voice_to_short);
                break;

            case 0:
                imageView.setImageResource(R.drawable.microphone);
                break;
            case 1:
                imageView.setImageResource(R.drawable.cancel);
                break;
        }
    }

    void updateTextStatus(int status) {

        int updateS = status;
        if (status < 0 || status > 3) {
            updateS = 0;
        }
        if (updateS == 0 && !TextUtils.isEmpty(timeStr)) {
            timerTipText.setText(String.format(LAST_TIME, timeStr));
        } else {
            timerTipText.setText(timerTip[updateS]);
        }

        if (updateS == 1) {
            bgDrawable.setStroke(1, Color.DKGRAY, 0, 0);
            bgDrawable.setColor(TIP_COLOR);
        } else {
            bgDrawable.setStroke(0, Color.TRANSPARENT, 0, 0);
            bgDrawable.setColor(Color.TRANSPARENT);
        }
        timerTipText.setBackground(bgDrawable);
    }
}
