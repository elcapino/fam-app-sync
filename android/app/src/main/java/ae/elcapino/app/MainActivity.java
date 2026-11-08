package ae.elcapino.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import org.json.JSONObject;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Debug shell for the delivered HMK web workspace.
 * Web bytes are copied from ../dash at build time and are not edited here.
 * Export writes a JSON file into Downloads on API 29+ (no storage permission).
 * Import accepts only a content URI returned by the system document picker.
 */
public class MainActivity extends Activity {
    private static final String TAG = "HMK";
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://appassets.androidplatform.net/assets/public/index.html";
    private static final int REQ_OPEN = 41;
    private static final int MAX_JSON = 200000;

    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;

    private static final String EXPORT_HOOK =
        "(function(){if(window.__hmkExportHook)return;window.__hmkExportHook=true;"
            + "document.addEventListener('click',function(ev){"
            + "var t=ev.target;var a=t&&t.closest?t.closest('a[download]'):null;"
            + "if(!a)return;var href=a.href||'';if(href.indexOf('blob:')!==0)return;"
            + "var name=a.getAttribute('download')||'hmk-workspace.json';"
            + "fetch(href).then(function(r){return r.text();}).then(function(text){"
            + "try{window.HmkAndroid.saveExport(name,text);}catch(e){}"
            + "});},true);})();";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .setDomain(HOST)
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        webView = new WebView(this);
        setContentView(webView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setGeolocationEnabled(false);
        webView.addJavascriptInterface(new ExportBridge(), "HmkAndroid");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                return !(uri != null && "https".equals(uri.getScheme()) && HOST.equals(uri.getHost()));
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (url != null && url.startsWith("https://" + HOST + "/assets/public/index.html")) {
                    view.evaluateJavascript(EXPORT_HOOK, null);
                    view.evaluateJavascript(
                        "(function(){if(document.getElementById('hmk-polish'))return;"
                            + "var s=document.createElement('script');s.id='hmk-polish';"
                            + "s.src='https://" + HOST + "/assets/hmk-polish.js';"
                            + "document.documentElement.appendChild(s);})();",
                        null
                    );
                }
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{
                    "application/json", "text/plain", "application/octet-stream"
                });
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                try {
                    startActivityForResult(intent, REQ_OPEN);
                } catch (ActivityNotFoundException ex) {
                    fileCallback = null;
                    callback.onReceiveValue(null);
                }
                return true;
            }
        });
        webView.loadUrl(START);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_OPEN || fileCallback == null) return;
        Uri[] result = null;
        if (resultCode == RESULT_OK && data != null) {
            Uri uri = data.getData();
            if (uri != null && "content".equals(uri.getScheme())) {
                result = new Uri[]{uri};
            } else if (uri != null) {
                Log.w(TAG, "Rejected non-content import URI");
            }
        }
        fileCallback.onReceiveValue(result);
        fileCallback = null;
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    private final class ExportBridge {
        @JavascriptInterface
        public void saveExport(String name, String text) {
            String safe = safeName(name);
            if (text == null) return;
            String body = text.trim();
            if (body.length() < 2 || body.length() > MAX_JSON || body.indexOf('\0') >= 0 || body.charAt(0) != '{') {
                Log.w(TAG, "Rejected export payload");
                return;
            }
            try {
                new JSONObject(body);
            } catch (Exception ex) {
                Log.w(TAG, "Rejected export that is not a JSON object");
                return;
            }
            if (Build.VERSION.SDK_INT >= 29) {
                writeDownloads(safe, body);
            } else {
                writeAppFiles(safe, body);
            }
        }

        private void writeDownloads(String safe, String body) {
            try {
                var resolver = getContentResolver();
                Uri collection = Build.VERSION.SDK_INT >= 29
                    ? MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
                    : MediaStore.Downloads.EXTERNAL_CONTENT_URI;
                android.database.Cursor existing = resolver.query(
                    collection,
                    new String[]{MediaStore.MediaColumns._ID},
                    MediaStore.MediaColumns.DISPLAY_NAME + "=?",
                    new String[]{safe},
                    null
                );
                if (existing != null) {
                    while (existing.moveToNext()) {
                        resolver.delete(
                            android.content.ContentUris.withAppendedId(collection, existing.getLong(0)),
                            null,
                            null
                        );
                    }
                    existing.close();
                }
                ContentValues values = new ContentValues();
                values.put(MediaStore.MediaColumns.DISPLAY_NAME, safe);
                values.put(MediaStore.MediaColumns.MIME_TYPE, "application/json");
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                values.put(MediaStore.MediaColumns.IS_PENDING, 1);
                Uri uri = resolver.insert(collection, values);
                if (uri == null) {
                    Log.w(TAG, "Download insert failed");
                    return;
                }
                try (OutputStream os = resolver.openOutputStream(uri)) {
                    if (os == null) return;
                    os.write(body.getBytes(StandardCharsets.UTF_8));
                }
                ContentValues done = new ContentValues();
                done.put(MediaStore.MediaColumns.IS_PENDING, 0);
                resolver.update(uri, done, null, null);
                Log.i(TAG, "Exported " + safe);
            } catch (Exception ex) {
                Log.w(TAG, "Export failed", ex);
            }
        }

        private void writeAppFiles(String safe, String body) {
            try {
                java.io.File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                if (dir == null) return;
                if (!dir.exists() && !dir.mkdirs()) return;
                java.io.File out = new java.io.File(dir, safe);
                try (java.io.OutputStream os = new java.io.FileOutputStream(out)) {
                    os.write(body.getBytes(StandardCharsets.UTF_8));
                }
                Log.i(TAG, "Exported to app files");
            } catch (Exception ex) {
                Log.w(TAG, "App-file export failed", ex);
            }
        }

        private String safeName(String name) {
            if (name == null) return "hmk-workspace.json";
            String base = name.replace('\\', '/');
            int slash = base.lastIndexOf('/');
            if (slash >= 0) base = base.substring(slash + 1);
            if (!base.matches("[A-Za-z0-9._-]{1,64}\\.json")) return "hmk-workspace.json";
            return base;
        }
    }
}
