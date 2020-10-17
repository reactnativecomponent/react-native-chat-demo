package cn.jiguang.imui.chatinput.record;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.FrameLayout;

import androidx.annotation.AttrRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * Created by dowin on 2017/8/26.
 */

public class ActionLayout extends FrameLayout{
    public ActionLayout(@NonNull Context context) {
        super(context);
    }

    public ActionLayout(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public ActionLayout(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private final Runnable measureAndLayout = new Runnable() {

        int width = 0;
        int height = 0;

        @Override
        public void run() {

            if (width == 0) {
                width = getWidth();
            }
            if (height == 0) {
                height = getHeight();
            }
            measure(MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };
    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
    }
}
