(function(){
  const LOCAL_KEY = 'wedding_cms_config_v1';
  const deepMerge = (target, source) => {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach(k => {
      if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
        target[k] = deepMerge(target[k] || {}, source[k]);
      } else {
        target[k] = source[k];
      }
    });
    return target;
  };
  const clone = (obj) => JSON.parse(JSON.stringify(obj || {}));
  const getDefault = () => clone(window.DEFAULT_WEDDING_CONFIG || {});
  const getLocal = () => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); } catch(e){ return null; }
  };
  const saveLocal = (cfg) => localStorage.setItem(LOCAL_KEY, JSON.stringify(cfg));
  const clearLocal = () => localStorage.removeItem(LOCAL_KEY);
  const jsonp = (url, action='getConfig') => new Promise((resolve, reject) => {
    if (!url) return reject(new Error('Missing Google Apps Script URL'));
    const cb = 'weddingJsonp_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const sep = url.includes('?') ? '&' : '?';
    window[cb] = (data) => { cleanup(); resolve(data); };
    const cleanup = () => { delete window[cb]; script.remove(); };
    script.onerror = () => { cleanup(); reject(new Error('JSONP failed')); };
    script.src = url + sep + 'action=' + encodeURIComponent(action) + '&callback=' + encodeURIComponent(cb) + '&_=' + Date.now();
    document.head.appendChild(script);
    setTimeout(() => { if(window[cb]) { cleanup(); reject(new Error('JSONP timeout')); } }, 8000);
  });
  const postNoCors = async (url, payload) => {
    if (!url) throw new Error('Missing Google Apps Script URL');
    await fetch(url, { method:'POST', mode:'no-cors', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
    return true;
  };
  const loadConfig = async () => {
    const cfg = getDefault();
    const local = getLocal();
    if (local) deepMerge(cfg, local);
    const url = cfg.googleAppsScriptUrl || (window.DEFAULT_WEDDING_CONFIG && window.DEFAULT_WEDDING_CONFIG.googleAppsScriptUrl);
    if (url) {
      try {
        const remote = await jsonp(url, 'getConfig');
        if (remote && remote.ok && remote.config) deepMerge(cfg, remote.config);
      } catch(e) { console.warn('Remote config unavailable, using local/default config.', e); }
    }
    return cfg;
  };
  window.WeddingCMS = { LOCAL_KEY, getDefault, getLocal, saveLocal, clearLocal, deepMerge, loadConfig, jsonp, postNoCors };
})();
