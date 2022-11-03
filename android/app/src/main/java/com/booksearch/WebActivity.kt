package com.booksearch

import android.annotation.SuppressLint
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import com.booksearch.databinding.ActivityWebBinding
import com.facebook.drawee.gestures.GestureDetector
import com.facebook.react.ReactActivity


class WebActivity : ReactActivity() {

    private lateinit var wbBinding: ActivityWebBinding

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        wbBinding = ActivityWebBinding.inflate(layoutInflater)

        setContentView(wbBinding.root)

        val webView = wbBinding.webView
        val getIntent = intent
        val url = getIntent.getStringExtra("url").toString()
        val urlInput = wbBinding.urlInput
        val webViewUrl = webView.url
        webView.webViewClient = WebViewClient()

        urlInput.setText(url)

        wbBinding.urlInput.setOnClickListener {
//            wbBinding.urlInput.selectAll()
        }
        wbBinding.closeButton.setOnClickListener {
            startActivity(intent)
        }

        onWebViewApply(url, webView)

        wbBinding.searchButton.setOnClickListener {
            val urlInputText = urlInput.text
            with(urlInputText) {
                when {
                    contains(".com") ||
                    contains(".co.kr") ||
                    contains(".go.kr") ||
                    contains(".net") ||
                    contains(".org") ||
                    contains(".dev") -> onWebViewApply(urlInput.text.toString(), webView)

                    else -> Toast.makeText(
                                this@WebActivity,
                                "url 형식이 틀렸거나 미지원 도메인이 포함 되었습니다",
                                Toast.LENGTH_SHORT
                            ).show()
                }
            }
        }
        wbBinding.webView.setOnClickListener {
            Toast.makeText(this, "test", Toast.LENGTH_SHORT).show()
            urlInput.setText(webView.url)
        }
        wbBinding.copyThisUrl.setOnClickListener {
            val clipboardManager = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip: ClipData = ClipData.newPlainText("url", webView.url)
            clipboardManager.setPrimaryClip(clip)
            Toast.makeText(this@WebActivity, "보이시는 화면의 URL이 복사가 되었습니다", Toast.LENGTH_SHORT).show()
        }

    }

    private fun onWebViewApply(url: String, webView: WebView) {
        wbBinding.urlInput.setText(url)
        webView.apply {
            @SuppressLint("SetJavaScriptEnabled")
            settings.javaScriptEnabled = true
            settings.useWideViewPort = true
//            settings.loadWithOverviewMode = true
            loadUrl(url)
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