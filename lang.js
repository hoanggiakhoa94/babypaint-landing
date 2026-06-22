/* BabyPaint landing — VI/EN language switcher.
   Shows one language at a time (elements tagged .t-vi / .t-en),
   persists the choice in localStorage, and falls back to VI without JS. */
(function () {
  var KEY = 'bp-lang';
  var SUPPORTED = ['vi', 'en'];
  var root = document.documentElement;

  function pick(value) {
    return SUPPORTED.indexOf(value) !== -1 ? value : null;
  }

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (pick(saved)) return saved;
    var nav = (navigator.language || navigator.userLanguage || 'vi').toLowerCase();
    return nav.indexOf('vi') === 0 ? 'vi' : 'en';
  }

  function apply(lang) {
    lang = pick(lang) || 'vi';
    root.classList.remove('lang-vi', 'lang-en');
    root.classList.add('lang-' + lang);
    root.setAttribute('lang', lang);

    var title = root.getAttribute('data-title-' + lang);
    if (title) document.title = title;

    var desc = root.getAttribute('data-desc-' + lang);
    if (desc) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', desc);
    }

    var btns = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < btns.length; i++) {
      var active = btns[i].getAttribute('data-set-lang') === lang;
      btns[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }

    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function init() {
    apply(detect());
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('[data-set-lang]') : null;
      if (!btn) return;
      e.preventDefault();
      apply(btn.getAttribute('data-set-lang'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
