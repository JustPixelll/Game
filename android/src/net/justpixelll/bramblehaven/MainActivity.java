package net.justpixelll.bramblehaven;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

/** A permission-free, local-only shell. All simulation and assets are in the APK. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final int EXPORT = 41, IMPORT = 42, MAX_SAVE = 2_000_000;
    private WebView web;
    private String pendingExport;
    private boolean documentOpen = false;
    private boolean activityPaused = false;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(24, 53, 45));
        getWindow().setNavigationBarColor(Color.rgb(24, 53, 45));
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(24, 53, 45));
        root.setFitsSystemWindows(true);
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(24, 53, 45));
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        // Respect status/navigation/cutout insets, including target-35 edge-to-edge.
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        root.requestApplyInsets();
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setBuiltInZoomControls(false);
        WebView.setWebContentsDebuggingEnabled(false);
        web.setWebViewClient(new LocalClient());
        web.addJavascriptInterface(new SaveBridge(), "BrambleNative");
        web.loadUrl("https://" + HOST + "/assets/index.html");
    }

    private boolean local(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost())
            && (uri.getPort() == -1 || uri.getPort() == 443)
            && uri.getUserInfo() == null;
    }
    private final class LocalClient extends WebViewClient {
        @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest r) {
            return !local(r.getUrl()) || !"/assets/index.html".equals(r.getUrl().getPath());
        }
        @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Uri uri = Uri.parse(url);
            return !local(uri) || !"/assets/index.html".equals(uri.getPath());
        }
        @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest r) {
            Uri uri = r.getUrl();
            String path = uri.getPath();
            if (!local(uri) || !"GET".equals(r.getMethod()) || path == null
                || !path.startsWith("/assets/") || path.contains("..") || path.contains("\\")) return denied();
            String name = path.substring(8);
            // A flat, explicit allow-list prevents traversal and accidental exposure of future files.
            if (!name.matches("(index\\.html|style\\.css|content\\.js|engine\\.js|art\\.js|app\\.js|icon\\.svg|icon-192\\.png|icon-512\\.png|manifest\\.webmanifest)")) return denied();
            try {
                String mime = name.endsWith(".html") ? "text/html" : name.endsWith(".js") ? "application/javascript"
                    : name.endsWith(".css") ? "text/css" : name.endsWith(".svg") ? "image/svg+xml"
                    : name.endsWith(".png") ? "image/png" : "application/manifest+json";
                return new WebResourceResponse(mime, "UTF-8", 200, "OK",
                    Collections.singletonMap("Cache-Control", "no-cache"), getAssets().open(name));
            } catch (Exception e) { return denied(); }
        }
    }
    private WebResourceResponse denied() {
        return new WebResourceResponse("text/plain", "UTF-8", 403, "Blocked",
            Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private void message(String text) { Toast.makeText(this, text, Toast.LENGTH_LONG).show(); }
    private void js(String expression) { if (web != null) web.evaluateJavascript(expression, null); }

    private final class SaveBridge {
        @JavascriptInterface public void exportSave(String value) {
            if (value == null || value.getBytes(StandardCharsets.UTF_8).length > MAX_SAVE) return;
            runOnUiThread(() -> {
                if (documentOpen) return;
                pendingExport = value;
                documentOpen = true;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                intent.putExtra(Intent.EXTRA_TITLE, "Bramblehaven-save.json");
                try { startActivityForResult(intent, EXPORT); }
                catch (Exception e) { documentOpen = false; pendingExport = null; message("No file picker available. Use Copy backup instead."); }
            });
        }
        @JavascriptInterface public void importSave() {
            runOnUiThread(() -> {
                if (documentOpen) return;
                documentOpen = true;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "application/octet-stream"});
                try { startActivityForResult(intent, IMPORT); }
                catch (Exception e) { documentOpen = false; message("No file picker available. Use the browser edition to restore a backup."); }
            });
        }
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != EXPORT && request != IMPORT) return;
        documentOpen = false;
        Uri uri = result == RESULT_OK && data != null ? data.getData() : null;
        if (uri == null) { pendingExport = null; return; }
        final String export = pendingExport;
        pendingExport = null;
        // Document providers can be slow: keep disk/provider I/O off the UI thread.
        new Thread(() -> {
            try {
                if (request == EXPORT) {
                    if (export == null) throw new IllegalStateException("Nothing to save");
                    try (OutputStream out = getContentResolver().openOutputStream(uri, "wt")) {
                        if (out == null) throw new IllegalStateException("Cannot open destination");
                        out.write(export.getBytes(StandardCharsets.UTF_8));
                    }
                    runOnUiThread(() -> message("Town backup exported."));
                } else {
                    byte[] bytes;
                    try (InputStream in = getContentResolver().openInputStream(uri); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                        if (in == null) throw new IllegalStateException("Cannot open save");
                        byte[] buffer = new byte[8192]; int n;
                        while ((n = in.read(buffer)) != -1) {
                            if (out.size() + n > MAX_SAVE) throw new IllegalArgumentException("Save exceeds 2 MB");
                            out.write(buffer, 0, n);
                        }
                        bytes = out.toByteArray();
                    }
                    String safe = Base64.encodeToString(bytes, Base64.NO_WRAP);
                    // Base64 contains no quotes or JS syntax; the game validates the envelope before confirmation.
                    runOnUiThread(() -> js("window.BH && BH.receiveImportBase64('" + safe + "')"));
                }
            } catch (Exception e) { runOnUiThread(() -> message("The backup could not be read or written. Your current town is unchanged.")); }
        }, "bramblehaven-save").start();
    }
    @Override protected void onPause() {
        activityPaused = true;
        if (web != null) web.evaluateJavascript("window.BH && BH.background()", value -> { if (web != null && activityPaused) web.onPause(); });
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        activityPaused = false;
        if (web != null) { web.onResume(); js("window.BH && BH.foreground()"); }
    }
    @Override public void onBackPressed() {
        if (web == null) { finish(); return; }
        web.evaluateJavascript("window.BH ? BH.back() : false", handled -> { if (!"true".equals(handled)) finish(); });
    }
    @Override protected void onDestroy() {
        if (web != null) { web.removeJavascriptInterface("BrambleNative"); web.destroy(); web = null; }
        super.onDestroy();
    }
}
