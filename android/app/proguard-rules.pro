# Add any custom ProGuard rules here

# Keep classes needed by React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.common.** { *; }
-keepclassmembers class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager { *; }

# Keep classes needed by OkHttp (used for network requests in React Native)
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }

# Prevent obfuscating some Android SDK classes
-keep class android.support.v4.** { *; }
-dontwarn android.support.v4.**

# Keep exceptions that might be thrown by the app
-keep class com.facebook.react.common.** { *; }

# Keep any JavaScriptInterface annotations (if using WebView or similar)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
