package cn.jiguang.imui.commons;

import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

public abstract class ViewHolder<DATA> extends RecyclerView.ViewHolder {

    public abstract void onBind(DATA data);

    public ViewHolder(View itemView) {
        super(itemView);
    }
}
