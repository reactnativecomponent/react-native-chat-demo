package dowin.com.emoji.emoji;

import android.graphics.Color;
import android.text.TextPaint;
import android.text.style.ClickableSpan;
import android.view.View;

/**
 * Created by dowin on 2017/8/22.
 */

public class LinkClick extends ClickableSpan {

    public interface OnLinkClickListener {
        void onClick(View widget, String url);
    }

    OnLinkClickListener linkClickListener;

    private final String url;
    private int color = Color.WHITE;
    public LinkClick(String url) {
        this.url = url;
    }

    public String getURL() {
        return url;
    }

    public void setColor(int color) {
        this.color = color;
    }

    public void setLinkClickListener(OnLinkClickListener linkClickListener) {
        this.linkClickListener = linkClickListener;
    }

    @Override
    public void onClick(View widget) {
        if (linkClickListener != null)
            linkClickListener.onClick(widget, getURL());
    }

    @Override
    public void updateDrawState(TextPaint ds) {
//        ds.setColor(color);
//        ds.linkColor = color;
//        ds.setUnderlineText(true);
    }
}
