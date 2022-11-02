package com.booksearch

import android.content.Intent
import android.net.Uri
import android.webkit.WebViewClient
import android.os.Bundle
import com.booksearch.databinding.ActivityWebBinding
import com.facebook.react.ReactActivity

class WebActivity : ReactActivity() {

    private lateinit var wbBinding: ActivityWebBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        wbBinding = ActivityWebBinding.inflate(layoutInflater)
        setContentView(wbBinding.root)

        val webView = wbBinding.webView

        webView.webViewClient = WebViewClient()

        val getIntent = getIntent()

        val url = getIntent.getStringExtra("url")

        val intent = Intent(this@WebActivity, MainActivity::class.java)

        wbBinding.closeButton.setOnClickListener {
            startActivity(intent)
        }
//        val uri = Uri.parse(url)
//
//        val test = Intent(Intent.ACTION_VIEW, uri)
//        startActivity(test)
            webView.settings.javaScriptEnabled = true
            webView.loadUrl(url)
    }

    override fun onBackPressed() {
        if (wbBinding.webView.canGoBack()) {
            wbBinding.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}