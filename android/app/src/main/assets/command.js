(function () {
  "use strict";
  var WS_KEY = "hmk_workspace_v1";
  var DRAFT_KEY = "hmk_idea_draft_v1";
  var SNAP_KEY = "hmk_status_snapshot_v1";
  var MAX_P = 50, MAX_T = 100, MAX_NAME = 120, MAX_NEXT = 400, MAX_FILE = 200000, MAX_ITEMS = 50;
  var PSTAT = { wait: "بالانتظار", go: "قيد العمل", hold: "متعثر", done: "منجز" };
  var TSTAT = { open: "مفتوحة", doing: "قيد العمل", done: "تمت" };
  var TOOL = { running: "شغّال", idle: "جاهز", stopped: "موقوف", hold: "مقفل" };
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
    try { return new Intl.DateTimeFormat("ar-AE", { timeZone: "Asia/Dubai", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(d); }
    catch (e) { return iso; }
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
  function chip(state, label) {
    return h("span", "chip " + state, label || TOOL[state] || state);
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
    var names = { home: "الرئيسية", projects: "المشاريع", ideas: "الأفكار", more: "الأدوات" };
    title.textContent = detail ? "مشروع" : names[tab];
    if (tab === "home") drawHome();
    else if (tab === "projects") detail ? drawDetail() : drawProjects();
    else if (tab === "ideas") drawIdeas();
    else drawMore();
  }
  function projectCard(p, open) {
    var card = h("button", "card");
    var top = h("div", "top");
    top.appendChild(icon(p.icon || "crown"));
    top.appendChild(chip(p.status, PSTAT[p.status]));
    card.appendChild(top);
    card.appendChild(h("b", "", p.name));
    card.appendChild(h("span", "sub", p.next || ""));
    if (typeof p.progress === "number") {
      var bar = h("div", "bar");
      var fill = document.createElement("i");
      fill.style.width = p.progress + "%";
      bar.appendChild(fill);
      card.appendChild(bar);
      card.appendChild(h("span", "src", (p.id === "p_house01" ? "القواعد والأساسات " : "التقدم ") + p.progress + "%"));
    }
    if (p.from === "snapshot") card.appendChild(h("span", "src", "من لقطة CEO"));
    if (open) card.addEventListener("click", function () { detail = p.id; tab = "projects"; document.querySelectorAll("footer button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === "projects"); }); draw(); });
    return card;
  }
  function toolCard(t) {
    var card = h("div", "card");
    var top = h("div", "top");
    top.appendChild(icon(t.icon || "spark"));
    top.appendChild(chip(t.state));
    card.appendChild(top);
    card.appendChild(h("b", "", t.name));
    if (t.cost) { var cost = h("span", "sub", t.cost); cost.dir = "ltr"; card.appendChild(cost); }
    return card;
  }
  function drawHome() {
    var stamp = section("مركز المتابعة", when(snap.generatedAt) + " · الإمارات");
    stamp.appendChild(h("p", "fine", "لقطة محلية 9 نوفمبر 2026 · 07:40. ليست بثاً حياً."));
    var flow = h("div", "flow");
    flow.appendChild(h("b", "", "طلب حمد"));
    flow.appendChild(h("span", "", "←"));
    flow.appendChild(h("b", "", "تنفيذ مباشر"));
    flow.appendChild(h("span", "", "←"));
    flow.appendChild(h("b", "", "نتيجة"));
    stamp.appendChild(flow);
    pages.appendChild(stamp);
    var ceo = section("المساعد الآن");
    var ceoIcons = ["crown", "note", "phone", "gem"];
    var cg = h("div", "grid");
    snap.ceoNow.forEach(function (line, i) {
      var card = h("div", "card");
      card.appendChild(icon(ceoIcons[i] || "spark"));
      card.appendChild(h("b", "", line));
      cg.appendChild(card);
    });
    ceo.appendChild(cg);
    pages.appendChild(ceo);
    var team = section("الفريق", "CEO + 6");
    var tg = h("div", "grid");
    (snap.team || []).forEach(function (m) {
      var card = h("div", "card");
      var top = h("div", "top");
      top.appendChild(icon(m.icon));
      top.appendChild(chip("go", "نشط"));
      card.appendChild(top);
      card.appendChild(h("b", "", m.name));
      card.appendChild(h("span", "sub", m.role));
      tg.appendChild(card);
    });
    team.appendChild(tg);
    pages.appendChild(team);
    var tools = section("الأدوات الشغّالة");
    var wrap = h("div", "grid");
    snap.tools.forEach(function (t) { wrap.appendChild(toolCard(t)); });
    tools.appendChild(wrap);
    pages.appendChild(tools);
    var brief = section("موجز اليوم");
    var bg = h("div", "grid");
    snap.brief.forEach(function (b) {
      var card = h("div", "card");
      var top = h("div", "top");
      top.appendChild(icon("news"));
      top.appendChild(chip("wait", b.date));
      card.appendChild(top);
      card.appendChild(h("b", "", b.title));
      card.appendChild(h("span", "sub", b.source));
      bg.appendChild(card);
    });
    brief.appendChild(bg);
    pages.appendChild(brief);
    var pcs = section("الأجهزة");
    var pg = h("div", "grid");
    snap.computers.forEach(function (m) {
      var card = h("div", "card");
      var top = h("div", "top");
      top.appendChild(icon(m.online ? "laptop" : "phone"));
      top.appendChild(chip(m.online ? "running" : "stopped", m.online ? "متصل" : "لم تُربط بعد"));
      card.appendChild(top);
      card.appendChild(h("b", "", m.name));
      card.appendChild(h("span", "sub", m.online ? "online" : "not connected yet"));
      pg.appendChild(card);
    });
    pcs.appendChild(pg);
    pages.appendChild(pcs);
    var time = section("الخط الزمني");
    var grid = h("div", "time");
    [["حدث", snap.happened], ["الآن", snap.now], ["قادم", snap.next]].forEach(function (pair) {
      var col = h("div");
      col.appendChild(h("strong", "", pair[0]));
      var ul = document.createElement("ul");
      pair[1].forEach(function (item) { ul.appendChild(h("li", "", item)); });
      col.appendChild(ul);
      grid.appendChild(col);
    });
    time.appendChild(grid);
    pages.appendChild(time);
    var mine = section("المشاريع", "من لقطة CEO");
    var g = h("div", "grid");
    readWs().projects.forEach(function (p) { g.appendChild(projectCard(p, true)); });
    mine.appendChild(g);
    pages.appendChild(mine);
  }
  function drawProjects() {
    var head = section("المشاريع", "قابلة للتعديل");
    var plus = h("button", "plus", "+");
    plus.setAttribute("aria-label", "إضافة مشروع");
    plus.addEventListener("click", function () { addOpen = !addOpen; draw(); });
    head.appendChild(plus);
    pages.appendChild(head);
    var g = h("div", "grid");
    readWs().projects.forEach(function (p) { g.appendChild(projectCard(p, true)); });
    pages.appendChild(g);
    if (!addOpen) return;
    var form = h("div");
    form.appendChild(h("label", "", "مشروع جديد"));
    var name = h("input"); name.maxLength = MAX_NAME; name.placeholder = "الاسم";
    form.appendChild(name);
    var add = h("button", "primary", "إضافة مشروع");
    add.addEventListener("click", function () {
      var n = clip(name.value, MAX_NAME);
      if (!n) return note("اكتب اسماً");
      var ws = readWs();
      if (ws.projects.length >= MAX_P) return note("بلغت الحد");
      ws.projects.push({ id: rid("p"), name: n, status: "wait", next: "", tasks: [] });
      writeWs(ws);
      addOpen = false;
      draw();
    });
    form.appendChild(add);
    pages.appendChild(form);
  }
  function projectById(id) {
    return readWs().projects.filter(function (p) { return p.id === id; })[0] || null;
  }
  function drawDetail() {
    var p = projectById(detail);
    if (!p) { detail = null; drawProjects(); return; }
    var box = h("div");
    if (p.from === "snapshot") box.appendChild(h("p", "src", "من لقطة CEO · يمكن تعديله أو حذفه"));
    box.appendChild(h("label", "", "الاسم"));
    var name = h("input"); name.value = p.name; name.maxLength = MAX_NAME;
    box.appendChild(name);
    box.appendChild(h("label", "", "الحالة"));
    var states = h("div", "st");
    Object.keys(PSTAT).forEach(function (k) {
      var b = h("button", k === p.status ? "on" : "", PSTAT[k]);
      b.addEventListener("click", function () { p.status = k; saveProject(p, name.value, next.value, prog.value); });
      states.appendChild(b);
    });
    box.appendChild(states);
    box.appendChild(h("label", "", "الخطوة التالية"));
    var next = h("textarea"); next.value = p.next; next.maxLength = MAX_NEXT;
    box.appendChild(next);
    box.appendChild(h("label", "", "نسبة التقدم"));
    var prog = h("input"); prog.value = p.progress == null ? "" : String(p.progress); prog.inputMode = "numeric";
    box.appendChild(prog);
    var save = h("button", "primary", "حفظ المشروع");
    save.addEventListener("click", function () { saveProject(p, name.value, next.value, prog.value); note("حُفظ محلياً"); });
    box.appendChild(save);
    pages.appendChild(box);
    var tasks = section("المهام");
    if (!p.tasks.length) tasks.appendChild(h("p", "empty", "لا مهام"));
    p.tasks.forEach(function (task) {
      var row = h("div", "row");
      row.appendChild(icon("note"));
      var t = h("div", "t"); t.appendChild(h("b", "", task.title));
      row.appendChild(t);
      var cycle = h("button", "", TSTAT[task.status]);
      cycle.addEventListener("click", function () {
        var order = ["open", "doing", "done"];
        task.status = order[(order.indexOf(task.status) + 1) % order.length];
        saveProject(p, name.value, next.value, prog.value);
      });
      row.appendChild(cycle);
      tasks.appendChild(row);
    });
    pages.appendChild(tasks);
    var titleIn = h("input"); titleIn.maxLength = MAX_NAME; titleIn.placeholder = "مهمة جديدة";
    var add = h("button", "", "إضافة مهمة");
    add.addEventListener("click", function () {
      var n = clip(titleIn.value, MAX_NAME);
      if (!n) return note("اكتب مهمة");
      if (p.tasks.length >= MAX_T) return note("بلغت الحد");
      p.tasks.push({ id: rid("t"), title: n, status: "open", next: "" });
      saveProject(p, name.value, next.value, prog.value);
    });
    pages.appendChild(titleIn);
    pages.appendChild(add);
    var del = h("button", "", "حذف المشروع");
    del.addEventListener("click", function () {
      confirmAsk("حذف هذا المشروع من المساحة المحلية؟", function () {
        var ws = readWs();
        ws.projects = ws.projects.filter(function (item) { return item.id !== p.id; });
        writeWs(ws);
        detail = null;
        draw();
      });
    });
    pages.appendChild(del);
  }
  function saveProject(p, name, next, progress) {
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
    }
    writeWs(ws);
    draw();
  }
  function templateFrom(idea) {
    var text = clip(idea, MAX_NAME);
    return { version: 1, idea: text, goal: clip("إنجاز «" + text + "» محلياً بعد مراجعتك", MAX_NEXT), steps: ["تحديد النتيجة", "تنفيذ الخطوة الأولى", "مراجعة ما حُفظ"], task: clip("أول مهمة: تحديد نتيجة «" + text + "»", MAX_NAME), ready: true };
  }
  function drawIdeas() {
    var ref = section("أفكار المرجع");
    var g = h("div", "grid");
    var ideaIcons = ["gem", "flag"];
    snap.ideas.forEach(function (line, i) {
      var card = h("div", "card");
      card.appendChild(icon(ideaIcons[i] || "spark"));
      card.appendChild(h("b", "", line));
      card.appendChild(h("span", "sub", "من اللقطة"));
      g.appendChild(card);
    });
    ref.appendChild(g);
    pages.appendChild(ref);
    var mine = section("فكرتك");
    if (!ideaOpen && !readDraft()) {
      var open = h("button", "jump", "فكرة جديدة");
      open.addEventListener("click", function () { ideaOpen = true; draw(); });
      mine.appendChild(open);
      pages.appendChild(mine);
      return;
    }
    ideaOpen = true;
    var draft = readDraft();
    var idea = h("textarea"); idea.maxLength = MAX_NAME; idea.placeholder = "سطر واحد";
    if (draft) idea.value = draft.idea;
    mine.appendChild(idea);
    var build = h("button", "", "بناء قالب");
    build.addEventListener("click", function () {
      var text = clip(idea.value, MAX_NAME);
      if (!text) return note("اكتب الفكرة");
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
      mine.appendChild(h("label", "", "الهدف")); mine.appendChild(goal);
      mine.appendChild(h("label", "", "أول مهمة")); mine.appendChild(task);
      var yes = h("button", "primary", "تأكيد الإنشاء");
      var no = h("button", "", "إلغاء");
      yes.addEventListener("click", function () {
        var ws = readWs();
        if (ws.projects.length >= MAX_P) return note("بلغت الحد");
        var goalText = clip(goal.value, MAX_NEXT), tk = clip(task.value, MAX_NAME);
        if (!goalText || !tk) return note("أكمل الهدف والمهمة");
        ws.projects.push({ id: rid("p"), name: clip(draft.idea, MAX_NAME) || "مشروع", status: "wait", next: goalText, icon: "spark", tasks: [{ id: rid("t"), title: tk, status: "open", next: "" }] });
        writeWs(ws);
        localStorage.removeItem(DRAFT_KEY);
        ideaOpen = false;
        note("أُنشئ المشروع في المساحة");
        draw();
      });
      no.addEventListener("click", function () { localStorage.removeItem(DRAFT_KEY); ideaOpen = false; draw(); });
      var acts = h("div", "actions"); acts.appendChild(yes); acts.appendChild(no); mine.appendChild(acts);
    }
    pages.appendChild(mine);
  }
  function drawMore() {
    var box = section("الأدوات");
    var wrap = h("div", "grid");
    snap.tools.forEach(function (t) { wrap.appendChild(toolCard(t)); });
    box.appendChild(wrap);
    pages.appendChild(box);
    var actsBox = section("الملف المحلي");
    actsBox.appendChild(h("p", "fine", "يبقى على هذا الجهاز. لا مزامنة."));
    var exp = h("button", "primary", "تصدير المساحة");
    exp.addEventListener("click", exportWs);
    var imp = h("button", "", "استعادة المساحة");
    var file = h("input"); file.type = "file"; file.accept = "application/json,.json";
    file.addEventListener("change", function () { if (file.files && file.files[0]) readFile(file.files[0], "workspace"); file.value = ""; });
    imp.addEventListener("click", function () { file.click(); });
    var snapBtn = h("button", "", "استيراد اللقطة");
    var snapFile = h("input"); snapFile.type = "file"; snapFile.accept = "application/json,.json";
    snapFile.addEventListener("change", function () { if (snapFile.files && snapFile.files[0]) readFile(snapFile.files[0], "snapshot"); snapFile.value = ""; });
    snapBtn.addEventListener("click", function () { snapFile.click(); });
    var clear = h("button", "", "مسح المساحة");
    clear.addEventListener("click", function () {
      confirmAsk("مسح مشاريعك المحلية؟ المرجع لا يتأثر.", function () {
        writeWs(emptyWs());
        localStorage.removeItem(DRAFT_KEY);
        note("المساحة فارغة");
        draw();
      });
    });
    var acts = h("div", "actions");
    acts.appendChild(exp); acts.appendChild(imp); acts.appendChild(snapBtn); acts.appendChild(clear);
    acts.appendChild(file); acts.appendChild(snapFile);
    actsBox.appendChild(acts);
    pages.appendChild(actsBox);
  }
  function exportWs() {
    var blob = new Blob([JSON.stringify(readWs(), null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "hmk-workspace.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function readFile(file, kind) {
    if (file.size > MAX_FILE) return note("الملف أكبر من الحد");
    var reader = new FileReader();
    reader.onload = function () {
      var text = String(reader.result || "");
      var parsed = null;
      try { parsed = JSON.parse(text); } catch (e) { return note("ملف غير صالح"); }
      if (kind === "workspace") {
        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.projects) || parsed.projects.length > MAX_P || !parsed.projects.every(validProject)) return note("ملف المساحة غير صالح");
        confirmAsk("استبدال المساحة بمحتوى الملف؟", function () { writeWs(parsed); note("استُعيدت المساحة"); draw(); });
      } else {
        var nextSnap = validSnap(parsed);
        if (!nextSnap) return note("لقطة غير صالحة");
        confirmAsk("استبدال مرجع اللقطة؟ مساحتك لا تتغير. الوقت: " + when(nextSnap.generatedAt), function () {
          localStorage.setItem(SNAP_KEY, JSON.stringify(nextSnap));
          snap = nextSnap;
          note("استُوردت اللقطة");
          draw();
        });
      }
    };
    reader.readAsText(file);
  }
  function confirmAsk(text, yes) {
    pending = yes;
    document.getElementById("ask-text").textContent = text;
    ask.hidden = false;
  }
  document.getElementById("ask-yes").addEventListener("click", function () {
    var fn = pending; pending = null; ask.hidden = true; if (fn) fn();
  });
  document.getElementById("ask-no").addEventListener("click", function () { pending = null; ask.hidden = true; });
  document.getElementById("enter").addEventListener("click", function () { document.getElementById("open").hidden = true; });
  back.addEventListener("click", function () { detail = null; draw(); });
  document.querySelectorAll("footer button").forEach(function (b) {
    b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
  });
  ensureSeed();
  var stored = validSnap(readJson(SNAP_KEY));
  if (stored && !stored.sample) { snap = stored; draw(); }
  else loadSample(draw);
})();
