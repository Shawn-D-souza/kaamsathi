package com.kaamsaathi.app;

import android.content.Context;
import android.content.DialogInterface;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.view.View;
import android.webkit.WebView;
import androidx.appcompat.app.AlertDialog;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final String APP_URL = "https://kaamsaathi.netlify.app/";
    private static final String BLANK_URL = "about:blank";

    @Override
    public void onStart() {
        super.onStart();
        ensureNetworkConnection();
    }

    private void ensureNetworkConnection() {
        if (!isNetworkAvailable()) {
            handleOfflineState();
        }
    }

    private void handleOfflineState() {
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            webView.setVisibility(View.INVISIBLE);
            webView.loadUrl(BLANK_URL);
        }
        showOfflineDialog();
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    private void showOfflineDialog() {
        new AlertDialog.Builder(this)
            .setTitle("No Internet Connection")
            .setMessage("This application requires an internet connection to function. Please check your settings and try again.")
            .setCancelable(false)
            .setPositiveButton("Retry", (dialog, id) -> {
                if (isNetworkAvailable()) {
                    loadApp();
                } else {
                    showOfflineDialog();
                }
            })
            .setNegativeButton("Exit", (dialog, id) -> finish())
            .create()
            .show();
    }

    private void loadApp() {
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            webView.loadUrl(APP_URL);
            webView.setVisibility(View.VISIBLE);
        }
    }
}