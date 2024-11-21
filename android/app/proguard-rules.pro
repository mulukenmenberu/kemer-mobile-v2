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

# Remove all logging calls in the release build
-assumenosideeffects class android.util.Log {
    public static *** v(...);
    public static *** d(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# Optimize code
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*

# Protect native libraries
-keep class * {
    native <methods>;
}

# Obfuscate everything else
-keepattributes *Annotation*
-keepclassmembers enum * { *; }
-keep public class * extends android.app.Activity
-keepclasseswithmembers class * {
    native <methods>;
}
-dontwarn javax.annotation.**