(function(){
  // v1.8 separates draft config from published/live config.
  // "Lưu bản nháp" writes only DRAFT_KEY and is used only inside admin.
  // The public invitation reads published config or Google Sheet, never draft config.
  const DRAFT_KEY = 'wedding_cms_draft_config_v1';
  const LIVE_KEY = 'wedding_cms_live_config_v1';
  const LEGACY_KEY = 'wedding_cms_config_v1';
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
  const readKey = (key) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch(e){ return null; } };
  const writeKey = (key, cfg) => localStorage.setItem(key, JSON.stringify(cfg));
  const removeKey = (key) => localStorage.removeItem(key);
  const getDefault = () => clone(window.DEFAULT_WEDDING_CONFIG || {});
  const getDraft = () => readKey(DRAFT_KEY);
  const getLive = () => readKey(LIVE_KEY) || readKey(LEGACY_KEY);
  const saveDraft = (cfg) => writeKey(DRAFT_KEY, cfg);
  const saveLive = (cfg) => { writeKey(LIVE_KEY, cfg); removeKey(LEGACY_KEY); };
  const clearDraft = () => removeKey(DRAFT_KEY);
  const clearLive = () => removeKey(LIVE_KEY);
  const clearAllLocal = () => { removeKey(DRAFT_KEY); removeKey(LIVE_KEY); removeKey(LEGACY_KEY); };
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
  const loadConfig = async (opts={}) => {
    const cfg = getDefault();
    const live = getLive();
    if (live) deepMerge(cfg, live);
    const url = cfg.googleAppsScriptUrl || (window.DEFAULT_WEDDING_CONFIG && window.DEFAULT_WEDDING_CONFIG.googleAppsScriptUrl);
    if (url) {
      try {
        const remote = await jsonp(url, 'getConfig');
        if (remote && remote.ok && remote.config) deepMerge(cfg, remote.config);
      } catch(e) { console.warn('Remote config unavailable, using local/default config.', e); }
    }
    if (opts.includeDraft) {
      const draft = getDraft();
      if (draft) deepMerge(cfg, draft);
    }
    return cfg;
  };
  // Backward-compatible aliases used by older admin code.
  window.WeddingCMS = { DRAFT_KEY, LIVE_KEY, LEGACY_KEY, getDefault, getDraft, getLive, saveDraft, saveLive, clearDraft, clearLive, clearAllLocal, deepMerge, loadConfig, jsonp, postNoCors,
    getLocal:getDraft, saveLocal:saveDraft, clearLocal:clearDraft };
})();
