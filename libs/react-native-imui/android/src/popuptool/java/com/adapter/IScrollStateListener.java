package com.adapter;

public interface IScrollStateListener {

    /**
     * move to scrap heap
     */
    public void reclaim();


    /**
     * on idle
     */
    public void onImmutable();
}
