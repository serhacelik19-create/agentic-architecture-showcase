## Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-keep class com.google.firebase.** { *; }

# Flutter Jailbreak Detection
-keep class com.example.flutter_jailbreak_detection.** { *; }

# Flutter Secure Storage
-keep class com.it_3.flutter_secure_storage.** { *; }

# AndroidX MultiDex
-keep class androidx.multidex.** { *; }

# Device Info Plus
-keep class dev.fluttercommunity.plus.device_info.** { *; }

# In App Purchase
-keep class io.flutter.plugins.inapppurchase.** { *; }

# OkHttp / Dio networking
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# Gson (used by some plugins for JSON)
-keep class com.google.gson.** { *; }
-keep class * extends com.google.gson.TypeAdapter { *; }

# Crisp Chat
-keep class im.crisp.** { *; }

# Camera
-keep class io.flutter.plugins.camera.** { *; }

# Speech to Text
-keep class com.csdcorp.speech_to_text.** { *; }

# Audio Waveforms
-keep class com.simform.audio_waveforms.** { *; }

# Permission Handler
-keep class com.baseflow.permissionhandler.** { *; }

# Keep Dart obfuscation-safe annotations
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable

# Play Core and R8 Fixes
-dontwarn com.google.android.play.core.**
-dontwarn com.google.android.gms.internal.**
-dontwarn com.google.android.gms.common.**

