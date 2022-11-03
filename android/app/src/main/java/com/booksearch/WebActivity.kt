package com.booksearch

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.webkit.WebViewClient
import android.os.Bundle
import android.widget.Toast
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
        webView.apply {
            settings.javaScriptEnabled = true
            settings.setSupportZoom(true)
            loadUrl(url)
        }

        wbBinding.copyThisUrl.setOnClickListener {
            val clipboardManager = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip: ClipData = ClipData.newPlainText("url", webView.url)
            clipboardManager.setPrimaryClip(clip)
            Toast.makeText(this@WebActivity, "보이시는 화면의 URL이 복사가 되었습니다", Toast.LENGTH_SHORT).show()
        }

    }

    override fun onBackPressed() {
        if (wbBinding.webView.canGoBack()) {
            wbBinding.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}