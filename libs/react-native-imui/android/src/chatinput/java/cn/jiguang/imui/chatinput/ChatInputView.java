package cn.jiguang.imui.chatinput;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Context;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.SystemClock;
import android.text.Editable;
import android.text.Spannable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.lang.reflect.Field;

import androidx.legacy.widget.Space;
import cn.jiguang.imui.chatinput.listener.OnClickEditTextListener;
import cn.jiguang.imui.chatinput.listener.OnMenuClickListener;
import cn.jiguang.imui.chatinput.listener.RecordVoiceListener;
import cn.jiguang.imui.chatinput.record.OnChatVoiceTouch;
import cn.jiguang.imui.chatinput.utils.StringUtil;
import cn.jiguang.imui.messagelist.R;
import dowin.com.emoji.emoji.EmoticonPickerView;
import dowin.com.emoji.emoji.IEmoticonSelectedListener;
import dowin.com.emoji.emoji.MoonUtil;

/**
 * Created by dowin on 2017/8/25.
 */

public class ChatInputView extends LinearLayout {

    public static final String TAG = "ChatInputView";
    public static final byte KEYBOARD_STATE_SHOW = -3;
    public static final byte KEYBOARD_STATE_HIDE = -2;
    public static final byte KEYBOARD_STATE_INIT = -1;

    private TextView mReceiveCount;
    private EditText mChatInput;
    private Button mChatVoice;
    private OnChatVoiceTouch onChatVoiceTouch;

    private CharSequence mInput;
    private Space mInputMarginLeft;
    private Space mInputMarginRight;

    private ImageButton mVoiceBtn;
    private ImageButton mEmojiBtn;
    private ImageButton mSendBtn;
    private View mSendLayout;
    private View mActionLayout;

    private LinearLayout mChatInputContainer;
    private FrameLayout mMenuContainer;

    private EmoticonPickerView emoticonPickerView;
    private LinearLayout actionLayout;

    private OnMenuClickListener mListener;
    private OnClickEditTextListener mEditTextListener;

    private ChatInputStyle mStyle;

    private InputMethodManager inputMethodManager;
    private Window mWindow;
    private int mLastClickId = 0;

    private int mWidth;
    private int mHeight;
    private float density;
    private float scaleDensity;
    public static int sMenuHeight = 666;

    private boolean mShowSoftInput = false;
    private boolean isKeyboardShowed = false;

    private int inputHeight = 0;
    private int showType = 0;

    private Context mContext;

    public ChatInputView(Context context) {
        super(context);
        init(context);
    }

