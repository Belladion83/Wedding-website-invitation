(function(){
  // v1.12: real global cloud sync + Google Drive image display normalization.
  // Draft remains local for admin preview only. Public site prioritizes Google Sheet config and ignores device-specific local saved data when a Web App URL is configured.
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

  const getDriveFileId = (value) => {
    const s = String(value || '').trim();
    if (!s) return '';
    let m = s.match(/\/file\/d\/([^/?#]+)/);
    if (m) return m[1];
    try {
      const u = new URL(s);
      if (u.hostname.includes('drive.google.com')) {
        const id = u.searchParams.get('id') || '';
        if (id) return id;
      }
      if (u.hostname.includes('googleusercontent.com')) {
        m = s.match(/\/d\/([-\w]{20,})/);
        if (m) return m[1];
      }
    } catch(e) {}
    m = s.match(/(?:id=|\/d\/)([-\w]{20,})/);
    return m ? m[1] : '';
  };
  const toDriveShareUrl = (value) => {
    const id = getDriveFileId(value);
    return id ? 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view?usp=sharing' : String(value || '').trim();
  };
  const normalizeImageUrl = (value) => {
    const s = String(value || '').trim();
    if (!s) return '';
    if (s.startsWith('data:') || s.startsWith('assets/') || s.startsWith('./') || s.startsWith('../')) return s;
    const id = getDriveFileId(s);
    if (id) return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w2000';
    return s;
  };
  const driveImageCandidates = (value) => {
    const s = String(value || '').trim();
    if (!s) return [];
    if (s.startsWith('data:') || s.startsWith('assets/') || s.startsWith('./') || s.startsWith('../')) return [s];
    const id = getDriveFileId(s);
    if (!id) return [s];
    return [
      'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w2000',
      'https://lh3.googleusercontent.com/d/' + encodeURIComponent(id) + '=w2000',
      'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(id),
      toDriveShareUrl(s)
    ];
  };
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
  const clearAllLocal = () => { removeKey(DRAFT_KEY); removeKey(LIVE_KEY); removeKey(LEGACY_KEY); removeKey('wedding_rsvp'); removeKey('wedding_rsvp_records'); };
  const getScriptUrl = (cfg) => (cfg && cfg.googleAppsScriptUrl) || (window.DEFAULT_WEDDING_CONFIG && window.DEFAULT_WEDDING_CONFIG.googleAppsScriptUrl) || '';
  const hasMeaningfulConfig = (cfg) => cfg && typeof cfg === 'object' && Object.keys(cfg).length > 0;

  const jsonp = (url, action='getConfig', extra={}) => new Promise((resolve, reject) => {
    if (!url) return reject(new Error('Missing Google Apps Script URL'));
    const cb = 'weddingJsonp_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const sep = url.includes('?') ? '&' : '?';
    window[cb] = (data) => { cleanup(); resolve(data); };
    const cleanup = () => { delete window[cb]; script.remove(); clearTimeout(timer); };
    script.onerror = () => { cleanup(); reject(new Error('JSONP failed. Kiểm tra Web App URL / quyền Anyone.')) };
    const pairs = Object.entries(extra || {}).map(([k,v]) => '&' + encodeURIComponent(k) + '=' + encodeURIComponent(v == null ? '' : v)).join('');
    script.src = url + sep + 'action=' + encodeURIComponent(action) + '&callback=' + encodeURIComponent(cb) + pairs + '&_=' + Date.now();
    document.head.appendChild(script);
    const timer = setTimeout(() => { if(window[cb]) { cleanup(); reject(new Error('JSONP timeout. Apps Script chưa phản hồi.')) } }, 15000);
  });

  const postForm = (url, fields={}) => new Promise((resolve, reject) => {
    if (!url) return reject(new Error('Missing Google Apps Script URL'));
    const requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const frameName = 'weddingPostFrame_' + requestId;
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
    add('requestId', requestId);
    Object.entries(fields || {}).forEach(([k,v]) => add(k, v));
    const cleanup = () => { window.removeEventListener('message', handler); iframe.remove(); form.remove(); clearTimeout(timer); };
    const handler = (event) => {
      const data = event.data || {};
      if (!data || data.source !== 'wedding-apps-script' || data.requestId !== requestId) return;
      cleanup();
      if (data.ok) resolve(data);
      else reject(new Error(data.error || 'Cloud save failed'));
    };
    const timer = setTimeout(() => { cleanup(); reject(new Error('Cloud save timeout. Kiểm tra Apps Script đã deploy Web app và quyền Anyone.')) }, 120000);
    window.addEventListener('message', handler);
    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();
  });

  // Backward compatibility; use postForm in new code because it can confirm success.
  const postNoCors = async (url, payload) => {
    if (!url) throw new Error('Missing Google Apps Script URL');
    const fields = { action: payload.action || '', payloadJson: JSON.stringify(payload || {}) };
    if (payload.action === 'saveConfig') {
      fields.password = payload.password || '';
      fields.configJson = JSON.stringify(payload.config || {});
    }
    return postForm(url, fields);
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
    const data = await postForm(url, {
      action: 'uploadImage',
      uploadId: 'upload_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      password: password || '',
      fieldPath: fieldPath || '',
      filename: file.name || ('image-' + Date.now()),
      mimeType: file.type || 'image/png',
      dataUrl
    });
    // Store a normal Google Drive share link, because users can manually paste this form and it previews reliably.
    // Keep previewUrl/candidates for immediate Admin preview right after upload.
    if (data) {
      const sourceUrl = data.driveUrl || data.viewUrl || data.url || data.downloadUrl || data.altUrl || '';
      data.storedUrl = toDriveShareUrl(sourceUrl);
      data.previewUrl = normalizeImageUrl(sourceUrl);
      data.candidates = driveImageCandidates(sourceUrl);
      data.url = data.storedUrl;
    }
    return data;
  };

  const loadConfig = async (opts={}) => {
    const cfg = getDefault();
    const url = getScriptUrl(cfg);
    let remoteLoaded = false;
    if (url) {
      try {
        const remote = await jsonp(url, 'getConfig');
        if (remote && remote.ok && hasMeaningfulConfig(remote.config)) {
          deepMerge(cfg, remote.config);
          remoteLoaded = true;
        }
        cfg.googleAppsScriptUrl = cfg.googleAppsScriptUrl || url;
      } catch(e) {
        console.warn('Remote config unavailable, using default config. Local device data is ignored to keep all devices consistent.', e);
      }
    }
    // Only use local LIVE fallback when no cloud URL exists. This avoids every device showing a different live version.
    if (!url && !remoteLoaded) {
      const live = getLive();
      if (live) deepMerge(cfg, live);
    }
    if (opts.includeDraft) {
      const draft = getDraft();
      if (draft) deepMerge(cfg, draft);
    }
    return cfg;
  };

  window.WeddingCMS = { DRAFT_KEY, LIVE_KEY, LEGACY_KEY, getDefault, getDraft, getLive, saveDraft, saveLive, clearDraft, clearLive, clearAllLocal, deepMerge, loadConfig, jsonp, postForm, postNoCors, uploadImage, readFileDataUrl, getScriptUrl, normalizeImageUrl, getDriveFileId, toDriveShareUrl, driveImageCandidates,
    getLocal:getDraft, saveLocal:saveDraft, clearLocal:clearDraft };
})();
