package ae.elcapino.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import org.json.JSONArray;
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
    private static final String START = "https://appassets.androidplatform.net/assets/command.html";
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
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
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
                if (uri != null && "https".equals(uri.getScheme()) && HOST.equals(uri.getHost())) return false;
                if (uri != null && "https".equals(uri.getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); } catch (Exception ignored) {}
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (url != null && url.startsWith("https://" + HOST + "/assets/")) {
                    view.evaluateJavascript(EXPORT_HOOK, null);
                }
                if (url != null && url.startsWith("https://" + HOST + "/assets/public/index.html")) {
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
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    private final class ExportBridge {
        @JavascriptInterface
        public String buildId() {
            return BuildConfig.VERSION_NAME + " " + BuildConfig.GIT_SHA;
        }

        @JavascriptInterface
        public void savePref(String key, String value) {
            if (key == null || !key.startsWith("hmk_") || value == null || value.length() > 200000) return;
            prefs().edit().putString(key, value).commit();
        }

        @JavascriptInterface
        public void removePref(String key) {
            if (key == null || !key.startsWith("hmk_")) return;
            prefs().edit().remove(key).commit();
        }

        @JavascriptInterface
        public String loadState() {
            JSONObject out = new JSONObject();
            for (Map.Entry<String, ?> entry : prefs().getAll().entrySet()) {
                if (entry.getValue() instanceof String) {
                    try { out.put(entry.getKey(), entry.getValue()); } catch (Exception ignored) {}
                }
            }
            return out.toString();
        }

        private SharedPreferences prefs() {
            return getSharedPreferences("hmk", MODE_PRIVATE);
        }

        @JavascriptInterface
        public String checkConnectors() {
            JSONArray out = new JSONArray();
            out.put(probe("brightdata", "hmk_key_brightdata", "GET", "https://api.brightdata.com/status", "Authorization", "Bearer ", null));
            out.put(probe("exa", "hmk_key_exa", "POST", "https://api.exa.ai/search", "x-api-key", "", "{\"query\":\"ping\",\"numResults\":1}"));
            out.put(probe("apify", "hmk_key_apify", "GET", "https://api.apify.com/v2/users/me", "Authorization", "Bearer ", null));
            out.put(probe("github", "hmk_key_github", "GET", "https://api.github.com/user", "Authorization", "Bearer ", null));
            out.put(probeShopify());
            out.put(probe("x", "hmk_key_x", "GET", "https://api.twitter.com/2/users/me", "Authorization", "Bearer ", null));
            return out.toString();
        }

        private JSONObject probe(String id, String pref, String method, String url, String header, String prefix, String body) {
            JSONObject o = new JSONObject();
            try {
                o.put("id", id);
                String key = prefs().getString(pref, "");
                if (key == null || key.trim().isEmpty()) {
                    o.put("result", "nokey");
                    return o;
                }
                key = key.trim();
                if (key.length() > 400) {
                    o.put("result", "badkey");
                    return o;
                }
                int code = request(method, url, header, prefix + key, body);
                o.put("result", judge(code));
            } catch (Exception ex) {
                try { o.put("id", id); o.put("result", "fail"); } catch (Exception ignored) {}
            }
            return o;
        }

        private JSONObject probeShopify() {
            JSONObject o = new JSONObject();
            try {
                o.put("id", "shopify");
                String raw = prefs().getString("hmk_key_shopify", "");
                if (raw == null || raw.trim().isEmpty()) {
                    o.put("result", "nokey");
                    return o;
                }
                String[] parts = raw.trim().split("\\|", 2);
                if (parts.length != 2 || !shopHost(parts[1]) || parts[0].length() > 400) {
                    o.put("result", "badkey");
                    return o;
                }
                String url = "https://" + parts[1].toLowerCase() + "/admin/api/2024-10/shop.json";
                int code = request("GET", url, "X-Shopify-Access-Token", parts[0], null);
                o.put("result", judge(code));
            } catch (Exception ex) {
                try { o.put("result", "fail"); } catch (Exception ignored) {}
            }
            return o;
        }

        private boolean shopHost(String host) {
            if (host == null) return false;
            String h = host.trim().toLowerCase();
            return h.matches("[a-z0-9][a-z0-9-]*\\.myshopify\\.com");
        }

        private String judge(int code) {
            if (code == 401 || code == 403) return "badkey";
            if (code >= 200 && code < 300) return "ok";
            return "fail";
        }

        private int request(String method, String url, String header, String value, String body) throws Exception {
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);
            conn.setInstanceFollowRedirects(false);
            conn.setRequestMethod(method);
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("User-Agent", "HMK-debug");
            if (header != null && !header.isEmpty()) conn.setRequestProperty(header, value);
            if (body != null) {
                byte[] bytes = body.getBytes("UTF-8");
                conn.setDoOutput(true);
                conn.setRequestProperty("Content-Type", "application/json");
                OutputStream stream = conn.getOutputStream();
                stream.write(bytes);
                stream.close();
            }
            try {
                return conn.getResponseCode();
            } finally {
                conn.disconnect();
            }
        }

        private static final String[] PUBLIC_FEEDS = new String[] {
            "https://news.google.com/rss/search?q=site:wam.ae&hl=ar&gl=AE&ceid=AE:ar",
            "https://www.thenationalnews.com/arc/outboundfeeds/rss/?outputType=xml",
            "https://gulfnews.com/stories.rss",
            "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
            "https://www.cnbc.com/id/100003114/device/rss/rss.html"
        };

        @JavascriptInterface
        public String fetchPublic(String url) {
            if (!allowedFeed(url)) return "";
            HttpURLConnection conn = null;
            try {
                conn = (HttpURLConnection) new URL(url).openConnection();
                conn.setConnectTimeout(8000);
                conn.setReadTimeout(8000);
                conn.setInstanceFollowRedirects(true);
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/rss+xml, application/xml, text/xml, */*");
                conn.setRequestProperty("User-Agent", "HMK-debug");
                int code = conn.getResponseCode();
                if (code < 200 || code >= 300) return "";
                java.io.InputStream in = conn.getInputStream();
                java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
                byte[] tmp = new byte[4096];
                int n;
                int total = 0;
                while ((n = in.read(tmp)) > 0 && total < 100000) {
                    int take = Math.min(n, 100000 - total);
                    bos.write(tmp, 0, take);
                    total += take;
                }
                in.close();
                return new String(bos.toByteArray(), StandardCharsets.UTF_8);
            } catch (Exception ex) {
                return "";
            } finally {
                if (conn != null) conn.disconnect();
            }
        }

        private boolean allowedFeed(String url) {
            if (url == null) return false;
            for (String feed : PUBLIC_FEEDS) if (feed.equals(url)) return true;
            return false;
        }

        @JavascriptInterface
        public void openLink(String url) {
            if (url == null || !url.startsWith("https://") || url.length() > 2000) return;
            String lower = url.toLowerCase();
            if (lower.contains("hmk_") || lower.contains("token=") || lower.contains("key=") || lower.contains("password=")) return;
            Uri uri = Uri.parse(url);
            if (uri.getHost() == null) return;
            runOnUiThread(() -> {
                try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); } catch (Exception ignored) {}
            });
        }

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
