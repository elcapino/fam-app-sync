(function () {
  "use strict";
  var nativeSet = localStorage.setItem.bind(localStorage);
  var nativeRemove = localStorage.removeItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    nativeSet(key, value);
    try {
      if (window.HmkAndroid && HmkAndroid.savePref && String(key).indexOf("hmk_") === 0) HmkAndroid.savePref(String(key), String(value));
    } catch (e) {}
  };
  localStorage.removeItem = function (key) {
    nativeRemove(key);
    try {
      if (window.HmkAndroid && HmkAndroid.removePref && String(key).indexOf("hmk_") === 0) HmkAndroid.removePref(String(key));
    } catch (e) {}
  };
  var WS_KEY = "hmk_workspace_v1";
  var DRAFT_KEY = "hmk_idea_draft_v1";
  var SNAP_KEY = "hmk_status_snapshot_v1";
  var MAX_P = 50, MAX_T = 100, MAX_NAME = 120, MAX_NEXT = 400, MAX_FILE = 200000, MAX_ITEMS = 50;
  var PSTAT = { wait: "بالانتظار", go: "قيد العمل", hold: "متعثر", done: "منجز" };
  var TSTAT = { open: "مفتوحة", doing: "قيد العمل", done: "تمت" };
  var TOOL = { running: "شغّال", idle: "جاهز", stopped: "موقوف", hold: "مقفل" };
  var tq = /[?&]theme=(alain|uae)/.exec(location.search);
  var theme = (tq && tq[1]) || localStorage.getItem("hmk_theme_v1") || "alain";
  var lq = /[?&]lang=(ar|en)/.exec(location.search);
  var lang = (lq && lq[1]) || localStorage.getItem("hmk_lang_v1") || "ar";
  var digits = localStorage.getItem("hmk_digits_v1") || "latn";
  var textSize = localStorage.getItem("hmk_size_v1") || "m";
  var density = localStorage.getItem("hmk_density_v1") || "compact";
  var startPage = localStorage.getItem("hmk_start_v1") || "home";
  var homeSeg = "now";
  var toolSeg = "run";
  var connectorState = {};
  var connectorChecked = false;
  var CONNECTORS = [
    { id: "brightdata", name: "Bright Data", icon: "link", roleAr: "جمع صفحات المواقع", roleEn: "Site collection" },
    { id: "exa", name: "Exa", icon: "spark", roleAr: "بحث الويب", roleEn: "Web search" },
    { id: "apify", name: "Apify", icon: "cloud", roleAr: "تشغيل أدوات الجمع", roleEn: "Collection actors" },
    { id: "github", name: "GitHub", icon: "laptop", roleAr: "المستودعات", roleEn: "Repositories" },
    { id: "shopify", name: "Shopify", icon: "store", roleAr: "المتجر", roleEn: "Store" },
    { id: "x", name: "X", icon: "news", roleAr: "الحساب", roleEn: "Account" }
  ];
  function connectorResult(id) {
    if (connectorState[id]) return connectorState[id];
    return (window.HmkAndroid && HmkAndroid.checkConnectors) ? "wait" : "nokey";
  }
  var I18N = {
    ar: { nav_home:"الرئيسية", nav_proj:"المشاريع", nav_ideas:"الأفكار", nav_tools:"الأدوات", enter:"متابعة",
      home:"الرئيسية", projects:"المشاريع", ideas:"الأفكار", tools:"الأدوات", project:"مشروع", edit:"تعديل",
      seg_now:"الآن", seg_proj:"مشاريع", seg_brief:"موجز", seg_tools:"الأدوات", seg_set:"إعدادات", seg_file:"الملف",
      all:"الكل", going:"قيد العمل", done:"منجز", late:"متأخر", brief:"الموجز", devices:"الأجهزة", next:"التالي",
      tasks:"المهام", progress:"التقدم", due:"الموعد", step:"الخطوة التالية", add_project:"+ مشروع", save_name:"حفظ الاسم",
      add_task:"+ مهمة", save:"حفظ", cancel:"إلغاء", del:"حذف", confirm:"تأكيد",
      no_projects:"لا مشاريع بعد. اضغط + لإضافة الأول.", no_tasks:"لا مهام. أضف الأولى من السطر التالي.",
      no_progress:"لا نسبة بعد. حدّدها من تعديل.", no_step:"لا خطوة تالية. اكتبها من تعديل.",
      no_due:"لا موعد. أضفه من تعديل.", no_ideas:"لا أفكار في اللقطة.",
      theme:"الثيم", language:"اللغة", size:"حجم النص", digits:"الأرقام", start:"صفحة البداية", density:"الكثافة", about:"عن النسخة",
      alain:"ثيم العين", uae:"ثيم الإمارات", ain:"العين", emirates:"الإمارات",
      ar:"عربي", en:"English", small:"صغير", medium:"وسط", large:"كبير", compact:"مضغوط", comfortable:"مريح",
      export:"تصدير المساحة", restore:"استعادة المساحة", import_snap:"استيراد اللقطة", clear:"مسح المساحة",
      local_only:"يبقى على هذا الجهاز. لا مزامنة.", last_export:"آخر تصدير", counts:"المحتوى", storage:"حجم الحفظ",
      never:"لا يوجد", from_ceo:"من لقطة CEO", file:"الملف المحلي",
      idea_new:"فكرة جديدة", build:"بناء قالب", confirm_create:"تأكيد الإنشاء",
      role:"الدور", last:"آخر استخدام", health:"الحالة",
      st_wait:"بالانتظار", st_go:"قيد العمل", st_hold:"متعثر", st_done:"منجز",
      tl_running:"شغّال", tl_idle:"جاهز", tl_stopped:"موقوف", tl_hold:"مقفل",
      h_running:"سليم", h_idle:"جاهز", h_stopped:"متوقف", h_hold:"مقفل",
      name:"الاسم", replace_ws:"استبدال المساحة بمحتوى الملف؟", replace_snap:"استبدال مرجع اللقطة؟ مساحتك لا تتغير.",
      bad_file:"ملف غير صالح", bad_ws:"ملف المساحة غير صالح", bad_snap:"لقطة غير صالحة",
      restored:"استُعيدت المساحة", imported:"استُوردت اللقطة", cleared:"المساحة فارغة", clear_ask:"مسح مشاريعك المحلية؟ المرجع لا يتأثر.",
      created:"أُنشئ المشروع في المساحة", big_file:"الملف أكبر من الحد", need_name:"اكتب اسماً", need_task:"اكتب مهمة", limit:"بلغت الحد",
      del_ask:"حذف هذا المشروع؟", idea_ph:"سطر واحد", need_idea:"اكتب الفكرة", goal:"الهدف", first_task:"أول مهمة", need_both:"أكمل الهدف والمهمة",
      c_ok:"سليم", c_nokey:"لا مفتاح", c_badkey:"مفتاح غير صالح", c_fail:"تعذر الفحص", c_wait:"جارٍ الفحص",
      c_line_ok:"الفحص نجح الآن", c_line_nokey:"لا مفتاح محفوظ على هذا الجهاز", c_line_badkey:"الخدمة رفضت المفتاح", c_line_fail:"تعذر الاتصال بالخدمة", c_line_wait:"جارٍ فحص المفتاح" },
    en: { nav_home:"Home", nav_proj:"Projects", nav_ideas:"Ideas", nav_tools:"Tools", enter:"Continue",
      home:"Home", projects:"Projects", ideas:"Ideas", tools:"Tools", project:"Project", edit:"Edit",
      seg_now:"Now", seg_proj:"Projects", seg_brief:"Brief", seg_tools:"Tools", seg_set:"Settings", seg_file:"File",
      all:"All", going:"Active", done:"Done", late:"Overdue", brief:"Brief", devices:"Devices", next:"Next",
      tasks:"Tasks", progress:"Progress", due:"Due", step:"Next step", add_project:"+ Project", save_name:"Save name",
      add_task:"+ Task", save:"Save", cancel:"Cancel", del:"Delete", confirm:"Confirm",
      no_projects:"No projects yet. Press + to add the first.", no_tasks:"No tasks. Add the first one below.",
      no_progress:"No percent yet. Set it in Edit.", no_step:"No next step. Write it in Edit.",
      no_due:"No date. Add it in Edit.", no_ideas:"No ideas in the snapshot.",
      theme:"Theme", language:"Language", size:"Text size", digits:"Digits", start:"Start page", density:"Density", about:"About",
      alain:"Al Ain", uae:"UAE", ain:"Al Ain", emirates:"UAE",
      ar:"عربي", en:"English", small:"Small", medium:"Medium", large:"Large", compact:"Compact", comfortable:"Comfortable",
      export:"Export workspace", restore:"Restore workspace", import_snap:"Import snapshot", clear:"Clear workspace",
      local_only:"Stays on this device. No sync.", last_export:"Last export", counts:"Contents", storage:"Stored size",
      never:"None", from_ceo:"From CEO snapshot", file:"Local file",
      idea_new:"New idea", build:"Build template", confirm_create:"Confirm create",
      role:"Role", last:"Last used", health:"Health",
      st_wait:"Waiting", st_go:"Active", st_hold:"Stuck", st_done:"Done",
      tl_running:"On", tl_idle:"Ready", tl_stopped:"Paused", tl_hold:"Locked",
      h_running:"Healthy", h_idle:"Ready", h_stopped:"Paused", h_hold:"Locked",
      name:"Name", replace_ws:"Replace the workspace with this file?", replace_snap:"Replace the snapshot? Your workspace stays.",
      bad_file:"Invalid file", bad_ws:"Invalid workspace file", bad_snap:"Invalid snapshot",
      restored:"Workspace restored", imported:"Snapshot imported", cleared:"Workspace cleared", clear_ask:"Clear your local projects? The reference stays.",
      created:"Project created in the workspace", big_file:"File is over the limit", need_name:"Type a name", need_task:"Type a task", limit:"Limit reached",
      del_ask:"Delete this project?", idea_ph:"One line", need_idea:"Type the idea", goal:"Goal", first_task:"First task", need_both:"Complete the goal and the task",
      c_ok:"Healthy", c_nokey:"No key", c_badkey:"Invalid key", c_fail:"Check failed", c_wait:"Checking",
      c_line_ok:"The check succeeded just now", c_line_nokey:"No key stored on this device", c_line_badkey:"The service rejected the key", c_line_fail:"The service could not be reached", c_line_wait:"Checking the key" }
  };
  function t(key) { return (I18N[lang] && I18N[lang][key]) || (I18N.ar[key]) || key; }
  function stLabel(code) { return t("st_" + code); }
  function tlLabel(code) { return t("tl_" + code) || code; }
  function healthLabel(code) { return t("h_" + code) || code; }
  function num(v) {
    var s = String(v);
    if (digits === "arab") return s.replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; });
    return s;
  }
  var PATHS = {
    house: "M4 11 12 4l8 7v9H4z M10 20v-5h4v5",
    store: "M3 9h18l-2-5H5z M4 9v11h16V9 M9 20v-6h6v6",
    chart: "M4 19h16 M7 16V10 M12 16V6 M17 16v-4",
    mosque: "M12 2c2 3 3 5 3 7a3 3 0 0 1-6 0c0-2 1-4 3-7z M3 21V12h18v9 M9 21v-4h6v4 M6 8V4",
    bag: "M7 8h10v12H7z M9 8V6a3 3 0 0 1 6 0v2",
    news: "M5 4h10v16H5z M8 8h4 M8 12h4 M16 7h3v13h-4",
    robot: "M9 3h6v3H9z M5 8h14v11H5z M9 13h.01 M15 13h.01 M8 19v2 M16 19v2",
    phone: "M8 2h8a1 1 0 0 1 1 1v18H7V3a1 1 0 0 1 1-1z M11 18h2",
    laptop: "M4 5h16v10H4z M2 18h20l-2-3H4z",
    book: "M4 5c2-1 6-1 8 1 2-2 6-2 8-1v14c-2-1-6-1-8 1-2-2-6-2-8-1z",
    play: "M8 5v14l12-7z",
    crown: "M3 8l4 4 5-7 5 7 4-4-2 11H5z",
    cloud: "M7 18h10a4 4 0 0 0 .4-8 5 5 0 0 0-9.6-1.2A3.5 3.5 0 0 0 7 18z",
    gem: "M3 9h18l-9 12z M3 9l4-5h10l4 5 M8 9l4 12 4-12",
    spark: "M12 2l1.8 6.2H20l-5 3.8 1.9 6L12 15.2 7.1 18l1.9-6-5-3.8h6.2z",
    note: "M6 3h8l4 4v14H6z M14 3v5h5",
    link: "M10 13a4 4 0 0 0 6 0l2-2a4 4 0 0 0-6-6l-1 1 M14 11a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 6 6l1-1",
    lock: "M8 11V8a4 4 0 0 1 8 0v3 M6 11h12v9H6z",
    pause: "M7 5h3v14H7z M14 5h3v14h-3z",
    flag: "M5 3v18 M5 4h11l-2 4 2 4H5"
  };
  var tab = "home";
  var detail = null;
  var ideaOpen = false;
  var addOpen = false;
  var pending = null;
  var pages = document.getElementById("pages");
  var title = document.getElementById("title");
  var back = document.getElementById("back");
  var ask = document.getElementById("ask");
  var snap = null;
  var SEED = [
    { id: "p_house01", name: "بيت حمد", status: "go", next: "قرار إنارة KNX/DALI · 4 قرارات معلّقة", progress: 12, icon: "house", from: "snapshot", tasks: [] },
    { id: "p_hmkdash", name: "HMK", status: "go", next: "إعادة التصميم المدمج وتسليم النسخة التشخيصية", icon: "crown", from: "snapshot", tasks: [] },
    { id: "p_islamapp", name: "التطبيق الإسلامي", status: "wait", next: "مراجعة النموذج v0.3.2 · لا نشر", icon: "mosque", from: "snapshot", tasks: [] },
    { id: "p_laithlib", name: "مكتبة ليث", status: "wait", next: "تحقق الحقوق قبل أي توسيع", icon: "book", from: "snapshot", tasks: [] },
    { id: "p_sanaaclip", name: "السنع", status: "wait", next: "مقطع واحد جاهز · الباقي ينتظر", icon: "play", from: "snapshot", tasks: [] },
    { id: "p_studykid", name: "دراسة العيال", status: "go", next: "روتين يومي محلي · بلا بيانات خام", icon: "bag", from: "snapshot", tasks: [] },
    { id: "p_shopifyx", name: "متجر Shopify", status: "wait", next: "بانتظار قرار التسعير ومصدر المنتجات", icon: "store", from: "snapshot", tasks: [] },
    { id: "p_markets1", name: "الأسواق", status: "wait", next: "التداول الورقي موقوف · لا مراكز مفتوحة", icon: "chart", from: "snapshot", tasks: [] },
    { id: "p_fahembot", name: "فاهم", status: "done", next: "البوت يعمل محلياً", icon: "robot", from: "snapshot", tasks: [] },
    { id: "p_newsroom", name: "البحث والأخبار", status: "go", next: "موجزات UAE Intel بانتظار نقل الملكية", icon: "news", from: "snapshot", tasks: [] }
  ];

  function rid(prefix) {
    var s = prefix + "_";
    var a = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 14; i++) s += a.charAt(Math.floor(Math.random() * a.length));
    return s;
  }
  function clip(v, n) { return String(v == null ? "" : v).trim().slice(0, n); }
  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (e) { return null; }
  }
  function emptyWs() { return { version: 1, projects: [] }; }
  function validTask(t) {
    return t && typeof t === "object" && /^t_[a-z0-9]{4,24}$/.test(t.id) && typeof t.title === "string" && t.title.length <= MAX_NAME && TSTAT[t.status] && typeof t.next === "string" && t.next.length <= MAX_NEXT;
  }
  function validProject(p) {
    if (!p || typeof p !== "object") return false;
    if (!/^p_[a-z0-9]{4,24}$/.test(p.id)) return false;
    if (typeof p.name !== "string" || p.name.length > MAX_NAME || !PSTAT[p.status]) return false;
    if (typeof p.next !== "string" || p.next.length > MAX_NEXT) return false;
    if (!Array.isArray(p.tasks) || p.tasks.length > MAX_T || !p.tasks.every(validTask)) return false;
    if (p.progress != null && (typeof p.progress !== "number" || p.progress < 0 || p.progress > 100)) return false;
    if (p.icon != null && (typeof p.icon !== "string" || !PATHS[p.icon])) return false;
    if (p.from != null && p.from !== "snapshot") return false;
    if (p.due != null && (typeof p.due !== "string" || (p.due && !/^\d{4}-\d{2}-\d{2}$/.test(p.due)))) return false;
    return true;
  }
  function readWs() {
    var d = readJson(WS_KEY);
    if (!d || d.version !== 1 || !Array.isArray(d.projects) || d.projects.length > MAX_P || !d.projects.every(validProject)) return emptyWs();
    return d;
  }
  function writeWs(d) { localStorage.setItem(WS_KEY, JSON.stringify(d)); }
  function ensureSeed() {
    var flag = "hmk_seeded_20261109";
    if (localStorage.getItem(flag)) return;
    var data = readWs();
    var names = {};
    data.projects.forEach(function (p) { names[p.name] = true; });
    SEED.forEach(function (p) {
      if (!names[p.name] && data.projects.length < MAX_P) data.projects.push(JSON.parse(JSON.stringify(p)));
    });
    writeWs(data);
    localStorage.setItem(flag, "1");
  }
  function readDraft() {
    var d = readJson(DRAFT_KEY);
    if (!d || d.version !== 1 || typeof d.idea !== "string") return null;
    return d;
  }
  function strList(v) {
    if (v == null) return [];
    if (!Array.isArray(v) || v.length > MAX_ITEMS) return null;
    var out = [];
    for (var i = 0; i < v.length; i++) {
      if (typeof v[i] !== "string" || v[i].length > MAX_NEXT) return null;
      out.push(v[i]);
    }
    return out;
  }
  function optStr(v, n) {
    if (v == null || v === "") return "";
    if (typeof v !== "string" || v.length > n) return null;
    return v;
  }
  function validSnap(d) {
    if (!d || typeof d !== "object" || typeof d.generatedAt !== "string" || !d.generatedAt || d.generatedAt.length > 80) return null;
    var ceo = strList(d.ceoNow), happened = strList(d.happened), now = strList(d.now), next = strList(d.next), ideas = strList(d.ideas), programs = strList(d.programs);
    if (!ceo || !happened || !now || !next || !ideas || !programs) return null;
    if (!Array.isArray(d.tools) || d.tools.length > MAX_ITEMS) return null;
    if (!Array.isArray(d.computers) || d.computers.length > MAX_ITEMS) return null;
    if (!Array.isArray(d.brief) || d.brief.length > MAX_ITEMS) return null;
    var tools = [], computers = [], brief = [], team = [];
    for (var i = 0; i < d.tools.length; i++) {
      var t = d.tools[i];
      if (!t || typeof t.name !== "string" || typeof t.state !== "string" || typeof t.lastRun !== "string") return null;
      if (!t.name || t.name.length > MAX_NAME || t.state.length > 40 || t.lastRun.length > 80) return null;
      var cost = optStr(t.cost, 40), icon = optStr(t.icon, 16);
      if (cost == null || icon == null) return null;
      tools.push({ name: t.name, state: t.state, lastRun: t.lastRun, cost: cost, icon: PATHS[icon] ? icon : "spark" });
    }
    for (var c = 0; c < d.computers.length; c++) {
      var m = d.computers[c];
      if (!m || typeof m.name !== "string" || typeof m.online !== "boolean" || typeof m.lastSeen !== "string") return null;
      if (!m.name || m.name.length > MAX_NAME || m.lastSeen.length > 80) return null;
      computers.push({ name: m.name, online: m.online, lastSeen: m.lastSeen });
    }
    for (var b = 0; b < d.brief.length; b++) {
      var r = d.brief[b];
      if (!r || typeof r.title !== "string" || typeof r.source !== "string" || typeof r.url !== "string" || typeof r.date !== "string") return null;
      if (!r.title || r.title.length > MAX_NEXT || r.source.length > MAX_NAME || r.url.length > MAX_NEXT || r.date.length > 40) return null;
      brief.push({ title: r.title, source: r.source, url: r.url, date: r.date });
    }
    var rawTeam = d.team == null ? [] : d.team;
    if (!Array.isArray(rawTeam) || rawTeam.length > MAX_ITEMS) return null;
    for (var k = 0; k < rawTeam.length; k++) {
      var member = rawTeam[k];
      if (!member || typeof member.name !== "string" || typeof member.role !== "string") return null;
      if (!member.name || member.name.length > MAX_NAME || member.role.length > MAX_NAME) return null;
      var mic = optStr(member.icon, 16);
      if (mic == null) return null;
      team.push({ name: member.name, role: member.role, icon: PATHS[mic] ? mic : "crown" });
    }
    return { sample: d.sample === true, generatedAt: d.generatedAt, ceoNow: ceo, tools: tools, computers: computers, brief: brief, happened: happened, now: now, next: next, ideas: ideas, programs: programs, team: team };
  }
  function blankSnap() {
    return { sample: true, generatedAt: "", ceoNow: [], tools: [], computers: [], brief: [], happened: [], now: [], next: [], ideas: [], programs: [], team: [] };
  }
  function loadSample(done) {
    var req = new XMLHttpRequest();
    req.open("GET", "status-snapshot.sample.json", true);
    req.onload = function () {
      var parsed = null;
      try { parsed = JSON.parse(req.responseText); } catch (e) { parsed = null; }
      snap = validSnap(parsed) || blankSnap();
      done();
    };
    req.onerror = function () { snap = blankSnap(); done(); };
    req.send();
  }
  function when(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    try { return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "ar-AE", { timeZone: "Asia/Dubai", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(d); }
    catch (e) { return iso; }
  }
  function costLabel(tool) {
    var c = tool.cost || "";
    if (lang !== "en") return c || tlLabel(tool.state);
    var map = { "يعمل": "Running", "متصل": "Connected", "عند الحاجة": "On demand", "موقوف": "Paused", "مقفل": "Locked" };
    if (map[c]) return map[c];
    if (c.indexOf("سقف") !== -1) return c.replace("سقف", "cap");
    return c || tlLabel(tool.state);
  }
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(kind) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("class", "ic");
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "1.6");
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", PATHS[kind] || PATHS.spark);
    s.appendChild(p);
    return s;
  }
  function section(label, extra) {
    var box = h("section", "sec");
    var head = h("h2", "", label);
    if (extra) head.appendChild(h("span", "meta", extra));
    box.appendChild(head);
    return box;
  }
  function applyTheme() {
    document.documentElement.lang = lang === "en" ? "en" : "ar";
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    document.documentElement.dataset.size = textSize;
    document.documentElement.dataset.density = density;
    document.body.dataset.theme = theme;
    document.querySelectorAll("#themes button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-theme") === theme);
      b.textContent = b.getAttribute("data-theme") === "uae" ? t("emirates") : t("ain");
    });
    document.querySelectorAll("#langs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lang") === lang);
    });
    var place = theme === "uae" ? t("emirates") : (lang === "en" ? "Al Ain · UAE" : "العين · الإمارات");
    document.getElementById("place").textContent = place;
    var op = document.querySelector("#open .place");
    if (op) op.textContent = place;
    var cp = document.querySelector("#open .cp");
    if (cp) cp.textContent = theme === "uae" ? "HMK · UAE" : "HMK made in ALAIN · UAE";
    var enter = document.getElementById("enter");
    if (enter) enter.textContent = t("enter");
    var navT = ["nav_home", "nav_proj", "nav_ideas", "nav_tools"];
    document.querySelectorAll("footer button").forEach(function (b, i) {
      var last = b.lastChild;
      if (last && last.nodeType === 3) last.textContent = t(navT[i]);
    });
  }
  function setLang(next) {
    if (next === lang) return;
    lang = next;
    localStorage.setItem("hmk_lang_v1", next);
    applyTheme();
    draw();
  }
  function setPref(key, value, field) {
    localStorage.setItem(key, value);
    if (field === "digits") digits = value;
    if (field === "size") textSize = value;
    if (field === "density") density = value;
    if (field === "start") startPage = value;
    applyTheme();
    draw();
  }
  function setTheme(next) {
    if (next === theme) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var apply = function () {
      theme = next;
      localStorage.setItem("hmk_theme_v1", next);
      applyTheme();
      document.body.classList.remove("switching");
      draw();
    };
    if (reduce) { apply(); return; }
    document.body.classList.add("switching");
    setTimeout(apply, 250);
  }
  function band(title, sub, num) {
    var b = h("div", "band");
    if (num != null) { var n = h("div", "bignum", String(num)); n.dir = "ltr"; b.appendChild(n); }
    b.appendChild(h("div", "display", title));
    if (sub) b.appendChild(h("div", "sub", sub));
    pages.appendChild(b);
  }
  function dot(state) { return h("i", "dot " + state); }
  function track(pct) {
    var bar = h("div", "track");
    var fill = document.createElement("i");
    fill.style.width = (pct || 0) + "%";
    bar.appendChild(fill);
    return bar;
  }
  function ring(pct) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 36 36");
    s.setAttribute("class", "ring");
    var bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bg.setAttribute("cx", "18"); bg.setAttribute("cy", "18"); bg.setAttribute("r", "15");
    s.appendChild(bg);
    if (typeof pct === "number") {
      var fg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      fg.setAttribute("class", "fg");
      fg.setAttribute("cx", "18"); fg.setAttribute("cy", "18"); fg.setAttribute("r", "15");
      var len = Math.max(0, Math.min(100, pct)) / 100 * 94.2;
      fg.setAttribute("stroke-dasharray", len + " 94.2");
      fg.setAttribute("transform", "rotate(-90 18 18)");
      s.appendChild(fg);
    }
    return s;
  }
  function openProject(id) {
    detail = id;
    tab = "projects";
    document.querySelectorAll("footer button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === "projects"); });
    draw();
  }
  function note(text) {
    var n = h("p", "note", text);
    pages.insertBefore(n, pages.firstChild);
  }
  function setTab(next) {
    tab = next;
    detail = null;
    document.querySelectorAll("footer button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === next); });
    draw();
  }
  function draw() {
    pages.textContent = "";
    back.hidden = !detail;
    var names = { home: t("home"), projects: t("projects"), ideas: t("ideas"), more: t("tools") };
    title.textContent = detail ? t("project") : names[tab];
    if (tab === "home") drawHome();
    else if (tab === "projects") detail ? drawDetail() : drawProjects();
    else if (tab === "ideas") drawIdeas();
    else drawMore();
  }
  function projectRow(p) {
    var row = h("button", "prow");
    row.appendChild(icon(p.icon || "crown"));
    var name = h("div", "nm", p.name);
    row.appendChild(name);
    var st = h("span", "stat stxt " + p.status);
    st.appendChild(dot(p.status));
    st.appendChild(document.createTextNode(stLabel(p.status)));
    row.appendChild(st);
    if (p.next) row.appendChild(h("div", "nx", p.next));
    if (typeof p.progress === "number") row.appendChild(track(p.progress));
    row.addEventListener("click", function () { openProject(p.id); });
    return row;
  }
  var ROLE = {
    "Claude": ["كتابة وتقارير طويلة", "Long writing and reports"],
    "Gemini": ["ملفات وصور وفيديو", "Files, images, and video"],
    "DeepSeek": ["مهام بسقف منخفض", "Tasks under a low cap"],
    "NotebookLM": ["تلخيص مصادر", "Source summaries"],
    "Cloud agents": ["برامج وتطبيقات", "Programs and apps"],
    "Exa · Bright Data · Apify": ["جمع بيانات المواقع", "Site data collection"],
    "GitHub · Shopify · X": ["موصلات مباشرة", "Live connectors"],
    "ChatGPT / Codex": ["عند الحاجة فقط", "On demand only"],
    "تحديث اللوحة": ["روتين اللوحة", "Dashboard routine"],
    "تداول حقيقي / نشر": ["مقفل بقرارك", "Locked pending your decision"]
  };
  function segBar(items, current, onPick) {
    var bar = h("div", "seg");
    items.forEach(function (pair) {
      var b = h("button", pair[0] === current ? "on" : "", pair[1]);
      b.addEventListener("click", function () { onPick(pair[0]); });
      bar.appendChild(b);
    });
    pages.appendChild(bar);
  }
  function storageBytes() {
    var n = 0;
    [WS_KEY, DRAFT_KEY, SNAP_KEY].forEach(function (k) {
      var v = localStorage.getItem(k);
      if (v) n += v.length;
    });
    return n;
  }
  function toolRow(tool) {
    var row = h("div", "trow");
    row.appendChild(icon(tool.icon || "spark"));
    row.appendChild(h("div", "nm", tool.name));
    var cost = h("span", "tag " + tool.state, costLabel(tool));
    if (tool.cost && tool.cost.indexOf("$") !== -1) cost.dir = "ltr";
    row.appendChild(cost);
    var meta = ROLE[tool.name] || ["", ""];
    var role = lang === "en" ? meta[1] : meta[0];
    row.appendChild(h("div", "sub", role + " · " + when(tool.lastRun) + " · " + healthLabel(tool.state)));
    return row;
  }
  function connectorRow(c) {
    var result = connectorResult(c.id);
    if (result !== "ok" && result !== "nokey" && result !== "badkey" && result !== "fail" && result !== "wait") result = "fail";
    var row = h("div", "trow");
    row.setAttribute("data-connector", c.id);
    row.appendChild(icon(c.icon));
    row.appendChild(h("div", "nm", c.name));
    var tag = h("span", "tag " + (result === "ok" ? "running" : "bad"), t("c_" + result));
    row.appendChild(tag);
    var role = lang === "en" ? c.roleEn : c.roleAr;
    row.appendChild(h("div", "sub", role + " · " + t("c_line_" + result)));
    return row;
  }
  function refreshConnectors() {
    if (connectorChecked || !window.HmkAndroid || !HmkAndroid.checkConnectors) return;
    connectorChecked = true;
    setTimeout(function () {
      var raw = "";
      try { raw = HmkAndroid.checkConnectors(); } catch (e) { raw = ""; }
      var list = [];
      try { list = JSON.parse(raw || "[]"); } catch (e2) { list = []; }
      if (!Array.isArray(list)) list = [];
      list.forEach(function (item) {
        if (item && item.id && (item.result === "ok" || item.result === "nokey" || item.result === "badkey" || item.result === "fail")) connectorState[item.id] = item.result;
      });
      CONNECTORS.forEach(function (c) { if (!connectorState[c.id]) connectorState[c.id] = "fail"; });
      if (tab === "more" && toolSeg === "run") draw();
    }, 30);
  }
  function counts() {
    var list = readWs().projects;
    var n = { go: 0, wait: 0, hold: 0, done: 0 };
    var late = 0;
    var today = "";
    try { today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); } catch (e) { today = ""; }
    list.forEach(function (p) {
      if (n[p.status] != null) n[p.status] += 1;
      if (today && p.due && p.status !== "done" && p.due < today) late += 1;
    });
    return { all: list.length, go: n.go, wait: n.wait, hold: n.hold, done: n.done, late: late };
  }
  function drawHome() {
    drawHomeC();
  }
  function drawHomeC() {
    var list = readWs().projects;
    var c = counts();
    band(t("home"), (theme === "uae" ? t("uae") : t("alain")) + " · " + num("09") + " · " + num("2026"), num(list.length));
    segBar([["now", t("seg_now")], ["proj", t("seg_proj")], ["brief", t("seg_brief")]], homeSeg, function (id) { homeSeg = id; draw(); });
    var rows = h("div", "rows");
    if (homeSeg === "proj") {
      list.forEach(function (p) { rows.appendChild(projectRow(p)); });
    } else if (homeSeg === "brief") {
      snap.brief.forEach(function (b) {
        var row = h("div", "trow");
        row.appendChild(icon("news"));
        row.appendChild(h("div", "nm", b.title));
        row.appendChild(h("span", "tag", b.date));
        rows.appendChild(row);
      });
      snap.ceo.forEach(function (line) {
        var row = h("div", "trow");
        row.appendChild(icon("flag"));
        row.appendChild(h("div", "nm", line.text));
        row.appendChild(h("span", "tag " + line.tone, line.time));
        rows.appendChild(row);
      });
    } else {
      var sum = h("div", "sum");
      [[t("all"), c.all], [t("going"), c.go], [t("done"), c.done], [t("late"), c.late]].forEach(function (pair) {
        var cell = h("div");
        var n = h("b", "", num(pair[1]));
        n.dir = "ltr";
        cell.appendChild(n);
        cell.appendChild(h("span", "", pair[0]));
        sum.appendChild(cell);
      });
      rows.appendChild(sum);
      snap.next.forEach(function (line) {
        var row = h("div", "trow");
        row.appendChild(icon("flag"));
        row.appendChild(h("div", "nm", line));
        rows.appendChild(row);
      });
      snap.computers.forEach(function (m) {
        var row = h("div", "trow");
        row.appendChild(icon(m.online ? "laptop" : "phone"));
        row.appendChild(h("div", "nm", m.name));
        row.appendChild(h("span", "tag " + (m.online ? "running" : "stopped"), m.online ? (lang === "en" ? "Online" : "متصل") : (lang === "en" ? "Offline" : "غير مربوط")));
        rows.appendChild(row);
      });
    }
    pages.appendChild(rows);
  }
  function drawProjects() {
    var list = readWs().projects;
    band(t("projects"), t("from_ceo"), num(list.length));
    var rows = h("div", "rows");
    if (!list.length) rows.appendChild(h("p", "empty", t("no_projects")));
    list.forEach(function (p) { rows.appendChild(projectRow(p)); });
    pages.appendChild(rows);
    if (!addOpen) {
      var plus = h("button", "linkish", t("add_project"));
      plus.addEventListener("click", function () { addOpen = true; draw(); });
      pages.appendChild(plus);
      return;
    }
    var name = h("input"); name.maxLength = MAX_NAME;
    pages.appendChild(name);
    var add = h("button", "linkish", t("save_name"));
    add.addEventListener("click", function () {
      var n = clip(name.value, MAX_NAME);
      if (!n) return note(t("need_name"));
      var ws = readWs();
      if (ws.projects.length >= MAX_P) return note(t("limit"));
      ws.projects.push({ id: rid("p"), name: n, status: "wait", next: "", tasks: [] });
      writeWs(ws);
      addOpen = false;
      draw();
    });
    pages.appendChild(add);
  }
  function projectById(id) {
    return readWs().projects.filter(function (p) { return p.id === id; })[0] || null;
  }
  function drawDetail() {
    var p = projectById(detail);
    if (!p) { detail = null; drawProjects(); return; }
    band(t("project"), stLabel(p.status) + (p.from === "snapshot" ? " · " + t("from_ceo") : ""), typeof p.progress === "number" ? num(p.progress) + "%" : null);
    var view = h("div", "read");
    view.appendChild(h("div", "ptitle", p.name));
    view.appendChild(h("p", "lead", stLabel(p.status) + (p.from === "snapshot" ? " · " + t("from_ceo") : "")));
    var progSec = section(t("progress"));
    if (typeof p.progress === "number") {
      progSec.appendChild(track(p.progress));
      progSec.appendChild(h("p", "fine", (p.id === "p_house01" ? "القواعد والأساسات " : "") + p.progress + "%"));
    } else progSec.appendChild(h("p", "empty", t("no_progress")));
    view.appendChild(progSec);
    var nextSec = section(t("step"));
    var nextLine = h("p", p.next ? "lead" : "empty", p.next || t("no_step"));
    nextLine.setAttribute("data-next", p.next || "");
    nextSec.appendChild(nextLine);
    view.appendChild(nextSec);
    var dueSec = section(t("due"));
    var dueLine = h("p", p.due ? "lead" : "empty", p.due || t("no_due"));
    dueLine.setAttribute("data-due", p.due || "");
    if (p.due) dueLine.dir = "ltr";
    dueSec.appendChild(dueLine);
    view.appendChild(dueSec);
    pages.appendChild(view);
    var tasks = section(t("tasks"));
    if (!p.tasks.length) tasks.appendChild(h("p", "empty", t("no_tasks")));
    p.tasks.forEach(function (task) {
      var row = h("button", "check");
      var box = h("i", "markbox" + (task.status === "done" ? " on" : ""));
      row.appendChild(box);
      row.appendChild(h("span", "", task.title));
      row.addEventListener("click", function () {
        var order = ["open", "doing", "done"];
        task.status = order[(order.indexOf(task.status) + 1) % order.length];
        saveProject(p, p.name, p.next, p.progress, p.due);
      });
      tasks.appendChild(row);
    });
    var add = h("button", "linkish", t("add_task"));
    add.addEventListener("click", function () {
      var titleIn = h("input");
      titleIn.maxLength = MAX_NAME;
      tasks.replaceChild(titleIn, add);
      titleIn.focus();
      titleIn.addEventListener("change", function () {
        var n = clip(titleIn.value, MAX_NAME);
        if (!n) { draw(); return; }
        if (p.tasks.length >= MAX_T) return note(t("limit"));
        p.tasks.push({ id: rid("t"), title: n, status: "open", next: "" });
        saveProject(p, p.name, p.next, p.progress, p.due);
      });
    });
    tasks.appendChild(add);
    pages.appendChild(tasks);
    var edit = h("button", "linkish", t("edit"));
    edit.addEventListener("click", function () { editSheet(p); });
    pages.appendChild(edit);
  }
  function editSheet(p) {
    var sheet = document.querySelector("#ask .sheet");
    sheet.textContent = "";
    var head = h("div", "band");
    head.appendChild(h("div", "display", t("edit")));
    head.appendChild(h("div", "sub", p.name));
    sheet.appendChild(head);
    if (typeof p.progress === "number") sheet.appendChild(track(p.progress));
    var name = h("input"); name.id = "hmk-name"; name.value = p.name; name.maxLength = MAX_NAME;
    var next = h("textarea"); next.id = "hmk-next"; next.value = p.next; next.maxLength = MAX_NEXT;
    var prog = h("input"); prog.id = "hmk-progress"; prog.value = p.progress == null ? "" : String(p.progress); prog.dir = "ltr"; prog.inputMode = "numeric";
    var due = h("input"); due.id = "hmk-due"; due.type = "date"; due.value = p.due || ""; due.setAttribute("data-field", "due");
    sheet.appendChild(h("label", "", t("name"))); sheet.appendChild(name);
    sheet.appendChild(h("label", "", t("step"))); sheet.appendChild(next);
    sheet.appendChild(h("label", "", t("progress"))); sheet.appendChild(prog);
    sheet.appendChild(h("label", "", t("due"))); sheet.appendChild(due);
    var states = h("div", "states");
    Object.keys(PSTAT).forEach(function (k) {
      var b = h("button", "stpick" + (k === p.status ? " on" : ""));
      b.appendChild(dot(k));
      b.appendChild(document.createTextNode(stLabel(k)));
      b.addEventListener("click", function () {
        p.status = k;
        states.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
      });
      states.appendChild(b);
    });
    sheet.appendChild(states);
    var yes = h("button", "primary", t("save"));
    var no = h("button", "", t("cancel"));
    var del = h("button", "", t("del"));
    yes.addEventListener("click", function () {
      var dueEl = document.getElementById("hmk-due");
      var nextEl = document.getElementById("hmk-next");
      ask.hidden = true;
      saveProject(p, name.value, nextEl ? nextEl.value : "", prog.value, dueEl ? dueEl.value : "");
    });
    no.addEventListener("click", function () { ask.hidden = true; pending = null; });
    del.addEventListener("click", function () {
      ask.hidden = true;
      confirmAsk(t("del_ask"), function () {
        var ws = readWs();
        ws.projects = ws.projects.filter(function (item) { return item.id !== p.id; });
        writeWs(ws);
        detail = null;
        draw();
      });
    });
    var acts = h("div", "actions");
    acts.appendChild(yes); acts.appendChild(no); acts.appendChild(del);
    sheet.appendChild(acts);
    ask.hidden = false;
    pending = null;
  }
  function saveProject(p, name, next, progress, due) {
    var ws = readWs();
    var cur = ws.projects.filter(function (item) { return item.id === p.id; })[0];
    if (!cur) return;
    cur.name = clip(name, MAX_NAME) || cur.name;
    cur.status = PSTAT[p.status] ? p.status : cur.status;
    if (next != null) cur.next = clip(next, MAX_NEXT);
    cur.tasks = p.tasks;
    if (p.icon) cur.icon = p.icon;
    if (p.from) cur.from = p.from;
    if (progress != null && String(progress).trim() !== "") {
      var n = Number(progress);
      if (n >= 0 && n <= 100) cur.progress = n;
    } else if (progress != null) delete cur.progress;
    if (due != null) cur.due = /^\d{4}-\d{2}-\d{2}$/.test(String(due).trim()) ? String(due).trim() : "";
    writeWs(ws);
    draw();
  }
  function templateFrom(idea) {
    var text = clip(idea, MAX_NAME);
    if (lang === "en") return { version: 1, idea: text, goal: clip("Finish “" + text + "” locally after your review", MAX_NEXT), steps: ["Define the result", "Do the first step", "Review what was saved"], task: clip("First task: define the result of “" + text + "”", MAX_NAME), ready: true };
    return { version: 1, idea: text, goal: clip("إنجاز «" + text + "» محلياً بعد مراجعتك", MAX_NEXT), steps: ["تحديد النتيجة", "تنفيذ الخطوة الأولى", "مراجعة ما حُفظ"], task: clip("أول مهمة: تحديد نتيجة «" + text + "»", MAX_NAME), ready: true };
  }
  function drawIdeas() {
    band(t("ideas"), lang === "en" ? "Snapshot ideas and yours" : "مرجع اللقطة وفكرتك");
    var ref = section(lang === "en" ? "Reference ideas" : "أفكار المرجع");
    if (!snap.ideas.length) ref.appendChild(h("p", "empty", t("no_ideas")));
    var ideaIcons = ["gem", "flag"];
    snap.ideas.forEach(function (line, i) {
      var row = h("div", "trow");
      row.appendChild(icon(ideaIcons[i] || "spark"));
      row.appendChild(h("div", "nm", line));
      ref.appendChild(row);
    });
    pages.appendChild(ref);
    var mine = section(lang === "en" ? "Your idea" : "فكرتك");
    if (!ideaOpen && !readDraft()) {
      var open = h("button", "jump", t("idea_new"));
      open.addEventListener("click", function () { ideaOpen = true; draw(); });
      mine.appendChild(open);
      pages.appendChild(mine);
      return;
    }
    ideaOpen = true;
    var draft = readDraft();
    var idea = h("textarea"); idea.maxLength = MAX_NAME; idea.placeholder = t("idea_ph");
    if (draft) idea.value = draft.idea;
    mine.appendChild(idea);
    var build = h("button", "", t("build"));
    build.addEventListener("click", function () {
      var text = clip(idea.value, MAX_NAME);
      if (!text) return note(t("need_idea"));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(templateFrom(text)));
      draw();
    });
    mine.appendChild(build);
    draft = readDraft();
    if (draft && draft.ready) {
      mine.appendChild(h("p", "", draft.goal));
      var ol = h("ol", "steps");
      (draft.steps || []).forEach(function (s) { ol.appendChild(h("li", "", s)); });
      mine.appendChild(ol);
      mine.appendChild(h("p", "", draft.task));
      var goal = h("textarea"); goal.value = draft.goal || "";
      var task = h("input"); task.value = draft.task || "";
      mine.appendChild(h("label", "", t("goal"))); mine.appendChild(goal);
      mine.appendChild(h("label", "", t("first_task"))); mine.appendChild(task);
      var yes = h("button", "primary", t("confirm_create"));
      var no = h("button", "", t("cancel"));
      yes.addEventListener("click", function () {
        var ws = readWs();
        if (ws.projects.length >= MAX_P) return note(t("limit"));
        var goalText = clip(goal.value, MAX_NEXT), tk = clip(task.value, MAX_NAME);
        if (!goalText || !tk) return note(t("need_both"));
        ws.projects.push({ id: rid("p"), name: clip(draft.idea, MAX_NAME) || "مشروع", status: "wait", next: goalText, icon: "spark", tasks: [{ id: rid("t"), title: tk, status: "open", next: "" }] });
        writeWs(ws);
        localStorage.removeItem(DRAFT_KEY);
        ideaOpen = false;
        note(t("created"));
        draw();
      });
      no.addEventListener("click", function () { localStorage.removeItem(DRAFT_KEY); ideaOpen = false; draw(); });
      var acts = h("div", "actions"); acts.appendChild(yes); acts.appendChild(no); mine.appendChild(acts);
    }
    pages.appendChild(mine);
  }
  function choice(label, value, on) {
    var b = h("button", "trow");
    b.appendChild(h("div", "nm", label));
    b.appendChild(h("span", "tag go", value));
    b.addEventListener("click", on);
    return b;
  }
  function drawMore() {
    band(t("tools"), theme === "uae" ? t("uae") : t("alain"));
    segBar([["run", t("seg_tools")], ["set", t("seg_set")], ["file", t("seg_file")]], toolSeg, function (id) { toolSeg = id; draw(); });
    var rows = h("div", "rows");
    if (toolSeg === "set") {
      rows.appendChild(choice(t("language"), lang === "en" ? t("en") : t("ar"), function () { setLang(lang === "ar" ? "en" : "ar"); }));
      rows.appendChild(choice(t("theme"), theme === "uae" ? t("uae") : t("alain"), function () { setTheme(theme === "alain" ? "uae" : "alain"); }));
      var sizes = ["s", "m", "l"], sizeName = { s: t("small"), m: t("medium"), l: t("large") };
      rows.appendChild(choice(t("size"), sizeName[textSize], function () { setPref("hmk_size_v1", sizes[(sizes.indexOf(textSize) + 1) % sizes.length], "size"); }));
      rows.appendChild(choice(t("digits"), digits === "arab" ? "١٢٣" : "123", function () { setPref("hmk_digits_v1", digits === "arab" ? "latn" : "arab", "digits"); }));
      var starts = ["home", "projects", "ideas", "more"], startName = { home: t("home"), projects: t("projects"), ideas: t("ideas"), more: t("tools") };
      rows.appendChild(choice(t("start"), startName[startPage], function () { setPref("hmk_start_v1", starts[(starts.indexOf(startPage) + 1) % starts.length], "start"); }));
      rows.appendChild(choice(t("density"), density === "comfortable" ? t("comfortable") : t("compact"), function () { setPref("hmk_density_v1", density === "compact" ? "comfortable" : "compact", "density"); }));
      var info = window.HMK_BUILD || { version: "1.9-debug", sha: "dev" };
      try {
        if (window.HmkAndroid && HmkAndroid.buildId) {
          var parts = String(HmkAndroid.buildId()).split(" ");
          if (parts[0]) info = { version: parts[0], sha: parts.slice(1).join(" ") || info.sha };
        }
      } catch (e) {}
      var about = h("div", "trow");
      about.appendChild(h("div", "nm", t("about")));
      var ver = h("span", "tag", info.version);
      ver.dir = "ltr";
      about.appendChild(ver);
      var sha = h("div", "sub", String(info.sha || ""));
      sha.dir = "ltr";
      about.appendChild(sha);
      rows.appendChild(about);
    } else if (toolSeg === "file") {
      var ws = readWs();
      var taskN = 0;
      ws.projects.forEach(function (p) { taskN += p.tasks.length; });
      var last = localStorage.getItem("hmk_last_export_v1");
      function infoRow(label, value) {
        var row = h("div", "trow");
        row.appendChild(h("div", "nm", label));
        var v = h("span", "tag", value);
        row.appendChild(v);
        return row;
      }
      rows.appendChild(infoRow(t("last_export"), last ? when(last) : t("never")));
      rows.appendChild(infoRow(t("counts"), num(ws.projects.length) + " · " + num(taskN) + " · " + num((snap.ideas || []).length)));
      rows.appendChild(infoRow(t("storage"), num(storageBytes()) + (lang === "en" ? " chars" : " حرف")));
      rows.appendChild(h("p", "fine", t("local_only")));
      function fileRow(label, kind) {
        var b = h("button", "trow");
        b.appendChild(h("div", "nm", label));
        var input = h("input"); input.type = "file"; input.accept = "application/json,.json";
        input.addEventListener("change", function () { if (input.files && input.files[0]) readFile(input.files[0], kind); input.value = ""; });
        b.addEventListener("click", function () { input.click(); });
        b.appendChild(input);
        return b;
      }
      var exp = h("button", "trow");
      exp.appendChild(h("div", "nm", t("export")));
      exp.addEventListener("click", exportWs);
      rows.appendChild(exp);
      rows.appendChild(fileRow(t("restore"), "workspace"));
      rows.appendChild(fileRow(t("import_snap"), "snapshot"));
      var clear = h("button", "trow");
      clear.appendChild(h("div", "nm", t("clear")));
      clear.addEventListener("click", function () {
        confirmAsk(t("clear_ask"), function () {
          writeWs(emptyWs());
          localStorage.removeItem(DRAFT_KEY);
          note(t("cleared"));
          draw();
        });
      });
      rows.appendChild(clear);
    } else {
      CONNECTORS.forEach(function (c) { rows.appendChild(connectorRow(c)); });
      snap.tools.forEach(function (tool) {
        if (tool.name === "Exa · Bright Data · Apify" || tool.name === "GitHub · Shopify · X") return;
        rows.appendChild(toolRow(tool));
      });
      refreshConnectors();
    }
    pages.appendChild(rows);
  }
  function exportWs() {
    var blob = new Blob([JSON.stringify(readWs(), null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "hmk-workspace.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    localStorage.setItem("hmk_last_export_v1", new Date().toISOString());
    if (tab === "more" && toolSeg === "file") draw();
  }
  function readFile(file, kind) {
    if (file.size > MAX_FILE) return note(t("big_file"));
    var reader = new FileReader();
    reader.onload = function () {
      var text = String(reader.result || "");
      var parsed = null;
      try { parsed = JSON.parse(text); } catch (e) { return note(t("bad_file")); }
      if (kind === "workspace") {
        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.projects) || parsed.projects.length > MAX_P || !parsed.projects.every(validProject)) return note(t("bad_ws"));
        confirmAsk(t("replace_ws"), function () { writeWs(parsed); note(t("restored")); draw(); });
      } else {
        var nextSnap = validSnap(parsed);
        if (!nextSnap) return note(t("bad_snap"));
        confirmAsk(t("replace_snap") + " " + when(nextSnap.generatedAt), function () {
          localStorage.setItem(SNAP_KEY, JSON.stringify(nextSnap));
          snap = nextSnap;
          note(t("imported"));
          draw();
        });
      }
    };
    reader.readAsText(file);
  }
  function confirmAsk(text, yes) {
    pending = yes;
    var sheet = document.querySelector("#ask .sheet");
    sheet.textContent = "";
    sheet.appendChild(h("p", "", text));
    var yesB = h("button", "primary", t("confirm"));
    var noB = h("button", "", t("cancel"));
    yesB.addEventListener("click", function () {
      var fn = pending; pending = null; ask.hidden = true; if (fn) fn();
    });
    noB.addEventListener("click", function () { pending = null; ask.hidden = true; });
    var acts = h("div", "actions");
    acts.appendChild(yesB); acts.appendChild(noB);
    sheet.appendChild(acts);
    ask.hidden = false;
  }
  document.getElementById("ask-yes").addEventListener("click", function () {
    var fn = pending; pending = null; ask.hidden = true; if (fn) fn();
  });
  document.getElementById("ask-no").addEventListener("click", function () { pending = null; ask.hidden = true; });
  document.getElementById("enter").addEventListener("click", function () {
    document.getElementById("open").hidden = true;
    if (startPage && startPage !== "home") setTab(startPage);
  });
  document.querySelectorAll("#langs button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  document.querySelectorAll("#themes button").forEach(function (b) {
    b.addEventListener("click", function () { setTheme(b.getAttribute("data-theme")); });
  });
  document.getElementById("quick").addEventListener("click", function () {
    document.getElementById("open").hidden = true;
    if (tab === "ideas") { ideaOpen = true; draw(); return; }
    addOpen = true;
    setTab("projects");
  });
  if (/[?&]open=0/.test(location.search)) document.getElementById("open").hidden = true;
  applyTheme();
  back.addEventListener("click", function () { detail = null; draw(); });
  document.querySelectorAll("footer button").forEach(function (b) {
    b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
  });
  ensureSeed();
  var stored = validSnap(readJson(SNAP_KEY));
  if (stored && !stored.sample) { snap = stored; draw(); }
  else loadSample(draw);
})();
