package com.booksearch.module

import android.content.Intent
import com.booksearch.WebActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WebViewModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WebViewModule"
    }

    @ReactMethod
    fun onCreateWebView(url: String, isWebView: Boolean, promise: Promise) {

        try{
            val intent = Intent(reactContext, WebActivity::class.java)
            if(isWebView){
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                intent.putExtra("url", url)
                reactContext.startActivity(intent)
            }
        } catch (e: Exception){
            e.printStackTrace()
            promise.reject(e)
        }
    }
}