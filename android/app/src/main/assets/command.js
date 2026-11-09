(function () {
  "use strict";
  var WS_KEY = "hmk_workspace_v1";
  var DRAFT_KEY = "hmk_idea_draft_v1";
  var SNAP_KEY = "hmk_status_snapshot_v1";
  var MAX_P = 50, MAX_T = 100, MAX_NAME = 120, MAX_NEXT = 400, MAX_FILE = 200000, MAX_ITEMS = 50;
  var PSTAT = { wait: "ينتظر", go: "جارٍ", hold: "متوقف", done: "تم" };
  var TSTAT = { open: "مفتوحة", doing: "قيد العمل", done: "تمت" };
  var TOOL = { running: "يعمل", idle: "خامل", stopped: "متوقف" };
  var tab = "home";
  var detail = null;
  var ideaOpen = false;
  var pending = null;
  var pages = document.getElementById("pages");
  var title = document.getElementById("title");
  var back = document.getElementById("back");
  var ask = document.getElementById("ask");
  var snap = null;

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
    return p && typeof p === "object" && /^p_[a-z0-9]{4,24}$/.test(p.id) && typeof p.name === "string" && p.name.length <= MAX_NAME && PSTAT[p.status] && typeof p.next === "string" && p.next.length <= MAX_NEXT && Array.isArray(p.tasks) && p.tasks.length <= MAX_T && p.tasks.every(validTask);
  }
  function readWs() {
    var d = readJson(WS_KEY);
    if (!d || d.version !== 1 || !Array.isArray(d.projects) || d.projects.length > MAX_P || !d.projects.every(validProject)) return emptyWs();
    return d;
  }
  function writeWs(d) { localStorage.setItem(WS_KEY, JSON.stringify(d)); }
  function readDraft() {
    var d = readJson(DRAFT_KEY);
    if (!d || d.version !== 1 || typeof d.idea !== "string") return null;
    return d;
  }
  function strList(v) {
    if (!Array.isArray(v) || v.length > MAX_ITEMS) return null;
    var out = [];
    for (var i = 0; i < v.length; i++) {
      if (typeof v[i] !== "string" || v[i].length > MAX_NEXT) return null;
      out.push(v[i]);
    }
    return out;
  }
  function validSnap(d) {
    if (!d || typeof d !== "object" || typeof d.generatedAt !== "string" || d.generatedAt.length > 80) return null;
    var ceo = strList(d.ceoNow), happened = strList(d.happened), now = strList(d.now), next = strList(d.next), ideas = strList(d.ideas), programs = strList(d.programs);
    if (!ceo || !happened || !now || !next || !ideas || !programs) return null;
    if (!Array.isArray(d.tools) || d.tools.length > MAX_ITEMS) return null;
    if (!Array.isArray(d.computers) || d.computers.length > MAX_ITEMS) return null;
    if (!Array.isArray(d.brief) || d.brief.length > MAX_ITEMS) return null;
    var tools = [], computers = [], brief = [];
    for (var i = 0; i < d.tools.length; i++) {
      var t = d.tools[i];
      if (!t || typeof t.name !== "string" || typeof t.state !== "string" || typeof t.lastRun !== "string") return null;
      if (t.name.length > MAX_NAME || t.state.length > 40 || t.lastRun.length > 80) return null;
      tools.push({ name: t.name, state: t.state, lastRun: t.lastRun });
    }
    for (var c = 0; c < d.computers.length; c++) {
      var m = d.computers[c];
      if (!m || typeof m.name !== "string" || typeof m.online !== "boolean" || typeof m.lastSeen !== "string") return null;
      if (m.name.length > MAX_NAME || m.lastSeen.length > 80) return null;
      computers.push({ name: m.name, online: m.online, lastSeen: m.lastSeen });
    }
    for (var b = 0; b < d.brief.length; b++) {
      var r = d.brief[b];
      if (!r || typeof r.title !== "string" || typeof r.source !== "string" || typeof r.url !== "string" || typeof r.date !== "string") return null;
      if (r.title.length > MAX_NEXT || r.source.length > MAX_NAME || r.url.length > MAX_NEXT || r.date.length > 40) return null;
      brief.push({ title: r.title, source: r.source, url: r.url, date: r.date });
    }
    return { sample: d.sample === true, generatedAt: d.generatedAt, ceoNow: ceo, tools: tools, computers: computers, brief: brief, happened: happened, now: now, next: next, ideas: ideas, programs: programs };
  }
  function readSnap() {
    var stored = validSnap(readJson(SNAP_KEY));
    return stored;
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
  function blankSnap() {
    return { sample: true, generatedAt: "", ceoNow: [], tools: [], computers: [], brief: [], happened: [], now: [], next: [], ideas: [], programs: [] };
  }
  function when(iso) {
    if (!iso) return "بدون وقت";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    try { return new Intl.DateTimeFormat("ar-AE", { timeZone: "Asia/Dubai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(d); }
    catch (e) { return iso; }
  }
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon() {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("class", "ic");
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", "M12 3l2.2 6.4H21l-5.4 4 2 6.6L12 16.8 6.4 20l2-6.6L3 9.4h6.8z");
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
  function emptyLine(box) { box.appendChild(h("p", "empty", "لا عناصر في اللقطة")); }
  function chip(state, label) {
    var c = h("span", "chip " + state, label || TOOL[state] || state);
    return c;
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
  function drawHome() {
    var stamp = section("مركز المتابعة", snap.sample ? "عينة · " + when(snap.generatedAt) : when(snap.generatedAt));
    stamp.appendChild(h("p", "fine", snap.sample ? "مرجع محلي من لقطة عينة. ليس بثاً حياً ولا يُنسخ إلى المساحة." : "مرجع محلي من لقطة مستوردة. ليس بثاً حياً."));
    pages.appendChild(stamp);
    var ceo = section("المساعد الآن");
    if (!snap.ceoNow.length) emptyLine(ceo);
    snap.ceoNow.forEach(function (line) {
      var row = h("div", "row"); row.appendChild(icon()); row.appendChild(h("div", "t", line)); ceo.appendChild(row);
    });
    pages.appendChild(ceo);
    var tools = section("الأدوات");
    if (!snap.tools.length) emptyLine(tools);
    else {
      var wrap = h("div", "tools");
      snap.tools.forEach(function (t) {
        var pill = h("div", "tool");
        pill.appendChild(icon());
        pill.appendChild(document.createTextNode(t.name));
        pill.appendChild(chip(t.state));
        wrap.appendChild(pill);
      });
      tools.appendChild(wrap);
    }
    pages.appendChild(tools);
    var pcs = section("الأجهزة");
    if (!snap.computers.length) emptyLine(pcs);
    snap.computers.forEach(function (m) {
      var row = h("div", "row");
      row.appendChild(icon());
      var t = h("div", "t"); t.appendChild(h("b", "", m.name)); t.appendChild(h("span", "", when(m.lastSeen)));
      row.appendChild(t);
      row.appendChild(chip(m.online ? "running" : "stopped", m.online ? "متصل" : "غير متصل"));
      pcs.appendChild(row);
    });
    pages.appendChild(pcs);
    var brief = section("الموجز");
    if (!snap.brief.length) emptyLine(brief);
    snap.brief.forEach(function (b) {
      var row = h("div", "row");
      row.appendChild(icon());
      var t = h("div", "t"); t.appendChild(h("b", "", b.title)); t.appendChild(h("span", "", b.source + " · " + b.date));
      row.appendChild(t);
      brief.appendChild(row);
    });
    pages.appendChild(brief);
    var time = section("الخط الزمني");
    var grid = h("div", "time");
    [["حدث", snap.happened], ["الآن", snap.now], ["قادم", snap.next]].forEach(function (pair) {
      var col = h("div"); col.appendChild(h("strong", "", pair[0]));
      if (!pair[1].length) col.appendChild(h("p", "empty", "لا عناصر"));
      else {
        var ul = document.createElement("ul");
        pair[1].forEach(function (item) { ul.appendChild(h("li", "", item)); });
        col.appendChild(ul);
      }
      grid.appendChild(col);
    });
    time.appendChild(grid);
    pages.appendChild(time);
    var programs = section("البرامج", "مرجع");
    if (!snap.programs.length) emptyLine(programs);
    else {
      var g = h("div", "grid");
      snap.programs.forEach(function (name) {
        var card = h("div", "card"); card.appendChild(icon()); card.appendChild(h("b", "", name)); card.appendChild(h("span", "sub", "من اللقطة"));
        g.appendChild(card);
      });
      programs.appendChild(g);
    }
    pages.appendChild(programs);
    var mine = readWs();
    var own = section("مساحتك", mine.projects.length ? String(mine.projects.length) : "فارغة");
    own.appendChild(h("p", "fine", "إدخالاتك وحدها. لا تُملأ من المرجع."));
    var jump = h("button", "jump", mine.projects.length ? "فتح المساحة" : "فتح المساحة لإضافة مشروع");
    jump.addEventListener("click", function () { setTab("projects"); });
    own.appendChild(jump);
    pages.appendChild(own);
  }
  function drawProjects() {
    var data = readWs();
    var head = section("المشاريع", "محلي");
    head.appendChild(h("p", "fine", "مساحتك الشخصية. تبقى فارغة حتى تضيف."));
    pages.appendChild(head);
    if (!data.projects.length) pages.appendChild(h("p", "empty", "لا مشاريع محفوظة"));
    var g = h("div", "grid");
    data.projects.forEach(function (p) {
      var card = h("button", "card");
      card.appendChild(icon());
      card.appendChild(h("b", "", p.name));
      card.appendChild(chip(p.status, PSTAT[p.status]));
      card.appendChild(h("span", "sub", p.next || "بدون خطوة"));
      card.addEventListener("click", function () { detail = p.id; draw(); });
      g.appendChild(card);
    });
    pages.appendChild(g);
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
    box.appendChild(h("label", "", "الاسم"));
    var name = h("input"); name.value = p.name; name.maxLength = MAX_NAME;
    box.appendChild(name);
    box.appendChild(h("label", "", "الحالة"));
    var states = h("div", "st");
    Object.keys(PSTAT).forEach(function (k) {
      var b = h("button", k === p.status ? "on" : "", PSTAT[k]);
      b.addEventListener("click", function () { p.status = k; saveProject(p, name.value); });
      states.appendChild(b);
    });
    box.appendChild(states);
    box.appendChild(h("label", "", "الخطوة التالية"));
    var next = h("textarea"); next.value = p.next; next.maxLength = MAX_NEXT;
    box.appendChild(next);
    var save = h("button", "primary", "حفظ المشروع");
    save.addEventListener("click", function () { saveProject(p, name.value, next.value); note("حُفظ محلياً"); });
    box.appendChild(save);
    pages.appendChild(box);
    var tasks = section("المهام");
    if (!p.tasks.length) tasks.appendChild(h("p", "empty", "لا مهام"));
    p.tasks.forEach(function (task) {
      var row = h("div", "row");
      row.appendChild(icon());
      var t = h("div", "t"); t.appendChild(h("b", "", task.title)); t.appendChild(h("span", "", task.next || ""));
      row.appendChild(t);
      var cycle = h("button", "", TSTAT[task.status]);
      cycle.addEventListener("click", function () {
        var order = ["open", "doing", "done"];
        task.status = order[(order.indexOf(task.status) + 1) % order.length];
        saveProject(p, name.value, next.value);
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
      saveProject(p, name.value, next.value);
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
  function saveProject(p, name, next) {
    var ws = readWs();
    var cur = ws.projects.filter(function (item) { return item.id === p.id; })[0];
    if (!cur) return;
    cur.name = clip(name, MAX_NAME) || cur.name;
    cur.status = PSTAT[p.status] ? p.status : cur.status;
    if (next != null) cur.next = clip(next, MAX_NEXT);
    cur.tasks = p.tasks;
    writeWs(ws);
    draw();
  }
  function templateFrom(idea) {
    var text = clip(idea, MAX_NAME);
    return { version: 1, idea: text, goal: clip("إنجاز «" + text + "» محلياً بعد مراجعتك", MAX_NEXT), steps: ["تحديد النتيجة", "تنفيذ الخطوة الأولى", "مراجعة ما حُفظ"], task: clip("أول مهمة: تحديد نتيجة «" + text + "»", MAX_NAME), ready: true };
  }
  function drawIdeas() {
    var ref = section("أفكار المرجع");
    if (!snap.ideas.length) emptyLine(ref);
    snap.ideas.forEach(function (line) {
      var row = h("div", "row"); row.appendChild(icon()); var t = h("div", "t"); t.appendChild(h("b", "", line)); t.appendChild(h("span", "", "من اللقطة")); row.appendChild(t); ref.appendChild(row);
    });
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
        var g = clip(goal.value, MAX_NEXT), tk = clip(task.value, MAX_NAME);
        if (!g || !tk) return note("أكمل الهدف والمهمة");
        ws.projects.push({ id: rid("p"), name: clip(draft.idea, MAX_NAME) || "مشروع", status: "wait", next: g, tasks: [{ id: rid("t"), title: tk, status: "open", next: "" }] });
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
    box.appendChild(h("p", "fine", "الملف يبقى على هذا الجهاز. لا مزامنة."));
    var exp = h("button", "primary", "تصدير المساحة");
    exp.addEventListener("click", exportWs);
    var imp = h("button", "", "استعادة المساحة");
    var file = h("input"); file.type = "file"; file.accept = "application/json,.json"; file.hidden = true;
    file.addEventListener("change", function () { if (file.files && file.files[0]) readFile(file.files[0], "workspace"); file.value = ""; });
    imp.addEventListener("click", function () { file.click(); });
    var snapBtn = h("button", "", "استيراد اللقطة");
    var snapFile = h("input"); snapFile.type = "file"; snapFile.accept = "application/json,.json"; snapFile.hidden = true;
    snapFile.addEventListener("change", function () { if (snapFile.files && snapFile.files[0]) readFile(snapFile.files[0], "snapshot"); snapFile.value = ""; });
    snapBtn.addEventListener("click", function () { snapFile.click(); });
    var acts = h("div", "actions");
    acts.appendChild(exp); acts.appendChild(imp); acts.appendChild(snapBtn); acts.appendChild(file); acts.appendChild(snapFile);
    box.appendChild(acts);
    pages.appendChild(box);
    var clear = h("button", "", "مسح المساحة");
    clear.addEventListener("click", function () {
      confirmAsk("مسح مشاريعك المحلية؟ المرجع لا يتأثر.", function () {
        writeWs(emptyWs());
        localStorage.removeItem(DRAFT_KEY);
        note("المساحة فارغة");
        draw();
      });
    });
    pages.appendChild(clear);
    var preview = h("button", "jump", "معاينة المقر التجريبي");
    preview.addEventListener("click", function () { location.href = "public/index.html"; });
    pages.appendChild(preview);
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
        var next = validSnap(parsed);
        if (!next) return note("لقطة غير صالحة");
        confirmAsk("استبدال مرجع اللقطة؟ مساحتك لا تتغير. الوقت: " + when(next.generatedAt), function () {
          localStorage.setItem(SNAP_KEY, JSON.stringify(next));
          snap = next;
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
  var stored = readSnap();
  if (stored) { snap = stored; draw(); }
  else loadSample(draw);
})();
