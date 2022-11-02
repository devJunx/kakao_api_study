package com.booksearch.module

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.util.Log
import com.booksearch.WebActivity
import com.booksearch.databinding.ActivityWebBinding
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WebviewModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private lateinit var wbBinding: ActivityWebBinding

    override fun getName(): String {
        return "webView"
    }

    private val reactContext = reactContext

    @ReactMethod
    fun onCreateWebView(url: String, isWebView: Boolean, promise: Promise) {

        try{
            val intent = Intent(reactApplicationContext, WebActivity::class.java)
            if(isWebView){
                promise.resolve("view Test")
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                intent.putExtra("url", url)
                this.reactContext.startActivity(intent)
            }
        } catch (e: Exception){
            e.printStackTrace()
            promise.reject(e)
        }
    }
}