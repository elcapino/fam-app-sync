/* Android-only presentation. Does not change storage keys or the delivered web files. */
(function () {
  if (window.__hmkPolish) return;
  window.__hmkPolish = true;
  var style = document.createElement('style');
  style.textContent = [
    '#qa-banner{font:600 12px/1.35 Plex,system-ui!important;padding:6px 12px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    'body.restore header{flex-wrap:nowrap!important;height:54px!important;min-height:54px!important;padding-top:0!important}',
    '#mode{width:auto!important;margin-inline-start:auto!important}',
    '#mode button{min-height:36px!important;font:600 13px Plex,system-ui!important;padding:4px 8px!important}',
    '.restore-page{gap:0!important;padding-top:8px!important}',
    '.ws-limit{font:600 12px/1.45 Plex,system-ui!important;color:var(--mu)!important;padding:2px 2px 6px!important}',
    '.ws-note{font:13px/1.5 Plex,system-ui!important;padding:6px 2px!important}',
    '.ws-field{min-height:40px!important;padding:8px 2px!important;font-size:15px!important}',
    '#hmk-idea-toggle{width:100%;text-align:start;color:inherit;background:none;border:0;border-bottom:1px solid rgba(212,175,55,.28);min-height:48px;padding:8px 2px;display:flex;align-items:center;gap:8px;font:600 15px Plex,system-ui}',
    '.hmk-fold{display:none!important}',
    '.project-line{min-height:48px}'
  ].join('');
  document.head.appendChild(style);

  function mine() {
    var p = document.body.dataset.page || '';
    return p === 'ws' || p === 'wsProject';
  }
  function polish() {
    var banner = document.getElementById('qa-banner');
    if (banner) {
      var next = mine() ? 'مساحة محلية · بلا مزامنة' : 'بيانات تجريبية · Synthetic demo';
      if (banner.textContent !== next) banner.textContent = next;
    }
    var limits = document.querySelectorAll('.ws-limit');
    for (var i = 0; i < limits.length; i++) {
      var short = 'على هذا الجهاز فقط، بلا مزامنة.';
      if (limits[i].textContent !== short) limits[i].textContent = short;
      limits[i].hidden = i > 0;
    }
    var label = null;
    var labels = document.querySelectorAll('.ws-label');
    for (var j = 0; j < labels.length; j++) {
      if (labels[j].textContent.trim() === 'من فكرة إلى مسودة') label = labels[j];
    }
    if (!label || !label.parentNode) return;
    var open = document.body.dataset.hmkIdea === '1' || !!document.getElementById('ws-adopt') || !!document.getElementById('ws-adopt-yes');
    function hardStop(el) {
      if (!el || el === label) return false;
      if (el.id === 'ws-file' || el.id === 'hmk-idea-toggle') return true;
      if (el.classList && el.classList.contains('project-line')) return true;
      var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.indexOf('المساحة فارغة') === 0 || text === 'إضافة مشروع') return true;
      if (el.querySelector && el.querySelector('#ws-export')) return true;
      return false;
    }
    if (!document.getElementById('hmk-idea-toggle')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'hmk-idea-toggle';
      var strong = document.createElement('b');
      strong.textContent = 'مسودة من فكرة';
      strong.style.flex = '1';
      var hint = document.createElement('span');
      hint.className = 'mu';
      hint.textContent = 'قالب أولي';
      btn.appendChild(strong);
      btn.appendChild(hint);
      btn.addEventListener('click', function () {
        document.body.dataset.hmkIdea = document.body.dataset.hmkIdea === '1' ? '0' : '1';
        polish();
      });
      label.parentNode.insertBefore(btn, label);
    }
    var end = label;
    var scan = label.nextElementSibling;
    var guard = 0;
    while (scan && guard++ < 40 && !hardStop(scan)) {
      if (scan.querySelector && scan.querySelector('#ws-draft,#ws-adopt,#ws-adopt-yes')) end = scan;
      scan = scan.nextElementSibling;
    }
    var node = label;
    while (node) {
      if (node.id !== 'hmk-idea-toggle') node.classList.toggle('hmk-fold', !open);
      if (node === end) break;
      node = node.nextElementSibling;
    }
    var yes = document.getElementById('ws-adopt-yes');
    if (yes) {
      var box = yes.parentNode;
      if (box) box.classList.remove('hmk-fold');
      var note = box && box.previousElementSibling;
      if (note && note.classList && note.classList.contains('ws-note')) note.classList.remove('hmk-fold');
    }
  }
  var pages = document.getElementById('pages');
  if (pages) {
    new MutationObserver(function () { polish(); }).observe(pages, { childList: true, subtree: true });
  }
  polish();
})();
