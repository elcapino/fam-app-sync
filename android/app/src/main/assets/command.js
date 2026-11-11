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
      tab_sum:"ملخص", tab_hq:"مقر", tab_proj:"مشاريع", tab_agency:"وكالة", tab_house:"بيت", tab_market:"سوق", tab_spend:"إنفاق", tab_ideas:"أفكار", tab_reports:"تقارير",
      add:"إضافة",
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
      tab_sum:"Home", tab_hq:"HQ", tab_proj:"Work", tab_agency:"Agency", tab_house:"House", tab_market:"Market", tab_spend:"Spend", tab_ideas:"Ideas", tab_reports:"Files",
      add:"Add",
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
    flag: "M5 3v18 M5 4h11l-2 4 2 4H5",
    clock: "M12 7v6l4 2 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
  };
  var tab = "sum";
  var projIndex = 0;
  var spendSeg = "money";
  var sumSeg = "day";
  var reportSeg = "list";
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
    var addLabel = document.getElementById("addlabel");
    if (addLabel) addLabel.textContent = t("add");
    var refreshLabel = document.getElementById("refreshlabel");
    if (refreshLabel && !refreshing) refreshLabel.textContent = lang === "en" ? "Sync" : "تحديث";
    var navT = { sum: "tab_sum", hq: "tab_hq", proj: "tab_proj", agency: "tab_agency", house: "tab_house", market: "tab_market", spend: "tab_spend", ideas: "tab_ideas", reports: "tab_reports" };
    document.querySelectorAll("footer button").forEach(function (b) {
      var last = b.lastChild;
      var key = navT[b.getAttribute("data-tab")];
      if (last && last.nodeType === 3 && key) last.textContent = t(key);
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
  var LINKS = {
    "Claude": "https://www.anthropic.com",
    "Gemini": "https://gemini.google.com",
    "DeepSeek": "https://www.deepseek.com",
    "NotebookLM": "https://notebooklm.google.com",
    "Exa": "https://exa.ai",
    "Bright Data": "https://brightdata.com",
    "Apify": "https://apify.com",
    "GitHub": "https://github.com",
    "Shopify": "https://www.shopify.com",
    "X": "https://x.com",
    "ChatGPT / Codex": "https://chatgpt.com"
  };
  var FEEDS = [
    { source: "WAM", url: "https://news.google.com/rss/search?q=site:wam.ae&hl=ar&gl=AE&ceid=AE:ar" },
    { source: "The National", url: "https://www.thenationalnews.com/arc/outboundfeeds/rss/?outputType=xml" },
    { source: "Gulf News", url: "https://gulfnews.com/stories.rss" },
    { source: "The Verge", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
    { source: "CNBC", url: "https://www.cnbc.com/id/100003114/device/rss/rss.html" }
  ];
  var NEWS_KEY = "hmk_news_v1";
  var news = { at: "", items: [], feeds: [] };
  var refreshing = false;
  var ideaSeg = "solve";
  function hostOf(url) { return String(url || "").replace(/^https:\/\//, "").replace(/\/.*$/, ""); }
  function openUrl(url) {
    if (!/^https:\/\/\S+$/.test(url) || url.length > 2000) return;
    if (window.HmkAndroid && HmkAndroid.openLink) { try { HmkAndroid.openLink(url); return; } catch (e) {} }
    window.open(url, "_blank", "noopener");
  }
  function decodeXml(s) {
    return String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;|&apos;/g, "'").replace(/\s+/g, " ").trim();
  }
  function parseFeed(xml, source) {
    var out = [];
    String(xml || "").split(/<item\b|<entry\b/i).slice(1, 4).forEach(function (chunk) {
      var title = decodeXml((chunk.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]).slice(0, 180);
      var href = chunk.match(/<link[^>]*href=["'](https:[^"']+)["']/i);
      var text = chunk.match(/<link[^>]*>(https:[^<]+)<\/link>/i);
      var link = decodeXml((href && href[1]) || (text && text[1]) || "").trim();
      var date = decodeXml((chunk.match(/<(?:pubDate|updated|published)[^>]*>([\s\S]*?)<\/(?:pubDate|updated|published)>/i) || [])[1]);
      if (title && /^https:\/\/\S+$/.test(link) && link.length < 2000) out.push({ title: title, link: link, source: source, date: date });
    });
    return out;
  }
  function loadNews() {
    try {
      var saved = JSON.parse(localStorage.getItem(NEWS_KEY) || "");
      if (saved && Array.isArray(saved.items)) news = { at: saved.at || "", items: saved.items.slice(0, 24), feeds: saved.feeds || [] };
    } catch (e) {}
  }
  function saveNews() {
    try { localStorage.setItem(NEWS_KEY, JSON.stringify(news)); } catch (e) {}
  }
  function pullFeed(url) {
    if (window.HmkAndroid && HmkAndroid.fetchPublic) {
      try { return Promise.resolve(HmkAndroid.fetchPublic(url) || ""); } catch (e) { return Promise.resolve(""); }
    }
    return fetch(url).then(function (res) { return res.ok ? res.text() : ""; }).catch(function () { return ""; });
  }
  function reloadSnap() {
    return new Promise(function (resolve) {
      var req = new XMLHttpRequest();
      req.open("GET", "status-snapshot.sample.json", true);
      req.onload = function () {
        var parsed = null;
        try { parsed = JSON.parse(req.responseText); } catch (e) { parsed = null; }
        var next = validSnap(parsed);
        if (next) snap = next;
        resolve(!!next);
      };
      req.onerror = function () { resolve(false); };
      req.send();
    });
  }
  function refreshAll() {
    if (refreshing) return;
    refreshing = true;
    var btn = document.getElementById("refreshlabel");
    if (btn) btn.textContent = "…";
    reloadSnap().then(function () {
      return Promise.all(FEEDS.map(function (f) {
        return pullFeed(f.url).then(function (body) {
          var parsed = body && body.indexOf("<") !== -1 ? parseFeed(body, f.source) : [];
          return { source: f.source, url: f.url, ok: parsed.length > 0, count: parsed.length, items: parsed };
        });
      }));
    }).then(function (results) {
      var items = [];
      results.forEach(function (r) { r.items.forEach(function (item) { if (items.length < 24) items.push(item); }); });
      if (items.length) news = { at: new Date().toISOString(), items: items, feeds: results.map(function (r) { return { source: r.source, url: r.url, ok: r.ok, count: r.count }; }) };
      else news.feeds = results.map(function (r) { return { source: r.source, url: r.url, ok: false, count: 0 }; });
      saveNews();
      if (window.HmkAndroid && HmkAndroid.checkConnectors) {
        connectorChecked = false;
        try { refreshConnectors(); } catch (e) {}
      }
    }).then(function () {
      refreshing = false;
      if (btn) btn.textContent = lang === "en" ? "Sync" : "تحديث";
      draw();
    }, function () {
      refreshing = false;
      if (btn) btn.textContent = lang === "en" ? "Sync" : "تحديث";
      draw();
    });
  }
  function projectById(id) {
    return readWs().projects.filter(function (p) { return p.id === id; })[0] || null;
  }
  function fillRows(rows) {
    var seen = {};
    Array.prototype.forEach.call(rows.children, function (el) {
      var nm = el.querySelector(".nm");
      if (nm) seen[nm.textContent] = true;
    });
    var extra = [];
    (snap.happened || []).forEach(function (text) { extra.push(line("flag", text, lang === "en" ? "Done in the snapshot" : "تم في اللقطة", lang === "en" ? "Done" : "تم", "done")); });
    (snap.brief || []).forEach(function (b) { extra.push(line("news", b.title, b.source || t("brief"), b.date, "wait")); });
    (snap.next || []).forEach(function (text) { extra.push(line("flag", text, t("next"), lang === "en" ? "Open" : "مفتوح", "wait")); });
    extra.forEach(function (row) {
      if (rows.children.length >= 14) return;
      var nm = row.querySelector(".nm").textContent;
      if (seen[nm]) return;
      seen[nm] = true;
      rows.appendChild(row);
    });
  }
  function paintProject(p, extra) {
    if (!p) { pages.appendChild(h("p", "empty", t("no_projects"))); return; }
    band(p.name, (extra || stLabel(p.status)) + (typeof p.progress === "number" ? " · " + num(p.progress) + "%" : ""));
    var rows = h("div", "rows");
    var paper = p.id === "p_markets1";
    rows.appendChild(line(p.icon || "crown", p.name, paper ? (lang === "en" ? "Paper only · no live order" : "ورقي فقط · لا أمر حقيقي") : (p.from === "snapshot" ? t("from_ceo") : t("file")), paper ? (lang === "en" ? "Paper" : "ورقي") : stLabel(p.status), paper ? "wait" : statusClass(p.status)));
    var nextLine = line("flag", t("step"), p.next || t("no_step"), p.next ? (lang === "en" ? "Set" : "مكتوب") : (lang === "en" ? "Empty" : "فارغ"), p.next ? "running" : "wait");
    nextLine.setAttribute("data-next", p.next || "");
    rows.appendChild(nextLine);
    var dueShown = p.due ? ((lang === "en" ? "Dubai · " : "دبي · ") + p.due) : t("no_due");
    var dueLine = line("note", t("due"), dueShown, p.due ? dueShown : t("no_due"), p.due ? "wait" : "bad");
    dueLine.setAttribute("data-due", p.due || "");
    rows.appendChild(dueLine);
    var prog = line("chart", t("progress"), typeof p.progress === "number" ? num(p.progress) + "%" : t("no_progress"), stLabel(p.status), statusClass(p.status));
    rows.appendChild(prog);
    rows.appendChild(line("note", lang === "en" ? "Updated" : "آخر تحديث", when(snap.generatedAt), num((p.tasks || []).length) + (lang === "en" ? " tasks" : " مهام"), "wait"));
    (p.tasks || []).forEach(function (task) {
      rows.appendChild(line("flag", task.title, t("tasks"), task.status === "done" ? t("st_done") : t("st_wait"), statusClass(task.status)));
    });
    var edit = h("button", "trow prow");
    edit.appendChild(icon("note"));
    edit.appendChild(h("div", "nm", t("edit")));
    edit.appendChild(h("div", "sub", lang === "en" ? "Name, step, progress, date" : "الاسم والخطوة والتقدم والموعد"));
    edit.addEventListener("click", function () { editSheet(p); });
    rows.appendChild(edit);
    fillRows(rows);
    pages.appendChild(rows);
  }
  function newsLine(item) {
    return line("news", item.title, item.source + " · " + (when(item.date) || when(news.at)), item.source, "wait", item.link);
  }
  function drawSum() {
    var list = readWs().projects;
    var c = counts();
    var stamp = news.at ? when(news.at) : when(snap.generatedAt);
    band(t("tab_sum"), (lang === "en" ? "Dubai " : "دبي ") + stamp, num(list.length));
    segBar([
      ["day", lang === "en" ? "Day" : "اليوم"],
      ["events", lang === "en" ? "Events" : "أحداث"],
      ["news", lang === "en" ? "News" : "أخبار"],
      ["set", lang === "en" ? "Settings" : "ضبط"]
    ], sumSeg === "now" ? "day" : sumSeg, function (id) { sumSeg = id; draw(); });
    var rows = h("div", "rows");
    if (sumSeg === "set") { drawSettings(rows); pages.appendChild(rows); return; }
    if (sumSeg === "news") {
      rows.appendChild(line("clock", lang === "en" ? "Last refresh" : "آخر تحديث", news.at ? (lang === "en" ? "Asia/Dubai, on this device" : "توقيت دبي، على هذا الجهاز") : (lang === "en" ? "Press refresh" : "اضغط تحديث"), news.at ? when(news.at) : "—", news.at ? "running" : "wait"));
      var failed = (news.feeds || []).filter(function (f) { return !f.ok; });
      if (news.items.length) news.items.slice(0, 6).forEach(function (item) { rows.appendChild(newsLine(item)); });
      else if (!news.at) FEEDS.forEach(function (f) { rows.appendChild(line("news", f.source, lang === "en" ? "Public feed · press Sync" : "موجز عام · اضغط تحديث", lang === "en" ? "Ready" : "جاهز", "wait", f.source === "WAM" ? "https://www.wam.ae/en" : f.url)); });
      failed.forEach(function (f) {
        var home = f.source === "WAM" ? "https://www.wam.ae/en" : (f.source === "The National" ? "https://www.thenationalnews.com" : f.url);
        rows.appendChild(line("news", f.source, lang === "en" ? "This refresh returned no items" : "هذا التحديث لم يُرجع عناصر", lang === "en" ? "Failed" : "تعذر", "bad", home));
      });
      pages.appendChild(rows);
      return;
    }
    if (sumSeg === "events") {
      rows.appendChild(line("flag", lang === "en" ? "This week" : "هذا الأسبوع", lang === "en" ? "Snapshot dates and open decisions" : "مواعيد اللقطة والقرارات المفتوحة", when(snap.generatedAt), "wait"));
      (snap.brief || []).forEach(function (b) { rows.appendChild(line("news", b.title, (b.source || t("brief")) + " · " + (lang === "en" ? "Dated" : "بتاريخ"), b.date, "wait")); });
      (snap.next || []).forEach(function (item) { rows.appendChild(line("flag", item, lang === "en" ? "Open this week" : "مفتوح هذا الأسبوع", lang === "en" ? "Open" : "مفتوح", "wait")); });
      (snap.happened || []).forEach(function (text) { rows.appendChild(line("flag", text, lang === "en" ? "Done" : "تم", lang === "en" ? "Done" : "تم", "done")); });
      pages.appendChild(rows);
      return;
    }
    var late = line("flag", t("late"), t("all") + " " + num(c.all) + " · " + t("going") + " " + num(c.go) + " · " + t("done") + " " + num(c.done), num(c.late) + " " + t("late"), c.late ? "bad" : "running");
    late.classList.add("sum");
    late.setAttribute("data-late", String(c.late));
    rows.appendChild(late);
    var house = projectById("p_house01");
    var market = projectById("p_markets1");
    if (house) rows.appendChild(line("house", house.name, house.next || t("no_step"), stLabel(house.status), statusClass(house.status)));
    if (market) rows.appendChild(line("chart", market.name, (lang === "en" ? "Paper only · " : "ورقي فقط · ") + (market.next || t("no_step")), lang === "en" ? "Paper" : "ورقي", "wait"));
    (snap.tools || []).forEach(function (tool) {
      if (!moneyOf(tool.cost) || rows.querySelector("[data-spend]")) return;
      var row = line(tool.icon || "spark", tool.name, (lang === "en" ? "Spend" : "إنفاق") + " · " + hostOf(LINKS[tool.name] || ""), tool.cost, "running", LINKS[tool.name]);
      row.setAttribute("data-spend", "1");
      rows.appendChild(row);
    });
    (snap.next || []).forEach(function (item) { rows.appendChild(line("flag", item, t("next"), lang === "en" ? "Open" : "مفتوح", "wait")); });
    (snap.computers || []).forEach(function (m) {
      rows.appendChild(line(m.online ? "laptop" : "phone", m.name, m.online ? (lang === "en" ? "Online in the snapshot" : "متصل في اللقطة") : (lang === "en" ? "Not linked" : "غير مربوط"), m.online ? (lang === "en" ? "Online" : "متصل") : (lang === "en" ? "Offline" : "غير مربوط"), m.online ? "running" : "bad"));
    });
    (snap.brief || []).forEach(function (b) { rows.appendChild(line("news", b.title, (b.source || t("brief")) + " · " + b.date, b.date, "wait")); });
    if (news.items.length) news.items.slice(0, 2).forEach(function (item) { rows.appendChild(newsLine(item)); });
    else rows.appendChild(line("news", lang === "en" ? "News" : "الأخبار", lang === "en" ? "WAM, The National, Gulf News, tech, markets" : "وام والناشيونال وخليج نيوز والتقنية والأسواق", lang === "en" ? "Refresh" : "تحديث", "wait"));
    pages.appendChild(rows);
  }
  function drawHq() {
    band(t("tab_hq"), lang === "en" ? "Team and devices from the 9 Nov snapshot" : "الفريق والأجهزة من لقطة 9 نوفمبر");
    var rows = h("div", "rows");
    (snap.team || []).forEach(function (m) { rows.appendChild(line(m.icon || "crown", m.name, m.role, lang === "en" ? "Recorded" : "مسجّل", "wait")); });
    (snap.computers || []).forEach(function (m) {
      rows.appendChild(line(m.online ? "laptop" : "phone", m.name, m.online ? (lang === "en" ? "Online in the snapshot" : "متصل في اللقطة") : (lang === "en" ? "Not linked" : "غير مربوط"), m.online ? (lang === "en" ? "Online" : "متصل") : (lang === "en" ? "Offline" : "غير مربوط"), m.online ? "running" : "bad"));
    });
    (snap.ceoNow || []).forEach(function (text) { rows.appendChild(line("crown", text, lang === "en" ? "CEO now" : "الآن عند المدير", lang === "en" ? "Now" : "الآن", "wait")); });
    pages.appendChild(rows);
  }
  function drawProjPage() {
    var list = readWs().projects;
    if (!list.length) { band(t("tab_proj"), t("no_projects")); return; }
    if (projIndex >= list.length) projIndex = 0;
    if (addOpen) {
      band(t("tab_proj"), t("add"));
      var name = h("input"); name.maxLength = MAX_NAME; name.placeholder = t("name");
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
        projIndex = ws.projects.length - 1;
        draw();
      });
      pages.appendChild(add);
      return;
    }
    var p = list[projIndex];
    paintProject(p, (lang === "en" ? "Swipe" : "اسحب") + " · " + num(projIndex + 1) + " / " + num(list.length));
    var bar = h("div", "seg");
    var prev = h("button", "", lang === "en" ? "Previous" : "السابق");
    var mid = h("button", "on", num(projIndex + 1) + " / " + num(list.length));
    var next = h("button", "", lang === "en" ? "Next" : "التالي");
    prev.addEventListener("click", function () { projIndex = (projIndex - 1 + list.length) % list.length; draw(); });
    next.addEventListener("click", function () { projIndex = (projIndex + 1) % list.length; draw(); });
    bar.appendChild(prev); bar.appendChild(mid); bar.appendChild(next);
    pages.appendChild(bar);
  }
  function drawFixedProject(id) {
    paintProject(projectById(id), t("from_ceo"));
  }
  function drawAgency() {
    band(t("tab_agency"), lang === "en" ? "WhatsApp report in the 9 Nov snapshot" : "تقرير واتساب في لقطة 9 نوفمبر");
    var rows = h("div", "rows");
    (snap.ceoNow || []).concat(snap.happened || []).filter(function (x) { return /واتساب|وكالة/.test(x); }).forEach(function (x) {
      rows.appendChild(line("spark", x, lang === "en" ? "From the CEO snapshot" : "من لقطة المدير", lang === "en" ? "Recorded" : "مسجّل", "wait"));
    });
    if (!rows.children.length) rows.appendChild(line("spark", t("tab_agency"), lang === "en" ? "No agency record in this snapshot" : "لا سجل وكالة في هذه اللقطة", lang === "en" ? "Empty" : "فارغ", "bad"));
    (snap.programs || []).forEach(function (name) { rows.appendChild(line("store", name, lang === "en" ? "Program in the snapshot" : "برنامج في اللقطة", lang === "en" ? "Listed" : "مدرج", "running")); });
    fillRows(rows);
    pages.appendChild(rows);
  }
  function moneyOf(cost) {
    var m = /\$([0-9.]+)\s*\/\s*\$([0-9.]+)/.exec(cost || "");
    if (!m) return null;
    return { used: m[1], cap: m[2], pct: Math.round(100 * Number(m[1]) / Number(m[2])) };
  }
  function drawSpend() {
    band(lang === "en" ? "Spend and caps" : "الإنفاق والسقوف", when(snap.generatedAt));
    segBar([
      ["money", lang === "en" ? "Spend" : "الإنفاق"],
      ["use", lang === "en" ? "Usage" : "الاستهلاك"],
      ["tools", lang === "en" ? "Tools" : "الأدوات"],
      ["sugg", lang === "en" ? "Ideas" : "اقتراحات"]
    ], spendSeg, function (id) { spendSeg = id; draw(); });
    var rows = h("div", "rows");
    if (spendSeg === "use") {
      (snap.tools || []).forEach(function (tool) {
        if (tool.name === "Exa · Bright Data · Apify" || tool.name === "GitHub · Shopify · X") return;
        var meta = ROLE[tool.name] || ["", ""];
        rows.appendChild(line(tool.icon || "spark", tool.name, (lang === "en" ? meta[1] : meta[0]) + " · " + when(tool.lastRun), healthLabel(tool.state), statusClass(tool.state), LINKS[tool.name]));
      });
    } else if (spendSeg === "tools") {
      rows.appendChild(groupRow(["brightdata", "exa", "apify"], lang === "en" ? "Collection" : "الجمع", "Exa · Bright Data · Apify", "link"));
      rows.appendChild(groupRow(["github", "shopify", "x"], lang === "en" ? "Accounts" : "الحسابات", "GitHub · Shopify · X", "store"));
      CONNECTORS.forEach(function (c) { rows.appendChild(connectorRow(c)); });
      ["Claude", "Gemini", "DeepSeek", "NotebookLM"].forEach(function (name) {
        var tool = (snap.tools || []).filter(function (item) { return item.name === name; })[0];
        if (!tool) return;
        rows.appendChild(line(tool.icon || "spark", tool.name, (lang === "en" ? "Writing tool · " : "أداة كتابة · ") + hostOf(LINKS[name] || ""), tool.cost || healthLabel(tool.state), statusClass(tool.state), LINKS[name]));
      });
      refreshConnectors();
    } else if (spendSeg === "sugg") {
      (snap.ideas || []).forEach(function (text) { rows.appendChild(line("spark", text, lang === "en" ? "Idea in the snapshot" : "فكرة في اللقطة", lang === "en" ? "Review" : "مراجعة", "wait")); });
      (snap.next || []).forEach(function (text) { rows.appendChild(line("flag", text, t("next"), lang === "en" ? "Open" : "مفتوح", "wait")); });
    } else {
      (snap.tools || []).forEach(function (tool) {
        if (tool.name === "Exa · Bright Data · Apify" || tool.name === "GitHub · Shopify · X") return;
        var money = moneyOf(tool.cost);
        var meta = ROLE[tool.name] || ["", ""];
        var role = lang === "en" ? meta[1] : meta[0];
        if (tool.state === "hold") role = lang === "en" ? "Paper only · no live order" : "ورقي فقط · لا أمر حقيقي";
        var link = LINKS[tool.name];
        rows.appendChild(line(tool.icon || "spark", tool.name, role + (link ? " · " + hostOf(link) : ""), money ? "$" + money.used + " / $" + money.cap : (tool.cost || ""), tool.state === "hold" ? "bad" : (money && money.pct >= 80 ? "bad" : "running"), link));
      });
    }
    pages.appendChild(rows);
  }
  function drawReports() {
    band(t("tab_reports"), lang === "en" ? "9 Nov brief and local file" : "موجز 9 نوفمبر والملف المحلي");
    segBar([
      ["list", lang === "en" ? "Brief" : "الموجز"],
      ["week", lang === "en" ? "Week" : "أسبوع"],
      ["file", t("seg_file")]
    ], reportSeg, function (id) { reportSeg = id; draw(); });
    var rows = h("div", "rows");
    if (reportSeg === "file") { drawFile(rows); pages.appendChild(rows); return; }
    if (reportSeg === "week") {
      rows.appendChild(line("flag", lang === "en" ? "Week of 9 Nov" : "أسبوع 9 نوفمبر", lang === "en" ? "Dates kept in the snapshot" : "المواعيد المحفوظة في اللقطة", when(snap.generatedAt), "wait"));
      (snap.brief || []).forEach(function (b) { rows.appendChild(line("news", b.title, b.source || t("brief"), b.date, "wait")); });
      (snap.next || []).forEach(function (text) { rows.appendChild(line("flag", text, lang === "en" ? "Still open" : "ما زال مفتوحاً", lang === "en" ? "Open" : "مفتوح", "wait")); });
      (snap.ceoNow || []).forEach(function (text) { rows.appendChild(line("crown", text, lang === "en" ? "This week" : "هذا الأسبوع", lang === "en" ? "Now" : "الآن", "wait")); });
      pages.appendChild(rows);
      return;
    }
    (snap.brief || []).forEach(function (b) { rows.appendChild(line("news", b.title, (b.source || "") + (b.url ? " · " + hostOf(b.url) : ""), b.date, "wait", /^https:\/\//.test(b.url || "") ? b.url : "")); });
    (snap.happened || []).forEach(function (text) { rows.appendChild(line("flag", text, lang === "en" ? "Done in the snapshot" : "تم في اللقطة", lang === "en" ? "Done" : "تم", "done")); });
    (news.items || []).slice(0, 4).forEach(function (item) { rows.appendChild(newsLine(item)); });
    pages.appendChild(rows);
  }
  function draw() {
    pages.textContent = "";
    back.hidden = true;
    var names = { sum: t("tab_sum"), hq: t("tab_hq"), proj: t("tab_proj"), agency: t("tab_agency"), house: t("tab_house"), market: t("tab_market"), spend: t("tab_spend"), ideas: t("tab_ideas"), reports: t("tab_reports") };
    title.textContent = names[tab] || t("tab_sum");
    if (tab === "hq") drawHq();
    else if (tab === "proj") drawProjPage();
    else if (tab === "agency") drawAgency();
    else if (tab === "house") drawFixedProject("p_house01");
    else if (tab === "market") drawFixedProject("p_markets1");
    else if (tab === "spend") drawSpend();
    else if (tab === "ideas") drawIdeas();
    else if (tab === "reports") drawReports();
    else drawSum();
    document.querySelectorAll("footer button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === tab); });
  }
  function statusClass(code) {
    if (code === "go" || code === "running" || code === "doing") return "running";
    if (code === "done") return "done";
    if (code === "hold" || code === "stopped") return "bad";
    return "wait";
  }
  function line(iconName, name, sub, status, tone, url) {
    var row = h(url ? "button" : "div", "trow");
    if (iconName) row.appendChild(icon(iconName));
    row.appendChild(h("div", "nm", name));
    if (status != null && status !== "") row.appendChild(h("span", "tag " + (tone || ""), status));
    if (sub) row.appendChild(h("div", "sub", sub));
    if (url) {
      row.setAttribute("data-url", url);
      row.addEventListener("click", function () { openUrl(url); });
    }
    if (iconName === "news") row.classList.add("clip2");
    return row;
  }
  function projectRow(p) {
    var row = h("button", "trow prow");
    row.appendChild(icon(p.icon || "crown"));
    row.appendChild(h("div", "nm", p.name));
    row.appendChild(h("span", "tag " + statusClass(p.status), stLabel(p.status)));
    var bits = [];
    if (p.next) bits.push(p.next);
    if (typeof p.progress === "number") bits.push(num(p.progress) + "%");
    if (p.due) bits.push(p.due);
    row.appendChild(h("div", "sub", bits.join(" · ") || t("no_step")));
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
  function groupRow(ids, name, sub, iconName) {
    var rank = { ok: 0, wait: 1, nokey: 2, fail: 3, badkey: 4 };
    var result = "ok";
    ids.forEach(function (id) {
      var cur = connectorResult(id);
      if ((rank[cur] || 0) > (rank[result] || 0)) result = cur;
    });
    var tone = result === "ok" ? "running" : "bad";
    return line(iconName, name, sub, t("c_" + result), tone);
  }
  function connectorRow(c) {
    var result = connectorResult(c.id);
    if (result !== "ok" && result !== "nokey" && result !== "badkey" && result !== "fail" && result !== "wait") result = "fail";
    var link = LINKS[c.name] || "";
    var row = h(link ? "button" : "div", "trow");
    row.setAttribute("data-connector", c.id);
    if (link) {
      row.setAttribute("data-url", link);
      row.addEventListener("click", function () { openUrl(link); });
    }
    row.appendChild(icon(c.icon));
    row.appendChild(h("div", "nm", c.name));
    var tag = h("span", "tag " + (result === "ok" ? "running" : "bad"), t("c_" + result));
    row.appendChild(tag);
    var role = lang === "en" ? c.roleEn : c.roleAr;
    row.appendChild(h("div", "sub", role + " · " + hostOf(link) + " · " + t("c_line_" + result)));
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
      if (tab === "spend" && spendSeg === "tools") draw();
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
        var row = line("news", b.title, b.source || t("brief"), b.date, "wait");
        rows.appendChild(row);
      });
      (snap.ceo || []).forEach(function (item) {
        rows.appendChild(line("flag", item.text, t("brief"), item.time, item.tone === "bad" ? "bad" : "wait"));
      });
    } else {
      var late = line("flag", t("late"), t("all") + " " + num(c.all) + " · " + t("going") + " " + num(c.go) + " · " + t("done") + " " + num(c.done), num(c.late) + " " + t("late"), c.late ? "bad" : "running");
      late.setAttribute("data-late", String(c.late));
      late.classList.add("sum");
      rows.appendChild(late);
      snap.next.forEach(function (item) {
        rows.appendChild(line("flag", item, t("next"), lang === "en" ? "Open" : "مفتوح", "wait"));
      });
      snap.computers.forEach(function (m) {
        rows.appendChild(line(m.online ? "laptop" : "phone", m.name, m.online ? (lang === "en" ? "Seen in the snapshot" : "ظاهر في اللقطة") : (lang === "en" ? "Not linked" : "غير مربوط"), m.online ? (lang === "en" ? "Online" : "متصل") : (lang === "en" ? "Offline" : "غير مربوط"), m.online ? "running" : "bad"));
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
    if (!addOpen) return;
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
  function drawDetail() {
    var p = projectById(detail);
    if (!p) { detail = null; drawProjects(); return; }
    band(t("project"), stLabel(p.status) + (p.from === "snapshot" ? " · " + t("from_ceo") : ""), typeof p.progress === "number" ? num(p.progress) + "%" : null);
    var rows = h("div", "rows");
    var progText = typeof p.progress === "number" ? ((p.id === "p_house01" ? (lang === "en" ? "Foundations " : "القواعد والأساسات ") : "") + num(p.progress) + "%") : t("no_progress");
    rows.appendChild(line("chart", t("progress"), progText, stLabel(p.status), statusClass(p.status)));
    var nextLine = line("flag", t("step"), p.next || t("no_step"), p.next ? (lang === "en" ? "Set" : "مكتوب") : (lang === "en" ? "Empty" : "فارغ"), p.next ? "running" : "wait");
    nextLine.setAttribute("data-next", p.next || "");
    rows.appendChild(nextLine);
    var dueShown = p.due ? ((lang === "en" ? "Dubai · " : "دبي · ") + p.due) : t("no_due");
    var dueLine = line("note", t("due"), dueShown, p.due ? dueShown : t("no_due"), p.due ? "wait" : "bad");
    dueLine.setAttribute("data-due", p.due || "");
    if (p.due) dueLine.dir = "ltr";
    rows.appendChild(dueLine);
    if (!p.tasks.length) rows.appendChild(line("note", t("tasks"), t("no_tasks"), lang === "en" ? "None" : "لا شيء", "wait"));
    p.tasks.forEach(function (task) {
      var row = h("button", "trow");
      row.appendChild(icon("flag"));
      row.appendChild(h("div", "nm", task.title));
      row.appendChild(h("span", "tag " + statusClass(task.status), task.status === "done" ? t("st_done") : task.status === "doing" ? t("st_go") : t("st_wait")));
      row.appendChild(h("div", "sub", t("tasks")));
      row.addEventListener("click", function () {
        var order = ["open", "doing", "done"];
        task.status = order[(order.indexOf(task.status) + 1) % order.length];
        saveProject(p, p.name, p.next, p.progress, p.due);
      });
      rows.appendChild(row);
    });
    var add = h("button", "trow");
    add.appendChild(icon("spark"));
    add.appendChild(h("div", "nm", t("add_task")));
    add.appendChild(h("div", "sub", t("tasks")));
    add.addEventListener("click", function () {
      var titleIn = h("input");
      titleIn.maxLength = MAX_NAME;
      add.replaceWith(titleIn);
      titleIn.focus();
      titleIn.addEventListener("change", function () {
        var n = clip(titleIn.value, MAX_NAME);
        if (!n) { draw(); return; }
        if (p.tasks.length >= MAX_T) return note(t("limit"));
        p.tasks.push({ id: rid("t"), title: n, status: "open", next: "" });
        saveProject(p, p.name, p.next, p.progress, p.due);
      });
    });
    rows.appendChild(add);
    var edit = h("button", "trow");
    edit.appendChild(icon("note"));
    edit.appendChild(h("div", "nm", t("edit")));
    edit.addEventListener("click", function () { editSheet(p); });
    rows.appendChild(edit);
    pages.appendChild(rows);
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
  function solutionFor(problem) {
    if (/إنارة|KNX|DALI/.test(problem)) return lang === "en" ? "Compare KNX and DALI on the house file, then pick one" : "قارن KNX و DALI على ملف البيت ثم اختر واحداً";
    if (/تسعير|متجر/.test(problem)) return lang === "en" ? "Price the store from the current cap before a new offer" : "سعّر المتجر من السقف الحالي قبل أي عرض";
    if (/APK|فحص/.test(problem)) return lang === "en" ? "Run the debug check and keep the date in its own field" : "شغّل فحص النسخة التجريبية واترك الموعد في حقله";
    if (/لوحة/.test(problem)) return lang === "en" ? "Renew from the local snapshot and the public feeds" : "جدّد من اللقطة المحلية والموجزات العامة";
    if (/تداول|نشر/.test(problem)) return lang === "en" ? "Leave live trading locked until you lift it" : "اترك التداول الحقيقي مقفلاً حتى ترفع القفل";
    return lang === "en" ? "Write one next step for this open item" : "اكتب خطوة تالية واحدة لهذا البند";
  }
  function drawSolutions() {
    var rows = h("div", "rows");
    var problems = (snap.next || []).slice();
    (snap.tools || []).forEach(function (tool) { if (tool.state === "stopped" || tool.state === "hold") problems.push(tool.name); });
    problems.forEach(function (problem) {
      var link = /تسعير|متجر/.test(problem) ? "https://www.shopify.com" : "";
      rows.appendChild(line("spark", solutionFor(problem), (lang === "en" ? "Solves: " : "يحل: ") + problem, lang === "en" ? "Idea" : "فكرة", "wait", link));
    });
    (snap.ideas || []).forEach(function (text, i) {
      rows.appendChild(line(i ? "flag" : "gem", text, lang === "en" ? "Reference in the snapshot" : "مرجع في اللقطة", lang === "en" ? "Reference" : "مرجع", "wait"));
    });
    (snap.brief || []).forEach(function (b) {
      rows.appendChild(line("news", b.title, (lang === "en" ? "Open need · " : "احتياج قائم · ") + (b.source || ""), b.date, "wait"));
    });
    pages.appendChild(rows);
  }
  function drawSources() {
    var rows = h("div", "rows");
    var sources = [
      ["Claude", "https://www.anthropic.com", lang === "en" ? "Writing and research" : "كتابة وبحث"],
      ["Gemini", "https://gemini.google.com", lang === "en" ? "Files and images" : "ملفات وصور"],
      ["NotebookLM", "https://notebooklm.google.com", lang === "en" ? "Source summaries" : "تلخيص مصادر"],
      ["Exa", "https://exa.ai", lang === "en" ? "Web research" : "بحث"],
      ["WAM", "https://www.wam.ae/en", lang === "en" ? "UAE news site" : "موقع أخبار الإمارات"],
      ["The National", "https://www.thenationalnews.com", lang === "en" ? "UAE news" : "أخبار الإمارات"],
      ["Gulf News", "https://gulfnews.com", lang === "en" ? "Gulf news" : "أخبار الخليج"],
      ["The Verge", "https://www.theverge.com/ai-artificial-intelligence", lang === "en" ? "Tech and AI" : "تقنية وذكاء"],
      ["CNBC", "https://www.cnbc.com", lang === "en" ? "Markets" : "أسواق"]
    ];
    sources.forEach(function (s) { rows.appendChild(line("link", s[0], s[2], hostOf(s[1]), "running", s[1])); });
    rows.appendChild(line("note", lang === "en" ? "Telegram, YouTube, TikTok" : "تيليجرام ويوتيوب وتيك توك", lang === "en" ? "No channel is stored in this snapshot" : "لا قناة محفوظة في هذه اللقطة", lang === "en" ? "None" : "لا يوجد", "wait"));
    pages.appendChild(rows);
  }
  function drawIdeas() {
    band(t("ideas"), lang === "en" ? "Fixes, sources, and your line" : "حلول ومصادر وسطرك");
    segBar([
      ["solve", lang === "en" ? "Fixes" : "حلول"],
      ["sources", lang === "en" ? "Sources" : "مصادر"],
      ["mine", lang === "en" ? "Mine" : "فكرتي"]
    ], ideaSeg, function (id) { ideaSeg = id; if (id !== "mine") ideaOpen = false; draw(); });
    if (ideaSeg === "sources") { drawSources(); return; }
    if (ideaSeg !== "mine") { drawSolutions(); return; }
    var rows = h("div", "rows");
    if (!snap.ideas.length) rows.appendChild(line("spark", t("ideas"), t("no_ideas"), lang === "en" ? "Empty" : "فارغ", "wait"));
    var ideaIcons = ["gem", "flag"];
    snap.ideas.forEach(function (text, i) {
      rows.appendChild(line(ideaIcons[i] || "spark", text, lang === "en" ? "From the snapshot" : "من اللقطة", lang === "en" ? "Reference" : "مرجع", "wait"));
    });
    (snap.ceoNow || []).forEach(function (text) { rows.appendChild(line("crown", text, lang === "en" ? "CEO note" : "ملاحظة المدير", lang === "en" ? "Open" : "مفتوح", "wait")); });
    if (!ideaOpen && !readDraft()) {
      var open = h("button", "trow");
      open.appendChild(icon("spark"));
      open.appendChild(h("div", "nm", t("idea_new")));
      open.appendChild(h("span", "tag wait", t("add")));
      open.appendChild(h("div", "sub", lang === "en" ? "One line, then a template" : "سطر واحد ثم قالب"));
      open.addEventListener("click", function () { ideaOpen = true; draw(); });
      rows.appendChild(open);
      fillRows(rows);
      pages.appendChild(rows);
      return;
    }
    pages.appendChild(rows);
    ideaOpen = true;
    var mine = h("div", "rows");
    var draft = readDraft();
    var idea = h("textarea"); idea.maxLength = MAX_NAME; idea.placeholder = t("idea_ph");
    if (draft) idea.value = draft.idea;
    mine.appendChild(idea);
    var build = h("button", "trow");
    build.appendChild(icon("spark"));
    build.appendChild(h("div", "nm", t("build")));
    build.addEventListener("click", function () {
      var text = clip(idea.value, MAX_NAME);
      if (!text) return note(t("need_idea"));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(templateFrom(text)));
      draw();
    });
    mine.appendChild(build);
    draft = readDraft();
    if (draft && draft.ready) {
      mine.appendChild(line("flag", t("goal"), draft.goal, lang === "en" ? "Draft" : "مسودة", "wait"));
      (draft.steps || []).forEach(function (s, i) {
        mine.appendChild(line("flag", s, lang === "en" ? "Step " + (i + 1) : "خطوة " + (i + 1), String(i + 1), "wait"));
      });
      mine.appendChild(line("note", t("first_task"), draft.task, lang === "en" ? "Task" : "مهمة", "running"));
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
  function choice(iconName, label, hint, value, on) {
    var b = h("button", "trow");
    b.appendChild(icon(iconName));
    b.appendChild(h("div", "nm", label));
    var tag = h("span", "tag go", value);
    if (String(value).indexOf("1.") === 0) tag.dir = "ltr";
    b.appendChild(tag);
    b.appendChild(h("div", "sub", hint));
    b.addEventListener("click", on);
    return b;
  }
  function drawSettings(rows) {
      rows.appendChild(choice("note", t("language"), lang === "en" ? "Arabic or English" : "عربي أو English", lang === "en" ? t("en") : t("ar"), function () { setLang(lang === "ar" ? "en" : "ar"); }));
      rows.appendChild(choice("crown", t("theme"), lang === "en" ? "Al Ain or UAE" : "العين أو الإمارات", theme === "uae" ? t("uae") : t("alain"), function () { setTheme(theme === "alain" ? "uae" : "alain"); }));
      var sizes = ["s", "m", "l"], sizeName = { s: t("small"), m: t("medium"), l: t("large") };
      rows.appendChild(choice("news", t("size"), lang === "en" ? "Small, medium, or large" : "صغير أو وسط أو كبير", sizeName[textSize], function () { setPref("hmk_size_v1", sizes[(sizes.indexOf(textSize) + 1) % sizes.length], "size"); }));
      rows.appendChild(choice("spark", t("digits"), lang === "en" ? "Arabic or Latin digits" : "أرقام عربية أو لاتينية", digits === "arab" ? "١٢٣" : "123", function () { setPref("hmk_digits_v1", digits === "arab" ? "latn" : "arab", "digits"); }));
      var starts = ["home", "projects", "ideas", "more"], startName = { home: t("home"), projects: t("projects"), ideas: t("ideas"), more: t("tools") };
      rows.appendChild(choice("flag", t("start"), lang === "en" ? "Page after the opening" : "الصفحة بعد الافتتاح", startName[startPage], function () { setPref("hmk_start_v1", starts[(starts.indexOf(startPage) + 1) % starts.length], "start"); }));
      rows.appendChild(choice("pause", t("density"), lang === "en" ? "Compact or comfortable" : "مضغوط أو مريح", density === "comfortable" ? t("comfortable") : t("compact"), function () { setPref("hmk_density_v1", density === "compact" ? "comfortable" : "compact", "density"); }));
      var info = window.HMK_BUILD || { version: "1.15-debug", sha: "dev" };
      try {
        if (window.HmkAndroid && HmkAndroid.buildId) {
          var parts = String(HmkAndroid.buildId()).split(" ");
          if (parts[0]) info = { version: parts[0], sha: parts.slice(1).join(" ") || info.sha };
        }
      } catch (e) {}
      var about = h("div", "trow");
      about.appendChild(icon("crown"));
      about.appendChild(h("div", "nm", t("about")));
      var ver = h("span", "tag", info.version);
      ver.dir = "ltr";
      about.appendChild(ver);
      var sha = h("div", "sub", String(info.sha || ""));
      sha.dir = "ltr";
      about.appendChild(sha);
      rows.appendChild(about);
  }
  function drawFile(rows) {
      var ws = readWs();
      var taskN = 0;
      ws.projects.forEach(function (p) { taskN += p.tasks.length; });
      var last = localStorage.getItem("hmk_last_export_v1");
      rows.appendChild(line("note", t("last_export"), t("local_only"), last ? when(last) : t("never"), last ? "running" : "wait"));
      rows.appendChild(line("book", t("counts"), lang === "en" ? "Projects · tasks · ideas" : "مشاريع · مهام · أفكار", num(ws.projects.length) + " · " + num(taskN) + " · " + num((snap.ideas || []).length), "wait"));
      rows.appendChild(line("cloud", t("storage"), lang === "en" ? "Characters stored on this device" : "حروف محفوظة على هذا الجهاز", num(storageBytes()) + (lang === "en" ? " chars" : " حرف"), "wait"));
      function fileRow(iconName, label, hint, kind) {
        var b = h("button", "trow");
        b.appendChild(icon(iconName));
        b.appendChild(h("div", "nm", label));
        b.appendChild(h("span", "tag wait", lang === "en" ? "File" : "ملف"));
        b.appendChild(h("div", "sub", hint));
        var input = h("input"); input.type = "file"; input.accept = "application/json,.json";
        input.addEventListener("change", function () { if (input.files && input.files[0]) readFile(input.files[0], kind); input.value = ""; });
        b.addEventListener("click", function () { input.click(); });
        b.appendChild(input);
        return b;
      }
      var exp = h("button", "trow");
      exp.appendChild(icon("note"));
      exp.appendChild(h("div", "nm", t("export")));
      exp.appendChild(h("span", "tag running", lang === "en" ? "Save" : "حفظ"));
      exp.appendChild(h("div", "sub", t("local_only")));
      exp.addEventListener("click", exportWs);
      rows.appendChild(exp);
      rows.appendChild(fileRow("book", t("restore"), lang === "en" ? "Replace the workspace from a file" : "استبدال المساحة من ملف", "workspace"));
      rows.appendChild(fileRow("news", t("import_snap"), lang === "en" ? "Replace the reference snapshot" : "استبدال لقطة المرجع", "snapshot"));
      var clear = h("button", "trow");
      clear.appendChild(icon("pause"));
      clear.appendChild(h("div", "nm", t("clear")));
      clear.appendChild(h("span", "tag bad", lang === "en" ? "Erase" : "مسح"));
      clear.appendChild(h("div", "sub", t("clear_ask")));
      clear.addEventListener("click", function () {
        confirmAsk(t("clear_ask"), function () {
          writeWs(emptyWs());
          localStorage.removeItem(DRAFT_KEY);
          note(t("cleared"));
          draw();
        });
      });
      rows.appendChild(clear);
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
    if (tab === "reports" && reportSeg === "file") draw();
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
    var startAlias = { home: "sum", projects: "proj", ideas: "ideas", more: "spend" };
    var start = startAlias[startPage] || startPage;
    if (start && start !== "sum") setTab(start);
  });
  document.querySelectorAll("#langs button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  document.querySelectorAll("#themes button").forEach(function (b) {
    b.addEventListener("click", function () { setTheme(b.getAttribute("data-theme")); });
  });
  document.getElementById("refresh").addEventListener("click", function () { refreshAll(); });
  document.getElementById("quick").addEventListener("click", function () {
    document.getElementById("open").hidden = true;
    if (tab === "ideas") { ideaSeg = "mine"; ideaOpen = true; draw(); return; }
    addOpen = true;
    setTab("proj");
  });
  if (/[?&]open=0/.test(location.search)) document.getElementById("open").hidden = true;
  applyTheme();
  back.addEventListener("click", function () { detail = null; draw(); });
  document.querySelectorAll("footer button").forEach(function (b) {
    b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
  });
  var swipeX = null;
  pages.addEventListener("touchstart", function (e) { if (e.touches && e.touches[0]) swipeX = e.touches[0].clientX; });
  pages.addEventListener("touchend", function (e) {
    if (swipeX == null || tab !== "proj" || !e.changedTouches || !e.changedTouches[0]) return;
    var dx = e.changedTouches[0].clientX - swipeX;
    swipeX = null;
    var list = readWs().projects;
    if (!list.length || Math.abs(dx) < 40) return;
    projIndex = dx < 0 ? (projIndex + 1) % list.length : (projIndex - 1 + list.length) % list.length;
    draw();
  });
  ensureSeed();
  loadNews();
  var stored = validSnap(readJson(SNAP_KEY));
  if (stored && !stored.sample) { snap = stored; draw(); }
  else loadSample(draw);
})();
