(function(){
  // v1.9: central sync support.
  // Draft remains local for admin preview only. Published data should be saved to Google Sheet/Apps Script.
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
  const getScriptUrl = (cfg) => (cfg && cfg.googleAppsScriptUrl) || (window.DEFAULT_WEDDING_CONFIG && window.DEFAULT_WEDDING_CONFIG.googleAppsScriptUrl) || '';
  const jsonp = (url, action='getConfig', extra={}) => new Promise((resolve, reject) => {
    if (!url) return reject(new Error('Missing Google Apps Script URL'));
    const cb = 'weddingJsonp_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const sep = url.includes('?') ? '&' : '?';
    window[cb] = (data) => { cleanup(); resolve(data); };
    const cleanup = () => { delete window[cb]; script.remove(); };
    script.onerror = () => { cleanup(); reject(new Error('JSONP failed')); };
    const pairs = Object.entries(extra || {}).map(([k,v]) => '&' + encodeURIComponent(k) + '=' + encodeURIComponent(v == null ? '' : v)).join('');
    script.src = url + sep + 'action=' + encodeURIComponent(action) + '&callback=' + encodeURIComponent(cb) + pairs + '&_=' + Date.now();
    document.head.appendChild(script);
    setTimeout(() => { if(window[cb]) { cleanup(); reject(new Error('JSONP timeout')); } }, 10000);
  });
  const postNoCors = async (url, payload) => {
    if (!url) throw new Error('Missing Google Apps Script URL');
    await fetch(url, { method:'POST', mode:'no-cors', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
    return true;
  };
  const readFileDataUrl = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const uploadImage = async (url, password, file, fieldPath='') => {
    if (!url) throw new Error('Missing Google Apps Script URL');
    if (!file) throw new Error('Missing file');
    const dataUrl = await readFileDataUrl(file);
    return new Promise((resolve, reject) => {
      const uploadId = 'upload_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      const frameName = 'weddingUploadFrame_' + uploadId;
      const iframe = document.createElement('iframe');
      iframe.name = frameName;
      iframe.style.display = 'none';
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.target = frameName;
      form.style.display = 'none';
      const add = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value == null ? '' : String(value);
        form.appendChild(input);
      };
      add('action', 'uploadImage');
      add('uploadId', uploadId);
      add('password', password || '');
      add('fieldPath', fieldPath || '');
      add('filename', file.name || ('image-' + Date.now()));
      add('mimeType', file.type || 'image/png');
      add('dataUrl', dataUrl);
      const cleanup = () => { window.removeEventListener('message', handler); iframe.remove(); form.remove(); clearTimeout(timer); };
      const handler = (event) => {
        const data = event.data || {};
        if (!data || data.source !== 'wedding-apps-script-upload' || data.uploadId !== uploadId) return;
        cleanup();
        if (data.ok && data.url) resolve(data);
        else reject(new Error(data.error || 'Upload failed'));
      };
      const timer = setTimeout(() => { cleanup(); reject(new Error('Upload timeout')); }, 120000);
      window.addEventListener('message', handler);
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      form.submit();
    });
  };
  const loadConfig = async (opts={}) => {
    const cfg = getDefault();
    const live = getLive();
    if (live) deepMerge(cfg, live);
    const url = getScriptUrl(cfg);
    if (url) {
      try {
        const remote = await jsonp(url, 'getConfig');
        if (remote && remote.ok && remote.config) {
          deepMerge(cfg, remote.config);
          cfg.googleAppsScriptUrl = cfg.googleAppsScriptUrl || url;
        }
      } catch(e) { console.warn('Remote config unavailable, using local/default config.', e); }
    }
    if (opts.includeDraft) {
      const draft = getDraft();
      if (draft) deepMerge(cfg, draft);
    }
    return cfg;
  };
  window.WeddingCMS = { DRAFT_KEY, LIVE_KEY, LEGACY_KEY, getDefault, getDraft, getLive, saveDraft, saveLive, clearDraft, clearLive, clearAllLocal, deepMerge, loadConfig, jsonp, postNoCors, uploadImage, readFileDataUrl, getScriptUrl,
    getLocal:getDraft, saveLocal:saveDraft, clearLocal:clearDraft };
})();
