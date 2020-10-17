package cn.jiguang.imui.messages;


import android.os.Handler;
import android.os.Message;
import android.util.Log;

import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

public class ScrollMoreListener extends RecyclerView.OnScrollListener {

    private RecyclerView.LayoutManager mLayoutManager;
    private OnLoadMoreListener mListener;
    private int mCurrentPage = 0;
    private int mPreviousTotalItemCount = 0;
    private boolean mLoading = false;
    private int visibleThreshold = 5;
    private int scrollThreshold = 3;
    private boolean autoScroll = true;

    public ScrollMoreListener(LinearLayoutManager layoutManager, OnLoadMoreListener listener, int visibleThreshold) {
        this.mLayoutManager = layoutManager;
        this.mListener = listener;
        if (visibleThreshold > 0) {
            this.visibleThreshold = visibleThreshold;
        }
    }

    private int getLastVisibleItem(int[] lastVisibleItemPositions) {
        int maxSize = 0;
        for (int i = 0; i < lastVisibleItemPositions.length; i++) {
            if (i == 0) {
                maxSize = lastVisibleItemPositions[i];
            } else if (lastVisibleItemPositions[i] > maxSize) {
                maxSize = lastVisibleItemPositions[i];
            }
        }
        return maxSize;
    }

    @Override
    public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
        setStackFromEnd();
        if (mListener != null) {
            int lastVisibleItemPosition = 0;
            int firstVisibleItemPosition = 0;
            int totalItemCount = mLayoutManager.getItemCount();
            if (mLayoutManager instanceof StaggeredGridLayoutManager) {
                int[] lastVisibleItemPositions = ((StaggeredGridLayoutManager) mLayoutManager)
                        .findLastVisibleItemPositions(null);
                lastVisibleItemPosition = getLastVisibleItem(lastVisibleItemPositions);
            } else if (mLayoutManager instanceof LinearLayoutManager) {
                lastVisibleItemPosition = ((LinearLayoutManager) mLayoutManager).findLastVisibleItemPosition();
                firstVisibleItemPosition = ((LinearLayoutManager) mLayoutManager).findFirstVisibleItemPosition();
            } else if (mLayoutManager instanceof GridLayoutManager) {
                lastVisibleItemPosition = ((GridLayoutManager) mLayoutManager).findLastVisibleItemPosition();
            }

            if (totalItemCount < mPreviousTotalItemCount) {
                mCurrentPage = 0;
                mPreviousTotalItemCount = totalItemCount;
                if (totalItemCount == 0) {
                    mLoading = true;
                }
            }

            if (mLoading && totalItemCount > mPreviousTotalItemCount) {
                mLoading = false;
                mPreviousTotalItemCount = totalItemCount;
            }

            boolean auto = firstVisibleItemPosition < scrollThreshold;
            if (autoScroll != auto) {
                autoScroll = auto;
                mListener.onAutoScroll(autoScroll);
            }
            if (!mLoading && lastVisibleItemPosition + visibleThreshold > totalItemCount) {
                mCurrentPage++;
                mListener.onLoadMore(mCurrentPage, totalItemCount);
                mLoading = true;
            }
        }
    }

    Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            if (msg.what == 1) {
                try {
                    ll.setStackFromEnd(false);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (msg.what == 2) {
                try {
                    ll.setStackFromEnd(true);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            lastTime = System.currentTimeMillis();
        }
    };
    LinearLayoutManager ll;
    long lastTime = 0L;

    void setStackFromEnd() {
        long current = System.currentTimeMillis();

        Log.w("setStackFromEnd", "setStackFromEnd:" + (current - lastTime));
        if (current - lastTime < 500L) {
            return;
        }

        if (mLayoutManager instanceof LinearLayoutManager) {
            ll = (LinearLayoutManager) mLayoutManager;
            if (ll.getStackFromEnd()) {
                if (ll.getChildCount() < mLayoutManager.getItemCount()) {
                    handler.sendEmptyMessageDelayed(1, 150);
                }
            } else {
                if (ll.getChildCount() >= mLayoutManager.getItemCount()) {
                    handler.sendEmptyMessageDelayed(2, 150);
                }
            }
        }
    }

    interface OnLoadMoreListener {
        void onLoadMore(int page, int total);

        void onAutoScroll(boolean autoScroll);
    }
}
