package com.nativesongchoicer;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class CameraRollModule extends ReactContextBaseJavaModule {

    private static final String TAG = "CameraRollModule";

    public CameraRollModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "CameraRollModule";
    }

    @ReactMethod
    public void saveImageToGallery(String imagePath, Promise promise) {
        Context context = getReactApplicationContext();
        File imageFile = new File(imagePath);

        if (!imageFile.exists()) {
            promise.reject("ERROR", "Image file does not exist");
            return;
        }

        ContentResolver contentResolver = context.getContentResolver();
        ContentValues contentValues = new ContentValues();
        contentValues.put(MediaStore.Images.Media.DISPLAY_NAME, imageFile.getName());
        contentValues.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
        contentValues.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES);

        Uri uri = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues);
        if (uri == null) {
            promise.reject("ERROR", "Failed to create new MediaStore record.");
            return;
        }

        try (FileOutputStream out = (FileOutputStream) contentResolver.openOutputStream(uri)) {
            if (out == null) {
                promise.reject("ERROR", "Failed to get output stream.");
                return;
            }

            byte[] buffer = new byte[1024];
            int len;
            try (FileOutputStream fileInputStream = new FileOutputStream(imageFile)) {
                while ((len = fileInputStream.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                }
            }

            WritableMap resultMap = Arguments.createMap();
            resultMap.putString("uri", uri.toString());
            promise.resolve(resultMap);
        } catch (IOException e) {
            contentResolver.delete(uri, null, null);
            promise.reject("ERROR", "Failed to save image to gallery: " + e.getMessage());
            Log.e(TAG, "Failed to save image to gallery", e);
        }
    }
}
