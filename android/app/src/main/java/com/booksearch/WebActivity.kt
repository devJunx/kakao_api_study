package com.booksearch

import android.annotation.SuppressLint
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.webkit.WebViewClient
import android.widget.Toast
import com.booksearch.databinding.ActivityWebBinding
import com.facebook.react.ReactActivity

class WebActivity : ReactActivity() {

    private lateinit var wbBinding: ActivityWebBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        wbBinding = ActivityWebBinding.inflate(layoutInflater)
        setContentView(wbBinding.root)

        val url = intent.getStringExtra("url").toString()
        val webView = wbBinding.webView

        webView.webViewClient = WebViewClient()

        /* url input text select all */
        wbBinding.urlInput.setOnClickListener {
            wbBinding.urlInput.selectAll()
        }

        /* webView close */
        wbBinding.closeButton.setOnClickListener {
            finish()
        }

        /* share url when you click the share button */
        wbBinding.shareButton.setOnClickListener {
            onShare(webView.url.toString())
        }

        onWebViewApply(url)

        /* search url when you click the search button */
        wbBinding.searchButton.setOnClickListener {
            onSearch(wbBinding.urlInput.text.toString())
        }

        /* copy url when you click the search button */
        wbBinding.copyButton.setOnClickListener {
            onCopy(webView.url.toString())
        }

        /* webView go forward */
        wbBinding.forwardButton.setOnClickListener {
            if (webView.canGoForward()) {
                webView.goForward()
                wbBinding.urlInput.setText(webView.originalUrl)
            }
        }

        /* webView go back*/
        wbBinding.backButton.setOnClickListener {
            if (webView.canGoBack()) {
                webView.goBack()
                wbBinding.urlInput.setText(webView.originalUrl)
            }
        }


        /* webView reload */
        wbBinding.refreshButton.setOnClickListener {
            wbBinding.webView.reload()
        }
    }

    /* webView load new url */
    private fun onSearch(urlInputText: String) {
        onWebViewApply(urlInputText)
//        with(urlInputText) {
//            when {
//                contains(".com") || contains(".co.kr") || contains(".go.kr") ||
//                contains(".net") || contains(".org") || contains(".dev") || contains(".wiki") -> onWebViewApply(urlInputText)
//                else -> Toast.makeText(this@WebActivity, "url 형식이 틀렸거나 미지원 도메인이 포함되었습니다", android.widget.Toast.LENGTH_SHORT).show()
//            }
//        }
    }

    /* current webView url doing copy */
    private fun onCopy(copyText: String) {
        val clipboardManager = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip: ClipData = ClipData.newPlainText("copyText", copyText)
        if (clipboardManager.primaryClip.toString().contains(copyText)) {
            Toast.makeText(this@WebActivity, "이미 클립보드에 복사되었습니다.", Toast.LENGTH_SHORT).show()
        } else {
            clipboardManager.setPrimaryClip(clip)
            Toast.makeText(this@WebActivity, "클립보드에 복사되었습니다", Toast.LENGTH_SHORT).show()
        }
    }

    /* share the current webView url */
    private fun onShare(shareText: String) {
        val intent = Intent()
        intent.action = Intent.ACTION_SEND
        intent.type = "text/plain"
        intent.putExtra(Intent.EXTRA_TEXT, shareText)
        intent.putExtra(Intent.EXTRA_TITLE, "URL 공유")
        startActivity(Intent.createChooser(intent, null))
    }

    /* webView load intent data url */
    private fun onWebViewApply(url: String) {
        wbBinding.urlInput.setText(url)
        wbBinding.webView.apply {
            @SuppressLint("SetJavaScriptEnabled")
            settings.javaScriptEnabled = true
            settings.loadWithOverviewMode = true
            loadUrl(url)
        }
    }

    /* use will back button in webView will transaction */
    override fun onBackPressed() {
        if (wbBinding.webView.canGoBack()) {
            wbBinding.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}