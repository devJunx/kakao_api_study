package com.booksearch

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.booksearch.module.WebviewModule
import com.facebook.react.ReactActivity


class MainActivity : ReactActivity() {
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */

    override fun onCreate(savedInstanceState: Bundle?){
        super.onCreate(savedInstanceState)

    }
    override fun getMainComponentName(): String {
        return "bookSearch"
    }

}