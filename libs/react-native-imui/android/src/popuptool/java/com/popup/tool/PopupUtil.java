package com.popup.tool;

import android.app.AlertDialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.TextView;

import java.util.List;

import cn.jiguang.imui.messagelist.R;

/**
 * Created by dowin on 2017/7/12.
 */

public class PopupUtil {

    public static void show(View anchor, Context context) {
        View view = LayoutInflater.from(context).inflate(R.layout.layout, null);
        final PopupWindow popupWindow = new PopupWindow(view, WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT);

        view.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        popupWindow.setFocusable(true);
        popupWindow.setOutsideTouchable(true);
        int[] location = new int[2];
        anchor.getLocationOnScreen(location);
        popupWindow.showAtLocation(view, Gravity.NO_GRAVITY, location[0] + (anchor.getWidth() - view.getMeasuredWidth()) / 2, location[1] - view.getMeasuredHeight());
    }

    public static void showDialog(Context context, String title, final List<String> action, final AdapterView.OnItemClickListener itemClickListener) {
        final AlertDialog dialog = new AlertDialog.Builder(context).create();
        View view = LayoutInflater.from(context).inflate(R.layout.menu, null);

        int length = 0;
        if (action != null && action.size() > 0) {
            length = action.size();
            ListView listView = (ListView) view.findViewById(R.id.list_view);

            ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(context, android.R.layout.simple_list_item_1, action);
            listView.setAdapter(arrayAdapter);
            listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    dialog.dismiss();
                    if (itemClickListener != null) {
                        itemClickListener.onItemClick(parent, view, position, id);
                    }
                }
            });
        }
        final Button btn = (Button) view.findViewById(R.id.cancel);
        final int finalLength = length;
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        dialog.setView(view);
        dialog.show();
        int width = dialog.getWindow().getWindowManager().getDefaultDisplay().getWidth();
        WindowManager.LayoutParams params = dialog.getWindow().getAttributes();
        params.width = width;
        params.x = 0;
        params.y = 0;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        params.gravity = Gravity.LEFT | Gravity.BOTTOM;
        dialog.getWindow().setAttributes(params);
    }

    public static void showAction(Context context, View top, String title, final List<String> action, final AdapterView.OnItemClickListener itemClickListener) {
        View view = LayoutInflater.from(context).inflate(R.layout.action, null);
        final PopupWindow popupWindow = new PopupWindow(view, WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        TextView textView = (TextView) view.findViewById(R.id.title);
        if (TextUtils.isEmpty(title)) {
            textView.setVisibility(View.GONE);
        } else {

            textView.setText(title);
        }
        int length = 0;
        if (action != null && action.size() > 0) {
            length = action.size();
            ListView listView = (ListView) view.findViewById(R.id.list_view);

            ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(context, android.R.layout.simple_list_item_1, action);
            listView.setAdapter(arrayAdapter);
            listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    popupWindow.dismiss();
                    if (itemClickListener != null) {
                        itemClickListener.onItemClick(parent, view, position, id);
                    }
                }
            });
        }
        final Button btn = (Button) view.findViewById(R.id.cancel);
        final int finalLength = length;
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                popupWindow.dismiss();
            }
        });

        ColorDrawable drawable = new ColorDrawable(Color.parseColor("#00000000"));
        popupWindow.setBackgroundDrawable(drawable);
        popupWindow.setFocusable(true);
        popupWindow.setOutsideTouchable(true);
        popupWindow.showAtLocation(top, Gravity.BOTTOM, 0, 0);
    }
}
