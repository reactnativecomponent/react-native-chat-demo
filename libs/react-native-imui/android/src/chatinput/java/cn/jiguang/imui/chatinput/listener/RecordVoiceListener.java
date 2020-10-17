package cn.jiguang.imui.chatinput.listener;


/**
 * Callback will invoked when record voice is finished
 */
public interface RecordVoiceListener {

    /**
     * Fires when started recording.
     */
    void onStartRecord();

    /**
     * Fires when finished recording.
     *
     * @param voiceFile The audio file.
     * @param duration  The duration of audio file, specified in seconds.
     */
    void onFinishRecord(String voiceFile,boolean isTooLong, int duration);

    /**
     * Fires when canceled recording, will delete the audio file.
     */
    void onCancelRecord();

    void onRecording(boolean cancelAble, int dbSize, int time);
}