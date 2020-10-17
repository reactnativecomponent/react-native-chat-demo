package cn.jiguang.imui.utils;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.AudioManager;

import static android.content.Context.SENSOR_SERVICE;

/**
 * Created by dowin on 2017/8/23.
 */

public class SessorUtil implements SensorEventListener {
    private SensorManager sensorManager;
    private Sensor sensor;
    private boolean hasRegister;
    private boolean mIsEarPhoneOn;
    private Context mContext;
    private static SessorUtil instance = null;
    private static OnVolumeListener onVolumeListener = null;

    interface OnVolumeListener {
        void onChanged(int streamType);
    }

    public static SessorUtil getInstance(Context context) {
        if (instance == null) {
            synchronized (SessorUtil.class) {
                if (instance == null) {
                    instance = new SessorUtil(context.getApplicationContext());
                }
            }
        }
        return instance;
    }

    private SessorUtil(Context context) {
        this.mContext = context;
    }

    public float getMaximumRange() {
        return sensor == null ? 0 : sensor.getMaximumRange();
    }

    public void register(boolean register) {

        if (hasRegister && register) {
            return;
        }

        if (sensorManager == null) {
            sensorManager = (SensorManager) mContext.getApplicationContext().getSystemService(SENSOR_SERVICE);
            sensor = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY);
        }
        if (register) {
            sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL);
        } else if (hasRegister && !register) {
            sensorManager.unregisterListener(this, sensor);
        }
        hasRegister = register;

//        FrescUtil.init(mContext);
    }

    public boolean isEarPhoneOn() {
        return mIsEarPhoneOn;
    }

    public void setAudioPlayByEarPhone(int state) {
        AudioManager audioManager = (AudioManager) mContext
                .getSystemService(Context.AUDIO_SERVICE);
        int currVolume;
        int streamType;

        if (state == 0) {
            streamType = AudioManager.STREAM_MUSIC;
            audioManager.setMode(AudioManager.MODE_NORMAL);
            currVolume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
            mIsEarPhoneOn = false;//AudioManager.STREAM_MUSIC
            audioManager.setSpeakerphoneOn(!mIsEarPhoneOn);
            audioManager.setMicrophoneMute(mIsEarPhoneOn);
//            audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, currVolume,
//                    AudioManager.STREAM_MUSIC);
        } else {
            streamType = AudioManager.STREAM_VOICE_CALL;
            audioManager.setMode(AudioManager.MODE_IN_CALL);
            currVolume = audioManager.getStreamVolume(AudioManager.STREAM_VOICE_CALL);
            mIsEarPhoneOn = true;//AudioManager.STREAM_VOICE_CALL
            audioManager.setSpeakerphoneOn(!mIsEarPhoneOn);
            audioManager.setMicrophoneMute(mIsEarPhoneOn);
//            audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL, currVolume,
//                    AudioManager.STREAM_VOICE_CALL);
        }
        if (onVolumeListener != null) {
            onVolumeListener.onChanged(streamType);
        }
    }

    public static void setOnVolumeListener(OnVolumeListener onVolumeListener) {
        SessorUtil.onVolumeListener = onVolumeListener;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        float value = event.values[0];

        if (value == getMaximumRange()) {
            setAudioPlayByEarPhone(0);
        } else {
            setAudioPlayByEarPhone(1);
        }
    }


    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }
}
