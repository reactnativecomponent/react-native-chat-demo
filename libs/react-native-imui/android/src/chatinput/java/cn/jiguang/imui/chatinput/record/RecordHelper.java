package cn.jiguang.imui.chatinput.record;

import android.content.Context;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import cn.jiguang.imui.chatinput.listener.RecordVoiceListener;
import cn.jiguang.imui.messagelist.R;

/**
 * Created by dowin on 2017/8/22.
 */

public class RecordHelper {

    private static final int MIN_INTERVAL_TIME = 3000;// 1s

    private static final int MAX_INTERVAL_TIME = 60;// 1s

    private MediaRecorder recorder;
    private RecordVoiceListener mListener;
    private File recorderDir;
    private File currentAudioFile;

    private long startTime;
    private Timer timer;

    private int mDuration;
    private long intervalTime;
    private int db;
    private boolean isTimerCanceled = true;
    private boolean cancelAble = false;
    private boolean isFinish = false;

    private Context mContext;

    public RecordHelper(Context mContext) {
        this.mContext = mContext;
    }

    public void startRecording() {
        createTimer();
        isFinish = false;
        try {
            if (mListener != null) {
                mListener.onStartRecord();
            }
            recorder = new MediaRecorder();
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            recorder.setMaxDuration(MAX_INTERVAL_TIME * 1000);
            recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
//            recorder.setAudioEncodingBitRate();
//            recorder.setAudioSamplingRate();
            recorder.setOutputFile(makeAudioFile());
            recorder.prepare();
            recorder.setOnErrorListener(new MediaRecorder.OnErrorListener() {
                @Override
                public void onError(MediaRecorder mediaRecorder, int i, int i2) {
                    cancelRecord();
                    Log.i("RecordVoiceController", "recorder prepare failed!");
                }
            });
            recorder.start();
            startTime = System.currentTimeMillis();
        } catch (Exception e) {
//            IOException e
//            RuntimeException e
            e.printStackTrace();
            if (e instanceof RuntimeException) {
                Toast.makeText(mContext, mContext.getString(R.string.record_voice_permission_denied), Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(mContext, mContext.getString(R.string.illegal_state_toast), Toast.LENGTH_SHORT).show();
            }
//
//            cancelTimer();
            cancelRecord();
//            dismissDialog();
            if (currentAudioFile != null) {
                currentAudioFile.delete();
            }
            if(recorder!=null) {
                recorder.release();
                recorder = null;
            }
        }

    }

    //停止录音，隐藏录音动画
    public void stopRecording() {
        releaseRecorder();
    }


    //取消录音，清除计时
    public void cancelRecord() {
        cancelTimer();
        stopRecording();
        if (currentAudioFile != null) {
            currentAudioFile.delete();
        }

        if (mListener != null) {
            mListener.onCancelRecord();
        }
    }

    //录音完毕
    public void finishRecord(boolean isTooLong) {
        if (isFinish) {
            return;
        }
        cancelTimer();
        stopRecording();
        isFinish = true;
        intervalTime = System.currentTimeMillis() - startTime;
        if (intervalTime < MIN_INTERVAL_TIME) {
//            Toast.makeText(mContext, mContext.getString(R.string.time_too_short_toast), Toast.LENGTH_SHORT).show();
            if (null != mListener) {
                mListener.onFinishRecord(null, isTooLong, (int) (intervalTime / 1000));
            }
            currentAudioFile.delete();
        } else {
            if (currentAudioFile != null && currentAudioFile.exists()) {
                MediaPlayer mp = new MediaPlayer();
                try {
                    FileInputStream fis = new FileInputStream(currentAudioFile);
                    mp.setDataSource(fis.getFD());
                    mp.prepare();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                //某些手机会限制录音，如果用户拒接使用录音，则需判断mp是否存在
                if (mp != null) {
                    mDuration = mp.getDuration();//即为时长 是s
                    if (mDuration < 1) {
                        mDuration = 1;
                    }
                    // TODO finish callback here
                    if (null != mListener) {
                        mListener.onFinishRecord(getCurrentAudioFile(), isTooLong, mDuration);
                    }
                } else {
                    Toast.makeText(mContext, mContext.getString(R.string.record_voice_permission_request),
                            Toast.LENGTH_SHORT).show();
                }
            }
        }
    }

    public void releaseRecorder() {
        if (recorder != null) {
            try {
                recorder.stop();
            } catch (Exception e) {
                Log.d("RecordVoice", "Catch exception: stop recorder failed!");
            } finally {
                recorder.release();
                recorder = null;
            }
        }
    }

    public int getAmplitude() {
        if (recorder == null) {
            return 0;
        }
        try {
            int db = recorder.getMaxAmplitude() / 1;
            if (db > 1) {
//                int f = (int) (10 * Math.log(x) / Math.log(10));
                db = (int) (20 * Math.log10(db));
                return db;
            }
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public void setRecorderDir(File dir) {
        this.recorderDir = dir;
    }

    public File getRecorderDir() {
        if (recorderDir == null) {
            recorderDir = new File(Environment.getExternalStorageDirectory(), mContext.getPackageName() + "/nim/audio/");
        }
        if (!recorderDir.exists()) {
            recorderDir.mkdirs();
        }
        return recorderDir;
    }

    private String makeAudioFile() {
        currentAudioFile = new File(getRecorderDir(), System.currentTimeMillis() + "");
        try {
            currentAudioFile.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return currentAudioFile.getAbsolutePath();
    }

    public String getCurrentAudioFile() {
        return currentAudioFile == null ? null : currentAudioFile.getAbsolutePath();
    }

    public boolean isFinish() {
        return isFinish;
    }

    private void cancelTimer() {
        if (timer != null) {
            timer.cancel();
            timer.purge();
            isTimerCanceled = true;
        }
    }

    private void createTimer() {
        if (isTimerCanceled) {
            timer = new Timer();
            isTimerCanceled = false;
        }
        timer.schedule(new TimerTask() {
            @Override
            public void run() {

                db = getAmplitude();
                intervalTime = (int) ((System.currentTimeMillis() - startTime) / 1000L);

                Message msg = Message.obtain(mTimerHandler, START_RECORD);
                msg.sendToTarget();
            }
        }, 500, 500);
    }

    final static int START_RECORD = 1;
    private Handler mTimerHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case START_RECORD:

                    Log.w(getClass().getName(), cancelAble + "" + db + "" + intervalTime);
                    if (intervalTime >= MAX_INTERVAL_TIME) {
                        finishRecord(true);
                    } else {
                        if (mListener != null) {
                            mListener.onRecording(cancelAble, db, MAX_INTERVAL_TIME - (int) intervalTime);
                        }
                    }
                    break;
            }
        }
    };

    public void setCancelAble(boolean cancelAble) {
        this.cancelAble = cancelAble;
    }

    public void setListener(RecordVoiceListener mListener) {
        this.mListener = mListener;
    }


}
