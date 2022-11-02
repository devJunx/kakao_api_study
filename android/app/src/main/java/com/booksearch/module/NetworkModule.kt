package com.booksearch.module

import android.util.Log
import android.widget.Toast
import com.alibaba.fastjson.JSON
import com.facebook.react.bridge.*
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import org.json.*
import java.util.*
import kotlin.collections.HashMap
import com.booksearch.network.Network

class NetworkModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), Network {

    override fun getName(): String {
        return "NetworkModule"
    }

//    private fun Cache.clearMalformedUrls() {
//        // corrupt 된 캐시 삭제하기
//        val urlIterator = urls()
//        while (urlIterator.hasNext()) {
//            if (urlIterator.next().toHttpUrlOrNull() == null) {
//                urlIterator.remove()
//            }
//        }
//    }

    @ReactMethod
    fun onRequest(url: String, root: String, query: String, promise: Promise) {
        try {
            if (query != "") {
                /* Example(url: https://dapi.kakao.com, root: /v3/search/book?, query: 아기공룔둘리)*/
                val requestUrl = url + root + "query=" + query + "&size=10&page=10&target=title"
                val requestBuilder = Request.Builder().url(requestUrl).get()
                requestBuilder.addHeader(
                    "Authorization",
                    "KakaoAK b1f8f739bb057a196a0c20ba4806b15e"
                )
                val request = requestBuilder.build()
                val client = OkHttpClient()

                val response = client
                    .newCall(request)
                    .execute()

                if (response.isSuccessful) {
                    val responseBody = requireNotNull(response.body) //무슨 문제인지
                    val responseText = responseBody.string()
                    val contentType = responseBody.contentType().toString()
//                    println(responseText + "\n" + contentType)
                    if (contentType.indexOf("text") > -1) {
                        val returnValue = WritableNativeArray()
                        val result =
                            responseText.split("\r\n", ignoreCase = true, limit = 3)
                        /* Response result check */
                        if (result.size < 2) {
                            returnValue.pushString(responseText)
                        } else {
                            returnValue.pushString(result[0].lowercase(Locale.getDefault()))
                            returnValue.pushString(result[1].lowercase(Locale.getDefault()))
                            if (result.size > 2) {
                                val itemArr = result[2].split("\r\n")
                                itemArr.forEach { item ->
                                    returnValue.pushString(item) /* String Item Push in Response Return value */
                                }
                            }
                        }
                        promise.resolve(returnValue)
                    } else if (contentType.indexOf("json") > -1) {
                        try {
                            val isJsonObj = JSON.parse(responseText) is JSONObject
                            if(!isJsonObj){
                                promise.resolve(convertJsonToMap(JSONObject(responseText)))
                            }
                        } catch (e: Exception) {
                            e.printStackTrace()
                            promise.reject("test", Throwable(e))
                        }
                    }
                }

            }

        } catch (e: Exception) {
//            println("test: " + url + root + "query=" + query + "&size=1&page=1&target=title")
//            Toast.makeText(this, "테스트", Toast.LENGTH_LONG)
            e.printStackTrace()
            promise.reject(e)
        }
    }


}
