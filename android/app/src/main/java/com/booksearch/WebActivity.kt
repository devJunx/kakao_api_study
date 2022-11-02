package com.booksearch

import android.net.Uri
import android.webkit.WebViewClient
import android.os.Bundle
import android.util.Log
import com.booksearch.databinding.ActivityWebBinding
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.ReactMethod

class WebActivity : ReactActivity() {

    private lateinit var wbBinding: ActivityWebBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        wbBinding = ActivityWebBinding.inflate(layoutInflater)
        setContentView(wbBinding.root)

        val webView = wbBinding.webView

        webView.webViewClient = WebViewClient()

        val intent = getIntent()

        val url = intent.getStringExtra("url")
        Uri.parse(url)
//        webView.loadUrl(url)
    }

    override fun onBackPressed() {
        if (wbBinding.webView.canGoBack()) {
            wbBinding.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}