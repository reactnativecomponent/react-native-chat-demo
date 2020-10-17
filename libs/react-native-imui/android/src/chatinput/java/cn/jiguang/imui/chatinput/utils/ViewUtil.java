package cn.jiguang.imui.chatinput.utils;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ValueAnimator;
import android.content.res.Resources;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;


public final class ViewUtil {

    public static float pxToDp(float px) {
        float densityDpi = Resources.getSystem().getDisplayMetrics().densityDpi;
        return px / (densityDpi / 160f);
    }

    public static int dpToPx(int dp) {
        float density = Resources.getSystem().getDisplayMetrics().density;
        return Math.round(dp * density);
    }


    // 高度渐变的动画；
    private static void animHeightToView(final View v, final int start, final int end, final boolean isToShow,
                                         long duration) {
        Log.w(v.getClass().getName(), "start:" + start + "-end:" + end);
        ValueAnimator va = ValueAnimator.ofInt(start, end);
        final ViewGroup.LayoutParams layoutParams = v.getLayoutParams();
        va.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                int h = (int) animation.getAnimatedValue();
                layoutParams.height = h;
                v.setLayoutParams(layoutParams);
                v.requestLayout();
            }
        });

        va.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationStart(Animator animation) {

                Log.w(v.getClass().getName(), "Start:" + (v.getVisibility() == View.VISIBLE));
                if (isToShow) {
                    v.setVisibility(View.VISIBLE);
                    v.requestLayout();
                }
                super.onAnimationStart(animation);
            }

            @Override
            public void onAnimationEnd(Animator animation) {

                Log.w(v.getClass().getName(), "End:" + (v.getVisibility() == View.VISIBLE));
                super.onAnimationEnd(animation);
                if (!isToShow) {
                    v.setVisibility(View.GONE);
                }
            }
        });
        va.setDuration(duration);
        va.start();
    }

    public static void animHeightToView(int height, final View v, final boolean isToShow, final long duration) {

        if (isToShow) {
            animHeightToView(v, 0, height, isToShow, duration);
        } else {
            // 隐藏：从当前高度变化到0，最后设置不可见；
            animHeightToView(v, v.getLayoutParams().height, 0, isToShow, duration);
        }
    }
}