    public ChatInputView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context, attrs);
    }

    public ChatInputView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    private void init(Context context) {
        mContext = context;


        setOrientation(VERTICAL);
        inflate(context, R.layout.view_chatinput, this);

        // menu buttons
        mChatInput = (EditText) findViewById(R.id.imui_chat_input);
        mChatVoice = (Button) findViewById(R.id.imui_chat_voice);
        mVoiceBtn = (ImageButton) findViewById(R.id.imui_item_voice);
        mEmojiBtn = (ImageButton) findViewById(R.id.imui_item_emoji);
        mSendBtn = (ImageButton) findViewById(R.id.imui_item_send);

        View voiceBtnContainer = findViewById(R.id.imui_layout_voice);
        View emojiBtnContainer = findViewById(R.id.imui_layout_emoji);
        mSendLayout = findViewById(R.id.imui_layout_send);
        mActionLayout = findViewById(R.id.imui_layout_action);
        voiceBtnContainer.setOnClickListener(onMenuItemClickListener);
        emojiBtnContainer.setOnClickListener(onMenuItemClickListener);
        mSendLayout.setOnClickListener(onMenuItemClickListener);
        mActionLayout.setOnClickListener(onMenuItemClickListener);

        mReceiveCount = (TextView) findViewById(R.id.imui_receive_count);
        mInputMarginLeft = (Space) findViewById(R.id.aurora_input_margin_left);
        mInputMarginRight = (Space) findViewById(R.id.aurora_input_margin_right);
        mChatInputContainer = (LinearLayout) findViewById(R.id.aurora_ll_input_container);
        mMenuContainer = (FrameLayout) findViewById(R.id.aurora_fl_menu_container);

        emoticonPickerView = (EmoticonPickerView) findViewById(R.id.emoticon_picker_view);
        emoticonPickerView.setWithSticker(true);
        actionLayout = (LinearLayout) findViewById(R.id.aurora_view_action_layout);

        mMenuContainer.setVisibility(GONE);
        actionLayout.setVisibility(GONE);
        mChatVoice.setVisibility(INVISIBLE);

        mChatInput.addTextChangedListener(textWatcher);

        onChatVoiceTouch = new OnChatVoiceTouch(context, mChatVoice);
        mChatVoice.setOnTouchListener(onChatVoiceTouch);

        inputMethodManager = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        mWindow = ((Activity) context).getWindow();
        DisplayMetrics dm = getResources().getDisplayMetrics();
        mWidth = dm.widthPixels;
        mHeight = dm.heightPixels;
        density = dm.density;
        scaleDensity = dm.scaledDensity;

        mChatInput.setOnTouchListener(inputTouchListener);

        initKeyboard();
    }

    private void init(Context context, AttributeSet attrs) {
        init(context);
        mStyle = ChatInputStyle.parse(context, attrs);

//        mChatInput.setMaxLines(mStyle.getInputMaxLines());
//        mChatInput.setHint(mStyle.getInputHint());
//        mChatInput.setText(mStyle.getInputText());
//        mChatInput.setTextSize(TypedValue.COMPLEX_UNIT_PX, mStyle.getInputTextSize());
//        mChatInput.setTextColor(mStyle.getInputTextColor());
//        mChatInput.setHintTextColor(mStyle.getInputHintColor());
//        mChatInput.setBackgroundResource(mStyle.getInputEditTextBg());
//        mInputMarginLeft.getLayoutParams().width = mStyle.getInputMarginLeft();
//        mInputMarginRight.getLayoutParams().width = mStyle.getInputMarginRight();
//        mVoiceBtn.setImageResource(mStyle.getVoiceBtnIcon());
//        mVoiceBtn.setBackground(mStyle.getVoiceBtnBg());
//        mEmojiBtn.setBackground(mStyle.getPhotoBtnBg());
//        mEmojiBtn.setImageResource(mStyle.getPhotoBtnIcon());
//        mSendBtn.setBackground(mStyle.getSendBtnBg());
//        mSendBtn.setImageResource(mStyle.getSendBtnIcon());
    }
    public void resetVoice() {
        onChatVoiceTouch.reset();
    }
    public void addActionView(View view, int index) {
        actionLayout.addView(view, index);
    }


    public void appendReplace(String key, String name) {

        key += " ";
        name += " ";
        // insert account
        int start = mChatInput.getSelectionStart();
        if (start < 0 || start >= mChatInput.length()) {
            mChatInput.append(name);
        } else {
            mChatInput.getEditableText().insert(start, name);// 光标所在位置插入文字
        }

        // 替换成昵称
        Editable editable = mChatInput.getText();
        name = "@" + name;

        int length = name.length();
        // 不是输入的@，而是插进来的
//        if (!force) {
        start--;
//        length++;
//        }

        editable.setSpan(TeamMemberAitHelper.getInputAitSpan(mContext, name, mChatInput.getTextSize(), mChatInput.getMeasuredWidth()),
                start, start + length, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    @Override
    protected void onDetachedFromWindow() {
        if (mWindow != null) {
            getViewTreeObserver().removeOnGlobalLayoutListener(onGlobalLayoutListener);
            mWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN
                    | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        }
        hideInputMethod();
        super.onDetachedFromWindow();


    }

    @Override
    public void onWindowVisibilityChanged(int visibility) {
        super.onWindowVisibilityChanged(visibility);
    }

    /**********************************************************************************************************/

    private OnTouchListener inputTouchListener = new OnTouchListener() {
        @Override
        public boolean onTouch(View view, MotionEvent motionEvent) {

            if (motionEvent.getAction() == MotionEvent.ACTION_DOWN && !mShowSoftInput) {
                mShowSoftInput = true;
                invisibleMenuLayout();
                showType = 0;
                if (mListener != null) {
                    mListener.onFeatureView(inputHeight, showType);
                }
                mChatInput.requestFocus();
            }
            return false;
        }
    };
    private View.OnClickListener onMenuItemClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {

            if (view.getId() == R.id.imui_layout_send) {
                if (onSubmit()) {
                    mChatInput.setText("");
                }
                changeSendToAction(true);

            } else if (view.getId() == R.id.imui_layout_voice) {
                switchVoiceOrInput();

                showType = 0;
                if (mListener != null) {
                    mListener.onFeatureView(inputHeight, showType);
                }
            } else {
                if (mMenuContainer.getVisibility() != VISIBLE) {
                    dismissSoftInputAndShowMenu();
                } else if (view.getId() == mLastClickId) {
                    dismissMenuAndResetSoftMode();
                    showType = -1;
                    if (mListener != null) {
                        mListener.onFeatureView(inputHeight, showType);
                    }
                    return;
                }

                if (view.getId() == R.id.imui_layout_action) {


                    changeVoiceToInput(true);
                    actionLayout.setVisibility(VISIBLE);
                    emoticonPickerView.setVisibility(INVISIBLE);
                    if (showType == 1) {
                        mEmojiBtn.setImageResource(R.drawable.nim_message_button_bottom_emoji_selector);
                    }
                    showType = 2;

                } else if (view.getId() == R.id.imui_layout_emoji) {

                    showType = 1;
                    changeVoiceToInput(true);
                    emoticonPickerView.setVisibility(VISIBLE);
                    mEmojiBtn.setImageResource(R.drawable.nim_message_button_bottom_text_selector);
                    emoticonPickerView.show(emoticonSelectedListener);
                    actionLayout.setVisibility(INVISIBLE);
                }

                if (mListener != null) {
                    postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            mListener.onFeatureView(inputHeight, showType);
                        }
                    }, 100);

                }
                mLastClickId = view.getId();
//                mMenuContainer.requestLayout();
            }
