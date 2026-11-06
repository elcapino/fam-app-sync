/* Demo House — public obfuscated twin. Generic massing only. Not a real design. */
(function () {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const noteEl = document.getElementById('note');
  const panelEl = document.getElementById('panel');
  const pName = document.getElementById('pName');
  const pMeta = document.getElementById('pMeta');

  let mode = 'structural';
  let cutTop = false;
  let showLabels = true;
  let yaw = 0.58;
  let tilt = 0.62;
  let scale = 11.25;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  /* Invented demo massing (abstract units). Not a real footprint or proportion. */
  const MAIN = { x: 0, y: 0, w: 44, d: 60, z0: 0, z1: 40 };
  const WING = { x: 44, y: 12.75, w: 22, d: 36, z0: 0, z1: 40 };
  const UPPER = { x: 7.25, y: 11.25, w: 36, d: 40, z0: 40, z1: 70 };

  function space(id, label, x, y, w, d, storey) {
    return { id: id, label: label, x: x, y: y, w: w, d: d, storey: storey };
  }
  const SPACES = [
    space('a', 'فراغ تجريبي', 7.25, 11.25, 17, 17, 0),
    space('b', 'فراغ أ', 29, 11.25, 13, 21, 0),
    space('c', 'فراغ ب', 7.25, 36, 21, 17, 0),
    space('d', 'فراغ ج', 46, 17, 17, 21, 0),
    space('e', 'فراغ تجريبي', 11.25, 17, 21, 21, 1),
    space('f', 'فراغ أ', 36, 17, 13, 17, 1),
  ];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function project(x, y, z) {
    const cx = MAIN.w * 0.5 + 7.25;
    const cy = MAIN.d * 0.5;
    const dx = x - cx;
    const dy = y - cy;
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    const xr = dx * cos - dy * sin;
    const yr = dx * sin + dy * cos;
    const X = innerWidth * 0.5 + (xr - yr) * scale * 0.55;
    const Y = innerHeight * 0.58 - (xr + yr) * scale * 0.28 * tilt - z * scale * 0.42;
    return { X: X, Y: Y };
  }

  function strokeQuad(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, stroke, fill, alpha) {
    const p0 = project(ax, ay, az);
    const p1 = project(bx, by, bz);
    const p2 = project(cx, cy, cz);
    const p3 = project(dx, dy, dz);
    ctx.beginPath();
    ctx.moveTo(p0.X, p0.Y);
    ctx.lineTo(p1.X, p1.Y);
    ctx.lineTo(p2.X, p2.Y);
    ctx.lineTo(p3.X, p3.Y);
    ctx.closePath();
    if (fill) {
      ctx.globalAlpha = alpha == null ? 1 : alpha;
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  function drawBox(b, fill, stroke, alpha) {
    const x0 = b.x;
    const y0 = b.y;
    const x1 = b.x + b.w;
    const y1 = b.y + b.d;
    const z0 = b.z0;
    const z1 = b.z1;
    strokeQuad(x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1, stroke, fill, alpha);
    strokeQuad(x0, y1, z0, x1, y1, z0, x1, y1, z1, x0, y1, z1, stroke, fill, (alpha || 1) * 0.85);
    strokeQuad(x1, y0, z0, x1, y1, z0, x1, y1, z1, x1, y0, z1, stroke, fill, (alpha || 1) * 0.7);
  }

  function drawFrame() {
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#f2f4f8';
    ctx.globalAlpha = 0.9;
    const xs = [0, 11.25, 22, 33, 44, 55, 66];
    const ys = [0, 12.75, 24, 36, 48, 60];
    for (let i = 0; i < xs.length; i++) {
      for (let j = 0; j < ys.length; j++) {
        const x = xs[i];
        const y = ys[j];
        if (x > 44 && y < 12.75) continue;
        if (x > 44 && y > 48) continue;
        const a = project(x, y, 0);
        const b = project(x, y, 70);
        ctx.beginPath();
        ctx.moveTo(a.X, a.Y);
        ctx.lineTo(b.X, b.Y);
        ctx.stroke();
      }
    }
    function ring(z) {
      ctx.beginPath();
      const pts = [
        project(0, 0, z),
        project(44, 0, z),
        project(66, 12.75, z),
        project(66, 48, z),
        project(44, 60, z),
        project(0, 60, z),
        project(0, 0, z),
      ];
      for (let k = 0; k < pts.length; k++) {
        if (k === 0) ctx.moveTo(pts[k].X, pts[k].Y);
        else ctx.lineTo(pts[k].X, pts[k].Y);
      }
      ctx.stroke();
    }
    ring(40);
    ring(70);
    ctx.globalAlpha = 1;
  }

  function drawSchematic(kind) {
    const color = kind === 'elec' ? '#f0a020' : '#3a9bff';
    const z = kind === 'elec' ? 22 : 12.75;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([7.25, 4.25]);
    ctx.beginPath();
    const a = project(11.25, 11.25, z);
    const b = project(33, 11.25, z);
    const c = project(33, 40, z);
    const d = project(11.25, 40, z);
    ctx.moveTo(a.X, a.Y);
    ctx.lineTo(b.X, b.Y);
    ctx.lineTo(c.X, c.Y);
    ctx.lineTo(d.X, d.Y);
    ctx.lineTo(a.X, a.Y);
    ctx.stroke();
    const e = project(33, 24, z);
    const f = project(55, 24, z);
    const g = project(55, 36, z);
    ctx.beginPath();
    ctx.moveTo(e.X, e.Y);
    ctx.lineTo(f.X, f.Y);
    ctx.lineTo(g.X, g.Y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.font = '12px Tahoma,sans-serif';
    ctx.textAlign = 'center';
    const lab = project(33, 28, z + 8);
    ctx.fillText(kind === 'elec'
      ? 'كهرباء توضيحية — للعرض فقط'
      : 'سباكة توضيحية — للعرض فقط', lab.X, lab.Y);
    ctx.restore();
  }

  function drawLabels() {
    if (!showLabels) return;
    ctx.font = 'bold 13px Tahoma,sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < SPACES.length; i++) {
      const s = SPACES[i];
      if (cutTop && s.storey === 1) continue;
      const z = s.storey === 0 ? 22 : 55;
      const p = project(s.x + s.w * 0.5, s.y + s.d * 0.5, z);
      ctx.fillStyle = 'rgba(10,16,28,.82)';
      const tw = ctx.measureText(s.label).width + 14;
      ctx.fillRect(p.X - tw / 2, p.Y - 12, tw, 22);
      ctx.strokeStyle = 'rgba(110,180,255,.5)';
      ctx.strokeRect(p.X - tw / 2, p.Y - 12, tw, 22);
      ctx.fillStyle = '#e8eef8';
      ctx.fillText(s.label, p.X, p.Y + 4);
    }
  }

  function drawGround(finalMode) {
    const g = { x: -12.75, y: -12.75, w: 90, d: 90, z0: -2.25, z1: 0 };
    drawBox(g, finalMode ? '#d2b48c' : '#1a2233', finalMode ? '#b89968' : '#2a3548', 1);
    if (finalMode) {
      const pad = { x: -2.25, y: -2.25, w: 72, d: 72, z0: 0, z1: 1.25 };
      drawBox(pad, '#6f9e5a', '#5a8548', 1);
    }
  }

  function setNote(text, on) {
    noteEl.textContent = text || '';
    noteEl.classList.toggle('show', !!on);
  }

  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const finalMode = mode === 'final';
    const xray = mode !== 'final';

    ctx.fillStyle = finalMode ? '#b8d4ea' : '#0b1220';
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    drawGround(finalMode);

    const fill = finalMode ? '#e6dccb' : '#4aa8e8';
    const stroke = finalMode ? '#b9a88f' : '#9ad0ff';
    const alpha = finalMode ? 1 : 0.28;

    drawBox(MAIN, fill, stroke, alpha);
    drawBox(WING, fill, stroke, alpha);
    if (!cutTop) drawBox(UPPER, fill, stroke, alpha);

    if (xray) drawFrame();
    if (mode === 'electrical') drawSchematic('elec');
    if (mode === 'plumbing') drawSchematic('plumb');
    drawLabels();
  }

  function applyMode(next) {
    mode = next;
    document.querySelectorAll('.modes button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.mode === mode);
    });
    if (mode === 'structural') {
      setNote('عرض الهيكل التجريبي: كتل شفافة وإطار أبيض توضيحي — ليس تصميماً إنشائياً حقيقياً', true);
    } else if (mode === 'electrical') {
      setNote('طبقة الكهرباء: مسارات عامة توضيحية للعرض فقط — ليست مخططاً معتمداً', true);
    } else if (mode === 'plumbing') {
      setNote('طبقة السباكة: مسارات عامة توضيحية للعرض فقط — ليست مخططاً معتمداً', true);
    } else {
      setNote('الواجهة النهائية التجريبية · كتلة مموّهة مبسّطة', false);
    }
    draw();
  }

  document.querySelectorAll('.modes button').forEach(function (btn) {
    btn.addEventListener('click', function () { applyMode(btn.dataset.mode); });
  });
  document.getElementById('btnCut').addEventListener('click', function () {
    cutTop = !cutTop;
    document.getElementById('btnCut').classList.toggle('on', cutTop);
    draw();
  });
  document.getElementById('btnLabels').addEventListener('click', function () {
    showLabels = !showLabels;
    document.getElementById('btnLabels').classList.toggle('on', showLabels);
    draw();
  });

  canvas.addEventListener('pointerdown', function (ev) {
    dragging = true;
    lastX = ev.clientX;
    lastY = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
    let best = null;
    let bestD = 36;
    for (let i = 0; i < SPACES.length; i++) {
      const s = SPACES[i];
      if (cutTop && s.storey === 1) continue;
      const z = s.storey === 0 ? 22 : 55;
      const p = project(s.x + s.w * 0.5, s.y + s.d * 0.5, z);
      const dist = Math.hypot(p.X - ev.clientX, p.Y - ev.clientY);
      if (dist < bestD) { bestD = dist; best = s; }
    }
    if (best) {
      pName.textContent = best.label;
      pMeta.innerHTML = 'مستوى تجريبي: ' + (best.storey === 0 ? 'أرضي وهمي' : 'علوي وهمي') +
        '<br>الأبعاد المعروضة توضيحية فقط وغير مرتبطة بأي مخطط حقيقي' +
        '<br><span style="color:#e8a838">عرض تجريبي مموّه</span>';
      panelEl.classList.add('show');
    } else {
      panelEl.classList.remove('show');
    }
  });
  canvas.addEventListener('pointermove', function (ev) {
    if (!dragging) return;
    yaw += (ev.clientX - lastX) * 0.005;
    tilt = Math.max(0.4, Math.min(1.05, tilt - (ev.clientY - lastY) * 0.004));
    lastX = ev.clientX;
    lastY = ev.clientY;
    draw();
  });
  canvas.addEventListener('pointerup', function () { dragging = false; });
  canvas.addEventListener('wheel', function (ev) {
    ev.preventDefault();
    scale = Math.max(7.25, Math.min(22, scale - ev.deltaY * 0.01));
    draw();
  }, { passive: false });

  addEventListener('resize', resize);
  applyMode('structural');
  resize();
})();
