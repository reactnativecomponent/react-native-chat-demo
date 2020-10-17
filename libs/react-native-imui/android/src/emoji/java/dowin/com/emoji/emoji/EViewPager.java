package dowin.com.emoji.emoji;

import android.content.Context;
import android.util.AttributeSet;

import androidx.viewpager.widget.ViewPager;

/**
 * Created by dowin on 2017/8/8.
 */

public class EViewPager extends ViewPager {
    public EViewPager(Context context) {
        super(context);
    }

    public EViewPager(Context context, AttributeSet attrs) {
        super(context, attrs);
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