//            Log.w(TAG, "viewId: " + view.getId() + "-showType:" + showType);
        }
    };
    private IEmoticonSelectedListener emoticonSelectedListener = new IEmoticonSelectedListener() {

        /**
         * *************** IEmojiSelectedListener ***************
         */
        @Override
        public void onEmojiSelected(String key) {
            Editable mEditable = mChatInput.getText();
            if (key.equals("/DEL")) {
                mChatInput.dispatchKeyEvent(new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_DEL));
            } else {
                int start = mChatInput.getSelectionStart();
                int end = mChatInput.getSelectionEnd();
                start = (start < 0 ? 0 : start);
                end = (start < 0 ? 0 : end);
                mEditable.replace(start, end, key);
            }
        }

        @Override
        public void onStickerSelected(String category, String item) {
            Log.i("InputPanel", "onStickerSelected, category =" + category + ", sticker =" + item);
        }
    };

    private TextWatcher textWatcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence charSequence, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            mInput = s;
            this.start = start;
            this.count = count;

            if (mEditTextListener != null && count > 0) {

                final int startIndex = start <= 0 ? 0 : start;
                int endIndex = startIndex + count;
                endIndex = endIndex > s.length() ? s.length() : endIndex;
                mEditTextListener.onTextChanged(s.subSequence(startIndex, endIndex).toString());
            }
            if (s.length() >= 1 && start == 0 && before == 0) { // Starting input
                changeSendToAction(false);
            } else if (s.length() == 0 && before >= 1) { // Clear content
                changeSendToAction(true);
            }
        }

        private int start;
        private int count;

        @Override
        public void afterTextChanged(Editable s) {

            MoonUtil.replaceEmoticons(getContext(), s, start, count);

            int editEnd = mChatInput.getSelectionEnd();
            mChatInput.removeTextChangedListener(this);
            while (StringUtil.counterChars(s.toString()) > 5000 && editEnd > 0) {
                s.delete(editEnd - 1, editEnd);
                editEnd--;
            }
            mChatInput.setSelection(editEnd);
            mChatInput.addTextChangedListener(this);
        }
    };

    private boolean onSubmit() {
        return mListener != null && mListener.onSendTextMessage(mInput);
    }

    void changeSendToAction(boolean action) {
        mSendLayout.setVisibility(action ? INVISIBLE : VISIBLE);
        mActionLayout.setVisibility(action ? VISIBLE : INVISIBLE);

    }

    void changeVoiceToInput(boolean input) {
        mChatInput.setVisibility(input ? VISIBLE : INVISIBLE);
        mChatVoice.setVisibility(input ? INVISIBLE : VISIBLE);
        mVoiceBtn.setImageResource(input ? R.drawable.nim_message_button_bottom_audio_selector : R.drawable.nim_message_button_bottom_text_selector);
    }

    void switchVoiceOrInput() {
        boolean empty = TextUtils.isEmpty(mInput);
        if (mChatInput.getVisibility() == VISIBLE) {
            changeVoiceToInput(false);
            if (!empty) {
                changeSendToAction(true);
            }

            hideInputMethod();

        } else {
            changeVoiceToInput(true);
            if (!empty) {
                changeSendToAction(false);
            }
            showInputMethod();
        }
        dismissMenuLayout(100);
    }

    private void hideInputMethod() {
        isKeyboardShowed = false;
//        uiHandler.removeCallbacks(showTextRunnable);
        inputMethodManager.hideSoftInputFromWindow(mChatInput.getWindowToken(), 0);
        mChatInput.clearFocus();
    }

    // 显示键盘布局
    private void showInputMethod() {
        mChatInput.requestFocus();
        //如果已经显示,则继续操作时不需要把光标定位到最后
        if (!isKeyboardShowed) {
            mChatInput.setSelection(mChatInput.getText().length());
            isKeyboardShowed = true;
        }
        inputMethodManager.showSoftInput(mChatInput, 0);
    }

    public void setSoftInput(boolean resize) {
        mWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN
                | (resize ? WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE : WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN));
    }

    public void dismissMenuAndResetSoftMode() {
        mWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN
                | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
//        try {
//            Thread.sleep(140);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

        dismissMenuLayout(1);
        showInputMethod();

        mChatInput.requestFocus();
    }

    public void dismissSoftInputAndShowMenu() {
        mWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN
                | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
//        try {
//            Thread.sleep(140);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

        hideInputMethod();
        showMenuLayout();
        setMenuContainerHeight(sMenuHeight);

        mShowSoftInput = false;
    }

    public void dismissMenuLayout(int t) {
        postDelayed(new Runnable() {
            @Override
            public void run() {
                mMenuContainer.setVisibility(INVISIBLE);
            }
        }, t);

        if (showType == 1) {
            showType = 0;
            mEmojiBtn.setImageResource(R.drawable.nim_message_button_bottom_emoji_selector);
        }
    }

    public void invisibleMenuLayout() {
        mMenuContainer.setVisibility(INVISIBLE);
    }

    public void showMenuLayout() {
        mMenuContainer.setVisibility(VISIBLE);
    }
    /**********************************************************************************************************/

    /**
     * Set menu container's height, invoke this method once the menu was initialized.
     *
     * @param height Height of menu, set same height as soft keyboard so that display to perfection.
     */
    public void setMenuContainerHeight(int height) {
        if (height > 0) {
            sMenuHeight = height;
            mMenuContainer.setLayoutParams(
                    new LinearLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, dip2px(height)));
        }
    }

    private void setCursor(Drawable drawable) {
        try {
            Field f = TextView.class.getDeclaredField("mCursorDrawableRes");
            f.setAccessible(true);
            f.set(mChatInput, drawable);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setRecordVoiceListener(RecordVoiceListener listener) {
        onChatVoiceTouch.setListener(listener);
    }

    public void setMenuClickListener(OnMenuClickListener listener) {
        mListener = listener;
    }

    public void setOnClickEditTextListener(OnClickEditTextListener listener) {
        mEditTextListener = listener;
    }


    public EditText getInputView() {
        return mChatInput;
    }

    public boolean getSoftInputState() {
        return mShowSoftInput;
    }

    public void setSoftInputState(boolean state) {
        mShowSoftInput = state;
    }

    public int getMenuState() {
        return mMenuContainer.getVisibility();
    }

    /**
     * Trigger aurora_menuitem_send button animation
     *
     * @param sendBtn    aurora_menuitem_send button
     * @param hasContent EditText has content or photos have been selected
     */
    private void triggerSendButtonAnimation(final ImageButton sendBtn, final boolean hasContent) {
        float[] shrinkValues = new float[]{0.6f};
        AnimatorSet shrinkAnimatorSet = new AnimatorSet();
        shrinkAnimatorSet.playTogether(ObjectAnimator.ofFloat(sendBtn, "scaleX", shrinkValues),
                ObjectAnimator.ofFloat(sendBtn, "scaleY", shrinkValues));
        shrinkAnimatorSet.setDuration(100);

        float[] restoreValues = new float[]{1.0f};
        final AnimatorSet restoreAnimatorSet = new AnimatorSet();
        restoreAnimatorSet.playTogether(ObjectAnimator.ofFloat(sendBtn, "scaleX", restoreValues),
                ObjectAnimator.ofFloat(sendBtn, "scaleY", restoreValues));
        restoreAnimatorSet.setDuration(100);

        restoreAnimatorSet.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {

            }

            @Override
            public void onAnimationEnd(Animator animator) {
                mReceiveCount.bringToFront();
                if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {
                    requestLayout();
                    invalidate();
                }
                if (hasContent) {
//                    mReceiveCount.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onAnimationCancel(Animator animator) {

            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });

        shrinkAnimatorSet.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {
                if (!hasContent) {
//                    mReceiveCount.setVisibility(View.INVISIBLE);
                }
            }

            @Override
            public void onAnimationEnd(Animator animator) {

                restoreAnimatorSet.start();
            }

            @Override
            public void onAnimationCancel(Animator animator) {

            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });

        shrinkAnimatorSet.start();
    }

    private ViewTreeObserver.OnGlobalLayoutListener onGlobalLayoutListener = new ViewTreeObserver.OnGlobalLayoutListener() {

        @Override
        public void onGlobalLayout() {
            Rect r = new Rect();
            mWindow.getDecorView().getWindowVisibleDisplayFrame(r);
            int screenHeight = mWindow.getDecorView().getRootView().getHeight();
            int height = screenHeight - r.bottom + mChatInputContainer.getHeight();
//            Log.d(TAG, "Keyboard Size: " + px2dip(height) + "-showType:" + showType);
            if (inputHeight == height) {
                return;
            }
            if (inputHeight > height) {

            } else {

            }
            inputHeight = height;
            if (mListener != null) {
                mListener.onShowKeyboard(px2dip(inputHeight), showType);
            }
        }

    };

    public int dip2px(float dipValue) {
        return (int) (dipValue * density + 0.5f);
    }

    public int px2dip(float pxValue) {
        return (int) (pxValue / density + 0.5f);
    }

    public int sp2px(float spValue) {
        return (int) (spValue * scaleDensity + 0.5f);
    }


    void initKeyboard() {
        getViewTreeObserver().addOnGlobalLayoutListener(onGlobalLayoutListener);
    }

    private long convertStrTimeToLong(String strTime) {
        String[] timeArray = strTime.split(":");
        long longTime = 0;
        if (timeArray.length == 2) { // If time format is MM:SS
            longTime = Integer.parseInt(timeArray[0]) * 60 * 1000 + Integer.parseInt(timeArray[1]) * 1000;
        }
        return SystemClock.elapsedRealtime() - longTime;
    }


}