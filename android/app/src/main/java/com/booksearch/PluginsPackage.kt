package com.booksearch


import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.booksearch.module.NetworkModule
import java.util.*

class PluginsPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules: MutableList<NativeModule> = ArrayList()
        modules.run{
            add(NetworkModule(reactContext))
        }
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf()
    }

}